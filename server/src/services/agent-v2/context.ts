/**
 * Agent V2 上下文管理器 — token 预算与上下文压缩
 *
 * - estimate：按消息内容 + 工具参数估算 token（复用 llmService.countTokens，非精确）
 * - shouldCompact：达到软阈值（默认预算 80%）触发压缩
 * - compact：保留 system + 最近 keepRecent 条，更早消息折叠为一条 summary
 *   （可注入 LLM 摘要器；缺省按文本截断，保证无 LLM 依赖也能工作）
 */

import { llmService } from "../llm/index.js";
import type { ChatMessage } from "../llm/types.js";

export interface ContextManagerOptions {
  /** 硬预算：估算超过即熔断（对应 tokenBudget） */
  maxTokens: number;
  /** 软阈值：估算达到即触发压缩（默认 maxTokens * 0.8） */
  compactThreshold?: number;
  /** 压缩时保留的最近非 system 消息数（默认 6） */
  keepRecent?: number;
}

export interface CompactResult {
  messages: ChatMessage[];
  /** 被折叠的消息数 */
  dropped: number;
}

export class ContextManager {
  readonly maxTokens: number;
  readonly compactThreshold: number;
  readonly keepRecent: number;

  constructor(options: ContextManagerOptions) {
    this.maxTokens = options.maxTokens;
    this.compactThreshold = options.compactThreshold ?? Math.floor(options.maxTokens * 0.8);
    this.keepRecent = options.keepRecent ?? 6;
  }

  /** 估算当前消息总 token（含工具参数），用于预算控制 */
  estimate(messages: ChatMessage[]): number {
    let total = 0;
    for (const m of messages) {
      if (m.content) total += llmService.countTokens(m.content);
      if (m.toolCalls) {
        for (const tc of m.toolCalls) {
          total += llmService.countTokens(JSON.stringify(tc.arguments ?? {}));
        }
      }
    }
    return total;
  }

  shouldCompact(messages: ChatMessage[]): boolean {
    return this.estimate(messages) >= this.compactThreshold;
  }

  overBudget(messages: ChatMessage[]): boolean {
    return this.estimate(messages) >= this.maxTokens;
  }

  /**
   * 压缩上下文：system 消息保留；较旧的非 system 消息折叠成一条 summary。
   * @param summarize 可选 LLM 摘要器；缺省按 token 数截断文本
   */
  async compact(
    messages: ChatMessage[],
    summarize?: (older: ChatMessage[]) => Promise<string>
  ): Promise<CompactResult> {
    const system = messages.filter((m) => m.role === "system");
    const nonSystem = messages.filter((m) => m.role !== "system");
    if (nonSystem.length <= this.keepRecent) {
      return { messages, dropped: 0 };
    }
    const older = nonSystem.slice(0, nonSystem.length - this.keepRecent);
    const recent = nonSystem.slice(nonSystem.length - this.keepRecent);

    let summaryText: string;
    if (summarize) {
      summaryText = await summarize(older);
    } else {
      const raw = older
        .map((m) => (m.content ? `${m.role}: ${m.content}` : `[${m.role} 工具调用]`))
        .join("\n");
      summaryText = raw.length > 4000 ? `${raw.slice(0, 4000)}\n…(超出部分截断)` : raw;
    }

    const summary: ChatMessage = {
      role: "system",
      content: `[上下文压缩] 较早对话内容如下（勿重复执行已完成步骤）：\n${summaryText}`,
    };
    return { messages: [...system, summary, ...recent], dropped: older.length };
  }
}
