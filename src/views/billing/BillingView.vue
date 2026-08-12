<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { showToast } from 'vant'
import {
  billingAPI,
  type BillingPlanDef,
  type BillingSummaryData,
  type InvoiceRecord,
  type ModelPriceRecord,
  type SubscriptionRecord,
  type UsageSummary
} from '@/api/billing'

type TabKey = 'overview' | 'plans' | 'usage' | 'invoices' | 'prices'

const activeTab = ref<TabKey>('overview')
const loading = ref(false)
const errorMsg = ref('')

const summary = ref<BillingSummaryData | null>(null)
const plans = ref<BillingPlanDef[]>([])
const usage = ref<UsageSummary | null>(null)
const invoices = ref<InvoiceRecord[]>([])
const prices = ref<ModelPriceRecord[]>([])
const generating = ref(false)

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'overview', label: '总览' },
  { key: 'plans', label: '套餐' },
  { key: 'usage', label: '用量' },
  { key: 'invoices', label: '账单' },
  { key: 'prices', label: '计价' }
]

const usagePeriod = ref<'month' | 'last' | 'all'>('month')

const periodOptions: Array<{ key: 'month' | 'last' | 'all'; label: string }> = [
  { key: 'month', label: '本月' },
  { key: 'last', label: '上月' },
  { key: 'all', label: '全部' }
]

// ---- 格式化 ----

function fmtTokens(n: number): string {
  if (!n) return '0'
  if (n >= 1e8) return (n / 1e8).toFixed(2) + ' 亿'
  if (n >= 1e4) return (n / 1e4).toFixed(1) + ' 万'
  return String(n)
}

function fmtCents(cents?: number): string {
  return ((cents ?? 0) / 100).toFixed(2) + ' 元'
}

function fmtDate(iso?: string): string {
  if (!iso) return '-'
  return iso.slice(0, 10)
}

function fmtTime(iso?: string): string {
  if (!iso) return '-'
  return iso.slice(0, 16).replace('T', ' ')
}

const currentSubscription = computed<SubscriptionRecord | null>(
  () => summary.value?.subscription ?? null
)
const currentPlanCode = computed<string>(() => {
  const plan = summary.value?.quota?.plan
  return plan?.code ?? currentSubscription.value?.planId ?? ''
})

const quotaPercent = computed(() => {
  const quota = summary.value?.quota
  if (!quota?.limited || !quota.tokensPerMonth) return 0
  return Math.min(100, Math.round((quota.usedTokens / quota.tokensPerMonth) * 100))
})

const usageParams = computed(() => {
  const now = new Date()
  if (usagePeriod.value === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from: start.toISOString().slice(0, 10) }
  }
  if (usagePeriod.value === 'last') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) }
  }
  return {}
})

// ---- 加载 ----

