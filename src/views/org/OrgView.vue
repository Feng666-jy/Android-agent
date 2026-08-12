<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { showToast } from 'vant'
import {
  orgAPI,
  type OrgDetail,
  type OrgMemberRecord,
  type OrgRecord,
  type OrgRole
} from '@/api/org'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loading = ref(false)
const errorMsg = ref('')
const orgs = ref<OrgRecord[]>([])
const current = ref<OrgDetail | null>(null)

// ---- 创建 ----
const showCreateForm = ref(false)
const newOrg = ref({ name: '', description: '' })

// ---- 成员 ----
const showMemberForm = ref(false)
const newMember = ref({ username: '', role: 'member' as OrgRole })

const roleLabels: Record<string, string> = {
  owner: '拥有者',
  admin: '管理员',
  member: '成员'
}

const myUserId = computed(() => userStore.userInfo?.id ?? null)

const myRoleInCurrent = computed<string | null>(() => {
  if (!current.value || !myUserId.value) return null
  return current.value.members.find(m => m.userId === myUserId.value)?.role ?? null
})

const canManageOrg = computed(() => {
  const role = myRoleInCurrent.value
  return role === 'owner' || role === 'admin'
})

const canDeleteOrg = computed(() => myRoleInCurrent.value === 'owner')

// ---- 加载 ----

async function loadList() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await orgAPI.list()
    orgs.value = res.data?.items ?? []
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
  await loadList()
})

async function openDetail(org: OrgRecord) {
  errorMsg.value = ''
  try {
    const res = await orgAPI.detail(org.id)
    current.value = res.data
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  }
}

function backToList() {
  current.value = null
  loadList()
}

// ---- 组织操作 ----

async function createOrg() {
  if (!newOrg.value.name.trim()) return
  try {
    await orgAPI.create({
      name: newOrg.value.name.trim(),
      description: newOrg.value.description.trim()
    })
    newOrg.value = { name: '', description: '' }
    showCreateForm.value = false
    showToast('创建成功')
    await loadList()
  } catch (e) {
    errorMsg.value = (e as Error).message || '创建失败'
  }
}

async function updateOrg() {
  if (!current.value) return
  try {
    await orgAPI.update(current.value.id, {
      name: current.value.name.trim(),
      description: current.value.description.trim()
    })
    showToast('已保存')
    await openDetail(current.value)
  } catch (e) {
    errorMsg.value = (e as Error).message || '保存失败'
  }
}

async function deleteOrg() {
  if (!current.value) return
  if (!window.confirm(`确认解散组织「${current.value.name}」？此操作不可恢复。`)) return
  try {
    await orgAPI.remove(current.value.id)
    showToast('组织已解散')
    backToList()
  } catch (e) {
    errorMsg.value = (e as Error).message || '解散失败'
  }
}

// ---- 成员操作 ----

async function addMember() {
  if (!current.value || !newMember.value.username.trim()) return
  try {
    await orgAPI.addMember(current.value.id, {
      username: newMember.value.username.trim(),
      role: newMember.value.role
    })
    newMember.value = { username: '', role: 'member' }
    showMemberForm.value = false
    showToast('成员已添加')
    await openDetail(current.value)
  } catch (e) {
    errorMsg.value = (e as Error).message || '添加失败'
  }
}

async function changeRole(member: OrgMemberRecord, role: OrgRole) {
  if (!current.value || member.role === role) return
  if (!window.confirm(`将 ${member.username ?? member.userId} 的角色改为「${roleLabels[role]}」？`))
    return
  try {
    await orgAPI.updateMemberRole(current.value.id, member.userId, role)
    showToast('角色已更新')
    await openDetail(current.value)
  } catch (e) {
    errorMsg.value = (e as Error).message || '操作失败'
  }
}

async function removeMember(member: OrgMemberRecord) {
  if (!current.value) return
  if (!window.confirm(`确认将 ${member.username ?? member.userId} 移出组织？`)) return
  try {
    await orgAPI.removeMember(current.value.id, member.userId)
    showToast('成员已移除')
    await openDetail(current.value)
  } catch (e) {
    errorMsg.value = (e as Error).message || '移除失败'
  }
}

