/**
 * AI 资源路由 — /api/v2/ai-resources/*（Phase 5 改造）
 * 供应商 / 模型目录 / 用量统计 聚合总览（ModelCatalog 查询入口）。
 */
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { getResourceSummary, getModelCatalog } from '../../services/ai-resource/index.js'
import { getUsageSummary } from '../../services/ai-resource/index.js'
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

/** GET /ai-resources/summary — 资源总览（供应商 + 模型目录 + 今日/本月/累计用量） */
router.get('/summary', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    success(res, await getResourceSummary(userId))
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /ai-resources/usage — 用量聚合（from/to 过滤 + 按模型/来源/供应商分组） */
router.get('/usage', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const summary = await getUsageSummary(userId, {
      from: req.query.from,
      to: req.query.to,
      orgId: req.query.orgId,
      source: req.query.source
    })
    success(res, summary)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /ai-resources/models — 模型目录（Model + Provider 聚合视图） */
router.get('/models', async (_req: any, res: any) => {
  try {
    success(res, { items: await getModelCatalog() })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

export default router
