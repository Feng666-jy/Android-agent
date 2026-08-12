/**
 * AI Resource 领域类型
 *
 * 设计原则：
 *  - usage_records 事件溯源式：每次 LLM 调用写一条不可变记录，用量/成本读时聚合
 *  - 成本（estimated_cost，USD）在写入时按模型的 input_price/output_price 估算并固定，
 *    后续改价不影响历史
 *  - 本模块只负责"我的 AI 资源"可见性与可审计性，不含计费/配额/套餐概念
 */

/** 用量来源 */
export type UsageSource = 'chat' | 'agent' | 'workflow' | 'api'

/** 用量记录写入入参 */
export interface UsageInput {
  userId: number
  orgId?: string
  providerId?: string
  modelId?: string
  runId?: string
  source?: UsageSource
  inputTokens?: number
  outputTokens?: number
  cachedTokens?: number
  /** 单次调用耗时（毫秒），chat/流式链路填充 */
  latencyMs?: number
}

/** 用量记录实体 */
export interface UsageRecord {
  id: string
  userId: number
  orgId?: string
  providerId?: string
  modelId?: string
  runId?: string
  source: UsageSource
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  totalTokens: number
  latencyMs: number
  estimatedCost: number
  createdAt: string
}

/** 分组聚合结果（按模型 / 来源 / 供应商） */
export interface UsageBreakdown {
  requests: number
  totalTokens: number
  estimatedCost: number
}

/** 用量聚合结果 */
export interface UsageSummary {
  requests: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  /** 平均耗时（毫秒，无数据为 0） */
  averageLatencyMs: number
  estimatedCost: number
  byModel: Record<string, UsageBreakdown>
  bySource: Record<string, UsageBreakdown>
  byProvider: Record<string, UsageBreakdown>
}