const sortedMembers = computed<OrgMemberRecord[]>(() => {
  if (!current.value) return []
  const order: Record<string, number> = { owner: 0, admin: 1, member: 2 }
  return [...current.value.members].sort(
    (a, b) => (order[a.role] ?? 9) - (order[b.role] ?? 9) || a.userId - b.userId
  )
})
</script>

<template>
  <div class="org-view">
    <header class="org-view__header">
      <h1 class="org-view__title">组织管理</h1>
      <button class="org-view__btn-icon" aria-label="刷新" @click="loadList">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>
    </header>

    <div v-if="errorMsg" class="org-view__error">{{ errorMsg }}</div>
    <div v-if="loading" class="org-view__loading">加载中...</div>

    <!-- ==================== 组织列表 ==================== -->
    <template v-if="!current">
      <div class="org-view__row-actions">
        <button class="org-view__btn-primary" @click="showCreateForm = !showCreateForm">
          {{ showCreateForm ? '收起' : '+ 创建组织' }}
        </button>
      </div>

      <div v-if="showCreateForm" class="org-view__form">
        <input
          v-model="newOrg.name"
          class="org-view__input"
          placeholder="组织名称（必填）"
          maxlength="64"
        />
        <input
          v-model="newOrg.description"
          class="org-view__input"
          placeholder="组织描述（可选）"
          maxlength="200"
        />
        <button class="org-view__btn-primary" @click="createOrg">创建</button>
      </div>

      <ul class="org-view__list">
        <li v-for="org in orgs" :key="org.id" class="org-view__item" @click="openDetail(org)">
          <div class="org-view__item-main">
            <div class="org-view__item-title">{{ org.name }}</div>
            <div class="org-view__item-desc">{{ org.description || '暂无描述' }}</div>
            <div class="org-view__item-meta">
              创建于 {{ org.createdAt.slice(0, 10) }}
              <span v-if="org.status !== 'active'" class="org-view__badge is-disabled">
                {{ org.status }}
              </span>
            </div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="org-view__chevron"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </li>
      </ul>
      <div v-if="!orgs.length && !loading" class="org-view__empty">
        还没有组织。创建组织后，可将 Agent、工作流与用量在团队内共享。
      </div>
    </template>

    <!-- ==================== 组织详情 ==================== -->
    <template v-else-if="current">
      <div class="org-view__row-actions">
        <button class="org-view__btn-ghost" @click="backToList">← 返回列表</button>
        <div class="org-view__badge" :class="`is-${myRoleInCurrent ?? 'member'}`">
          {{ roleLabels[myRoleInCurrent ?? 'member'] }}
        </div>
      </div>

      <div class="org-view__card">
        <div class="org-view__card-title">组织信息</div>
        <input
          v-model="current.name"
          class="org-view__input"
          :disabled="!canManageOrg"
          maxlength="64"
        />
        <input
          v-model="current.description"
          class="org-view__input"
          :disabled="!canManageOrg"
          placeholder="组织描述"
          maxlength="200"
        />
        <div class="org-view__card-actions">
          <button v-if="canManageOrg" class="org-view__btn-primary" @click="updateOrg">
            保存修改
          </button>
          <button v-if="canDeleteOrg" class="org-view__btn-danger" @click="deleteOrg">
            解散组织
          </button>
        </div>
      </div>

      <div class="org-view__card">
        <div class="org-view__card-title">成员（{{ current.members.length }}）</div>
        <div class="org-view__row-actions">
          <button
            v-if="canManageOrg"
            class="org-view__btn-primary"
            @click="showMemberForm = !showMemberForm"
          >
            {{ showMemberForm ? '收起' : '+ 添加成员' }}
          </button>
        </div>

        <div v-if="showMemberForm" class="org-view__form">
          <input
            v-model="newMember.username"
            class="org-view__input"
            placeholder="对方用户名（必填）"
            maxlength="64"
          />
          <select v-model="newMember.role" class="org-view__select">
            <option value="member">成员</option>
            <option value="admin">管理员</option>
          </select>
          <button class="org-view__btn-primary" @click="addMember">添加</button>
        </div>

        <ul class="org-view__list">
          <li v-for="member in sortedMembers" :key="member.id" class="org-view__item">
            <div class="org-view__item-main">
              <div class="org-view__item-title">
                {{ member.username ?? `用户 #${member.userId}` }}
                <span class="org-view__badge" :class="`is-${member.role}`">
                  {{ roleLabels[member.role] ?? member.role }}
                </span>
              </div>
              <div class="org-view__item-desc">加入于 {{ member.createdAt.slice(0, 10) }}</div>
            </div>
            <div v-if="canManageOrg && member.userId !== myUserId" class="org-view__item-actions">
              <select
                v-if="member.role !== 'owner'"
                class="org-view__select org-view__select-small"
                :value="member.role"
                @change="changeRole(member, ($event.target as HTMLSelectElement).value as OrgRole)"
              >
                <option value="admin">管理员</option>
                <option value="member">成员</option>
              </select>
              <button
                class="org-view__btn-danger"
                aria-label="移除成员"
                @click="removeMember(member)"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/ai-tokens' as *;

