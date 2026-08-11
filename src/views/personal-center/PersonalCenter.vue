<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import PageHeader from "./components/PageHeader.vue";
import EmptyState from "./components/EmptyState.vue";
import CreateFab from "./components/CreateFab.vue";
import { agentAPI } from "@/api/agent";
import type { AgentRunSummary } from "@/api/agent";
import { useConversationStore } from "@/stores/conversation";
import { useModelStore } from "@/stores/model";
import { showToast } from "vant";

const router = useRouter();
const conversationStore = useConversationStore();
const modelStore = useModelStore();

const mode = ref<"all" | "cloud">("all");
const list = ref<AgentRunSummary[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 20;
const loading = ref(false);
const loadingMore = ref(false);
const restoringId = ref("");

// ---- 搜索 ----
const searchOpen = ref(false);
const searchQ = ref("");
const searchResults = ref<AgentRunSummary[]>([]);
const searchLoading = ref(false);
const searchDone = ref(false);
let searchTimer: ReturnType<typeof setTimeout> | null = null;
let searchSeq = 0;

const empty = computed(() => !loading.value && list.value.length === 0);

async function fetchList(append = false) {
  if (append) loadingMore.value = true;
  else loading.value = true;
  try {
    const res = await agentAPI.history(page.value, pageSize);
    if (res.code === 0) {
      total.value = res.data.total;
      list.value = append ? [...list.value, ...res.data.list] : res.data.list;
      list.value.forEach((r) => conversationStore.touchConversation(r.id, r.task, r.modelId));
    }
  } catch {
    showToast("加载任务失败");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function loadMore() {
  if (list.value.length >= total.value || loadingMore.value || loading.value) return;
  page.value += 1;
  fetchList(true);
}

function refresh() {
  page.value = 1;
  fetchList(false);
}

function onScroll(e: Event) {
  const el = e.target as HTMLElement;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
    loadMore();
  }
}

// ---- 模式切换（全部任务 / 云端） ----
function onModeChange(m: "all" | "cloud") {
  mode.value = m;
  refresh();
}

// ---- 恢复会话 ----
function modelLabel(modelId: string): string {
  const m = (modelStore.models as any[]).find((x) => String(x.id) === modelId);
  return m?.displayName || m?.modelName || modelId.slice(0, 8);
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

async function openRun(r: AgentRunSummary) {
  if (restoringId.value) return;
  restoringId.value = r.id;
  try {
    conversationStore.restore(r.id, r.task, r.modelId);
    void router.push("/home");
  } finally {
    restoringId.value = "";
  }
}

// ---- 新建任务 ----
function createTask() {
  conversationStore.newConversation();
  void router.push("/home");
}

// ---- 个人中心 ----
function openAvatar() {
  void router.push("/me");
}

// ---- 搜索 ----
function openSearch() {
  searchQ.value = "";
  searchResults.value = [];
  searchDone.value = false;
  searchOpen.value = true;
  setTimeout(() => {
    const input = document.querySelector<HTMLInputElement>(".pc-search__input");
    input?.focus();
  }, 60);
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => runSearch(), 300);
}

async function runSearch() {
  const q = searchQ.value.trim();
  const seq = ++searchSeq;
  if (!q) {
    searchResults.value = [];
    searchDone.value = false;
    return;
  }
  searchLoading.value = true;
  try {
    const res = await conversationStore.searchConversation(q, 1, 20);
    if (seq !== searchSeq) return;
    searchResults.value = res.list;
    searchDone.value = true;
  } catch {
    if (seq === searchSeq) {
      searchResults.value = [];
      searchDone.value = true;
      showToast("搜索失败");
    }
  } finally {
    if (seq === searchSeq) searchLoading.value = false;
  }
}

onMounted(() => {
  fetchList(false);
  if (modelStore.models.length === 0) {
    modelStore.fetchModels({ page: 1, pageSize: 50 });
  }
});

watch(searchOpen, (v) => {
  if (!v && searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }
});
</script>

<template>
  <div class="personal-center">
    <PageHeader
      @update:mode="onModeChange"
      @open-search="openSearch"
      @open-avatar="openAvatar"
    />
    <main
      class="personal-center__content"
      @scroll.passive="onScroll"
    >
      <div v-if="loading" class="pc-list pc-list--loading">
        <div class="pc-skeleton" v-for="n in 4" :key="n"></div>
      </div>

      <div v-else-if="empty" class="pc-empty-wrap">
        <EmptyState />
      </div>

      <div v-else class="pc-list">
        <div
          v-for="r in list"
          :key="r.id"
          class="pc-task"
          :class="{ 'pc-task--restoring': restoringId === r.id }"
          @click="openRun(r)"
        >
          <div class="pc-task__main">
            <div class="pc-task__head">
              <span class="pc-task__title">{{ r.task || "未命名任务" }}</span>
              <span class="pc-task__dot" :class="`pc-task__dot--${r.status}`"></span>
            </div>
            <div class="pc-task__meta">
              <span class="pc-task__model">{{ modelLabel(r.modelId) }}</span>
              <span class="pc-task__time">{{ formatTime(r.createdAt) }}</span>
            </div>
          </div>
          <div class="pc-task__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
        <p v-if="loadingMore" class="pc-list__more">加载中...</p>
        <p v-else-if="list.length >= total" class="pc-list__more">— 没有更多了 —</p>
      </div>
    </main>

    <CreateFab v-if="!loading" @click="createTask" />

    <!-- 搜索弹层 -->
    <div v-if="searchOpen" class="pc-search" @click.self="searchOpen = false">
      <div class="pc-search__bar">
        <svg class="pc-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          class="pc-search__input"
          v-model="searchQ"
          placeholder="搜索任务..."
          @input="onSearchInput"
          @keyup.enter="runSearch"
        />
        <button class="pc-search__cancel" @click="searchOpen = false">取消</button>
      </div>
      <div class="pc-search__results">
        <div v-if="searchLoading" class="pc-search__hint">搜索中...</div>
        <div v-else-if="searchQ.trim() && searchDone && searchResults.length === 0" class="pc-search__hint">
          未找到相关任务
        </div>
        <div v-else-if="!searchQ.trim()" class="pc-search__hint">搜索历史任务标题或消息内容</div>
        <div
          v-for="r in searchResults"
          :key="r.id"
          class="pc-task"
          @click="openRun(r)"
        >
          <div class="pc-task__main">
            <div class="pc-task__head">
              <span class="pc-task__title">{{ r.task || "未命名任务" }}</span>
              <span class="pc-task__dot" :class="`pc-task__dot--${r.status}`"></span>
            </div>
            <div class="pc-task__meta">
              <span class="pc-task__model">{{ modelLabel(r.modelId) }}</span>
              <span class="pc-task__time">{{ formatTime(r.createdAt) }}</span>
            </div>
          </div>
          <div class="pc-task__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./tokens" as *;

.personal-center {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100vh;
  background: $pc-bg;
  font-family: $pc-font-family;
  overflow: hidden;

  &__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px $pc-safe-side 140px;
  }
}

.pc-empty-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.pc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &--loading {
    gap: 12px;
  }

  &__more {
    text-align: center;
    margin: 8px 0 0;
    font-size: 12px;
    color: $pc-empty-text-color;
  }
}

