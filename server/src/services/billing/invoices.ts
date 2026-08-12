/**
 * 月度账单 — Phase 5（T36）
 * 按自然月聚合 usage_events → 生成 draft 账单（line_items 按模型分组）。
 * 同一用户同一月份只生成一次（重复调用返回已有账单）。
 */

import { prisma } from '../../prisma.js'
import { getUsageSummary } from './usage.js'
import type { InvoiceLineItem, InvoiceRecord } from './types.js'

export interface MonthRange {
  /** YYYY-MM 或 "last"（默认上月） */
  period?: string
}

function parsePeriod(period: string | undefined): { start: string; end: string; label: string } {
  if (period && /^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split('-').map(Number)
    const start = new Date(Date.UTC(year, month - 1, 1))
    const end = new Date(Date.UTC(year, month, 1))
    return { start: start.toISOString(), end: end.toISOString(), label: period }
  }
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const label = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`
  return { start: start.toISOString(), end: end.toISOString(), label }
}

function toInvoice(row: any): InvoiceRecord {
  let lineItems: InvoiceLineItem[] = []
  try {
    lineItems = JSON.parse(row.lineItemsJson ?? '[]')
  } catch {
    lineItems = []
  }
  return {
    id: row.id,
    userId: row.userId,
    subscriptionId: row.subscriptionId ?? undefined,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    amountCents: row.amountCents,
    currency: row.currency,
    status: row.status,
    lineItems,
    paidAt: row.paidAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/** 生成某月账单（幂等：同月已有 → 返回已有） */
export async function generateMonthlyInvoice(
  userId: number,
  period?: string
): Promise<InvoiceRecord> {
  const range = parsePeriod(period)

  const existing = await prisma.invoice.findFirst({
    where: { userId, periodStart: range.start, periodEnd: range.end }
  })
  if (existing) return toInvoice(existing)

  const summary = await getUsageSummary(userId, { from: range.start, to: range.end })
  const lineItems: InvoiceLineItem[] = Object.entries(summary.byModel).map(([modelId, stat]) => ({
    modelId,
    requests: stat.requests,
    totalTokens: stat.totalTokens,
    inputTokens: 0,
    outputTokens: 0,
    costCents: stat.costCents
  }))

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    orderBy: [{ createdAt: 'desc' }]
  })

  const created = await prisma.invoice.create({
    data: {
      userId,
      subscriptionId: subscription?.id,
      periodStart: range.start,
      periodEnd: range.end,
      amountCents: summary.costCents,
      currency: summary.currency,
      status: 'draft',
      lineItemsJson: JSON.stringify(lineItems)
    }
  })
  return toInvoice(created)
}

/** 账单列表（分页） */
export async function listInvoices(
  userId: number,
  page = 1,
  pageSize = 20
): Promise<{ items: InvoiceRecord[]; total: number }> {
  const rows = await prisma.invoice.findMany({
    where: { userId },
    orderBy: [{ periodStart: 'desc' }],
    skip: (page - 1) * pageSize,
    take: pageSize
  })
  const total = await prisma.invoice.count({ where: { userId } })
  return { items: rows.map(toInvoice), total }
}

/** 账单详情 */
export async function getInvoice(userId: number, invoiceId: string): Promise<InvoiceRecord | null> {
  const row = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } })
  return row ? toInvoice(row) : null
}