.org-view {
  width: 100%;
  min-height: 100%;
  padding: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: $ai-text-primary;
  }

  &__btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-secondary;
    cursor: pointer;
    box-shadow: $ai-shadow-card;

    &:active {
      transform: scale(0.95);
    }
  }

  &__error {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: $ai-radius-small;
    background: rgba(229, 57, 53, 0.1);
    color: #e53935;
    font-size: 13px;
  }

  &__loading {
    padding: 24px 0;
    text-align: center;
    color: $ai-text-secondary;
  }

  &__row-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  }

  &__btn-primary {
    padding: 8px 16px;
    border: none;
    border-radius: $ai-radius-small;
    background: #4f46e5;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  &__btn-ghost {
    padding: 8px 12px;
    border: none;
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-primary;
    font-size: 14px;
    cursor: pointer;
    box-shadow: $ai-shadow-card;
  }

  &__btn-danger {
    padding: 6px 10px;
    border: 1px solid rgba(229, 57, 53, 0.4);
    border-radius: $ai-radius-small;
    background: transparent;
    color: #e53935;
    font-size: 13px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__empty {
    padding: 20px 0;
    text-align: center;
    color: $ai-text-secondary;
    font-size: 14px;
  }

  &__card {
    margin-bottom: 12px;
    padding: 14px 16px;
    border-radius: $ai-radius-medium;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-card;

    &-title {
      margin-bottom: 10px;
      font-size: 15px;
      font-weight: 600;
      color: $ai-text-primary;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: $ai-radius-medium;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-card;
  }

  &__input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-primary;
    font-size: 14px;
    box-sizing: border-box;

    &:disabled {
      opacity: 0.6;
    }
  }

  &__select {
    padding: 9px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-primary;
    font-size: 14px;

    &-small {
      padding: 5px 8px;
      font-size: 12px;
    }
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 0;
    cursor: pointer;

    & + & {
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }

    &-main {
      flex: 1;
      min-width: 0;
    }

    &-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: $ai-text-primary;
    }

    &-desc {
      margin-top: 3px;
      font-size: 12px;
      color: $ai-text-secondary;
    }

    &-meta {
      margin-top: 3px;
      font-size: 12px;
      color: $ai-text-secondary;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: default;
    }
  }

  &__chevron {
    flex-shrink: 0;
    color: $ai-text-secondary;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    font-size: 11px;
    font-weight: 600;

    &.is-owner {
      background: rgba(251, 188, 5, 0.18);
      color: #b8860b;
    }

    &.is-admin {
      background: rgba(66, 133, 244, 0.12);
      color: #4285f4;
    }

    &.is-member {
      background: rgba(0, 0, 0, 0.06);
      color: $ai-text-secondary;
    }

    &.is-disabled {
      background: rgba(0, 0, 0, 0.06);
      color: $ai-text-secondary;
    }
  }
}
</style>
