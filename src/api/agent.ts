import request from "@/utils/request";
import type { ApiResponse } from "@/types";

// ---- Agent Run 相关类型（与服务端 services/agent/types.ts 对齐） ----

export type AgentStatus = "running" | "completed" | "failed" | "cancelled" | "budget_exceeded";

export interface ChatMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string | null;
  toolCallId?: string | null;
  toolCalls?: Array<{ id: string; name: string; arguments: Record<string, unknown> }>;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens?: number;
}

export interface ToolCallRecord {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  ok: boolean;
  output: string;
  durationMs: number;
}

export interface AgentRunResult {
  status: AgentStatus;
  result: string | null;
  error?: string | null;
  iterations: number;
  toolCalls: number;
  tokens: TokenUsage;
  usageByIteration: TokenUsage[];
  state: {
    status: AgentStatus;
    error?: string | null;
    messages: ChatMessage[];
    toolHistory: ToolCallRecord[];
  };
}

export interface AgentRunResponse extends AgentRunResult {
  runId: string;
}

export interface AgentRunInput {
  modelId: string;
  task: string;
  maxIterations?: number;
  llmTimeoutMs?: number;
  tokenBudget?: number;
  sandboxRoot?: string;
  clientRunId?: string;
  permission?: {
    default?: "allow" | "ask" | "deny";
    tools?: Record<string, "allow" | "ask" | "deny">;
  };
}

// ---- 审批 ----

export interface PendingApproval {
  id: string;
  runId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  sandboxRoot: string;
  status: "pending" | "approved" | "rejected" | "timeout";
  createdAt: number;
}

// ---- 历史会话 ----

export interface AgentRunSummary {
  id: string;
  userId: number;
  status: AgentStatus;
  task: string;
  modelId: string;
  sandboxRoot: string;
  iterations: number;
  toolCallCount: number;
  result: string | null;
  error: string | null;
  tokenInput: number;
  tokenOutput: number;
  tokenTotal: number;
  createdAt: string;
  finishedAt: string | null;
}

export interface AgentMessageRecord {
  id: string;
  runId: string;
  role: string;
  content: string | null;
  toolCallId: string | null;
  toolCallsJson: string | null;
  createdAt: string;
}

export interface AgentToolCallRecord {
  id: string;
  runId: string;
  toolCallId: string | null;
  name: string;
  argumentsJson: string;
  ok: boolean;
  output: string | null;
  durationMs: number;
  createdAt: string;
}

export interface AgentTokenEventRecord {
  id: string;
  runId: string;
  turnId: number;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  totalTokens: number;
  createdAt: string;
}

export interface AgentRunDetail extends AgentRunSummary {
  messages: AgentMessageRecord[];
  toolCalls: AgentToolCallRecord[];
  tokenEvents: AgentTokenEventRecord[];
}

export interface AgentRunsPage {
  list: AgentRunSummary[];
  total: number;
  page: number;
  pageSize: number;
}

/** 生成客户端 runId：审批轮询与落库都以它为准 */
export function makeClientRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const agentAPI = {
  /** POST /agent/run — 同步长任务，客户端连接关闭即中止；放开超时 */
  run(data: AgentRunInput, signal?: AbortSignal): Promise<ApiResponse<AgentRunResponse>> {
    return request.post("/agent/run", data, { timeout: 0, signal });
  },

  /** GET /agent/runs/:runId/approvals — 轮询该 run 的待审批 */
  pendingApprovals(runId: string): Promise<ApiResponse<PendingApproval[]>> {
    return request.get(`/agent/runs/${runId}/approvals`);
  },

  approve(id: string): Promise<ApiResponse<{ ok: boolean; status: string }>> {
    return request.post(`/agent/approvals/${id}/approve`);
  },

  reject(id: string): Promise<ApiResponse<{ ok: boolean; status: string }>> {
    return request.post(`/agent/approvals/${id}/reject`);
  },

  /** GET /agent/runs?page=&pageSize=&q= — 历史列表（q 搜索任务标题 + 消息内容） */
  history(page = 1, pageSize = 20, q?: string): Promise<ApiResponse<AgentRunsPage>> {
    return request.get("/agent/runs", { params: { page, pageSize, q: q || undefined } });
  },

  /** GET /agent/runs/:id — 详情（含 messages / toolCalls / tokenEvents） */
  detail(id: string): Promise<ApiResponse<AgentRunDetail>> {
    return request.get(`/agent/runs/${id}`);
  },

  /** DELETE /agent/runs/:id */
  remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return request.delete(`/agent/runs/${id}`);
  },

  /** POST /agent/runs/batch-delete */
  batchDelete(ids: string[]): Promise<ApiResponse<{ deleted: number }>> {
    return request.post("/agent/runs/batch-delete", { ids });
  },
};
