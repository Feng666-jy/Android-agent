/**
 * Memory 领域类型 — Phase 4（T30）
 *
 * 记忆类型：
 *  - episodic   ：任务经历（"完成过什么、结果如何"），由 Agent Loop 结束时自动写入
 *  - semantic   ：事实（"用户的服务器 IP 是 …"），可由用户/Agent 主动保存
 *  - preference ：用户偏好（"回复尽量简洁"、"默认使用中文"）
 */

/** 记忆类型 */
export type MemoryKind = 'episodic' | 'semantic' | 'preference'

/** 记忆来源 */
export type MemorySource = 'user' | 'agent' | 'system'

/** 记忆写入入参 */
export interface MemoryInput {
  /** 更新已存在记忆时传入 */
  id?: string
  kind?: MemoryKind
  content: string
  summary?: string
  importance?: number
  conversationId?: string
  agentId?: string
  runId?: string
  expiresAt?: string
  source?: MemorySource
  metadata?: Record<string, unknown>
}

/** 记忆实体（DB 行 → REST/检索结果） */
export interface MemoryRecord {
  id: string
  userId: number
  conversationId?: string
  agentId?: string
  runId?: string
  kind: MemoryKind
  content: string
  summary?: string
  importance: number
  accessCount: number
  lastAccessAt?: string
  expiresAt?: string
  source: MemorySource
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/** 检索结果（含相关性得分） */
export interface MemoryHit extends MemoryRecord {
  score: number
}

/** 检索参数 */
export interface MemoryQuery {
  kinds?: MemoryKind[]
  limit?: number
  /** 会话级过滤（默认用户级） */
  conversationId?: string
}
