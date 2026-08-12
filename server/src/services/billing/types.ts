/**
 * Billing 领域类型 — Phase 5（T36 商业化：用量计费 / 配额 / 账单）
 *
 * 设计原则：
 *  - usage_events 事件溯源式：每笔 LLM 调用写一条不可变事件，账单/配额读时聚合
 *  - 成本在写入时按 model_prices 计算并固定（cost_cents），后续改价不影响历史
 *  - 配额只对「有活跃订阅」的用户生效；未订阅用户不限制（向后兼容）
 */

/** 用量来源 */
export type UsageSource = 'chat' | 'agent' | 'workflow' | 'api'

/** 用量事件写入入参 */
export interface UsageInput {
  userId: number
  orgId?: string
  modelId?: string
  runId?: string
  source?: UsageSource
  inputTokens?: number
  outputTokens?: number
  cachedTokens?: number
}

/** 用量事件实体 */
export interface UsageEventRecord {
  id: string
  userId: number
  orgId?: string
  modelId?: string
  runId?: string
  source: UsageSource
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  totalTokens: number
  costCents: number
  currency: string
  createdAt: string
}

/** 套餐额度（billing_plans.quota_json） */
export interface PlanQuota {
  tokensPerMonth?: number
  requestsPerMonth?: number
}

/** 套餐定义 */
export interface BillingPlanDef {
  id: string
  code: string
  name: string
  description: string
  priceMonthlyCents: number
  currency: string
  quota: PlanQuota
  features: string[]
  isDefault: boolean
  enabled: boolean
}

/** 订阅实体 */
export interface SubscriptionRecord {
  id: string
  userId: number
  planId: string
  status: string
  startedAt: string
  expiresAt?: string
  quotaResetAt: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/** 配额状态 */
export interface QuotaStatus {
  limited: boolean
  usedTokens: number
  tokensPerMonth?: number
  remainingTokens?: number
  plan?: BillingPlanDef
  subscription?: SubscriptionRecord
}

/** 用量聚合结果 */
export interface UsageSummary {
  requests: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  costCents: number
  currency: string
  byModel: Record<string, { requests: number; totalTokens: number; costCents: number }>
  bySource: Record<string, { requests: number; totalTokens: number; costCents: number }>
}

/** 账单行项目 */
export interface InvoiceLineItem {
  modelId?: string
  modelName?: string
  requests: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  costCents: number
}

/** 账单实体 */
export interface InvoiceRecord {
  id: string
  userId: number
  subscriptionId?: string
  periodStart: string
  periodEnd: string
  amountCents: number
  currency: string
  status: string
  lineItems: InvoiceLineItem[]
  paidAt?: string
  createdAt: string
  updatedAt: string
}

/** 配额超限错误（HTTP 402） */
export class BillingQuotaError extends Error {
  readonly statusCode = 402
  readonly code = 'QUOTA_EXCEEDED'
  usedTokens: number
  limitTokens: number

  constructor(usedTokens: number, limitTokens: number) {
    super(`Quota exceeded: used ${usedTokens} / ${limitTokens} tokens this period`)
    this.name = 'BillingQuotaError'
    this.usedTokens = usedTokens
    this.limitTokens = limitTokens
  }
}
