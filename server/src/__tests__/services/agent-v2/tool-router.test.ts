/**
 * ToolRouter 动态工具测试 — T14：内置登记/禁用 + 自定义工具 + read_skill
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import { ToolRouter, ensureBuiltinToolRows } from '../../../services/agent-v2/tool-router.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'tool-router-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `router${Date.now()}`, password: 'x', email: `router${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('sync 包含内置工具（默认全部启用）', async () => {
  const router = new ToolRouter()
  await router.sync(userId)
  assert.ok(router.has('read_file'))
  assert.ok(router.has('list_dir'))
  assert.ok(router.has('run_command'))
})

test('tools 表登记内置工具可禁用（enabled=0 移除）', async () => {
  await ensureBuiltinToolRows()
  const row = await prisma.tool.findUnique({ where: { name: 'run_command' } })
  assert.ok(row, 'run_command 已有登记行')
  await prisma.tool.update({ where: { id: row.id }, data: { enabled: false } })

  const router = new ToolRouter()
  await router.sync(userId)
  assert.equal(router.has('run_command'), false)
  assert.ok(router.has('read_file'))
  const defs = router.getDefinitions()
  assert.ok(!defs.some(d => d.function.name === 'run_command'))
})

test('自定义工具：注册后 LLM 可见且可执行', async () => {
  await prisma.tool.create({
    data: {
      userId,
      name: 'weather_now',
      description: 'Get current weather',
      parametersJson: JSON.stringify({
        type: 'object',
        properties: { city: { type: 'string' } },
        required: ['city']
      }),
      source: 'custom',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const router = new ToolRouter()
  await router.sync(userId)
  assert.ok(router.has('weather_now'))
  const def = router.getDefinitions().find(d => d.function.name === 'weather_now')
  assert.ok(def, 'LLM 可见定义包含 weather_now')
  const result = await router.execute('weather_now', { city: '上海' }, { sandboxRoot: '/tmp' })
  assert.equal(result.ok, true)
  assert.ok(result.output.includes('weather_now'))
})

test('read_skill 工具：返回 Skill 内容；未知名称给出可用列表', async () => {
  await prisma.skill.create({
    data: {
      userId,
      name: 'json-fixer',
      description: '修复 JSON',
      content: '1. 定位错误行 2. 补全括号',
      version: '1.0.0',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  const router = new ToolRouter()
  await router.sync(userId)
  assert.ok(router.has('read_skill'))

  const found = await router.execute('read_skill', { name: 'json-fixer' }, { sandboxRoot: '/tmp' })
  assert.equal(found.ok, true)
  assert.ok(found.output.includes('修复 JSON'))

  const missing = await router.execute('read_skill', { name: 'nope' }, { sandboxRoot: '/tmp' })
  assert.equal(missing.ok, false)
  assert.ok(missing.output.includes('json-fixer'))
})

test('ensureBuiltinToolRows 幂等：重复调用不报错且行数不变', async () => {
  await ensureBuiltinToolRows()
  const count1 = await prisma.tool.count({ where: { source: 'builtin' } })
  assert.ok(count1 >= 6)
  await ensureBuiltinToolRows()
  const count2 = await prisma.tool.count({ where: { source: 'builtin' } })
  assert.equal(count1, count2)
})
