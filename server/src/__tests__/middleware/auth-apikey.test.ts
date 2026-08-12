/**
 * auth 中间件 API Key 支持测试 — Phase 5（T38）
 * 参考既有 auth.test.ts 模式（动态 import 保证 JWT_SECRET 生效）。
 */
process.env.JWT_SECRET = 'test-secret'

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')
let tempRoot: string
let userId: number

beforeEach(async () => {
  const { DatabaseSync } = await import('node:sqlite')
  const { applyMigrations } = await import('../../db/migrate.ts')
  const { prisma, closeDatabase } = await import('../../prisma.ts')
  ;(globalThis as any).__p5close = closeDatabase
  tempRoot = mkdtempSync(path.join(tmpdir(), 'authkey-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  const user = await prisma.user.create({
    data: { username: `ak${Date.now()}`, password: 'x', email: `ak${Date.now()}@t.com` }
  })
  userId = user.id
})

afterEach(async () => {
  ;(globalThis as any).__p5close?.()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('Bearer sk_ API Key 认证成功并注入身份', async () => {
  const { authMiddleware } = await import('../../middleware/auth.ts')
  const { createApiKey } = await import('../../services/api-key/service.ts')
  const { plainKey } = await createApiKey(userId, { name: 'auth-test' })

  const req: any = { headers: { authorization: `Bearer ${plainKey}` } }
  const res: any = { status: () => res, json: () => undefined }
  let called = false
  await authMiddleware(req, res, () => {
    called = true
  })
  assert.equal(called, true)
  assert.equal(req.user.userId, userId)
  assert.equal(req.user.apiKeyId.length > 0, true)
  assert.equal(req.user.apiKeyScope, 'agent')
})

test('无效 API Key 返回 401', async () => {
  const { authMiddleware } = await import('../../middleware/auth.ts')
  const req: any = { headers: { authorization: 'Bearer sk_invalidkey' } }
  let status = 0
  const res: any = {
    status: (s: number) => {
      status = s
      return res
    },
    json: () => undefined
  }
  await authMiddleware(req, res, () => {
    throw new Error('should not call next')
  })
  assert.equal(status, 401)
})

test('JWT 仍可认证（向后兼容）', async () => {
  const { authMiddleware } = await import('../../middleware/auth.ts')
  const { default: jwt } = await import('jsonwebtoken')
  const token = jwt.sign({ userId, username: 'ak' }, 'test-secret')
  const req: any = { headers: { authorization: `Bearer ${token}` } }
  const res: any = { status: () => res, json: () => undefined }
  let called = false
  await authMiddleware(req, res, () => {
    called = true
  })
  assert.equal(called, true)
  assert.equal(req.user.userId, userId)
  assert.equal(req.user.apiKeyId, undefined)
})
