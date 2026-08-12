/**
 * 组织服务 — Phase 5（T37 多租户）
 *
 * 模型：Organization（租户容器）+ OrgMember（成员 + 角色）
 *  - owner：拥有者（唯一，创建者），可解散组织、管理一切
 *  - admin：可管理成员与组织设置
 *  - member：普通成员
 *
 * 数据隔离：所有按 userId 查询的资源天然隔离；组织提供共享容器，
 * 后续可将 agent/conversation 挂到 org 下（Agent.workspace_id 已预留）。
 */

import { prisma } from '../../prisma.js'

export interface OrgInput {
  name: string
  description?: string
}

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

export type OrgRole = 'owner' | 'admin' | 'member'

/** 成员角色校验：owner/admin 可管理，owner 唯一 */
const MANAGER_ROLES = new Set(['owner', 'admin'])

function toOrg(row: any): OrgRecord {
  let settings: Record<string, unknown> = {}
  try {
    settings = JSON.parse(row.settingsJson ?? '{}')
  } catch {
    settings = {}
  }
  return {
    id: row.id,
    name: row.name,
    ownerUserId: row.ownerUserId,
    description: row.description,
    settings,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/** 查成员（含用户名） */
async function findMembership(orgId: string, userId: number): Promise<OrgMemberRecord | null> {
  const row = await prisma.orgMember.findFirst({ where: { orgId, userId } })
  if (!row) return null
  const userRow = await prisma.user.findFirst({ where: { id: userId } })
  return {
    id: row.id,
    orgId: row.orgId,
    userId: row.userId,
    username: userRow?.username,
    role: row.role,
    createdAt: row.createdAt
  }
}

/** 组织详情 + 成员（调用方需先确认权限） */
export async function getOrgDetail(orgId: string): Promise<OrgDetail> {
  const orgRow = await prisma.organization.findFirst({ where: { id: orgId } })
  if (!orgRow) throw new Error('Organization not found')
  const memberRows = await prisma.orgMember.findMany({ where: { orgId } })
  const users = await prisma.user.findMany({
    where: { id: { in: memberRows.map(m => m.userId) } }
  })
  const usernameById = new Map(users.map(u => [u.id, u.username]))
  const members: OrgMemberRecord[] = memberRows.map(row => ({
    id: row.id,
    orgId: row.orgId,
    userId: row.userId,
    username: usernameById.get(row.userId),
    role: row.role,
    createdAt: row.createdAt
  }))
  return { ...toOrg(orgRow), members }
}

/** 创建组织（创建者成为 owner，并设为默认组织） */
export async function createOrg(userId: number, input: OrgInput): Promise<OrgDetail> {
  if (!input.name?.trim()) throw new Error('Organization name is required')
  const created = await prisma.organization.create({
    data: {
      name: input.name.trim(),
      ownerUserId: userId,
      description: input.description ?? '',
      settingsJson: '{}',
      status: 'active'
    }
  })
  await prisma.orgMember.create({
    data: { orgId: created.id, userId, role: 'owner' }
  })
  await prisma.user.update({ where: { id: userId }, data: { orgId: created.id } })
  return getOrgDetail(created.id)
}

/** 我的组织列表（owner 或成员） */
export async function listMyOrgs(userId: number): Promise<OrgRecord[]> {
  const memberships = await prisma.orgMember.findMany({ where: { userId } })
  if (memberships.length === 0) return []
  const rows = await prisma.organization.findMany({
    where: { id: { in: memberships.map(m => m.orgId) } },
    orderBy: [{ createdAt: 'asc' }]
  })
  return rows.map(toOrg)
}

/** 组织详情（校验成员权限） */
export async function getOrg(userId: number, orgId: string): Promise<OrgDetail | null> {
  const membership = await findMembership(orgId, userId)
  if (!membership) return null
  return getOrgDetail(orgId)
}

/** 更新组织（owner/admin） */
export async function updateOrg(
  userId: number,
  orgId: string,
  input: { name?: string; description?: string; settings?: Record<string, unknown> }
): Promise<OrgRecord> {
  const membership = await findMembership(orgId, userId)
  if (!membership) throw new Error('Not a member of this organization')
  if (!MANAGER_ROLES.has(membership.role))
    throw new Error('Only owner or admin can update the organization')

  const current = await prisma.organization.findFirst({ where: { id: orgId } })
  if (!current) throw new Error('Organization not found')

  const data: Record<string, unknown> = {}
  if (input.name !== undefined) data.name = input.name.trim()
  if (input.description !== undefined) data.description = input.description
  if (input.settings !== undefined) data.settingsJson = JSON.stringify(input.settings)

  const updated = await prisma.organization.update({ where: { id: orgId }, data })
  return toOrg(updated)
}

/** 解散组织（仅 owner） */
export async function deleteOrg(userId: number, orgId: string): Promise<void> {
  const membership = await findMembership(orgId, userId)
  if (!membership) throw new Error('Not a member of this organization')
  if (membership.role !== 'owner') throw new Error('Only the owner can delete the organization')

  await prisma.organization.delete({ where: { id: orgId } })
  // 成员默认组织指向该组织时清空
  await prisma.user.updateMany({ where: { orgId }, data: { orgId: null } })
}

/** 添加成员（owner/admin；按用户名查找用户） */
export async function addMember(
  userId: number,
  orgId: string,
  input: { username: string; role?: OrgRole }
): Promise<OrgMemberRecord> {
  const membership = await findMembership(orgId, userId)
  if (!membership) throw new Error('Not a member of this organization')
  if (!MANAGER_ROLES.has(membership.role)) throw new Error('Only owner or admin can manage members')

  const role = input.role ?? 'member'
  if (!['owner', 'admin', 'member'].includes(role)) throw new Error(`Invalid role: ${role}`)
  if (role === 'owner') throw new Error('Owner role cannot be assigned')

  const target = await prisma.user.findFirst({ where: { username: input.username } })
  if (!target) throw new Error(`User not found: ${input.username}`)

  const existing = await findMembership(orgId, target.id)
  if (existing) throw new Error('User is already a member')

  const created = await prisma.orgMember.create({
    data: { orgId, userId: target.id, role }
  })
  return {
    id: created.id,
    orgId: created.orgId,
    userId: created.userId,
    username: target.username,
    role: created.role,
    createdAt: created.createdAt
  }
}

/** 变更成员角色（owner/admin；不能改 owner 本人） */
export async function updateMemberRole(
  userId: number,
  orgId: string,
  targetUserId: number,
  role: OrgRole
): Promise<OrgMemberRecord> {
  const membership = await findMembership(orgId, userId)
  if (!membership) throw new Error('Not a member of this organization')
  if (!MANAGER_ROLES.has(membership.role)) throw new Error('Only owner or admin can manage members')
  if (!['owner', 'admin', 'member'].includes(role)) throw new Error(`Invalid role: ${role}`)
  if (role === 'owner') throw new Error('Owner role cannot be assigned')

  const target = await findMembership(orgId, targetUserId)
  if (!target) throw new Error('Target is not a member')
  if (target.role === 'owner') throw new Error('Owner role cannot be changed')

  await prisma.orgMember.updateMany({
    where: { id: target.id },
    data: { role }
  })
  return { ...target, role }
}

/** 移除成员（owner/admin；不能移除 owner） */
export async function removeMember(
  userId: number,
  orgId: string,
  targetUserId: number
): Promise<void> {
  const membership = await findMembership(orgId, userId)
  if (!membership) throw new Error('Not a member of this organization')
  if (!MANAGER_ROLES.has(membership.role)) throw new Error('Only owner or admin can manage members')

  const target = await findMembership(orgId, targetUserId)
  if (!target) throw new Error('Target is not a member')
  if (target.role === 'owner') throw new Error('Owner cannot be removed')

  await prisma.orgMember.deleteMany({ where: { id: target.id } })
}
