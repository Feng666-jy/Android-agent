<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useModelStore } from "@/stores/model";

const store = useModelStore();

const showGroupForm = ref(false);
const newGroupName = ref("");
const newGroupColor = ref("#4F46E5");
const selectedModels = ref<Set<string>>(new Set());
const activeGroupId = ref<string | null | undefined>(undefined);
const showSortMenu = ref(false);

const sortOptions = [
  { value: "default", label: "默认排序" },
  { value: "name", label: "按名称" },
  { value: "created", label: "按创建时间" },
  { value: "usage", label: "按使用频率" },
  { value: "favorite", label: "收藏优先" },
] as const;

const currentSortLabel = computed(
  () => sortOptions.find((o) => o.value === store.sortBy)?.label || "排序"
);

onMounted(() => {
  store.fetchModels();
  store.fetchGroups();
});

function onSearchInput(event: Event) {
  const q = (event.target as HTMLInputElement).value;
  store.setSearch(q);
  store.fetchModels();
}

function setSort(sort: "default" | "name" | "created" | "usage" | "favorite") {
  store.setSort(sort);
  store.fetchModels();
  showSortMenu.value = false;
}

function filterByGroup(groupId: string | null | undefined) {
  activeGroupId.value = groupId;
  store.setActiveGroup(groupId);
  store.fetchModels();
}

function toggleSelect(id: string) {
  if (selectedModels.value.has(id)) {
    selectedModels.value.delete(id);
  } else {
    selectedModels.value.add(id);
  }
  // trigger reactivity
  selectedModels.value = new Set(selectedModels.value);
}

function selectAll() {
  if (selectedModels.value.size === store.models.length) {
    selectedModels.value = new Set();
  } else {
    selectedModels.value = new Set(store.models.map((m) => m.id));
  }
}

async function handleCreateGroup() {
  if (!newGroupName.value.trim()) return;
  await store.createGroup({
    name: newGroupName.value.trim(),
    color: newGroupColor.value,
  });
  newGroupName.value = "";
  showGroupForm.value = false;
}

async function handleMoveToGroup(groupId: string | null) {
  if (selectedModels.value.size === 0) return;
  await store.moveToGroup(Array.from(selectedModels.value), groupId);
  selectedModels.value = new Set();
}
</script>

