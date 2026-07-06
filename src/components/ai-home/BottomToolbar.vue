<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  mode: "work" | "code"
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const router = useRouter()

const routeMap: Record<string, string> = {
  "web-search": "/workspace/search",
  "image-gen": "/workspace/image",
  files: "/workspace/files",
  code: "/workspace/code",
  history: "/workspace/history",
  settings: "/workspace/settings"
}

interface ToolbarItem {
  id: string
  label: string
}

const workItems: ToolbarItem[] = [
  { id: "web-search", label: "搜索" },
  { id: "image-gen", label: "绘图" },
  { id: "files", label: "文件" },
  { id: "code", label: "代码" },
  { id: "history", label: "历史" },
  { id: "settings", label: "设置" }
]

const codeItems: ToolbarItem[] = [
  { id: "github", label: "GitHub" },
  { id: "debug", label: "调试" },
  { id: "terminal", label: "终端" },
  { id: "review", label: "审查" },
  { id: "deploy", label: "部署" },
  { id: "docs", label: "文档" }
]

const toolbarItems = computed(() =>
  props.mode === "work" ? workItems : codeItems
)

function handleSelect(id: string) {
  emit("select", id)
  const path = routeMap[id]
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="toolbar" role="toolbar" :aria-label="mode === 'work' ? '工作模式工具栏' : '代码模式工具栏'">
    <button
      v-for="item in toolbarItems"
      :key="item.id"
      class="toolbar__item"
      :aria-label="item.label"
      @click="handleSelect(item.id)"
    >
      <svg v-if="item.id === 'web-search'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <svg v-else-if="item.id === 'image-gen'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <svg v-else-if="item.id === 'files'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
      <svg v-else-if="item.id === 'code'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <svg v-else-if="item.id === 'history'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <svg v-else-if="item.id === 'settings'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
      <svg v-else-if="item.id === 'github'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
      <svg v-else-if="item.id === 'debug'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2.5-2.5-2.5A2.5 2.5 0 006 12c0 1 .5 2.5 2.5 2.5z"/><path d="M15.5 14.5A2.5 2.5 0 0018 12c0-1.38-.5-2.5-2.5-2.5A2.5 2.5 0 0013 12c0 1 .5 2.5 2.5 2.5z"/><path d="M12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/><path d="M8.5 14.5c0 1 .5 2.5 2.5 2.5s2.5-1.5 2.5-2.5"/><path d="M13 14.5c0 1 .5 2.5 2.5 2.5s2.5-1.5 2.5-2.5"/><path d="M9 17c.5.5 1.5 1 3 1s2.5-.5 3-1"/></svg>
      <svg v-else-if="item.id === 'terminal'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
      <svg v-else-if="item.id === 'review'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      <svg v-else-if="item.id === 'deploy'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      <svg v-else-if="item.id === 'docs'" class="toolbar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      <span class="toolbar__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.toolbar {
  display: flex;
  width: 100%;
  height: $ai-toolbar-height;
  align-items: center;
  justify-content: space-around;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $ai-toolbar-gap;
    height: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    color: $ai-text-secondary;
    transition: color 0.2s ease;
    padding: 0;

    &:hover {
      color: $ai-text-primary;
    }
  }

  &__icon {
    display: block;
    width: $ai-toolbar-icon-size;
    height: $ai-toolbar-icon-size;
  }

  &__label {
    font-family: $ai-font-family;
    font-size: $ai-toolbar-font-size;
    font-weight: $ai-font-weight-aux;
    letter-spacing: $ai-letter-spacing;
    line-height: 1;
    white-space: nowrap;
  }
}
</style>