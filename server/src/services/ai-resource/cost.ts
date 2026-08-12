/**
 * 模型计价 — AI Resource
 * 价格挂在 models.input_price / output_price（USD / 每百万 tokens）。
 * 未配置价格的模型成本估算为 0（不误计），用户可在模型管理中随时补价。
 */

import { prisma } from '../../prisma.js'

export interface ModelPriceInfo {
  modelId: string
  providerId?: string
  inputPrice: number
  outputPrice: number
}

function toPriceInfo(row: any): ModelPriceInfo {
  return {
    modelId: row.id,
    providerId: row.providerId,
    inputPrice: Number(row.inputPrice ?? 0),
    outputPrice: Number(row.outputPrice ?? 0)
  }
}

/**
 * 按 modelId 解析模型计价信息。
 * 兼容两种标识：真实模型 id，或 "<providerId>:<modelName>" 复合形式（chat 兼容层）。
 */
export async function resolveModelPricing(modelId?: string): Promise<ModelPriceInfo | null> {
  if (!modelId) return null

  const direct = await prisma.model.findUnique({ where: { id: modelId } }).catch(() => null)
  if (direct) return toPriceInfo(direct)

  const idx = modelId.indexOf(':')
  if (idx > 0) {
    const providerId = modelId.slice(0, idx)
    const modelName = modelId.slice(idx + 1)
    const found = await prisma.model
      .findFirst({ where: { providerId, modelName } })
      .catch(() => null)
    if (found) return toPriceInfo(found)
  }
  return null
}

/**
 * 估算一次调用的成本（USD，保留 6 位小数）。
 * 公式：输入(含缓存)/百万×输入单价 + 输出/百万×输出单价。
 */
export function estimateCost(
  pricing: ModelPriceInfo | null,
  tokens: { inputTokens?: number; outputTokens?: number; cachedTokens?: number }
): number {
  if (!pricing) return 0
  const input = tokens.inputTokens ?? 0
  const output = tokens.outputTokens ?? 0
  const cached = tokens.cachedTokens ?? 0
  const cost =
    ((input + cached) / 1_000_000) * pricing.inputPrice + (output / 1_000_000) * pricing.outputPrice
  return Math.round(cost * 1_000_000) / 1_000_000
}
