<script setup lang="ts">
import { ref } from "vue"
import TopBar from "@/components/ai-home/TopBar.vue"
import BottomCard from "@/components/ai-home/BottomCard.vue"

const currentTab = ref<"work" | "code">("work")

function onSend(_value: string) {
  // Input send handler
}

function onSelectAction(_id: string) {
  // Action button selection handler
}

function onSelectTool(_id: string) {
  // Toolbar selection handler
}
</script>

<template>
  <div class="page">
    <TopBar
      :current-tab="currentTab"
      @update:current-tab="currentTab = $event"
    />
    <main class="content">
      <!-- Chat messages will appear here -->
    </main>
    <BottomCard
      :mode="currentTab"
      @send="onSend"
      @select-action="onSelectAction"
      @select-tool="onSelectTool"
    />
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

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>