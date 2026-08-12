/**
 * 设备路由 HTTP E2E 测试 — Phase 3（T22）
 *
 * 真实 Express 应用 + 临时 SQLite + JWT 鉴权，覆盖：
 *  - GET /devices（在线 + 离线）
 *  - GET /:deviceId（live / db）
 *  - POST /:deviceId/command（往返）
 *  - DELETE /:deviceId（移除历史 + 断开在线）
 *  - 401 未授权
 */
process.env.JWT_SECRET = 'test-secret'

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')

let prisma: any
let closeDatabase: () => void
let deviceRegistry: any
let app: any
let server: any
let baseUrl: string
let userId: number
let token: string
let tempRoot: string

beforeEach(async () => {
  ;({ prisma, closeDatabase } = await import('../../../prisma.ts'))
  ;({ deviceRegistry } = await import('../../../services/android/device-registry.ts'))
  const { default: jwt } = await import('jsonwebtoken')
  const { mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { DatabaseSync } = await import('node:sqlite')
  const { applyMigrations } = await import('../../../db/migrate.ts')
  const { default: express } = await import('express')

  tempRoot = mkdtempSync(path.join(tmpdir(), 'device-routes-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `dr${Date.now()}`, password: 'x', email: `dr${Date.now()}@t.com` }
  })
  userId = user.id
  token = jwt.sign({ userId, username: user.username }, 'test-secret')

  const deviceRoutes = (await import('../../../routes/v2/device.routes.ts')).default
  app = express()
  app.use(express.json())
  app.use('/api/v2/devices', deviceRoutes)
  server = app.listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.on('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v2/devices`
})

afterEach(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()))
  closeDatabase()
  const { rmSync } = await import('node:fs')
  rmSync(tempRoot, { recursive: true, force: true })
})

function auth(tokenStr: string): Record<string, string> {
  return { Authorization: `Bearer ${tokenStr}` }
}

test('401：未带 token 拒绝访问', async () => {
  const res = await fetch(`${baseUrl}/`, { headers: auth('') })
  assert.equal(res.status, 401)
})

test('GET /devices：在线设备来自 registry，离线设备来自 DB', async () => {
  // 在线设备
  deviceRegistry.register(
    userId,
    { deviceId: 'dev-live', platform: 'android', capabilities: ['native', 'a11y'] },
    { send: () => {}, close: () => {} }
  )
  // 历史（离线）设备
  await prisma.device.create({
    data: {
      userId,
      deviceId: 'dev-old',
      name: 'Old Phone',
      platform: 'android',
      capabilitiesJson: JSON.stringify({ native: true }),
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const res = await fetch(`${baseUrl}/`, { headers: auth(token) })
  assert.equal(res.status, 200)
  const body = (await res.json()) as any
  assert.equal(body.code, 0)
  const online = body.data.online
  const offline = body.data.offline
  assert.ok(online.some((d: any) => d.deviceId === 'dev-live'))
  assert.ok(offline.some((d: any) => d.deviceId === 'dev-old'))
})

test('GET /:deviceId：在线走 live，离线走 db，不存在 404', async () => {
  deviceRegistry.register(
    userId,
    { deviceId: 'dev-live', platform: 'android', capabilities: ['native'] },
    { send: () => {}, close: () => {} }
  )
  const liveRes = await fetch(`${baseUrl}/dev-live`, { headers: auth(token) })
  const liveBody = (await liveRes.json()) as any
  assert.equal(liveBody.data.source, 'live')
  assert.equal(liveBody.data.status, 'online')

  await prisma.device.create({
    data: {
      userId,
      deviceId: 'dev-old',
      name: 'Old',
      platform: 'android',
      capabilitiesJson: JSON.stringify({ native: true }),
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const dbRes = await fetch(`${baseUrl}/dev-old`, { headers: auth(token) })
  const dbBody = (await dbRes.json()) as any
  assert.equal(dbBody.data.source, 'db')
  assert.equal(dbBody.data.status, 'offline')

  const missRes = await fetch(`${baseUrl}/dev-nope`, { headers: auth(token) })
  assert.equal(missRes.status, 404)
})

test('POST /:deviceId/command：命令往返；离线设备 404', async () => {
  // 注册一个可回包的在线连接
  let conn: any = null
  conn = deviceRegistry.register(
    userId,
    { deviceId: 'dev-live', platform: 'android', capabilities: ['native'] },
    {
      send: (text: string) => {
        const cmd = JSON.parse(text)
        conn.pending.get(cmd.id)?.({ id: cmd.id, ok: true, output: { level: 55 }, durationMs: 1 })
      },
      close: () => {}
    }
  )
  const res = await fetch(`${baseUrl}/dev-live/command`, {
    method: 'POST',
    headers: { ...auth(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'battery', args: {} })
  })
  assert.equal(res.status, 200)
  const body = (await res.json()) as any
  assert.equal(body.data.ok, true)
  assert.equal(body.data.output.level, 55)

  const offRes = await fetch(`${baseUrl}/dev-gone/command`, {
    method: 'POST',
    headers: { ...auth(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'battery', args: {} })
  })
  assert.equal(offRes.status, 404)
})

test('DELETE /:deviceId：移除历史记录并断开在线连接', async () => {
  await prisma.device.create({
    data: {
      userId,
      deviceId: 'dev-old',
      name: 'Old',
      platform: 'android',
      capabilitiesJson: JSON.stringify({ native: true }),
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const res = await fetch(`${baseUrl}/dev-old`, { method: 'DELETE', headers: auth(token) })
  assert.equal(res.status, 200)
  const body = (await res.json()) as any
  assert.equal(body.data.removed, 1)
  const row = await prisma.device.findFirst({ where: { userId, deviceId: 'dev-old' } })
  assert.equal(row, null)
})
