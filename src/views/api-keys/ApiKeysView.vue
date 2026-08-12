<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showToast } from 'vant'
import { apiKeysAPI, type ApiKeyRecord, type ApiKeyScope, type CreatedApiKey } from '@/api/api-keys'

const loading = ref(false)
const errorMsg = ref('')
const items = ref<ApiKeyRecord[]>([])

// ---- 创建 ----
const showCreateForm = ref(false)
const newKey = ref({ name: '', scope: 'agent' as ApiKeyScope, expiresAt: '' })
const createdKey = ref<CreatedApiKey | null>(null)
const copied = ref(false)

// ---- 编辑 ----
const editingId = ref<string | null>(null)
const editForm = ref({ name: '', scope: 'agent' as ApiKeyScope })

const scopeLabels: Record<string, string> = {
  agent: 'Agent 调用',
  all: '全部'
}

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await apiKeysAPI.list()
    items.value = res.data?.items ?? []
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function fmtDate(iso?: string): string {
  if (!iso) return '-'
  return iso.slice(0, 10)
}

function fmtTime(iso?: string): string {
  if (!iso) return '-'
  return iso.slice(0, 16).replace('T', ' ')
}

function isExpired(item: ApiKeyRecord): boolean {
  return !!item.expiresAt && item.expiresAt <= new Date().toISOString()
}

async function createKey() {
  if (!newKey.value.name.trim()) return
  try {
    const payload: { name: string; scope: ApiKeyScope; expiresAt?: string } = {
      name: newKey.value.name.trim(),
      scope: newKey.value.scope
    }
    if (newKey.value.expiresAt) {
      payload.expiresAt = new Date(newKey.value.expiresAt + 'T23:59:59').toISOString()
    }
    const res = await apiKeysAPI.create(payload)
    createdKey.value = res.data
    copied.value = false
    newKey.value = { name: '', scope: 'agent', expiresAt: '' }
    showCreateForm.value = false
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '创建失败'
  }
}

async function copyPlainKey() {
  if (!createdKey.value) return
  try {
    await navigator.clipboard.writeText(createdKey.value.plainKey)
    copied.value = true
    showToast('已复制，请妥善保存')
  } catch {
    showToast('复制失败，请手动选择复制')
  }
}

async function revoke(item: ApiKeyRecord) {
  if (!window.confirm(`确认吊销「${item.name}」？使用该 Key 的集成将立即失效。`)) return
  try {
    await apiKeysAPI.revoke(item.id)
    showToast('已吊销')
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '吊销失败'
  }
}

function startEdit(item: ApiKeyRecord) {
  editingId.value = item.id
  editForm.value = { name: item.name, scope: item.scope }
}

async function saveEdit(item: ApiKeyRecord) {
  if (!editForm.value.name.trim()) return
  try {
    await apiKeysAPI.update(item.id, {
      name: editForm.value.name.trim(),
      scope: editForm.value.scope
    })
    editingId.value = null
    showToast('已保存')
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '保存失败'
  }
}
</script>

