/**
 * Phase 5 路由 HTTP E2E — billing / orgs / api-keys
 */
process.env.JWT_SECRET = 'test-secret'

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')

let prisma: any
let closeDatabase: () => void
let app: any
let server: any
let baseUrl: string
let userId: number
let otherUserId: number
let token: string
let otherToken: string
let tempRoot: string

beforeEach(async () => {
  ;({ prisma, closeDatabase } = await import('../../../prisma.ts'))
  const { default: jwt } = await import('jsonwebtoken')
  const { mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { DatabaseSync } = await import('node:sqlite')
  const { applyMigrations } = await import('../../../db/migrate.ts')
  const { default: express } = await import('express')

  tempRoot = mkdtempSync(path.join(tmpdir(), 'p5-routes-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `p5a${Date.now()}`, password: 'x', email: `p5a${Date.now()}@t.com` }
  })
  const other = await prisma.user.create({
    data: { username: `p5b${Date.now()}`, password: 'x', email: `p5b${Date.now()}@t.com` }
  })
  userId = user.id
  otherUserId = other.id
  token = jwt.sign({ userId, username: user.username }, 'test-secret')
  otherToken = jwt.sign({ userId: otherUserId, username: other.username }, 'test-secret')

  const billingRoutes = (await import('../../../routes/v2/billing.routes.ts')).default
  const orgRoutes = (await import('../../../routes/v2/org.routes.ts')).default
  const apiKeyRoutes = (await import('../../../routes/v2/api-keys.routes.ts')).default
  app = express()
  app.use(express.json())
  app.use('/api/v2/billing', billingRoutes)
  app.use('/api/v2/orgs', orgRoutes)
  app.use('/api/v2/api-keys', apiKeyRoutes)
  server = app.listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.on('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v2`
})

afterEach(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()))
  closeDatabase()
  const { rmSync } = await import('node:fs')
  rmSync(tempRoot, { recursive: true, force: true })
})

function auth(t: string): Record<string, string> {
  return { Authorization: `Bearer ${t}` }
}
function jsonAuth(t: string): Record<string, string> {
  return { ...auth(t), 'Content-Type': 'application/json' }
}

test('billing：套餐列表 → 订阅 → 用量写入 → 汇总 → 账单', async () => {
  // 套餐
  const plansRes = await fetch(`${baseUrl}/billing/plans`, { headers: auth(token) })
  assert.equal(plansRes.status, 200)
  const plans = (await plansRes.json()) as any
  assert.equal(plans.data.items.length, 3)

  // 订阅 pro
  const subRes = await fetch(`${baseUrl}/billing/subscribe`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ planCode: 'pro' })
  })
  assert.equal(subRes.status, 200)
  const sub = (await subRes.json()) as any
  assert.equal(sub.data.subscription.status, 'active')
  assert.equal(sub.data.plan.code, 'pro')

  // 直接写一条用量（模拟 LLM 埋点）
  const { recordUsage } = await import('../../../services/billing/usage.ts')
  await recordUsage({ userId, modelId: 'm1', source: 'chat', inputTokens: 1234, outputTokens: 567 })

  // 汇总
  const sumRes = await fetch(`${baseUrl}/billing/usage`, { headers: auth(token) })
  const sum = (await sumRes.json()) as any
  assert.equal(sum.data.requests, 1)
  assert.equal(sum.data.totalTokens, 1801)

  // summary 带配额
  const summaryRes = await fetch(`${baseUrl}/billing/summary`, { headers: auth(token) })
  const summary = (await summaryRes.json()) as any
  assert.equal(summary.data.quota.limited, true)
  assert.equal(summary.data.quota.usedTokens, 1801)

  // 生成账单（上月，可能为 0 也返回 draft）
  const invRes = await fetch(`${baseUrl}/billing/invoices/generate`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({})
  })
  assert.equal(invRes.status, 200)
  const inv = (await invRes.json()) as any
  assert.equal(inv.data.status, 'draft')

  // 账单列表
  const invListRes = await fetch(`${baseUrl}/billing/invoices`, { headers: auth(token) })
  const invList = (await invListRes.json()) as any
  assert.equal(invList.data.total >= 1, true)
})

