/**
 * MCP Registry — SessionRegistry（T18）+ 工具加载
 *
 * - 进程内会话表：serverId → McpClient（延迟建立，失败不阻塞 Agent 主流程）
 * - loadToolsForUser：读取该用户启用的 mcp_servers，连接并拉取工具列表
 * - reconnect：断线状态机的入口（指数退避在 client.reconnect 内）
 */

import { prisma } from '../../prisma.js'
import { logger } from '../../utils/logger.js'
import type { AgentTool, ToolResult } from '../agent/types.js'
import { McpClient } from './client.js'
import type { McpServerConfig, McpToolDef } from './types.js'

export class McpRegistry {
  private readonly sessions = new Map<string, McpClient>()
  private readonly connectLocks = new Map<string, Promise<McpClient>>()

  /** 获取（必要时创建）某个 server 的会话 */
  getOrCreate(config: McpServerConfig): McpClient {
    let client = this.sessions.get(config.id)
    if (!client) {
      client = new McpClient(config)
      this.sessions.set(config.id, client)
    }
    return client
  }

  /** 并发安全的 connect（同一 server 只建立一个会话） */
  connect(config: McpServerConfig): Promise<McpClient> {
    const existing = this.connectLocks.get(config.id)
    if (existing) return existing
    const promise = this.getOrCreate(config)
      .connect()
      .then(() => this.getOrCreate(config))
      .finally(() => this.connectLocks.delete(config.id))
    this.connectLocks.set(config.id, promise)
    return promise
  }

  /** 拉取某 server 的工具列表（连接失败返回空数组 + 记录状态，不抛给调用方） */
  async listTools(config: McpServerConfig): Promise<McpToolDef[]> {
    try {
      const client = await this.connect(config)
      const tools = await client.listTools()
      await this.updateServerStatus(config.id, 'connected', undefined)
      return tools
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      logger.warn(`[mcp] listTools ${config.name} failed: ${message}`)
      await this.updateServerStatus(config.id, 'error', message)
      return []
    }
  }

  /** 调用工具（未连接则先重连一次；失败返回 ok:false 结果） */
  async callTool(
    config: McpServerConfig,
    name: string,
    args: Record<string, unknown>
  ): Promise<ToolResult> {
    try {
      let client = this.sessions.get(config.id)
      if (!client || !client.isConnected) {
        client = await this.connect(config)
      }
      const result = await client.callTool(name, args)
      const text = (result.content ?? [])
        .filter(block => block.type === 'text' && block.text)
        .map(block => block.text)
        .join('\n')
      return { ok: !result.isError, output: text || '(no text content)' }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await this.updateServerStatus(config.id, 'error', message).catch(() => undefined)
      return { ok: false, output: `MCP tool ${name} failed: ${message}` }
    }
  }

  /** 从 DB 加载用户启用的 MCP server 列表 */
  async loadServers(userId: number): Promise<McpServerConfig[]> {
    const rows = await prisma.mcpServer.findMany({ where: { userId, enabled: true } })
    return rows.map(toConfig)
  }

  /** 构建该用户所有启用 MCP 工具（AgentTool 形态，供 ToolRouter 注册） */
  async buildTools(userId: number): Promise<AgentTool[]> {
    const servers = await this.loadServers(userId)
    const tools: AgentTool[] = []
    for (const server of servers) {
      const defs = await this.listTools(server)
      for (const def of defs) {
        tools.push(mcpToolToAgentTool(server, def, this))
      }
    }
    return tools
  }

  /** 关闭某 server 会话（配置变更/删除时调用） */
  closeServer(serverId: string): void {
    const client = this.sessions.get(serverId)
    if (client) {
      client.close()
      this.sessions.delete(serverId)
    }
  }

  closeAll(): void {
    for (const client of this.sessions.values()) client.close()
    this.sessions.clear()
    this.connectLocks.clear()
  }

  private async updateServerStatus(
    serverId: string,
    status: string,
    error?: string
  ): Promise<void> {
    await prisma.mcpServer
      .update({
        where: { id: serverId },
        data: {
          status,
          ...(error !== undefined ? { error } : {}),
          updatedAt: new Date()
        }
      })
      .catch((err: unknown) => {
        logger.warn(`[mcp] update status failed: ${(err as Error)?.message ?? String(err)}`)
      })
  }
}

/** MCP 工具 → AgentTool 适配（executor 走 registry.callTool） */
export function mcpToolToAgentTool(
  server: McpServerConfig,
  def: McpToolDef,
  registry: McpRegistry
): AgentTool {
  const display = def.description ?? `MCP tool from ${server.name}`
  return {
    name: def.name,
    description: `${display} (via MCP:${server.name})`,
    parameters: (def.inputSchema as Record<string, unknown>) ?? { type: 'object', properties: {} },
    execute: args => registry.callTool(server, def.name, args ?? {})
  }
}

function toConfig(row: Record<string, any>): McpServerConfig {
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

export const mcpRegistry = new McpRegistry()
