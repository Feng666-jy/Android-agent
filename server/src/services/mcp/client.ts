/**
 * MCP 客户端 — 单个 MCP Server 的 SSE 会话（T17 客户端 / T18 重连状态机）
 *
 * 会话生命周期：disconnected → connecting → connected ⇄ error（可重连）
 *   connect(): 建立 SSE 长连接 → 等待 endpoint 事件 → initialize → initialized → connected
 *   listTools()/callTool(): POST JSON-RPC 到 endpoint，响应从 SSE 流按 id 匹配返回
 *   reconnect(): 断线后重建（指数退避，由调用方/registry 触发）
 */

import { logger } from '../../utils/logger.js'
import { assertHttpUrl, McpTransportError, readStreamText, SseStreamParser } from './sse.js'
import type {
  JsonRpcRequest,
  JsonRpcResponse,
  McpEndpointInfo,
  McpInitializeResult,
  McpServerConfig,
  McpServerStatus,
  McpToolCallResult,
  McpToolDef
} from './types.js'

const DEFAULT_TIMEOUT_MS = 15_000
const MAX_RECONNECT_DELAY_MS = 30_000

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason: Error) => void
  timer: NodeJS.Timeout
}

export class McpClient {
  readonly config: McpServerConfig
  status: McpServerStatus = 'disconnected'
  error?: string
  endpoint: McpEndpointInfo | null = null
  serverInfo?: McpInitializeResult['serverInfo']
  protocolVersion?: string

  private readonly timeoutMs: number
  private controller: AbortController | null = null
  private pending = new Map<number, PendingRequest>()
  private nextId = 1
  private closed = false
  private reconnectAttempts = 0

  constructor(config: McpServerConfig, timeoutMs = DEFAULT_TIMEOUT_MS) {
    this.config = config
    this.timeoutMs = timeoutMs
  }

  get isConnected(): boolean {
    return this.status === 'connected'
  }

