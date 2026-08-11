/**
 * LLM Adapter — 统一领域类型
 *
 * 所有 Provider 协议（OPENAI_COMPATIBLE / ANTHROPIC / GOOGLE_GEMINI / OLLAMA）
 * 统一转换到这里的类型，service/controller/agent 层只见这套类型。
 * 与 CONTEXT.md 领域术语一致：Provider / Model / Protocol / Capability。
 */

export type ProtocolType = "OPENAI_COMPATIBLE" | "ANTHROPIC" | "GOOGLE_GEMINI" | "OLLAMA";

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  /** JSON Schema 参数对象，协议层负责与各 API 的 arguments 格式互转 */
  arguments: Record<string, unknown>;
}

export interface ChatMessage {
  role: ChatRole;
  content: string | null;
  /** assistant 消息携带的工具调用 */
  toolCalls?: ToolCall[];
  /** tool 消息关联的工具调用 id */
  toolCallId?: string;
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    /** JSON Schema */
    parameters: Record<string, unknown>;
  };
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  /** 提示缓存命中 token（可选，协议层支持时才有） */
  cachedTokens?: number;
}

export interface ChatResponse {
  content: string;
  toolCalls: ToolCall[];
  usage?: TokenUsage;
  finishReason?: string;
}

/** 统一流式事件（协议层解析后产出） */
export type ChatStreamEvent =
  | { type: "content_delta"; delta: string }
  | { type: "tool_calls"; toolCalls: ToolCall[] }
  | { type: "done"; content?: string; toolCalls?: ToolCall[]; usage?: TokenUsage; finishReason?: string }
  | { type: "error"; message: string };

export interface ChatRequest {
  model: string;
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

/** 从 Provider/Model 行解析出的运行配置（controller/service 层传入） */
export interface ProviderConfig {
  providerId: string;
  baseUrl: string;
  protocol: ProtocolType;
  apiKey?: string;
  authType?: string;
  /** 覆盖到 HTTP 请求头的自定义头 */
  customHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export interface ModelConfig {
  modelId: string;
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  contextWindow?: number;
  customHeaders?: Record<string, string>;
  customParams?: Record<string, unknown>;
}
