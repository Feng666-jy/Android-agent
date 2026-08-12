/**
 * Workflow Engine 测试 — Phase 4（T31）
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import { executeWorkflow } from '../../../services/workflow/engine.ts'
import {
  saveWorkflow,
  getWorkflow,
  deleteWorkflow,
  listWorkflowRuns
} from '../../../services/workflow/registry.ts'
import type { WorkflowDef } from '../../../services/workflow/types.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'workflow-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `wf${Date.now()}`, password: 'x', email: `wf${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

function makeWorkflow(overrides: Partial<WorkflowDef> = {}): WorkflowDef {
  return {
    id: `wf-${Date.now()}`,
    userId,
    name: '测试工作流',
    description: '',
    trigger: 'manual',
    steps: [],
    enabled: true,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }
}

test('tool_call 顺序执行 + 变量替换（{{input}} / {{steps}}）', async () => {
  const wf = makeWorkflow({
    steps: [
      { id: 's1', type: 'tool_call', tool: 'echo_tool', args: { text: 'hello {{input.name}}' } },
      { id: 's2', type: 'tool_call', tool: 'echo_tool', args: { text: 'got {{steps.s1.output}}' } }
    ]
  })
  const calls: string[] = []
  const record = await executeWorkflow(
    wf,
    { name: 'world' },
    {
      userId,
      executeTool: async (name, args) => {
        calls.push(name)
        return { ok: true, output: `echo:${String(args.text)}` }
      }
    }
  )
  assert.equal(record.status, 'completed')
  assert.deepEqual(calls, ['echo_tool', 'echo_tool'])
  assert.equal(record.output?.s2, 'echo:got echo:hello world')
})

test('tool_call 失败 → 中止并 failed + error 记录', async () => {
  const wf = makeWorkflow({
    steps: [
      { id: 's1', type: 'tool_call', tool: 'boom', args: {} },
      { id: 's2', type: 'tool_call', tool: 'never', args: {} }
    ]
  })
  const record = await executeWorkflow(
    wf,
    {},
    {
      userId,
      executeTool: async name => {
        if (name === 'boom') return { ok: false, output: 'boom failed' }
        return { ok: true, output: 'x' }
      }
    }
  )
  assert.equal(record.status, 'failed')
  assert.match(record.error ?? '', /boom failed/)
  assert.equal(record.output, undefined)
})

test('禁止调用 run_workflow（防自递归）', async () => {
  const wf = makeWorkflow({
    steps: [{ id: 's1', type: 'tool_call', tool: 'run_workflow', args: {} }]
  })
  const record = await executeWorkflow(
    wf,
    {},
    {
      userId,
      executeTool: async () => ({ ok: true, output: 'should not run' })
    }
  )
  assert.equal(record.status, 'failed')
  assert.match(record.error ?? '', /not allowed/)
})

test('llm_call 使用注入 chat + prompt 变量替换', async () => {
  const wf = makeWorkflow({
    steps: [{ id: 's1', type: 'llm_call', prompt: '总结：{{input.topic}}' }]
  })
  const record = await executeWorkflow(
    wf,
    { topic: 'AI Agent' },
    {
      userId,
      modelId: 'm1',
      chat: async input => `回复:${input.prompt}`
    }
  )
  assert.equal(record.status, 'completed')
  assert.equal(record.output?.s1, '回复:总结：AI Agent')
})

test('memory_write 写入记忆库', async () => {
  const wf = makeWorkflow({
    steps: [
      {
        id: 's1',
        type: 'memory_write',
        memory: { kind: 'semantic', content: '用户喜欢 {{input.color}} 色', summary: '颜色偏好' }
      }
    ]
  })
  const record = await executeWorkflow(wf, { color: '蓝' }, { userId })
  assert.equal(record.status, 'completed')
  const memory = await prisma.memory.findFirst({ where: { userId } })
  assert.ok(memory)
  assert.match(memory.content, /蓝/)
  assert.equal(memory.source, 'agent')
})

test('disabled 工作流拒绝执行', async () => {
  const wf = makeWorkflow({
    enabled: false,
    steps: [{ id: 's1', type: 'tool_call', tool: 'x', args: {} }]
  })
  await assert.rejects(() => executeWorkflow(wf, {}, { userId }), /disabled/)
})

test('saveWorkflow/getWorkflow/deleteWorkflow/listWorkflowRuns 持久化链路', async () => {
  const created = await saveWorkflow(userId, {
    name: '持久化流程',
    steps: [{ id: 's1', type: 'tool_call', tool: 'battery_status', args: {} }]
  })
  assert.ok(created.id)
  const fetched = await getWorkflow(userId, created.id)
  assert.equal(fetched?.steps.length, 1)

  await executeWorkflow(
    fetched!,
    {},
    {
      userId,
      executeTool: async () => ({ ok: true, output: 'ok' })
    }
  )
  const runs = await listWorkflowRuns(userId, created.id)
  assert.equal(runs.total, 1)
  assert.equal(runs.items[0].status, 'completed')

  const updated = await saveWorkflow(userId, { id: created.id, name: '改名', steps: [] })
  assert.equal(updated.version, 2)

  assert.equal(await deleteWorkflow(userId, created.id), true)
  assert.equal(await getWorkflow(userId, created.id), null)
})
