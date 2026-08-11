/**
 * Agent 控制器 — 薄控制器
 * 只做 HTTP 解析，业务全在 services/agent。
 * Phase 4：审批（pending + 轮询）与会话落库在服务层接入。
 */

import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { runAgent } from "../services/agent/index.js";
import { approvalStore, approvalTimeoutMs, ApprovalStore } from "../services/agent/approval-store.js";
import { agentSessionService } from "../services/agent/agent-session.service.js";
import type { ApprovalHandler, AgentRunInput } from "../services/agent/types.js";
import { LlmAuthError, LlmError, LlmUnreachableError, LlmValidationError } from "../services/llm/index.js";
import { success, fail } from "../utils/response.js";
import { logger } from "../utils/logger.js";

export const agentRunSchema = z.object({
  modelId: z.string().min(1),
  task: z.string().min(1, "task must not be empty"),
  maxIterations: z.number().int().min(1).max(50).optional(),
  llmTimeoutMs: z.number().int().min(1000).max(300000).optional(),
  tokenBudget: z.number().int().min(1000).max(2000000).optional(),
  sandboxRoot: z.string().min(1).optional(),
  /** 客户端生成的相关 id：审批轮询与落库都用它，客户端在 run 进行中即可轮询 */
  clientRunId: z.string().min(8).max(64).optional(),
  permission: z
    .object({
      default: z.enum(["allow", "ask", "deny"]).optional(),
      tools: z.record(z.string(), z.enum(["allow", "ask", "deny"])).optional(),
    })
    .optional(),
});

type AgentRunBody = z.infer<typeof agentRunSchema>;

function mapError(res: Response, err: unknown, next: NextFunction): void {
  if (err instanceof LlmAuthError) {
    fail(res, err.message, err.code, 502);
    return;
  }
  if (err instanceof LlmUnreachableError) {
    fail(res, err.message, err.code, 502);
    return;
  }
  if (err instanceof LlmValidationError) {
    fail(res, err.message, err.code);
    return;
  }
  if (err instanceof LlmError) {
    fail(res, err.message, err.code, 502);
    return;
  }
  next(err);
}

/** 审批处理器：权限 ask 时挂起等待前端轮询决定 */
function createApprovalHandler(runId: string, signal?: AbortSignal): ApprovalHandler {
  return async (request, execute) => {
    const approval = approvalStore.create({
      runId,
      toolCall: request.toolCall,
      sandboxRoot: request.sandboxRoot,
      modelId: request.modelId,
      task: request.task,
    });
    const decision = await ApprovalStore.waitForDecision(approval, approvalTimeoutMs(), signal);
    if (decision === "approved") return execute();
    return {
      ok: false,
      output: `Tool ${request.toolCall.name} requires approval and was not approved (${decision}).`,
    };
  };
}

/** 简化入参供持久化使用 */
function toPersistInput(body: AgentRunBody): Pick<AgentRunInput, "modelId" | "task" | "sandboxRoot"> {
  return { modelId: body.modelId, task: body.task, sandboxRoot: body.sandboxRoot };
}

