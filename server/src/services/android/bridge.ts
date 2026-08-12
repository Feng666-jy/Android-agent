/**
 * Device Bridge — Phase 3（T22 WSS 双向通道）
 *
 * 设备端：Capacitor App 用 WSS 连接 /ws/device?token=<jwt>&deviceId=<hash>
 * 服务器：hello 注册 → 每 30s heartbeat → 命令下发（request/response 配对，超时 15s）
 *
 * 集成方式：attach(httpServer, "/ws/device") 挂到 upgrade 事件。
 * 鉴权：JWT（与 REST 同源）；设备 hello 时校验 deviceId 与 token 用户绑定。
 */

import { WebSocketServer, WebSocket } from 'ws'
import type { Server } from 'node:http'
import { randomUUID } from 'node:crypto'
import { verifyToken } from '../../middleware/auth.js'
import { logger } from '../../utils/logger.js'
import { prisma } from '../../prisma.js'
import { deviceRegistry, connectionToRecord } from './device-registry.js'
import type { DeviceCommand, DeviceCommandResult, DeviceEnvelope, DeviceInfo } from './types.js'

export const HEARTBEAT_INTERVAL_MS = 30_000
export const COMMAND_TIMEOUT_MS = 15_000
export const STALE_AFTER_MS = 90_000

export class DeviceBridge {
  private wss: WebSocketServer | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private staleTimer: NodeJS.Timeout | null = null

  /** 挂载到 HTTP server（Express 的 http.Server） */
  attach(server: Server, path = '/ws/device'): void {
    if (this.wss) throw new Error('DeviceBridge already attached')
    this.wss = new WebSocketServer({ noServer: true })

    server.on('upgrade', (req, socket, head) => {
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
      if (url.pathname !== path) return // 其他 upgrade 交给其他处理器（若有）
      this.wss?.handleUpgrade(req, socket, head, ws => this.handleSocket(ws, url))
    })

    this.heartbeatTimer = setInterval(() => this.broadcastHeartbeat(), HEARTBEAT_INTERVAL_MS)
    this.staleTimer = setInterval(() => this.pruneStale(), 15_000)
    this.heartbeatTimer.unref?.()
    this.staleTimer.unref?.()
    logger.info(`[device-bridge] attached at ${path}`)
  }

  /** 关闭全部连接与定时器 */
  close(): void {
    this.heartbeatTimer && clearInterval(this.heartbeatTimer)
    this.staleTimer && clearInterval(this.staleTimer)
    for (const conn of deviceRegistry.all()) {
      conn.close(4001, 'server shutting down')
    }
    this.wss?.close()
    this.wss = null
  }

  /**
   * 向指定设备下发命令并等待结果（request/response 配对）。
   * 设备离线 / 命令超时 → 返回 { ok:false, error }。
   */
  sendCommand(
    userId: number,
    deviceId: string,
    command: Omit<DeviceCommand, 'id'>,
    timeoutMs = COMMAND_TIMEOUT_MS
  ): Promise<DeviceCommandResult> {
    const conn = deviceRegistry.get(userId, deviceId)
    if (!conn) {
      return Promise.resolve({ id: '', ok: false, error: 'Device offline' })
    }
    const id = randomUUID()
    const full: DeviceCommand = { ...command, id }

    return new Promise(resolve => {
      const timer = setTimeout(() => {
        conn.pending.delete(id)
        resolve({ id, ok: false, error: `Command timed out after ${timeoutMs}ms` })
      }, timeoutMs)
      conn.pending.set(id, (result: DeviceCommandResult) => {
        clearTimeout(timer)
        resolve(result)
      })
      try {
        conn.send(JSON.stringify({ type: 'command', ...full }))
      } catch (err) {
        clearTimeout(timer)
        conn.pending.delete(id)
        resolve({ id, ok: false, error: `Send failed: ${(err as Error)?.message ?? String(err)}` })
      }
    })
  }

  /** 向用户第一个在线设备下发命令（工具层便捷入口） */
  sendCommandToFirst(
    userId: number,
    command: Omit<DeviceCommand, 'id'>
  ): Promise<DeviceCommandResult> {
    const conn = deviceRegistry.firstOnline(userId)
    if (!conn) return Promise.resolve({ id: '', ok: false, error: 'No online device' })
    return this.sendCommand(userId, conn.deviceId, command)
  }

  // -------------------------------------------------------------------------
  // 内部
  // -------------------------------------------------------------------------

