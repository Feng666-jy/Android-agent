/**
 * Workflow Engine — Phase 4（T31）
 *
 * 线性执行器：按 steps 顺序执行，支持 {{input.xxx}} / {{steps.<id>.output}} 变量替换；
 * 任一步失败 → 中止并标记 failed；输出汇总到 output_json。
 * 依赖可注入（测试/运行时解耦）：executeTool / chat / writeMemory。
 */

import { prisma } from '../../prisma.js'
import { randomUUID } from 'node:crypto'
import { toolRouter } from '../agent-v2/tool-router.js'
import { llmService } from '../llm/index.js'
import { saveMemory } from '../memory/store.js'
import { recordUsage } from '../billing/usage.js'
import type { WorkflowDef, WorkflowRunContext, WorkflowRunRecord, WorkflowStep } from './types.js'
import type { MemoryKind } from '../memory/types.js'

/** 防止自递归：工作流步骤不允许再调用 run_workflow */
const FORBIDDEN_TOOLS = new Set(['run_workflow'])

/** 步骤超时（默认 60s） */
export const STEP_TIMEOUT_MS = 60_000

/**
 * 执行工作流（同步等待完成）。
 * 返回执行记录；状态同步写入 workflow_runs 表。
 */
export async function executeWorkflow(
  workflow: WorkflowDef,
  input: Record<string, unknown>,
  ctx: WorkflowRunContext = {}
): Promise<WorkflowRunRecord> {
  if (!workflow.enabled) throw new Error(`Workflow ${workflow.name} is disabled`)
  const userId = ctx.userId ?? workflow.userId
  const now = new Date().toISOString()
  const runId = randomUUID()
  const runRow: WorkflowRunRecord = {
    id: runId,
    workflowId: workflow.id,
    userId,
    status: 'running',
    input,
    startedAt: now,
    createdAt: now
  }
  void prisma.workflowRun
    .create({
      data: {
        id: runId,
        workflowId: workflow.id,
        userId,
        status: 'running',
        inputJson: JSON.stringify(input ?? {}),
        startedAt: new Date(),
        createdAt: new Date()
      }
    })
    .catch(() => undefined)

  const outputs: Record<string, unknown> = {}
  try {
    for (const step of workflow.steps) {
      if (ctx.signal?.aborted) throw new Error('Workflow cancelled')
      const output = await executeStep(step, workflow, input, outputs, ctx)
      outputs[step.id] = output
    }
    const record: WorkflowRunRecord = {
      ...runRow,
      status: 'completed',
      output: outputs,
      finishedAt: new Date().toISOString()
    }
    await prisma.workflowRun
      .updateMany({
        where: { id: runId, userId },
        data: {
          status: 'completed',
          outputJson: JSON.stringify(outputs),
          finishedAt: new Date()
        }
      })
      .catch(() => undefined)
    return record
  } catch (err) {
    const message = (err as Error)?.message ?? String(err)
    const record: WorkflowRunRecord = {
      ...runRow,
      status: 'failed',
      error: message,
      finishedAt: new Date().toISOString()
    }
    await prisma.workflowRun
      .updateMany({
        where: { id: runId, userId },
        data: { status: 'failed', error: message, finishedAt: new Date() }
      })
      .catch(() => undefined)
    return record
  }
}

