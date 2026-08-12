/**
 * MCP（Model Context Protocol）类型定义 — Phase 2（T17/T18）
 *
 * 范围：SSE 传输（首个版本；streamable-http 预留 transport 字段）。
 * 协议：MCP 基于 JSON-RPC 2.0：
 *   - GET <url>/sse        → 服务端事件流（endpoint 事件给出消息端点）
 *   - POST <endpoint>      → 客户端请求（initialize / tools/list / tools/call）
 */

/** JSON-RPC 2.0 请求 */
export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: number
  method: string
  params?: Record<string, unknown>
}

/** JSON-RPC 2.0 响应 */
export interface JsonRpcResponse {
  jsonrpc: '2.0'
  id: number | null
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

/** MCP 服务器能力协商结果（initialize 返回） */
export interface McpInitializeResult {
  protocolVersion: string
  capabilities: {
    tools?: Record<string, unknown>
    resources?: Record<string, unknown>
    prompts?: Record<string, unknown>
  }
  serverInfo: { name: string; version: string }
}

/** MCP 工具定义（tools/list 返回） */
export interface McpToolDef {
  name: string
  description?: string
  /** JSON Schema（inputSchema） */
  inputSchema?: Record<string, unknown>
}

/** MCP 工具调用结果内容块 */
export interface McpToolResultContent {
  type: 'text' | 'image' | 'resource'
  text?: string
  mimeType?: string
  data?: string
  uri?: string
}

/** MCP 工具调用响应 */
export interface McpToolCallResult {
  content: McpToolResultContent[]
  isError?: boolean
}

/** MCP 服务器配置（与 mcp_servers 表对应） */
export interface McpServerConfig {
  id: string
  userId: number
  name: string
  transport: 'sse' | 'streamable-http'
  url: string
  headers: Record<string, string>
  enabled: boolean
}

export type McpServerStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

/** SSE 事件帧（解析结果） */
export interface SseEvent {
  event: string
  data: string
  id?: string
}

/** SSE endpoint 事件：服务端下发消息端点与 session id */
export interface McpEndpointInfo {
  endpointUrl: string
  sessionId?: string
}