test('billing：模型价格设置与查询', async () => {
  const provider = await prisma.provider.create({
    data: { name: 't', baseUrl: 'http://x', protocol: 'OPENAI_COMPATIBLE', authType: 'NONE' }
  })
  const model = await prisma.model.create({
    data: { providerId: provider.id, modelName: 'm-e2e', displayName: 'E2E' }
  })
  const putRes = await fetch(`${baseUrl}/billing/prices/${model.id}`, {
    method: 'PUT',
    headers: jsonAuth(token),
    body: JSON.stringify({ inputPerMillionCents: 1000, outputPerMillionCents: 2000 })
  })
  assert.equal(putRes.status, 200)
  const getRes = await fetch(`${baseUrl}/billing/prices/${model.id}`, { headers: auth(token) })
  const price = (await getRes.json()) as any
  assert.equal(price.data.inputPerMillionCents, 1000)
})

test('orgs：创建 → 邀请成员 → 角色变更 → 详情', async () => {
  // 创建
  const createRes = await fetch(`${baseUrl}/orgs`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ name: 'E2E 团队', description: 'test' })
  })
  assert.equal(createRes.status, 200)
  const org = (await createRes.json()) as any
  const orgId = org.data.id
  assert.equal(org.data.members.length, 1)

  // 另一个用户信息（邀请用）
  const otherUser = await prisma.user.findFirst({ where: { id: otherUserId } })

  // 添加成员
  const addRes = await fetch(`${baseUrl}/orgs/${orgId}/members`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ username: otherUser.username, role: 'admin' })
  })
  assert.equal(addRes.status, 200)
  const member = (await addRes.json()) as any
  assert.equal(member.data.role, 'admin')

  // 其他成员可见详情
  const detailRes = await fetch(`${baseUrl}/orgs/${orgId}`, { headers: auth(otherToken) })
  assert.equal(detailRes.status, 200)
  const detail = (await detailRes.json()) as any
  assert.equal(detail.data.members.length, 2)

  // 非管理成员无法加人（member 权限被降级后）
  const demoteRes = await fetch(`${baseUrl}/orgs/${orgId}/members/${otherUserId}`, {
    method: 'PUT',
    headers: jsonAuth(token),
    body: JSON.stringify({ role: 'member' })
  })
  assert.equal(demoteRes.status, 200)
  const denyRes = await fetch(`${baseUrl}/orgs/${orgId}/members`, {
    method: 'POST',
    headers: jsonAuth(otherToken),
    body: JSON.stringify({ username: otherUser.username })
  })
  assert.equal(denyRes.status, 400)

  // 移除成员
  const removeRes = await fetch(`${baseUrl}/orgs/${orgId}/members/${otherUserId}`, {
    method: 'DELETE',
    headers: auth(token)
  })
  assert.equal(removeRes.status, 200)
})

test('api-keys：创建（明文一次）→ 列表 → 更新 → 吊销', async () => {
  const createRes = await fetch(`${baseUrl}/api-keys`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ name: 'E2E Key', scope: 'billing' })
  })
  assert.equal(createRes.status, 200)
  const created = (await createRes.json()) as any
  const keyId = created.data.record.id
  assert.ok(created.data.plainKey.startsWith('sk_'))
  assert.equal(created.data.record.scope, 'billing')

  const listRes = await fetch(`${baseUrl}/api-keys`, { headers: auth(token) })
  const list = (await listRes.json()) as any
  assert.equal(list.data.items.length, 1)

  const updateRes = await fetch(`${baseUrl}/api-keys/${keyId}`, {
    method: 'PUT',
    headers: jsonAuth(token),
    body: JSON.stringify({ scope: 'agent' })
  })
  assert.equal(updateRes.status, 200)
  const updated = (await updateRes.json()) as any
  assert.equal(updated.data.scope, 'agent')

  const delRes = await fetch(`${baseUrl}/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: auth(token)
  })
  assert.equal(delRes.status, 200)
  const after = (await (await fetch(`${baseUrl}/api-keys`, { headers: auth(token) })).json()) as any
  assert.equal(after.data.items[0].status, 'revoked')
})
