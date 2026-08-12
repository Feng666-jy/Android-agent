/**
 * 组织服务测试 — Phase 5（T37 多租户）
 */
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { applyMigrations } from '../../../db/migrate.ts'
import { closeDatabase, prisma } from '../../../prisma.ts'
import {
  createOrg,
  listMyOrgs,
  getOrg,
  updateOrg,
  deleteOrg,
  addMember,
  updateMemberRole,
  removeMember
} from '../../../services/org/index.ts'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'server/src/db/migrations')
let tempRoot: string
let ownerId: number
let memberId: number

async function makeUser(suffix: string): Promise<number> {
  const user = await prisma.user.create({
    data: {
      username: `org${suffix}${Date.now()}`,
      password: 'x',
      email: `org${suffix}${Date.now()}@t.com`
    }
  })
  return user.id
}

beforeEach(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'org-'))
  process.env.DATABASE_URL = `file:${path.join(tempRoot, 'test.db')}`
  const db = new DatabaseSync(path.join(tempRoot, 'test.db'))
  applyMigrations(db, { migrationsDir: MIGRATIONS_DIR })
  db.close()
  ownerId = await makeUser('o')
  memberId = await makeUser('m')
})

afterEach(() => {
  closeDatabase()
  rmSync(tempRoot, { recursive: true, force: true })
})

test('创建组织：owner 成员 + 默认组织写入', async () => {
  const org = await createOrg(ownerId, { name: '测试组织', description: 'desc' })
  assert.equal(org.ownerUserId, ownerId)
  assert.equal(org.members.length, 1)
  assert.equal(org.members[0].role, 'owner')
  const me = await prisma.user.findFirst({ where: { id: ownerId } })
  assert.equal(me.orgId, org.id)
})

test('成员管理：添加/改角色/移除 + 权限边界', async () => {
  const org = await createOrg(ownerId, { name: '团队' })
  const orgId = org.id

  // 非成员无法查看
  assert.equal(await getOrg(memberId, orgId), null)

  // owner 添加成员（按用户名）
  const memberUser = await prisma.user.findFirst({ where: { id: memberId } })
  const added = await addMember(ownerId, orgId, { username: memberUser.username, role: 'admin' })
  assert.equal(added.role, 'admin')
  assert.equal(added.username, memberUser.username)

  // 成员现在可见
  const detail = await getOrg(memberId, orgId)
  assert.equal(detail?.members.length, 2)

  // 非管理成员不能加人
  await assert.rejects(() => addMember(memberId, orgId, { username: 'nobody' }))

  // 改角色（admin → member）
  const updated = await updateMemberRole(ownerId, orgId, memberId, 'member')
  assert.equal(updated.role, 'member')

  // 不能改 owner 本人
  await assert.rejects(() => updateMemberRole(ownerId, orgId, ownerId, 'member'))
  // 不能把角色设为 owner
  await assert.rejects(() => addMember(ownerId, orgId, { username: 'x', role: 'owner' }))

  // 移除成员
  await removeMember(ownerId, orgId, memberId)
  assert.equal(await getOrg(memberId, orgId), null)
  // 不能移除 owner
  await assert.rejects(() => removeMember(memberId, orgId, ownerId))
})

test('更新与解散组织', async () => {
  const org = await createOrg(ownerId, { name: '旧名' })
  const updated = await updateOrg(ownerId, org.id, { name: '新名', description: 'd' })
  assert.equal(updated.name, '新名')

  await deleteOrg(ownerId, org.id)
  assert.equal((await listMyOrgs(ownerId)).length, 0)
  // 默认组织被清空
  const me = await prisma.user.findFirst({ where: { id: ownerId } })
  assert.equal(me.orgId, null)
  // 非 owner 不能解散
  const org2 = await createOrg(ownerId, { name: '另一个' })
  await assert.rejects(() => deleteOrg(memberId, org2.id))
})
