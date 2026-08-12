// AI 资源中心 API 客户端（对齐 server/src/services/ai-resource/*）

import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// ---- 类型（对齐服务端 ai-resource 模块） ----

export type UsageSource = 'chat' | 'agent' | 'workflow' | 'api'

export interface UsageBreakdown {
  requests: number
  totalTokens: number
  estimatedCost: number
}

export interface UsageSummary {
  requests: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  averageLatencyMs: number
  estimatedCost: number
  byModel: Record<string, UsageBreakdown>
  bySource: Record<string, UsageBreakdown>
  byProvider: Record<string, UsageBreakdown>
}

export interface ProviderResourceView {
  id: string
  name: string
  baseUrl: string
  protocol: string
  isEnabled: boolean
  healthStatus: string
  lastCheckedAt: string | null
  hasApiKey: boolean
  modelCount: number
}

export interface ModelCatalogEntry {
  id: string
  modelName: string
  displayName: string
  providerId: string
  providerName: string
  protocol: string
  contextWindow: number
  maxOutputTokens: number
  capabilities: string[]
  inputPrice: number
  outputPrice: number
  isEnabled: boolean
}

export interface ResourceSummary {
  providers: ProviderResourceView[]
  models: ModelCatalogEntry[]
  usage: {
    today: UsageSummary
    month: UsageSummary
    total: UsageSummary
  }
}

// ---- API ----

export const aiResourcesAPI = {
  /** GET /v2/ai-resources/summary — 资源总览（供应商 + 模型目录 + 今日/本月/累计用量） */
  summary(): Promise<ApiResponse<ResourceSummary>> {
    return request.get('/v2/ai-resources/summary')
  },

  /** GET /v2/ai-resources/usage — 用量聚合 */
  usage(params?: {
    from?: string
    to?: string
    orgId?: string
    source?: UsageSource
  }): Promise<ApiResponse<UsageSummary>> {
    return request.get('/v2/ai-resources/usage', { params })
  },

  /** GET /v2/ai-resources/models — 模型目录 */
  models(): Promise<ApiResponse<{ items: ModelCatalogEntry[] }>> {
    return request.get('/v2/ai-resources/models')
  }
}
