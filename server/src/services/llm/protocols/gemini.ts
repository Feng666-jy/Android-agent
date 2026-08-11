/**
 * GOOGLE_GEMINI 协议 handler
 *
 * 端点：POST {baseUrl}/models/{model}:generateContent
 * （baseUrl 形如 https://generativelanguage.googleapis.com/v1beta）
 */

import { BaseHandler, normalizeToolCall, type LlmHandler, type ParsedStreamLine, type StreamAccumulator } from "../base.js";
import type { ChatRequest, ChatResponse, ChatStreamEvent, ProviderConfig, ToolCall, TokenUsage } from "../types.js";

interface GeminiPart {
  text?: string;
  functionCall?: { name?: string; args?: Record<string, unknown> };
  functionResponse?: { name?: string; response?: unknown };
}

export class GeminiHandler extends BaseHandler implements LlmHandler {
  readonly protocol = "GOOGLE_GEMINI";

  buildUrl(config: ProviderConfig, model: string): string {
    return `${config.baseUrl.replace(/\/+$/, "")}/models/${encodeURIComponent(model)}:generateContent`;
  }

  buildHeaders(config: ProviderConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.apiKey) {
      headers["x-goog-api-key"] = config.apiKey;
    }
    if (config.customHeaders) {
      Object.assign(headers, config.customHeaders);
    }
    return headers;
  }

  buildBody(req: ChatRequest): Record<string, unknown> {
    const systemText = req.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content ?? "")
      .join("\n\n");

    const contents = req.messages
      .filter((m) => m.role !== "system")
      .map((m) => this.toWireContent(m));

    const body: Record<string, unknown> = { contents };
    if (systemText) body.systemInstruction = { parts: [{ text: systemText }] };
    if (req.temperature !== undefined || req.maxOutputTokens !== undefined || req.topP !== undefined) {
      body.generationConfig = {
        ...(req.temperature !== undefined && { temperature: req.temperature }),
        ...(req.maxOutputTokens !== undefined && { maxOutputTokens: req.maxOutputTokens }),
        ...(req.topP !== undefined && { topP: req.topP }),
      };
    }
    if (req.tools && req.tools.length > 0) {
      body.tools = [
        {
          functionDeclarations: req.tools.map((t) => ({
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters,
          })),
        },
      ];
    }
    return body;
  }

  private toWireContent(m: ChatRequest["messages"][number]): Record<string, unknown> {
    const parts: GeminiPart[] = [];
    if (m.content) {
      parts.push({ text: m.content });
    }
    if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      for (const tc of m.toolCalls) {
        parts.push({ functionCall: { name: tc.name, args: tc.arguments ?? {} } });
      }
    }
    if (m.role === "tool" && m.toolCallId) {
      parts.push({
        functionResponse: { name: m.toolCallId, response: { result: m.content ?? "" } },
      });
    }
    const role = m.role === "assistant" ? "model" : "user";
    return { role, parts };
  }

  parseResponse(body: unknown): ChatResponse {
    const b = body as Record<string, any>;
    const candidate = b?.candidates?.[0];
    const parts: GeminiPart[] = candidate?.content?.parts ?? [];
    const content = parts.filter((p) => p.text).map((p) => p.text).join("");
    const toolCalls: ToolCall[] = parts
      .filter((p) => p.functionCall)
      .map((p) =>
        normalizeToolCall(
          { name: p.functionCall?.name, arguments: p.functionCall?.args },
          "gemini"
        )
      )
      .filter((tc): tc is ToolCall => tc !== null);
    const usage: TokenUsage | undefined = b?.usageMetadata
      ? {
          inputTokens: b.usageMetadata.promptTokenCount ?? 0,
          outputTokens: b.usageMetadata.candidatesTokenCount ?? 0,
          totalTokens: b.usageMetadata.totalTokenCount ?? 0,
        }
      : undefined;
    return {
      content,
      toolCalls,
      usage,
      finishReason: candidate?.finishReason,
    };
  }

  parseStreamLine(line: string, acc: StreamAccumulator): ParsedStreamLine {
    if (!line.startsWith("data:")) return {};
    const payload = line.slice(5).trim();
    if (payload === "[DONE]") return { done: true };
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(payload);
    } catch {
      return {};
    }
    const events: ChatStreamEvent[] = [];
    const candidate = parsed?.candidates?.[0];
    if (!candidate) {
      if (parsed?.error?.message) {
        events.push({ type: "error", message: parsed.error.message });
      }
      return { events };
    }
    const parts: GeminiPart[] = candidate?.content?.parts ?? [];
    for (const part of parts) {
      if (part.text) {
        acc.content += part.text;
        events.push({ type: "content_delta", delta: part.text });
      }
      if (part.functionCall) {
        const tc = normalizeToolCall(
          { name: part.functionCall.name, arguments: part.functionCall.args },
          "gemini"
        );
        if (tc) acc.toolCalls.push(tc);
      }
    }
    if (candidate.finishReason) {
      acc.finishReason = candidate.finishReason;
    }
    return { events };
  }
}
