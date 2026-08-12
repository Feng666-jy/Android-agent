/**
 * Device Bridge JS 桥 — 前端调用原生 DeviceBridgePlugin（T22 前端入口）
 * 仅在 Capacitor 原生环境可用；浏览器 dev 中调用会 reject（not implemented）。
 */
import { registerPlugin } from '@capacitor/core'

export interface DeviceBridgePlugin {
  /** 建立 WSS 长连接（serverUrl 为服务器根地址，如 ws://192.168.1.100:3000） */
  connect(options: {
    serverUrl: string
    token: string
  }): Promise<{ connected: boolean; deviceId: string }>
  disconnect(): Promise<{ disconnected: boolean }>
  getDeviceId(): Promise<{ deviceId: string }>
}

export const DeviceBridge = registerPlugin<DeviceBridgePlugin>('DeviceBridge')

export function isCapacitorNative(): boolean {
  return typeof window !== 'undefined' && !!(window as any)?.Capacitor?.isNativePlatform?.()
}
