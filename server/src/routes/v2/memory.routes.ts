/**
 * 记忆路由 — /api/v2/memories/*（Phase 4 T30）
 * 检索/增删改；删除与修改仅限本人数据。
 */
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { deleteMemory, listMemories, saveMemory } from '../../services/memory/index.js'
import { prisma } from '../../prisma.js'
import { success, fail, notFound, unauthorized } from '../../utils/response.js'

const router = Router()
router.use(authMiddleware)

function requireUserId(req: any, res: any): number | null {
  const userId = req.user?.userId
  if (userId === undefined) {
    unauthorized(res)
    return null
  }
  return userId
}

/** GET /memories — 记忆列表（kind 过滤 + search + 分页） */
router.get('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const result = await listMemories(userId, {
    kind: req.query.kind,
    search: req.query.search,
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20
  })
  success(res, result)
})

/** POST /memories — 保存记忆 */
router.post('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const { kind, content, summary, importance, expiresAt, metadata } = req.body ?? {}
  if (typeof content !== 'string' || !content.trim()) {
    fail(res, 'content required', -1, 400)
    return
  }
  const record = await saveMemory(userId, {
    kind,
    content,
    summary: typeof summary === 'string' ? summary : undefined,
    importance: typeof importance === 'number' ? importance : undefined,
    expiresAt: typeof expiresAt === 'string' ? expiresAt : undefined,
    metadata: typeof metadata === 'object' && metadata ? metadata : undefined,
    source: 'user'
  })
  success(res, record, 'created', 201)
})

/** PUT /memories/:id — 更新记忆（仅限本人；内容/重要性/摘要） */
router.put('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const existing = await prisma.memory.findFirst({ where: { id: req.params.id, userId } })
  if (!existing) {
    notFound(res, 'Memory not found')
    return
  }
  const { content, summary, importance, expiresAt } = req.body ?? {}
  const record = await saveMemory(userId, {
    id: existing.id,
    kind: existing.kind,
    content: typeof content === 'string' && content.trim() ? content : existing.content,
    summary:
      summary === undefined
        ? (existing.summary ?? undefined)
        : typeof summary === 'string'
          ? summary
          : undefined,
    importance: typeof importance === 'number' ? importance : existing.importance,
    expiresAt:
      expiresAt === undefined ? undefined : typeof expiresAt === 'string' ? expiresAt : undefined,
    metadata: existing.metadataJson ? JSON.parse(existing.metadataJson) : undefined,
    source: 'user'
  })
  success(res, record)
})

/** DELETE /memories/:id — 删除记忆 */
router.delete('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const ok = await deleteMemory(userId, req.params.id)
  if (!ok) {
    notFound(res, 'Memory not found')
    return
  }
  success(res, { ok: true })
})

export default router
