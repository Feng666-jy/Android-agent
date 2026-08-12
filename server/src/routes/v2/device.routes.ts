/**
 * 设备路由 — /api/v2/devices/*（Phase 3 T22）
 * 在线设备走 registry；历史设备（离线）走 devices 表。
 */

import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { deviceBridge } from '../../services/android/bridge.js'
import {
  deviceRegistry,
  connectionToRecord,
  rowToRecord
} from '../../services/android/device-registry.js'
import { prisma } from '../../prisma.js'
import { success, fail, notFound, unauthorized } from '../../utils/response.js'
import {
  NATIVE_TOOLS,
  A11Y_TOOLS,
  VISION_TOOLS,
  type ChannelKind,
  type DeviceCommand
} from '../../services/android/types.js'

const router = Router()

const ALL_TOOLS = new Set<string>([...NATIVE_TOOLS, ...A11Y_TOOLS, ...VISION_TOOLS])

function requireUserId(req: any, res: any): number | null {
  const userId = req.user?.userId
  if (userId === undefined) {
    unauthorized(res)
    return null
  }
  return userId
}

router.use(authMiddleware)

/** GET /devices — 设备列表（在线 + 历史） */
router.get('/', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const online = deviceRegistry.listOnline(userId).map(connectionToRecord)
  const offlineRows = await prisma.device.findMany({
    where: { userId, status: 'offline' },
    orderBy: [{ updatedAt: 'desc' }]
  })
  const offline = offlineRows.map(rowToRecord)
  success(res, { online, offline })
})

/** GET /devices/:deviceId — 设备详情 */
router.get('/:deviceId', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const conn = deviceRegistry.get(userId, req.params.deviceId)
  if (conn) {
    success(res, { ...connectionToRecord(conn), source: 'live' })
    return
  }
  const row = await prisma.device.findFirst({ where: { userId, deviceId: req.params.deviceId } })
  if (!row) {
    notFound(res, 'Device not found')
    return
  }
  success(res, { ...rowToRecord(row), source: 'db' })
})

/** POST /devices/:deviceId/command — 下发设备命令（调试/测试用） */
router.post('/:deviceId/command', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const { tool, args, channel } = req.body ?? {}
  if (typeof tool !== 'string' || !ALL_TOOLS.has(tool)) {
    fail(res, `Unknown device tool: ${String(tool)}`, -1, 400)
    return
  }
  const kind = (NATIVE_TOOLS as readonly string[]).includes(tool)
    ? 'native'
    : (A11Y_TOOLS as readonly string[]).includes(tool)
      ? 'a11y'
      : 'vision'
  const result = await deviceBridge.sendCommand(userId, req.params.deviceId, {
    kind,
    tool: tool as DeviceCommand['tool'],
    args: args ?? {},
    channel: channel as ChannelKind | undefined
  })
  if (!result.ok && result.error === 'Device offline') {
    fail(res, 'Device offline', -1, 404)
    return
  }
  success(res, result)
})

/** DELETE /devices/:deviceId — 移除设备历史记录（断开在线连接） */
router.delete('/:deviceId', async (req: any, res: any) => {
  const userId = requireUserId(req, res)
  if (userId === null) return
  const conn = deviceRegistry.get(userId, req.params.deviceId)
  if (conn) conn.close(4003, 'removed by user')
  const result = await prisma.device.deleteMany({
    where: { userId, deviceId: req.params.deviceId }
  })
  success(res, { ok: true, removed: result.count })
})

export default router
