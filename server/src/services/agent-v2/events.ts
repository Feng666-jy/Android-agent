/**
 * Agent V2 事件总线 — run 生命周期事件（SSE 数据源）
 * 事件类型与前端 src/api/agent-v2.ts 对齐；订阅方收到事件后自行过滤 runId。
 */

export type AgentEventType =
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

export interface AgentEvent {
  type: AgentEventType;
  runId: string;
  ts: string;
  data?: Record<string, unknown>;
}

type Listener = (evt: AgentEvent) => void;

export function makeEvent(
  type: AgentEventType,
  runId: string,
  data?: Record<string, unknown>
): AgentEvent {
  return { type, runId, ts: new Date().toISOString(), data };
}

/**
 * 进程内事件总线：支持按 runId 订阅（SSE 路由用），并保留最近事件用于
 * 断线重连时回放（replay）。单 run 事件上限 maxHistory，防内存膨胀。
 */
export class RunEventBus {
  private readonly listeners = new Map<string, Set<Listener>>();
  private readonly eventHistory = new Map<string, AgentEvent[]>();
  private readonly maxHistory: number;

  constructor(maxHistory = 2000) {
    this.maxHistory = maxHistory;
  }

  /** 订阅某个 run 的事件；返回取消订阅函数 */
  subscribe(runId: string, listener: Listener): () => void {
    let set = this.listeners.get(runId);
    if (!set) {
      set = new Set();
      this.listeners.set(runId, set);
    }
    set.add(listener);
    return () => {
      set.delete(listener);
      if (set.size === 0) this.listeners.delete(runId);
    };
  }

  emit(evt: AgentEvent): void {
    const set = this.listeners.get(evt.runId);
    if (set) {
      for (const listener of [...set]) {
        try {
          listener(evt);
        } catch {
          // 单个订阅方异常不影响总线
        }
      }
    }
    const list = this.eventHistory.get(evt.runId) ?? [];
    list.push(evt);
    if (list.length > this.maxHistory) list.splice(0, list.length - this.maxHistory);
    this.eventHistory.set(evt.runId, list);
  }

  /** 该 run 已产生的事件（回放用，含正在进行的） */
  history(runId: string): AgentEvent[] {
    return [...(this.eventHistory.get(runId) ?? [])];
  }

  removeRun(runId: string): void {
    this.listeners.delete(runId);
    this.eventHistory.delete(runId);
  }

  clear(): void {
    this.listeners.clear();
    this.eventHistory.clear();
  }
}

export const agentEventBus = new RunEventBus();

