/**
 * AI Resource 服务测试 — Phase 5（recordUsage / 汇总 / 成本估算 / 资源总览）
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import { recordUsage, getUsageSummary } from '../../../services/ai-resource/usage.ts'
import { estimateCost, resolveModelPricing } from '../../../services/ai-resource/cost.ts'
import { getModelCatalog, getResourceSummary } from '../../../services/ai-resource/catalog.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'ai-resource-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `res${Date.now()}`, password: 'x', email: `res${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

async function makeModel(overrides: Record<string, unknown> = {}): Promise<{
  providerId: string
  modelId: string
}> {
  const provider = await prisma.provider.create({
    data: { name: 't', baseUrl: 'http://x', protocol: 'OPENAI_COMPATIBLE', authType: 'NONE' }
  })
  const model = await prisma.model.create({
    data: {
      providerId: provider.id,
      modelName: 'm-test',
      displayName: 'Test',
      inputPrice: 1,
      outputPrice: 2,
      ...overrides
    }
  })
  return { providerId: provider.id, modelId: model.id }
}

test('recordUsage + getUsageSummary 聚合（按模型/来源/供应商 + 平均耗时）', async () => {
  const { providerId, modelId } = await makeModel()
  const provider2 = await prisma.provider.create({
    data: { name: 't2', baseUrl: 'http://y', protocol: 'OLLAMA', authType: 'NONE' }
  })
  const model2 = await prisma.model.create({
    data: { providerId: provider2.id, modelName: 'm2', displayName: 'T2' }
  })

  await recordUsage({
    userId,
    providerId,
    modelId,
    source: 'chat',
    inputTokens: 100,
    outputTokens: 50,
    latencyMs: 200
  })
  await recordUsage({
    userId,
    providerId,
    modelId,
    source: 'chat',
    inputTokens: 10,
    outputTokens: 20,
    cachedTokens: 30,
    latencyMs: 300
  })
  await recordUsage({
    userId,
    providerId: provider2.id,
    modelId: model2.id,
    source: 'agent',
    inputTokens: 1000,
    outputTokens: 500,
    runId: 'r1',
    latencyMs: 500
  })

  const summary = await getUsageSummary(userId)
  assert.equal(summary.requests, 3)
  assert.equal(summary.totalTokens, 1710)
  assert.equal(summary.inputTokens, 1110)
  assert.equal(summary.outputTokens, 570)
  assert.equal(summary.cachedTokens, 30)
  assert.equal(summary.byModel[modelId].requests, 2)
  assert.equal(summary.byModel[model2.id].totalTokens, 1500)
  assert.equal(summary.bySource['agent'].requests, 1)
  assert.equal(summary.bySource['chat'].requests, 2)
  assert.equal(summary.byProvider[providerId].requests, 2)
  assert.equal(summary.byProvider[provider2.id].requests, 1)
  // 平均耗时 (200 + 300 + 500) / 3
  assert.equal(summary.averageLatencyMs, (200 + 300 + 500) / 3)
})

test('getUsageSummary 时间范围过滤', async () => {
  await recordUsage({ userId, source: 'chat', inputTokens: 10 })
  await recordUsage({ userId, source: 'chat', inputTokens: 20 })
  const rows = await prisma.usageRecord.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'asc' }]
  })
  const from = rows[0].createdAt
  const summary = await getUsageSummary(userId, { from })
  assert.equal(summary.requests, 2)
  assert.equal(summary.totalTokens, 30)
})

test('estimatedCost：未配置价格 → 0；配置后按单价计算并快照', async () => {
  // 无模型（modelId 不存在）→ 0
  await recordUsage({ userId, modelId: 'nonexistent', source: 'chat', inputTokens: 1000 })
  let rows = await prisma.usageRecord.findMany({ where: { userId } })
  assert.equal(rows.find(r => r.modelId === 'nonexistent')?.estimatedCost, 0)

  // 配置 input=1 / output=2（USD 每百万）的模型
  const { providerId, modelId } = await makeModel()
  await recordUsage({
    userId,
    modelId,
    source: 'chat',
    inputTokens: 1_000_000,
    outputTokens: 1_000_000
  })
  rows = await prisma.usageRecord.findMany({ where: { userId } })
  const priced = rows.find(r => r.modelId === modelId)
  assert.ok(priced)
  assert.equal(priced.estimatedCost, 3) // 1M/1M*$1 + 1M/1M*$2
  assert.equal(priced.providerId, providerId)
})

test('resolveModelPricing 兼容复合 modelId "<providerId>:<modelName>"', async () => {
  const { providerId, modelId } = await makeModel()
  const direct = await resolveModelPricing(modelId)
  assert.equal(direct?.modelId, modelId)
  assert.equal(direct?.inputPrice, 1)

  const composite = await resolveModelPricing(`${providerId}:m-test`)
  assert.equal(composite?.modelId, modelId)
  assert.equal(composite?.providerId, providerId)
  assert.equal(await resolveModelPricing(undefined), null)
})

test('estimateCost：公式与边界', async () => {
  const pricing = { modelId: 'm', providerId: 'p', inputPrice: 1, outputPrice: 2 }
  assert.equal(estimateCost(pricing, { inputTokens: 0, outputTokens: 0, cachedTokens: 0 }), 0)
  assert.equal(
    estimateCost(pricing, { inputTokens: 500_000, outputTokens: 500_000, cachedTokens: 0 }),
    1.5 // 0.5*$1 + 0.5*$2
  )
  // 缓存按输入单价
  assert.equal(
    estimateCost(pricing, { inputTokens: 0, outputTokens: 0, cachedTokens: 1_000_000 }),
    1
  )
  assert.equal(estimateCost(null, { inputTokens: 1000, outputTokens: 500 }), 0)
})

test('资源总览：供应商 + 模型目录 + 用量三段', async () => {
  const { providerId, modelId } = await makeModel()
  await recordUsage({
    userId,
    providerId,
    modelId,
    source: 'chat',
    inputTokens: 1_000_000,
    outputTokens: 0
  })

  const summary = await getResourceSummary(userId)
  assert.equal(summary.providers.length, 1)
  assert.equal(summary.providers[0].name, 't')
  assert.equal(summary.providers[0].hasApiKey, false)
  assert.equal(summary.providers[0].modelCount, 1)

  assert.equal(summary.models.length, 1)
  assert.equal(summary.models[0].displayName, 'Test')
  assert.equal(summary.models[0].providerName, 't')
  assert.equal(summary.models[0].inputPrice, 1)

  assert.equal(summary.usage.total.requests, 1)
  assert.equal(summary.usage.month.requests, 1)
  assert.equal(summary.usage.today.requests, 1)
  assert.equal(summary.usage.total.estimatedCost, 1)
})

test('getModelCatalog：capabilities 解析 + 停用模型标记', async () => {
  const { providerId } = await makeModel({
    capabilities: JSON.stringify(['TEXT', 'STREAMING']),
    isEnabled: false
  })
  const provider2 = await prisma.provider.create({
    data: { name: 't2', baseUrl: 'http://y', protocol: 'OLLAMA', authType: 'NONE' }
  })
  await prisma.model.create({
    data: { providerId: provider2.id, modelName: 'm2', displayName: 'T2' }
  })

  const catalog = await getModelCatalog()
  assert.equal(catalog.length, 2)
  const disabled = catalog.find(m => m.providerId === providerId)
  assert.deepEqual(disabled?.capabilities, ['TEXT', 'STREAMING'])
  assert.equal(disabled?.isEnabled, false)
})
