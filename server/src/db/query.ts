/**
 * 查询构建器 — 把 Prisma 风格的 where / orderBy / include 翻译成 SQLite SQL。
 * 只实现本项目实际用到的子集。
 */

import { TABLES, RELATIONS } from './fieldmaps.js'
import { DbError } from './errors.js'
import type { TableConfig } from './fieldmaps.js'

export interface SqlParts {
  sql: string
  params: any[]
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function toDbValue(value: unknown): unknown {
  if (value === undefined) return null
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'boolean') return value ? 1 : 0
  return value
}

export function mapRowToJs(cfg: TableConfig, row: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [camel, col] of Object.entries(cfg.fields)) {
    let value = row[col]
    if (cfg.booleans.includes(camel)) value = value === 1 || value === true
    out[camel] = value
  }
  return out
}

export function mapDataToColumns(cfg: TableConfig, data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [camel, value] of Object.entries(data ?? {})) {
    const col = cfg.fields[camel]
    if (!col) throw new DbError(`Unknown field "${camel}" on "${cfg.table}"`, 'generic')
    out[col] = toDbValue(value)
  }
  return out
}

export function pick(obj: Record<string, any>, select: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const key of Object.keys(select ?? {})) {
    if (key in obj) out[key] = obj[key]
  }
  return out
}

function column(cfg: TableConfig, field: string): string {
  const col = cfg.fields[field]
  if (!col) throw new DbError(`Unknown field "${field}" on "${cfg.table}"`, 'generic')
  return col
}

function buildCondition(cfg: TableConfig, field: string, value: unknown): SqlParts {
  const col = column(cfg, field)

  if (value === null) {
    return { sql: `"${col}" IS NULL`, params: [] }
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const ops = value as Record<string, unknown>
    if ('contains' in ops) {
      return { sql: `"${col}" LIKE ?`, params: [`%${String(ops.contains)}%`] }
    }
    if ('in' in ops) {
      const list = (ops.in ?? []) as unknown[]
      if (list.length === 0) return { sql: '1=0', params: [] }
      return {
        sql: `"${col}" IN (${list.map(() => '?').join(', ')})`,
        params: list.map(v => toDbValue(v))
      }
    }
    const COMPARATORS: Record<string, string> = { lt: '<', lte: '<=', gt: '>', gte: '>=' }
    for (const [op, symbol] of Object.entries(COMPARATORS)) {
      if (op in ops) {
        return { sql: `"${col}" ${symbol} ?`, params: [toDbValue(ops[op])] }
      }
    }
    if ('not' in ops) {
      if (ops.not === null) return { sql: `"${col}" IS NOT NULL`, params: [] }
      return { sql: `"${col}" <> ?`, params: [toDbValue(ops.not)] }
    }
    throw new DbError(`Unsupported operator on field "${field}"`, 'generic')
  }

  return { sql: `"${col}" = ?`, params: [toDbValue(value)] }
}

export function buildWhere(cfg: TableConfig, where: Record<string, any> | undefined): SqlParts {
  if (!where || Object.keys(where).length === 0) return { sql: '', params: [] }

  const clauses: string[] = []
  const params: unknown[] = []

  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR') {
      const branches = (value ?? []) as Record<string, any>[]
      if (branches.length > 0) {
        const parts = branches.map(b => buildWhere(cfg, b))
        clauses.push(`(${parts.map(p => p.sql).join(' OR ')})`)
        parts.forEach(p => params.push(...p.params))
      }
      continue
    }
    const cond = buildCondition(cfg, key, value)
    clauses.push(cond.sql)
    params.push(...cond.params)
  }

  return { sql: clauses.join(' AND '), params }
}

export interface OrderByResult {
  sql: string
  joins: string[]
}

export function buildOrderBy(model: string, orderBy: unknown): OrderByResult {
  if (!orderBy) return { sql: '', joins: [] }
  const cfg = TABLES[model]
  const list = Array.isArray(orderBy) ? orderBy : [orderBy]

  const cols: string[] = []
  const joins: string[] = []

  for (const item of list as Record<string, any>[]) {
    for (const [key, dir] of Object.entries(item)) {
      if (dir && typeof dir === 'object' && !Array.isArray(dir)) {
        // 嵌套关系排序：如 [{ usageStats: { lastUsedAt: "desc" } }]
        const rel = RELATIONS[model]?.[key]
        if (!rel) throw new DbError(`Unknown relation "${key}" on "${model}"`, 'generic')
        const childCfg = TABLES[rel.table]
        const [innerField, innerDir] = Object.entries(dir)[0]
        const innerCol = column(childCfg, innerField)
        const parentCol = column(cfg, rel.parentCol)
        const childCol = column(childCfg, rel.childCol)
        joins.push(
          `LEFT JOIN "${childCfg.table}" AS "__${key}" ON "${cfg.table}"."${parentCol}" = "__${key}"."${childCol}"`
        )
        cols.push(
          `"__${key}"."${innerCol}" ${String(innerDir).toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`
        )
      } else {
        const col = column(cfg, key)
        cols.push(`"${col}" ${String(dir).toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`)
      }
    }
  }

  return { sql: cols.join(', '), joins }
}
