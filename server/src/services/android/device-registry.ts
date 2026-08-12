/**
 * 设备注册表 — Phase 3（T22）
 *
 * 进程内维护 userId:deviceId → 在线连接（WebSocket）。
 * 持久化侧（devices 表）由 bridge 在 hello/heartbeat 时同步。
 * 同一设备重复连接：新连接顶掉旧连接（断线重连场景）。
 */

import type { DeviceCapability, DeviceInfo, DeviceRecord } from './types.js'

export interface DeviceConnection {
  /** 连接唯一 key：userId:deviceId */
  key: string
  userId: number
  deviceId: string
  info: DeviceInfo
  /** WebSocket 发送函数（由 bridge 注入，避免直接依赖 ws 类型） */
  send: (text: string) => void
  /** 主动断开函数 */
  close: (code?: number, reason?: string) => void
  connectedAt: string
  lastSeenAt: string
  /** 处理中的命令等待器（id → resolve） */
  pending: Map<string, (result: any) => void>
}

export class DeviceRegistry {
  private readonly connections = new Map<string, DeviceConnection>()

  key(userId: number, deviceId: string): string {
    return `${userId}:${deviceId}`
  }

  /** 注册/替换连接（重复连接顶掉旧的） */
  register(
    userId: number,
    info: DeviceInfo,
    transport: { send: (t: string) => void; close: (c?: number, r?: string) => void }
  ): DeviceConnection {
    const key = this.key(userId, info.deviceId)
    const existing = this.connections.get(key)
    if (existing) {
      existing.close(4000, 'replaced by new connection')
      this.connections.delete(key)
    }
    const conn: DeviceConnection = {
      key,
      userId,
      deviceId: info.deviceId,
      info,
      send: transport.send,
      close: transport.close,
      connectedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      pending: new Map()
    }
    this.connections.set(key, conn)
    return conn
  }

  unregister(userId: number, deviceId: string): DeviceConnection | undefined {
    const key = this.key(userId, deviceId)
    const conn = this.connections.get(key)
    if (conn) this.connections.delete(key)
    return conn
  }

  /** 心跳更新 lastSeenAt */
  touch(userId: number, deviceId: string): void {
    const conn = this.get(userId, deviceId)
    if (conn) conn.lastSeenAt = new Date().toISOString()
  }

  get(userId: number, deviceId: string): DeviceConnection | undefined {
    return this.connections.get(this.key(userId, deviceId))
  }

  /** 用户的全部在线设备 */
  listOnline(userId: number): DeviceConnection[] {
    return [...this.connections.values()].filter(c => c.userId === userId)
  }

  /** 用户第一个在线设备（工具默认目标；多设备时优先 a11y 能力全的设备） */
  firstOnline(userId: number): DeviceConnection | undefined {
    const list = this.listOnline(userId)
    if (list.length === 0) return undefined
    const rank = (c: DeviceConnection): number => {
      let score = 0
      if (c.info.capabilities.includes('a11y')) score += 2
      if (c.info.capabilities.includes('vision')) score += 1
      return score
    }
    return [...list].sort((a, b) => rank(b) - rank(a))[0]
  }

  size(): number {
    return this.connections.size
  }

  /** 全部在线设备（管理/诊断用） */
  all(): DeviceConnection[] {
    return [...this.connections.values()]
  }
}

export const deviceRegistry = new DeviceRegistry()

/** 在线连接 → REST 设备记录（不含连接细节） */
export function connectionToRecord(conn: DeviceConnection): DeviceRecord {
  return {
    id: `${conn.userId}:${conn.deviceId}`,
    userId: conn.userId,
    deviceId: conn.deviceId,
    name: conn.info.name ?? conn.info.model ?? conn.info.deviceId,
    platform: conn.info.platform,
    model: conn.info.model,
    osVersion: conn.info.osVersion,
    appVersion: conn.info.appVersion,
    capabilities: conn.info.capabilities,
    status: 'online',
    lastSeenAt: conn.lastSeenAt
  }
}

/** DB 行 → REST 设备记录 */
export function rowToRecord(row: Record<string, any>): DeviceRecord {
  let capabilities: DeviceCapability[] = []
  try {
    const raw = row.capabilitiesJson
      ? (JSON.parse(row.capabilitiesJson) as Record<string, boolean>)
      : {}
    capabilities = (Object.keys(raw) as DeviceCapability[]).filter(k => raw[k])
  } catch {
    capabilities = ['native']
  }
  return {
    id: row.id,
    userId: row.userId,
    deviceId: row.deviceId,
    name: row.name || row.model || row.deviceId,
    platform: row.platform ?? 'android',
    model: row.model ?? undefined,
    osVersion: row.osVersion ?? undefined,
    appVersion: row.appVersion ?? undefined,
    capabilities,
    status: row.status === 'online' ? 'online' : 'offline',
    lastSeenAt: row.lastSeenAt ?? undefined
  }
}
