/**
 * Agent V2 Loop — plan → act → observe → reflect 状态机（T09）
 *
 * 与 v1 runAgent 的关系：v1 是"同步长任务"，v2 是"可观察异步运行"。
 * 本 Loop 复用 v1 的 ToolRegistry / 权限解析 / ApprovalStore，把每次运行输出为
 * 事件总线事件（SSE 数据源），并支持协作式暂停/恢复/取消。
 *
 * 状态机：
 *   queued → planning → running ⇄ paused → completed | failed | cancelled | budget_exceeded
 */

import { randomUUID } from 'node:crypto'
import { logger } from '../../utils/logger.js'
import { prisma } from '../../prisma.js'
import { llmService } from '../llm/index.js'
import type { ChatMessage, ToolCall, TokenUsage } from '../llm/types.js'
import { ToolRegistry } from '../agent/index.js'
import { normalizePermissionConfig, resolvePermission } from '../agent/permissions.js'
import { resolveSandboxRoot } from '../agent/sandbox.js'
import type { ApprovalHandler, ApprovalRequest } from '../agent/types.js'
import { ToolRouter } from './tool-router.js'
import {
  listToolPermissionRules,
  resolvePermissionWithRules,
  type ToolPermissionRule
} from './tool-permissions.js'
import { loadSkills } from '../skills/loader.js'
import { buildSkillPrompt } from '../skills/injector.js'
import { getRelevantMemories, renderMemoryBlock } from '../memory/index.js'
import { compactRunToMemory } from '../memory/compactor.js'
import { saveMemory } from '../memory/store.js'
import { LLMPlanner } from './planner.js'
import { ContextManager } from './context.js'
import { agentEventBus, makeEvent, type AgentEvent, type AgentEventType } from './events.js'
import { buildRunnerSystemPrompt, planToText } from './prompts.js'
import * as store from './store.js'
import type {
  AgentRunV2,
  AgentRunV2Input,
  RunController,
  RunStatus,
  StepKind,
  StepStatus
} from './types.js'

export interface LoopDeps {
  toolRegistry?: ToolRegistry
  /** Phase 2 动态工具路由（缺省：内置工具 + DB 动态工具） */
  toolRouter?: ToolRouter
  /** 预置权限规则（测试注入；缺省运行时从 DB 加载） */
  permissionRules?: ToolPermissionRule[]
  planner?: LLMPlanner
  /** permission=ask 时的审批处理器（v2 推荐 createPersistentApprovalHandler） */
  approvalHandler?: ApprovalHandler
  /** 事件旁路（测试/日志用；SSE 路由直接订阅 agentEventBus） */
  onEvent?: (evt: AgentEvent) => void
}

export interface LoopOptions extends AgentRunV2Input {
  /** 预生成 runId（controller 需要先拿到 id 才能构造审批处理器） */
  runId?: string
  deps?: LoopDeps
}

export const DEFAULT_MAX_ITERATIONS = 20
export const DEFAULT_TOKEN_BUDGET = 200_000

/** 协作式运行控制器：pause 在每轮之间生效；cancel 立即中断（AbortSignal） */
export class RunControllerImpl implements RunController {
  private paused = false
  private cancelled = false
  private readonly abort = new AbortController()
  private wakeResolvers: Array<() => void> = []
  readonly signal: AbortSignal = this.abort.signal

  pause(): void {
    this.paused = true
  }

  resume(): void {
    if (!this.paused) return
    this.paused = false
    this.wake()
  }

  cancel(): void {
    if (this.cancelled) return
    this.cancelled = true
    this.abort.abort()
    this.wake()
  }

  isPaused(): boolean {
    return this.paused
  }

  isCancelled(): boolean {
    return this.cancelled
  }

  /** 协作式挂起点：Loop 在每轮之间调用；pause 时挂起直到 resume/cancel */
  async waitIfPaused(): Promise<void> {
    if (!this.paused || this.cancelled) return
    await new Promise<void>(resolve => this.wakeResolvers.push(resolve))
  }

  private wake(): void {
    for (const resolve of this.wakeResolvers) resolve()
    this.wakeResolvers = []
  }
}

export class AgentLoop {
  readonly run: AgentRunV2
  readonly controller = new RunControllerImpl()
  private readonly options: LoopOptions
  private readonly router: ToolRouter
  private readonly planner: LLMPlanner
  private permissionRules: ToolPermissionRule[] = []
  private skillPrompt = ''
  private memoryBlock = ''
  private readonly context: ContextManager
  private readonly approvalHandler?: ApprovalHandler
  private readonly onEvent?: (evt: AgentEvent) => void

