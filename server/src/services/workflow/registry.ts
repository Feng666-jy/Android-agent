/**
 * Workflow Registry — Phase 4（T31）workflows 表读写
 */
import { prisma } from '../../prisma.js'
import { randomUUID } from 'node:crypto'
import type { WorkflowDef, WorkflowRunRecord, WorkflowStep } from './types.js'

/** 行 → WorkflowDef（steps_json 解析失败降级为空步骤） */
export function rowToWorkflow(row: Record<string, any>): WorkflowDef {
  let steps: WorkflowStep[] = []
  try {
    steps = row.stepsJson ? (JSON.parse(row.stepsJson) as WorkflowStep[]) : []
  } catch {
    steps = []
  }
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    description: row.description ?? '',
    trigger: (row.trigger as WorkflowDef['trigger']) ?? 'manual',
    steps,
    enabled: Boolean(row.enabled),
    version: row.version ?? 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/** 行 → WorkflowRunRecord */
export function rowToWorkflowRun(row: Record<string, any>): WorkflowRunRecord {
  let input: Record<string, unknown> = {}
  let output: Record<string, unknown> | undefined
  try {
    input = row.inputJson ? (JSON.parse(row.inputJson) as Record<string, unknown>) : {}
  } catch {
    input = {}
  }
  try {
    output = row.outputJson ? (JSON.parse(row.outputJson) as Record<string, unknown>) : undefined
  } catch {
    output = undefined
  }
  return {
    id: row.id,
    workflowId: row.workflowId,
    userId: row.userId,
    status: row.status,
    input,
    output,
    error: row.error ?? undefined,
    startedAt: row.startedAt ?? undefined,
    finishedAt: row.finishedAt ?? undefined,
    createdAt: row.createdAt
  }
}

/** 用户工作流列表 */
export async function listWorkflows(userId: number): Promise<WorkflowDef[]> {
  const rows = await prisma.workflow.findMany({
    where: { userId },
    orderBy: [{ updatedAt: 'desc' }]
  })
  return rows.map(rowToWorkflow)
}

/** 单个工作流（仅限本人） */
export async function getWorkflow(userId: number, id: string): Promise<WorkflowDef | null> {
  const row = await prisma.workflow.findFirst({ where: { id, userId } })
  return row ? rowToWorkflow(row) : null
}

/** 创建/更新工作流（id 存在且属于本人 → 更新，version+1） */
export async function saveWorkflow(
  userId: number,
  input: {
    id?: string
    name: string
    description?: string
    trigger?: WorkflowDef['trigger']
    steps: WorkflowStep[]
    enabled?: boolean
  }
): Promise<WorkflowDef> {
  const now = new Date()
  const stepsJson = JSON.stringify(input.steps ?? [])
  const data = {
    userId,
    name: input.name,
    description: input.description ?? '',
    trigger: input.trigger ?? 'manual',
    stepsJson,
    enabled: input.enabled ?? true,
    updatedAt: now
  }
  if (input.id) {
    const existing = await prisma.workflow.findFirst({ where: { id: input.id, userId } })
    if (!existing) throw new Error('Workflow not found')
    const row = await prisma.workflow.update({
      where: { id: existing.id },
      data: { ...data, version: (existing.version ?? 1) + 1 }
    })
    return rowToWorkflow(row)
  }
  const row = await prisma.workflow.create({
    data: { id: randomUUID(), ...data, version: 1, createdAt: now }
  })
  return rowToWorkflow(row)
}

/** 删除工作流（仅限本人；级联删除执行记录） */
export async function deleteWorkflow(userId: number, id: string): Promise<boolean> {
  const result = await prisma.workflow.deleteMany({ where: { id, userId } })
  return result.count > 0
}

/** 工作流执行历史（分页） */
export async function listWorkflowRuns(
  userId: number,
  workflowId: string,
  opts: { page?: number; pageSize?: number } = {}
): Promise<{ items: WorkflowRunRecord[]; total: number }> {
  const page = Math.max(1, opts.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20))
  const where = { userId, workflowId }
  const rows = await prisma.workflowRun.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }],
    skip: (page - 1) * pageSize,
    take: pageSize
  })
  const total = await prisma.workflowRun.count({ where })
  return { items: rows.map(rowToWorkflowRun), total }
}
