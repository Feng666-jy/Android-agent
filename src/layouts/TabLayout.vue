<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import BottomToolbar from "@/components/ai-home/BottomToolbar.vue"

const route = useRoute()
const router = useRouter()

const tabTitle = computed(() => {
  const map: Record<string, string> = {
    search: "搜索",
    image: "绘图",
    files: "文件",
    code: "代码",
    history: "历史",
    settings: "设置"
  }
  return map[route.name as string] ?? (route.meta.title as string) ?? ""
})

function goHome() {
  router.push("/home")
}
</script>

<template>
  <div class="page">
    <header class="header">
      <button class="header__back" aria-label="返回首页" @click="goHome">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="header__title">{{ tabTitle }}</h1>
    </header>
    <main class="content">
      <router-view v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </main>
    <div class="nav-bar">
      <BottomToolbar mode="work" />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/ai-tokens" as *;

.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 18px $ai-padding-horizontal $ai-padding-horizontal;
  background: $ai-bg;
  overflow: hidden;
  font-family: $ai-font-family;
  overscroll-behavior: none;
}

.header {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: $ai-topbar-height;
  width: 100%;

  &__back {
    position: absolute;
    left: 0;
    top: 0;
    width: $ai-back-button-size;
    height: $ai-back-button-size;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-button;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $ai-text-primary;
    transition: transform 0.2s ease;
    z-index: 1;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__title {
    font-family: $ai-font-family;
    font-size: $ai-font-size-title;
    font-weight: $ai-font-weight-title;
    letter-spacing: $ai-letter-spacing;
    color: $ai-text-primary;
    line-height: 1;
    margin: 0;
    padding: 0;
  }
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.nav-bar {
  flex-shrink: 0;
  width: 100%;
  background: $ai-card-bg;
  border-radius: $ai-bottom-card-radius $ai-bottom-card-radius 0 0;
  box-shadow: $ai-shadow-card;
  padding: 8px $ai-bottom-card-padding-h $ai-bottom-card-padding-bottom;
}
</style>