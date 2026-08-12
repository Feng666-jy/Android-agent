/**
 * 计费路由 — /api/v2/billing/*（Phase 5 T36）
 * 用量汇总 / 配额状态 / 套餐 / 订阅 / 账单 / 模型计价。
 */
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import {
  cancelSubscription,
  ensureDefaultPlans,
  getActiveSubscription,
  getPlanByCode,
  listPlans,
  subscribe,
  toPlanDef
} from '../../services/billing/index.js'
import { checkQuota, getQuotaStatus, getUsageSummary } from '../../services/billing/index.js'
import { generateMonthlyInvoice, getInvoice, listInvoices } from '../../services/billing/index.js'
import { getModelPrice, listModelPrices, upsertModelPrice } from '../../services/billing/index.js'
import { BillingQuotaError } from '../../services/billing/types.js'
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

/** GET /billing/summary — 当前用户计费总览（订阅 + 配额 + 周期用量） */
router.get('/summary', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const [quota, subscription] = await Promise.all([
      getQuotaStatus(userId),
      getActiveSubscription(userId)
    ])
    success(res, { quota, subscription })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /billing/usage — 用量聚合（from/to 过滤 + 按模型/来源分组） */
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

/** GET /billing/plans — 套餐列表 */
router.get('/plans', async (_req: any, res: any) => {
  try {
    await ensureDefaultPlans()
    success(res, { items: await listPlans(true) })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** POST /billing/subscribe — 订阅/切换套餐 */
router.post('/subscribe', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const { planCode } = req.body ?? {}
  if (!planCode) {
    fail(res, 'planCode is required')
    return
  }
  try {
    const subscription = await subscribe(userId, String(planCode))
    const plan = await getPlanByCode(String(planCode))
    success(res, { subscription, plan: plan ? toPlanDef(plan as any) : null })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** POST /billing/unsubscribe — 取消订阅 */
router.post('/unsubscribe', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    await cancelSubscription(userId)
    success(res, { canceled: true })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /billing/quota — 配额检查结果（供前端预检） */
router.get('/quota', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    await checkQuota(userId)
    success(res, { allowed: true })
  } catch (err) {
    if (err instanceof BillingQuotaError) {
      fail(res, err.message, 4020, err.statusCode)
      return
    }
    fail(res, (err as Error).message)
  }
})

/** POST /billing/invoices/generate — 生成月度账单（默认上月，幂等） */
router.post('/invoices/generate', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const invoice = await generateMonthlyInvoice(userId, req.body?.period)
    success(res, invoice)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /billing/invoices — 账单列表 */
router.get('/invoices', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const page = req.query.page ? Number(req.query.page) : 1
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20
    success(res, await listInvoices(userId, page, pageSize))
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /billing/invoices/:id — 账单详情 */
router.get('/invoices/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const invoice = await getInvoice(userId, req.params.id)
    if (!invoice) {
      notFound(res, 'Invoice not found')
      return
    }
    success(res, invoice)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /billing/prices — 模型计价列表 */
router.get('/prices', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const page = req.query.page ? Number(req.query.page) : 1
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 50
    success(res, await listModelPrices(page, pageSize))
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** PUT /billing/prices/:modelId — 设置/更新模型价格 */
router.put('/prices/:modelId', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const { inputPerMillionCents, outputPerMillionCents, cachedDiscount, enabled } = req.body ?? {}
  try {
    const price = await upsertModelPrice(req.params.modelId, {
      inputPerMillionCents,
      outputPerMillionCents,
      cachedDiscount,
      enabled
    })
    success(res, price)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /billing/prices/:modelId — 查询模型价格 */
router.get('/prices/:modelId', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const price = await getModelPrice(req.params.modelId)
    if (!price) {
      notFound(res, 'Price not configured')
      return
    }
    success(res, price)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

export default router
