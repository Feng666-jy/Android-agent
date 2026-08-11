/**
 * LLM Adapter — 协议 handler 基类与共享基建
 *
 * 设计原则：
 * - fetch 可注入（测试用 mock；未来 APK 内嵌/自定义传输层可替换，不需改 handler）
 * - 所有协议走同一套 chat/stream 编排，协议差异收敛到 4 个纯方法：
 *     buildUrl / buildBody / buildHeaders / parseResponse
 *   + 流式逐行解析 parseStreamLine
 */

import type { ChatRequest, ChatResponse, ChatStreamEvent, ProviderConfig, TokenUsage, ToolCall } from "./types.js";
import { LlmUnreachableError, mapHttpError } from "./errors.js";

export interface ParsedStreamLine {
  events?: ChatStreamEvent[];
  /** true 表示流结束 */
  done?: boolean;
}

export interface StreamAccumulator {
  content: string;
  toolCalls: ToolCall[];
  usage?: TokenUsage;
  finishReason?: string;
}

export interface LlmHandler {
  readonly protocol: string;
  buildUrl(config: ProviderConfig, model: string): string;
  buildBody(req: ChatRequest): Record<string, unknown>;
  buildHeaders(config: ProviderConfig): Record<string, string>;
  parseResponse(body: unknown): ChatResponse;
  /** 解析一行的返回；line 已去尾随空白 */
  parseStreamLine(line: string, acc: StreamAccumulator): ParsedStreamLine;
}

const DEFAULT_TIMEOUT_MS = 60_000;

/** 按字符串构建统一 ToolCall（各协议 arguments 可能是字符串或对象） */
export function normalizeToolCall(raw: unknown, fallbackId: string): ToolCall | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, any>;
  const name = r.name ?? r.functionName;
  if (typeof name !== "string" || !name) return null;
  let args: Record<string, unknown> = {};
  const rawArgs = r.arguments ?? r.args ?? r.input ?? {};
  if (typeof rawArgs === "string") {
    try {
      args = JSON.parse(rawArgs || "{}");
    } catch {
      args = {};
    }
  } else if (rawArgs && typeof rawArgs === "object") {
    args = rawArgs as Record<string, unknown>;
  }
  const id = typeof r.id === "string" && r.id ? r.id : `${fallbackId}_${name}`;
  return { id, name, arguments: args };
}

/** 粗略 token 估算：ASCII 约 4 字符/token，CJK 约 1 字符/token */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  let tokens = 0;
  for (const ch of text) {
    tokens += ch.charCodeAt(0) > 0xff ? 1 : 0.25;
  }
  return Math.max(1, Math.ceil(tokens));
}

export abstract class BaseHandler implements LlmHandler {
  abstract readonly protocol: string;

  protected fetchImpl: typeof fetch;

  constructor(fetchImpl: typeof fetch = globalThis.fetch) {
    this.fetchImpl = fetchImpl;
  }

  abstract buildUrl(config: ProviderConfig, model: string): string;
  abstract buildBody(req: ChatRequest): Record<string, unknown>;
  abstract buildHeaders(config: ProviderConfig): Record<string, string>;
  abstract parseResponse(body: unknown): ChatResponse;
  abstract parseStreamLine(line: string, acc: StreamAccumulator): ParsedStreamLine;

  /** 统一的非流式调用编排 */
  async chat(config: ProviderConfig, req: ChatRequest): Promise<ChatResponse> {
    const url = this.buildUrl(config, req.model);
    const body = this.buildBody(req);
    const headers = this.buildHeaders(config);
    const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    let res: Response;
    try {
      res = await this.fetchImpl(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: req.signal ?? AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new LlmUnreachableError(`Request timed out after ${timeoutMs}ms: ${url}`);
      }
      throw new LlmUnreachableError(`Network error reaching ${url}: ${(err as Error)?.message}`);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => undefined);
      throw mapHttpError(res.status, text);
    }

    const payload = await res.json().catch(() => ({}));
    return this.parseResponse(payload);
  }

  /** 统一的流式调用编排：发起请求，逐行解析，产出一致事件 */
  async *stream(config: ProviderConfig, req: ChatRequest): AsyncIterable<ChatStreamEvent> {
    const url = this.buildUrl(config, req.model);
    const body = this.buildBody({ ...req, stream: true });
    const headers = this.buildHeaders(config);
    const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    let res: Response;
    try {
      res = await this.fetchImpl(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: req.signal ?? AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        yield { type: "error", message: `Request timed out after ${timeoutMs}ms: ${url}` };
        return;
      }
      yield { type: "error", message: `Network error reaching ${url}: ${(err as Error)?.message}` };
      return;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => undefined);
      const llmErr = mapHttpError(res.status, text);
      yield { type: "error", message: llmErr.message };
      return;
    }
    if (!res.body) {
      yield { type: "error", message: "Provider returned empty stream body" };
      return;
    }

    const acc: StreamAccumulator = { content: "", toolCalls: [] };
    let ended = false;
    try {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while (!ended && (nl = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line) continue;
          const parsed = this.parseStreamLine(line, acc);
          if (parsed.events) {
            for (const evt of parsed.events) yield evt;
          }
          if (parsed.done) ended = true;
        }
      }
      if (!ended && buffer.trim()) {
        const parsed = this.parseStreamLine(buffer.trim(), acc);
        if (parsed.events) {
          for (const evt of parsed.events) yield evt;
        }
        if (parsed.done) ended = true;
      }
    } catch (err) {
      yield { type: "error", message: `Stream interrupted: ${(err as Error)?.message}` };
      return;
    }

    yield {
      type: "done",
      content: acc.content,
      toolCalls: acc.toolCalls,
      usage: acc.usage,
      finishReason: acc.finishReason,
    };
  }
}

/** 从 DB 解析 JSON 字符串列（兼容 null / 已序列化 / 对象） */
export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}
