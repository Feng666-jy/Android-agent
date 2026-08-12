import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import {
  approveApproval,
  createPersistentApprovalHandler,
  listApprovals,
  rejectApproval
} from '../../../services/agent-v2/permissions-v2.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'agent-v2-approval-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `u${Date.now()}`, password: 'x', email: `u${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

const toolCall = { id: 'call_1', name: 'write_file', arguments: { path: '/tmp/a.txt' } }

async function createRun(runId: string): Promise<void> {
  await prisma.agentRun.create({
    data: {
      id: runId,
      userId,
      status: 'running',
      task: 't',
      modelId: 'm1',
      sandboxRoot: '/tmp',
      iterations: 0,
      toolCallCount: 0,
      finishedAt: null
    }
  })
}

test('ask 审批：先落库 pending，approve 后执行并回写', async () => {
  await createRun('approval-run')
  const handler = createPersistentApprovalHandler({ runId: 'approval-run', userId })
  const execute = async () => ({ ok: true, output: 'executed' })

  const resultPromise = handler(
    { toolCall, sandboxRoot: '/tmp', permission: 'ask' as const, modelId: 'm1', task: 't' },
    execute
  )

  // 等待落库完成
  await waitFor(async () => (await listApprovals('approval-run')).length === 1)
  let rows = await listApprovals('approval-run')
  assert.equal(rows[0].status, 'pending')
  assert.equal(rows[0].toolName, 'write_file')

  const approved = await approveApproval(rows[0].id, userId)
  assert.equal(approved, true)

  const result = await resultPromise
  assert.equal(result.ok, true)
  assert.equal(result.output, 'executed')

  rows = await listApprovals('approval-run')
  assert.equal(rows[0].status, 'approved')
})

test('reject 审批：不执行并回写 rejected', async () => {
  await createRun('approval-run2')
  const handler = createPersistentApprovalHandler({ runId: 'approval-run2', userId })
  const execute = async () => ({ ok: true, output: 'should not run' })

  const resultPromise = handler(
    { toolCall, sandboxRoot: '/tmp', permission: 'ask' as const },
    execute
  )

  await waitFor(async () => (await listApprovals('approval-run2')).length === 1)
  const rows = await listApprovals('approval-run2')

  const rejected = await rejectApproval(rows[0].id, userId)
  assert.equal(rejected, true)

  const result = await resultPromise
  assert.equal(result.ok, false)
  assert.match(result.output, /not approved/)

  const after = await listApprovals('approval-run2')
  assert.equal(after[0].status, 'rejected')
})

test('非本人或已 settle 的审批不能重复决定', async () => {
  await createRun('approval-run3')
  const handler = createPersistentApprovalHandler({ runId: 'approval-run3', userId })
  const resultPromise = handler(
    { toolCall, sandboxRoot: '/tmp', permission: 'ask' as const },
    async () => ({
      ok: true,
      output: 'executed'
    })
  )

  await waitFor(async () => (await listApprovals('approval-run3')).length === 1)
  const rows = await listApprovals('approval-run3')

  assert.equal(await approveApproval(rows[0].id, userId + 1), false, '非本人不可决定')
  assert.equal(await approveApproval(rows[0].id, userId), true)
  assert.equal(await approveApproval(rows[0].id, userId), false, '已 settle 不可重复')
  await resultPromise
})

async function waitFor(fn: () => Promise<boolean> | boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now()
  for (;;) {
    if (await fn()) return
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timeout')
    await new Promise(r => setTimeout(r, 20))
  }
}