  /** 建立会话：SSE 连接 + initialize 握手（幂等：已连接直接返回） */
  async connect(): Promise<McpInitializeResult> {
    if (this.status === 'connected') {
      return {
        protocolVersion: this.protocolVersion ?? '2024-11-05',
        capabilities: {},
        serverInfo: this.serverInfo ?? { name: this.config.name, version: '0' }
      }
    }
    this.closed = false
    this.setStatus('connecting')
    try {
      const baseUrl = assertHttpUrl(this.config.url)
      this.controller = new AbortController()

      const response = await fetch(baseUrl, {
        headers: {
          Accept: 'text/event-stream',
          ...this.config.headers
        },
        signal: this.controller.signal
      })
      if (!response.ok || !response.body) {
        throw new McpTransportError(
          `SSE connect failed: HTTP ${response.status} ${response.statusText}`,
          response.status
        )
      }

      // 异步消费 SSE 流（收到 endpoint 后继续监听 message 帧）
      void this.consumeStream(response.body)

      // 等待 endpoint 事件（首个帧）
      const endpoint = await this.waitForEndpoint()
      this.endpoint = endpoint

      // initialize 握手
      const initResult = (await this.request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'android-agent', version: '2.0.0' }
      })) as McpInitializeResult
      this.protocolVersion = initResult.protocolVersion
      this.serverInfo = initResult.serverInfo

      // initialized 通知（无响应）
      this.notify('notifications/initialized', {})

      this.reconnectAttempts = 0
      this.setStatus('connected')
      return initResult
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      this.error = message
      this.setStatus('error')
      this.close()
      throw err instanceof McpTransportError
        ? err
        : new McpTransportError(`MCP connect failed: ${message}`, err)
    }
  }

  /** 拉取服务器工具列表（需已连接） */
  async listTools(): Promise<McpToolDef[]> {
    const result = (await this.request('tools/list', {})) as { tools?: McpToolDef[] }
    return result.tools ?? []
  }

  /** 调用服务器工具 */
  async callTool(name: string, args: Record<string, unknown>): Promise<McpToolCallResult> {
    const result = (await this.request('tools/call', {
      name,
      arguments: args ?? {}
    })) as McpToolCallResult
    return result
  }

  /** 指数退避重连（T18：registry 断线检测时调用） */
  async reconnect(): Promise<McpInitializeResult> {
    const delay = Math.min(1_000 * 2 ** this.reconnectAttempts, MAX_RECONNECT_DELAY_MS)
    this.reconnectAttempts += 1
    await new Promise(resolve => setTimeout(resolve, delay))
    if (this.closed) throw new McpTransportError('MCP client closed, cannot reconnect')
    logger.info(`[mcp] reconnect ${this.config.name} (attempt ${this.reconnectAttempts})`)
    return this.connect()
  }

  /** 主动关闭会话 */
  close(): void {
    this.closed = true
    this.controller?.abort()
    this.controller = null
    this.endpoint = null
    this.rejectAll(new McpTransportError('MCP session closed'))
    if (this.status !== 'error') this.setStatus('disconnected')
  }

  // -------------------------------------------------------------------------
  // 内部
  // -------------------------------------------------------------------------

  private setStatus(status: McpServerStatus): void {
    this.status = status
    if (status === 'error') this.error = this.error ?? 'unknown error'
  }

  /** 消费 SSE 流：解析帧，处理 endpoint / message / error 事件 */
  private async consumeStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const parser = new SseStreamParser()
    const reader = body.getReader()
    const decoder = new TextDecoder()
    try {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const evt of parser.push(chunk)) {
          this.handleEvent(evt)
        }
      }
      // 流结束（服务端断开）→ 标记 error（除非主动关闭）
      if (!this.closed) {
        this.error = 'SSE stream closed by server'
        this.setStatus('error')
        for (const { reject } of this.pending.values()) {
          reject(new McpTransportError('SSE stream closed'))
        }
        this.pending.clear()
      }
    } catch (err) {
      if (!this.closed) {
        this.error = err instanceof Error ? err.message : String(err)
        this.setStatus('error')
      }
    } finally {
      reader.releaseLock()
    }
  }

  private handleEvent(evt: { event: string; data: string }): void {
    if (evt.event === 'endpoint') {
      this.endpoint ??= { endpointUrl: evt.data }
      return
    }
    if (evt.event === 'message' || evt.event === 'response') {
      this.handleMessageFrame(evt.data)
      return
    }
    if (evt.event === 'error') {
      this.error = evt.data
      return
    }
    // 其他事件（log/notifications 等）忽略
  }

  private handleMessageFrame(data: string): void {
    let payload: unknown
    try {
      payload = JSON.parse(data)
    } catch {
      return
    }
    const response = payload as JsonRpcResponse
    if (typeof response.id !== 'number') return
    const pendingReq = this.pending.get(response.id)
    if (!pendingReq) return
    this.pending.delete(response.id)
    clearTimeout(pendingReq.timer)
    if (response.error) {
      pendingReq.reject(
        new McpTransportError(`MCP error ${response.error.code}: ${response.error.message}`)
      )
    } else {
      pendingReq.resolve(response.result)
    }
  }

  /** 等待服务端 endpoint 事件（超时抛错） */
  private waitForEndpoint(): Promise<McpEndpointInfo> {
    if (this.endpoint) return Promise.resolve(this.endpoint)
    return new Promise((resolve, reject) => {
      const started = Date.now()
      const timer = setInterval(() => {
        if (this.endpoint) {
          clearInterval(timer)
          resolve(this.endpoint)
        } else if (Date.now() - started > this.timeoutMs) {
          clearInterval(timer)
          reject(new McpTransportError('Timed out waiting for MCP endpoint event'))
        }
      }, 50)
    })
  }

  /** JSON-RPC 请求：POST 到 endpoint，SSE 流响应按 id 匹配 */
  private request(method: string, params: Record<string, unknown>): Promise<unknown> {
    if (!this.endpoint) {
      return Promise.reject(new McpTransportError('MCP not connected: missing endpoint'))
    }
    const id = this.nextId++
    const request: JsonRpcRequest = { jsonrpc: '2.0', id, method, params }

    const target = this.resolveEndpointUrl()
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new McpTransportError(`MCP request timeout: ${method}`))
      }, this.timeoutMs)
      this.pending.set(id, { resolve, reject, timer })

      void fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          ...this.config.headers
        },
        body: JSON.stringify(request),
        signal: this.controller?.signal
      })
        .then(async res => {
          if (!res.ok) {
            throw new McpTransportError(`MCP POST failed: HTTP ${res.status}`)
          }
          // MCP 允许流式/一次性响应；一次性响应时 result 在 body
          if (res.body) {
            const text = await readStreamText(res.body)
            const frames = new SseStreamParser()
            for (const evt of frames.push(text)) this.handleEvent(evt)
          }
        })
        .catch(err => {
          const pendingReq = this.pending.get(id)
          if (!pendingReq) return // 已超时
          this.pending.delete(id)
          clearTimeout(pendingReq.timer)
          pendingReq.reject(
            err instanceof McpTransportError
              ? err
              : new McpTransportError(
                  `MCP request failed: ${(err as Error)?.message ?? String(err)}`,
                  err
                )
          )
        })
    })
  }

  private notify(method: string, params: Record<string, unknown>): void {
    if (!this.endpoint) return
    const request: JsonRpcRequest = { jsonrpc: '2.0', id: this.nextId++, method, params }
    void fetch(this.resolveEndpointUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers
      },
      body: JSON.stringify(request),
      signal: this.controller?.signal
    }).catch(() => undefined)
  }

  private resolveEndpointUrl(): string {
    const endpoint = this.endpoint?.endpointUrl ?? ''
    if (/^https?:\/\//i.test(endpoint)) return endpoint
    // 相对路径 → 基于 baseUrl 解析
    const base = new URL(this.config.url)
    const basePath = base.pathname.replace(/\/sse$/i, '').replace(/\/$/, '')
    return `${base.origin}${basePath}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  private rejectAll(error: Error): void {
    for (const { reject, timer } of this.pending.values()) {
      clearTimeout(timer)
      reject(error)
    }
    this.pending.clear()
  }
}
