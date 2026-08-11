<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProviderStore } from "@/stores/provider";
import { showToast, showDialog } from "vant";
import type { DiscoveredModel, Provider } from "@/api/provider";

const route = useRoute();
const router = useRouter();
const store = useProviderStore();

const providerId = computed(() => route.params.id as string);
const checking = ref(false);

onMounted(async () => {
  if (providerId.value) {
    await store.fetchProvider(providerId.value);
    await store.runHealthCheck(providerId.value);
  }
});

const provider = computed<Provider | null>(() => store.currentProvider);

const models = computed(() => {
  const p = provider.value as any;
  return p?.models || [];
});

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

function formatCapabilities(caps: unknown): string[] {
  if (!caps) return [];
  try { return JSON.parse(caps as string); } catch { return []; }
}

async function handleHealthCheck() {
  if (!providerId.value) return;
  checking.value = true;
  try {
    const result = await store.runHealthCheck(providerId.value);
    if (result) {
      const msg = healthText(result.status) + " 耗时 " + result.latencyMs + "ms";
      showToast(msg);
    }
  } finally {
    checking.value = false;
  }
}

function goEdit() {
  router.push("/workspace/settings/providers/" + providerId.value + "/edit");
}

async function handleDelete() {
  if (!provider.value) return;
  try {
    await showDialog({
      title: "确认删除",
      message: '删除供应商"' + provider.value.name + '"将同时删除其下所有模型，确定继续？',
      confirmButtonText: "删除",
      confirmButtonColor: "#ee0a24",
    });
    await store.deleteProvider(providerId.value);
    showToast("供应商已删除");
    router.replace("/workspace/settings/providers");
  } catch (e) {
    /* cancelled */
  }
}

function goBack() {
  router.push("/workspace/settings/providers");
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "无";
  try { return new Date(dateStr).toLocaleString("zh-CN"); } catch { return dateStr; }
}

const discoveries = ref<DiscoveredModel[]>([]);
const discoverOpen = ref(false);
const discovering = ref(false);
const importing = ref(false);
const selectedModels = ref<string[]>([]);

async function handleDiscover() {
  if (!providerId.value) return;
  discoveries.value = [];
  selectedModels.value = [];
  discoverOpen.value = true;
  discovering.value = true;
  try {
    const result = await store.discoverModels(providerId.value);
    if (!result) return;
    if (result.error) {
      discoverOpen.value = false;
      showToast("获取失败: " + result.error);
      return;
    }
    discoveries.value = result.models || [];
    selectedModels.value = discoveries.value
      .filter((m) => !m.exists)
      .map((m) => m.modelName);
  } finally {
    discovering.value = false;
  }
}

function isSelected(modelName: string): boolean {
  return selectedModels.value.includes(modelName);
}

function toggleModel(m: DiscoveredModel): void {
  if (m.exists || importing.value) return;
  const idx = selectedModels.value.indexOf(m.modelName);
  if (idx >= 0) {
    selectedModels.value.splice(idx, 1);
  } else {
    selectedModels.value.push(m.modelName);
  }
}

async function handleImport() {
  if (!providerId.value || selectedModels.value.length === 0) return;
  importing.value = true;
  try {
    const result = await store.importModels(providerId.value, selectedModels.value);
    if (result) {
      showToast("导入成功 " + result.created + " 个" + (result.skipped ? "（跳过 " + result.skipped + " 个已存在）" : ""));
    }
    discoverOpen.value = false;
    await store.fetchProvider(providerId.value);
  } finally {
    importing.value = false;
  }
}
</script>

