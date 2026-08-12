/**
 * API Key 服务测试 — Phase 5（T38）
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
  createApiKey,
  listApiKeys,
  updateApiKey,
  revokeApiKey,
  verifyApiKey,
  hashApiKey
} from '../../../services/api-key/service.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'prisma/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'apikey-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `key${Date.now()}`, password: 'x', email: `key${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('创建 Key：明文仅返回一次，DB 只存哈希', async () => {
  const { record, plainKey } = await createApiKey(userId, { name: '测试 Key', scope: 'agent' })
  assert.ok(plainKey.startsWith('sk_'))
  assert.equal(record.prefix, plainKey.slice(0, 11))
  const row = await prisma.apiKey.findFirst({ where: { id: record.id } })
  assert.equal(row.keyHash, hashApiKey(plainKey))
  assert.notEqual(row.keyHash, plainKey)
  // list 不返回哈希
  const keys = await listApiKeys(userId)
  assert.equal(keys.length, 1)
  assert.ok(!('keyHash' in keys[0]))
})

test('verifyApiKey：有效/错误/吊销/过期', async () => {
  const { plainKey } = await createApiKey(userId, { name: 'k1' })
  const identity = await verifyApiKey(plainKey)
  assert.equal(identity?.userId, userId)
  assert.equal(identity?.scope, 'agent')

  assert.equal(await verifyApiKey('sk_invalid'), null)
  assert.equal(await verifyApiKey('no-prefix'), null)

  const { id } = await createApiKey(userId, { name: 'k2' }).then(r => r.record)
  await revokeApiKey(userId, id)
  const list = await listApiKeys(userId)
  assert.equal(list.find(k => k.id === id)?.status, 'revoked')

  // 过期 Key（创建时给过去的时间）
  const past = new Date(Date.now() - 3600_000).toISOString()
  const expired = await createApiKey(userId, { name: 'k3', expiresAt: past })
  assert.equal(await verifyApiKey(expired.plainKey), null)
})

test('updateApiKey 改名/换 scope + 越权保护', async () => {
  const { record } = await createApiKey(userId, { name: '原名', scope: 'agent' })
  const updated = await updateApiKey(userId, record.id, { name: '新名', scope: 'billing' })
  assert.equal(updated.name, '新名')
  assert.equal(updated.scope, 'billing')

  const other = await prisma.user.create({
    data: { username: `key2${Date.now()}`, password: 'x', email: `key2${Date.now()}@t.com` }
  })
  await assert.rejects(() => revokeApiKey(other.id, record.id))
  await assert.rejects(() => updateApiKey(other.id, record.id, { name: 'x' }))
})
