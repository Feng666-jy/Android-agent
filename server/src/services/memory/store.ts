/**
 * Memory Store — Phase 4（T30）
 *
 * 职责：memories 表读写 + 检索打分（关键词匹配 + 重要性 + 新鲜度 + 热度）。
 * 检索为纯规则实现（零额外成本）；向量 embedding 作为预留扩展点
 * （metadata.embedding 字段，未来接入 embedding 模型后升级排序）。
 */

import { prisma } from '../../prisma.js'
import { randomUUID } from 'node:crypto'
import type { MemoryHit, MemoryInput, MemoryKind, MemoryQuery, MemoryRecord } from './types.js'

/** 默认检索条数 */
export const DEFAULT_MEMORY_LIMIT = 5
/** 检索上限 */
export const MAX_MEMORY_LIMIT = 20

/** 行 → MemoryRecord */
export function rowToMemory(row: Record<string, any>): MemoryRecord {
  let metadata: Record<string, unknown> = {}
  try {
    metadata = row.metadataJson ? (JSON.parse(row.metadataJson) as Record<string, unknown>) : {}
  } catch {
    metadata = {}
  }
  return {
    id: row.id,
    userId: row.userId,
    conversationId: row.conversationId ?? undefined,
    agentId: row.agentId ?? undefined,
    runId: row.runId ?? undefined,
    kind: (row.kind as MemoryKind) ?? 'episodic',
    content: row.content,
    summary: row.summary ?? undefined,
    importance: row.importance ?? 0.5,
    accessCount: row.accessCount ?? 0,
    lastAccessAt: row.lastAccessAt ?? undefined,
    expiresAt: row.expiresAt ?? undefined,
    source: row.source ?? 'system',
    metadata,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/** 保存记忆（id 存在则更新，否则创建） */
export async function saveMemory(userId: number, input: MemoryInput): Promise<MemoryRecord> {
  const kind = input.kind ?? 'episodic'
  const importance = Math.min(1, Math.max(0, input.importance ?? 0.5))
  const now = new Date()
  const metadataJson = JSON.stringify(input.metadata ?? {})
  const base = {
    userId,
    kind,
    content: input.content,
    summary: input.summary ?? null,
    importance,
    conversationId: input.conversationId ?? null,
    agentId: input.agentId ?? null,
    runId: input.runId ?? null,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    source: input.source ?? 'system',
    metadataJson,
    updatedAt: now
  }
  const existing = input.id
    ? await prisma.memory.findFirst({ where: { id: input.id, userId } })
    : input.conversationId
      ? await prisma.memory.findFirst({
          where: { userId, conversationId: input.conversationId, kind, content: input.content }
        })
      : null
  if (existing) {
    const row = await prisma.memory.update({ where: { id: existing.id }, data: base })
    return rowToMemory(row)
  }
  const row = await prisma.memory.create({ data: { id: randomUUID(), ...base, createdAt: now } })
  return rowToMemory(row)
}

/** 记忆列表（按 kind 过滤 + 分页 + 关键词过滤） */
export async function listMemories(
  userId: number,
  opts: { kind?: MemoryKind; search?: string; page?: number; pageSize?: number } = {}
): Promise<{ items: MemoryRecord[]; total: number }> {
  const page = Math.max(1, opts.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20))
  const where: Record<string, unknown> = { userId }
  if (opts.kind) where.kind = opts.kind
  if (opts.search?.trim()) where.content = { contains: opts.search.trim() }
  const rows = await prisma.memory.findMany({
    where,
    orderBy: [{ updatedAt: 'desc' }],
    skip: (page - 1) * pageSize,
    take: pageSize
  })
  const total = await prisma.memory.count({ where })
  return { items: rows.map(rowToMemory), total }
}

/** 删除记忆（仅限本人） */
export async function deleteMemory(userId: number, id: string): Promise<boolean> {
  const result = await prisma.memory.deleteMany({ where: { id, userId } })
  return result.count > 0
}

/** 记录一次检索命中（热度 +1） */
export async function touchMemory(userId: number, id: string): Promise<void> {
  await prisma.memory
    .updateMany({
      where: { id, userId },
      data: { accessCount: { increment: 1 }, lastAccessAt: new Date(), updatedAt: new Date() }
    })
    .catch(() => undefined)
}

/** 清理过期记忆（expires_at < now），返回清理条数 */
export async function decayExpiredMemories(): Promise<number> {
  const result = await prisma.memory.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  return result.count
}

/**
 * 记忆检索：关键词打分（content/summary 匹配查询词）+ 重要性 + 热度 + 新鲜度。
 * score = 0.6*关键词命中率 + 0.25*importance + 0.1*热度(归一化) + 0.05*新鲜度(近7天)
 */
export async function getRelevantMemories(
  userId: number,
  query: string,
  opts: MemoryQuery = {}
): Promise<MemoryHit[]> {
  const limit = Math.min(MAX_MEMORY_LIMIT, Math.max(1, opts.limit ?? DEFAULT_MEMORY_LIMIT))
  const where: Record<string, unknown> = { userId }
  if (opts.kinds && opts.kinds.length > 0) where.kind = { in: opts.kinds }
  if (opts.conversationId) where.conversationId = opts.conversationId
  const rows = await prisma.memory.findMany({ where, orderBy: [{ importance: 'desc' }], take: 100 })
  if (rows.length === 0) return []

  const terms = query
    .toLowerCase()
    .split(/[\s,，。.!！?？:：;；/\\-]+/)
    .filter(t => t.length >= 2)
    .slice(0, 12)
  const now = Date.now()
  const maxAccess = Math.max(1, ...rows.map((r: any) => r.accessCount ?? 0))

  const hits: MemoryHit[] = []
  for (const row of rows) {
    const haystack = `${row.content ?? ''} ${row.summary ?? ''}`.toLowerCase()
    let matched = 0
    if (terms.length === 0) {
      matched = 1 // 无查询词 → 按重要性/热度全量返回
    } else {
      for (const t of terms) if (haystack.includes(t)) matched += 1
      if (matched === 0) continue
    }
    const freshness =
      row.updatedAt && now - new Date(row.updatedAt).getTime() < 7 * 24 * 3600_000 ? 1 : 0
    const score =
      0.6 * (terms.length === 0 ? 1 : matched / terms.length) +
      0.25 * (row.importance ?? 0.5) +
      0.1 * ((row.accessCount ?? 0) / maxAccess) +
      0.05 * freshness
    hits.push({ ...rowToMemory(row), score })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}

/** 把检索结果渲染为系统提示块 */
export function renderMemoryBlock(hits: MemoryHit[], maxChars = 1200): string {
  if (hits.length === 0) return ''
  const lines = hits.map((h, i) =>
    `[${i + 1}] (${h.kind}${h.source === 'agent' ? ', 上次任务产生' : ''}) ${h.summary ? h.summary + ' — ' : ''}${h.content}`.slice(
      0,
      300
    )
  )
  return `\n\n[历史记忆]\n${lines.join('\n')}\n（以上记忆来自历史任务/用户偏好，供参考；如与当前任务冲突以当前任务为准）`.slice(
    0,
    maxChars
  )
}
