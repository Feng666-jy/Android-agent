/**
 * Skill 注入器 — 把启用 Skill 的摘要写进 system prompt
 * 注入格式克制：只带名称与一句话描述，避免挤占上下文；完整内容由 read_skill 按需读取。
 */

import type { SkillRecord } from './loader.js'

export function buildSkillPrompt(skills: SkillRecord[]): string {
  if (!skills.length) return ''
  const lines = skills.map(
    skill =>
      `- ${skill.name}${skill.version ? ` (v${skill.version})` : ''}: ${skill.description || '无描述'}`
  )
  return [
    '## Available Skills',
    '以下技能可通过 read_skill 工具读取完整说明后再执行：',
    ...lines
  ].join('\n')
}
