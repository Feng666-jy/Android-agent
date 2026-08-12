/**
 * Tool 权限服务测试 — T15/T16：三级作用域 + 参数级规则
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import {
  createToolPermission,
  getValueAtPath,
  listToolPermissionRules,
  matchArgumentRule,
  parseArgumentRules,
  resolvePermissionWithRules,
  upsertToolPermission,
  type ArgumentRule
} from '../../../services/agent-v2/tool-permissions.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number
let agentId: string

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'tool-perm-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `perm${Date.now()}`, password: 'x', email: `perm${Date.now()}@t.com` }
  })
  userId = user.id
  const agent = await prisma.agent.create({
    data: { userId, name: 'a1' }
  })
  agentId = agent.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('getValueAtPath 支持点分路径', () => {
  const args = { path: '/tmp/a.txt', nested: { deep: 42 } }
  assert.equal(getValueAtPath(args, 'path'), '/tmp/a.txt')
  assert.equal(getValueAtPath(args, 'nested.deep'), 42)
  assert.equal(getValueAtPath(args, 'missing'), undefined)
})

test('matchArgumentRule：eq / contains / regex', () => {
  const eq: ArgumentRule = {
    path: 'path',
    operator: 'eq',
    value: '/etc/passwd',
    permission: 'deny'
  }
  const contains: ArgumentRule = {
    path: 'path',
    operator: 'contains',
    value: '/etc',
    permission: 'ask'
  }
  const regex: ArgumentRule = {
    path: 'path',
    operator: 'regex',
    value: '^/var/log/',
    permission: 'ask'
  }
  assert.equal(matchArgumentRule(eq, { path: '/etc/passwd' }), true)
  assert.equal(matchArgumentRule(eq, { path: '/tmp/x' }), false)
  assert.equal(matchArgumentRule(contains, { path: '/etc/hosts' }), true)
  assert.equal(matchArgumentRule(contains, { path: '/usr/bin' }), false)
  assert.equal(matchArgumentRule(regex, { path: '/var/log/syslog' }), true)
  assert.equal(matchArgumentRule(regex, { path: '/tmp/syslog' }), false)
  assert.equal(matchArgumentRule(regex, {}), false)
})

test('parseArgumentRules：非法 JSON / 非法规则被过滤', () => {
  assert.deepEqual(parseArgumentRules(null), [])
  assert.deepEqual(parseArgumentRules('not-json'), [])
  assert.deepEqual(parseArgumentRules('[]'), [])
  const rules = parseArgumentRules(
    JSON.stringify([
      { path: 'path', operator: 'contains', value: '/etc', permission: 'ask' },
      { path: 42, operator: 'bogus', permission: 'allow' },
      { path: 'x', operator: 'eq', value: '1', permission: 'deny' }
    ])
  )
  assert.equal(rules.length, 2)
})

test('resolvePermissionWithRules：三级作用域覆盖 + 参数规则优先', () => {
  const globalRule = {
    id: 'g1',
    scope: 'global' as const,
    toolName: 'write_file',
    permission: 'ask' as const,
    argumentRules: []
  }
  const userRule = {
    id: 'u1',
    scope: 'user' as const,
    userId,
    toolName: 'write_file',
    permission: 'allow' as const,
    argumentRules: []
  }
  const agentRule = {
    id: 'a1',
    scope: 'agent' as const,
    userId,
    agentId,
    toolName: 'write_file',
    permission: 'deny' as const,
    argumentRules: []
  }
  // agent > user > global
  assert.equal(
    resolvePermissionWithRules([globalRule, userRule], 'write_file', {}, 'allow'),
    'allow'
  )
  assert.equal(
    resolvePermissionWithRules([globalRule, userRule, agentRule], 'write_file', {}, 'allow'),
    'deny'
  )
  // 无规则 → fallback
  assert.equal(resolvePermissionWithRules([], 'other', {}, 'deny'), 'deny')
  // 参数规则命中（user 级）覆盖工具级 allow
  const paramRule = {
    ...userRule,
    permission: 'allow' as const,
    argumentRules: [
      { path: 'path', operator: 'contains', value: '/etc', permission: 'ask' as const }
    ]
  }
  assert.equal(
    resolvePermissionWithRules([paramRule], 'write_file', { path: '/tmp/a' }, 'allow'),
    'allow'
  )
  assert.equal(
    resolvePermissionWithRules([paramRule], 'write_file', { path: '/etc/hosts' }, 'allow'),
    'ask'
  )
})

test('DB upsert + list + 作用域查询', async () => {
  const id1 = await upsertToolPermission({
    scope: 'user',
    userId,
    toolName: 'run_command',
    permission: 'ask',
    argumentRules: [{ path: 'cmd', operator: 'contains', value: 'rm -rf', permission: 'deny' }]
  })
  assert.ok(id1)
  const id2 = await upsertToolPermission({
    scope: 'user',
    userId,
    toolName: 'run_command',
    permission: 'deny' // 同键覆盖
  })
  assert.equal(id2, id1)

  await createToolPermission({ scope: 'global', toolName: 'read_file', permission: 'allow' })
  await createToolPermission({
    scope: 'agent',
    userId,
    agentId,
    toolName: 'read_file',
    permission: 'ask'
  })

  const rules = await listToolPermissionRules(userId, agentId)
  const runCommand = rules.filter(r => r.toolName === 'run_command')
  assert.equal(runCommand.length, 1)
  assert.equal(runCommand[0].permission, 'deny')
  assert.equal(runCommand[0].argumentRules.length, 1)

  // 生效解析：agent 级 ask 覆盖 global allow
  const effective = resolvePermissionWithRules(rules, 'read_file', {}, 'allow')
  assert.equal(effective, 'ask')
  // 参数规则在 upsert 后仍生效
  const denied = resolvePermissionWithRules(rules, 'run_command', { cmd: 'rm -rf /' }, 'ask')
  assert.equal(denied, 'deny')
})
