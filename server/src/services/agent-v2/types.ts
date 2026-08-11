/**
 * Agent V2 领域模型 — 会话 + 计划 + 步骤 + 事件流
 *
 * 升级目标：从 v1 的"一次同步长任务"（runAgent）升级为可观察、可控制、可恢复的
 * Agent Runtime：POST 创建 run → SSE 事件流实时查看 → 暂停/恢复/取消。
 * 类型与 v1（services/agent/types.ts）共用 ChatMessage/ToolCall/ToolPermission。
 */

import type { ChatMessage, TokenUsage } from "../llm/types.js";
import type { PermissionConfigInput } from "../agent/types.js";

/** 运行状态机 */
export type RunStatus =
  | "queued"
  | "planning"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled"
  | "budget_exceeded";

/** 运行步骤类型（Loop 阶段） */
export type StepKind = "plan" | "act" | "observe" | "reflect" | "final";

export type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";

/** 计划中的一步 */
export interface PlanStep {
  seq: number;
  title: string;
  description?: string;
  /** 预期工具（软提示，不强约束 LLM） */
  toolHint?: string;
  status: StepStatus;
}

/** LLM Planner 产物：任务分解 */
export interface AgentPlan {
  goal: string;
  steps: PlanStep[];
  createdAt: string;
}

/** V2 运行入参（routes/v2 校验后传入） */
export interface AgentRunV2Input {
  userId: number;
  modelId: string;
  task: string;
  conversationId?: string;
  agentId?: string;
  sandboxRoot?: string;
  maxIterations?: number;
  tokenBudget?: number;
  permission?: PermissionConfigInput;
}

/** V2 运行实体（进程内状态；持久化见 store.ts） */
export interface AgentRunV2 {
  id: string;
  userId: number;
  conversationId?: string;
  agentId?: string;
  modelId: string;
  task: string;
  sandboxRoot: string;
  status: RunStatus;
  plan?: AgentPlan;
  messages: ChatMessage[];
  tokenUsed: TokenUsage;
  iterations: number;
  toolCalls: number;
  error?: string;
  createdAt: string;
  finishedAt?: string;
}

/** 运行控制句柄：loop 与路由共享（协作式暂停 + AbortSignal 取消） */
export interface RunController {
  pause(): void;
  resume(): void;
  cancel(): void;
  isPaused(): boolean;
  isCancelled(): boolean;
}
