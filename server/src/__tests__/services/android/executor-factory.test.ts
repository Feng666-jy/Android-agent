/**
 * 执行器工厂测试 — Phase 3（T28 通道枚举 + 能力校验）
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  channelForKind,
  kindForDeviceTool,
  withCapabilityCheck,
  wrapWithCapabilityCheck
} from '../../../services/android/executor-factory.ts'

test('channelForKind 映射：native→STANDARD，a11y/vision→A11Y', () => {
  assert.equal(channelForKind('native'), 'STANDARD')
  assert.equal(channelForKind('a11y'), 'A11Y')
  assert.equal(channelForKind('vision'), 'A11Y')
})

test('kindForDeviceTool 按工具名归类', () => {
  assert.equal(kindForDeviceTool('battery_status'), 'native')
  assert.equal(kindForDeviceTool('launch_app'), 'native')
  assert.equal(kindForDeviceTool('get_ui_tree'), 'a11y')
  assert.equal(kindForDeviceTool('ui_back'), 'a11y')
  assert.equal(kindForDeviceTool('take_screenshot'), 'vision')
  assert.equal(kindForDeviceTool('vision_do'), 'vision')
})

test('withCapabilityCheck：能力足够时以正确通道执行', async () => {
  let calledChannel = ''
  const wrapped = withCapabilityCheck(
    async (_args, channel) => {
      calledChannel = channel
      return { ok: true, output: 'done' }
    },
    'a11y',
    () => ['native', 'a11y']
  )
  const result = await wrapped({})
  assert.equal(result.ok, true)
  assert.equal(calledChannel, 'A11Y')
})

test('withCapabilityCheck：缺少 a11y 能力返回引导提示', async () => {
  const wrapped = withCapabilityCheck(
    async () => ({ ok: true, output: '' }),
    'a11y',
    () => ['native']
  )
  const result = await wrapped({})
  assert.equal(result.ok, false)
  assert.match(result.output, /无障碍/)
})

test('withCapabilityCheck：无能力（设备离线）返回连接引导', async () => {
  const wrapped = withCapabilityCheck(
    async () => ({ ok: true, output: '' }),
    'native',
    () => []
  )
  const result = await wrapped({})
  assert.equal(result.ok, false)
  assert.match(result.output, /设备未在线/)
})

test('withCapabilityCheck：native 工具在无 a11y 设备上仍可执行', async () => {
  const wrapped = withCapabilityCheck(
    async () => ({ ok: true, output: 'battery ok' }),
    'native',
    () => ['native']
  )
  const result = await wrapped({})
  assert.equal(result.ok, true)
})

test('wrapWithCapabilityCheck 包装整组工具', async () => {
  const tools = [
    {
      name: 't1',
      description: 't',
      parameters: { type: 'object', properties: {} },
      execute: async () => ({ ok: true, output: 'x' })
    },
    {
      name: 't2',
      description: 't',
      parameters: { type: 'object', properties: {} },
      execute: async () => ({ ok: true, output: 'y' })
    }
  ] as any
  const wrapped = wrapWithCapabilityCheck(tools, 'native', () => [])
  assert.equal(wrapped.length, 2)
  const r = await wrapped[0].execute({}, { sandboxRoot: '/tmp' } as any)
  assert.equal(r.ok, false)
})
