/**
 * Tools V2 路由 — /api/v2/tools/*
 * Phase 2：动态工具管理（T14）、权限规则（T15/T16）、MCP Server（T17/T18）、Skill（T19）
 * 注意：具体路径（permissions/mcp-servers/skills）必须先于 /:id 注册，避免被通配吞掉。
 */

import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { toolsController } from '../../controllers/tools.controller.js'

const router = Router()

// 权限规则（先于 /:id）
router.get('/permissions', authMiddleware, toolsController.listPermissions)
router.put('/permissions', authMiddleware, toolsController.upsertPermission)
router.delete('/permissions/:id', authMiddleware, toolsController.deletePermission)

// MCP Server（先于 /:id）
router.get('/mcp-servers', authMiddleware, toolsController.listMcpServers)
router.post('/mcp-servers', authMiddleware, toolsController.createMcpServer)
router.put('/mcp-servers/:id', authMiddleware, toolsController.updateMcpServer)
router.delete('/mcp-servers/:id', authMiddleware, toolsController.deleteMcpServer)
router.post('/mcp-servers/:id/test', authMiddleware, toolsController.testMcpServer)

// Skills（先于 /:id）
router.get('/skills', authMiddleware, toolsController.listSkills)
router.post('/skills', authMiddleware, toolsController.createSkill)
router.put('/skills/:id', authMiddleware, toolsController.updateSkill)
router.delete('/skills/:id', authMiddleware, toolsController.deleteSkill)

// 工具 CRUD（通配段放最后）
router.get('/', authMiddleware, toolsController.list)
router.post('/', authMiddleware, toolsController.createTool)
router.put('/:id', authMiddleware, toolsController.updateTool)
router.delete('/:id', authMiddleware, toolsController.deleteTool)
router.post('/:id/toggle', authMiddleware, toolsController.toggleTool)

export default router
