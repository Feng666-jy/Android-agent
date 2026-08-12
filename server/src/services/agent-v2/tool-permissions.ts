/**
 * Tool 权限服务 — Phase 2（T15 参数级审批 + T16 三级作用域持久化）
 *
 * 三级作用域：global → user → agent，逐级覆盖（agent 最具体）。
 * 每个作用域可配置工具级 permission（allow/ask/deny）与参数级规则
 * （argument_rules_json，命中则覆盖工具级 permission）。
 *
 * 解析顺序（同工具名）：
 *   1. 参数规则命中（agent > user > global）→ 使用规则 permission
 *   2. 工具级（agent > user > global）→ 使用作用域 permission
 *   3. 运行时 config / v1 默认策略兜底
 */

import { prisma } from '../../prisma.js'
import type { ToolPermission } from '../agent/types.js'

export type PermissionScope = 'global' | 'user' | 'agent'

export type RuleOperator = 'eq' | 'contains' | 'regex'

/** 参数级审批规则：命中 args[path] 时覆盖工具级权限 */
export interface ArgumentRule {
  path: string
  operator: RuleOperator
  value?: string
  permission: Extract<ToolPermission, 'ask' | 'deny'>
}

/** 已解析的权限规则（DB 行 + 解析后的参数规则） */
export interface ToolPermissionRule {
  id: string
  scope: PermissionScope
  userId?: number
  agentId?: string
  toolName: string
  permission: ToolPermission
  argumentRules: ArgumentRule[]
}

/** 写库入参（控制器使用） */
export interface ToolPermissionInput {
  scope: PermissionScope
  userId?: number
  agentId?: string
  toolName: string
  permission: ToolPermission
  argumentRules?: ArgumentRule[]
}

const VALID_PERMISSIONS: ToolPermission[] = ['allow', 'ask', 'deny']
const VALID_SCOPES: PermissionScope[] = ['global', 'user', 'agent']

export function isToolPermission(value: unknown): value is ToolPermission {
  return VALID_PERMISSIONS.includes(value as ToolPermission)
}

export function isPermissionScope(value: unknown): value is PermissionScope {
  return VALID_SCOPES.includes(value as PermissionScope)
}

// ---------------------------------------------------------------------------
// 参数规则解析 / 匹配
// ---------------------------------------------------------------------------

export function parseArgumentRules(json?: string | null): ArgumentRule[] {
  if (!json) return []
  try {
    const raw = JSON.parse(json)
    if (!Array.isArray(raw)) return []
    return raw.filter(isArgumentRule)
  } catch {
    return []
  }
}

function isArgumentRule(value: unknown): value is ArgumentRule {
  if (typeof value !== 'object' || value === null) return false
  const rule = value as Record<string, unknown>
  return (
    typeof rule.path === 'string' &&
    ['eq', 'contains', 'regex'].includes(String(rule.operator)) &&
    (rule.permission === 'ask' || rule.permission === 'deny')
  )
}

