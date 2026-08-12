/**
 * Tools 控制器 — Phase 2 工具管理（T14/T16/T17/T19/T20）
 *
 * 端点（全部 /api/v2/tools/*，需登录）：
 *   GET/POST/PUT/DELETE /tools                 自定义工具 CRUD + 内置登记
 *   POST /tools/:id/toggle                     启用/禁用
 *   GET/PUT /tools/permissions                权限规则（三级作用域）查询/upsert
 *   DELETE /tools/permissions/:id             删除权限规则
 *   GET/POST/PUT/DELETE /tools/mcp-servers    MCP Server CRUD
 *   POST /tools/mcp-servers/:id/test          测试连接并拉取工具
 *   GET/POST/PUT/DELETE /tools/skills         Skill CRUD
 */

import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { success, fail, notFound, unauthorized } from '../utils/response.js'
import { ensureBuiltinToolRows, toolRouter } from '../services/agent-v2/tool-router.js'
import {
  deleteToolPermission,
  isPermissionScope,
  isToolPermission,
  listToolPermissionRules,
  upsertToolPermission,
  type ArgumentRule,
  type ToolPermissionInput
} from '../services/agent-v2/tool-permissions.js'
import { mcpRegistry } from '../services/mcp/registry.js'
import type { McpServerConfig } from '../services/mcp/types.js'

// ---------------------------------------------------------------------------
// Schema 校验
// ---------------------------------------------------------------------------

const customToolSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/, '工具名仅允许字母数字下划线'),
  description: z.string().max(500).optional().default(''),
  parametersJson: z.string().optional().default('{}')
})

const permissionRuleSchema = z.object({
  scope: z.string(),
  agentId: z.string().min(1).optional(),
  toolName: z.string().min(1),
  permission: z.string(),
  argumentRules: z
    .array(
      z.object({
        path: z.string().min(1),
        operator: z.enum(['eq', 'contains', 'regex']),
        value: z.string().optional(),
        permission: z.enum(['ask', 'deny'])
      })
    )
    .optional()
})

const mcpServerSchema = z.object({
  name: z.string().min(1).max(64),
  transport: z.enum(['sse', 'streamable-http']).optional().default('sse'),
  url: z.string().url(),
  headersJson: z.string().optional().default('{}')
})

const skillSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(500).optional().default(''),
  content: z.string().optional().default(''),
  version: z.string().max(32).optional().default('1.0.0')
})

function requireUserId(req: Request, res: Response): number | null {
  const userId = req.user?.userId
  if (userId === undefined) {
    unauthorized(res)
    return null
  }
  return userId
}

// ---------------------------------------------------------------------------
// 控制器
// ---------------------------------------------------------------------------

