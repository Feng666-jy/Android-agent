/**
 * DeviceRegistry 测试 — Phase 3（T22 在线设备注册表）
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DeviceRegistry, connectionToRecord } from '../../../services/android/device-registry.ts'

function register(
  registry: DeviceRegistry,
  userId: number,
  deviceId: string,
  capabilities: string[],
  closed: string[] = []
) {
  return registry.register(
    userId,
    { deviceId, platform: 'android', capabilities: capabilities as any },
    { send: () => {}, close: (code?: number, reason?: string) => closed.push(`${code}:${reason}`) }
  )
}

test('register 后设备在线且可查询', () => {
  const registry = new DeviceRegistry()
  register(registry, 1, 'dev-a', ['native'])
  assert.equal(registry.size(), 1)
  assert.ok(registry.get(1, 'dev-a'))
  assert.equal(registry.listOnline(1).length, 1)
  assert.equal(registry.listOnline(2).length, 0)
})

test('同一设备重复注册：新连接顶掉旧连接', () => {
  const registry = new DeviceRegistry()
  const closed: string[] = []
  register(registry, 1, 'dev-a', ['native'], closed)
  register(registry, 1, 'dev-a', ['native', 'a11y'], closed)
  assert.equal(registry.size(), 1)
  assert.match(closed[0] ?? '', /replaced by new connection/)
  assert.deepEqual(registry.get(1, 'dev-a')!.info.capabilities, ['native', 'a11y'])
})

test('unregister 后设备离线', () => {
  const registry = new DeviceRegistry()
  register(registry, 1, 'dev-a', ['native'])
  assert.ok(registry.unregister(1, 'dev-a'))
  assert.equal(registry.get(1, 'dev-a'), undefined)
  assert.equal(registry.size(), 0)
})

test('firstOnline 优先 a11y 能力全的设备', () => {
  const registry = new DeviceRegistry()
  register(registry, 1, 'dev-native', ['native'])
  register(registry, 1, 'dev-full', ['native', 'a11y', 'vision'])
  const picked = registry.firstOnline(1)
  assert.equal(picked?.deviceId, 'dev-full')
})

test('firstOnline 无设备时返回 undefined', () => {
  const registry = new DeviceRegistry()
  assert.equal(registry.firstOnline(1), undefined)
})

test('touch 更新 lastSeenAt', () => {
  const registry = new DeviceRegistry()
  register(registry, 1, 'dev-a', ['native'])
  const before = registry.get(1, 'dev-a')!.lastSeenAt
  registry.touch(1, 'dev-a')
  const after = registry.get(1, 'dev-a')!.lastSeenAt
  assert.ok(after >= before)
})

test('connectionToRecord 输出 REST 设备记录', () => {
  const registry = new DeviceRegistry()
  const conn = register(registry, 7, 'dev-7', ['native', 'a11y'])
  conn.info.model = 'Pixel 8'
  const record = connectionToRecord(conn)
  assert.equal(record.userId, 7)
  assert.equal(record.deviceId, 'dev-7')
  assert.equal(record.status, 'online')
  assert.deepEqual(record.capabilities, ['native', 'a11y'])
  assert.equal(record.platform, 'android')
})
