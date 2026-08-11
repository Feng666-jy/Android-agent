<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

withDefaults(defineProps<{
  showBack?: boolean;
}>(), {
  showBack: false,
});

const emit = defineEmits<{
  "update:mode": [mode: "all" | "cloud"];
  "open-search": [];
  "open-avatar": [];
}>();

const router = useRouter();
const mode = ref<"all" | "cloud">("all");
const menuOpen = ref(false);

const titles = { all: "全部任务", cloud: "云端" } as const;
const currentTitle = computed(() => titles[mode.value]);

function selectMode(m: "all" | "cloud"): void {
  if (mode.value === m) {
    menuOpen.value = false;
    return;
  }
  mode.value = m;
  emit("update:mode", m);
  menuOpen.value = false;
}

function onBack(): void {
  router.push("/home");
}
</script>

<template>
  <header class="page-header">
    <div class="page-header__left">
      <button
        v-if="showBack"
        class="page-header__back"
        aria-label="返回主页"
        @click="onBack"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="page-header__title-group" @click="menuOpen = !menuOpen">
        <span class="page-header__title-icon">
          <template v-if="mode === 'all'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </template>
          <template v-else>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </template>
        </span>
        <h1 class="page-header__title">{{ currentTitle }}</h1>
        <svg
          class="page-header__dropdown"
          :class="{ 'page-header__dropdown--open': menuOpen }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
    <div class="page-header__actions">
      <button class="page-header__btn page-header__btn--search" aria-label="搜索" @click="emit('open-search')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <button class="page-header__btn page-header__btn--avatar" aria-label="用户" @click="emit('open-avatar')">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>
    </div>

    <transition name="pc-fade">
      <div v-if="menuOpen" class="pc-backdrop" @click="menuOpen = false"></div>
    </transition>
    <transition name="pc-drop">
      <div v-if="menuOpen" class="pc-menu">
        <button class="pc-menu__item" :class="{ 'pc-menu__item--active': mode === 'all' }" @click="selectMode('all')">
          <span class="pc-menu__icon pc-menu__icon--all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </span>
          全部任务
        </button>
        <button class="pc-menu__item" :class="{ 'pc-menu__item--active': mode === 'cloud' }" @click="selectMode('cloud')">
          <span class="pc-menu__icon pc-menu__icon--cloud">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </span>
          云端
        </button>
      </div>
    </transition>
  </header>
</template>

<style scoped lang="scss">
@use "../tokens" as *;

.page-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 30;
  height: $pc-header-height;
  padding: $pc-safe-top $pc-safe-side 0;
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__back {
    width: 32px;
    height: 32px;
    border-radius: $pc-radius-full;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $pc-title-color;
    flex-shrink: 0;
    transition: transform 0.15s ease;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  &__title-group {
    display: flex;
    align-items: center;
    gap: $pc-dropdown-gap;
    cursor: pointer;
    padding: 4px 8px 4px 4px;
    margin-left: -4px;
    border-radius: 12px;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    &:active {
      background: rgba(0, 0, 0, 0.06);
    }
  }

  &__title-icon {
    display: inline-flex;
    color: $pc-icon-color;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  &__title {
    margin: 0;
    font-family: $pc-font-family;
    font-size: $pc-title-size;
    font-weight: $pc-title-weight;
    color: $pc-title-color;
    line-height: 1.2;
  }

  &__dropdown {
    width: $pc-dropdown-size;
    height: $pc-dropdown-size;
    color: $pc-title-color;
    transition: transform 0.2s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $pc-actions-gap;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;

    &--search {
      width: $pc-search-size;
      height: $pc-search-size;
      color: $pc-icon-color;
    }

    &--avatar {
      width: $pc-avatar-size;
      height: $pc-avatar-size;
      border-radius: $pc-radius-full;
      background: $pc-avatar-bg;
      color: $pc-avatar-icon-color;
    }
  }
}

.pc-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: transparent;
}

.pc-menu {
  position: absolute;
  top: calc(#{$pc-header-height} + #{$pc-safe-top} + 8px);
  left: $pc-safe-side;
  z-index: 50;
  width: 180px;
  padding: 6px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 11px 12px;
    border: none;
    border-radius: 12px;
    background: transparent;
    font-family: $pc-font-family;
    font-size: 15px;
    color: $pc-title-color;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    &--active {
      background: rgba(0, 0, 0, 0.05);
      font-weight: 600;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;

    svg {
      width: 16px;
      height: 16px;
    }

    &--all {
      background: rgba(25, 137, 250, 0.12);
      color: #1989fa;
    }

    &--cloud {
      background: rgba(7, 193, 96, 0.12);
      color: #07c160;
    }
  }
}

.pc-fade-enter-active,
.pc-fade-leave-active {
  transition: opacity 0.15s ease;
}
.pc-fade-enter-from,
.pc-fade-leave-to {
  opacity: 0;
}

.pc-drop-enter-active,
.pc-drop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pc-drop-enter-from,
.pc-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>