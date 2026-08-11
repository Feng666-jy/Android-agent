/**
 * Agent 会话状态 — 生命周期管理
 *
 * 单个 agent 运行 = 一个 AgentSession。保存消息历史、工具记录、token 消耗。
 */

import { randomUUID } from "node:crypto";
import { llmService } from "../llm/index.js";
import type { ChatMessage, TokenUsage } from "../llm/types.js";
import type { AgentState, ToolCallRecord } from "./types.js";

export class AgentSession {
  readonly id: string;
  readonly task: string;
  readonly sandboxRoot: string;
  readonly messages: ChatMessage[];
  readonly toolHistory: ToolCallRecord[] = [];
  readonly usageHistory: Array<{ inputTokens: number; outputTokens: number; cachedTokens: number; totalTokens: number }> = [];
  tokenUsed: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  status: AgentState["status"] = "running";
  error?: string;
  readonly createdAt: string;
  finishedAt?: string;

  constructor(task: string, sandboxRoot: string) {
    this.id = randomUUID();
    this.task = task;
    this.sandboxRoot = sandboxRoot;
    this.createdAt = new Date().toISOString();
    this.messages = [];
  }

  pushMessage(msg: ChatMessage): void {
    this.messages.push(msg);
  }

  recordTool(record: ToolCallRecord): void {
    this.toolHistory.push(record);
  }

  addUsage(usage?: TokenUsage): void {
    if (!usage) return;
    this.tokenUsed = {
      inputTokens: this.tokenUsed.inputTokens + (usage.inputTokens ?? 0),
      outputTokens: this.tokenUsed.outputTokens + (usage.outputTokens ?? 0),
      totalTokens: this.tokenUsed.totalTokens + (usage.totalTokens ?? 0),
    };
    // 事件溯源式：按回合记录原始用量，读时聚合（借鉴 codex-plus-data 的 rollout token 事件）
    this.usageHistory.push({
      inputTokens: usage.inputTokens ?? 0,
      outputTokens: usage.outputTokens ?? 0,
      cachedTokens: usage.cachedTokens ?? 0,
      totalTokens: usage.totalTokens ?? this.tokenUsed.totalTokens,
    });
  }

  finish(status: Exclude<AgentState["status"], "running">, error?: string): void {
    this.status = status;
    this.error = error;
    this.finishedAt = new Date().toISOString();
  }

  /** 估算当前消息总 token（含工具回填），用于预算熔断 */
  estimateMessagesTokens(): number {
    let total = 0;
    for (const m of this.messages) {
      if (m.content) total += llmService.countTokens(m.content);
      if (m.toolCalls) {
        for (const tc of m.toolCalls) {
          total += llmService.countTokens(JSON.stringify(tc.arguments ?? {}));
        }
      }
    }
    return total;
  }

  toState(): AgentState {
    return {
      id: this.id,
      task: this.task,
      status: this.status,
      messages: this.messages,
      toolHistory: this.toolHistory,
      tokenUsed: this.tokenUsed,
      createdAt: this.createdAt,
      finishedAt: this.finishedAt,
      error: this.error,
    };
  }
}
