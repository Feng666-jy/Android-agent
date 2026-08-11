/**
 * Agent V2 权限模型 — 基于 v1 allow/ask/deny 扩展（T13 审批落库）
 *
 * - 运行时权限解析复用 v1（normalizePermissionConfig / resolvePermission）
 * - ask 审批：先落库（approvals 表），再挂起等待决定，settle 后回写状态
 * - 三级作用域（user/agent/tool）持久化策略在 Phase 2 的 tool_permissions 表实现，
 *   本模块的 resolveToolPermission 为其预留统一入口
 */

import { prisma } from "../../prisma.js";
import { ApprovalStore, approvalStore, approvalTimeoutMs } from "../agent/approval-store.js";
import { normalizePermissionConfig, resolvePermission } from "../agent/permissions.js";
import type { ApprovalHandler, PermissionConfigInput, ToolPermission } from "../agent/types.js";

export { normalizePermissionConfig, resolvePermission };
export type { PermissionConfigInput, ToolPermission };

export type ApprovalStatus = "pending" | "approved" | "rejected" | "timeout";

export interface ApprovalRecord {
  id: string;
  runId: string;
  userId: number;
  toolName: string;
  argumentsJson: string;
  status: ApprovalStatus;
  modelId?: string;
  task?: string;
  createdAt: string;
  settledAt?: string;
}

/** 按 runId+工具名唤醒内存等待器（DB 行与内存 PendingApproval 通过 runId+toolName 关联） */
export function settleMemoryApproval(
  runId: string,
  toolName: string,
  decision: "approved" | "rejected"
): boolean {
  const candidates = approvalStore
    .listByRun(runId)
    .filter((a) => a.status === "pending" && a.toolCall.name === toolName);
  const target = candidates[0];
  if (!target) return false;
  return approvalStore.settle(target.id, decision);
}

export interface PersistentApprovalOptions {
  runId: string;
  userId: number;
  modelId?: string;
  task?: string;
  signal?: AbortSignal;
}

/** 查询某次 run 的全部审批记录（DB 为准，SSE / 轮询共用） */
export async function listApprovals(runId: string): Promise<ApprovalRecord[]> {
  const rows = await prisma.approval.findMany({ where: { runId } });
  return rows.map(toApprovalRecord);
}

/** 按 runId 查询待处理审批（前端审批弹窗用） */
export async function listPendingApprovals(runId: string): Promise<ApprovalRecord[]> {
  const rows = await prisma.approval.findMany({ where: { runId, status: "pending" } });
  return rows.map(toApprovalRecord);
}

/** 审批决定回写（approve/reject 接口）：DB 落库 + 唤醒内存等待器 */
async function settleApproval(
  id: string,
  decision: "approved" | "rejected",
  userId: number
): Promise<boolean> {
  const row = await prisma.approval.findUnique({ where: { id } });
  if (!row || row.userId !== userId || row.status !== "pending") return false;
  await prisma.approval.update({
    where: { id },
    data: { status: decision, settledAt: new Date() },
  });
  settleMemoryApproval(row.runId, row.toolName, decision);
  return true;
}

export async function approveApproval(id: string, userId: number): Promise<boolean> {
  return settleApproval(id, "approved", userId);
}

export async function rejectApproval(id: string, userId: number): Promise<boolean> {
  return settleApproval(id, "rejected", userId);
}

/**
 * 创建持久化审批处理器：permission=ask 时先写 approvals 表，
 * 再挂起等待决定（与 v1 ApprovalStore 内存信号兼容，前端轮询/SSE 均可响应）。
 */
export function createPersistentApprovalHandler(
  options: PersistentApprovalOptions
): ApprovalHandler {
  return async (request, execute) => {
    const row = await prisma.approval.create({
      data: {
        runId: options.runId,
        userId: options.userId,
        toolName: request.toolCall.name,
        argumentsJson: JSON.stringify(request.toolCall.arguments ?? {}),
        status: "pending",
        modelId: options.modelId ?? null,
        task: options.task ?? null,
        createdAt: new Date(),
      },
    });

    const pending = approvalStore.create({
      runId: options.runId,
      toolCall: request.toolCall,
      sandboxRoot: request.sandboxRoot,
      modelId: options.modelId,
      task: options.task,
    });

    const decision = await ApprovalStore.waitForDecision(pending, approvalTimeoutMs(), options.signal);

    await prisma.approval
      .update({ where: { id: row.id }, data: { status: decision, settledAt: new Date() } })
      .catch(() => undefined); // 回写失败不阻断执行（内存信号已生效）

    if (decision === "approved") return execute();
    return {
      ok: false,
      output: `Tool ${request.toolCall.name} requires approval and was not approved (${decision}).`,
    };
  };
}

/**
 * 工具权限解析统一入口（Phase 2 将升级为 DB 策略 user/agent/tool 三级作用域）。
 * 当前实现：运行时 config 覆盖 v1 默认策略。
 */
export function resolveToolPermission(
  config: PermissionConfigInput | undefined,
  toolName: string
): ToolPermission {
  return resolvePermission(normalizePermissionConfig(config), toolName);
}

function toApprovalRecord(row: Record<string, any>): ApprovalRecord {
  return {
    id: row.id,
    runId: row.runId,
    userId: row.userId,
    toolName: row.toolName,
    argumentsJson: row.argumentsJson,
    status: row.status,
    modelId: row.modelId ?? undefined,
    task: row.task ?? undefined,
    createdAt: row.createdAt,
    settledAt: row.settledAt ?? undefined,
  };
}


