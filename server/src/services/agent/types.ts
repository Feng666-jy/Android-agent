/**
 * Agent 编排器 — 统一类型
 *
 * 与 services/llm 复用同一套 ToolDefinition/ChatMessage/TokenUsage。
 * Agent 层在 LLM 之上增加：会话状态、工具历史、执行结果、熔断参数。
 */

import type { ChatMessage, ToolCall, ToolDefinition, TokenUsage } from "../llm/types.js";

/** Agent 一次运行参数 */
export interface AgentRunInput {
  modelId: string;
  task: string;
  /** 最大 tool-calling 轮数（默认 10，防御死循环） */
  maxIterations?: number;
  /** 单次 LLM 调用超时（ms，默认 60_000） */
  llmTimeoutMs?: number;
  /** 总 token 预算（默认 100_000），超过则终止 */
  tokenBudget?: number;
  /** 沙盒根目录（默认 ~/agent-sandbox，可用 AGENT_SANDBOX 覆盖） */
  sandboxRoot?: string;
  /** 工具权限配置（默认清单见 DEFAULT_PERMISSIONS） */
  permission?: PermissionConfigInput;
  /** 审批处理器：permission=ask 时调用；缺省则直接拒绝 */
  approvalHandler?: ApprovalHandler;
  signal?: AbortSignal;
}

export type AgentStatus = "running" | "completed" | "failed" | "cancelled" | "budget_exceeded";

/** 一次工具调用的完整记录 */
export interface ToolCallRecord {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  ok: boolean;
  /** 给 LLM 回填的结果文本 */
  output: string;
  durationMs: number;
}

/** Agent 会话状态 */
export interface AgentState {
  id: string;
  task: string;
  status: AgentStatus;
  messages: ChatMessage[];
  toolHistory: ToolCallRecord[];
  tokenUsed: TokenUsage;
  createdAt: string;
  finishedAt?: string;
  error?: string;
}

/** 最终输出 */
export interface AgentResult {
  state: AgentState;
  /** 便捷字段，供 controller 直接返回 */
  status: AgentStatus;
  result: string;
  iterations: number;
  toolCalls: number;
  tokens: TokenUsage;
  /** 每轮 LLM 调用的 token 用量事件（事件溯源，供落库聚合） */
  usageByIteration: TokenUsage[];
}

/** 工具执行上下文 */
export interface ToolContext {
  sandboxRoot: string;
}

/** 工具执行结果 */
export interface ToolResult {
  ok: boolean;
  output: string;
}

/** 工具注册项 */
export interface AgentTool {
  name: string;
  description: string;
  /** JSON Schema */
  parameters: Record<string, unknown>;
  execute(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> | ToolResult;
}

export interface AgentConfig {
  maxIterations: number;
  llmTimeoutMs: number;
  tokenBudget: number;
}

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  maxIterations: 10,
  llmTimeoutMs: 60_000,
  tokenBudget: 100_000,
};

export function normalizeConfig(input: AgentRunInput): AgentConfig {
  return {
    maxIterations: clampInt(input.maxIterations, 1, 50, DEFAULT_AGENT_CONFIG.maxIterations),
    llmTimeoutMs: clampInt(input.llmTimeoutMs, 1_000, 300_000, DEFAULT_AGENT_CONFIG.llmTimeoutMs),
    tokenBudget: clampInt(input.tokenBudget, 1_000, 2_000_000, DEFAULT_AGENT_CONFIG.tokenBudget),
  };
}

function clampInt(v: number | undefined, min: number, max: number, fallback: number): number {
  if (typeof v !== "number" || Number.isNaN(v)) return fallback;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/** 工具注册项 → LLM 可见的 ToolDefinition */
export function toToolDefinition(tool: AgentTool): ToolDefinition {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };
}

// ---------------------------------------------------------------------------
// 权限模型（Phase 3 沙盒强化）
// ---------------------------------------------------------------------------

/** 工具权限级别 */
export type ToolPermission = "allow" | "ask" | "deny";

/** 权限配置（输入形态） */
export interface PermissionConfigInput {
  /** 全局默认权限（默认 "allow"） */
  default?: ToolPermission;
  /** 按工具名覆盖 */
  tools?: Record<string, ToolPermission>;
}

/** 归一化后的权限配置 */
export interface PermissionConfig {
  default: ToolPermission;
  tools: Record<string, ToolPermission>;
}

/** ask 模式：交给审批处理器的请求 */
export interface ApprovalRequest {
  /** 模型请求的工具调用 */
  toolCall: ToolCall;
  sandboxRoot: string;
  /** 该工具在此次运行的权限级别（当前恒为 "ask"） */
  permission: ToolPermission;
  /** 服务层元信息（供授权人判断） */
  modelId?: string;
  task?: string;
}

/** 审批处理器：批准则调用 execute() 执行工具，否则返回拒绝的 ToolResult */
export interface ApprovalHandler {
  (
    request: ApprovalRequest,
    execute: () => Promise<ToolResult>
  ): Promise<ToolResult>;
}
