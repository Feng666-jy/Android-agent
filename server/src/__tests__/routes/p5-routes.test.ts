/**
 * Phase 5 路由 HTTP E2E — ai-resources / orgs / api-keys
 */
process.env.JWT_SECRET = 'test-secret'

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')

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
  ;({ prisma, closeDatabase } = await import('../../prisma.ts'))
  const { default: jwt } = await import('jsonwebtoken')
  const { mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { DatabaseSync } = await import('node:sqlite')
  const { applyMigrations } = await import('../../db/migrate.ts')
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

  const aiResourcesRoutes = (await import('../../routes/v2/ai-resources.routes.ts')).default
  const orgRoutes = (await import('../../routes/v2/org.routes.ts')).default
  const apiKeyRoutes = (await import('../../routes/v2/api-keys.routes.ts')).default
  app = express()
  app.use(express.json())
  app.use('/api/v2/ai-resources', aiResourcesRoutes)
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

test('ai-resources：用量写入 → 汇总 → 模型目录 → 资源总览', async () => {
  const { recordUsage } = await import('../../services/ai-resource/usage.ts')
  await recordUsage({ userId, modelId: 'm1', source: 'chat', inputTokens: 1234, outputTokens: 567 })

  const sumRes = await fetch(`${baseUrl}/ai-resources/usage`, { headers: auth(token) })
  const sum = (await sumRes.json()) as any
  assert.equal(sum.data.requests, 1)
  assert.equal(sum.data.totalTokens, 1801)
  assert.equal(sum.data.averageLatencyMs, 0)

  const modelRes = await fetch(`${baseUrl}/ai-resources/models`, { headers: auth(token) })
  assert.equal(modelRes.status, 200)

  const summaryRes = await fetch(`${baseUrl}/ai-resources/summary`, { headers: auth(token) })
  assert.equal(summaryRes.status, 200)
  const summary = (await summaryRes.json()) as any
  assert.equal(summary.data.usage.total.requests, 1)
  assert.equal(summary.data.usage.today.requests, 1)
  assert.ok(Array.isArray(summary.data.providers))
  assert.ok(Array.isArray(summary.data.models))
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
    body: JSON.stringify({ name: 'E2E Key', scope: 'all' })
  })
  assert.equal(createRes.status, 200)
  const created = (await createRes.json()) as any
  const keyId = created.data.record.id
  assert.ok(created.data.plainKey.startsWith('sk_'))
  assert.equal(created.data.record.scope, 'all')

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
  const after = await (await fetch(`${baseUrl}/api-keys`, { headers: auth(token) })).json()
  assert.equal(after.data.items[0].status, 'revoked')
})
