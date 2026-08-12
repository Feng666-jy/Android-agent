/**
 * AI 资源聚合 — 供应商 / 模型目录 / 用量总览
 * 统一查询入口（ModelCatalog 的运行时聚合视图）。
 */

import { prisma } from '../../prisma.js'
import { getUsageSummary } from './usage.js'
import type { UsageSummary } from './types.js'

/** 模型目录条目（Model 与 Provider 的聚合视图） */
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

function parseJsonArray(raw: string | null): string[] {
  if (!raw) return []
  try {
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

/** 模型目录：Model + Provider 聚合视图 */
export async function getModelCatalog(): Promise<ModelCatalogEntry[]> {
  const [models, providers] = await Promise.all([
    prisma.model.findMany({ orderBy: [{ sortOrder: 'asc' }, { displayName: 'asc' }] }),
    prisma.provider.findMany({ orderBy: [{ sortOrder: 'asc' }] })
  ])
  const providerMap = new Map(providers.map(p => [p.id, p]))

  return models.map(m => ({
    id: m.id,
    modelName: m.modelName,
    displayName: m.displayName,
    providerId: m.providerId,
    providerName: providerMap.get(m.providerId)?.name ?? m.providerId,
    protocol: providerMap.get(m.providerId)?.protocol ?? '',
    contextWindow: m.contextWindow ?? 0,
    maxOutputTokens: m.maxOutputTokens ?? 0,
    capabilities: parseJsonArray(m.capabilities),
    inputPrice: Number(m.inputPrice ?? 0),
    outputPrice: Number(m.outputPrice ?? 0),
    isEnabled: Boolean(m.isEnabled)
  }))
}

/** 供应商视图（AI 资源聚合；key 状态 + 模型数 + 健康状态） */
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

/** 供应商资源视图 */
export async function getProviderResources(): Promise<ProviderResourceView[]> {
  const providers = await prisma.provider.findMany({
    orderBy: [{ sortOrder: 'asc' }]
  })
  const modelCounts = await prisma.model
    .findMany({ select: { providerId: true } })
    .then(rows => {
      const map = new Map<string, number>()
      for (const row of rows) {
        const id = row.providerId
        map.set(id, (map.get(id) ?? 0) + 1)
      }
      return map
    })
    .catch(() => new Map<string, number>())

  return providers.map(p => ({
    id: p.id,
    name: p.name,
    baseUrl: p.baseUrl,
    protocol: p.protocol,
    isEnabled: Boolean(p.isEnabled),
    healthStatus: p.healthStatus ?? 'UNKNOWN',
    lastCheckedAt: p.lastCheckedAt ?? null,
    hasApiKey: Boolean(p.apiKeyEncrypted),
    modelCount: modelCounts.get(p.id) ?? 0
  }))
}

/** AI 资源总览：4 卡片数据源一次返回 */
export interface ResourceSummary {
  providers: ProviderResourceView[]
  models: ModelCatalogEntry[]
  usage: {
    today: UsageSummary
    month: UsageSummary
    total: UsageSummary
  }
}

function dayStartOffset(): string {
  return new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
}

function monthStartOffset(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

/** 聚合总览：供应商 + 模型目录 + 今日/本月/累计用量 */
export async function getResourceSummary(userId: number): Promise<ResourceSummary> {
  const [providers, models, today, month, total] = await Promise.all([
    getProviderResources(),
    getModelCatalog(),
    getUsageSummary(userId, { from: dayStartOffset() }),
    getUsageSummary(userId, { from: monthStartOffset() }),
    getUsageSummary(userId)
  ])
  return { providers, models, usage: { today, month, total } }
}
