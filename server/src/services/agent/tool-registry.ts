/**
 * Agent 工具注册表
 *
 * - registerTool / getTools（LLM 可见定义）/ executeTool（带错误捕获）
 * - 执行错误不抛出，转为 { ok:false, output } 让 LLM 自行恢复
 */

import type { AgentTool, ToolContext, ToolResult } from './types.js'
import { toToolDefinition } from './types.js'
import type { ToolDefinition } from '../llm/types.js'
import { listDirTool, readFileTool, searchTool } from './tools/fs-tools.js'
import { writeFileTool, editFileTool } from './tools/fs-write-tools.js'
import { runCommandTool } from './tools/command-tool.js'

export class ToolRegistry {
  private tools = new Map<string, AgentTool>()

  register(tool: AgentTool): void {
    if (!tool.name || this.tools.has(tool.name)) {
      throw new Error(`Duplicate or invalid tool name: ${tool.name}`)
    }
    this.tools.set(tool.name, tool)
  }

  get(name: string): AgentTool | undefined {
    return this.tools.get(name)
  }

  has(name: string): boolean {
    return this.tools.has(name)
  }

  /** 移除工具（动态禁用内置工具用；不存在的 name 静默忽略） */
  remove(name: string): void {
    this.tools.delete(name)
  }

  /** LLM 可见的工具定义 */
  getDefinitions(): ToolDefinition[] {
    return [...this.tools.values()].map(toToolDefinition)
  }

  list(): AgentTool[] {
    return [...this.tools.values()]
  }

  /** 执行工具：任何异常都收敛为 ToolResult（不向上抛，让 LLM 继续） */
  async executeTool(
    name: string,
    args: Record<string, unknown>,
    ctx: ToolContext
  ): Promise<ToolResult> {
    const tool = this.tools.get(name)
    if (!tool) {
      return { ok: false, output: `Unknown tool: ${name}` }
    }
    try {
      const result = await tool.execute(args ?? {}, ctx)
      return result
    } catch (err) {
      return {
        ok: false,
        output: `Tool ${name} failed: ${(err as Error)?.message ?? String(err)}`
      }
    }
  }
}

export const toolRegistry = new ToolRegistry()
toolRegistry.register(listDirTool)
toolRegistry.register(readFileTool)
toolRegistry.register(searchTool)
toolRegistry.register(writeFileTool)
toolRegistry.register(editFileTool)
toolRegistry.register(runCommandTool)