  constructor(options: LoopOptions) {
    this.options = options
    this.router = options.deps?.toolRouter ?? new ToolRouter(options.deps?.toolRegistry)
    this.planner = options.deps?.planner ?? new LLMPlanner()
    this.permissionRules = options.deps?.permissionRules ?? []
    this.approvalHandler = options.deps?.approvalHandler
    this.onEvent = options.deps?.onEvent
    const budget = options.tokenBudget ?? DEFAULT_TOKEN_BUDGET
    this.context = new ContextManager({
      maxTokens: budget,
      compactThreshold: Math.floor(budget * 0.8)
    })
    this.run = {
      id: options.runId ?? randomUUID(),
      userId: options.userId,
      conversationId: options.conversationId,
      agentId: options.agentId,
      modelId: options.modelId,
      task: options.task,
      sandboxRoot: resolveSandboxRoot(options.sandboxRoot),
      status: 'queued',
      messages: [],
      tokenUsed: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      iterations: 0,
      toolCalls: 0,
      createdAt: new Date().toISOString()
    }
  }

  /** 启动运行（异步；调用方不应 await 到完成，除非需要同步结果） */
  async start(): Promise<AgentRunV2> {
    this.emit('run.created', { task: this.run.task })
    await store.silent('create run', store.createRunRow(this.run))

    // Phase 2：同步动态工具集 + 权限规则 + Skill 摘要
    await this.router.sync(this.run.userId, this.run.agentId)
    if (!this.options.deps?.permissionRules) {
      this.permissionRules = await listToolPermissionRules(this.run.userId, this.run.agentId)
    }
    this.skillPrompt = buildSkillPrompt(await loadSkills(this.run.userId))

    // Phase 4：加载历史记忆（用户级；agent 配置 enable_memory=0 时跳过）
    if (await this.memoryEnabled()) {
      try {
        const hits = await getRelevantMemories(this.run.userId, this.run.task, { limit: 5 })
        this.memoryBlock = renderMemoryBlock(hits)
      } catch {
        this.memoryBlock = ''
      }
    }

    await this.setStatus('planning')
    try {
      this.run.plan = await this.planner.plan({
        modelId: this.run.modelId,
        task: this.run.task
      })
    } catch (err) {
      this.run.plan = {
        goal: this.run.task,
        steps: [{ seq: 1, title: '执行任务', description: this.run.task, status: 'pending' }],
        createdAt: new Date().toISOString()
      }
      this.emit('error', { message: `planner failed: ${(err as Error)?.message ?? String(err)}` })
    }
    this.emit('plan.generated', { plan: this.run.plan })
    await store.silent('save plan', store.savePlan(this.run.id, this.run.plan))
    for (const step of this.run.plan.steps) {
      await store.silent(
        'save plan step',
        store.saveStep(this.run.id, step.seq, 'plan', 'pending', step.title)
      )
    }

    await this.setStatus('running')

    for (let i = 0; i < this.maxIterations(); i++) {
      // 暂停/取消检查点
      await this.controller.waitIfPaused()
      if (this.controller.isCancelled()) {
        return this.finish('cancelled')
      }

      // 预算熔断
      if (this.context.overBudget(this.run.messages)) {
        return this.finish('budget_exceeded', 'Token budget exceeded')
      }

      // 上下文压缩
      if (this.context.shouldCompact(this.run.messages)) {
        const result = await this.context.compact(this.run.messages)
        this.run.messages = result.messages
        this.emit('context.compacted', { dropped: result.dropped })
      }

      const seq = i + 1
      this.run.iterations = seq
      this.emitStep('act', 'running', seq, { title: `第 ${seq} 轮执行` })

      let response
      try {
        response = await llmService.chat({
          modelId: this.run.modelId,
          messages: this.buildMessages(),
          tools: this.router.getDefinitions(),
          signal: this.controller.signal
        })
      } catch (err) {
        if (this.controller.isCancelled()) return this.finish('cancelled')
        return this.finish('failed', `LLM call failed: ${(err as Error)?.message ?? String(err)}`)
      }

      this.addUsage(response.usage)

      const assistant: ChatMessage = {
        role: 'assistant',
        content: response.content ?? null,
        toolCalls: response.toolCalls
      }
      this.run.messages.push(assistant)
      this.emit('message', { role: 'assistant', content: assistant.content ?? '', iteration: seq })
      await store.silent('append assistant', store.appendRunMessage(this.run.id, assistant))
      await this.persistConversationMessage(assistant)

      // 无工具调用 → 完成
      if (!response.toolCalls || response.toolCalls.length === 0) {
        this.emitStep('reflect', 'done', seq, { summary: response.content ?? '' })
        this.emitStep('final', 'done', seq, { result: response.content ?? '' })
        return this.finish('completed', undefined, response.content ?? '')
      }

      // 执行工具（observe 阶段）
      const results = await this.executeToolCalls(response.toolCalls, seq)
      for (const { message, record } of results) {
        this.run.messages.push(message)
        this.emit('message', {
          role: 'tool',
          toolCallId: message.toolCallId ?? undefined,
          content: message.content ?? '',
          iteration: seq
        })
        await store.silent('append tool result', store.appendRunMessage(this.run.id, message))
        await this.persistConversationMessage(message)
        void record // 工具明细已通过 tool.completed 事件与 agent_tool_calls 落库
      }

      // 迭代上限
      if (seq >= this.maxIterations()) {
        return this.finish('failed', `Max iterations (${this.maxIterations()}) reached`)
      }
    }

    return this.finish('failed', 'Max iterations reached')
  }

