/**
 * API Key 路由 — /api/v2/api-keys/*（Phase 5 T38）
 * 创建（明文仅返回一次）/ 列表 / 更新 / 吊销。
 */
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  updateApiKey
} from '../../services/api-key/service.js'
import { success, fail, unauthorized } from '../../utils/response.js'

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

/** GET /api-keys — 我的 Key 列表 */
router.get('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    success(res, { items: await listApiKeys(userId) })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** POST /api-keys — 创建（响应含明文 plainKey，仅此一次） */
router.post('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const created = await createApiKey(userId, {
      name: req.body?.name,
      scope: req.body?.scope,
      expiresAt: req.body?.expiresAt
    })
    success(res, created)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** PUT /api-keys/:id — 改名 / 换 scope */
router.put('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const record = await updateApiKey(userId, req.params.id, {
      name: req.body?.name,
      scope: req.body?.scope
    })
    success(res, record)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** DELETE /api-keys/:id — 吊销 */
router.delete('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    await revokeApiKey(userId, req.params.id)
    success(res, { revoked: true })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

export default router
