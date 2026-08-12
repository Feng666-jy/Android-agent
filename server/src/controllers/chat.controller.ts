/**
 * Chat 控制器 — 薄控制器
 * 只做 HTTP 解析/SSE 输出，业务全在 services/llm。
 */

import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { llmService } from '../services/llm/index.js'
import {
  LlmAuthError,
  LlmError,
  LlmUnreachableError,
  LlmValidationError
} from '../services/llm/index.js'
import { success, fail } from '../utils/response.js'
import { logger } from '../utils/logger.js'
import { checkQuota, recordUsage } from '../services/billing/index.js'
import { BillingQuotaError } from '../services/billing/types.js'

export const chatCompletionsSchema = z.object({
  modelId: z.string().min(1).optional(),
  providerId: z.string().min(1).optional(),
  modelName: z.string().min(1).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant', 'tool']),
        content: z.string().nullable().default(null),
        name: z.string().optional(),
        toolCalls: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              arguments: z.record(z.unknown())
            })
          )
          .optional(),
        toolCallId: z.string().optional()
      })
    )
    .min(1, 'messages must not be empty'),
  temperature: z.number().min(0).max(2).optional(),
  maxOutputTokens: z.number().int().positive().optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  tools: z
    .array(
      z.object({
        type: z.literal('function').optional().default('function'),
        function: z.object({
          name: z.string().min(1),
          description: z.string(),
          parameters: z.record(z.unknown())
        })
      })
    )
    .optional(),
  stream: z.boolean().optional().default(false)
})

type ChatBody = z.infer<typeof chatCompletionsSchema>

function mapLlmError(res: Response, err: unknown, next: NextFunction): void {
  if (err instanceof LlmAuthError) {
    fail(res, err.message, err.code, 502)
    return
  }
  if (err instanceof LlmUnreachableError) {
    fail(res, err.message, err.code, 502)
    return
  }
  if (err instanceof LlmValidationError) {
    fail(res, err.message, err.code)
    return
  }
  if (err instanceof LlmError) {
    fail(res, err.message, err.code, 502)
    return
  }
  next(err)
}

function handleNonStream(
  body: ChatBody,
  res: Response,
  next: NextFunction,
  userId?: number
): Promise<void> {
  const { modelId, providerId, modelName, messages, ...rest } = body
  return llmService
    .chat({
      modelId,
      providerId,
      modelName,
      messages,
      temperature: rest.temperature,
      maxOutputTokens: rest.maxOutputTokens,
      topP: rest.topP,
      frequencyPenalty: rest.frequencyPenalty,
      presencePenalty: rest.presencePenalty,
      tools: rest.tools
    })
    .then(response => {
      success(res, response)
      if (userId !== undefined) {
        void recordUsage({
          userId,
          modelId:
            body.modelId ??
            (body.providerId && body.modelName
              ? `${body.providerId}:${body.modelName}`
              : undefined),
          source: 'chat',
          inputTokens: response.usage?.inputTokens ?? 0,
          outputTokens: response.usage?.outputTokens ?? 0,
          cachedTokens: response.usage?.cachedTokens ?? 0
        })
      }
    })
    .catch(err => mapLlmError(res, err, next))
}

function handleStream(body: ChatBody, res: Response, req: Request, next: NextFunction): void {
  const { modelId, providerId, modelName, messages, ...rest } = body

  // SSE 头
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  const abort = new AbortController()
  res.on('close', () => {
    // 仅在客户端提前断开时中断上游流，正常结束（writableEnded）不 abort
    if (!res.writableEnded) abort.abort()
  })

  const send = (data: unknown): void => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  const run = async (): Promise<void> => {
    try {
      const stream = llmService.stream({
        modelId,
        providerId,
        modelName,
        messages,
        temperature: rest.temperature,
        maxOutputTokens: rest.maxOutputTokens,
        topP: rest.topP,
        frequencyPenalty: rest.frequencyPenalty,
        presencePenalty: rest.presencePenalty,
        tools: rest.tools,
        stream: true,
        signal: abort.signal
      })
      for await (const evt of stream) {
        if (abort.signal.aborted) break
        if (evt.type === 'done' && evt.usage && req.user?.userId !== undefined) {
          void recordUsage({
            userId: req.user.userId,
            modelId:
              body.modelId ??
              (body.providerId && body.modelName
                ? `${body.providerId}:${body.modelName}`
                : undefined),
            source: 'chat',
            inputTokens: evt.usage.inputTokens ?? 0,
            outputTokens: evt.usage.outputTokens ?? 0,
            cachedTokens: evt.usage.cachedTokens ?? 0
          })
        }
        send(evt)
      }
      res.write('data: [DONE]\n\n')
      res.end()
    } catch (err) {
      logger.error(`[chat] stream failed: ${(err as Error).message}`)
      if (!res.headersSent) {
        mapLlmError(res, err, next)
        return
      }
      send({ type: 'error', message: (err as Error).message })
      res.end()
    }
  }

  run()
}

export const chatController = {
  async completions(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body as ChatBody
    // Phase 5（T36）：配额检查（无订阅不限制；超限 402）
    try {
      if (req.user?.userId !== undefined) await checkQuota(req.user.userId)
    } catch (err) {
      if (err instanceof BillingQuotaError) {
        fail(res, err.message, 4020, err.statusCode)
        return
      }
      next(err)
      return
    }
    if (body.stream) {
      handleStream(body, res, req, next)
      return
    }
    handleNonStream(body, res, next, req.user?.userId)
  }
}

export { handleNonStream, handleStream }
