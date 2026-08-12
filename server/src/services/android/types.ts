/**
 * Android Runtime 领域类型 — Phase 3（T22 设备协议 / T23-T27 工具协议 / T28 通道）
 *
 * 双向通道：设备（Capacitor App）WSS 连接服务器 → hello 注册 → 服务器下发命令 →
 * 设备执行并回 command_result。命令协议与 Android 插件（android/app/.../plugins）一一对应。
 */

/** 设备能力位（与 Android 插件注册的能力一致） */
export type DeviceCapability = 'native' | 'a11y' | 'vision'

/** 设备状态 */
export type DeviceStatus = 'online' | 'offline'

/** 执行通道（T28 权限通道枚举）：决定命令走哪条系统权限路径 */
export type ChannelKind = 'STANDARD' | 'A11Y' | 'DEBUGGER'

/** 设备 hello 上报信息（设备侧生成 deviceId，Android ID 哈希） */
export interface DeviceInfo {
  deviceId: string
  name?: string
  platform: 'android'
  model?: string
  osVersion?: string
  appVersion?: string
  /** 已授予的能力（native 默认；a11y/vision 需用户授权） */
  capabilities: DeviceCapability[]
}

/** DB 设备行（REST 层返回） */
export interface DeviceRecord {
  id: string
  userId: number
  deviceId: string
  name: string
  platform: string
  model?: string
  osVersion?: string
  appVersion?: string
  capabilities: DeviceCapability[]
  status: DeviceStatus
  lastSeenAt?: string
}

/** 设备命令（服务器 → 设备） */
export interface DeviceCommand {
  /** 命令唯一 id（发送方生成） */
  id: string
  kind: 'native' | 'a11y' | 'vision'
  /** 工具名：battery | launch_app | send_notification | list_files | get_ui_tree | ui_find | ui_click | ui_input | ui_swipe | ui_back | take_screenshot | vision_do */
  tool: string
  args?: Record<string, unknown>
  channel?: ChannelKind
}

/** 设备命令结果（设备 → 服务器） */
export interface DeviceCommandResult {
  id: string
  ok: boolean
  /** 结果数据（JSON 或文本；失败时可能为空） */
  output?: unknown
  error?: string
  durationMs?: number
}

/** 设备 → 服务器信封 */
export interface DeviceEnvelope {
  type: 'hello' | 'heartbeat' | 'command_result' | 'log' | 'capability_changed'
  deviceId: string
  ts: string
  payload?: unknown
}

/** 命令工具名常量 */
export const NATIVE_TOOLS = ['battery', 'launch_app', 'send_notification', 'list_files'] as const
export const A11Y_TOOLS = [
  'get_ui_tree',
  'ui_find',
  'ui_click',
  'ui_input',
  'ui_swipe',
  'ui_back'
] as const
export const VISION_TOOLS = ['take_screenshot', 'vision_do'] as const

export type NativeToolName = (typeof NATIVE_TOOLS)[number]
export type A11yToolName = (typeof A11Y_TOOLS)[number]
export type VisionToolName = (typeof VISION_TOOLS)[number]