async function loadAll() {
  loading.value = true
  errorMsg.value = ''
  try {
    const [summaryRes, plansRes, usageRes, invoicesRes, pricesRes] = await Promise.all([
      billingAPI.summary(),
      billingAPI.plans(),
      billingAPI.usage(usageParams.value),
      billingAPI.invoices(1, 20),
      billingAPI.prices(1, 50)
    ])
    summary.value = summaryRes.data
    plans.value = plansRes.data?.items ?? []
    usage.value = usageRes.data
    invoices.value = invoicesRes.data?.items ?? []
    prices.value = pricesRes.data?.items ?? []
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadAll)

function changePeriod(key: 'month' | 'last' | 'all') {
  usagePeriod.value = key
  reloadUsage()
}

async function reloadUsage() {
  try {
    const res = await billingAPI.usage(usageParams.value)
    usage.value = res.data
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  }
}

// ---- 订阅 ----

async function subscribe(plan: BillingPlanDef) {
  if (plan.code === currentPlanCode.value) return
  const action =
    plan.priceMonthlyCents > 0
      ? `订阅「${plan.name}」（${fmtCents(plan.priceMonthlyCents)}/月）`
      : `切换到「${plan.name}」`
  if (!window.confirm(`确认${action}？`)) return
  try {
    await billingAPI.subscribe(plan.code)
    showToast('订阅成功')
    await loadAll()
  } catch (e) {
    errorMsg.value = (e as Error).message || '订阅失败'
  }
}

async function unsubscribe() {
  if (!currentSubscription.value) return
  if (!window.confirm('确认取消当前订阅？取消后不再受配额限制，但将失去套餐权益。')) return
  try {
    await billingAPI.unsubscribe()
    showToast('已取消订阅')
    await loadAll()
  } catch (e) {
    errorMsg.value = (e as Error).message || '取消失败'
  }
}

// ---- 账单 ----

async function generateInvoice() {
  if (!window.confirm('确认生成月度账单？同一月份重复生成会返回已有账单（幂等）。')) return
  generating.value = true
  try {
    const res = await billingAPI.generateInvoice()
    showToast(`账单已生成：${fmtCents(res.data.amountCents)}`)
    await loadAll()
  } catch (e) {
    errorMsg.value = (e as Error).message || '生成失败'
  } finally {
    generating.value = false
  }
}

const sourceLabels: Record<string, string> = {
  chat: '对话',
  agent: 'Agent',
  workflow: '工作流',
  api: 'API'
}

const invoiceStatusLabels: Record<string, string> = {
  draft: '待支付',
  paid: '已支付',
  void: '已作废'
}
</script>

<template>
  <div class="billing-view">
    <header class="billing-view__header">
      <h1 class="billing-view__title">计费中心</h1>
      <button class="billing-view__btn-icon" aria-label="刷新" @click="loadAll">
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

    <nav class="billing-view__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="billing-view__tab"
        :class="{ 'is-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div v-if="errorMsg" class="billing-view__error">{{ errorMsg }}</div>
    <div v-if="loading" class="billing-view__loading">加载中...</div>

    <!-- ==================== 总览 ==================== -->
    <section v-if="activeTab === 'overview' && summary" class="billing-view__panel">
      <div class="billing-view__card">
        <div class="billing-view__card-title">当前订阅</div>
        <div v-if="currentSubscription" class="billing-view__sub-info">
          <span class="billing-view__plan-name">
            {{ summary.quota?.plan?.name ?? '套餐' }}
          </span>
          <span class="billing-view__badge is-active">已订阅</span>
          <div class="billing-view__sub-meta">
            开始于 {{ fmtDate(currentSubscription.startedAt) }} · 配额重置
            {{ fmtDate(currentSubscription.quotaResetAt) }}
          </div>
          <button class="billing-view__btn-danger" @click="unsubscribe">取消订阅</button>
        </div>
        <div v-else class="billing-view__empty">
          当前未订阅套餐，使用不受配额限制。可前往「套餐」页选择订阅。
        </div>
      </div>

      <div v-if="summary.quota?.limited" class="billing-view__card">
        <div class="billing-view__card-title">本月配额</div>
        <div class="billing-view__quota">
          <div class="billing-view__quota-bar">
            <div class="billing-view__quota-fill" :style="{ width: quotaPercent + '%' }" />
          </div>
          <div class="billing-view__quota-text">
            已用 {{ fmtTokens(summary.quota.usedTokens) }} /
            {{ fmtTokens(summary.quota.tokensPerMonth ?? 0) }} tokens（{{ quotaPercent }}%）
          </div>
        </div>
      </div>

      <div v-if="usage" class="billing-view__card">
        <div class="billing-view__card-title">本月用量</div>
        <div class="billing-view__stat-grid">
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ usage.requests }}</span>
            <span class="billing-view__stat-label">请求数</span>
          </div>
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ fmtTokens(usage.totalTokens) }}</span>
            <span class="billing-view__stat-label">总 tokens</span>
          </div>
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ fmtCents(usage.costCents) }}</span>
            <span class="billing-view__stat-label">成本</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 套餐 ==================== -->
    <section v-if="activeTab === 'plans'" class="billing-view__panel">
      <div class="billing-view__plans">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="billing-view__plan"
          :class="{ 'is-current': plan.code === currentPlanCode }"
        >
          <div class="billing-view__plan-name">{{ plan.name }}</div>
          <div class="billing-view__plan-price">
            <span class="billing-view__plan-amount">{{ fmtCents(plan.priceMonthlyCents) }}</span>
            <span class="billing-view__plan-period">/月</span>
          </div>
          <div class="billing-view__plan-desc">{{ plan.description }}</div>
          <ul class="billing-view__plan-features">
            <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
          </ul>
          <button
            v-if="plan.code !== currentPlanCode"
            class="billing-view__btn-primary"
            @click="subscribe(plan)"
          >
            {{ plan.priceMonthlyCents > 0 ? '订阅' : '免费使用' }}
          </button>
          <span v-else class="billing-view__badge is-active">当前套餐</span>
        </div>
      </div>
    </section>

    <!-- ==================== 用量 ==================== -->
    <section v-if="activeTab === 'usage'" class="billing-view__panel">
      <div class="billing-view__row-actions">
        <div class="billing-view__seg">
          <button
            v-for="opt in periodOptions"
            :key="opt.key"
            class="billing-view__seg-btn"
            :class="{ 'is-active': usagePeriod === opt.key }"
            @click="changePeriod(opt.key)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div v-if="usage" class="billing-view__card">
        <div class="billing-view__stat-grid">
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ usage.requests }}</span>
            <span class="billing-view__stat-label">请求数</span>
          </div>
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ fmtTokens(usage.inputTokens) }}</span>
            <span class="billing-view__stat-label">输入 tokens</span>
          </div>
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ fmtTokens(usage.outputTokens) }}</span>
            <span class="billing-view__stat-label">输出 tokens</span>
          </div>
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ fmtTokens(usage.cachedTokens) }}</span>
            <span class="billing-view__stat-label">缓存 tokens</span>
          </div>
          <div class="billing-view__stat">
            <span class="billing-view__stat-num">{{ fmtCents(usage.costCents) }}</span>
            <span class="billing-view__stat-label">成本</span>
          </div>
        </div>
      </div>

      <div v-if="usage && Object.keys(usage.bySource).length" class="billing-view__card">
        <div class="billing-view__card-title">按来源</div>
        <div class="billing-view__breakdown">
          <div v-for="(item, key) in usage.bySource" :key="key" class="billing-view__break-row">
            <span>{{ sourceLabels[key] ?? key }}</span>
            <span
              >{{ item.requests }} 次 · {{ fmtTokens(item.totalTokens) }} ·
              {{ fmtCents(item.costCents) }}</span
            >
          </div>
        </div>
      </div>

      <div v-if="usage && Object.keys(usage.byModel).length" class="billing-view__card">
        <div class="billing-view__card-title">按模型</div>
        <div class="billing-view__breakdown">
          <div v-for="(item, key) in usage.byModel" :key="key" class="billing-view__break-row">
            <span>{{ key }}</span>
            <span
              >{{ item.requests }} 次 · {{ fmtTokens(item.totalTokens) }} ·
              {{ fmtCents(item.costCents) }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 账单 ==================== -->
    <section v-if="activeTab === 'invoices'" class="billing-view__panel">
      <div class="billing-view__row-actions">
        <button class="billing-view__btn-primary" :disabled="generating" @click="generateInvoice">
          {{ generating ? '生成中...' : '+ 生成本月账单' }}
        </button>
      </div>

      <ul class="billing-view__list">
        <li v-for="item in invoices" :key="item.id" class="billing-view__item">
          <div class="billing-view__item-main">
            <div class="billing-view__item-title">
              {{ fmtDate(item.periodStart) }} ~ {{ fmtDate(item.periodEnd) }}
              <span class="billing-view__badge" :class="`is-${item.status}`">
                {{ invoiceStatusLabels[item.status] ?? item.status }}
              </span>
            </div>
            <div class="billing-view__item-desc">
              {{ item.lineItems.length }} 个模型条目 · 生成于 {{ fmtTime(item.createdAt) }}
            </div>
          </div>
          <div class="billing-view__item-amount">{{ fmtCents(item.amountCents) }}</div>
        </li>
      </ul>
      <div v-if="!invoices.length && !loading" class="billing-view__empty">
        暂无账单，点击上方按钮生成。
      </div>
    </section>

    <!-- ==================== 计价 ==================== -->
    <section v-if="activeTab === 'prices'" class="billing-view__panel">
      <div class="billing-view__card">
        <div class="billing-view__card-title">模型计价（每百万 tokens）</div>
        <div v-if="!prices.length && !loading" class="billing-view__empty">
          暂无计价配置，未配置的模型按默认 0 计费。
        </div>
        <ul class="billing-view__list">
          <li v-for="item in prices" :key="item.id" class="billing-view__item">
            <div class="billing-view__item-main">
              <div class="billing-view__item-title">
                {{ item.modelId }}
                <span
                  class="billing-view__badge"
                  :class="item.enabled ? 'is-active' : 'is-disabled'"
                >
                  {{ item.enabled ? '启用' : '停用' }}
                </span>
              </div>
              <div class="billing-view__item-desc">
                输入 ¥{{ (item.inputPerMillionCents / 100).toFixed(2) }} · 输出 ¥{{
                  (item.outputPerMillionCents / 100).toFixed(2)
                }}
                · 缓存折扣 {{ Math.round(item.cachedDiscount * 100) }}%
              </div>
            </div>
            <div class="billing-view__item-amount">{{ item.currency }}</div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/ai-tokens' as *;

.billing-view {
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

  &__tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    overflow-x: auto;
  }

  &__tab {
    flex-shrink: 0;
    padding: 7px 14px;
    border: none;
    border-radius: $ai-radius-full;
    background: $ai-card-bg;
    color: $ai-text-secondary;
    font-size: $ai-font-size-body;
    cursor: pointer;
    box-shadow: $ai-shadow-card;

    &.is-active {
      background: #4f46e5;
      color: #fff;
      font-weight: 600;
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

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__card {
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
  }

  &__row-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__seg {
    display: inline-flex;
    gap: 4px;
    padding: 3px;
    border-radius: $ai-radius-full;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-card;
  }

  &__seg-btn {
    padding: 5px 12px;
    border: none;
    border-radius: $ai-radius-full;
    background: transparent;
    color: $ai-text-secondary;
    font-size: 13px;
    cursor: pointer;

    &.is-active {
      background: #4f46e5;
      color: #fff;
      font-weight: 600;
    }
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__btn-danger {
    margin-top: 10px;
    padding: 6px 12px;
    border: 1px solid rgba(229, 57, 53, 0.4);
    border-radius: $ai-radius-small;
    background: transparent;
    color: #e53935;
    font-size: 13px;
    cursor: pointer;
  }

  &__empty {
    padding: 20px 0;
    text-align: center;
    color: $ai-text-secondary;
    font-size: 14px;
  }

  // ---- 订阅 ----
  &__sub-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  &__plan-name {
    font-size: 17px;
    font-weight: 700;
    color: $ai-text-primary;
  }

  &__sub-meta {
    font-size: 13px;
    color: $ai-text-secondary;
  }

  // ---- 配额 ----
  &__quota-bar {
    height: 8px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  &__quota-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #4f46e5, #818cf8);
    transition: width 0.3s;
  }

  &__quota-text {
    margin-top: 8px;
    font-size: 13px;
    color: $ai-text-secondary;
  }

  // ---- 统计 ----
  &__stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 4px;
    border-radius: $ai-radius-small;
    background: rgba(0, 0, 0, 0.03);

    &-num {
      font-size: 16px;
      font-weight: 700;
      color: $ai-text-primary;
    }

    &-label {
      font-size: 12px;
      color: $ai-text-secondary;
    }
  }

  // ---- 套餐卡片 ----
  &__plans {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__plan {
    padding: 16px;
    border-radius: $ai-radius-medium;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-card;
    border: 2px solid transparent;

    &.is-current {
      border-color: #4f46e5;
    }

    &-name {
      font-size: 16px;
      font-weight: 700;
      color: $ai-text-primary;
    }

    &-price {
      margin: 8px 0 4px;
      color: #4f46e5;
    }

    &-amount {
      font-size: 24px;
      font-weight: 800;
    }

    &-period {
      font-size: 13px;
      color: $ai-text-secondary;
    }

    &-desc {
      font-size: 13px;
      color: $ai-text-secondary;
    }

    &-features {
      margin: 10px 0;
      padding: 0;
      list-style: none;

      li {
        padding: 3px 0;
        font-size: 13px;
        color: $ai-text-primary;

        &::before {
          content: '✓ ';
          color: #4f46e5;
        }
      }
    }
  }

  // ---- 明细列表 ----
  &__breakdown {
    display: flex;
    flex-direction: column;
  }

  &__break-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
    font-size: 13px;
    color: $ai-text-primary;

    & + & {
      border-top: 1px solid rgba(0, 0, 0, 0.04);
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

    &-amount {
      font-size: 15px;
      font-weight: 700;
      color: $ai-text-primary;
      white-space: nowrap;
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

    &.is-paid {
      background: rgba(52, 168, 83, 0.12);
      color: #34a853;
    }

    &.is-draft {
      background: rgba(251, 188, 5, 0.15);
      color: #b8860b;
    }

    &.is-disabled {
      background: rgba(0, 0, 0, 0.06);
      color: $ai-text-secondary;
    }
  }
}
</style>
