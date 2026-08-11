/**
 * Agent 会话持久化 — 落库 / 列表 / 详情 / 删除
 *
 * 数据模型借鉴 codex-plus-data 的取舍：
 * - token 用量事件溯源式存储（每轮一条），读时聚合，不建聚合表
 * - 列表稳定排序：ORDER BY created_at DESC, id DESC
 * - 删除走外键级联（agent_runs 删除即级联删 messages/toolCalls/tokenEvents）
 */

import { prisma } from "../../prisma.js";
import { resolveSandboxRoot } from "./sandbox.js";
import type { AgentRunInput, AgentResult, AgentStatus } from "./types.js";

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

export interface ListRunsResult {
  list: AgentRunSummary[];
  total: number;
  page: number;
  pageSize: number;
}

/** runAgent 完成后一次性落库（同步 POST 语义：完成时已有全量状态） */
export async function saveRun(userId: number, runId: string, input: AgentRunInput, result: AgentResult): Promise<AgentRunSummary> {
  const messages = result.state.messages.map((m) => ({
    runId,
    role: m.role,
    content: m.content ?? null,
    toolCallId: m.toolCallId ?? null,
    toolCallsJson: m.toolCalls ? JSON.stringify(m.toolCalls) : null,
  }));
  const toolCalls = result.state.toolHistory.map((t) => ({
    runId,
    toolCallId: t.id,
    name: t.name,
    argumentsJson: JSON.stringify(t.arguments ?? {}),
    ok: t.ok,
    output: t.output,
    durationMs: t.durationMs,
  }));
  const tokenEvents = (result.usageByIteration ?? []).map((u, i) => ({
    runId,
    turnId: i + 1,
    inputTokens: u.inputTokens ?? 0,
    outputTokens: u.outputTokens ?? 0,
    cachedTokens: u.cachedTokens ?? 0,
    totalTokens: u.totalTokens ?? 0,
  }));

  const ops = [
    prisma.agentRun.create({
      data: {
        id: runId,
        userId,
        status: result.status,
        task: input.task,
        modelId: input.modelId,
        sandboxRoot: resolveSandboxRoot(input.sandboxRoot),
        iterations: result.iterations,
        toolCallCount: result.toolCalls,
        result: result.result,
        error: result.state.error ?? null,
        tokenInput: result.tokens.inputTokens,
        tokenOutput: result.tokens.outputTokens,
        tokenTotal: result.tokens.totalTokens,
        finishedAt: new Date(),
      },
    }),
    ...messages.map((m) => prisma.agentMessage.create({ data: m })),
    ...toolCalls.map((t) => prisma.agentToolCall.create({ data: t })),
    ...tokenEvents.map((u) => prisma.agentTokenUsage.create({ data: u })),
  ];

  const [run] = await prisma.$transaction(ops);
  return run as AgentRunSummary;
}

export interface ListRunsParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export async function listRuns(userId: number, params: ListRunsParams = {}): Promise<ListRunsResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const q = params.q?.trim();
  const safePage = Math.max(1, Math.floor(page));
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));

  const where: Record<string, any> = { userId };
  if (q) {
    let messageMatchedIds: string[] = [];
    if (q) {
      const msgs = await prisma.agentMessage.findMany({
        where: { content: { contains: q } },
        select: { runId: true },
      });
      messageMatchedIds = [...new Set(msgs.map((m) => m.runId))];
    }
    where.OR = [{ task: { contains: q } }];
    if (messageMatchedIds.length > 0) {
      where.OR.push({ id: { in: messageMatchedIds } });
    }
  }

  const [rows, total] = await Promise.all([
    prisma.agentRun.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (safePage - 1) * safeSize,
      take: safeSize,
    }),
    prisma.agentRun.count({ where }),
  ]);
  return { list: rows as AgentRunSummary[], total, page: safePage, pageSize: safeSize };
}

export async function getRun(userId: number, runId: string): Promise<AgentRunDetail | null> {
  const run = await prisma.agentRun.findUnique({ where: { id: runId } });
  if (!run || run.userId !== userId) return null;

  const [messages, toolCalls, tokenEvents] = await Promise.all([
    prisma.agentMessage.findMany({ where: { runId } }),
    prisma.agentToolCall.findMany({ where: { runId } }),
    prisma.agentTokenUsage.findMany({ where: { runId } }),
  ]);

  messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  toolCalls.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  tokenEvents.sort((a, b) => a.turnId - b.turnId);

  return {
    ...(run as AgentRunSummary),
    messages: messages as AgentMessageRecord[],
    toolCalls: toolCalls as AgentToolCallRecord[],
    tokenEvents: tokenEvents as AgentTokenEventRecord[],
  };
}

export async function deleteRun(userId: number, runId: string): Promise<boolean> {
  try {
    await prisma.agentRun.delete({ where: { id: runId, userId } });
    return true;
  } catch {
    return false;
  }
}

export async function deleteRuns(userId: number, runIds: string[]): Promise<{ deleted: number }> {
  if (runIds.length === 0) return { deleted: 0 };
  const result = await prisma.agentRun.deleteMany({
    where: { userId, id: { in: runIds } },
  });
  return { deleted: result.count };
}

/** 会话服务入口对象（可被 mock.method 的持久层，遵循仓库对象服务约定） */
export const agentSessionService = { saveRun, listRuns, getRun, deleteRun, deleteRuns };