<template>
  <div class="provider-detail">
    <header class="provider-detail__header">
      <button class="provider-detail__back" aria-label="返回" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="provider-detail__title">供应商详情</h1>
      <button class="provider-detail__edit" @click="goEdit">编辑</button>
    </header>

    <main class="provider-detail__content">
      <div v-if="store.loading" class="provider-detail__loading">
        <div class="provider-detail__skeleton" v-for="n in 4" :key="n"></div>
      </div>
      <div v-else-if="!provider" class="provider-detail__empty">
        <p>供应商不存在</p>
        <button class="provider-detail__empty-btn" @click="goBack">返回列表</button>
      </div>
      <template v-else>
        <section class="provider-detail__card">
          <div class="provider-detail__card-header">
            <h2 class="provider-detail__name">{{ provider.name }}</h2>
            <span v-if="provider.isBuiltin" class="provider-detail__badge">内置</span>
            <span v-if="!provider.isEnabled" class="provider-detail__badge provider-detail__badge--disabled">已禁用</span>
          </div>
          <div class="provider-detail__field">
            <span class="provider-detail__label">Base URL</span>
            <span class="provider-detail__value provider-detail__value--mono">{{ provider.baseUrl }}</span>
          </div>
          <div class="provider-detail__field">
            <span class="provider-detail__label">协议类型</span>
            <span class="provider-detail__value">{{ provider.protocol }}</span>
          </div>
          <div class="provider-detail__field">
            <span class="provider-detail__label">认证方式</span>
            <span class="provider-detail__value">{{ provider.authType }}</span>
          </div>
          <div class="provider-detail__field">
            <span class="provider-detail__label">健康状态</span>
            <span class="provider-detail__status" :style="{ background: healthColor(store.getHealth(provider.id)?.status || provider.healthStatus) }">
              {{ healthText(store.getHealth(provider.id)?.status || provider.healthStatus) }}
            </span>
          </div>
          <div class="provider-detail__field">
            <span class="provider-detail__label">最后检查</span>
            <span class="provider-detail__value">{{ formatDate(provider.lastCheckedAt) }}</span>
          </div>
          <div class="provider-detail__actions">
            <button class="provider-detail__action provider-detail__action--primary" :disabled="checking" @click="handleHealthCheck">
              {{ checking ? "检查中..." : "健康检查" }}
            </button>
            <button class="provider-detail__action provider-detail__action--danger" :disabled="provider.isBuiltin" @click="handleDelete">
              删除
            </button>
          </div>
        </section>

        <section class="provider-detail__models">
          <div class="provider-detail__section-head">
            <h3 class="provider-detail__section-title">模型列表 ({{ models.length }})</h3>
            <button class="provider-detail__discover" type="button" :disabled="discovering" @click="handleDiscover">
              <svg
                v-if="!discovering"
                class="provider-detail__discover-icon"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <polyline points="8 17 12 21 16 17" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
              </svg>
              <svg
                v-else
                class="provider-detail__discover-icon provider-detail__discover-icon--spin"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>{{ discovering ? "正在获取" : "从上游获取" }}</span>
            </button>
          </div>
          <div v-if="models.length === 0" class="provider-detail__models-empty">暂无模型</div>
          <div v-else class="provider-detail__models-list">
            <div v-for="model in models" :key="model.id" class="model-item">
              <div class="model-item__info">
                <div class="model-item__name-row">
                  <span class="model-item__name">{{ model.displayName || model.modelName }}</span>
                  <span v-if="model.isDefault" class="model-item__tag model-item__tag--default">默认</span>
                  <span v-if="model.isFavorite" class="model-item__tag model-item__tag--fav">收藏</span>
                </div>
                <span class="model-item__id">{{ model.modelName }}</span>
                <div v-if="formatCapabilities(model.capabilities).length" class="model-item__caps">
                  <span v-for="cap in formatCapabilities(model.capabilities)" :key="cap" class="model-item__cap">{{ cap }}</span>
                </div>
                <div class="model-item__meta">
                  <span>上下文: {{ (model.contextWindow / 1000).toFixed(0) }}K</span>
                  <span v-if="model.temperature != null">温度: {{ model.temperature }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
    <van-popup
      v-model:show="discoverOpen"
      position="bottom"
      round
      :overlay-style="{ background: 'rgba(0, 0, 0, 0.45)' }"
      class="mpop"
    >
      <div class="mpop__sheet">
        <div class="mpop__handle"></div>
        <div class="mpop__header">
          <div class="mpop__heading">
            <h3 class="mpop__title">从上游获取模型</h3>
            <p class="mpop__subtitle">从供应商 API 获取最新模型列表</p>
          </div>
          <button class="mpop__close" type="button" aria-label="取消" @click="discoverOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div v-if="discovering" class="mpop__loading">
          <div class="mpop__spinner">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </div>
          <p class="mpop__loading-title">正在连接供应商...</p>
          <p class="mpop__loading-sub">正在同步模型列表</p>
        </div>

        <div v-else-if="discoveries.length === 0" class="mpop__empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="8 17 12 21 16 17" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
          </svg>
          <p class="mpop__empty-title">没有可导入的模型</p>
          <p class="mpop__empty-sub">上游没有返回模型，请检查供应商配置后重试</p>
        </div>

        <div v-else class="mpop__list">
          <div class="mpop__count">共 {{ discoveries.length }} 个模型</div>
          <div class="mpop__cards">
            <div
              v-for="m in discoveries"
              :key="m.modelName"
              class="mpop-card"
              :class="{
                'mpop-card--selected': isSelected(m.modelName),
                'mpop-card--disabled': m.exists || importing,
              }"
              @click="toggleModel(m)"
            >
              <div class="mpop-card__radio">
                <span class="mpop-card__dot"></span>
              </div>
              <div class="mpop-card__body">
                <span class="mpop-card__name">{{ m.displayName || m.modelName }}</span>
                <span class="mpop-card__id">{{ m.modelName }}</span>
              </div>
              <span class="mpop-card__badge" :class="{ 'mpop-card__badge--imported': m.exists }">
                <svg v-if="m.exists" class="mpop-card__badge-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ m.exists ? "已导入" : "未导入" }}
              </span>
            </div>
          </div>
        </div>

        <div class="mpop__footer">
          <p class="mpop__footer-text">已选择 {{ selectedModels.length }} 个模型</p>
          <button
            class="mpop__import"
            type="button"
            :disabled="importing || selectedModels.length === 0"
            @click="handleImport"
          >
            <span v-if="importing" class="mpop__import-spinner"></span>
            {{ importing ? "导入中..." : "导入模型" }}
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/ai-tokens" as *;

