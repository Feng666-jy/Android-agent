/**
 * 组织路由 — /api/v2/orgs/*（Phase 5 T37 多租户）
 * 组织 CRUD + 成员管理（owner/admin 权限）。
 */
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import {
  addMember,
  createOrg,
  deleteOrg,
  getOrg,
  listMyOrgs,
  removeMember,
  updateMemberRole,
  updateOrg
} from '../../services/org/index.js'
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

/** POST /orgs — 创建组织（创建者成为 owner） */
router.post('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const org = await createOrg(userId, {
      name: req.body?.name,
      description: req.body?.description
    })
    success(res, org)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /orgs — 我的组织列表 */
router.get('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    success(res, { items: await listMyOrgs(userId) })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** GET /orgs/:id — 组织详情（含成员） */
router.get('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const org = await getOrg(userId, req.params.id)
    if (!org) {
      notFound(res, 'Organization not found')
      return
    }
    success(res, org)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** PUT /orgs/:id — 更新组织（owner/admin） */
router.put('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const org = await updateOrg(userId, req.params.id, {
      name: req.body?.name,
      description: req.body?.description,
      settings: req.body?.settings
    })
    success(res, org)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** DELETE /orgs/:id — 解散组织（仅 owner） */
router.delete('/:id', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    await deleteOrg(userId, req.params.id)
    success(res, { deleted: true })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** POST /orgs/:id/members — 添加成员（owner/admin，按用户名） */
router.post('/:id/members', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const member = await addMember(userId, req.params.id, {
      username: req.body?.username,
      role: req.body?.role
    })
    success(res, member)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** PUT /orgs/:id/members/:userId — 变更成员角色 */
router.put('/:id/members/:userId', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    const member = await updateMemberRole(
      userId,
      req.params.id,
      Number(req.params.userId),
      req.body?.role
    )
    success(res, member)
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

/** DELETE /orgs/:id/members/:userId — 移除成员 */
router.delete('/:id/members/:userId', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  try {
    await removeMember(userId, req.params.id, Number(req.params.userId))
    success(res, { removed: true })
  } catch (err) {
    fail(res, (err as Error).message)
  }
})

export default router
