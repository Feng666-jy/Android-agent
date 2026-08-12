/**
 * MCP SSE 传输层 — 解析服务端事件流 + JSON-RPC 请求/响应
 *
 * SSE 传输流程：
 *   1. GET <baseUrl>/sse（可带 ?sessionId=）建立事件流
 *   2. 服务端发送 `event: endpoint` → data 为消息端点路径（如 /messages?sessionId=xxx）
 *   3. 客户端 POST JSON-RPC 请求到 endpoint，响应从 SSE 流返回（event: message）
 */

import type { SseEvent } from './types.js'

export class McpTransportError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'McpTransportError'
    this.cause = cause
  }
}

/**
 * 逐行解析 SSE 文本流（通用：不依赖浏览器 EventSource）。
 * 返回事件帧 { event, data, id }；`: ping` 注释帧被忽略。
 */
export function parseSseEvents(text: string): SseEvent[] {
  const events: SseEvent[] = []
  let current: Partial<SseEvent> = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd()
    if (line === '') {
      if (current.event || current.data !== undefined) {
        events.push({
          event: current.event ?? 'message',
          data: current.data ?? '',
          id: current.id
        })
        current = {}
      }
      continue
    }
    if (line.startsWith(':')) continue // 注释/心跳
    const colon = line.indexOf(':')
    const field = colon === -1 ? line : line.slice(0, colon)
    const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '')
    if (field === 'event') current.event = value
    else if (field === 'data') current.data = (current.data ?? '') + value
    else if (field === 'id') current.id = value
  }
  if (current.event || current.data !== undefined) {
    events.push({
      event: current.event ?? 'message',
      data: current.data ?? '',
      id: current.id
    })
  }
  return events
}

/** 从字节流中增量解析 SSE 事件（供 ReadableStream 消费） */
export class SseStreamParser {
  private buffer = ''

  /** 喂入一段文本，返回新解析出的事件 */
  push(chunk: string): SseEvent[] {
    this.buffer += chunk.replace(/\r\n/g, '\n')
    const events: SseEvent[] = []
    let boundary: number
    // 以空行为事件边界
    while ((boundary = this.buffer.indexOf('\n\n')) !== -1) {
      const frameText = this.buffer.slice(0, boundary)
      this.buffer = this.buffer.slice(boundary + 2)
      const parsed = parseSseEvents(frameText)
      if (parsed.length) events.push(...parsed)
    }
    return events
  }

  /** 缓冲尾部（流结束时可调，处理无结尾空行的帧） */
  flush(): SseEvent[] {
    if (!this.buffer.trim()) return []
    const events = parseSseEvents(this.buffer)
    this.buffer = ''
    return events
  }
}

/** JSON-RPC 响应帧（MCP 将响应放在 SSE 的 message 事件里） */
export function isJsonRpcResponse(
  value: unknown
): value is { id: number | null; result?: unknown; error?: unknown } {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return v.jsonrpc === '2.0' && ('result' in v || 'error' in v)
}

/**
 * 从 Node ReadableStream 读取全部文本（fetch body）。
 * 用于无 endpoint 前先读 SSE 流；实际 MCP 客户端需长连接，见 client.ts。
 */
export async function readStreamText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let text = ''
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) text += decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
  return text + decoder.decode()
}

/** 校验 MCP 服务器 URL（仅允许 http/https） */
export function assertHttpUrl(url: string): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new McpTransportError(`Invalid URL: ${url}`)
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new McpTransportError(`Unsupported protocol: ${parsed.protocol}`)
  }
  return parsed.toString()
}
