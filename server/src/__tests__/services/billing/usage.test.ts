/**
 * Billing 服务测试 — Phase 5（T36：recordUsage / 汇总 / 配额 / 套餐 / 计价）
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import {
  ensureDefaultPlans,
  listPlans,
  subscribe,
  getActiveSubscription,
  cancelSubscription
} from '../../../services/billing/plans.ts'
import { upsertModelPrice, calculateCost } from '../../../services/billing/rates.ts'
import {
  recordUsage,
  getUsageSummary,
  getQuotaStatus,
  checkQuota
} from '../../../services/billing/usage.ts'
import { BillingQuotaError } from '../../../services/billing/types.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'billing-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `bill${Date.now()}`, password: 'x', email: `bill${Date.now()}@t.com` }
  })
  userId = user.id
})

async function makeModel(): Promise<string> {
  const provider = await prisma.provider.create({
    data: { name: 't', baseUrl: 'http://x', protocol: 'OPENAI_COMPATIBLE', authType: 'NONE' }
  })
  const model = await prisma.model.create({
    data: { providerId: provider.id, modelName: 'm-test', displayName: 'Test' }
  })
  return model.id
}

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('ensureDefaultPlans 幂等写入三档套餐', async () => {
  await ensureDefaultPlans()
  await ensureDefaultPlans()
  const plans = await listPlans(true)
  assert.equal(plans.length, 3)
  const codes = plans.map(p => p.code).sort()
  assert.deepEqual(codes, ['enterprise', 'free', 'pro'])
  assert.equal(plans.find(p => p.code === 'free')?.priceMonthlyCents, 0)
})

test('subscribe 切换套餐：旧订阅 canceled，新订阅 active', async () => {
  await ensureDefaultPlans()
  const first = await subscribe(userId, 'free')
  assert.equal(first.status, 'active')
  const pro = await subscribe(userId, 'pro')
  assert.equal(pro.status, 'active')
  const active = await getActiveSubscription(userId)
  assert.equal(active?.id, pro.id)
  const old = await prisma.subscription.findFirst({ where: { id: first.id } })
  assert.equal(old.status, 'canceled')
  // 过期时间 = 30 天后
  const expires = new Date(pro.expiresAt as string).getTime()
  assert.ok(expires > Date.now() + 29 * 24 * 3600 * 1000)
  await cancelSubscription(userId)
  assert.equal(await getActiveSubscription(userId), null)
})

test('recordUsage + getUsageSummary 聚合（按模型/来源）', async () => {
  await recordUsage({ userId, modelId: 'm1', source: 'chat', inputTokens: 100, outputTokens: 50 })
  await recordUsage({
    userId,
    modelId: 'm1',
    source: 'chat',
    inputTokens: 10,
    outputTokens: 20,
    cachedTokens: 30
  })
  await recordUsage({
    userId,
    modelId: 'm2',
    source: 'agent',
    inputTokens: 1000,
    outputTokens: 500,
    runId: 'r1'
  })

  const summary = await getUsageSummary(userId)
  assert.equal(summary.requests, 3)
  assert.equal(summary.totalTokens, 1710)
  assert.equal(summary.inputTokens, 1110)
  assert.equal(summary.outputTokens, 570)
  assert.equal(summary.cachedTokens, 30)
  assert.equal(summary.byModel['m1'].requests, 2)
  assert.equal(summary.byModel['m2'].totalTokens, 1500)
  assert.equal(summary.bySource['agent'].requests, 1)
  assert.equal(summary.bySource['chat'].requests, 2)
})

test('getUsageSummary 时间范围过滤', async () => {
  await recordUsage({ userId, source: 'chat', inputTokens: 10 })
  await recordUsage({ userId, source: 'chat', inputTokens: 20 })
  const rows = await prisma.usageEvent.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'asc' }]
  })
  const from = rows[0].createdAt
  const summary = await getUsageSummary(userId, { from })
  assert.equal(summary.requests, 2)
  assert.equal(summary.totalTokens, 30)
})

test('calculateCost 未配置价格 → 0；配置后按单价计算', async () => {
  assert.deepEqual(
    await calculateCost('m1', { inputTokens: 1000, outputTokens: 500, cachedTokens: 0 }),
    {
      costCents: 0,
      currency: 'CNY',
      priced: false
    }
  )
  const modelId = await makeModel()
  await upsertModelPrice(modelId, {
    inputPerMillionCents: 1000,
    outputPerMillionCents: 2000,
    cachedDiscount: 0.9
  })
  const cost = await calculateCost(modelId, {
    inputTokens: 1_000_000,
    outputTokens: 1_000_000,
    cachedTokens: 0
  })
  assert.equal(cost.costCents, 3000)
  assert.equal(cost.priced, true)
  const withCache = await calculateCost(modelId, {
    inputTokens: 0,
    outputTokens: 0,
    cachedTokens: 1_000_000
  })
  assert.equal(withCache.costCents, 900) // 1000 * 0.9
})

test('recordUsage 写成本固定（cost_cents 快照）', async () => {
  const modelId = await makeModel()
  await upsertModelPrice(modelId, { inputPerMillionCents: 1000, outputPerMillionCents: 1000 })
  await recordUsage({ userId, modelId, source: 'chat', inputTokens: 1_000_000, outputTokens: 0 })
  const rows = await prisma.usageEvent.findMany({ where: { userId } })
  assert.equal(rows[0].costCents, 1000)
})

test('配额：无订阅不限制', async () => {
  const status = await getQuotaStatus(userId)
  assert.equal(status.limited, false)
  await checkQuota(userId) // 不应抛错
})

test('配额：订阅 free 后按周期 tokens 限制，超限抛 BillingQuotaError', async () => {
  await ensureDefaultPlans()
  await subscribe(userId, 'free')
  await recordUsage({ userId, source: 'chat', inputTokens: 60_000 })
  const status = await getQuotaStatus(userId)
  assert.equal(status.limited, true)
  assert.equal(status.tokensPerMonth, 100_000)
  assert.equal(status.usedTokens, 60_000)
  assert.equal(status.remainingTokens, 40_000)
  await checkQuota(userId) // 未超限

  await recordUsage({ userId, source: 'chat', inputTokens: 40_001 })
  await assert.rejects(
    () => checkQuota(userId),
    (err: unknown) => {
      assert.ok(err instanceof BillingQuotaError)
      assert.equal((err as BillingQuotaError).statusCode, 402)
      assert.equal((err as BillingQuotaError).code, 'QUOTA_EXCEEDED')
      return true
    }
  )
})

test('配额周期重置：新订阅 quotaResetAt 起算', async () => {
  await ensureDefaultPlans()
  await subscribe(userId, 'free')
  await recordUsage({ userId, source: 'chat', inputTokens: 50_000 })
  // 切换套餐 → 新周期
  await subscribe(userId, 'pro')
  const status = await getQuotaStatus(userId)
  assert.equal(status.usedTokens, 0)
  assert.equal(status.tokensPerMonth, 5_000_000)
})
