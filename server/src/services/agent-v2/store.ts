/**
 * Agent V2 持久化 — 基于 prisma 兼容层（node:sqlite）
 *
 * 写入：agent_runs（v2 列）/ agent_steps / agent_messages / messages（会话）
 * 原则：持久化失败只记日志，不中断运行；旧 /api/agent/* 表结构不变。
 * 新表（agents/approvals）在 Phase 1 迁移 0003_agent_core 中创建。
 */

import { prisma } from "../../prisma.js";
import { logger } from "../../utils/logger.js";
import { resolveSandboxRoot } from "../agent/sandbox.js";
import type { ChatMessage } from "../llm/types.js";
import type { AgentPlan, AgentRunV2, RunStatus, StepKind, StepStatus } from "./types.js";

// ---------------------------------------------------------------------------
// agent_runs
// ---------------------------------------------------------------------------

export async function createRunRow(run: AgentRunV2): Promise<void> {
  await prisma.agentRun.create({
    data: {
      id: run.id,
      userId: run.userId,
      status: run.status,
      task: run.task,
      modelId: run.modelId,
      sandboxRoot: resolveSandboxRoot(run.sandboxRoot),
      iterations: 0,
      toolCallCount: 0,
      conversationId: run.conversationId ?? null,
      agentId: run.agentId ?? null,
      planJson: null,
      finishedAt: null,
    },
  });
}

export async function updateRunStatus(
  runId: string,
  status: RunStatus,
  patch: { error?: string; finishedAt?: string } = {}
): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: {
      status,
      ...(patch.error !== undefined ? { error: patch.error } : {}),
      ...(patch.finishedAt !== undefined ? { finishedAt: new Date(patch.finishedAt) } : {}),
    },
  });
}

export async function savePlan(runId: string, plan: AgentPlan): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: { planJson: JSON.stringify(plan) },
  });
}

export async function updateRunResult(runId: string, result: string): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: { result },
  });
}

export async function updateRunStats(
  runId: string,
  stats: { iterations: number; toolCallCount: number }
): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: { iterations: stats.iterations, toolCallCount: stats.toolCallCount },
  });
}

// ---------------------------------------------------------------------------
// agent_steps（步骤级持久化）
// ---------------------------------------------------------------------------

export async function saveStep(
  runId: string,
  seq: number,
  kind: StepKind,
  status: StepStatus,
  input?: string,
  output?: string,
  toolCallId?: string
): Promise<string> {
  const row = await prisma.agentStep.create({
    data: {
      runId,
      seq,
      kind,
      status,
      input: input ?? null,
      output: output ?? null,
      toolCallId: toolCallId ?? null,
      createdAt: new Date(),
    },
  });
  return row.id;
}

export async function updateStep(
  runId: string,
  seq: number,
  patch: { status: StepStatus; output?: string }
): Promise<void> {
  await prisma.agentStep.updateMany({
    where: { runId, seq },
    data: {
      status: patch.status,
      ...(patch.output !== undefined ? { output: patch.output } : {}),
    },
  });
}

// ---------------------------------------------------------------------------
// 消息持久化
// ---------------------------------------------------------------------------

/** 写入 run 时间线（agent_messages，v1 表） */
export async function appendRunMessage(runId: string, message: ChatMessage): Promise<void> {
  await prisma.agentMessage.create({
    data: {
      runId,
      role: message.role,
      content: message.content ?? null,
      toolCallId: message.toolCallId ?? null,
      toolCallsJson: message.toolCalls ? JSON.stringify(message.toolCalls) : null,
    },
  });
}

/** 写入会话消息（messages 表，V2.0 会话实体；conversationId 存在时调用） */
export async function appendConversationMessage(
  conversationId: string,
  runId: string,
  message: ChatMessage
): Promise<void> {
  await prisma.message.create({
    data: {
      conversationId,
      runId,
      role: message.role,
      content: message.content ?? null,
      toolCallsJson: message.toolCalls ? JSON.stringify(message.toolCalls) : null,
      toolCallId: message.toolCallId ?? null,
      attachmentsJson: null,
      tokensJson: null,
      parentId: null,
      branchIndex: 0,
    },
  });
}

// ---------------------------------------------------------------------------
// 查询（v2 详情 / 历史）
// ---------------------------------------------------------------------------

export interface AgentStepRecord {
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

export interface AgentRunV2Detail {
  run: Record<string, any>;
  steps: AgentStepRecord[];
  messages: Array<Record<string, any>>;
}

export async function getRunDetail(userId: number, runId: string): Promise<AgentRunV2Detail | null> {
  const run = await prisma.agentRun.findUnique({ where: { id: runId } });
  if (!run || run.userId !== userId) return null;
  const [steps, messages] = await Promise.all([
    prisma.agentStep.findMany({ where: { runId } }),
    prisma.agentMessage.findMany({ where: { runId } }),
  ]);
  steps.sort((a: any, b: any) => a.seq - b.seq);
  messages.sort((a: any, b: any) => String(a.createdAt).localeCompare(String(b.createdAt)));
  return { run, steps: steps as AgentStepRecord[], messages };
}

export async function listRuns(
  userId: number,
  page = 1,
  pageSize = 20
): Promise<{ list: Array<Record<string, any>>; total: number }> {
  const safePage = Math.max(1, Math.floor(page));
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const [rows, total] = await Promise.all([
    prisma.agentRun.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (safePage - 1) * safeSize,
      take: safeSize,
    }),
    prisma.agentRun.count({ where: { userId } }),
  ]);
  return { list: rows, total };
}

/** 静默持久化包装：失败仅记日志（不阻断 Loop） */
export function silent<T>(label: string, op: Promise<T>): Promise<T | undefined> {
  return op.catch((err: unknown) => {
    logger.warn(`[agent-v2] persist ${label} failed: ${(err as Error)?.message ?? String(err)}`);
    return undefined;
  });
}


