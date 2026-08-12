/**
 * Device Bridge WSS 端到端测试 — Phase 3（T22）
 *
 * 真实链路：http server + DeviceBridge.attach → WebSocket 客户端连接
 *  → hello 注册 → sendCommand 往返（request/response 配对）→ 超时 → 断线清理。
 *
 * 注意：bridge 内部依赖 auth.ts（模块加载时读取 JWT_SECRET），
 * 必须在设置完 env 后动态 import，避免捕获 .env 中的值。
 */
process.env.JWT_SECRET = 'test-secret'

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')

let server: any
let bridge: any
let port: number
let userId: number
let token: string
let tempRoot: string
let prisma: any
let closeDatabase: () => void
let deviceRegistry: any
let DeviceBridge: any
let WebSocket: any
let jwt: any

beforeEach(async () => {
  ;({ prisma, closeDatabase } = await import('../../../prisma.ts'))
  ;({ DeviceBridge } = await import('../../../services/android/bridge.ts'))
  ;({ deviceRegistry } = await import('../../../services/android/device-registry.ts'))
  ;({ default: WebSocket } = await import('ws'))
  ;({ default: jwt } = await import('jsonwebtoken'))

  const { mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { DatabaseSync } = await import('node:sqlite')
  const { applyMigrations } = await import('../../../db/migrate.ts')
  const { createServer } = await import('node:http')

  tempRoot = mkdtempSync(path.join(tmpdir(), 'device-bridge-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `bridge${Date.now()}`, password: 'x', email: `bridge${Date.now()}@t.com` }
  })
  userId = user.id
  token = jwt.sign({ userId, username: user.username }, 'test-secret')

  bridge = new DeviceBridge()
  server = createServer()
  bridge.attach(server, '/ws/device')
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  port = server.address().port
})

afterEach(async () => {
  bridge.close()
  await new Promise<void>(resolve => server.close(() => resolve()))
  closeDatabase()
  const { rmSync } = await import('node:fs')
  rmSync(tempRoot, { recursive: true, force: true })
})

function wsUrl(deviceId: string, t?: string): string {
  return `ws://127.0.0.1:${port}/ws/device?token=${encodeURIComponent(t ?? token)}&deviceId=${deviceId}`
}

function openWs(deviceId: string, t?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl(deviceId, t))
    ws.on('open', () => resolve(ws))
    ws.on('error', reject)
  })
}

function nextMessage(ws: any): Promise<any> {
  return new Promise(resolve => ws.once('message', (raw: any) => resolve(JSON.parse(String(raw)))))
}

function hello(deviceId: string, caps: string[] = ['native']): string {
  return JSON.stringify({
    type: 'hello',
    deviceId,
    ts: new Date().toISOString(),
    payload: {
      name: 'Test Device',
      model: 'Pixel 8',
      osVersion: '14',
      appVersion: '1.0.0',
      capabilities: caps
    }
  })
}

test('hello 注册：hello_ack + registry 在线 + devices 表持久化', async () => {
  const ws = await openWs('dev-1')
  ws.send(hello('dev-1', ['native', 'a11y', 'vision']))
  const ack = await nextMessage(ws)
  assert.equal(ack.type, 'hello_ack')
  const conn = deviceRegistry.get(userId, 'dev-1')
  assert.ok(conn, '设备已注册')
  assert.deepEqual(conn.info.capabilities, ['native', 'a11y', 'vision'])
  await new Promise(r => setTimeout(r, 100))
  const row = await prisma.device.findFirst({ where: { userId, deviceId: 'dev-1' } })
  assert.ok(row, 'devices 表已持久化')
  assert.equal(row.status, 'online')
  assert.equal(row.model, 'Pixel 8')
  ws.close()
})

test('sendCommand 往返：设备收到 command 并回 command_result', async () => {
  const ws = await openWs('dev-2')
  ws.send(hello('dev-2'))
  await nextMessage(ws) // hello_ack

  const commandPromise = nextMessage(ws)
  const resultPromise = bridge.sendCommand(userId, 'dev-2', {
    kind: 'native',
    tool: 'battery',
    args: {}
  })
  const cmd = await commandPromise
  assert.equal(cmd.type, 'command')
  assert.equal(cmd.tool, 'battery')
  assert.ok(cmd.id)

  ws.send(
    JSON.stringify({
      type: 'command_result',
      deviceId: 'dev-2',
      ts: new Date().toISOString(),
      payload: { id: cmd.id, ok: true, output: { level: 80, charging: true }, durationMs: 5 }
    })
  )
  const result = await resultPromise
  assert.equal(result.ok, true)
  assert.deepEqual(result.output, { level: 80, charging: true })
  ws.close()
})

test('sendCommandToFirst：自动选择用户在线设备', async () => {
  const ws = await openWs('dev-3')
  ws.send(hello('dev-3'))
  await nextMessage(ws)

  const commandPromise = nextMessage(ws)
  const resultPromise = bridge.sendCommandToFirst(userId, {
    kind: 'native',
    tool: 'list_files',
    args: { path: 'Download' }
  })
  const cmd = await commandPromise
  assert.equal(cmd.tool, 'list_files')
  ws.send(
    JSON.stringify({
      type: 'command_result',
      deviceId: 'dev-3',
      ts: new Date().toISOString(),
      payload: { id: cmd.id, ok: true, output: { path: '/sdcard/Download', entries: [] } }
    })
  )
  const result = await resultPromise
  assert.equal(result.ok, true)
  ws.close()
})

test('sendCommand 超时返回 ok:false（不悬挂）', async () => {
  const ws = await openWs('dev-4')
  ws.send(hello('dev-4'))
  await nextMessage(ws)
  const result = await bridge.sendCommand(
    userId,
    'dev-4',
    { kind: 'native', tool: 'battery', args: {} },
    60
  )
  assert.equal(result.ok, false)
  assert.match(result.error ?? '', /timed out/i)
  ws.close()
})

test('设备离线时 sendCommand 立即返回 Device offline', async () => {
  const result = await bridge.sendCommand(userId, 'never-connected', {
    kind: 'native',
    tool: 'battery',
    args: {}
  })
  assert.equal(result.ok, false)
  assert.equal(result.error, 'Device offline')
})

test('未授权 token 被拒绝（close 4401）', async () => {
  await new Promise<void>((resolve, reject) => {
    const ws = new WebSocket(wsUrl('dev-x', 'bad-token'))
    const timer = setTimeout(() => reject(new Error('connection not closed')), 3000)
    ws.on('close', (code: number) => {
      clearTimeout(timer)
      assert.equal(code, 4401)
      resolve()
    })
    ws.on('error', () => {})
  })
})

test('断线后 registry 移除 + devices 表标记 offline', async () => {
  const ws = await openWs('dev-5')
  ws.send(hello('dev-5'))
  await nextMessage(ws)
  await new Promise(r => setTimeout(r, 100))
  ws.close()
  await new Promise(r => setTimeout(r, 200))
  assert.equal(deviceRegistry.get(userId, 'dev-5'), undefined, 'registry 已移除')
  const row = await prisma.device.findFirst({ where: { userId, deviceId: 'dev-5' } })
  assert.ok(row)
  assert.equal(row.status, 'offline')
})
