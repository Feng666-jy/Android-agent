/**
 * 月度账单测试 — Phase 5（T36）
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import { recordUsage } from '../../../services/billing/usage.ts'
import { upsertModelPrice } from '../../../services/billing/rates.ts'
import {
  generateMonthlyInvoice,
  listInvoices,
  getInvoice
} from '../../../services/billing/invoices.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'invoice-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `inv${Date.now()}`, password: 'x', email: `inv${Date.now()}@t.com` }
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

test('generateMonthlyInvoice：聚合上月用量，幂等不重复生成', async () => {
  const modelId = await makeModel()
  await upsertModelPrice(modelId, { inputPerMillionCents: 1000, outputPerMillionCents: 2000 })
  // 当月两条事件（显式 period）
  await recordUsage({ userId, modelId, source: 'chat', inputTokens: 1_000_000, outputTokens: 0 })
  await recordUsage({ userId, modelId, source: 'chat', inputTokens: 500_000, outputTokens: 0 })

  const invoice = await generateMonthlyInvoice(userId, '2026-08')
  assert.equal(invoice.status, 'draft')
  assert.equal(invoice.amountCents, 1500) // (1M + 0.5M)/1M * 1000
  assert.equal(invoice.lineItems.length, 1)
  assert.equal(invoice.lineItems[0].modelId, modelId)
  assert.equal(invoice.lineItems[0].totalTokens, 1_500_000)

  const again = await generateMonthlyInvoice(userId, '2026-08')
  assert.equal(again.id, invoice.id)
  const invoices = await listInvoices(userId)
  assert.equal(invoices.total, 1)
})

test('getInvoice 仅本人可见', async () => {
  await generateMonthlyInvoice(userId, '2026-08')
  const other = await prisma.user.create({
    data: { username: `inv2${Date.now()}`, password: 'x', email: `inv2${Date.now()}@t.com` }
  })
  const invoices = await listInvoices(userId)
  assert.equal(invoices.total, 1)
  assert.equal(await getInvoice(other.id, invoices.items[0].id), null)
  assert.ok(await getInvoice(userId, invoices.items[0].id))
})
