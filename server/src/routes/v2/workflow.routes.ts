/**
 * 工作流路由 — /api/v2/workflows/*（Phase 4 T31）
 * 定义 CRUD + 手动执行 + 执行历史。
 */
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import {
  deleteWorkflow,
  executeWorkflow,
  getWorkflow,
  listWorkflowRuns,
  listWorkflows,
  saveWorkflow
} from '../../services/workflow/index.js'
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

/** GET /workflows — 工作流列表 */
router.get('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  success(res, { items: await listWorkflows(userId) })
})

/** POST /workflows — 创建工作流 */
router.post('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const { name, description, trigger, steps, enabled } = req.body ?? {}
  if (typeof name !== 'string' || !name.trim()) {
    fail(res, 'name required', -1, 400)
    return
  }
  if (!Array.isArray(steps)) {
    fail(res, 'steps must be an array', -1, 400)
    return
  }
  const workflow = await saveWorkflow(userId, {
    name,
    description: typeof description === 'string' ? description : '',
    trigger: trigger === 'event' ? 'event' : 'manual',
    steps,
    enabled: enabled === undefined ? true : Boolean(enabled)
  })
  success(res, workflow, 'created', 201)
})

/** GET /workflows/:id — 工作流详情 */
router.get('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const workflow = await getWorkflow(userId, req.params.id)
  if (!workflow) {
    notFound(res, 'Workflow not found')
    return
  }
  success(res, workflow)
})

/** PUT /workflows/:id — 更新工作流 */
router.put('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const existing = await getWorkflow(userId, req.params.id)
  if (!existing) {
    notFound(res, 'Workflow not found')
    return
  }
  const { name, description, trigger, steps, enabled } = req.body ?? {}
  const workflow = await saveWorkflow(userId, {
    id: existing.id,
    name: typeof name === 'string' && name.trim() ? name : existing.name,
    description: typeof description === 'string' ? description : existing.description,
    trigger: trigger === 'event' ? 'event' : trigger === 'manual' ? 'manual' : existing.trigger,
    steps: Array.isArray(steps) ? steps : existing.steps,
    enabled: enabled === undefined ? existing.enabled : Boolean(enabled)
  })
  success(res, workflow)
})

/** DELETE /workflows/:id — 删除工作流 */
router.delete('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const ok = await deleteWorkflow(userId, req.params.id)
  if (!ok) {
    notFound(res, 'Workflow not found')
    return
  }
  success(res, { ok: true })
})

/** POST /workflows/:id/run — 手动执行工作流 */
router.post('/:id/run', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const workflow = await getWorkflow(userId, req.params.id)
  if (!workflow) {
    notFound(res, 'Workflow not found')
    return
  }
  if (!workflow.enabled) {
    fail(res, 'Workflow is disabled', -1, 400)
    return
  }
  const record = await executeWorkflow(workflow, (req.body ?? {}).input ?? {}, {
    userId,
    modelId: (req.body ?? {}).modelId
  })
  if (record.status !== 'completed') {
    success(res, record, `workflow ${record.status}`, 200)
    return
  }
  success(res, record)
})

/** GET /workflows/:id/runs — 执行历史 */
router.get('/:id/runs', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const workflow = await getWorkflow(userId, req.params.id)
  if (!workflow) {
    notFound(res, 'Workflow not found')
    return
  }
  const result = await listWorkflowRuns(userId, workflow.id, {
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20
  })
  success(res, result)
})

export default router
