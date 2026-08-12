<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { aiResourcesAPI, type ProviderResourceView, type ResourceSummary } from '@/api/ai-resources'
import { providerAPI } from '@/api/provider'

const router = useRouter()

const loading = ref(false)
const errorMsg = ref('')
const summary = ref<ResourceSummary | null>(null)
const testingIds = ref<Set<string>>(new Set())

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await aiResourcesAPI.summary()
    summary.value = res.data
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function fmtTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`
  return String(tokens)
}

function fmtCost(cost: number): string {
  if (cost <= 0) return '$0'
  if (cost >= 1) return `$${cost.toFixed(2)}`
  return `$${cost.toFixed(4)}`
}

function fmtTime(iso?: string | null): string {
  if (!iso) return '-'
  return iso.slice(0, 16).replace('T', ' ')
}

function healthLabel(status: string): string {
  const map: Record<string, string> = {
    HEALTHY: '健康',
    DEGRADED: '异常',
    UNREACHABLE: '不可达',
    UNKNOWN: '未检测'
  }
  return map[status] ?? status
}

function healthClass(status: string): string {
  if (status === 'HEALTHY') return 'is-ok'
  if (status === 'DEGRADED') return 'is-warn'
  if (status === 'UNREACHABLE') return 'is-bad'
  return 'is-unknown'
}

function goProvider(id: string) {
  router.push(`/workspace/settings/providers/${id}`)
}

function goAddProvider() {
  router.push('/workspace/settings/providers/new')
}

function goModelManager() {
  router.push('/workspace/settings/models')
}

async function testConnection(p: ProviderResourceView) {
  testingIds.value.add(p.id)
  try {
    const res = await providerAPI.healthCheck(p.id)
    const data = res.data
    if (data.status === 'HEALTHY') {
      showToast(`${p.name} 连接正常（${data.latencyMs}ms）`)
    } else {
      showToast(`${p.name} 连接失败：${data.errorMessage ?? data.status}`)
    }
    await load()
  } catch (e) {
    showToast((e as Error).message || '测试失败')
  } finally {
    testingIds.value.delete(p.id)
  }
}

async function deleteKey(p: ProviderResourceView) {
  if (!p.hasApiKey) return
  if (!window.confirm(`确认删除「${p.name}」的 API Key？删除后该供应商将无法调用。`)) return
  try {
    await providerAPI.update(p.id, { apiKeyEncrypted: '' })
    showToast('已删除 API Key')
    await load()
  } catch (e) {
    showToast((e as Error).message || '删除失败')
  }
}

function capLabel(cap: string): string {
  const map: Record<string, string> = {
    TEXT: '文本',
    VISION: '视觉',
    TOOL_CALLING: '工具',
    REASONING: '推理',
    MCP: 'MCP',
    PROMPT_CACHE: '缓存',
    STREAMING: '流式'
  }
  return map[cap] ?? cap
}
</script>

<template>
  <div class="ai-res">
    <header class="ai-res__header">
      <div class="ai-res__heading">
        <h1 class="ai-res__title">AI 资源</h1>
        <p class="ai-res__subtitle">供应商 · 模型目录 · 用量与成本</p>
      </div>
      <button class="ai-res__btn-icon" aria-label="刷新" @click="load">
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

    <div v-if="errorMsg" class="ai-res__error">{{ errorMsg }}</div>
    <div v-if="loading && !summary" class="ai-res__loading">加载中...</div>

    <template v-if="summary">
      <!-- Card 1: 用量统计 -->
      <section class="ai-res__card">
        <div class="ai-res__card-head">
          <h2 class="ai-res__card-title">用量统计</h2>
          <span class="ai-res__card-meta"
            >平均耗时 {{ summary.usage.total.averageLatencyMs.toFixed(0) }}ms</span
          >
        </div>
        <div class="ai-res__usage-grid">
          <div class="ai-res__usage-cell">
            <span class="ai-res__usage-num">{{ summary.usage.today.requests }}</span>
            <span class="ai-res__usage-label"
              >今日请求 · {{ fmtTokens(summary.usage.today.totalTokens) }} tokens</span
            >
          </div>
          <div class="ai-res__usage-cell">
            <span class="ai-res__usage-num">{{ summary.usage.month.requests }}</span>
            <span class="ai-res__usage-label"
              >本月请求 · {{ fmtTokens(summary.usage.month.totalTokens) }} tokens</span
            >
          </div>
          <div class="ai-res__usage-cell">
            <span class="ai-res__usage-num">{{ fmtCost(summary.usage.total.estimatedCost) }}</span>
            <span class="ai-res__usage-label">累计成本估算（USD）</span>
          </div>
        </div>
      </section>

      <!-- Card 2: 供应商总览 -->
      <section class="ai-res__card">
        <div class="ai-res__card-head">
          <h2 class="ai-res__card-title">供应商总览</h2>
          <button class="ai-res__btn-ghost" @click="goAddProvider">+ 新增供应商</button>
        </div>
        <ul v-if="summary.providers.length" class="ai-res__list">
          <li v-for="p in summary.providers" :key="p.id" class="ai-res__provider">
            <div class="ai-res__provider-main">
              <div class="ai-res__provider-title">
                {{ p.name }}
                <span class="ai-res__badge" :class="healthClass(p.healthStatus)">
                  {{ healthLabel(p.healthStatus) }}
                </span>
              </div>
              <div class="ai-res__provider-desc">
                {{ p.baseUrl }}
              </div>
              <div class="ai-res__provider-meta">{{ p.modelCount }} 个模型 · {{ p.protocol }}</div>
            </div>
            <div class="ai-res__provider-actions">
              <button
                class="ai-res__btn-primary"
                :disabled="testingIds.has(p.id)"
                @click="testConnection(p)"
              >
                {{ testingIds.has(p.id) ? '测试中...' : '测试连接' }}
              </button>
              <button class="ai-res__btn-ghost" @click="goProvider(p.id)">管理</button>
            </div>
          </li>
        </ul>
        <div v-else class="ai-res__empty">
          还没有供应商。点击「新增供应商」添加你的第一个 Provider。
        </div>
      </section>

      <!-- Card 3: API Key 管理 -->
      <section class="ai-res__card">
        <div class="ai-res__card-head">
          <h2 class="ai-res__card-title">API Key 管理</h2>
          <button class="ai-res__btn-ghost" @click="goAddProvider">新增 Key</button>
        </div>
        <ul v-if="summary.providers.length" class="ai-res__list">
          <li v-for="p in summary.providers" :key="p.id" class="ai-res__key">
            <div class="ai-res__key-main">
              <div class="ai-res__key-title">
                {{ p.name }}
                <span class="ai-res__badge" :class="p.hasApiKey ? 'is-ok' : 'is-unknown'">
                  {{ p.hasApiKey ? '已配置' : '未配置' }}
                </span>
              </div>
              <div class="ai-res__key-meta">最后使用 {{ fmtTime(p.lastCheckedAt) }}</div>
            </div>
            <div class="ai-res__key-actions">
              <button v-if="!p.hasApiKey" class="ai-res__btn-primary" @click="goProvider(p.id)">
                配置
              </button>
              <template v-else>
                <button class="ai-res__btn-primary" @click="testConnection(p)">测试连接</button>
                <button class="ai-res__btn-danger" @click="deleteKey(p)">删除</button>
              </template>
            </div>
          </li>
        </ul>
        <div v-else class="ai-res__empty">暂无供应商，无需配置 API Key。</div>
      </section>

      <!-- Card 4: 模型目录 -->
      <section class="ai-res__card">
        <div class="ai-res__card-head">
          <h2 class="ai-res__card-title">模型目录（{{ summary.models.length }}）</h2>
          <button class="ai-res__btn-ghost" @click="goModelManager">管理模型</button>
        </div>
        <ul v-if="summary.models.length" class="ai-res__list">
          <li v-for="m in summary.models" :key="m.id" class="ai-res__model">
            <div class="ai-res__model-main">
              <div class="ai-res__model-title">
                {{ m.displayName }}
                <span class="ai-res__model-name">{{ m.modelName }}</span>
              </div>
              <div class="ai-res__model-desc">
                {{ m.providerName }} · 上下文 {{ fmtTokens(m.contextWindow) }} · 输出
                {{ fmtTokens(m.maxOutputTokens) }}
              </div>
              <div class="ai-res__model-tags">
                <span v-for="cap in m.capabilities" :key="cap" class="ai-res__tag">{{
                  capLabel(cap)
                }}</span>
                <span class="ai-res__tag">
                  输入 ${{ m.inputPrice }}/M · 输出 ${{ m.outputPrice }}/M
                </span>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="ai-res__empty">模型目录为空，请先通过「发现模型」导入。</div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/ai-tokens' as *;

.ai-res {
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

  &__subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: $ai-text-secondary;
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

  &__card {
    margin-bottom: 12px;
    padding: 14px 16px;
    border-radius: $ai-radius-medium;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-card;
  }

  &__card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__card-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $ai-text-primary;
  }

  &__card-meta {
    font-size: 12px;
    color: $ai-text-secondary;
  }

  &__usage-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  &__usage-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px;
    border-radius: $ai-radius-small;
    background: rgba(0, 0, 0, 0.03);
  }

  &__usage-num {
    font-size: 17px;
    font-weight: 700;
    color: $ai-text-primary;
  }

  &__usage-label {
    font-size: 11px;
    color: $ai-text-secondary;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__provider,
  &__key,
  &__model {
    padding: 10px 0;

    & + & {
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }
  }

  &__provider {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    &-main,
    &-actions {
      min-width: 0;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
  }

  &__provider-title,
  &__key-title,
  &__model-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: $ai-text-primary;
  }

  &__provider-desc,
  &__provider-meta,
  &__key-meta,
  &__model-desc {
    margin-top: 3px;
    font-size: 12px;
    color: $ai-text-secondary;
    word-break: break-all;
  }

  &__key {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    &-main,
    &-actions {
      min-width: 0;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
  }

  &__model-name {
    font-size: 11px;
    font-weight: 400;
    color: $ai-text-placeholder;
    font-family: $ai-font-family-mono;
  }

  &__model-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
  }

  &__tag {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    background: rgba(0, 0, 0, 0.05);
    color: $ai-text-secondary;
    font-size: 11px;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    font-size: 11px;
    font-weight: 600;

    &.is-ok {
      background: rgba(52, 168, 83, 0.12);
      color: #34a853;
    }

    &.is-warn {
      background: rgba(251, 188, 5, 0.15);
      color: #b8860b;
    }

    &.is-bad {
      background: rgba(229, 57, 53, 0.12);
      color: #e53935;
    }

    &.is-unknown {
      background: rgba(0, 0, 0, 0.06);
      color: $ai-text-secondary;
    }
  }

  &__btn-primary {
    padding: 6px 12px;
    border: none;
    border-radius: $ai-radius-small;
    background: #4f46e5;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
    }
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

  &__empty {
    padding: 14px 0;
    text-align: center;
    color: $ai-text-secondary;
    font-size: 13px;
  }
}
</style>
