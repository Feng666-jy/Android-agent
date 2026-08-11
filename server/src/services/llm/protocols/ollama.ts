/**
 * OLLAMA 协议 handler
 *
 * 端点：POST {baseUrl}/api/chat
 * 返回 NDJSON（每行一个 JSON），无需 API key（本地）。
 */

import { BaseHandler, normalizeToolCall, type LlmHandler, type ParsedStreamLine, type StreamAccumulator } from "../base.js";
import type { ChatRequest, ChatResponse, ChatStreamEvent, ProviderConfig, ToolCall, TokenUsage } from "../types.js";

export class OllamaHandler extends BaseHandler implements LlmHandler {
  readonly protocol = "OLLAMA";

  buildUrl(config: ProviderConfig, model: string): string {
    void model;
    return `${config.baseUrl.replace(/\/+$/, "")}/api/chat`;
  }

  buildHeaders(config: ProviderConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Ollama 通常无需鉴权；若配置了 key（如 OLLAMA_TOKEN 场景）则带 Authorization
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }
    if (config.customHeaders) {
      Object.assign(headers, config.customHeaders);
    }
    return headers;
  }

  buildBody(req: ChatRequest): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: req.model,
      messages: req.messages.map((m) => this.toWireMessage(m)),
      stream: !!req.stream,
    };
    const options: Record<string, unknown> = {};
    if (req.temperature !== undefined) options.temperature = req.temperature;
    if (req.maxOutputTokens !== undefined) options.num_predict = req.maxOutputTokens;
    if (req.topP !== undefined) options.top_p = req.topP;
    if (Object.keys(options).length > 0) body.options = options;
    if (req.tools && req.tools.length > 0) {
      body.tools = req.tools;
    }
    return body;
  }

  private toWireMessage(m: ChatRequest["messages"][number]): Record<string, unknown> {
    const wire: Record<string, unknown> = { role: m.role, content: m.content ?? "" };
    if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      wire.tool_calls = m.toolCalls.map((tc) => ({
        function: { name: tc.name, arguments: tc.arguments ?? {} },
      }));
    }
    return wire;
  }

  parseResponse(body: unknown): ChatResponse {
    const b = body as Record<string, any>;
    const message = b?.message ?? {};
    const content = typeof message.content === "string" ? message.content : "";
    const toolCalls: ToolCall[] = (message.tool_calls ?? [])
      .map((tc: any) =>
        normalizeToolCall(
          { name: tc.function?.name, arguments: tc.function?.arguments },
          "ollama"
        )
      )
      .filter((tc: ToolCall | null): tc is ToolCall => tc !== null);
    const usage: TokenUsage | undefined = b?.prompt_eval_count !== undefined || b?.eval_count !== undefined
      ? {
          inputTokens: b.prompt_eval_count ?? 0,
          outputTokens: b.eval_count ?? 0,
          totalTokens: (b.prompt_eval_count ?? 0) + (b.eval_count ?? 0),
        }
      : undefined;
    return { content, toolCalls, usage, finishReason: b?.done ? "stop" : undefined };
  }

  parseStreamLine(line: string, acc: StreamAccumulator): ParsedStreamLine {
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(line);
    } catch {
      return {};
    }
    const events: ChatStreamEvent[] = [];
    if (parsed.error) {
      events.push({ type: "error", message: String(parsed.error) });
      return { events };
    }
    const msg = parsed.message ?? {};
    if (typeof msg.content === "string" && msg.content) {
      acc.content += msg.content;
      events.push({ type: "content_delta", delta: msg.content });
    }
    if (Array.isArray(msg.tool_calls)) {
      for (const tc of msg.tool_calls) {
        const normalized = normalizeToolCall(
          { name: tc.function?.name, arguments: tc.function?.arguments },
          "ollama"
        );
        if (normalized) acc.toolCalls.push(normalized);
      }
    }
    if (parsed.done) {
      if (parsed.prompt_eval_count !== undefined || parsed.eval_count !== undefined) {
        acc.usage = {
          inputTokens: parsed.prompt_eval_count ?? 0,
          outputTokens: parsed.eval_count ?? 0,
          totalTokens: (parsed.prompt_eval_count ?? 0) + (parsed.eval_count ?? 0),
        };
      }
      acc.finishReason = "stop";
      return { done: true, events };
    }
    return { events };
  }
}