.pc-skeleton {
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e8e8e8 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: pc-shimmer 1.4s infinite;
}

.pc-task {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.985);
  }

  &--restoring {
    opacity: 0.5;
    pointer-events: none;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: 16px;
    color: $pc-title-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--completed { background: #07c160; }
    &--failed { background: #ee0a24; }
    &--running { background: #1989fa; }
    &--cancelled { background: #bdbdbd; }
    &--budget_exceeded { background: #ff976a; }
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 13px;
  }

  &__model {
    color: $pc-icon-color;
    opacity: 0.75;
  }

  &__time {
    color: $pc-empty-text-color;
  }

  &__arrow {
    color: #c4c4c4;
    flex-shrink: 0;
  }
}

@keyframes pc-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ---- 搜索弹层 ----
.pc-search {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;

  &__bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: $pc-safe-top 20px 12px;
    background: #ffffff;
    border-radius: 0 0 20px 20px;
  }

  &__icon {
    width: 20px;
    height: 20px;
    color: $pc-icon-color;
    opacity: 0.5;
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: 20px;
    background: #f5f5f5;
    font-family: $pc-font-family;
    font-size: 15px;
    color: $pc-title-color;
    outline: none;
  }

  &__cancel {
    border: none;
    background: none;
    font-family: $pc-font-family;
    font-size: 15px;
    color: $pc-title-color;
    cursor: pointer;
    flex-shrink: 0;
    padding: 4px;
  }

  &__results {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__hint {
    text-align: center;
    padding: 40px 0;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
  }
}

@media (prefers-color-scheme: dark) {
  .pc-search__hint {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>