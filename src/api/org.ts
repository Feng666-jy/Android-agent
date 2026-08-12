// 组织 API 客户端 — Phase 5 T39（对齐 server/src/services/org/index.ts）

import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// ---- 类型 ----

export type OrgRole = 'owner' | 'admin' | 'member'

export interface OrgRecord {
  id: string
  name: string
  ownerUserId: number
  description: string
  settings: Record<string, unknown>
  status: string
  createdAt: string
  updatedAt: string
}

export interface OrgMemberRecord {
  id: string
  orgId: string
  userId: number
  username?: string
  role: string
  createdAt: string
}

export interface OrgDetail extends OrgRecord {
  members: OrgMemberRecord[]
}

// ---- API ----

export const orgAPI = {
  /** GET /v2/orgs — 我的组织列表 */
  list(): Promise<ApiResponse<{ items: OrgRecord[] }>> {
    return request.get('/v2/orgs')
  },

  /** POST /v2/orgs — 创建组织 */
  create(data: { name: string; description?: string }): Promise<ApiResponse<OrgRecord>> {
    return request.post('/v2/orgs', data)
  },

  /** GET /v2/orgs/:id — 组织详情（含成员） */
  detail(id: string): Promise<ApiResponse<OrgDetail>> {
    return request.get(`/v2/orgs/${id}`)
  },

  /** PUT /v2/orgs/:id — 更新组织 */
  update(
    id: string,
    data: { name?: string; description?: string; settings?: Record<string, unknown> }
  ): Promise<ApiResponse<OrgRecord>> {
    return request.put(`/v2/orgs/${id}`, data)
  },

  /** DELETE /v2/orgs/:id — 解散组织（仅 owner） */
  remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return request.delete(`/v2/orgs/${id}`)
  },

  /** POST /v2/orgs/:id/members — 添加成员 */
  addMember(
    id: string,
    data: { username: string; role?: OrgRole }
  ): Promise<ApiResponse<OrgMemberRecord>> {
    return request.post(`/v2/orgs/${id}/members`, data)
  },

  /** PUT /v2/orgs/:id/members/:userId — 变更成员角色 */
  updateMemberRole(
    id: string,
    userId: number,
    role: OrgRole
  ): Promise<ApiResponse<OrgMemberRecord>> {
    return request.put(`/v2/orgs/${id}/members/${userId}`, { role })
  },

  /** DELETE /v2/orgs/:id/members/:userId — 移除成员 */
  removeMember(id: string, userId: number): Promise<ApiResponse<{ removed: boolean }>> {
    return request.delete(`/v2/orgs/${id}/members/${userId}`)
  }
}
