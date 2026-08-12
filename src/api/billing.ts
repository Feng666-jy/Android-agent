// 计费 API 客户端 — Phase 5 T39（与服务端 services/billing/types.ts 对齐）

import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// ---- 类型（对齐 server/src/services/billing/*） ----

export type UsageSource = 'chat' | 'agent' | 'workflow' | 'api'

export interface PlanQuota {
  tokensPerMonth?: number
  requestsPerMonth?: number
}

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

export interface SubscriptionRecord {
  id: string
  userId: number
  planId: string
  status: string
  startedAt: string
  expiresAt?: string
  quotaResetAt: string
  createdAt: string
  updatedAt: string
}

export interface QuotaStatus {
  limited: boolean
  usedTokens: number
  tokensPerMonth?: number
  remainingTokens?: number
  plan?: BillingPlanDef
  subscription?: SubscriptionRecord
}

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

export interface InvoiceLineItem {
  modelId?: string
  modelName?: string
  requests: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  costCents: number
}

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

export interface ModelPriceRecord {
  id: string
  modelId: string
  currency: string
  inputPerMillionCents: number
  outputPerMillionCents: number
  cachedDiscount: number
  enabled: boolean
  updatedAt: string
}

export interface BillingSummaryData {
  quota: QuotaStatus
  subscription: SubscriptionRecord | null
}

export interface PageResult<T> {
  items: T[]
  total: number
}

// ---- API ----

export const billingAPI = {
  /** GET /v2/billing/summary — 计费总览（订阅 + 配额） */
  summary(): Promise<ApiResponse<BillingSummaryData>> {
    return request.get('/v2/billing/summary')
  },

  /** GET /v2/billing/usage — 用量聚合 */
  usage(params?: {
    from?: string
    to?: string
    orgId?: string
    source?: UsageSource
  }): Promise<ApiResponse<UsageSummary>> {
    return request.get('/v2/billing/usage', { params })
  },

  /** GET /v2/billing/plans — 套餐列表 */
  plans(): Promise<ApiResponse<{ items: BillingPlanDef[] }>> {
    return request.get('/v2/billing/plans')
  },

  /** POST /v2/billing/subscribe — 订阅/切换套餐 */
  subscribe(
    planCode: string
  ): Promise<ApiResponse<{ subscription: SubscriptionRecord; plan: BillingPlanDef | null }>> {
    return request.post('/v2/billing/subscribe', { planCode })
  },

  /** POST /v2/billing/unsubscribe — 取消订阅 */
  unsubscribe(): Promise<ApiResponse<{ canceled: boolean }>> {
    return request.post('/v2/billing/unsubscribe')
  },

  /** GET /v2/billing/quota — 配额检查 */
  quota(): Promise<ApiResponse<{ allowed: boolean }>> {
    return request.get('/v2/billing/quota')
  },

  /** POST /v2/billing/invoices/generate — 生成月度账单（幂等） */
  generateInvoice(period?: string): Promise<ApiResponse<InvoiceRecord>> {
    return request.post('/v2/billing/invoices/generate', { period })
  },

  /** GET /v2/billing/invoices — 账单列表 */
  invoices(page = 1, pageSize = 20): Promise<ApiResponse<PageResult<InvoiceRecord>>> {
    return request.get('/v2/billing/invoices', { params: { page, pageSize } })
  },

  /** GET /v2/billing/invoices/:id — 账单详情 */
  invoice(id: string): Promise<ApiResponse<InvoiceRecord>> {
    return request.get(`/v2/billing/invoices/${id}`)
  },

  /** GET /v2/billing/prices — 模型计价列表 */
  prices(page = 1, pageSize = 50): Promise<ApiResponse<PageResult<ModelPriceRecord>>> {
    return request.get('/v2/billing/prices', { params: { page, pageSize } })
  },

  /** PUT /v2/billing/prices/:modelId — 设置模型价格 */
  upsertPrice(
    modelId: string,
    data: {
      inputPerMillionCents?: number
      outputPerMillionCents?: number
      cachedDiscount?: number
      enabled?: boolean
    }
  ): Promise<ApiResponse<ModelPriceRecord>> {
    return request.put(`/v2/billing/prices/${modelId}`, data)
  }
}
