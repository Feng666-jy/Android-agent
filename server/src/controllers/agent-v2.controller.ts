/**
 * Agent V2 控制器 — 薄控制器
 * 业务全在 services/agent-v2；本控制器负责：创建 run（202 异步）、SSE 事件流、
 * 暂停/恢复/取消、审批（DB 落库 + 内存唤醒）、历史与详情。
 */

import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { z } from "zod";
import {
  AgentLoop,
  agentEventBus,
  approveApproval,
  createPersistentApprovalHandler,
  getRunDetail,
  getRunHandle,
  listApprovals,
  listRuns,
  makeEvent,
  rejectApproval,
  registerRun,
  updateRunStatus,
} from "../services/agent-v2/index.js";
import type { AgentEvent } from "../services/agent-v2/index.js";
import { success, fail, notFound, unauthorized } from "../utils/response.js";
import { logger } from "../utils/logger.js";

export const agentRunV2Schema = z.object({
  modelId: z.string().min(1),
  task: z.string().min(1, "task must not be empty").max(20000),
  conversationId: z.string().min(1).optional(),
  agentId: z.string().min(1).optional(),
  sandboxRoot: z.string().min(1).optional(),
  maxIterations: z.number().int().min(1).max(100).optional(),
  tokenBudget: z.number().int().min(1000).max(2000000).optional(),
  permission: z
    .object({
      default: z.enum(["allow", "ask", "deny"]).optional(),
      tools: z.record(z.string(), z.enum(["allow", "ask", "deny"])).optional(),
    })
    .optional(),
});

type AgentRunV2Body = z.infer<typeof agentRunV2Schema>;

const TERMINAL_STATUS = new Set(["completed", "failed", "cancelled", "budget_exceeded"]);

function requireUserId(req: Request, res: Response): number | null {
  const userId = req.user?.userId;
  if (userId === undefined) {
    unauthorized(res);
    return null;
  }
  return userId;
}

export const agentV2Controller = {
  /** POST /api/v2/agent/runs — 异步创建运行，立即返回 202 */
  createRun(req: Request, res: Response): void {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const body = req.body as AgentRunV2Body;

    const runId = randomUUID();
    const approvalHandler = createPersistentApprovalHandler({
      runId,
      userId,
      modelId: body.modelId,
      task: body.task,
    });
    const loop = new AgentLoop({
      ...body,
      userId,
      runId,
      deps: { approvalHandler },
    });
    registerRun({ run: loop.run, controller: loop.controller });

    void loop.start().catch((err) => {
      logger.error(`[agent-v2] run ${runId} crashed: ${(err as Error)?.message ?? String(err)}`);
    });

    success(res, { runId, status: loop.run.status, task: loop.run.task }, "run queued", 202);
  },

  /** GET /api/v2/agent/runs/:runId — 实时状态（进程内优先，否则读库） */
  async getRun(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const { runId } = req.params;
    const handle = getRunHandle(runId);
    if (handle) {
      if (handle.run.userId !== userId) {
        notFound(res, "Run not found");
        return;
      }
      success(res, { ...handle.run, source: "live" });
      return;
    }
    const detail = await getRunDetail(userId, runId);
    if (!detail) {
      notFound(res, "Run not found");
      return;
    }
    success(res, { ...detail.run, source: "db", steps: detail.steps, messages: detail.messages });
  },

  /** GET /api/v2/agent/runs/:runId/events — SSE 事件流（?token= 鉴权） */
  events(req: Request, res: Response): void {
    const userId = req.user?.userId;
    const { runId } = req.params;
    const handle = getRunHandle(runId);
    if (!handle || handle.run.userId !== userId) {
      notFound(res, "Run not found or already finished");
      return;
    }

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const write = (evt: AgentEvent): void => {
      res.write(`event: ${evt.type}\ndata: ${JSON.stringify(evt)}\n\n`);
    };

    // 先回放已产生事件，再订阅实时（避免重复）
    for (const evt of agentEventBus.history(runId)) write(evt);

    // 终态：回放完毕直接结束
    if (TERMINAL_STATUS.has(handle.run.status)) {
      res.end();
      return;
    }

    const unsubscribe = agentEventBus.subscribe(runId, write);
    const heartbeat = setInterval(() => res.write(": ping\n\n"), 15_000);
    const cleanup = (): void => {
      clearInterval(heartbeat);
      unsubscribe();
    };
    res.on("close", cleanup);
    req.on("close", cleanup);
  },

  /** POST /api/v2/agent/runs/:runId/pause */
  pause(req: Request, res: Response): void {
    this.control(req, res, "paused");
  },

  /** POST /api/v2/agent/runs/:runId/resume */
  resume(req: Request, res: Response): void {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const { runId } = req.params;
    const handle = getRunHandle(runId);
    if (!handle || handle.run.userId !== userId) {
      notFound(res, "Run not found");
      return;
    }
    handle.controller.resume();
    handle.run.status = "running";
    agentEventBus.emit(makeEvent("run.status", runId, { status: "running" }));
    void updateRunStatus(runId, "running").catch(() => undefined);
    success(res, { runId, status: "running" });
  },

  /** POST /api/v2/agent/runs/:runId/cancel */
  cancel(req: Request, res: Response): void {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const { runId } = req.params;
    const handle = getRunHandle(runId);
    if (!handle || handle.run.userId !== userId) {
      notFound(res, "Run not found");
      return;
    }
    handle.controller.cancel();
    handle.run.status = "cancelled";
    agentEventBus.emit(makeEvent("run.status", runId, { status: "cancelled" }));
    void updateRunStatus(runId, "cancelled").catch(() => undefined);
    success(res, { runId, status: "cancelled" });
  },

  /** GET /api/v2/agent/runs/:runId/approvals — DB 审批记录 */
  async approvals(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const { runId } = req.params;
    const owner = await getRunDetail(userId, runId);
    if (!owner) {
      notFound(res, "Run not found");
      return;
    }
    const rows = await listApprovals(runId);
    success(res, rows);
  },

  /** POST /api/v2/agent/approvals/:id/approve */
  async approve(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const ok = await approveApproval(req.params.id, userId);
    if (!ok) {
      fail(res, "Approval not found or already settled", -1, 404);
      return;
    }
    success(res, { ok: true, status: "approved" });
  },

  /** POST /api/v2/agent/approvals/:id/reject */
  async reject(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const ok = await rejectApproval(req.params.id, userId);
    if (!ok) {
      fail(res, "Approval not found or already settled", -1, 404);
      return;
    }
    success(res, { ok: true, status: "rejected" });
  },

  /** GET /api/v2/agent/runs?page=&pageSize= — 运行历史 */
  async history(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);
    const result = await listRuns(userId, page, pageSize);
    success(res, { ...result, page, pageSize });
  },

  control(req: Request, res: Response, status: "paused"): void {
    const userId = requireUserId(req, res);
    if (userId === null) return;
    const { runId } = req.params;
    const handle = getRunHandle(runId);
    if (!handle || handle.run.userId !== userId) {
      notFound(res, "Run not found");
      return;
    }
    handle.controller.pause();
    handle.run.status = status;
    agentEventBus.emit(makeEvent("run.status", runId, { status }));
    void updateRunStatus(runId, status).catch(() => undefined);
    success(res, { runId, status });
  },
};


