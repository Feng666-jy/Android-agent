/**
 * 执行器工厂 — Phase 3（T28 权限通道枚举）
 *
 * 能力阶梯：STANDARD（普通权限）→ A11Y（无障碍）→ DEBUGGER（未来 adb/root）。
 * 每个设备命令根据工具类别选择通道；设备能力不足时给出明确错误与引导。
 */

import type { AgentTool, ToolResult } from '../agent/types.js'
import type { ChannelKind, DeviceCapability } from './types.js'
import { NATIVE_TOOLS, A11Y_TOOLS } from './types.js'

/** 通道 → 所需设备能力 */
export const CHANNEL_CAPABILITY: Record<ChannelKind, DeviceCapability> = {
  STANDARD: 'native',
  A11Y: 'a11y',
  DEBUGGER: 'a11y' // 预留：DEBUGGER 通道暂复用 a11y 能力位（未来 adb 接入）
}

/** 工具类别 → 默认通道 */
export function channelForKind(kind: 'native' | 'a11y' | 'vision'): ChannelKind {
  switch (kind) {
    case 'a11y':
      return 'A11Y'
    case 'vision':
      return 'A11Y'
    default:
      return 'STANDARD'
  }
}

/** LLM 工具名 → 设备命令名（AgentTool.name 与设备侧 tool 名存在别名差异） */
const TOOL_NAME_TO_DEVICE: Record<string, string> = {
  battery_status: 'battery',
  list_device_files: 'list_files'
}

/** AgentTool 名 → 工具类别（与 NATIVE_TOOLS/A11Y_TOOLS/VISION_TOOLS 对齐） */
export function kindForDeviceTool(tool: string): 'native' | 'a11y' | 'vision' {
  const deviceTool = TOOL_NAME_TO_DEVICE[tool] ?? tool
  if ((NATIVE_TOOLS as readonly string[]).includes(deviceTool)) return 'native'
  if ((A11Y_TOOLS as readonly string[]).includes(deviceTool)) return 'a11y'
  return 'vision'
}

export interface ExecutorContext {
  userId: number
  capabilities: DeviceCapability[]
}

/**
 * 执行器：校验设备能力 → 选通道 → 执行。
 * 能力不足返回 ok:false + 引导提示（前端/Agent 可据此提示用户授权）。
 */
export function withCapabilityCheck(
  execute: (args: Record<string, unknown>, channel: ChannelKind) => Promise<ToolResult>,
  kind: 'native' | 'a11y' | 'vision',
  getCapabilities: () => DeviceCapability[]
): (args: Record<string, unknown>) => Promise<ToolResult> {
  return async args => {
    const channel = channelForKind(kind)
    const required = CHANNEL_CAPABILITY[channel]
    const caps = getCapabilities()
    if (caps.length === 0) {
      return {
        ok: false,
        output: '设备未在线：请在 Android App 中开启设备连接（首页 → 设备 → 连接）。'
      }
    }
    if (!caps.includes(required)) {
      return {
        ok: false,
        output:
          `设备缺少 ${required} 能力（当前：${caps.join(', ') || '无'}）。` +
          (required === 'a11y'
            ? '请在系统设置 → 无障碍中开启「Android Agent 无障碍」。'
            : '请先在设备上完成基础授权。')
      }
    }
    return execute(args, channel)
  }
}

/** 包装一组工具：统一注入能力检查（与 deviceRegistry 当前设备能力联动） */
export function wrapWithCapabilityCheck(
  tools: AgentTool[],
  kind: 'native' | 'a11y' | 'vision',
  getCapabilities: () => DeviceCapability[]
): AgentTool[] {
  return tools.map(tool => ({
    ...tool,
    execute: (args, ctx) =>
      withCapabilityCheck(async a => tool.execute(a, ctx), kind, getCapabilities)(args)
  }))
}
