import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// ---- 类型（与服务端 services/agent-v2/tool-* / services/mcp / services/skills 对齐） ----

export type ToolSource = 'builtin' | 'custom' | 'mcp' | 'skill'

export interface ToolItem {
  id: string
  name: string
  description: string
  parametersJson: string
  source: ToolSource
  enabled: boolean
  userId: number | null
}

export type PermissionScope = 'global' | 'user' | 'agent'
export type ToolPermissionValue = 'allow' | 'ask' | 'deny'

export interface ArgumentRule {
  path: string
  operator: 'eq' | 'contains' | 'regex'
  value?: string
  permission: 'ask' | 'deny'
}

export interface ToolPermissionRule {
  id: string
  scope: PermissionScope
  userId?: number
  agentId?: string
  toolName: string
  permission: ToolPermissionValue
  argumentRules: ArgumentRule[]
}

export interface McpServerItem {
  id: string
  userId: number
  name: string
  transport: 'sse' | 'streamable-http'
  url: string
  headersJson: string
  enabled: boolean
  status: string
  error?: string
}

export interface McpToolDef {
  name: string
  description?: string
  inputSchema?: Record<string, unknown>
}

export interface SkillItem {
  id: string
  userId: number | null
  name: string
  description: string
  content: string
  version: string
  enabled: boolean
}

export interface ToolOverview {
  tools: ToolItem[]
  permissions: ToolPermissionRule[]
  mcpServers: McpServerItem[]
  skills: SkillItem[]
}

// ---- API ----

export const toolsAPI = {
  /** GET /v2/tools — 总览（工具 + 权限 + MCP + Skill） */
  overview(): Promise<ApiResponse<ToolOverview>> {
    return request.get('/v2/tools')
  },

  /** POST /v2/tools — 创建自定义工具 */
  createTool(data: {
    name: string
    description?: string
    parametersJson?: string
  }): Promise<ApiResponse<{ id: string; name: string }>> {
    return request.post('/v2/tools', data)
  },

  /** POST /v2/tools/:id/toggle — 启用/禁用 */
  toggleTool(id: string): Promise<ApiResponse<{ ok: boolean; enabled: boolean }>> {
    return request.post(`/v2/tools/${id}/toggle`)
  },

  /** DELETE /v2/tools/:id — 删除自定义工具 */
  deleteTool(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return request.delete(`/v2/tools/${id}`)
  },

  /** PUT /v2/tools/permissions — upsert 权限规则 */
  upsertPermission(data: {
    scope: PermissionScope
    agentId?: string
    toolName: string
    permission: ToolPermissionValue
    argumentRules?: ArgumentRule[]
  }): Promise<ApiResponse<{ ok: boolean; id: string }>> {
    return request.put('/v2/tools/permissions', data)
  },

  /** DELETE /v2/tools/permissions/:id */
  deletePermission(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return request.delete(`/v2/tools/permissions/${id}`)
  },

  /** POST /v2/tools/mcp-servers — 创建 MCP server */
  createMcpServer(data: {
    name: string
    transport?: string
    url: string
    headersJson?: string
  }): Promise<ApiResponse<{ id: string; name: string }>> {
    return request.post('/v2/tools/mcp-servers', data)
  },

  /** DELETE /v2/tools/mcp-servers/:id */
  deleteMcpServer(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return request.delete(`/v2/tools/mcp-servers/${id}`)
  },

  /** POST /v2/tools/mcp-servers/:id/test — 测试连接 */
  testMcpServer(id: string): Promise<ApiResponse<{ status: string; tools: McpToolDef[] }>> {
    return request.post(`/v2/tools/mcp-servers/${id}/test`)
  },

  /** POST /v2/tools/skills — 创建 Skill */
  createSkill(data: {
    name: string
    description?: string
    content?: string
    version?: string
  }): Promise<ApiResponse<{ id: string; name: string }>> {
    return request.post('/v2/tools/skills', data)
  },

  /** DELETE /v2/tools/skills/:id */
  deleteSkill(id: string): Promise<ApiResponse<{ ok: boolean }>> {
    return request.delete(`/v2/tools/skills/${id}`)
  }
}
