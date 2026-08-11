<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useProviderStore } from "@/stores/provider";

const router = useRouter();
const store = useProviderStore();

const showDisabled = ref(false);

onMounted(() => {
  store.fetchProviders(showDisabled.value);
  store.runHealthCheckAll();
});

function toggleDisabled() {
  showDisabled.value = !showDisabled.value;
  store.fetchProviders(showDisabled.value);
}

function goDetail(id: string) {
  router.push(`/workspace/settings/providers/${id}`);
}

function goCreate() {
  router.push(`/workspace/settings/providers/new`);
}

function goBack() {
  router.push("/workspace/settings");
}

async function handleHealthCheck(id: string) {
  await store.runHealthCheck(id);
}

async function handleDelete(id: string) {
  await store.deleteProvider(id);
}

function healthColor(status: string): string {
  switch (status) {
    case "HEALTHY": return "#07c160";
    case "DEGRADED": return "#ff976a";
    case "UNREACHABLE": return "#ee0a24";
    default: return "#969799";
  }
}

function healthText(status: string): string {
  switch (status) {
    case "HEALTHY": return "健康";
    case "DEGRADED": return "异常";
    case "UNREACHABLE": return "不可达";
    default: return "未知";
  }
}
</script>

<template>
  <div class="provider-list">
    <header class="provider-list__header">
      <button class="provider-list__back" aria-label="返回" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="provider-list__title">供应商管理</h1>
      <button class="provider-list__add" @click="goCreate">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>添加</span>
      </button>
    </header>

    <div class="provider-list__toolbar">
      <label class="provider-list__toggle">
        <input type="checkbox" :checked="showDisabled" @change="toggleDisabled" />
        <span>显示已禁用</span>
      </label>
      <button class="provider-list__refresh" @click="store.runHealthCheckAll()" :disabled="store.healthChecking">
        {{ store.healthChecking ? "检查中..." : "全部检查" }}
      </button>
    </div>

    <main class="provider-list__content">
      <div v-if="store.loading" class="provider-list__loading">
        <div class="provider-list__skeleton" v-for="n in 3" :key="n"></div>
      </div>

      <div v-else-if="store.sortedProviders.length === 0" class="provider-list__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <p>暂无供应商</p>
        <button class="provider-list__empty-btn" @click="goCreate">添加第一个供应商</button>
      </div>

      <div v-else class="provider-list__items">
        <div
          v-for="provider in store.sortedProviders"
          :key="provider.id"
          class="provider-card"
          :class="{ 'provider-card--disabled': !provider.isEnabled }"
          @click="goDetail(provider.id)"
        >
          <div class="provider-card__main">
            <div class="provider-card__info">
              <div class="provider-card__name-row">
                <h3 class="provider-card__name">{{ provider.name }}</h3>
                <span v-if="provider.isBuiltin" class="provider-card__badge">内置</span>
                <span v-if="!provider.isEnabled" class="provider-card__badge provider-card__badge--disabled">已禁用</span>
              </div>
              <p class="provider-card__url">{{ provider.baseUrl }}</p>
              <div class="provider-card__meta">
                <span class="provider-card__protocol">{{ provider.protocol }}</span>
                <span class="provider-card__count">{{ provider._count?.models || 0 }} 个模型</span>
              </div>
            </div>
            <div class="provider-card__health" @click.stop>
              <div
                class="provider-card__status"
                :style="{ background: healthColor(store.getHealth(provider.id)?.status || provider.healthStatus) }"
              >
                {{ healthText(store.getHealth(provider.id)?.status || provider.healthStatus) }}
              </div>
              <button
                class="provider-card__check-btn"
                :disabled="store.healthChecking"
                @click="handleHealthCheck(provider.id)"
              >
                检查
              </button>
            </div>
          </div>
          <div class="provider-card__actions" @click.stop>
            <button class="provider-card__action" @click="goDetail(provider.id)">编辑</button>
            <button
              class="provider-card__action provider-card__action--danger"
              @click="handleDelete(provider.id)"
              :disabled="provider.isBuiltin"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/ai-tokens" as *;

.provider-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $ai-bg;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  &__back {
    width: 32px;
    height: 32px;
    border-radius: $ai-radius-full;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $ai-text-primary;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    margin: 0;
    font-size: $ai-font-size-title;
    font-weight: $ai-font-weight-title;
    color: $ai-text-primary;
  }

  &__add {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-text-primary;
    color: $ai-card-bg;
    font-size: $ai-font-size-aux;
    font-weight: $ai-font-weight-button;
    cursor: pointer;
    white-space: nowrap;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
  }

  &__toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $ai-text-secondary;
    cursor: pointer;
  }

  &__refresh {
    padding: 4px 10px;
    border-radius: $ai-radius-small;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: transparent;
    font-size: 12px;
    color: $ai-text-secondary;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__skeleton {
    height: 80px;
    border-radius: $ai-radius-medium;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: $ai-text-secondary;

    svg { margin-bottom: 12px; opacity: 0.4; }
    p { font-size: 14px; margin: 0 0 16px; }
  }

  &__empty-btn {
    padding: 8px 20px;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-text-primary;
    color: $ai-card-bg;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.provider-card {
  background: $ai-card-bg;
  border-radius: $ai-radius-medium;
  padding: 16px;
  box-shadow: $ai-shadow-card;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.99);
  }

  &--disabled {
    opacity: 0.5;
  }

  &__main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  &__name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $ai-text-primary;
  }

  &__badge {
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(25, 137, 250, 0.1);
    color: #1989fa;
    font-size: 10px;
    font-weight: 500;

    &--disabled {
      background: rgba(150, 151, 153, 0.1);
      color: #969799;
    }
  }

  &__url {
    margin: 0 0 8px;
    font-size: 12px;
    color: $ai-text-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__protocol {
    padding: 1px 6px;
    border-radius: 3px;
    background: $ai-bg;
    font-size: 10px;
    color: $ai-text-secondary;
    font-family: $ai-font-family-mono, monospace;
  }

  &__count {
    font-size: 12px;
    color: $ai-text-secondary;
  }

  &__health {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }

  &__status {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    color: #fff;
  }

  &__check-btn {
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: transparent;
    font-size: 11px;
    color: $ai-text-secondary;
    cursor: pointer;

    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
  }

  &__action {
    padding: 4px 12px;
    border-radius: $ai-radius-small;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: transparent;
    font-size: 12px;
    color: $ai-text-secondary;
    cursor: pointer;

    &--danger {
      color: #ee0a24;
      border-color: rgba(238, 10, 36, 0.2);
    }
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>