/**
 * API Key 服务 — Phase 5（T38）
 *
 * 安全设计：
 *  - 明文只在创建时返回一次，DB 仅存 sha256 哈希
 *  - 校验 O(1)：hash(明文) 直接命中 key_hash 唯一索引
 *  - scope 限制可访问能力（agent 默认 / all）
 *  - 支持过期时间与吊销（status=revoked）
 */

import { createHash, randomBytes } from 'node:crypto'
import { prisma } from '../../prisma.js'

export type ApiKeyScope = 'agent' | 'all'

export interface ApiKeyInput {
  name: string
  scope?: ApiKeyScope
  expiresAt?: string
}

export interface ApiKeyRecord {
  id: string
  userId: number
  name: string
  prefix: string
  scope: ApiKeyScope
  status: string
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreatedApiKey {
  record: ApiKeyRecord
  /** 明文 Key（仅此一次） */
  plainKey: string
}

export interface ApiKeyIdentity {
  userId: number
  apiKeyId: string
  scope: ApiKeyScope
}

export const API_KEY_PREFIX = 'sk_'

/** 生成明文 Key：sk_ + 32 字节随机（hex 64 位） */
export function generatePlainKey(): string {
  return `${API_KEY_PREFIX}${randomBytes(32).toString('hex')}`
}

/** sha256 哈希（DB 只存哈希） */
export function hashApiKey(plainKey: string): string {
  return createHash('sha256').update(plainKey).digest('hex')
}

function toRecord(row: any): ApiKeyRecord {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    prefix: row.prefix,
    scope: row.scope,
    status: row.status,
    lastUsedAt: row.lastUsedAt ?? undefined,
    expiresAt: row.expiresAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/** 创建 API Key（返回明文一次） */
export async function createApiKey(userId: number, input: ApiKeyInput): Promise<CreatedApiKey> {
  if (!input.name?.trim()) throw new Error('API key name is required')
  const scope = input.scope ?? 'agent'
  if (!['agent', 'all'].includes(scope)) throw new Error(`Invalid scope: ${scope}`)

  const plainKey = generatePlainKey()
  const created = await prisma.apiKey.create({
    data: {
      userId,
      name: input.name.trim(),
      prefix: plainKey.slice(0, API_KEY_PREFIX.length + 8),
      keyHash: hashApiKey(plainKey),
      scope,
      status: 'active',
      expiresAt: input.expiresAt
    }
  })
  return { record: toRecord(created), plainKey }
}

/** 我的 Key 列表（不含哈希） */
export async function listApiKeys(userId: number): Promise<ApiKeyRecord[]> {
  const rows = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }]
  })
  return rows.map(toRecord)
}

/** 更新 Key（改名 / scope） */
export async function updateApiKey(
  userId: number,
  apiKeyId: string,
  input: { name?: string; scope?: ApiKeyScope }
): Promise<ApiKeyRecord> {
  const existing = await prisma.apiKey.findFirst({ where: { id: apiKeyId, userId } })
  if (!existing) throw new Error('API key not found')

  const data: Record<string, unknown> = {}
  if (input.name !== undefined) {
    if (!input.name.trim()) throw new Error('API key name is required')
    data.name = input.name.trim()
  }
  if (input.scope !== undefined) {
    if (!['agent', 'all'].includes(input.scope)) throw new Error(`Invalid scope: ${input.scope}`)
    data.scope = input.scope
  }

  const updated = await prisma.apiKey.update({ where: { id: apiKeyId }, data })
  return toRecord(updated)
}

/** 吊销 Key */
export async function revokeApiKey(userId: number, apiKeyId: string): Promise<void> {
  const existing = await prisma.apiKey.findFirst({ where: { id: apiKeyId, userId } })
  if (!existing) throw new Error('API key not found')
  await prisma.apiKey.update({ where: { id: apiKeyId }, data: { status: 'revoked' } })
}

/** 校验明文 Key → 用户身份；无效/吊销/过期返回 null */
export async function verifyApiKey(plainKey: string): Promise<ApiKeyIdentity | null> {
  if (!plainKey.startsWith(API_KEY_PREFIX)) return null
  const row = await prisma.apiKey.findFirst({ where: { keyHash: hashApiKey(plainKey) } })
  if (!row) return null
  if (row.status !== 'active') return null
  if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) return null

  // 更新 lastUsedAt（静默失败）
  await prisma.apiKey
    .updateMany({ where: { id: row.id }, data: { lastUsedAt: new Date().toISOString() } })
    .catch(() => undefined)

  return { userId: row.userId, apiKeyId: row.id, scope: row.scope }
}
