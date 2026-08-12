/**
 * 设备工具集 — Phase 3（T23 Native / T25 A11y / T26 Vision）
 *
 * 每个工具 = AgentTool（LLM 可见定义）+ 执行时通过 DeviceBridge 下发到设备。
 * 工具名与 Android 插件（android/app/.../plugins）的命令处理一一对应。
 */

import type { AgentTool, ToolResult } from '../agent/types.js'
import { deviceBridge } from './bridge.js'
import type { ChannelKind, DeviceCommandResult } from './types.js'

/** 结果收敛：设备结果 → ToolResult 文本 */
export function toToolResult(result: DeviceCommandResult): ToolResult {
  if (!result.ok) {
    return { ok: false, output: result.error ?? 'Device command failed' }
  }
  const output = typeof result.output === 'string' ? result.output : JSON.stringify(result.output)
  return { ok: true, output }
}

/** 工具工厂：绑定 userId，命令发往该用户第一个在线设备 */
export function buildDeviceTools(userId: number): AgentTool[] {
  const send = (
    kind: 'native' | 'a11y' | 'vision',
    tool: string,
    args: Record<string, unknown>,
    channel?: ChannelKind
  ) => deviceBridge.sendCommandToFirst(userId, { kind, tool, args, channel }).then(toToolResult)

  const withDeviceId =
    (tool: string, deviceId: string) =>
    (args: Record<string, unknown>): Promise<ToolResult> =>
      deviceBridge.sendCommand(userId, deviceId, { kind: 'native', tool, args }).then(toToolResult)

  void withDeviceId

  // -------------------------------------------------------------------------
  // Native（T23：battery / launch_app / send_notification / list_files）
  // -------------------------------------------------------------------------
  const native: AgentTool[] = [
    {
      name: 'battery_status',
      description: '读取设备电池状态（电量百分比、充电状态）。',
      parameters: { type: 'object', properties: {} },
      execute: args => send('native', 'battery', args)
    },
    {
      name: 'launch_app',
      description: '启动设备上的应用。参数 package 为应用包名（如 com.android.settings）。',
      parameters: {
        type: 'object',
        properties: {
          package: { type: 'string', description: 'Android 应用包名' }
        },
        required: ['package']
      },
      execute: args => send('native', 'launch_app', args)
    },
    {
      name: 'send_notification',
      description: '在设备上发送一条本地通知。参数 title/body 为通知标题与内容。',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          body: { type: 'string' }
        },
        required: ['title', 'body']
      },
      execute: args => send('native', 'send_notification', args)
    },
    {
      name: 'list_device_files',
      description:
        '列出设备公共存储目录内容（Android/data 或 Download 下）。参数 path 为相对目录。',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '相对目录，如 Download' }
        }
      },
      execute: args => send('native', 'list_files', args)
    }
  ]

  // -------------------------------------------------------------------------
  // A11y（T25：get_ui_tree / ui_find / ui_click / ui_input / ui_swipe / ui_back）
  // -------------------------------------------------------------------------
  const a11y: AgentTool[] = [
    {
      name: 'get_ui_tree',
      description:
        '获取当前屏幕的可访问性 UI 树（JSON：节点层级、文本、类名、bounds）。需要无障碍服务权限。',
      parameters: { type: 'object', properties: {} },
      execute: args => send('a11y', 'get_ui_tree', args, 'A11Y')
    },
    {
      name: 'ui_find',
      description:
        '在 UI 树中查找节点。参数 text 为要匹配的文本（支持 contains/regex）。返回匹配节点与坐标。',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: '要查找的文本（子串匹配）' },
          regex: { type: 'string', description: '正则模式（与 text 二选一）' },
          index: { type: 'integer', description: '第几个匹配（默认 0）' }
        }
      },
      execute: args => send('a11y', 'ui_find', args, 'A11Y')
    },
    {
      name: 'ui_click',
      description: '点击屏幕。参数 text（按文本找节点点击）与 x/y（直接坐标）二选一。',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          x: { type: 'integer' },
          y: { type: 'integer' }
        }
      },
      execute: args => send('a11y', 'ui_click', args, 'A11Y')
    },
    {
      name: 'ui_input',
      description: '向焦点输入框输入文本。参数 text 为输入内容。',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: '要输入的文本' }
        },
        required: ['text']
      },
      execute: args => send('a11y', 'ui_input', args, 'A11Y')
    },
    {
      name: 'ui_swipe',
      description: '滑动屏幕。参数 direction（up/down/left/right）或 x1/y1/x2/y2 起止坐标。',
      parameters: {
        type: 'object',
        properties: {
          direction: { type: 'string', enum: ['up', 'down', 'left', 'right'] },
          x1: { type: 'integer' },
          y1: { type: 'integer' },
          x2: { type: 'integer' },
          y2: { type: 'integer' },
          duration: { type: 'integer', description: '滑动时长 ms（默认 300）' }
        }
      },
      execute: args => send('a11y', 'ui_swipe', args, 'A11Y')
    },
    {
      name: 'ui_back',
      description: '模拟返回键。',
      parameters: { type: 'object', properties: {} },
      execute: args => send('a11y', 'ui_back', args, 'A11Y')
    }
  ]

  // -------------------------------------------------------------------------
  // Vision（T26：take_screenshot / vision_do）
  // -------------------------------------------------------------------------
  const vision: AgentTool[] = [
    {
      name: 'take_screenshot',
      description:
        '截取设备当前屏幕（MediaProjection）。返回截图保存路径与尺寸；配合 ui_click 坐标操作使用。',
      parameters: { type: 'object', properties: {} },
      execute: args => send('vision', 'take_screenshot', args, 'A11Y')
    },
    {
      name: 'vision_do',
      description:
        '按坐标执行屏幕操作（Vision 通道）。参数 x/y 坐标、action（tap/swipe/back/text）。',
      parameters: {
        type: 'object',
        properties: {
          x: { type: 'integer' },
          y: { type: 'integer' },
          action: { type: 'string', enum: ['tap', 'swipe', 'back', 'text'] },
          text: { type: 'string', description: 'action=text 时的输入内容' }
        }
      },
      execute: args => send('vision', 'vision_do', args, 'A11Y')
    }
  ]

  return [...native, ...a11y, ...vision]
}
