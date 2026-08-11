/**
 * 运行句柄注册表 — 控制接口（pause/resume/cancel）与实时状态读取
 * 进程内 Map；已完成运行超过保留期自动清理。
 */

import type { AgentRunV2, RunController } from "./types.js";

export interface RunHandle {
  run: AgentRunV2;
  controller: RunController;
}

const runs = new Map<string, RunHandle>();

export function registerRun(handle: RunHandle): void {
  runs.set(handle.run.id, handle);
}

export function getRunHandle(runId: string): RunHandle | undefined {
  return runs.get(runId);
}

export function unregisterRun(runId: string): void {
  runs.delete(runId);
}

export function listLiveRuns(): AgentRunV2[] {
  return [...runs.values()].map((h) => h.run);
}

/** 清理终态且超过保留期的运行（防内存泄漏）；默认保留 1 小时 */
export function pruneRuns(maxAgeMs = 3_600_000): void {
  const now = Date.now();
  const terminal = new Set(["completed", "failed", "cancelled", "budget_exceeded"]);
  for (const [id, handle] of runs) {
    const finished = handle.run.finishedAt ? Date.parse(handle.run.finishedAt) : NaN;
    if (terminal.has(handle.run.status) && (Number.isNaN(finished) || now - finished > maxAgeMs)) {
      runs.delete(id);
    }
  }
}

setInterval(() => pruneRuns(), 60_000).unref();
