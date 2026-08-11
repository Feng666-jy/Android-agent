/**
 * Agent 审批存储 — 内存态待审批队列
 *
 * 机制（借鉴 CodexPlusPlus 的 pending + 轮询审批式导入）：
 * - 权限 ask 的工具执行前，approvalHandler 在此注册一个 PendingApproval 并 await 决定
 * - 前端轮询 GET /agent/runs/:runId/approvals/pending 发现它，弹窗预览后 approve/reject
 * - approve/reject 端点通过 resolveWaiter 唤醒 await，让 runAgent 继续
 * - 超时（AGENT_APPROVAL_TIMEOUT_MS 默认 60s）或 run 取消 → 按拒绝处理
 */

import { randomUUID } from "node:crypto";
import type { ToolCall } from "../llm/types.js";

export type ApprovalDecision = "approved" | "rejected" | "timeout";

export interface PendingApproval {
  id: string;
  runId: string;
  toolCall: ToolCall;
  sandboxRoot: string;
  modelId?: string;
  task?: string;
  status: "pending" | ApprovalDecision;
  createdAt: number;
  settledAt?: number;
  /** await 中的 waiter：settle 时逐个唤醒 */
  waiters: Array<(decision: ApprovalDecision) => void>;
}

export class ApprovalStore {
  private approvals = new Map<string, PendingApproval>();
  private byRun = new Map<string, Set<string>>();

  create(input: Omit<PendingApproval, "id" | "status" | "createdAt" | "waiters">): PendingApproval {
    const approval: PendingApproval = {
      ...input,
      id: randomUUID(),
      status: "pending",
      createdAt: Date.now(),
      waiters: [],
    };
    this.approvals.set(approval.id, approval);
    const ids = this.byRun.get(approval.runId) ?? new Set<string>();
    ids.add(approval.id);
    this.byRun.set(approval.runId, ids);
    return approval;
  }

  listByRun(runId: string): PendingApproval[] {
    const ids = this.byRun.get(runId);
    if (!ids) return [];
    return [...ids].map((id) => this.approvals.get(id)).filter((a): a is PendingApproval => a !== undefined);
  }

  get(id: string): PendingApproval | undefined {
    return this.approvals.get(id);
  }

  /**
   * 作出决定：approve / reject。仅 pending 状态可 settle；
   * 已 settle（含超时）返回 false，避免重复决定。
   */
  settle(id: string, decision: ApprovalDecision): boolean {
    const approval = this.approvals.get(id);
    if (!approval || approval.status !== "pending") return false;
    approval.status = decision;
    approval.settledAt = Date.now();
    for (const waiter of approval.waiters) waiter(decision);
    approval.waiters = [];
    return true;
  }

  approve(id: string): boolean {
    return this.settle(id, "approved");
  }

  reject(id: string): boolean {
    return this.settle(id, "rejected");
  }

  /** 清理已 settle 且超过保留期的条目（防内存泄漏） */
  prune(maxAgeMs = 60_000): void {
    const now = Date.now();
    for (const [id, approval] of this.approvals) {
      if (approval.status !== "pending" && now - (approval.settledAt ?? now) > maxAgeMs) {
        this.approvals.delete(id);
        this.byRun.get(approval.runId)?.delete(id);
      }
    }
  }

  /** 清空全部（测试/重置用） */
  clear(): void {
    this.approvals.clear();
    this.byRun.clear();
  }

  /** 暴露给外部：等待决定（带超时与取消信号） */
  static waitForDecision(
    approval: PendingApproval,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<ApprovalDecision> {
    return new Promise((resolve) => {
      if (approval.status !== "pending") {
        resolve(approval.status);
        return;
      }
      let settled = false;
      const done = (d: ApprovalDecision) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
        if (approval.status === "pending") {
          approval.status = d;
          approval.settledAt = Date.now();
        }
        resolve(d);
      };
      const onAbort = () => done("rejected");
      approval.waiters.push(done);
      const timer = setTimeout(() => done("timeout"), timeoutMs);
      if (signal) {
        if (signal.aborted) {
          done("rejected");
          return;
        }
        signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }
}

/** 审批超时（ms） */
export function approvalTimeoutMs(): number {
  const v = Number(process.env.AGENT_APPROVAL_TIMEOUT_MS);
  return Number.isFinite(v) && v > 0 ? Math.min(v, 300_000) : 60_000;
}

export const approvalStore = new ApprovalStore();

/** 周期清理（可在进程启动时调用一次） */
setInterval(() => approvalStore.prune(), 30_000).unref();
