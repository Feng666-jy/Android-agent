/**
 * ANTHROPIC 协议 handler
 *
 * 端点：POST {baseUrl}/messages（baseUrl 形如 https://api.anthropic.com/v1）
 * 注意：system 消息提升为顶层字段；tool 结果以 user 消息 + tool_result 块表达。
 */

import { BaseHandler, type LlmHandler, type ParsedStreamLine, type StreamAccumulator } from "../base.js";
import type { ChatRequest, ChatResponse, ChatStreamEvent, ProviderConfig, ToolCall, TokenUsage } from "../types.js";

interface AnthropicTextBlock {
  type: "text";
  text: string;
}

interface AnthropicToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

type AnthropicContentBlock = AnthropicTextBlock | AnthropicToolUseBlock;

export class AnthropicHandler extends BaseHandler implements LlmHandler {
  readonly protocol = "ANTHROPIC";

  private readonly apiVersion = "2023-06-01";

  buildUrl(config: ProviderConfig, model: string): string {
    void model;
    return `${config.baseUrl.replace(/\/+$/, "")}/messages`;
  }

  buildHeaders(config: ProviderConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "anthropic-version": this.apiVersion,
    };
    if (config.apiKey) {
      headers["x-api-key"] = config.apiKey;
    }
    if (config.customHeaders) {
      Object.assign(headers, config.customHeaders);
    }
    return headers;
  }

  buildBody(req: ChatRequest): Record<string, unknown> {
    const system = req.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content ?? "")
      .join("\n\n");
    const messages = req.messages.filter((m) => m.role !== "system");

    const body: Record<string, unknown> = {
      model: req.model,
      max_tokens: req.maxOutputTokens ?? 4096,
      messages: messages.map((m) => this.toWireMessage(m)),
      stream: !!req.stream,
    };
    if (system) body.system = system;
    if (req.temperature !== undefined) body.temperature = req.temperature;
    if (req.topP !== undefined) body.top_p = req.topP;
    if (req.tools && req.tools.length > 0) {
      body.tools = req.tools.map((t) => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters,
      }));
    }
    return body;
  }

  private toWireMessage(m: ChatRequest["messages"][number]): Record<string, unknown> {
    if (m.role === "assistant") {
      const blocks: AnthropicContentBlock[] = [];
      if (m.content) blocks.push({ type: "text", text: m.content });
      if (m.toolCalls && m.toolCalls.length > 0) {
        for (const tc of m.toolCalls) {
          blocks.push({ type: "tool_use", id: tc.id, name: tc.name, input: tc.arguments ?? {} });
        }
      }
      return { role: "assistant", content: blocks };
    }
    if (m.role === "tool") {
      return {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: m.toolCallId ?? "",
            content: m.content ?? "",
          },
        ],
      };
    }
    return { role: m.role, content: m.content ?? "" };
  }

  parseResponse(body: unknown): ChatResponse {
    const b = body as Record<string, any>;
    const blocks: AnthropicContentBlock[] = b?.content ?? [];
    const content = blocks
      .filter((blk): blk is AnthropicTextBlock => blk.type === "text")
      .map((blk) => blk.text)
      .join("");
    const toolCalls: ToolCall[] = blocks
      .filter((blk): blk is AnthropicToolUseBlock => blk.type === "tool_use")
      .map((blk) => ({ id: blk.id, name: blk.name, arguments: blk.input ?? {} }));
    const usage: TokenUsage | undefined = b?.usage
      ? {
          inputTokens: b.usage.input_tokens ?? 0,
          outputTokens: b.usage.output_tokens ?? 0,
          totalTokens: (b.usage.input_tokens ?? 0) + (b.usage.output_tokens ?? 0),
        }
      : undefined;
    return { content, toolCalls, usage, finishReason: b?.stop_reason };
  }

  parseStreamLine(line: string, acc: StreamAccumulator): ParsedStreamLine {
    if (!line.startsWith("data:")) return {};
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(line.slice(5).trim());
    } catch {
      return {};
    }
    const events: ChatStreamEvent[] = [];
    switch (parsed.type) {
      case "content_block_delta": {
        const delta = parsed.delta ?? {};
        if (delta.type === "text_delta" && typeof delta.text === "string" && delta.text) {
          acc.content += delta.text;
          events.push({ type: "content_delta", delta: delta.text });
        } else if (delta.type === "input_json_delta" && typeof delta.partial_json === "string") {
          const idx = parsed.index ?? 0;
          const existing = acc.toolCalls[idx];
          if (existing) this.mergePartialJson(existing, delta.partial_json);
        }
        break;
      }
      case "content_block_start": {
        const blk = parsed.content_block ?? {};
        if (blk.type === "tool_use") {
          const idx = parsed.index ?? acc.toolCalls.length;
          acc.toolCalls[idx] = { id: blk.id, name: blk.name, arguments: { __json: "" } };
        }
        break;
      }
      case "message_delta": {
        if (parsed.delta?.stop_reason) acc.finishReason = parsed.delta.stop_reason;
        if (parsed.usage) {
          acc.usage = {
            inputTokens: parsed.usage.input_tokens ?? 0,
            outputTokens: parsed.usage.output_tokens ?? 0,
            totalTokens: (parsed.usage.input_tokens ?? 0) + (parsed.usage.output_tokens ?? 0),
          };
        }
        break;
      }
      case "message_stop":
        this.finalizeToolCalls(acc);
        return { done: true };
      default:
        break;
    }
    return { events };
  }

  private mergePartialJson(tool: ToolCall, fragment: string): void {
    const raw = (tool.arguments.__json as string) ?? "";
    tool.arguments.__json = raw + fragment;
  }

  private finalizeToolCalls(acc: StreamAccumulator): void {
    for (const tc of acc.toolCalls) {
      const raw = (tc.arguments.__json as string) ?? "";
      delete tc.arguments.__json;
      try {
        tc.arguments = raw.trim() ? (JSON.parse(raw) as Record<string, unknown>) : {};
      } catch {
        tc.arguments = {};
      }
    }
  }
}