  // -------------------------------------------------------------------------
  // 内部
  // -------------------------------------------------------------------------

  private maxIterations(): number {
    return this.options.maxIterations ?? DEFAULT_MAX_ITERATIONS
  }

  private buildMessages(): ChatMessage[] {
    const planText = this.run.plan ? planToText(this.run.plan) : ''
    return [
      {
        role: 'system',
        content:
          buildRunnerSystemPrompt(this.run.task, planText) +
          (this.skillPrompt ? '\n\n' + this.skillPrompt : '') +
          (this.memoryBlock ? this.memoryBlock : '')
      },
      ...this.run.messages
    ]
  }

  private async executeToolCalls(
    toolCalls: ToolCall[],
    seq: number
  ): Promise<Array<{ message: ChatMessage; record: { id: string } }>> {
    const results: Array<{ message: ChatMessage; record: { id: string } }> = []
    const config = normalizePermissionConfig(this.options.permission)

    for (const tc of toolCalls) {
      this.run.toolCalls += 1
      const tool = this.router.get(tc.name)
      this.emit('tool.started', {
        toolCallId: tc.id,
        name: tc.name,
        arguments: tc.arguments,
        iteration: seq
      })
      await store.silent(
        'save step act',
        store.saveStep(this.run.id, seq, 'act', 'running', JSON.stringify(tc), undefined, tc.id)
      )

      const started = Date.now()
      let output: string
      let ok = false

      if (!tool) {
        output = `Unknown tool: ${tc.name}`
      } else {
        const fallback = resolvePermission(config, tc.name)
        const permission = resolvePermissionWithRules(
          this.permissionRules,
          tc.name,
          tc.arguments ?? {},
          fallback
        )
        if (permission === 'deny') {
          output = `Tool ${tc.name} is denied by permission policy.`
        } else if (permission === 'ask' && this.approvalHandler) {
          const request: ApprovalRequest = {
            toolCall: tc,
            sandboxRoot: this.run.sandboxRoot,
            permission,
            modelId: this.run.modelId,
            task: this.run.task
          }
          this.emit('approval.requested', {
            toolCallId: tc.id,
            name: tc.name,
            arguments: tc.arguments
          })
          const result = await this.approvalHandler(request, () =>
            Promise.resolve(tool.execute(tc.arguments ?? {}, { sandboxRoot: this.run.sandboxRoot }))
          )
          ok = result.ok
          output = result.output
        } else {
          const result = await this.router.execute(tc.name, tc.arguments ?? {}, {
            sandboxRoot: this.run.sandboxRoot
          })
          ok = result.ok
          output = result.output
        }
      }

      const durationMs = Date.now() - started
      this.emit('tool.completed', {
        toolCallId: tc.id,
        name: tc.name,
        ok,
        durationMs,
        output: output.slice(0, 500),
        iteration: seq
      })
      await store.silent(
        'save step observe',
        store.saveStep(
          this.run.id,
          seq,
          'observe',
          ok ? 'done' : 'failed',
          output.slice(0, 2000),
          output,
          tc.id
        )
      )

      results.push({
        message: { role: 'tool', toolCallId: tc.id, content: output },
        record: { id: tc.id }
      })
    }
    return results
  }

