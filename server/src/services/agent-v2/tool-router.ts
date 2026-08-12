/**
 * Tool Router — Phase 2（T14 动态工具路由）
 *
 * 职责：把"代码写死的内置工具"升级为"可动态组装的工具集"：
 *   base     = 内置工具（list_dir/read_file/...），tools 表 source=builtin 且 enabled=0 时移除
 *   dynamic  = DB 自定义工具（tools 表 source=custom）+ MCP 工具 + Skill 工具（read_skill）
 *
 * 每次运行（AgentLoop.start）先 sync(userId, agentId)，再取 getDefinitions() 供 LLM 使用；
 * 执行走 get(name) → execute，保证"禁用/注册"在运行时生效。
 */

import { prisma } from '../../prisma.js'
import type { AgentTool, ToolResult, ToolContext } from '../agent/types.js'
import { toToolDefinition } from '../agent/types.js'
import { ToolRegistry, createDefaultRegistry } from '../agent/index.js'
import type { ToolDefinition } from '../llm/types.js'
import { mcpRegistry } from '../mcp/registry.js'
import { buildDeviceTools } from '../android/tools.js'
import { deviceRegistry } from '../android/device-registry.js'
import { kindForDeviceTool, withCapabilityCheck } from '../android/executor-factory.js'
import { buildReadSkillTool, loadSkills } from '../skills/loader.js'
import { getRelevantMemories, saveMemory } from '../memory/index.js'
import { executeWorkflow, getWorkflow } from '../workflow/index.js'
import { logger } from '../../utils/logger.js'

export type ToolSource = 'builtin' | 'custom' | 'mcp' | 'skill' | 'device' | 'memory' | 'workflow'

export interface RouterToolEntry {
  tool: AgentTool
  source: ToolSource
  /** tools 表登记行 id（builtin/custom 有；mcp/skill 无） */
  rowId?: string
}

export class ToolRouter {
  private readonly base: ToolRegistry
  private readonly dynamic = new Map<string, AgentTool>()
  private readonly sources = new Map<string, ToolSource>()
  private readonly rowIds = new Map<string, string>()
  private syncedFor: { userId: number; agentId?: string } | null = null

  constructor(base?: ToolRegistry) {
    this.base = base ?? createDefaultRegistry()
  }

  /** 当前注册表（兼容旧调用：v1 工具全集） */
  get registry(): ToolRegistry {
    return this.base
  }

  /** 按用户同步动态工具集（幂等；同一用户+agent 只同步一次，除非 force） */
  async sync(userId: number, agentId?: string, force = false): Promise<void> {
    // 0) 设备工具：每次 sync 都按当前设备状态刷新（连接/断开无需 invalidate）
    await this.refreshDeviceTools(userId)
    const key = { userId, agentId }
    if (
      !force &&
      this.syncedFor &&
      this.syncedFor.userId === userId &&
      this.syncedFor.agentId === agentId
    ) {
      return
    }
    this.syncedFor = key

    // 1) 内置工具：tools 表登记为 builtin 且禁用 → 从 base 移除
    const registered = await prisma.tool.findMany({ where: { source: 'builtin' } })
    const disabledBuiltins = new Set(
      registered.filter((row: any) => !row.enabled).map((row: any) => row.name)
    )
    for (const name of disabledBuiltins) this.base.remove(name)
    for (const row of registered) {
      if (row.enabled) this.rowIds.set(row.name, row.id)
    }

    // 2) 自定义工具（tools 表 source=custom，全局或本人）
    // 选择性清理：device 来源工具由 refreshDeviceTools 独立管理（不随全量清空）
    for (const [name, source] of [...this.sources]) {
      if (source !== 'device' && source !== 'memory' && source !== 'workflow') {
        this.dynamic.delete(name)
        this.sources.delete(name)
        this.rowIds.delete(name)
      }
    }
    const customs = await prisma.tool.findMany({
      where: { source: 'custom', enabled: true, OR: [{ userId: null }, { userId }] }
    })
    for (const row of customs) {
      const tool = customToolFromRow(row)
      this.dynamic.set(tool.name, tool)
      this.sources.set(tool.name, 'custom')
      this.rowIds.set(tool.name, row.id)
    }

    // 3) Skill 工具：read_skill（用户可见 Skill 变化后由 sync(force) 刷新）
    const readSkill = buildReadSkillTool(userId, () => loadSkills(userId))
    this.dynamic.set(readSkill.name, readSkill)
    this.sources.set(readSkill.name, 'skill')

    // 4) MCP 工具（连接失败仅记录，不影响其他工具）
    try {
      const mcpTools = await mcpRegistry.buildTools(userId)
      for (const tool of mcpTools) {
        this.dynamic.set(tool.name, tool)
        this.sources.set(tool.name, 'mcp')
      }
    } catch (err) {
      logger.warn(`[tool-router] mcp sync failed: ${(err as Error)?.message ?? String(err)}`)
    }
    // 5) Memory / Workflow 工具（Phase 4：内置能力，总是注册）
    this.registerMemoryWorkflowTools(userId)
  }