.provider-detail {
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
  &__title { flex: 1; margin: 0; font-size: $ai-font-size-title; font-weight: $ai-font-weight-title; color: $ai-text-primary; }
  &__edit { padding: 6px 16px; border-radius: $ai-radius-full; border: none; background: $ai-text-primary; color: $ai-card-bg; font-size: $ai-font-size-aux; font-weight: $ai-font-weight-button; cursor: pointer; }
  &__content { flex: 1; overflow-y: auto; padding: 16px; }
  &__loading { display: flex; flex-direction: column; gap: 12px; }
  &__skeleton { height: 60px; border-radius: $ai-radius-medium; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  &__empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: $ai-text-secondary; gap: 16px; }
  &__empty-btn { padding: 8px 20px; border-radius: $ai-radius-full; border: none; background: $ai-text-primary; color: $ai-card-bg; font-size: 13px; font-weight: 500; cursor: pointer; }
  &__card { background: $ai-card-bg; border-radius: $ai-radius-medium; padding: 16px; box-shadow: $ai-shadow-card; margin-bottom: 16px; }
  &__card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
  &__name { margin: 0; font-size: 18px; font-weight: 600; color: $ai-text-primary; }
  &__badge { padding: 1px 6px; border-radius: 4px; background: rgba(25, 137, 250, 0.1); color: #1989fa; font-size: 10px; font-weight: 500; &--disabled { background: rgba(150, 151, 153, 0.1); color: #969799; } }
  &__field { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.04); &:last-of-type { border-bottom: none; } }
  &__label { font-size: 13px; color: $ai-text-secondary; flex-shrink: 0; }
  &__value { font-size: 13px; color: $ai-text-primary; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; &--mono { font-family: monospace; font-size: 12px; } }
  &__status { padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 500; color: #fff; }
  &__actions { display: flex; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.04); }
  &__action { flex: 1; padding: 10px; border-radius: $ai-radius-small; border: 1px solid rgba(0, 0, 0, 0.08); background: transparent; font-size: 14px; font-weight: 500; color: $ai-text-secondary; cursor: pointer; &--primary { border-color: $ai-text-primary; color: $ai-text-primary; } &--danger { border-color: rgba(238, 10, 36, 0.2); color: #ee0a24; } &:disabled { opacity: 0.5; cursor: not-allowed; } }
  &__models { background: $ai-card-bg; border-radius: $ai-radius-medium; padding: 16px; box-shadow: $ai-shadow-card; }
  &__section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  &__section-title { margin: 0; font-size: 15px; font-weight: 600; color: $ai-text-primary; }
  &__discover {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 120px;
    height: 38px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid #E8E8E8;
    background: $ai-button-bg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    font-family: $ai-font-family;
    font-size: $ai-font-size-button;
    font-weight: $ai-font-weight-button;
    color: #333333;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #F7F9FC;
      border-color: #D8E4FF;
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }

    &:disabled {
      background: #F5F5F5;
      border-color: #F0F0F0;
      box-shadow: none;
      color: #B5B5B5;
      cursor: not-allowed;
    }
  }
  &__discover-icon {
    flex-shrink: 0;
    color: #666666;
  }
  &__discover-icon--spin {
    animation: discover-spin 0.8s linear infinite;
  }
  &__models-empty { padding: 24px 0; text-align: center; font-size: 13px; color: $ai-text-secondary; }
  &__models-list { display: flex; flex-direction: column; gap: 1px; background: rgba(0, 0, 0, 0.04); border-radius: $ai-radius-small; overflow: hidden; }
}

@keyframes discover-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.model-item {
  background: $ai-card-bg; padding: 12px 14px;
  &__info { display: flex; flex-direction: column; gap: 4px; }
  &__name-row { display: flex; align-items: center; gap: 6px; }
  &__name { font-size: 14px; font-weight: 500; color: $ai-text-primary; }
  &__tag { padding: 1px 5px; border-radius: 3px; font-size: 10px; font-weight: 500; &--default { background: rgba(7, 193, 96, 0.1); color: #07c160; } &--fav { background: rgba(255, 151, 106, 0.1); color: #ff976a; } }
  &__id { font-size: 12px; color: $ai-text-secondary; font-family: monospace; }
  &__caps { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
  &__cap { padding: 1px 6px; border-radius: 3px; background: $ai-bg; font-size: 10px; color: $ai-text-secondary; }
  &__meta { display: flex; gap: 12px; margin-top: 4px; font-size: 11px; color: $ai-text-secondary; }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ---------- 从上游获取模型 Bottom Sheet ---------- */
.mpop {
  --van-duration-base: 300ms;
  --van-ease-out: cubic-bezier(0.32, 0.72, 0, 1);
  --van-ease-in: cubic-bezier(0.32, 0.72, 0, 1);
  --van-popup-round-radius: 24px;
  --van-popup-background: #ffffff;
  --van-overlay-background: rgba(0, 0, 0, 0.45);
}

.mpop__sheet {
  display: flex;
  flex-direction: column;
  height: 70vh;
  max-height: 70vh;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
}

.mpop__handle {
  width: 36px;
  height: 4px;
  margin: 12px auto 0;
  border-radius: 4px;
  background: #d1d5db;
  flex-shrink: 0;
}

.mpop__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 12px;
  flex-shrink: 0;
}

.mpop__heading {
  min-width: 0;
}

.mpop__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.mpop__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.mpop__close {
  width: 32px;
  height: 32px;
  margin-left: 12px;
  border: none;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, color 0.2s ease;

  &:active {
    background: #e5e7eb;
    color: #374151;
  }
}

.mpop__loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px;
  color: #6b7280;
}

.mpop__spinner {
  color: #2563eb;
  margin-bottom: 8px;

  svg {
    animation: mpop-rotate 0.9s linear infinite;
  }
}

.mpop__loading-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.mpop__loading-sub {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.mpop__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px;
  color: #c0c4cc;
}

.mpop__empty-title {
  margin: 8px 0 0;
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.mpop__empty-sub {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.mpop__list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 20px 12px;
  -webkit-overflow-scrolling: touch;
}

.mpop__count {
  font-size: 12px;
  color: #9ca3af;
  margin: 2px 2px 10px;
}

.mpop__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mpop-card {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 92px;
  padding: 0 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:active:not(.mpop-card--disabled) {
    transform: scale(0.99);
  }

  &--selected {
    border-color: #2563eb;
    background: #eff6ff;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.mpop-card__radio {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.mpop-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s ease;
}

.mpop-card--selected .mpop-card__radio {
  border-color: #2563eb;
}

.mpop-card--selected .mpop-card__dot {
  background: #2563eb;
}

.mpop-card--disabled .mpop-card__radio {
  border-color: #d1d5db;
}

.mpop-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mpop-card__name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mpop-card__id {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mpop-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
  color: #6b7280;
  flex-shrink: 0;

  &--imported {
    background: #dcfce7;
    color: #16a34a;
  }
}

.mpop-card__badge-icon {
  flex-shrink: 0;
}

.mpop__footer {
  flex-shrink: 0;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mpop__footer-text {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}

.mpop__import {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #2563eb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  font-family: $ai-font-family;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:active:not(:disabled) {
    background: #1d4ed8;
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.mpop__import-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: mpop-rotate 0.7s linear infinite;
}

@keyframes mpop-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 覆盖 vant 弹层容器：不撑满全屏 */
.mpop {
  max-height: 70vh;
}

</style>