  private addUsage(usage?: TokenUsage): void {
    if (!usage) return
    this.run.tokenUsed = {
      inputTokens: this.run.tokenUsed.inputTokens + (usage.inputTokens ?? 0),
      outputTokens: this.run.tokenUsed.outputTokens + (usage.outputTokens ?? 0),
      totalTokens: this.run.tokenUsed.totalTokens + (usage.totalTokens ?? 0)
    }
  }

  private async setStatus(status: RunStatus, error?: string): Promise<void> {
    this.run.status = status
    if (error !== undefined) this.run.error = error
    this.emit('run.status', { status, error })
    await store.silent('update status', store.updateRunStatus(this.run.id, status, { error }))
  }

  /** 终态：同步更新内存状态并发出事件；持久化异步执行 */
  private finish(status: RunStatus, error?: string, result?: string): AgentRunV2 {
    this.run.status = status
    this.run.error = error
    this.run.finishedAt = new Date().toISOString()
    this.emit('run.status', { status, error })
    this.emit(this.finishEvent(status), { error, result })
    void store.silent(
      'finish run',
      store.updateRunStatus(this.run.id, status, { error, finishedAt: this.run.finishedAt })
    )
    if (result !== undefined) {
      void store.silent('save result', store.updateRunResult(this.run.id, result))
    }
    // Phase 4：任务结束后写入 episodic 记忆（异步、静默失败）
    if (status === 'completed' || status === 'failed') {
      void this.writeRunMemory()
    }
    void store.silent(
      'save stats',
      store.updateRunStats(this.run.id, {
        iterations: this.run.iterations,
        toolCallCount: this.run.toolCalls
      })
    )
    return this.run
  }

  /** agent 记忆开关：enable_memory 默认开启；配置为 0 时关闭 */
  private async memoryEnabled(): Promise<boolean> {
    if (!this.run.agentId) return true
    try {
      const agent = await prisma.agent.findFirst({ where: { id: this.run.agentId } })
      return agent ? agent.enableMemory !== false : true
    } catch {
      return true
    }
  }

  /** 把本次运行压缩为 episodic 记忆并入库（静默失败，不影响主流程） */
  private async writeRunMemory(): Promise<void> {
    try {
      if (!(await this.memoryEnabled())) return
      const { content, summary, importance } = compactRunToMemory(this.run)
      await saveMemory(this.run.userId, {
        kind: 'episodic',
        content,
        summary,
        importance,
        runId: this.run.id,
        agentId: this.run.agentId,
        conversationId: this.run.conversationId,
        source: 'system'
      })
    } catch (err) {
      logger.warn(`[loop] write memory failed: ${(err as Error)?.message ?? String(err)}`)
    }
  }

  private finishEvent(status: RunStatus): AgentEventType {
    switch (status) {
      case 'completed':
        return 'run.completed'
      case 'failed':
        return 'run.failed'
      case 'cancelled':
        return 'run.cancelled'
      case 'budget_exceeded':
        return 'run.budget_exceeded'
      default:
        return 'run.status'
    }
  }

  private emitStep(
    kind: StepKind,
    status: StepStatus,
    seq: number,
    data: Record<string, unknown> = {}
  ): void {
    if (status === 'running') {
      this.emit('step.started', { kind, seq, status, ...data })
    } else {
      this.emit(status === 'failed' ? 'step.failed' : 'step.completed', {
        kind,
        seq,
        status,
        ...data
      })
    }
  }

  private emit(type: AgentEventType, data?: Record<string, unknown>): void {
    const evt = makeEvent(type, this.run.id, data)
    agentEventBus.emit(evt)
    this.onEvent?.(evt)
  }

  private async persistConversationMessage(message: ChatMessage): Promise<void> {
    if (!this.run.conversationId) return
    await store.silent(
      'append conversation message',
      store.appendConversationMessage(this.run.conversationId, this.run.id, message)
    )
  }
}

/** 便捷工厂：创建并立即开始（返回 run 与其控制器） */
export function startAgentRun(options: LoopOptions): AgentLoop {
  const loop = new AgentLoop(options)
  void loop.start()
  return loop
}
