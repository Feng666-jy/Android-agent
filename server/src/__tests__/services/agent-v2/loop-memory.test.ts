/**
 * Agent Loop 记忆集成测试 — Phase 4（T32）
 * 1) 运行前注入相关记忆（system prompt 含记忆块）
 * 2) 运行结束后自动写入 episodic 记忆
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mock } from 'node:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { AgentLoop } from '../../../services/agent-v2/loop.ts'
import { llmService } from '../../../services/llm/index.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import { saveMemory } from '../../../services/memory/index.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'loop-memory-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `lm${Date.now()}`, password: 'x', email: `lm${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  mock.restoreAll()
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

function usage(extra = 0) {
  return { inputTokens: 10 + extra, outputTokens: 5 + extra, totalTokens: 15 + extra }
}

async function waitFor(fn: () => boolean, timeoutMs = 5000): Promise<void> {
  const start = Date.now()
  while (!fn()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timeout')
    await new Promise(r => setTimeout(r, 20))
  }
}

test('运行前注入相关记忆到 system prompt', async () => {
  await saveMemory(userId, {
    content: '简单任务的历史经验：直接回答用户即可，用中文回复',
    kind: 'episodic',
    importance: 0.9,
    source: 'user'
  })

  let systemPrompt = ''
  let call = 0
  mock.method(llmService, 'chat', async (input: any) => {
    call++
    if (call === 2) {
      // call 1 是 planner；call 2 才是 Loop 第一轮（buildMessages）
      systemPrompt = input.messages[0].content
      return {
        content: JSON.stringify({ goal: 'g', steps: [] }),
        toolCalls: [],
        usage: usage(0),
        finishReason: 'stop'
      }
    }
    return { content: '好的，明白了', toolCalls: [], usage: usage(1), finishReason: 'stop' }
  })

  const loop = new AgentLoop({ userId, modelId: 'm1', task: '简单任务' })
  void loop.start()
  await waitFor(() => loop.run.status === 'completed')

  assert.ok(systemPrompt.includes('历史记忆'), 'system prompt 含记忆块')
  assert.ok(systemPrompt.includes('历史经验'), '记忆内容被注入')
})

test('运行完成后自动写入 episodic 记忆', async () => {
  let call = 0
  mock.method(llmService, 'chat', async () => {
    call++
    if (call === 1) {
      return {
        content: JSON.stringify({ goal: 'g', steps: [{ title: 's1' }] }),
        toolCalls: [],
        usage: usage(0),
        finishReason: 'stop'
      }
    }
    return { content: '任务完成：已生成报告', toolCalls: [], usage: usage(1), finishReason: 'stop' }
  })

  const loop = new AgentLoop({ userId, modelId: 'm1', task: '生成一份市场报告' })
  void loop.start()
  await waitFor(() => loop.run.status === 'completed')
  await new Promise(r => setTimeout(r, 100)) // 等异步写记忆

  const memories = await prisma.memory.findMany({ where: { userId, kind: 'episodic' } })
  assert.equal(memories.length, 1, '写入一条 episodic 记忆')
  assert.match(memories[0].content, /市场报告/)
  assert.equal(memories[0].runId, loop.run.id)
})

test('agent enable_memory=0 时不写记忆', async () => {
  const agent = await prisma.agent.create({
    data: {
      id: `agent-${Date.now()}`,
      userId,
      name: '无记忆 Agent',
      enableMemory: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  let call = 0
  mock.method(llmService, 'chat', async () => {
    call++
    if (call === 1) {
      return {
        content: JSON.stringify({ goal: 'g', steps: [] }),
        toolCalls: [],
        usage: usage(0),
        finishReason: 'stop'
      }
    }
    return { content: '完成', toolCalls: [], usage: usage(1), finishReason: 'stop' }
  })

  const loop = new AgentLoop({ userId, agentId: agent.id, modelId: 'm1', task: '任务' })
  void loop.start()
  await waitFor(() => loop.run.status === 'completed')
  await new Promise(r => setTimeout(r, 100))

  const count = await prisma.memory.count({ where: { userId } })
  assert.equal(count, 0, '禁用记忆时无写入')
})
