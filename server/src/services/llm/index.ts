/**
 * LLM Adapter — 统一服务入口（深度模块）
 *
 * 对外小接口：chat / stream / countTokens / resolveTarget
 * 内部大量实现：从 DB 解析 Provider/Model 配置、协议工厂分发、错误归一。
 *
 * 配置来源（与 CONTEXT.md 一致）：
 * - Provider 行：baseUrl / protocol / apiKeyEncrypted / authType / metadata(customHeaders, timeoutMs)
 * - Model 行：modelName / temperature / maxOutputTokens / topP / customHeaders / customParams
 * - 请求可覆盖 temperature / maxOutputTokens 等（显式传入优先）
 */

import { prisma } from "../../prisma.js";
import { logger } from "../../utils/logger.js";
import { BaseHandler, parseJsonField } from "./base.js";
import { LlmValidationError } from "./errors.js";
import { getHandler } from "./factory.js";
import { estimateTokens } from "./base.js";
import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ChatStreamEvent,
  ModelConfig,
  ProviderConfig,
  ToolDefinition,
} from "./types.js";

export interface ChatCompletionsInput {
  /** 二选一：直接指定 modelId */
  modelId?: string;
  /** 或指定 providerId + modelName */
  providerId?: string;
  modelName?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  tools?: ToolDefinition[];
  stream?: boolean;
  signal?: AbortSignal;
}

export interface ResolvedTarget {
  provider: ProviderConfig;
  model: ModelConfig;
  handler: BaseHandler;
}

/** 从 DB 解析 Model + Provider 配置（唯一取数入口） */
async function resolveTarget(input: Pick<ChatCompletionsInput, "modelId" | "providerId" | "modelName">): Promise<ResolvedTarget> {
  let modelRow: any = null;

  if (input.modelId) {
    modelRow = await prisma.model.findUnique({ where: { id: input.modelId } });
  } else if (input.providerId && input.modelName) {
    modelRow = await prisma.model.findFirst({
      where: { providerId: input.providerId, modelName: input.modelName, isEnabled: true },
    });
  }

  if (!modelRow) {
    throw new LlmValidationError("Model not found");
  }

  const providerRow = await prisma.provider.findUnique({ where: { id: modelRow.providerId } });
  if (!providerRow) {
    throw new LlmValidationError(`Provider not found for model: ${modelRow.modelName}`);
  }
  if (!providerRow.isEnabled) {
    throw new LlmValidationError(`Provider is disabled: ${providerRow.name}`);
  }

  const providerMeta = parseJsonField<Record<string, any>>(providerRow.metadata, {});
  const modelHeaders = parseJsonField<Record<string, string>>(modelRow.customHeaders, {});
  const modelParams = parseJsonField<Record<string, unknown>>(modelRow.customParams, {});

  const provider: ProviderConfig = {
    providerId: providerRow.id,
    baseUrl: providerRow.baseUrl,
    protocol: providerRow.protocol,
    apiKey: providerRow.apiKeyEncrypted ?? undefined,
    authType: providerRow.authType,
    customHeaders: providerMeta.customHeaders as Record<string, string> | undefined,
    timeoutMs: typeof providerMeta.timeoutMs === "number" ? providerMeta.timeoutMs : undefined,
  };

  const model: ModelConfig = {
    modelId: modelRow.id,
    modelName: modelRow.modelName,
    temperature: modelRow.temperature,
    maxOutputTokens: modelRow.maxOutputTokens,
    topP: modelRow.topP,
    frequencyPenalty: modelRow.frequencyPenalty,
    presencePenalty: modelRow.presencePenalty,
    contextWindow: modelRow.contextWindow,
    customHeaders: modelHeaders,
    customParams: modelParams,
  };

  const handler = getHandler(provider.protocol);
  return { provider, model, handler };
}

function buildChatRequest(input: ChatCompletionsInput, target: ResolvedTarget): ChatRequest {
  // customParams 合并进请求体顶层（OpenAI 兼容端点常用，如 response_format / seed）
  return {
    ...(target.model.customParams ?? {}),
    model: target.model.modelName,
    messages: input.messages,
    temperature: input.temperature ?? target.model.temperature,
    maxOutputTokens: input.maxOutputTokens ?? target.model.maxOutputTokens,
    topP: input.topP ?? target.model.topP,
    frequencyPenalty: input.frequencyPenalty ?? target.model.frequencyPenalty,
    presencePenalty: input.presencePenalty ?? target.model.presencePenalty,
    tools: input.tools,
    stream: input.stream,
    signal: input.signal,
  };
}

export const llmService = {
  /** 非流式对话 */
  async chat(input: ChatCompletionsInput): Promise<ChatResponse> {
    const target = await resolveTarget(input);
    const request = buildChatRequest(input, target);
    const started = Date.now();
    try {
      const response = await target.handler.chat(target.provider, request);
      const durationMs = Date.now() - started;
      logger.info(
        `[llm] chat ${target.provider.protocol} ${target.model.modelName} ` +
          `${response.usage ? `${response.usage.totalTokens} tokens` : ""} (${durationMs}ms)`
      );
      return response;
    } catch (err) {
      logger.error(`[llm] chat failed: ${(err as Error).message}`);
      throw err;
    }
  },

  /** 流式对话：产出统一 ChatStreamEvent */
  async *stream(input: ChatCompletionsInput): AsyncIterable<ChatStreamEvent> {
    const target = await resolveTarget(input);
    const request = buildChatRequest(input, target);
    for await (const evt of target.handler.stream(target.provider, request)) {
      yield evt;
    }
  },

  /** token 估算（用于预算控制，非精确计数） */
  countTokens(text: string): number {
    return estimateTokens(text);
  },

  /** 暴露解析结果，供 agent 层 / 调试复用 */
  async resolveTarget(input: Pick<ChatCompletionsInput, "modelId" | "providerId" | "modelName">): Promise<ResolvedTarget> {
    return resolveTarget(input);
  },
};

export { resolveTarget, buildChatRequest };
export * from "./types.js";
export * from "./errors.js";
export { getHandler, listSupportedProtocols } from "./factory.js";
