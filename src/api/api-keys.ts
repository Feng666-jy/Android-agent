// API Key 客户端 — Phase 5 T39（对齐 server/src/services/api-key/service.ts）

import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// ---- 类型 ----

export type ApiKeyScope = 'agent' | 'all'

export interface ApiKeyRecord {
  id: string
  userId: number
  name: string
  prefix: string
  scope: ApiKeyScope
  status: string
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreatedApiKey {
  record: ApiKeyRecord
  /** 明文 Key，仅创建时返回一次 */
  plainKey: string
}

// ---- API ----

export const apiKeysAPI = {
  /** GET /v2/api-keys — 我的 Key 列表 */
  list(): Promise<ApiResponse<{ items: ApiKeyRecord[] }>> {
    return request.get('/v2/api-keys')
  },

  /** POST /v2/api-keys — 创建（明文仅返回一次） */
  create(data: {
    name: string
    scope?: ApiKeyScope
    expiresAt?: string
  }): Promise<ApiResponse<CreatedApiKey>> {
    return request.post('/v2/api-keys', data)
  },

  /** PUT /v2/api-keys/:id — 改名 / 换 scope */
  update(
    id: string,
    data: { name?: string; scope?: ApiKeyScope }
  ): Promise<ApiResponse<ApiKeyRecord>> {
    return request.put(`/v2/api-keys/${id}`, data)
  },

  /** DELETE /v2/api-keys/:id — 吊销 */
  revoke(id: string): Promise<ApiResponse<{ revoked: boolean }>> {
    return request.delete(`/v2/api-keys/${id}`)
  }
}