/** 执行单个步骤 */
async function executeStep(
  step: WorkflowStep,
  workflow: WorkflowDef,
  input: Record<string, unknown>,
  outputs: Record<string, unknown>,
  ctx: WorkflowRunContext
): Promise<unknown> {
  switch (step.type) {
    case 'tool_call': {
      const tool = step.tool
      if (!tool) throw new Error(`Step ${step.id}: tool required`)
      if (FORBIDDEN_TOOLS.has(tool))
        throw new Error(`Step ${step.id}: tool ${tool} is not allowed in workflow`)
      const args = resolveVariables(step.args ?? {}, input, outputs)
      const execute =
        ctx.executeTool ?? ((name, a) => toolRouter.execute(name, a, { sandboxRoot: '/tmp' }))
      const result = await withTimeout(
        execute(tool, args),
        STEP_TIMEOUT_MS,
        `Step ${step.id} timed out`
      )
      if (!result.ok) throw new Error(`Step ${step.id} (${tool}) failed: ${result.output}`)
      return result.output
    }
    case 'llm_call': {
      const prompt = resolveString(step.prompt ?? '', input, outputs)
      if (!prompt.trim()) throw new Error(`Step ${step.id}: prompt required`)
      const chat = ctx.chat ?? defaultChat
      const modelId = step.args?.modelId ?? ctx.modelId
      if (!modelId) throw new Error(`Step ${step.id}: modelId required`)
      const content = await withTimeout(
        chat({ modelId: String(modelId), prompt }),
        STEP_TIMEOUT_MS,
        `Step ${step.id} timed out`
      )
      await recordUsage({
        userId: ctx.userId ?? workflow.userId,
        modelId: String(modelId),
        source: 'workflow',
        inputTokens: llmService.countTokens(prompt),
        outputTokens: llmService.countTokens(content)
      })
      return content
    }
    case 'memory_write': {
      if (!step.memory?.content) throw new Error(`Step ${step.id}: memory.content required`)
      const content = resolveString(step.memory.content, input, outputs)
      const summary = step.memory.summary
        ? resolveString(step.memory.summary, input, outputs)
        : undefined
      const kind: MemoryKind =
        step.memory.kind === 'episodic' ||
        step.memory.kind === 'semantic' ||
        step.memory.kind === 'preference'
          ? step.memory.kind
          : 'semantic'
      const write = ctx.writeMemory ?? (m => saveMemory(workflow.userId, m))
      await write({
        kind,
        content,
        summary,
        importance: step.memory.importance ?? 0.6,
        source: 'agent'
      })
      return { written: true }
    }
    default:
      throw new Error(`Step ${step.id}: unknown type ${(step as { type?: string }).type}`)
  }
}

/** 默认 LLM 调用：单轮 user 消息 */
async function defaultChat(input: { modelId: string; prompt: string }): Promise<string> {
  const response = await llmService.chat({
    modelId: input.modelId,
    messages: [{ role: 'user', content: input.prompt }]
  })
  return response.content ?? ''
}

// ---------------------------------------------------------------------------
// 变量解析
// ---------------------------------------------------------------------------

const VAR_RE = /\{\{\s*([\w.]+)\s*\}\}/g

function lookup(
  path: string,
  input: Record<string, unknown>,
  outputs: Record<string, unknown>
): unknown {
  const parts = path.split('.')
  if (parts[0] === 'input') {
    let value: unknown = input
    for (const part of parts.slice(1)) {
      if (value === null || value === undefined || typeof value !== 'object') return undefined
      value = (value as Record<string, unknown>)[part]
    }
    return value
  }
  if (parts[0] === 'steps') {
    // steps.<stepId> 直接是上一步输出；{{steps.s1.output}} 兼容：值非对象时直接返回
    const stepId = parts[1]
    let value: unknown = outputs[stepId]
    if (value === undefined) return undefined
    for (const part of parts.slice(2)) {
      if (value === null || typeof value !== 'object') return value
      value = (value as Record<string, unknown>)[part]
    }
    return value
  }
  return undefined
}

function resolveString(
  template: string,
  input: Record<string, unknown>,
  outputs: Record<string, unknown>
): string {
  return template.replace(VAR_RE, (_m, path: string) => {
    const value = lookup(path, input, outputs)
    return value === undefined || value === null ? '' : String(value)
  })
}

function resolveVariables(
  args: Record<string, unknown>,
  input: Record<string, unknown>,
  outputs: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(args ?? {})) {
    out[key] = typeof value === 'string' ? resolveString(value, input, outputs) : value
  }
  return out
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms)
    promise.then(
      v => {
        clearTimeout(timer)
        resolve(v)
      },
      e => {
        clearTimeout(timer)
        reject(e)
      }
    )
  })
}