export const toolsController = {
  /** GET /tools — 内置登记 + 动态工具 + 用户权限规则（管理页一次拉全） */
  async list(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    await ensureBuiltinToolRows()
    await toolRouter.sync(userId, undefined, true)

    const rows = await prisma.tool.findMany({ orderBy: [{ source: 'asc' }, { name: 'asc' }] })
    const tools = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      parametersJson: row.parametersJson,
      source: row.source,
      enabled: Boolean(row.enabled),
      userId: row.userId
    }))
    const permissions = await listToolPermissionRules(userId)
    const mcpServers = await prisma.mcpServer.findMany({ where: { userId } })
    const skills = await prisma.skill.findMany({ where: { OR: [{ userId: null }, { userId }] } })
    success(res, { tools, permissions, mcpServers, skills })
  },

  /** POST /tools — 创建自定义工具（用户级） */
  async createTool(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = customToolSchema.safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const { name, description, parametersJson } = parsed.data
    const existing = await prisma.tool.findUnique({ where: { name } })
    if (existing) {
      fail(res, `Tool name already exists: ${name}`, -1, 409)
      return
    }
    const row = await prisma.tool.create({
      data: {
        userId,
        name,
        description,
        parametersJson,
        source: 'custom',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    toolRouter.invalidate()
    success(res, { id: row.id, name: row.name })
  },

  /** PUT /tools/:id — 更新自定义工具（仅本人） */
  async updateTool(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = customToolSchema.partial().safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const row = await prisma.tool.findUnique({ where: { id: req.params.id } })
    if (!row || (row.source === 'custom' && row.userId !== userId)) {
      notFound(res, 'Tool not found')
      return
    }
    if (row.source !== 'custom') {
      fail(res, 'Builtin tools cannot be edited; use toggle instead', -1, 400)
      return
    }
    const { name, description, parametersJson } = parsed.data
    await prisma.tool.update({
      where: { id: row.id },
      data: {
        ...(name ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(parametersJson !== undefined ? { parametersJson } : {}),
        updatedAt: new Date()
      }
    })
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id })
  },

  /** DELETE /tools/:id — 删除自定义工具（仅本人） */
  async deleteTool(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const row = await prisma.tool.findUnique({ where: { id: req.params.id } })
    if (!row || (row.source === 'custom' && row.userId !== userId)) {
      notFound(res, 'Tool not found')
      return
    }
    if (row.source !== 'custom') {
      fail(res, 'Builtin tools cannot be deleted; use toggle instead', -1, 400)
      return
    }
    await prisma.tool.delete({ where: { id: row.id } })
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id })
  },

  /** POST /tools/:id/toggle — 启用/禁用（builtin 登记行或 custom） */
  async toggleTool(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const row = await prisma.tool.findUnique({ where: { id: req.params.id } })
    if (!row || (row.source === 'custom' && row.userId !== userId)) {
      notFound(res, 'Tool not found')
      return
    }
    const updated = await prisma.tool.update({
      where: { id: row.id },
      data: { enabled: !row.enabled, updatedAt: new Date() }
    })
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id, enabled: Boolean(updated.enabled) })
  },

  // -------------------------------------------------------------------------
  // 权限规则（T15/T16）
  // -------------------------------------------------------------------------

  /** GET /tools/permissions — 当前用户可见的权限规则 */
  async listPermissions(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const agentId = req.query.agentId ? String(req.query.agentId) : undefined
    const rules = await listToolPermissionRules(userId, agentId)
    success(res, rules)
  },

  /** PUT /tools/permissions — upsert 权限规则（global 仅管理员，user/agent 本人） */
  async upsertPermission(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = permissionRuleSchema.safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const { scope, agentId, toolName, permission, argumentRules } = parsed.data
    if (!isPermissionScope(scope) || !isToolPermission(permission)) {
      fail(res, 'Invalid scope or permission', -1, 400)
      return
    }
    if (scope === 'global' && userId !== 1) {
      fail(res, 'Global rules are admin-only', -1, 403)
      return
    }
    const input: ToolPermissionInput = {
      scope,
      toolName,
      permission,
      argumentRules: argumentRules as ArgumentRule[] | undefined
    }
    if (scope === 'user' || scope === 'agent') input.userId = userId
    if (scope === 'agent') input.agentId = agentId
    const id = await upsertToolPermission(input)
    success(res, { ok: true, id })
  },

  /** DELETE /tools/permissions/:id — 删除权限规则 */
  async deletePermission(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const ok = await deleteToolPermission(req.params.id, userId)
    if (!ok) {
      fail(res, 'Permission rule not found or not owned by you', -1, 404)
      return
    }
    success(res, { ok: true, id: req.params.id })
  },

  // -------------------------------------------------------------------------
  // MCP Server（T17/T18）
  // -------------------------------------------------------------------------

  /** GET /tools/mcp-servers — 用户 MCP server 列表 */
  async listMcpServers(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const rows = await prisma.mcpServer.findMany({ where: { userId } })
    success(res, rows)
  },

  /** POST /tools/mcp-servers — 创建 MCP server */
  async createMcpServer(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = mcpServerSchema.safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const { name, transport, url, headersJson } = parsed.data
    const row = await prisma.mcpServer.create({
      data: {
        userId,
        name,
        transport,
        url,
        headersJson,
        enabled: true,
        status: 'disconnected',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    success(res, { id: row.id, name: row.name })
  },

  /** PUT /tools/mcp-servers/:id — 更新 MCP server（重建会话） */
  async updateMcpServer(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = mcpServerSchema.partial().safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const row = await prisma.mcpServer.findUnique({ where: { id: req.params.id } })
    if (!row || row.userId !== userId) {
      notFound(res, 'MCP server not found')
      return
    }
    const { name, transport, url, headersJson } = parsed.data
    await prisma.mcpServer.update({
      where: { id: row.id },
      data: {
        ...(name ? { name } : {}),
        ...(transport ? { transport } : {}),
        ...(url ? { url } : {}),
        ...(headersJson !== undefined ? { headersJson } : {}),
        status: 'disconnected',
        error: null,
        updatedAt: new Date()
      }
    })
    mcpRegistry.closeServer(row.id)
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id })
  },

  /** DELETE /tools/mcp-servers/:id — 删除 MCP server */
  async deleteMcpServer(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const row = await prisma.mcpServer.findUnique({ where: { id: req.params.id } })
    if (!row || row.userId !== userId) {
      notFound(res, 'MCP server not found')
      return
    }
    mcpRegistry.closeServer(row.id)
    await prisma.mcpServer.delete({ where: { id: row.id } })
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id })
  },

  /** POST /tools/mcp-servers/:id/test — 测试连接 + 拉取工具列表 */
  async testMcpServer(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const row = await prisma.mcpServer.findUnique({ where: { id: req.params.id } })
    if (!row || row.userId !== userId) {
      notFound(res, 'MCP server not found')
      return
    }
    const config = mcpServerRowToConfig(row)
    try {
      const client = await mcpRegistry.connect(config)
      const tools = await client.listTools()
      success(res, {
        status: 'connected',
        serverInfo: client.serverInfo ?? null,
        protocolVersion: client.protocolVersion ?? null,
        tools
      })
    } catch (err) {
      fail(res, `MCP connect failed: ${(err as Error)?.message ?? String(err)}`, -1, 502)
    }
  },

  // -------------------------------------------------------------------------
  // Skills（T19）
  // -------------------------------------------------------------------------

  /** GET /tools/skills — Skill 列表（全局 + 本人） */
  async listSkills(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const rows = await prisma.skill.findMany({ where: { OR: [{ userId: null }, { userId }] } })
    success(res, rows)
  },

  /** POST /tools/skills — 创建 Skill（本人） */
  async createSkill(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = skillSchema.safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const { name, description, content, version } = parsed.data
    const row = await prisma.skill.create({
      data: {
        userId,
        name,
        description,
        content,
        version,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    toolRouter.invalidate()
    success(res, { id: row.id, name: row.name })
  },

  /** PUT /tools/skills/:id — 更新 Skill（本人或全局） */
  async updateSkill(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const parsed = skillSchema.partial().safeParse(req.body)
    if (!parsed.success) {
      fail(res, parsed.error.issues[0]?.message ?? '参数错误', -1, 400)
      return
    }
    const row = await prisma.skill.findUnique({ where: { id: req.params.id } })
    if (!row || (row.userId !== null && row.userId !== userId)) {
      notFound(res, 'Skill not found')
      return
    }
    const { name, description, content, version } = parsed.data
    await prisma.skill.update({
      where: { id: row.id },
      data: {
        ...(name ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(version ? { version } : {}),
        updatedAt: new Date()
      }
    })
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id })
  },

  /** DELETE /tools/skills/:id — 删除 Skill（本人） */
  async deleteSkill(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req, res)
    if (userId === null) return
    const row = await prisma.skill.findUnique({ where: { id: req.params.id } })
    if (!row || (row.userId !== null && row.userId !== userId)) {
      notFound(res, 'Skill not found')
      return
    }
    await prisma.skill.delete({ where: { id: row.id } })
    toolRouter.invalidate()
    success(res, { ok: true, id: row.id })
  }
}

function mcpServerRowToConfig(row: Record<string, any>): McpServerConfig {
  let headers: Record<string, string> = {}
  try {
    headers = row.headersJson ? (JSON.parse(row.headersJson) as Record<string, string>) : {}
  } catch {
    headers = {}
  }
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    transport: row.transport === 'streamable-http' ? 'streamable-http' : 'sse',
    url: row.url,
    headers,
    enabled: Boolean(row.enabled)
  }
}