<template>
  <div class="api-keys-view">
    <header class="api-keys-view__header">
      <h1 class="api-keys-view__title">API Key 管理</h1>
      <button class="api-keys-view__btn-icon" aria-label="刷新" @click="load">
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

    <div v-if="errorMsg" class="api-keys-view__error">{{ errorMsg }}</div>
    <div v-if="loading" class="api-keys-view__loading">加载中...</div>

    <div class="api-keys-view__row-actions">
      <button class="api-keys-view__btn-primary" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? '收起' : '+ 创建 API Key' }}
      </button>
    </div>

    <div v-if="showCreateForm" class="api-keys-view__form">
      <input
        v-model="newKey.name"
        class="api-keys-view__input"
        placeholder="Key 名称（如 生产环境 / CI）"
        maxlength="64"
      />
      <select v-model="newKey.scope" class="api-keys-view__select">
        <option value="agent">Agent 调用</option>
        <option value="all">全部</option>
      </select>
      <input v-model="newKey.expiresAt" class="api-keys-view__input" type="date" />
      <button class="api-keys-view__btn-primary" @click="createKey">创建</button>
    </div>

    <!-- 创建成功：明文仅展示一次 -->
    <div v-if="createdKey" class="api-keys-view__secret">
      <div class="api-keys-view__secret-title">Key 已创建（明文仅显示这一次）</div>
      <code class="api-keys-view__secret-value">{{ createdKey.plainKey }}</code>
      <div class="api-keys-view__secret-actions">
        <button class="api-keys-view__btn-primary" @click="copyPlainKey">
          {{ copied ? '已复制 ✓' : '复制 Key' }}
        </button>
        <button class="api-keys-view__btn-ghost" @click="createdKey = null">我知道了</button>
      </div>
    </div>

    <ul class="api-keys-view__list">
      <li v-for="item in items" :key="item.id" class="api-keys-view__item">
        <div class="api-keys-view__item-main">
          <div class="api-keys-view__item-title">
            {{ item.name }}
            <span
              class="api-keys-view__badge"
              :class="isExpired(item) || item.status !== 'active' ? 'is-disabled' : 'is-active'"
            >
              {{ isExpired(item) ? '已过期' : item.status === 'active' ? '启用' : '已吊销' }}
            </span>
          </div>
          <div class="api-keys-view__item-desc">
            {{ item.prefix }}... · {{ scopeLabels[item.scope] ?? item.scope }}
          </div>
          <div class="api-keys-view__item-meta">
            创建于 {{ fmtDate(item.createdAt) }} · 过期 {{ fmtDate(item.expiresAt) }} · 最近使用
            {{ fmtTime(item.lastUsedAt) }}
          </div>
        </div>

        <!-- 内联编辑 -->
        <div v-if="editingId === item.id" class="api-keys-view__item-edit">
          <input v-model="editForm.name" class="api-keys-view__input" maxlength="64" />
          <select v-model="editForm.scope" class="api-keys-view__select">
            <option value="agent">Agent 调用</option>
            <option value="all">全部</option>
          </select>
          <div class="api-keys-view__item-actions">
            <button class="api-keys-view__btn-primary" @click="saveEdit(item)">保存</button>
            <button class="api-keys-view__btn-ghost" @click="editingId = null">取消</button>
          </div>
        </div>

        <div v-else class="api-keys-view__item-actions">
          <button
            v-if="item.status === 'active' && !isExpired(item)"
            class="api-keys-view__btn-ghost"
            @click="startEdit(item)"
          >
            编辑
          </button>
          <button
            v-if="item.status === 'active'"
            class="api-keys-view__btn-danger"
            @click="revoke(item)"
          >
            吊销
          </button>
        </div>
      </li>
    </ul>
    <div v-if="!items.length && !loading" class="api-keys-view__empty">
      还没有 API Key。创建后可用于第三方系统调用你的 Agent 接口（`Bearer sk_...`）。
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/ai-tokens' as *;

.api-keys-view {
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
    padding: 6px 12px;
    border: none;
    border-radius: $ai-radius-small;
    background: rgba(0, 0, 0, 0.05);
    color: $ai-text-primary;
    font-size: 13px;
    cursor: pointer;
  }

  &__btn-danger {
    padding: 6px 12px;
    border: 1px solid rgba(229, 57, 53, 0.4);
    border-radius: $ai-radius-small;
    background: transparent;
    color: #e53935;
    font-size: 13px;
    cursor: pointer;
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
  }

  &__select {
    padding: 9px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-primary;
    font-size: 14px;
  }

  &__secret {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
    padding: 14px 16px;
    border-radius: $ai-radius-medium;
    background: rgba(251, 188, 5, 0.08);
    border: 1px solid rgba(251, 188, 5, 0.3);

    &-title {
      font-size: 14px;
      font-weight: 600;
      color: #b8860b;
    }

    &-value {
      padding: 10px 12px;
      border-radius: $ai-radius-small;
      background: rgba(0, 0, 0, 0.06);
      font-size: 12px;
      word-break: break-all;
      color: $ai-text-primary;
    }

    &-actions {
      display: flex;
      gap: 8px;
    }
  }

  &__empty {
    padding: 20px 0;
    text-align: center;
    color: $ai-text-secondary;
    font-size: 14px;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    padding: 12px 0;

    & + & {
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }

    &-main {
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

    &-edit {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
      padding: 10px;
      border-radius: $ai-radius-small;
      background: rgba(0, 0, 0, 0.03);
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
    }
  }

  &__badge {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    font-size: 11px;
    font-weight: 600;

    &.is-active {
      background: rgba(52, 168, 83, 0.12);
      color: #34a853;
    }

    &.is-disabled {
      background: rgba(0, 0, 0, 0.06);
      color: $ai-text-secondary;
    }
  }
}
</style>
