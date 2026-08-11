/**
 * OPENAI_COMPATIBLE 协议 handler
 *
 * 覆盖 OpenAI / DeepSeek / Qwen / Moonshot / 硅基流动 等兼容端点。
 * 端点：POST {baseUrl}/chat/completions
 */

import { BaseHandler, normalizeToolCall, type LlmHandler, type ParsedStreamLine, type StreamAccumulator } from "../base.js";
import type { ChatRequest, ChatResponse, ChatStreamEvent, ProviderConfig, ToolCall, TokenUsage } from "../types.js";

interface OpenAiMessage {
  role: string;
  content: string | null;
  name?: string;
  tool_calls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

interface OpenAiToolCall {
  id?: string;
  type?: string;
  function?: { name?: string; arguments?: string };
}

export class OpenAIHandler extends BaseHandler implements LlmHandler {
  readonly protocol = "OPENAI_COMPATIBLE";

  buildUrl(config: ProviderConfig, model: string): string {
    void model;
    return `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;
  }

  buildHeaders(config: ProviderConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
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
    if (req.temperature !== undefined) body.temperature = req.temperature;
    if (req.maxOutputTokens !== undefined) body.max_tokens = req.maxOutputTokens;
    if (req.topP !== undefined) body.top_p = req.topP;
    if (req.frequencyPenalty !== undefined) body.frequency_penalty = req.frequencyPenalty;
    if (req.presencePenalty !== undefined) body.presence_penalty = req.presencePenalty;
    if (req.tools && req.tools.length > 0) {
      body.tools = req.tools;
      body.tool_choice = "auto";
    }
    return body;
  }

  private toWireMessage(m: ChatRequest["messages"][number]): OpenAiMessage {
    const wire: OpenAiMessage = { role: m.role, content: m.content ?? null };
    if (m.role === "tool" && m.toolCallId) {
      wire.tool_call_id = m.toolCallId;
      wire.content = m.content ?? "";
    }
    if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      wire.tool_calls = m.toolCalls.map((tc) => ({
        id: tc.id,
        type: "function",
        function: { name: tc.name, arguments: JSON.stringify(tc.arguments ?? {}) },
      }));
    }
    return wire;
  }

  parseResponse(body: unknown): ChatResponse {
    const b = body as Record<string, any>;
    const choice = b?.choices?.[0];
    const message = choice?.message ?? {};
    const content = typeof message.content === "string" ? message.content : "";
    const toolCalls: ToolCall[] = (message.tool_calls ?? [])
      .map((tc: OpenAiToolCall) => normalizeToolCall(
        { id: tc.id, name: tc.function?.name, arguments: tc.function?.arguments },
        "openai"
      ))
      .filter((tc: ToolCall | null): tc is ToolCall => tc !== null);
    const usage: TokenUsage | undefined = b?.usage
      ? {
          inputTokens: b.usage.prompt_tokens ?? 0,
          outputTokens: b.usage.completion_tokens ?? 0,
          totalTokens: b.usage.total_tokens ?? 0,
        }
      : undefined;
    return { content, toolCalls, usage, finishReason: choice?.finish_reason };
  }

  parseStreamLine(line: string, acc: StreamAccumulator): ParsedStreamLine {
    if (!line.startsWith("data:")) return {};
    const payload = line.slice(5).trim();
    if (payload === "[DONE]") {
      return { done: true };
    }
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(payload);
    } catch {
      return {};
    }
    const events: ChatStreamEvent[] = [];
    const choice = parsed?.choices?.[0];
    if (!choice) {
      if (parsed?.error) {
        events.push({ type: "error", message: parsed.error.message ?? "Provider stream error" });
      }
      return { events };
    }
    const delta = choice.delta ?? {};
    if (typeof delta.content === "string" && delta.content) {
      acc.content += delta.content;
      events.push({ type: "content_delta", delta: delta.content });
    }
    if (Array.isArray(delta.tool_calls)) {
      for (const tc of delta.tool_calls) {
        const normalized = normalizeToolCall(
          { id: tc.id, name: tc.function?.name, arguments: tc.function?.arguments },
          "openai"
        );
        if (normalized && !acc.toolCalls.find((t) => t.id === normalized.id)) {
          acc.toolCalls.push(normalized);
        }
      }
    }
    if (choice.finish_reason) {
      acc.finishReason = choice.finish_reason;
    }
    return { events };
  }
}
