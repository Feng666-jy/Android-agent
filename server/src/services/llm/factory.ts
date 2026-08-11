/**
 * LLM Adapter — 协议工厂
 *
 * 按 provider.protocol 选择对应 handler。
 * 协议枚举见 CONTEXT.md：OPENAI_COMPATIBLE / ANTHROPIC / GOOGLE_GEMINI / OLLAMA
 */

import { BaseHandler } from "./base.js";
import { LlmValidationError } from "./errors.js";
import { OpenAIHandler } from "./protocols/openai.js";
import { AnthropicHandler } from "./protocols/anthropic.js";
import { GeminiHandler } from "./protocols/gemini.js";
import { OllamaHandler } from "./protocols/ollama.js";
import type { ProtocolType } from "./types.js";

const HANDLERS: Record<ProtocolType, BaseHandler> = {
  OPENAI_COMPATIBLE: new OpenAIHandler(),
  ANTHROPIC: new AnthropicHandler(),
  GOOGLE_GEMINI: new GeminiHandler(),
  OLLAMA: new OllamaHandler(),
};

export function getHandler(protocol: string): BaseHandler {
  const key = protocol?.toUpperCase() as ProtocolType;
  const handler = HANDLERS[key];
  if (!handler) {
    throw new LlmValidationError(`Unsupported protocol: ${protocol}`);
  }
  return handler;
}

export function listSupportedProtocols(): string[] {
  return Object.keys(HANDLERS);
}
