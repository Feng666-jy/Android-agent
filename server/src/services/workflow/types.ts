/**
 * Workflow 领域类型 — Phase 4（T31）
 *
 * 工作流 = 有序步骤列表（线性执行 + 变量传递）：
 *  - tool_call   ：调用 ToolRouter 中的任意工具（含设备工具/MCP/Skill）
 *  - llm_call    ：独立 LLM 调用（prompt 模板）
 *  - memory_write：向记忆库写入一条记忆
 *
 * 变量语法：{{input.xxx}}（工作流入参）、{{steps.<stepId>.output}}（上一步输出）
 */

/** 步骤类型 */

import type { MemoryKind, MemorySource } from '../memory/types.js'

export type WorkflowStepType = 'tool_call' | 'llm_call' | 'memory_write'

/** 工作流步骤定义 */
export interface WorkflowStep {
  id: string
  type: WorkflowStepType
  /** tool_call 必填：工具名 */
  tool?: string
  /** tool_call 参数 / llm_call 变量（支持 {{}} 替换） */
  args?: Record<string, unknown>
  /** llm_call 必填：提示词模板 */
  prompt?: string
  /** memory_write：记忆内容（支持 {{}} 替换） */
  memory?: { kind?: string; content: string; summary?: string; importance?: number }
  /** 步骤说明（管理页展示） */
  description?: string
}

/** 工作流定义（DB 行） */
export interface WorkflowDef {
  id: string
  userId: number
  name: string
  description: string
  trigger: 'manual' | 'event'
  steps: WorkflowStep[]
  enabled: boolean
  version: number
  createdAt: string
  updatedAt: string
}

/** 工作流执行记录 */
export interface WorkflowRunRecord {
  id: string
  workflowId: string
  userId: number
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  input: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  startedAt?: string
  finishedAt?: string
  createdAt: string
}

/** 执行上下文 */
export interface WorkflowRunContext {
  /** 可省略：缺省回退 workflow.userId */
  userId?: number
  modelId?: string
  /** 注入工具执行器（默认 toolRouter.execute） */
  executeTool?: (
    name: string,
    args: Record<string, unknown>
  ) => Promise<{ ok: boolean; output: string }>
  /** 注入 LLM 调用（默认 llmService.chat） */
  chat?: (input: { modelId: string; prompt: string }) => Promise<string>
  /** 注入记忆写入（默认 saveMemory） */
  writeMemory?: (input: {
    kind?: MemoryKind
    content: string
    summary?: string
    importance?: number
    source?: MemorySource
  }) => Promise<unknown>
  signal?: AbortSignal
}