  private handleSocket(ws: WebSocket, url: URL): void {
    const token = url.searchParams.get('token') ?? ''
    const deviceId = url.searchParams.get('deviceId') ?? ''
    let userId: number | null = null
    try {
      const payload = verifyToken(token)
      userId = (payload as { userId: number }).userId ?? null
    } catch {
      userId = null
    }
    if (userId === null || !deviceId) {
      ws.close(4401, 'unauthorized')
      return
    }

    // 先注册占位，等 hello 补全 info（10s 内）
    const conn = deviceRegistry.register(
      userId,
      {
        deviceId,
        platform: 'android',
        capabilities: ['native']
      },
      {
        send: t => {
          if (ws.readyState === WebSocket.OPEN) ws.send(t)
        },
        close: (code, reason) => ws.close(code, reason)
      }
    )

    const helloTimer = setTimeout(() => {
      if (conn.info.model === undefined) ws.close(4404, 'hello timeout')
    }, 10_000)
    helloTimer.unref?.()

    ws.on('message', raw => {
      let envelope: DeviceEnvelope
      try {
        envelope = JSON.parse(String(raw)) as DeviceEnvelope
      } catch {
        return
      }
      if (envelope.deviceId !== deviceId) return
      switch (envelope.type) {
        case 'hello': {
          clearTimeout(helloTimer)
          const info = (envelope.payload ?? {}) as Partial<DeviceInfo>
          const updated: DeviceInfo = {
            deviceId,
            platform: 'android',
            name: info.name,
            model: info.model,
            osVersion: info.osVersion,
            appVersion: info.appVersion,
            capabilities:
              Array.isArray(info.capabilities) && info.capabilities.length
                ? info.capabilities
                : ['native']
          }
          // 更新连接信息
          conn.info = updated
          conn.lastSeenAt = new Date().toISOString()
          void this.persistDevice(userId, updated)
          ws.send(JSON.stringify({ type: 'hello_ack', ts: new Date().toISOString() }))
          break
        }
        case 'heartbeat':
          conn.lastSeenAt = new Date().toISOString()
          break
        case 'command_result': {
          const result = envelope.payload as DeviceCommandResult
          const waiter = conn.pending.get(result.id)
          if (waiter) {
            conn.pending.delete(result.id)
            waiter(result)
          }
          break
        }
        case 'log':
          logger.info(`[device ${deviceId}] ${String(envelope.payload ?? '')}`)
          break
        default:
          break
      }
    })

    ws.on('close', () => {
      const current = deviceRegistry.get(userId, deviceId)
      if (current === conn) {
        deviceRegistry.unregister(userId, deviceId)
      }
      void prisma.device
        .updateMany({
          where: { userId, deviceId },
          data: { status: 'offline', updatedAt: new Date() }
        })
        .catch(() => undefined)
    })

    ws.on('error', err => {
      logger.warn(`[device-bridge] socket error: ${(err as Error)?.message ?? String(err)}`)
    })
  }

  private broadcastHeartbeat(): void {
    const now = new Date().toISOString()
    for (const conn of deviceRegistry.all()) {
      if (conn.lastSeenAt < new Date(Date.now() - STALE_AFTER_MS).toISOString()) continue
      conn.send(JSON.stringify({ type: 'ping', ts: now }))
    }
  }

  /** 清理超时未心跳的僵尸连接 */
  private pruneStale(): void {
    const cutoff = new Date(Date.now() - STALE_AFTER_MS).toISOString()
    for (const conn of deviceRegistry.all()) {
      if (conn.lastSeenAt < cutoff) {
        logger.info(`[device-bridge] prune stale device ${conn.deviceId}`)
        conn.close(4002, 'stale')
      }
    }
  }

  private async persistDevice(userId: number, info: DeviceInfo): Promise<void> {
    const capabilitiesJson = JSON.stringify(
      Object.fromEntries(
        (['native', 'a11y', 'vision'] as const).map(c => [c, info.capabilities.includes(c)])
      )
    )
    const data = {
      userId,
      deviceId: info.deviceId,
      name: info.name ?? '',
      platform: info.platform ?? 'android',
      model: info.model ?? null,
      osVersion: info.osVersion ?? null,
      appVersion: info.appVersion ?? null,
      capabilitiesJson,
      status: 'online',
      lastSeenAt: new Date(),
      updatedAt: new Date()
    }
    try {
      const existing = await prisma.device.findFirst({ where: { userId, deviceId: info.deviceId } })
      if (existing) {
        await prisma.device.update({ where: { id: existing.id }, data })
      } else {
        await prisma.device.create({ data: { ...data, createdAt: new Date() } })
      }
    } catch (err: unknown) {
      logger.warn(
        '[device-bridge] persist device failed: ' + ((err as Error)?.message ?? String(err))
      )
    }
  }
}

export const deviceBridge = new DeviceBridge()
export { connectionToRecord }
