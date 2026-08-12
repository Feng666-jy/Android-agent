/**
 * 套餐管理 — Phase 5（T36）
 * 内置 free / pro / enterprise 三档；首次访问时惰性写入（不放在迁移，避免迁移带业务数据）。
 */

import { prisma } from '../../prisma.js'
import type { BillingPlanDef, PlanQuota, SubscriptionRecord } from './types.js'

const DAY_MS = 24 * 60 * 60 * 1000

/** 内置套餐模板 */
const DEFAULT_PLANS: Array<
  Omit<BillingPlanDef, 'id' | 'isDefault' | 'enabled'> & { isDefault?: boolean }
> = [
  {
    code: 'free',
    name: '免费版',
    description: '每月 10 万 tokens 免费额度，适合体验基础 Agent 能力',
    priceMonthlyCents: 0,
    currency: 'CNY',
    quota: { tokensPerMonth: 100_000 },
    features: ['基础对话', 'Agent 运行', '1 台设备', '基础工具'],
    isDefault: true
  },
  {
    code: 'pro',
    name: '专业版',
    description: '每月 500 万 tokens，解锁高级模型与工作流',
    priceMonthlyCents: 2900,
    currency: 'CNY',
    quota: { tokensPerMonth: 5_000_000 },
    features: ['无限制对话', '高级模型', 'Workflow 引擎', '记忆系统', '5 台设备']
  },
  {
    code: 'enterprise',
    name: '企业版',
    description: '多租户组织 + API Key 对外接口，按需定制',
    priceMonthlyCents: 9900,
    currency: 'CNY',
    quota: { tokensPerMonth: 50_000_000 },
    features: ['多租户组织', 'API Key 管理', '用量账单', '专属支持']
  }
]

function parseQuota(row: any): PlanQuota {
  try {
    return JSON.parse(row.quotaJson ?? '{}')
  } catch {
    return {}
  }
}

function parseFeatures(row: any): string[] {
  try {
    return JSON.parse(row.featuresJson ?? '[]')
  } catch {
    return []
  }
}

/** 行 → 领域对象 */
export function toPlanDef(row: any): BillingPlanDef {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    priceMonthlyCents: row.priceMonthlyCents,
    currency: row.currency,
    quota: parseQuota(row),
    features: parseFeatures(row),
    isDefault: Boolean(row.isDefault),
    enabled: Boolean(row.enabled)
  }
}

/** 确保内置套餐存在（幂等，仅空表时写入） */
export async function ensureDefaultPlans(): Promise<void> {
  const count = await prisma.billingPlan.count()
  if (count > 0) return
  for (const plan of DEFAULT_PLANS) {
    await prisma.billingPlan.create({
      data: {
        code: plan.code,
        name: plan.name,
        description: plan.description,
        priceMonthlyCents: plan.priceMonthlyCents,
        currency: plan.currency,
        quotaJson: JSON.stringify(plan.quota),
        featuresJson: JSON.stringify(plan.features),
        isDefault: Boolean(plan.isDefault),
        enabled: true
      }
    })
  }
}

/** 套餐列表 */
export async function listPlans(enabledOnly = true): Promise<BillingPlanDef[]> {
  await ensureDefaultPlans()
  const rows = await prisma.billingPlan.findMany({
    where: enabledOnly ? { enabled: true } : undefined,
    orderBy: [{ priceMonthlyCents: 'asc' }]
  })
  return rows.map(toPlanDef)
}

/** 按 code 查套餐 */
export async function getPlanByCode(code: string): Promise<BillingPlanDef | null> {
  await ensureDefaultPlans()
  const row = await prisma.billingPlan.findFirst({ where: { code } })
  return row ? toPlanDef(row) : null
}

/** 用户当前活跃订阅（active 且未过期） */
export async function getActiveSubscription(userId: number): Promise<SubscriptionRecord | null> {
  const row = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    orderBy: [{ createdAt: 'desc' }]
  })
  if (!row) return null
  if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) return null
  return {
    id: row.id,
    userId: row.userId,
    planId: row.planId,
    status: row.status,
    startedAt: row.startedAt,
    expiresAt: row.expiresAt ?? undefined,
    quotaResetAt: row.quotaResetAt,
    metadata: (() => {
      try {
        return JSON.parse(row.metadataJson ?? '{}')
      } catch {
        return {}
      }
    })(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/** 订阅/切换套餐：旧订阅置 canceled，新建 active（周期 30 天，配额从新周期起算） */
export async function subscribe(userId: number, planCode: string): Promise<SubscriptionRecord> {
  const plan = await getPlanByCode(planCode)
  if (!plan) throw new Error(`Plan not found: ${planCode}`)
  if (!plan.enabled) throw new Error(`Plan is disabled: ${planCode}`)

  const active = await getActiveSubscription(userId)
  if (active) {
    await prisma.subscription.updateMany({
      where: { id: active.id, userId },
      data: { status: 'canceled' }
    })
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * DAY_MS).toISOString()
  const created = await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      status: 'active',
      startedAt: now,
      expiresAt,
      quotaResetAt: now,
      metadataJson: '{}'
    }
  })
  return {
    id: created.id,
    userId: created.userId,
    planId: created.planId,
    status: created.status,
    startedAt: created.startedAt,
    expiresAt: created.expiresAt ?? undefined,
    quotaResetAt: created.quotaResetAt,
    metadata: {},
    createdAt: created.createdAt,
    updatedAt: created.updatedAt
  }
}

/** 取消订阅 */
export async function cancelSubscription(userId: number): Promise<boolean> {
  const result = await prisma.subscription.updateMany({
    where: { userId, status: 'active' },
    data: { status: 'canceled' }
  })
  return result.count > 0
}