/** 按点分路径读取参数值（支持 a.b.c） */
export function getValueAtPath(args: Record<string, unknown>, path: string): unknown {
  let current: unknown = args
  for (const key of path.split('.')) {
    if (typeof current !== 'object' || current === null) return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

export function matchArgumentRule(rule: ArgumentRule, args: Record<string, unknown>): boolean {
  const actual = getValueAtPath(args, rule.path)
  if (actual === undefined) return false
  const actualStr = typeof actual === 'string' ? actual : JSON.stringify(actual)
  switch (rule.operator) {
    case 'eq':
      return rule.value !== undefined && actualStr === rule.value
    case 'contains':
      return rule.value !== undefined && actualStr.includes(rule.value)
    case 'regex': {
      if (!rule.value) return false
      try {
        return new RegExp(rule.value).test(actualStr)
      } catch {
        return false
      }
    }
    default:
      return false
  }
}

// ---------------------------------------------------------------------------
// DB 读写
// ---------------------------------------------------------------------------

/** 读取某用户（可选 agent）生效的全部规则：global + user + agent 三级 */
export async function listToolPermissionRules(
  userId: number,
  agentId?: string
): Promise<ToolPermissionRule[]> {
  const rows = await prisma.toolPermission.findMany({
    where: {
      OR: [
        { scope: 'global' },
        { scope: 'user', userId },
        ...(agentId ? [{ scope: 'agent', userId, agentId }] : [])
      ]
    }
  })
  return rows.map(toRule)
}

export async function listAllPermissionRules(): Promise<ToolPermissionRule[]> {
  const rows = await prisma.toolPermission.findMany({})
  return rows.map(toRule)
}

export async function createToolPermission(input: ToolPermissionInput): Promise<string> {
  const row = await prisma.toolPermission.create({
    data: {
      scope: input.scope,
      userId: input.userId ?? null,
      agentId: input.agentId ?? null,
      toolName: input.toolName,
      permission: input.permission,
      argumentRulesJson: input.argumentRules?.length ? JSON.stringify(input.argumentRules) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  return row.id
}

/** 幂等 upsert：同 scope+user+agent+tool 覆盖（返回 id） */
export async function upsertToolPermission(input: ToolPermissionInput): Promise<string> {
  const existing = await prisma.toolPermission.findFirst({
    where: {
      scope: input.scope,
      ...(input.userId !== undefined ? { userId: input.userId } : {}),
      ...(input.agentId !== undefined ? { agentId: input.agentId } : {}),
      toolName: input.toolName
    }
  })
  if (existing) {
    // 规则未提供 → 保留现有（显式传 [] 才清空）
    const rulesJson =
      input.argumentRules === undefined
        ? existing.argumentRulesJson
        : input.argumentRules.length
          ? JSON.stringify(input.argumentRules)
          : null
    await prisma.toolPermission.update({
      where: { id: existing.id },
      data: {
        permission: input.permission,
        argumentRulesJson: rulesJson,
        updatedAt: new Date()
      }
    })
    return existing.id
  }
  return createToolPermission(input)
}

export async function deleteToolPermission(id: string, userId: number): Promise<boolean> {
  const row = await prisma.toolPermission.findUnique({ where: { id } })
  if (!row) return false
  // 只有本人创建的 user/agent 规则或 global 规则可删（global 通常由管理员；此处放开由本人管理）
  if (row.scope === 'user' && row.userId !== userId) return false
  if (row.scope === 'agent' && row.userId !== userId) return false
  await prisma.toolPermission.delete({ where: { id } })
  return true
}

// ---------------------------------------------------------------------------
// 生效权限解析
// ---------------------------------------------------------------------------

const SCOPE_RANK: Record<PermissionScope, number> = { global: 0, user: 1, agent: 2 }

/**
 * 解析最终生效权限：
 * 1. 参数规则（同优先级作用域，规则 > 工具级）
 * 2. 工具级作用域覆盖
 * 3. fallback（运行时 config / 默认策略）
 */
export function resolvePermissionWithRules(
  rules: ToolPermissionRule[],
  toolName: string,
  args: Record<string, unknown>,
  fallback: ToolPermission
): ToolPermission {
  const toolRules = rules.filter(rule => rule.toolName === toolName)
  if (toolRules.length === 0) return fallback

  let effective: ToolPermission | undefined
  let bestRank = -1

  for (const rule of toolRules) {
    const rank = SCOPE_RANK[rule.scope] ?? -1
    // 参数规则：最高作用域命中即生效
    for (const argRule of rule.argumentRules) {
      if (rank >= bestRank && matchArgumentRule(argRule, args)) {
        effective = argRule.permission
        bestRank = rank
      }
    }
  }
  if (effective) return effective

  effective = undefined
  bestRank = -1
  for (const rule of toolRules) {
    const rank = SCOPE_RANK[rule.scope] ?? -1
    if (rank > bestRank) {
      effective = rule.permission
      bestRank = rank
    }
  }
  return effective ?? fallback
}

function toRule(row: Record<string, any>): ToolPermissionRule {
  return {
    id: row.id,
    scope: row.scope as PermissionScope,
    userId: row.userId ?? undefined,
    agentId: row.agentId ?? undefined,
    toolName: row.toolName,
    permission: row.permission,
    argumentRules: parseArgumentRules(row.argumentRulesJson)
  }
}