<template>
  <div class="model-manager">
    <!-- Header -->
    <header class="model-manager__header">
      <h1 class="model-manager__title">模型管理</h1>
      <button
        class="model-manager__btn-icon"
        aria-label="新建分组"
        @click="showGroupForm = !showGroupForm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </header>

    <!-- Create group form -->
    <div v-if="showGroupForm" class="model-manager__group-form">
      <input
        v-model="newGroupName"
        class="model-manager__input"
        placeholder="分组名称"
        maxlength="20"
      />
      <input v-model="newGroupColor" type="color" class="model-manager__color" />
      <button class="model-manager__btn-primary" @click="handleCreateGroup">创建</button>
    </div>

    <!-- Search bar -->
    <div class="model-manager__search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        :value="store.searchQuery"
        class="model-manager__search-input"
        placeholder="搜索模型名称或别名"
        @input="onSearchInput"
      />
    </div>

    <!-- Sort + select toolbar -->
    <div class="model-manager__toolbar">
      <div class="model-manager__sort">
        <button class="model-manager__sort-btn" @click="showSortMenu = !showSortMenu">
          {{ currentSortLabel }}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div v-if="showSortMenu" class="model-manager__sort-menu">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="model-manager__sort-item"
            :class="{ 'model-manager__sort-item--active': store.sortBy === opt.value }"
            @click="setSort(opt.value as any)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <button class="model-manager__btn-text" @click="selectAll">
        {{ selectedModels.size === store.models.length && store.models.length > 0 ? "取消全选" : "全选" }}
      </button>
    </div>

    <!-- Group filter tabs -->
    <div class="model-manager__groups">
      <button
        class="model-manager__group-chip"
        :class="{ 'model-manager__group-chip--active': activeGroupId === undefined }"
        @click="filterByGroup(undefined)"
      >
        全部
      </button>
      <button
        v-for="group in store.groups"
        :key="group.id"
        class="model-manager__group-chip"
        :class="{ 'model-manager__group-chip--active': activeGroupId === group.id }"
        :style="{ '--chip-color': group.color || '#8E8E93' }"
        @click="filterByGroup(group.id)"
      >
        {{ group.name }}
      </button>
    </div>

    <!-- Move action bar -->
    <div v-if="selectedModels.size > 0" class="model-manager__action-bar">
      <span class="model-manager__action-count">已选 {{ selectedModels.size }} 个</span>
      <button class="model-manager__action-btn" @click="handleMoveToGroup(null)">
        移至未分组
      </button>
      <button
        v-for="group in store.groups"
        :key="group.id"
        class="model-manager__action-btn"
        :style="{ '--chip-color': group.color || '#4F46E5' }"
        @click="handleMoveToGroup(group.id)"
      >
        {{ group.name }}
      </button>
    </div>

    <!-- Model list -->
    <div class="model-manager__list">
      <div v-if="store.loading" class="model-manager__loading">加载中...</div>
      <div v-else-if="store.models.length === 0" class="model-manager__empty">暂无模型</div>

      <div
        v-for="model in store.models"
        :key="model.id"
        class="model-card"
        :class="{ 'model-card--selected': selectedModels.has(model.id) }"
      >
        <label class="model-card__check">
          <input
            type="checkbox"
            :checked="selectedModels.has(model.id)"
            @change="toggleSelect(model.id)"
          />
        </label>

        <div class="model-card__body">
          <div class="model-card__top">
            <span class="model-card__name">{{ model.displayName }}</span>
            <span v-if="(model as any).isDefault" class="model-card__badge">默认</span>
          </div>
          <div class="model-card__meta">
            <span class="model-card__provider">{{ (model as any).providerId || "" }}</span>
            <span v-if="(model as any).contextWindow" class="model-card__ctx">
              {{ Math.round((model as any).contextWindow / 1000) }}K
            </span>
          </div>
        </div>

        <div class="model-card__actions">
          <button
            class="model-card__action"
            :class="{ 'model-card__action--active': (model as any).isFavorite }"
            :aria-label="(model as any).isFavorite ? '取消收藏' : '收藏'"
            @click="store.toggleFavorite(model.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" :fill="(model as any).isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          <button
            class="model-card__action"
            aria-label="设为默认"
            @click="store.setDefault(model.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.model-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $ai-bg;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px 8px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: $ai-text-primary;
  }

  &__btn-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $ai-input-bg;
    border: none;
    border-radius: $ai-radius-full;
    cursor: pointer;
    color: $ai-text-primary;
  }

  &__btn-primary {
    height: 30px;
    padding: 0 16px;
    background: $ai-text-primary;
    color: #fff;
    border: none;
    border-radius: $ai-radius-full;
    font-size: $ai-font-size-button;
    font-weight: $ai-font-weight-button;
    cursor: pointer;
  }

  &__btn-text {
    background: none;
    border: none;
    color: $ai-text-secondary;
    font-size: $ai-font-size-aux;
    cursor: pointer;
    padding: 4px 8px;
  }

  &__group-form {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px 8px;
  }

  &__input {
    flex: 1;
    height: 36px;
    padding: 0 14px;
    background: $ai-input-bg;
    border: none;
    border-radius: $ai-radius-full;
    font-size: $ai-font-size-body;
    outline: none;
    color: $ai-text-primary;
  }

  &__color {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: $ai-radius-full;
    cursor: pointer;
    background: none;
    padding: 0;
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 16px;
    padding: 0 14px;
    height: 40px;
    background: $ai-input-bg;
    border-radius: $ai-radius-full;
    color: $ai-text-secondary;
  }

  &__search-input {
    flex: 1;
    height: 100%;
    border: none;
    background: none;
    outline: none;
    font-size: $ai-font-size-body;
    color: $ai-text-primary;

    &::placeholder {
      color: $ai-text-placeholder;
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px 8px;
  }

  &__sort {
    position: relative;
  }

  &__sort-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: $ai-input-bg;
    border: none;
    border-radius: $ai-radius-full;
    padding: 6px 12px;
    font-size: $ai-font-size-aux;
    color: $ai-text-primary;
    cursor: pointer;
  }

  &__sort-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: $ai-card-bg;
    border-radius: $ai-radius-medium;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    z-index: 10;
    overflow: hidden;
    min-width: 120px;
  }

  &__sort-item {
    display: block;
    width: 100%;
    padding: 10px 16px;
    border: none;
    background: none;
    text-align: left;
    font-size: $ai-font-size-body;
    color: $ai-text-primary;
    cursor: pointer;

    &:active {
      background: $ai-input-bg;
    }

    &--active {
      color: #4F46E5;
      font-weight: 600;
    }
  }

  &__groups {
    display: flex;
    gap: 6px;
    padding: 0 16px 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__group-chip {
    flex-shrink: 0;
    padding: 5px 12px;
    background: $ai-input-bg;
    border: none;
    border-radius: $ai-radius-full;
    font-size: $ai-font-size-aux;
    color: $ai-text-secondary;
    cursor: pointer;
    transition: all 0.15s;

    &--active {
      background: var(--chip-color, $ai-text-primary);
      color: #fff;
    }
  }

  &__action-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    background: $ai-input-bg;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__action-count {
    flex-shrink: 0;
    font-size: $ai-font-size-aux;
    color: $ai-text-secondary;
    margin-right: 4px;
  }

  &__action-btn {
    flex-shrink: 0;
    padding: 4px 10px;
    background: $ai-card-bg;
    border: 1px solid;
    border-color: var(--chip-color, $ai-border);
    border-radius: $ai-radius-full;
    font-size: $ai-font-size-aux;
    color: var(--chip-color, $ai-text-primary);
    cursor: pointer;
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 16px;
  }

  &__loading,
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    color: $ai-text-secondary;
    font-size: $ai-font-size-body;
  }
}

// ---- Model card ----

.model-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin-bottom: 8px;
  background: $ai-card-bg;
  border-radius: $ai-radius-medium;
  box-shadow: $ai-shadow-card;
  transition: box-shadow 0.15s;

  &--selected {
    box-shadow: 0 0 0 1.5px rgba(79, 70, 229, 0.4), $ai-shadow-card;
  }

  &__check {
    flex-shrink: 0;
    cursor: pointer;

    input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__name {
    font-size: $ai-font-size-body;
    font-weight: 600;
    color: $ai-text-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__badge {
    flex-shrink: 0;
    padding: 1px 6px;
    background: #4F46E5;
    color: #fff;
    border-radius: $ai-radius-full;
    font-size: 10px;
    font-weight: 500;
  }

  &__meta {
    display: flex;
    gap: 8px;
    margin-top: 2px;
    font-size: $ai-font-size-aux;
    color: $ai-text-secondary;
  }

  &__actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  &__action {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: $ai-radius-full;
    cursor: pointer;
    color: $ai-text-placeholder;
    transition: all 0.15s;

    &:active {
      background: $ai-input-bg;
    }

    &--active {
      color: #F59E0B;
    }
  }
}
</style>