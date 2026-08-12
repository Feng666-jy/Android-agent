/**
 * 用量事件 — Phase 5（T36）
 * 事件溯源：每次 LLM 调用写一条 usage_events（成本写入即固定）；
 * 配额与账单均基于事件读时聚合，天然可审计。
 */

import { prisma } from '../../prisma.js'
import { logger } from '../../utils/logger.js'
import { calculateCost } from './rates.js'
import { getActiveSubscription } from './plans.js'
import type { BillingPlanDef } from './types.js'
import { BillingQuotaError, type UsageInput, type UsageSummary, type UsageSource } from './types.js'

/** 写一条用量事件（静默失败：埋点不得影响主链路） */
export async function recordUsage(input: UsageInput): Promise<void> {
  try {
    const inputTokens = input.inputTokens ?? 0
    const outputTokens = input.outputTokens ?? 0
    const cachedTokens = input.cachedTokens ?? 0
    const totalTokens = inputTokens + outputTokens + cachedTokens
    if (totalTokens <= 0 && !input.modelId) return

    const cost = await calculateCost(input.modelId, { inputTokens, outputTokens, cachedTokens })
    await prisma.usageEvent.create({
      data: {
        userId: input.userId,
        orgId: input.orgId,
        modelId: input.modelId,
        runId: input.runId,
        source: input.source ?? 'chat',
        inputTokens,
        outputTokens,
        cachedTokens,
        totalTokens,
        costCents: cost.costCents,
        currency: cost.currency
      }
    })
  } catch (err) {
    logger.warn(
      `[billing] recordUsage skipped: ${err instanceof Error ? err.message : String(err)}`
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

/** 用量聚合（读时聚合：总览 + 按模型 + 按来源） */
export async function getUsageSummary(
  userId: number,
  query: UsageQuery = {}
): Promise<UsageSummary> {
  const rows = await prisma.usageEvent.findMany({
    where: buildUsageWhere(userId, query),
    orderBy: [{ createdAt: 'asc' }]
  })

  const summary: UsageSummary = {
    requests: rows.length,
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    cachedTokens: 0,
    costCents: 0,
    currency: 'CNY',
    byModel: {},
    bySource: {}
  }

  for (const row of rows) {
    summary.totalTokens += row.totalTokens
    summary.inputTokens += row.inputTokens
    summary.outputTokens += row.outputTokens
    summary.cachedTokens += row.cachedTokens
    summary.costCents += row.costCents
    if (row.modelId) {
      const key = row.modelId
      summary.byModel[key] ??= { requests: 0, totalTokens: 0, costCents: 0 }
      summary.byModel[key].requests++
      summary.byModel[key].totalTokens += row.totalTokens
      summary.byModel[key].costCents += row.costCents
    }
    const source = row.source ?? 'chat'
    summary.bySource[source] ??= { requests: 0, totalTokens: 0, costCents: 0 }
    summary.bySource[source].requests++
    summary.bySource[source].totalTokens += row.totalTokens
    summary.bySource[source].costCents += row.costCents
  }

  return summary
}

/** 当前配额状态（无活跃订阅 → 不限制） */
export async function getQuotaStatus(userId: number): Promise<{
  limited: boolean
  usedTokens: number
  tokensPerMonth?: number
  remainingTokens?: number
  plan?: BillingPlanDef
  subscription?: Awaited<ReturnType<typeof getActiveSubscription>>
}> {
  const subscription = await getActiveSubscription(userId)
  if (!subscription) return { limited: false, usedTokens: 0 }

  const planRow = await prisma.billingPlan.findFirst({ where: { id: subscription.planId } })
  if (!planRow) return { limited: false, usedTokens: 0 }

  let quota: { tokensPerMonth?: number } = {}
  try {
    quota = JSON.parse(planRow.quotaJson ?? '{}')
  } catch {
    quota = {}
  }
  const tokensPerMonth = quota.tokensPerMonth
  if (!tokensPerMonth || tokensPerMonth <= 0) return { limited: false, usedTokens: 0 }

  const periodEvents = await prisma.usageEvent.findMany({
    where: { userId, createdAt: { gte: subscription.quotaResetAt } }
  })
  const usedTokens = periodEvents.reduce((sum, row) => sum + (row.totalTokens ?? 0), 0)

  const plan: BillingPlanDef = {
    id: planRow.id,
    code: planRow.code,
    name: planRow.name,
    description: planRow.description,
    priceMonthlyCents: planRow.priceMonthlyCents,
    currency: planRow.currency,
    quota,
    features: (() => {
      try {
        return JSON.parse(planRow.featuresJson ?? '[]')
      } catch {
        return []
      }
    })(),
    isDefault: Boolean(planRow.isDefault),
    enabled: Boolean(planRow.enabled)
  }

  return {
    limited: true,
    usedTokens,
    tokensPerMonth,
    remainingTokens: Math.max(0, tokensPerMonth - usedTokens),
    plan,
    subscription
  }
}

/** 配额检查：超限抛 BillingQuotaError（无订阅/无配额 → 放行） */
export async function checkQuota(userId: number): Promise<void> {
  const status = await getQuotaStatus(userId)
  if (!status.limited || !status.tokensPerMonth) return
  if (status.usedTokens >= status.tokensPerMonth) {
    throw new BillingQuotaError(status.usedTokens, status.tokensPerMonth)
  }
}
