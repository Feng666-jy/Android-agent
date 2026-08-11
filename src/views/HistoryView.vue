<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { agentAPI } from "@/api/agent";
import type { AgentRunDetail, AgentRunSummary } from "@/api/agent";
import { showDialog, showToast } from "vant";

const list = ref<AgentRunSummary[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 20;
const loading = ref(false);
const loadingMore = ref(false);
const selected = ref<Set<string>>(new Set());
const detail = ref<AgentRunDetail | null>(null);
const showDetail = ref(false);
const detailLoading = ref(false);

async function fetchList(append = false) {
  if (append) loadingMore.value = true;
  else loading.value = true;
  try {
    const res = await agentAPI.history(page.value, pageSize);
    if (res.code === 0) {
      total.value = res.data.total;
      list.value = append ? [...list.value, ...res.data.list] : res.data.list;
    }
  } catch {
    showToast("加载失败");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function loadMore() {
  if (list.value.length >= total.value || loadingMore.value) return;
  page.value += 1;
  fetchList(true);
}

function refresh() {
  page.value = 1;
  fetchList(false);
}

function toggleSelect(id: string) {
  if (selected.value.has(id)) selected.value.delete(id);
  else selected.value.add(id);
}

const allSelected = computed(() => list.value.length > 0 && selected.value.size === list.value.length);

function toggleAll() {
  if (allSelected.value) selected.value.clear();
  else {
    list.value.forEach((r) => selected.value.add(r.id));
  }
}

async function removeRun(id: string) {
  try {
    await showDialog({
      title: "确认删除",
      message: "删除后该会话及其记录将无法恢复，确定继续？",
      confirmButtonText: "删除",
      confirmButtonColor: "#ee0a24",
    });
  } catch {
    return;
  }
  try {
    const res = await agentAPI.remove(id);
    if (res.code === 0) {
      list.value = list.value.filter((r) => r.id !== id);
      selected.value.delete(id);
      showToast("已删除");
    }
  } catch {
    showToast("删除失败");
  }
}

async function batchRemove() {
  const ids = [...selected.value];
  if (ids.length === 0) return;
  try {
    await showDialog({
      title: "批量删除",
      message: `确定删除选中的 ${ids.length} 条会话记录？`,
      confirmButtonText: "删除",
      confirmButtonColor: "#ee0a24",
    });
  } catch {
    return;
  }
  try {
    const res = await agentAPI.batchDelete(ids);
    if (res.code === 0) {
      const set = new Set(ids);
      list.value = list.value.filter((r) => !set.has(r.id));
      selected.value.clear();
      total.value -= res.data.deleted;
      showToast(`已删除 ${res.data.deleted} 条`);
    }
  } catch {
    showToast("批量删除失败");
  }
}

async function openDetail(id: string) {
  showDetail.value = true;
  detailLoading.value = true;
  try {
    const res = await agentAPI.detail(id);
    if (res.code === 0) detail.value = res.data;
  } catch {
    showToast("加载详情失败");
  } finally {
    detailLoading.value = false;
  }
}

function closeDetail() {
  showDetail.value = false;
  detail.value = null;
}

function statusColor(s: string): string {
  switch (s) {
    case "completed": return "#07c160";
    case "failed": return "#ee0a24";
    case "budget_exceeded": return "#ff976a";
    case "cancelled": return "#969799";
    default: return "#1989fa";
  }
}

function statusText(s: string): string {
  switch (s) {
    case "completed": return "已完成";
    case "failed": return "失败";
    case "budget_exceeded": return "超出预算";
    case "cancelled": return "已取消";
    case "running": return "运行中";
    default: return s;
  }
}

function fmtTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtArgs(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json || "{}";
  }
}

function parseToolCalls(json: string | null): Array<{ id: string; name: string; arguments: unknown }> {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

function closeOnEsc(e: KeyboardEvent) {
  if (e.key === "Escape") closeDetail();
}

onMounted(() => {
  fetchList(false);
  window.addEventListener("keydown", closeOnEsc);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", closeOnEsc);
});
</script>

<template>
  <div class="history">
    <div v-if="loading" class="history__loading">
      <div v-for="n in 3" :key="n" class="history__skeleton" />
    </div>

    <div v-else-if="list.length === 0" class="history__empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <p>暂无 Agent 运行记录</p>
    </div>

    <template v-else>
      <div class="history__bar">
        <label class="history__select-all">
          <input type="checkbox" :checked="allSelected" @change="toggleAll" />
          <span>全选</span>
        </label>
        <div class="history__bar-actions">
          <button v-if="selected.size" class="history__bar-btn history__bar-btn--danger" @click="batchRemove">
            删除选中（{{ selected.size }}）
          </button>
          <button class="history__bar-btn" @click="refresh">刷新</button>
        </div>
      </div>

      <div class="history__list">
        <div
          v-for="run in list"
          :key="run.id"
          class="run-card"
          :class="{ 'run-card--selected': selected.has(run.id) }"
        >
          <div class="run-card__main" @click="openDetail(run.id)">
            <div class="run-card__head">
              <h3 class="run-card__task">{{ run.task }}</h3>
              <span class="run-card__badge" :style="{ background: statusColor(run.status) }">
                {{ statusText(run.status) }}
              </span>
            </div>
            <p class="run-card__meta">
              <span>{{ fmtTime(run.createdAt) }}</span>
              <span class="run-card__model">{{ run.modelId }}</span>
            </p>
            <div class="run-card__stats">
              <span class="run-card__stat">{{ run.iterations }} 轮</span>
              <span class="run-card__stat">{{ run.toolCallCount }} 次工具</span>
              <span class="run-card__stat">{{ run.tokenTotal }} tokens</span>
            </div>
          </div>
          <div class="run-card__side">
            <input
              type="checkbox"
              class="run-card__check"
              :checked="selected.has(run.id)"
              @click.stop
              @change="toggleSelect(run.id)"
            />
            <button class="run-card__del" @click="removeRun(run.id)">删除</button>
          </div>
        </div>
      </div>

      <button v-if="list.length < total" class="history__more" :disabled="loadingMore" @click="loadMore">
        {{ loadingMore ? "加载中..." : "加载更多" }}
      </button>
      <p v-else class="history__end">已加载全部 {{ total }} 条</p>
    </template>

    <!-- 详情底部弹层 -->
    <div v-if="showDetail" class="detail-overlay" @click.self="closeDetail">
      <div class="detail-sheet">
        <div class="detail-sheet__head">
          <p class="detail-sheet__title">运行详情</p>
          <button class="detail-sheet__close" @click="closeDetail">✕</button>
        </div>

        <div v-if="detailLoading" class="detail-sheet__loading">加载中...</div>

        <div v-else-if="detail" class="detail-sheet__body">
          <div class="detail-sheet__section">
            <p class="detail-sheet__label">任务</p>
            <p class="detail-sheet__task">{{ detail.task }}</p>
            <p class="detail-sheet__meta">{{ fmtTime(detail.createdAt) }} · {{ detail.modelId }} · {{ detail.sandboxRoot }}</p>
          </div>

          <div class="detail-sheet__stats">
            <div class="detail-sheet__stat">
              <span>{{ detail.iterations }}</span>
              <i>轮次</i>
            </div>
            <div class="detail-sheet__stat">
              <span>{{ detail.toolCallCount }}</span>
              <i>工具调用</i>
            </div>
            <div class="detail-sheet__stat">
              <span>{{ detail.tokenTotal }}</span>
              <i>Tokens</i>
            </div>
          </div>

          <div v-if="detail.error" class="detail-sheet__section detail-sheet__section--error">
            <p class="detail-sheet__label">错误</p>
            <p class="detail-sheet__error">{{ detail.error }}</p>
          </div>

          <div class="detail-sheet__section">
            <p class="detail-sheet__label">工具调用</p>
            <div v-if="detail.toolCalls.length === 0" class="detail-sheet__none">无工具调用</div>
            <div v-for="tc in detail.toolCalls" :key="tc.id" class="detail-sheet__tool">
              <div class="detail-sheet__tool-row">
                <code>{{ tc.name }}</code>
                <span class="detail-sheet__tool-ok" :class="tc.ok ? '--pass' : '--fail'">{{ tc.ok ? "成功" : "失败" }}</span>
                <span class="detail-sheet__tool-ms">{{ tc.durationMs }}ms</span>
              </div>
              <pre class="detail-sheet__args">{{ fmtArgs(tc.argumentsJson) }}</pre>
              <pre v-if="tc.output" class="detail-sheet__output">{{ tc.output }}</pre>
            </div>
          </div>

          <div class="detail-sheet__section">
            <p class="detail-sheet__label">对话消息</p>
            <div v-for="(m, i) in detail.messages" :key="i" class="detail-sheet__msg">
              <div class="detail-sheet__msg-row">
                <span class="detail-sheet__msg-role" :class="`--${m.role}`">{{ m.role }}</span>
                <span class="detail-sheet__msg-time">{{ fmtTime(m.createdAt) }}</span>
              </div>
              <p v-if="m.content" class="detail-sheet__msg-content">{{ m.content }}</p>
              <div v-if="m.toolCallsJson">
                <div v-for="tc in parseToolCalls(m.toolCallsJson)" :key="tc.id" class="detail-sheet__msg-tool">
                  <code>{{ tc.name }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.history {
  padding: $ai-space-2 $ai-space-1;

  &__loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__skeleton {
    height: 96px;
    border-radius: $ai-radius-medium;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: hist-shimmer 1.5s infinite;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    color: $ai-text-secondary;

    svg { margin-bottom: 12px; opacity: 0.4; }
    p { font-size: 14px; margin: 0; }
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px 10px;
  }

  &__select-all {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $ai-text-secondary;
    cursor: pointer;
  }

  &__bar-actions {
    display: flex;
    gap: 8px;
  }

  &__bar-btn {
    padding: 4px 10px;
    border-radius: $ai-radius-small;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: transparent;
    font-size: 12px;
    color: $ai-text-secondary;
    cursor: pointer;

    &--danger {
      color: #ee0a24;
      border-color: rgba(238, 10, 36, 0.25);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__more {
    width: 100%;
    margin-top: 14px;
    padding: 10px 0;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-button;
    font-size: 13px;
    color: $ai-text-secondary;
    cursor: pointer;

    &:disabled { opacity: 0.5; }
  }

  &__end {
    margin: 14px 0 0;
    text-align: center;
    font-size: 12px;
    color: $ai-text-placeholder;
  }
}

.run-card {
  display: flex;
  background: $ai-card-bg;
  border-radius: $ai-radius-medium;
  box-shadow: $ai-shadow-card;
  transition: transform 0.15s ease;
  border: 1.5px solid transparent;

  &--selected {
    border-color: #1989fa;
  }

  &__main {
    flex: 1;
    min-width: 0;
    padding: 14px 16px;
    cursor: pointer;
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
  }

  &__task {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $ai-text-primary;
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__badge {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    font-size: 12px;
    color: $ai-text-secondary;
  }

  &__model {
    font-family: $ai-font-family-mono, monospace;
    font-size: 11px;
    color: $ai-text-placeholder;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__stats {
    display: flex;
    gap: 12px;
  }

  &__stat {
    font-size: 12px;
    color: $ai-text-secondary;
  }

  &__side {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 12px 10px;
    border-left: 1px solid rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
  }

  &__check {
    width: 16px;
    height: 16px;
    accent-color: #1989fa;
  }

  &__del {
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid rgba(238, 10, 36, 0.2);
    background: transparent;
    color: #ee0a24;
    font-size: 11px;
    cursor: pointer;
  }
}

.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
}

.detail-sheet {
  width: 100%;
  max-height: 82vh;
  overflow-y: auto;
  background: #fff;
  border-radius: $ai-bottom-card-radius $ai-bottom-card-radius 0 0;
  padding: $ai-space-2 $ai-space-2 calc(#{$ai-space-2} + 12px);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $ai-space-2;
  }

  &__title {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: $ai-text-primary;
  }

  &__close {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: $ai-input-bg;
    color: $ai-text-secondary;
    font-size: 13px;
    cursor: pointer;
  }

  &__loading {
    padding: 40px 0;
    text-align: center;
    color: $ai-text-secondary;
    font-size: 14px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $ai-space-2;
  }

  &__section {
    background: $ai-input-bg;
    border-radius: $ai-radius-small;
    padding: $ai-space-1 $ai-space-2;

    &--error {
      background: rgba(238, 10, 36, 0.05);
    }
  }

  &__label {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 600;
    color: $ai-text-secondary;
  }

  &__task {
    margin: 0 0 4px;
    font-size: 15px;
    font-weight: 500;
    color: $ai-text-primary;
    word-break: break-word;
  }

  &__meta {
    margin: 0;
    font-size: 11px;
    color: $ai-text-placeholder;
    word-break: break-all;
  }

  &__error {
    margin: 0;
    font-size: 13px;
    color: #ee0a24;
    word-break: break-word;
  }

  &__none {
    font-size: 13px;
    color: $ai-text-placeholder;
  }

  &__stats {
    display: flex;
    gap: 8px;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px;
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    box-shadow: $ai-shadow-card;

    span {
      font-size: 18px;
      font-weight: 600;
      color: $ai-text-primary;
    }

    i {
      font-style: normal;
      font-size: 11px;
      color: $ai-text-secondary;
    }
  }

  &__tool {
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.04);

    &:first-of-type { border-top: none; }
  }

  &__tool-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    code {
      font-family: $ai-font-family-mono, monospace;
      font-size: 13px;
      color: $ai-text-primary;
    }
  }

  &__tool-ok {
    margin-left: auto;
    font-size: 11px;
    font-weight: 500;

    &.--pass { color: #07c160; }
    &.--fail { color: #ee0a24; }
  }

  &__tool-ms {
    font-size: 11px;
    color: $ai-text-placeholder;
  }

  &__args {
    margin: 0 0 6px;
    font-family: $ai-font-family-mono, monospace;
    font-size: 12px;
    color: $ai-text-secondary;
    white-space: pre-wrap;
    word-break: break-all;
  }

  &__output {
    margin: 0;
    padding: 8px;
    background: #fff;
    border-radius: 8px;
    font-family: $ai-font-family-mono, monospace;
    font-size: 12px;
    color: $ai-text-secondary;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 160px;
    overflow-y: auto;
  }

  &__msg {
    padding: 8px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.04);

    &:first-of-type { border-top: none; }
  }

  &__msg-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  &__msg-role {
    font-size: 11px;
    font-weight: 600;

    &.--user { color: #1989fa; }
    &.--assistant { color: #07c160; }
    &.--tool { color: #ff976a; }
    &.--system { color: $ai-text-secondary; }
  }

  &__msg-time {
    font-size: 10px;
    color: $ai-text-placeholder;
  }

  &__msg-content {
    margin: 0;
    font-size: 13px;
    color: $ai-text-primary;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__msg-tool {
    margin-top: 4px;
    padding: 2px 8px;
    border-radius: 6px;
    background: #fff;
    display: inline-block;

    code {
      font-family: $ai-font-family-mono, monospace;
      font-size: 12px;
      color: $ai-text-secondary;
    }
  }
}

@keyframes hist-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
