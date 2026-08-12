/**
 * Memory Compactor — Phase 4（T30）
 *
 * 把一次 Agent Run 收敛为一条 episodic 记忆（纯规则摘要，不额外调 LLM）：
 *  - 任务目标 + 最终结果 + 计划步骤 + 工具使用情况
 *  - 重要性按工具调用数/结果成功与否估算
 */

import type { AgentRunV2 } from '../agent-v2/types.js'

/** 从 run 生成记忆内容与重要性 */
export function compactRunToMemory(run: AgentRunV2): {
  content: string
  summary: string
  importance: number
} {
  const result =
    run.messages
      .filter(m => m.role === 'assistant' && m.content)
      .map(m => String(m.content ?? ''))
      .filter(Boolean)
      .pop() ?? ''
  const toolNames = new Set<string>()
  for (const m of run.messages) {
    if (m.role === 'tool' && m.toolCallId) {
      // tool 消息本身不含工具名；从 assistant toolCalls 提取
    }
    if (m.role === 'assistant' && m.toolCalls) {
      for (const tc of m.toolCalls) toolNames.add(tc.name)
    }
  }
  const planText = run.plan?.steps.map(s => s.title).join(' → ') ?? ''
  const success = run.status === 'completed'
  const importance = Math.min(1, 0.4 + run.toolCalls * 0.08 + (success ? 0.15 : 0))
  const summary =
    `${success ? '已完成' : `状态:${run.status}`}任务「${truncate(run.task, 60)}」` +
    (toolNames.size > 0 ? `，使用了 ${[...toolNames].join('/')}` : '')
  const content =
    `任务：${run.task}\n` +
    (planText ? `计划：${planText}\n` : '') +
    (toolNames.size > 0
      ? `使用工具：${[...toolNames].join(', ')}（共 ${run.toolCalls} 次）\n`
      : '') +
    (result ? `结果：${truncate(result, 400)}\n` : '') +
    `状态：${run.status}${run.error ? `（错误：${truncate(run.error, 120)}）` : ''}`
  return { content, summary, importance: Number(importance.toFixed(2)) }
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s
}
