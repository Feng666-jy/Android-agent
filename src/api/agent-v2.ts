import request from "@/utils/request";
import { storage } from "@/utils/storage";
import type { ApiResponse } from "@/types";

// ---- Agent V2 类型（与服务端 services/agent-v2/types.ts + events.ts 对齐） ----

export type RunStatusV2 =
  | "queued"
  | "planning"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled"
  | "budget_exceeded";

export type StepKindV2 = "plan" | "act" | "observe" | "reflect" | "final";
export type StepStatusV2 = "pending" | "running" | "done" | "failed" | "skipped";

export interface PlanStepV2 {
  seq: number;
  title: string;
  description?: string;
  toolHint?: string;
  status: StepStatusV2;
}

export interface AgentPlanV2 {
  goal: string;
  steps: PlanStepV2[];
  createdAt: string;
}

export interface AgentRunV2 {
  id: string;
  userId: number;
  conversationId?: string;
  agentId?: string;
  modelId: string;
  task: string;
  status: RunStatusV2;
  plan?: AgentPlanV2;
  iterations: number;
  toolCalls: number;
  tokenUsed: { inputTokens: number; outputTokens: number; totalTokens: number };
  error?: string;
  createdAt: string;
  finishedAt?: string;
}

export interface AgentStepRecordV2 {
  id: string;
  runId: string;
  seq: number;
  kind: string;
  status: string;
  input: string | null;
  output: string | null;
  toolCallId: string | null;
  createdAt: string;
}

export interface ApprovalRecordV2 {
  id: string;
  runId: string;
  userId: number;
  toolName: string;
  argumentsJson: string;
  status: "pending" | "approved" | "rejected" | "timeout";
  modelId?: string;
  task?: string;
  createdAt: string;
  settledAt?: string;
}

export type AgentEventTypeV2 =
  | "run.created"
  | "run.status"
  | "plan.generated"
  | "step.started"
  | "step.completed"
  | "step.failed"
  | "tool.started"
  | "tool.completed"
  | "message"
  | "context.compacted"
  | "approval.requested"
  | "run.completed"
  | "run.failed"
  | "run.cancelled"
  | "run.budget_exceeded"
  | "error";

export interface AgentEventV2 {
  type: AgentEventTypeV2;
  runId: string;
  ts: string;
  data?: Record<string, unknown>;
}

export interface CreateRunV2Input {
  modelId: string;
  task: string;
  conversationId?: string;
  agentId?: string;
  maxIterations?: number;
  tokenBudget?: number;
  permission?: {
    default?: "allow" | "ask" | "deny";
    tools?: Record<string, "allow" | "ask" | "deny">;
  };
}

// ---- API ----

export const agentV2API = {
  /** POST /v2/agent/runs — 异步创建运行（202，立即返回 runId） */
  createRun(data: CreateRunV2Input): Promise<ApiResponse<{ runId: string; status: RunStatusV2; task: string }>> {
    return request.post("/v2/agent/runs", data);
  },

  /** GET /v2/agent/runs/:runId — 运行状态（live 或 DB 详情） */
  getRun(runId: string): Promise<ApiResponse<any>> {
    return request.get(`/v2/agent/runs/${runId}`);
  },

  pause(runId: string): Promise<ApiResponse<{ runId: string; status: string }>> {
    return request.post(`/v2/agent/runs/${runId}/pause`);
  },

  resume(runId: string): Promise<ApiResponse<{ runId: string; status: string }>> {
    return request.post(`/v2/agent/runs/${runId}/resume`);
  },

  cancel(runId: string): Promise<ApiResponse<{ runId: string; status: string }>> {
    return request.post(`/v2/agent/runs/${runId}/cancel`);
  },

  /** GET /v2/agent/runs/:runId/approvals — DB 审批记录 */
  approvals(runId: string): Promise<ApiResponse<ApprovalRecordV2[]>> {
    return request.get(`/v2/agent/runs/${runId}/approvals`);
  },

  approve(id: string): Promise<ApiResponse<{ ok: boolean; status: string }>> {
    return request.post(`/v2/agent/approvals/${id}/approve`);
  },

  reject(id: string): Promise<ApiResponse<{ ok: boolean; status: string }>> {
    return request.post(`/v2/agent/approvals/${id}/reject`);
  },

  /** GET /v2/agent/runs?page=&pageSize= — 运行历史 */
  history(page = 1, pageSize = 20): Promise<ApiResponse<any>> {
    return request.get("/v2/agent/runs", { params: { page, pageSize } });
  },
};

// ---- SSE 订阅（EventSource 无法带 header，token 走 query） ----

export interface RunEventHandlers {
  onEvent?: (evt: AgentEventV2) => void;
  onOpen?: () => void;
  onError?: () => void;
}

const EVENT_NAMES: AgentEventTypeV2[] = [
  "run.created",
  "run.status",
  "plan.generated",
  "step.started",
  "step.completed",
  "step.failed",
  "tool.started",
  "tool.completed",
  "message",
  "context.compacted",
  "approval.requested",
  "run.completed",
  "run.failed",
  "run.cancelled",
  "run.budget_exceeded",
  "error",
];

/**
 * 订阅某个 run 的 SSE 事件流；返回取消订阅函数（组件卸载/停止时调用）。
 * 断线由 EventSource 自动重连，服务端会回放已产生事件。
 */
export function subscribeRunEvents(runId: string, handlers: RunEventHandlers): () => void {
  const base = import.meta.env.VITE_API_BASE_URL || "/api";
  const token = storage.getToken() ?? "";
  const source = new EventSource(`${base}/v2/agent/runs/${runId}/events?token=${encodeURIComponent(token)}`);

  source.onopen = () => handlers.onOpen?.();
  source.onerror = () => handlers.onError?.();

  const onMessage = (e: MessageEvent) => {
    try {
      handlers.onEvent?.(JSON.parse(e.data) as AgentEventV2);
    } catch {
      /* 忽略坏帧 */
    }
  };
  for (const name of EVENT_NAMES) {
    source.addEventListener(name, onMessage);
  }

  return () => {
    source.close();
  };
}