  /**
   * Memory / Workflow 工具（Phase 4）：记忆存取 + 工作流执行（内置能力，总是注册）
   */
  private registerMemoryWorkflowTools(userId: number): void {
    this.dynamic.set('memory_save', {
      name: 'memory_save',
      description:
        '保存一条长期记忆（kind: episodic 任务经历 / semantic 事实 / preference 偏好；content 为记忆内容；summary 可选摘要；importance 0-1 重要性）。',
      parameters: {
        type: 'object',
        properties: {
          kind: {
            type: 'string',
            enum: ['episodic', 'semantic', 'preference'],
            description: '记忆类型（默认 episodic）'
          },
          content: { type: 'string', description: '记忆内容' },
          summary: { type: 'string', description: '可选摘要' },
          importance: { type: 'number', description: '重要性 0-1（默认 0.5）' }
        },
        required: ['content']
      },
      execute: async args => {
        const content = String(args.content ?? '').trim()
        if (!content) return { ok: false, output: 'content required' }
        await saveMemory(userId, {
          kind: (args.kind as any) ?? 'episodic',
          content,
          summary: args.summary ? String(args.summary) : undefined,
          importance: typeof args.importance === 'number' ? args.importance : 0.5,
          source: 'agent'
        })
        return { ok: true, output: JSON.stringify({ saved: true }) }
      }
    })
    this.sources.set('memory_save', 'memory')

    this.dynamic.set('memory_recall', {
      name: 'memory_recall',
      description:
        '检索历史记忆（query 为检索词；limit 返回条数，默认 5）。用于回忆用户偏好、历史任务结果等。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '检索关键词' },
          limit: { type: 'integer', description: '返回条数（1-20）' }
        },
        required: ['query']
      },
      execute: async args => {
        const hits = await getRelevantMemories(userId, String(args.query ?? ''), {
          limit: typeof args.limit === 'number' ? args.limit : 5
        })
        if (hits.length === 0) return { ok: true, output: '未找到相关记忆' }
        return {
          ok: true,
          output: JSON.stringify(
            hits.map(h => ({ kind: h.kind, content: h.content, summary: h.summary })),
            null,
            2
          )
        }
      }
    })
    this.sources.set('memory_recall', 'memory')

    this.dynamic.set('run_workflow', {
      name: 'run_workflow',
      description:
        '执行一个已保存的工作流（workflowId 为工作流 ID；input 为入参对象，步骤中可用 {{input.xxx}} 引用）。',
      parameters: {
        type: 'object',
        properties: {
          workflowId: { type: 'string', description: '工作流 ID' },
          input: { type: 'object', description: '工作流入参' }
        },
        required: ['workflowId']
      },
      execute: async args => {
        const workflow = await getWorkflow(userId, String(args.workflowId ?? ''))
        if (!workflow)
          return { ok: false, output: 'Workflow not found: ' + String(args.workflowId ?? '') }
        if (!workflow.enabled)
          return { ok: false, output: 'Workflow ' + workflow.name + ' is disabled' }
        const record = await executeWorkflow(
          workflow,
          (args.input as Record<string, unknown>) ?? {},
          {
            userId,
            modelId: args.modelId ? String(args.modelId) : undefined
          }
        )
        if (record.status !== 'completed') {
          return {
            ok: false,
            output:
              'Workflow ' +
              workflow.name +
              ' ' +
              record.status +
              ': ' +
              (record.error ?? 'unknown error')
          }
        }
        return { ok: true, output: JSON.stringify(record.output ?? {}) }
      }
    })
    this.sources.set('run_workflow', 'workflow')
  }

  /**
   * 设备工具（Phase 3）：用户有设备（在线或历史）时注册 device-* 工具；
   * 执行时按 deviceRegistry 当前能力做通道校验，设备离线返回引导提示。
   */
  private async refreshDeviceTools(userId: number): Promise<void> {
    // 无设备记录则移除（用户从未连接过 Android 设备时不占用 LLM 工具位）
    let hasDevice = deviceRegistry.listOnline(userId).length > 0
    if (!hasDevice) {
      hasDevice = (await prisma.device.findFirst({ where: { userId } })) !== null
    }
    const existing = [...this.dynamic.keys()].filter(n => this.sources.get(n) === 'device')
    if (!hasDevice) {
      for (const name of existing) {
        this.dynamic.delete(name)
        this.sources.delete(name)
        this.rowIds.delete(name)
      }
      return
    }
    const deviceTools = buildDeviceTools(userId)
    for (const tool of deviceTools) {
      const kind = kindForDeviceTool(tool.name)
      this.dynamic.set(tool.name, {
        ...tool,
        execute: (args, ctx) =>
          withCapabilityCheck(
            async a => tool.execute(a, ctx),
            kind,
            () => deviceRegistry.firstOnline(userId)?.info.capabilities ?? []
          )(args)
      })
      this.sources.set(tool.name, 'device')
    }
  }

  /** LLM 可见工具定义（base + dynamic） */
  getDefinitions(): ToolDefinition[] {
    const defs = this.base.getDefinitions()
    for (const tool of this.dynamic.values()) defs.push(toToolDefinition(tool))
    return defs
  }

  get(name: string): AgentTool | undefined {
    return this.dynamic.get(name) ?? this.base.get(name)
  }

  has(name: string): boolean {
    return this.dynamic.has(name) || this.base.has(name)
  }

  /** 全部工具条目（管理页展示用） */
  list(): RouterToolEntry[] {
    const entries: RouterToolEntry[] = []
    for (const tool of this.base.list()) {
      entries.push({ tool, source: 'builtin', rowId: this.rowIds.get(tool.name) })
    }
    for (const tool of this.dynamic.values()) {
      entries.push({
        tool,
        source: this.sources.get(tool.name) ?? 'custom',
        rowId: this.rowIds.get(tool.name)
      })
    }
    return entries
  }

  /** 执行工具：动态优先，错误收敛为 ToolResult */
  async execute(
    name: string,
    args: Record<string, unknown>,
    ctx: ToolContext
  ): Promise<ToolResult> {
    const tool = this.get(name)
    if (!tool) return { ok: false, output: `Unknown tool: ${name}` }
    try {
      return await tool.execute(args ?? {}, ctx)
    } catch (err) {
      return {
        ok: false,
        output: `Tool ${name} failed: ${(err as Error)?.message ?? String(err)}`
      }
    }
  }

  /** 强制下次 sync 重新加载（工具/权限变更后由管理接口调用） */
  invalidate(): void {
    this.syncedFor = null
  }
}

