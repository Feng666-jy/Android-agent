/**
 * Memory + Workflow 路由 HTTP E2E — Phase 4（T33）
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
let token: string
let tempRoot: string

beforeEach(async () => {
  ;({ prisma, closeDatabase } = await import('../../../prisma.ts'))
  const { default: jwt } = await import('jsonwebtoken')
  const { mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { DatabaseSync } = await import('node:sqlite')
  const { applyMigrations } = await import('../../../db/migrate.ts')
  const { default: express } = await import('express')

  tempRoot = mkdtempSync(path.join(tmpdir(), 'p4-routes-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `p4${Date.now()}`, password: 'x', email: `p4${Date.now()}@t.com` }
  })
  userId = user.id
  token = jwt.sign({ userId, username: user.username }, 'test-secret')

  const memoryRoutes = (await import('../../../routes/v2/memory.routes.ts')).default
  const workflowRoutes = (await import('../../../routes/v2/workflow.routes.ts')).default
  app = express()
  app.use(express.json())
  app.use('/api/v2/memories', memoryRoutes)
  app.use('/api/v2/workflows', workflowRoutes)
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

test('memories：创建 → 列表 → 更新 → 删除', async () => {
  // 创建
  const createdRes = await fetch(`${baseUrl}/memories`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ kind: 'preference', content: '回复要简洁', importance: 0.8 })
  })
  assert.equal(createdRes.status, 201)
  const created = (await createdRes.json()) as any
  assert.equal(created.data.kind, 'preference')

  // 列表（search 过滤）
  const listRes = await fetch(`${baseUrl}/memories?search=简洁`, { headers: auth(token) })
  const list = (await listRes.json()) as any
  assert.equal(list.data.total, 1)

  // 更新
  const updateRes = await fetch(`${baseUrl}/memories/${created.data.id}`, {
    method: 'PUT',
    headers: jsonAuth(token),
    body: JSON.stringify({ importance: 1 })
  })
  const updated = (await updateRes.json()) as any
  assert.equal(updated.data.importance, 1)

  // 删除
  const delRes = await fetch(`${baseUrl}/memories/${created.data.id}`, {
    method: 'DELETE',
    headers: auth(token)
  })
  assert.equal((await delRes.json()).data.ok, true)
  const afterRes = await fetch(`${baseUrl}/memories`, { headers: auth(token) })
  assert.equal((await afterRes.json()).data.total, 0)
})

test('memories：content 缺失 400 + 未授权 401', async () => {
  const badRes = await fetch(`${baseUrl}/memories`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ kind: 'semantic' })
  })
  assert.equal(badRes.status, 400)

  const noAuthRes = await fetch(`${baseUrl}/memories`, { headers: auth('') })
  assert.equal(noAuthRes.status, 401)
})

test('workflows：创建 → 执行（tool_call）→ 历史 → 删除', async () => {
  // 创建
  const createdRes = await fetch(`${baseUrl}/workflows`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({
      name: '定时报告',
      steps: [
        { id: 's1', type: 'tool_call', tool: 'echo_probe', args: { text: 'hi {{input.who}}' } }
      ]
    })
  })
  assert.equal(createdRes.status, 201)
  const created = (await createdRes.json()) as any
  const workflowId = created.data.id

  // 执行：无真实工具 → 注入失败路径（echo_probe 未知工具 → failed）
  // 此处验证 HTTP 链路与状态记录；工具往返已在 engine 测试覆盖
  const runRes = await fetch(`${baseUrl}/workflows/${workflowId}/run`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ input: { who: 'world' } })
  })
  const run = (await runRes.json()) as any
  assert.ok(['completed', 'failed'].includes(run.data.status))

  // 执行历史
  const runsRes = await fetch(`${baseUrl}/workflows/${workflowId}/runs`, { headers: auth(token) })
  const runs = (await runsRes.json()) as any
  assert.equal(runs.data.total, 1)

  // 更新（版本 +1）
  const updRes = await fetch(`${baseUrl}/workflows/${workflowId}`, {
    method: 'PUT',
    headers: jsonAuth(token),
    body: JSON.stringify({ name: '改名报告' })
  })
  const updated = (await updRes.json()) as any
  assert.equal(updated.data.version, 2)

  // 删除
  const delRes = await fetch(`${baseUrl}/workflows/${workflowId}`, {
    method: 'DELETE',
    headers: auth(token)
  })
  assert.equal((await delRes.json()).data.ok, true)
  const afterRes = await fetch(`${baseUrl}/workflows/${workflowId}`, { headers: auth(token) })
  assert.equal(afterRes.status, 404)
})

test('workflows：steps 缺失 400', async () => {
  const res = await fetch(`${baseUrl}/workflows`, {
    method: 'POST',
    headers: jsonAuth(token),
    body: JSON.stringify({ name: '无步骤' })
  })
  assert.equal(res.status, 400)
})
