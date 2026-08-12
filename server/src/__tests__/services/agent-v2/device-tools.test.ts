/**
 * ToolRouter 设备工具集成测试 — Phase 3（T23/T25/T26 工具动态注册 + 能力校验）
 */
process.env.JWT_SECRET = 'test-secret'

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import { ToolRouter } from '../../../services/agent-v2/tool-router.ts'
import { deviceRegistry } from '../../../services/android/device-registry.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'device-tools-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `dt${Date.now()}`, password: 'x', email: `dt${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('无设备记录的用户：不注册 device 工具（不占用 LLM 工具位）', async () => {
  const router = new ToolRouter()
  await router.sync(userId)
  assert.equal(router.has('battery_status'), false)
  assert.equal(router.has('get_ui_tree'), false)
  assert.equal(router.has('take_screenshot'), false)
  assert.ok(router.has('read_file'), '基础工具不受影响')
})

test('有历史设备记录：注册全部 12 个 device 工具', async () => {
  await prisma.device.create({
    data: {
      userId,
      deviceId: 'dev-hist',
      name: 'Old Pixel',
      platform: 'android',
      capabilitiesJson: JSON.stringify({ native: true }),
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const router = new ToolRouter()
  await router.sync(userId)
  const expected = [
    'battery_status',
    'launch_app',
    'send_notification',
    'list_device_files',
    'get_ui_tree',
    'ui_find',
    'ui_click',
    'ui_input',
    'ui_swipe',
    'ui_back',
    'take_screenshot',
    'vision_do'
  ]
  for (const name of expected) assert.ok(router.has(name), `已注册 ${name}`)
  const defs = router.getDefinitions()
  for (const name of expected) {
    assert.ok(
      defs.some(d => d.function.name === name),
      `LLM 可见 ${name}`
    )
  }
})

test('离线设备执行：返回连接引导而非超时', async () => {
  await prisma.device.create({
    data: {
      userId,
      deviceId: 'dev-off',
      name: 'Offline',
      platform: 'android',
      capabilitiesJson: JSON.stringify({ native: true }),
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const router = new ToolRouter()
  await router.sync(userId)
  const result = await router.execute('battery_status', {}, { sandboxRoot: '/tmp' })
  assert.equal(result.ok, false)
  assert.match(result.output, /设备未在线/)
})

test('在线设备能力不足：返回 a11y 授权引导', async () => {
  deviceRegistry.register(
    userId,
    { deviceId: 'dev-on', platform: 'android', capabilities: ['native'] },
    { send: () => {}, close: () => {} }
  )
  const router = new ToolRouter()
  await router.sync(userId)
  const result = await router.execute('get_ui_tree', {}, { sandboxRoot: '/tmp' })
  assert.equal(result.ok, false)
  assert.match(result.output, /无障碍/)
})

test('在线设备 native 工具：命令经 DeviceBridge 往返成功', async () => {
  const conn = deviceRegistry.register(
    userId,
    { deviceId: 'dev-on', platform: 'android', capabilities: ['native'] },
    {
      send: text => {
        const cmd = JSON.parse(text)
        conn.pending.get(cmd.id)?.({
          id: cmd.id,
          ok: true,
          output: { level: 66, charging: false },
          durationMs: 1
        })
      },
      close: () => {}
    }
  )
  const router = new ToolRouter()
  await router.sync(userId)
  const result = await router.execute('battery_status', {}, { sandboxRoot: '/tmp' })
  assert.equal(result.ok, true)
  assert.match(result.output, /66/)
})

test('在线设备 a11y 工具：能力齐备时命令可往返', async () => {
  const conn = deviceRegistry.register(
    userId,
    { deviceId: 'dev-full', platform: 'android', capabilities: ['native', 'a11y'] },
    {
      send: text => {
        const cmd = JSON.parse(text)
        conn.pending.get(cmd.id)?.({ id: cmd.id, ok: true, output: { back: true }, durationMs: 1 })
      },
      close: () => {}
    }
  )
  const router = new ToolRouter()
  await router.sync(userId)
  const result = await router.execute('ui_back', {}, { sandboxRoot: '/tmp' })
  assert.equal(result.ok, true)
  assert.match(result.output, /back/)
})
