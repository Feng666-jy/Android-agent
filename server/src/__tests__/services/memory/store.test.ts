/**
 * Memory Store 测试 — Phase 4（T30）
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
  saveMemory,
  listMemories,
  deleteMemory,
  getRelevantMemories,
  decayExpiredMemories,
  touchMemory,
  renderMemoryBlock
} from '../../../services/memory/index.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'memory-store-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `mem${Date.now()}`, password: 'x', email: `mem${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('saveMemory 创建并回读', async () => {
  const record = await saveMemory(userId, {
    content: '用户偏好简洁回复',
    kind: 'preference',
    importance: 0.9,
    source: 'user'
  })
  assert.ok(record.id)
  assert.equal(record.kind, 'preference')
  assert.equal(record.importance, 0.9)
  const { items } = await listMemories(userId)
  assert.equal(items.length, 1)
  assert.equal(items[0].content, '用户偏好简洁回复')
})

test('saveMemory 同内容去重（conversationId+kind 相同则更新）', async () => {
  await saveMemory(userId, { content: '重复内容', kind: 'semantic', conversationId: 'c1' })
  await saveMemory(userId, {
    content: '重复内容',
    kind: 'semantic',
    conversationId: 'c1',
    importance: 1
  })
  const { items } = await listMemories(userId)
  assert.equal(items.length, 1)
  assert.equal(items[0].importance, 1)
})

test('getRelevantMemories 关键词打分排序', async () => {
  await saveMemory(userId, { content: '服务器 IP 是 10.0.0.8', kind: 'semantic', importance: 0.8 })
  await saveMemory(userId, { content: '喜欢喝咖啡', kind: 'preference', importance: 0.5 })
  await saveMemory(userId, {
    content: '服务器密码存在密码管理器',
    kind: 'semantic',
    importance: 0.3
  })

  const hits = await getRelevantMemories(userId, '服务器 IP', { limit: 5 })
  assert.ok(hits.length >= 1)
  assert.match(hits[0].content, /服务器/)
  assert.ok(hits[0].score > 0)
})

test('getRelevantMemories 支持 kind 过滤与无查询词返回', async () => {
  await saveMemory(userId, { content: '事实 A', kind: 'semantic' })
  await saveMemory(userId, { content: '经历 B', kind: 'episodic' })
  const semantic = await getRelevantMemories(userId, '', { kinds: ['semantic'] })
  assert.equal(semantic.length, 1)
  assert.equal(semantic[0].kind, 'semantic')
})

test('touchMemory 增加热度', async () => {
  const record = await saveMemory(userId, { content: '热点记忆', kind: 'semantic' })
  await touchMemory(userId, record.id)
  const { items } = await listMemories(userId)
  assert.equal(items[0].accessCount, 1)
  assert.ok(items[0].lastAccessAt)
})

test('decayExpiredMemories 清理过期记忆', async () => {
  await saveMemory(userId, {
    content: '会过期的',
    kind: 'semantic',
    expiresAt: new Date(Date.now() - 1000).toISOString()
  })
  await saveMemory(userId, { content: '不过期', kind: 'semantic' })
  const removed = await decayExpiredMemories()
  assert.equal(removed, 1)
  const { items } = await listMemories(userId)
  assert.equal(items.length, 1)
  assert.equal(items[0].content, '不过期')
})

test('deleteMemory 仅删除本人记忆', async () => {
  const record = await saveMemory(userId, { content: '待删除', kind: 'semantic' })
  assert.equal(await deleteMemory(userId, record.id), true)
  assert.equal(await deleteMemory(userId, record.id), false)
})

test('renderMemoryBlock 生成系统提示块（空检索返回空串）', () => {
  assert.equal(renderMemoryBlock([]), '')
  const block = renderMemoryBlock([
    {
      id: '1',
      userId,
      kind: 'preference',
      content: '简洁',
      importance: 0.9,
      accessCount: 0,
      source: 'user',
      metadata: {},
      createdAt: '',
      updatedAt: '',
      score: 0.8
    } as any
  ])
  assert.match(block, /历史记忆/)
  assert.match(block, /简洁/)
})