/** tools 表行 → AgentTool（custom 工具：参数 JSON Schema 直接暴露给 LLM） */
function customToolFromRow(row: Record<string, any>): AgentTool {
  let parameters: Record<string, unknown> = { type: 'object', properties: {} }
  try {
    parameters = row.parametersJson
      ? (JSON.parse(row.parametersJson) as Record<string, unknown>)
      : parameters
  } catch {
    parameters = { type: 'object', properties: {} }
  }
  return {
    name: row.name,
    description: row.description || `Custom tool ${row.name}`,
    parameters,
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      // 自定义工具默认"回声"执行：参数校验 + 返回执行确认
      // 进阶：config_json 里可声明 executor=http/webhook 等（Phase 3+ 扩展）
      return { ok: true, output: JSON.stringify({ tool: row.name, received: args ?? {} }) }
    }
  }
}

/**
 * 确保内置工具在 tools 表中有登记行（管理页启停开关数据源）。
 * 幂等：已存在按 name 跳过；新登记 source=builtin 且默认 enabled=1。
 * 内置工具定义来自 base registry（createDefaultRegistry）。
 */
export async function ensureBuiltinToolRows(): Promise<void> {
  const base = createDefaultRegistry()
  const existing = await prisma.tool.findMany({ where: { source: 'builtin' } })
  const existingNames = new Set(existing.map((row: any) => row.name))
  for (const tool of base.list()) {
    if (existingNames.has(tool.name)) continue
    await prisma.tool
      .create({
        data: {
          userId: null,
          name: tool.name,
          description: tool.description,
          parametersJson: JSON.stringify(tool.parameters),
          source: 'builtin',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      .catch((err: unknown) => {
        logger.warn(
          '[tool-router] register builtin row ' +
            tool.name +
            ' failed: ' +
            ((err as Error)?.message ?? String(err))
        )
      })
  }
}

/** 单例（进程内共享；每次 run 调用 sync 刷新） */
export const toolRouter = new ToolRouter()
