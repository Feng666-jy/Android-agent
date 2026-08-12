/**
 * 用量记录 — AI Resource
 * 事件溯源：每次 LLM 调用写一条 usage_records（成本写入即估算固定）；
 * 用量与成本均基于记录读时聚合，天然可审计。
 */

import { prisma } from '../../prisma.js'
import { logger } from '../../utils/logger.js'
import { estimateCost, resolveModelPricing } from './cost.js'
import type { UsageBreakdown, UsageInput, UsageSource, UsageSummary } from './types.js'

/** 写一条用量记录（静默失败：埋点不得影响主链路） */
export async function recordUsage(input: UsageInput): Promise<void> {
  try {
    const inputTokens = input.inputTokens ?? 0
    const outputTokens = input.outputTokens ?? 0
    const cachedTokens = input.cachedTokens ?? 0
    const totalTokens = inputTokens + outputTokens + cachedTokens
    if (totalTokens <= 0 && !input.modelId) return

    const pricing = await resolveModelPricing(input.modelId)
    const estimatedCost = estimateCost(pricing, { inputTokens, outputTokens, cachedTokens })

    await prisma.usageRecord.create({
      data: {
        userId: input.userId,
        orgId: input.orgId,
        providerId: input.providerId ?? pricing?.providerId,
        modelId: input.modelId,
        runId: input.runId,
        source: input.source ?? 'chat',
        inputTokens,
        outputTokens,
        cachedTokens,
        totalTokens,
        latencyMs: input.latencyMs ?? 0,
        estimatedCost
      }
    })
  } catch (err) {
    logger.warn(
      `[ai-resource] recordUsage skipped: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

/** 时间范围查询参数 */
export interface UsageQuery {
  from?: string
  to?: string
  orgId?: string
  source?: UsageSource
}

function buildUsageWhere(userId: number, query: UsageQuery): Record<string, unknown> {
  const where: Record<string, unknown> = { userId }
  if (query.orgId) where.orgId = query.orgId
  if (query.source) where.source = query.source
  const time: Record<string, unknown> = {}
  if (query.from) time.gte = query.from
  if (query.to) time.lte = query.to
  if (Object.keys(time).length > 0) where.createdAt = time
  return where
}

function emptyBreakdown(): UsageBreakdown {
  return { requests: 0, totalTokens: 0, estimatedCost: 0 }
}

/** 用量聚合（读时聚合：总览 + 平均耗时 + 按模型/来源/供应商） */
export async function getUsageSummary(
  userId: number,
  query: UsageQuery = {}
): Promise<UsageSummary> {
  const rows = await prisma.usageRecord.findMany({
    where: buildUsageWhere(userId, query),
    orderBy: [{ createdAt: 'asc' }]
  })

  const summary: UsageSummary = {
    requests: rows.length,
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    cachedTokens: 0,
    averageLatencyMs: 0,
    estimatedCost: 0,
    byModel: {},
    bySource: {},
    byProvider: {}
  }

  let latencyTotal = 0
  for (const row of rows) {
    summary.totalTokens += row.totalTokens
    summary.inputTokens += row.inputTokens
    summary.outputTokens += row.outputTokens
    summary.cachedTokens += row.cachedTokens
    summary.estimatedCost += row.estimatedCost
    latencyTotal += row.latencyMs ?? 0

    if (row.modelId) {
      const key = row.modelId
      summary.byModel[key] ??= emptyBreakdown()
      summary.byModel[key].requests++
      summary.byModel[key].totalTokens += row.totalTokens
      summary.byModel[key].estimatedCost += row.estimatedCost
    }
    if (row.providerId) {
      const key = row.providerId
      summary.byProvider[key] ??= emptyBreakdown()
      summary.byProvider[key].requests++
      summary.byProvider[key].totalTokens += row.totalTokens
      summary.byProvider[key].estimatedCost += row.estimatedCost
    }
    const source = row.source ?? 'chat'
    summary.bySource[source] ??= emptyBreakdown()
    summary.bySource[source].requests++
    summary.bySource[source].totalTokens += row.totalTokens
    summary.bySource[source].estimatedCost += row.estimatedCost
  }
  if (rows.length > 0) summary.averageLatencyMs = latencyTotal / rows.length

  return summary
}
