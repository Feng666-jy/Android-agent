/**
 * 模型计价 — Phase 5（T36）
 * model_prices：每百万 token 单价（分）；缓存命中按折扣系数计费。
 * 未配置价格的模型成本记为 0（不误收费），管理员可随时补价。
 */

import { prisma } from '../../prisma.js'

export interface ModelPriceInput {
  inputPerMillionCents?: number
  outputPerMillionCents?: number
  cachedDiscount?: number
  enabled?: boolean
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

export interface CostResult {
  costCents: number
  currency: string
  priced: boolean
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/** 行 → 领域对象 */
function toPriceRecord(row: any): ModelPriceRecord {
  return {
    id: row.id,
    modelId: row.modelId,
    currency: row.currency,
    inputPerMillionCents: row.inputPerMillionCents,
    outputPerMillionCents: row.outputPerMillionCents,
    cachedDiscount: row.cachedDiscount,
    enabled: Boolean(row.enabled),
    updatedAt: row.updatedAt
  }
}

/** 查询模型价格（enabled） */
export async function getModelPrice(modelId: string): Promise<ModelPriceRecord | null> {
  const row = await prisma.modelPrice.findFirst({ where: { modelId, enabled: true } })
  return row ? toPriceRecord(row) : null
}

/** 设置/更新模型价格（幂等 upsert：有则更新，无则创建） */
export async function upsertModelPrice(
  modelId: string,
  input: ModelPriceInput
): Promise<ModelPriceRecord> {
  const existing = await prisma.modelPrice.findFirst({ where: { modelId, currency: 'CNY' } })
  if (existing) {
    const updated = await prisma.modelPrice.update({
      where: { id: existing.id },
      data: {
        inputPerMillionCents: input.inputPerMillionCents ?? existing.inputPerMillionCents,
        outputPerMillionCents: input.outputPerMillionCents ?? existing.outputPerMillionCents,
        cachedDiscount: input.cachedDiscount ?? existing.cachedDiscount,
        enabled: input.enabled ?? existing.enabled
      }
    })
    return toPriceRecord(updated)
  }
  const created = await prisma.modelPrice.create({
    data: {
      modelId,
      currency: 'CNY',
      inputPerMillionCents: input.inputPerMillionCents ?? 0,
      outputPerMillionCents: input.outputPerMillionCents ?? 0,
      cachedDiscount: input.cachedDiscount ?? 0.9,
      enabled: input.enabled ?? true
    }
  })
  return toPriceRecord(created)
}

/** 全部价格（分页） */
export async function listModelPrices(
  page = 1,
  pageSize = 50
): Promise<{ items: ModelPriceRecord[]; total: number }> {
  const rows = await prisma.modelPrice.findMany({
    orderBy: [{ updatedAt: 'desc' }],
    skip: (page - 1) * pageSize,
    take: pageSize
  })
  const total = await prisma.modelPrice.count()
  return { items: rows.map(toPriceRecord), total }
}

/**
 * 计算一次调用的成本（分）。
 * 公式：input/1e6*输入单价 + cached/1e6*输入单价*缓存折扣 + output/1e6*输出单价
 */
export async function calculateCost(
  modelId: string | undefined,
  tokens: { inputTokens: number; outputTokens: number; cachedTokens: number }
): Promise<CostResult> {
  if (!modelId) return { costCents: 0, currency: 'CNY', priced: false }
  const price = await getModelPrice(modelId)
  if (!price) return { costCents: 0, currency: 'CNY', priced: false }

  const input = tokens.inputTokens ?? 0
  const output = tokens.outputTokens ?? 0
  const cached = tokens.cachedTokens ?? 0
  const costCents = roundToCents(
    (input / 1_000_000) * price.inputPerMillionCents +
      (cached / 1_000_000) * price.inputPerMillionCents * price.cachedDiscount +
      (output / 1_000_000) * price.outputPerMillionCents
  )
  return { costCents, currency: price.currency, priced: true }
}
