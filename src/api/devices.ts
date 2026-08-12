// 设备 API 客户端 — Phase 3 T22（对齐 server/src/routes/v2/device.routes.ts）

import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// ---- 类型 ----

export interface DeviceRecord {
  id: string
  deviceId: string
  userId: number
  model: string
  platform: string
  appVersion: string
  capabilities: Record<string, boolean>
  status: 'online' | 'offline'
  lastSeenAt: string
  createdAt: string
  updatedAt: string
}

export interface DevicesListData {
  online: DeviceRecord[]
  offline: DeviceRecord[]
}

// ---- API ----

export const devicesAPI = {
  /** GET /v2/devices — 设备列表（在线 + 历史） */
  list(): Promise<ApiResponse<DevicesListData>> {
    return request.get('/v2/devices')
  }
}