export const agentController = {
  run(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body as AgentRunBody;
    const abort = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) abort.abort();
    });

    const runId = body.clientRunId && body.clientRunId.length >= 8 ? body.clientRunId : randomUUID();
    const userId = req.user?.userId;

    return runAgent({
      modelId: body.modelId,
      task: body.task,
      maxIterations: body.maxIterations,
      llmTimeoutMs: body.llmTimeoutMs,
      tokenBudget: body.tokenBudget,
      sandboxRoot: body.sandboxRoot,
      permission: body.permission,
      approvalHandler: createApprovalHandler(runId, abort.signal),
      signal: abort.signal,
    })
      .then(async (result) => {
        if (userId !== undefined) {
          try {
            await agentSessionService.saveRun(userId, runId, toPersistInput(body), result);
          } catch (err) {
            logger.warn(`agent run persist failed: ${(err as Error)?.message ?? err}`);
          }
        }
        success(res, { runId, ...result });
      })
      .catch((err) => mapError(res, err, next));
  },

  /** GET /runs/:runId/approvals — 该 run 的待审批（pending）列表 */
  pendingApprovals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const runId = req.params.runId as string;
      const list = approvalStore.listByRun(runId).map((a) => ({
        id: a.id,
        runId: a.runId,
        toolName: a.toolCall.name,
        arguments: a.toolCall.arguments,
        sandboxRoot: a.sandboxRoot,
        status: a.status,
        createdAt: a.createdAt,
      }));
      success(res, list);
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(mapError(res, err, next));
    }
  },

  /** POST /approvals/:id/approve */
  approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = approvalStore.get(req.params.id as string);
      if (!existing) {
        fail(res, "Approval not found", 1002, 404);
        return Promise.resolve();
      }
      if (!approvalStore.approve(req.params.id as string)) {
        fail(res, "Approval already settled", 1002, 409);
        return Promise.resolve();
      }
      success(res, { ok: true, status: "approved" });
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(mapError(res, err, next));
    }
  },

  /** POST /approvals/:id/reject */
  reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = approvalStore.get(req.params.id as string);
      if (!existing) {
        fail(res, "Approval not found", 1002, 404);
        return Promise.resolve();
      }
      if (!approvalStore.reject(req.params.id as string)) {
        fail(res, "Approval already settled", 1002, 409);
        return Promise.resolve();
      }
      success(res, { ok: true, status: "rejected" });
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve(mapError(res, err, next));
    }
  },

  /** GET /runs?page=&pageSize= — 历史会话列表（稳定排序） */
  history(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (userId === undefined) {
      fail(res, "Unauthorized", 2000, 401);
      return Promise.resolve();
    }
    const rawPage = req.query.page;
    const rawSize = req.query.pageSize;
    const page = rawPage === undefined ? 1 : Number(rawPage);
    const pageSize = rawSize === undefined ? 20 : Number(rawSize);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      fail(res, "Invalid pagination", 1001, 400);
      return Promise.resolve();
    }
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    return agentSessionService.listRuns(userId, { page, pageSize, q })
      .then((data) => success(res, data))
      .catch((err) => mapError(res, err, next));
  },

  /** GET /runs/:id — 会话详情（含 messages / toolCalls / tokenEvents） */
  detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    const runId = req.params.id as string;
    if (userId === undefined) {
      fail(res, "Unauthorized", 2000, 401);
      return Promise.resolve();
    }
    return agentSessionService.getRun(userId, runId)
      .then((data) => {
        if (!data) {
          fail(res, "Agent run not found", 1002, 404);
          return;
        }
        success(res, data);
      })
      .catch((err) => mapError(res, err, next));
  },

  /** DELETE /runs/:id — 删除单个会话（级联删子表） */
  remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (userId === undefined) {
      fail(res, "Unauthorized", 2000, 401);
      return Promise.resolve();
    }
    return agentSessionService.deleteRun(userId, req.params.id as string)
      .then((deleted) => {
        if (!deleted) {
          fail(res, "Agent run not found", 1002, 404);
          return;
        }
        success(res, { deleted: true });
      })
      .catch((err) => mapError(res, err, next));
  },

  /** POST /runs/batch-delete — 批量删除（事务） */
  batchDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (userId === undefined) {
      fail(res, "Unauthorized", 2000, 401);
      return Promise.resolve();
    }
    const ids = Array.isArray((req.body as { ids?: unknown })?.ids)
      ? ((req.body as { ids: unknown[] }).ids.filter((x): x is string => typeof x === "string"))
      : [];
    return agentSessionService.deleteRuns(userId, ids)
      .then((data) => success(res, data))
      .catch((err) => mapError(res, err, next));
  },
};
