/**
 * Skill 系统 — Phase 2（T19）
 *
 * Skill 包 = { name, description, content, version }，落库 skills 表。
 * 两种接入方式：
 *   1. read_skill 工具：Agent 按需读取某个 Skill 的完整内容（避免全量塞入上下文）
 *   2. skill 摘要注入：把启用 Skill 的 name+description 摘要注入 system prompt，
 *      让 Agent 知道"什么情况下该调用 read_skill"
 */

import { prisma } from '../../prisma.js'
import type { AgentTool, ToolResult } from '../agent/types.js'

export interface SkillRecord {
  id: string
  userId?: number
  name: string
  description: string
  content: string
  version: string
  enabled: boolean
}

/** 读取某用户可见的全部启用 Skill（全局 + 本人） */
export async function loadSkills(userId: number): Promise<SkillRecord[]> {
  const rows = await prisma.skill.findMany({
    where: { enabled: true, OR: [{ userId: null }, { userId }] }
  })
  return rows.map(toSkillRecord)
}

/** 按名称读取单个 Skill（Agent 运行时用；不存在返回 undefined） */
export async function findSkill(userId: number, name: string): Promise<SkillRecord | undefined> {
  const row = await prisma.skill.findFirst({
    where: { enabled: true, name, OR: [{ userId: null }, { userId }] }
  })
  return row ? toSkillRecord(row) : undefined
}

/** read_skill 工具：按名称返回 Skill 内容（名称不存在 → 提示可用列表） */
export function buildReadSkillTool(
  userId: number,
  skills: () => Promise<SkillRecord[]>
): AgentTool {
  return {
    name: 'read_skill',
    description:
      '读取一个 Skill 的完整内容。Agent 需要执行不熟悉的流程/格式时，先调用本工具获取技能说明。参数 name 为 Skill 名称。',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Skill 名称' }
      },
      required: ['name']
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const name = String(args.name ?? '').trim()
      if (!name) return { ok: false, output: 'read_skill requires a name argument' }
      const record = await findSkill(userId, name)
      if (!record) {
        const list = (await skills()).map(s => s.name).join(', ')
        return {
          ok: false,
          output: `Skill "${name}" not found. Available skills: ${list || '(none)'}`
        }
      }
      return {
        ok: true,
        output: `Skill: ${record.name} (v${record.version})\nDescription: ${record.description}\n\n${record.content}`
      }
    }
  }
}

function toSkillRecord(row: Record<string, any>): SkillRecord {
  return {
    id: row.id,
    userId: row.userId ?? undefined,
    name: row.name,
    description: row.description ?? '',
    content: row.content ?? '',
    version: row.version ?? '1.0.0',
    enabled: Boolean(row.enabled)
  }
}
