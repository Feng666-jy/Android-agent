<script setup lang="ts">
import { ref } from "vue"
import TopBar from "@/components/ai-home/TopBar.vue"
import MainContent from "@/components/ai-home/MainContent.vue"
import BottomCard from "@/components/ai-home/BottomCard.vue"

const currentTab = ref<"work" | "code">("work")

function onSend(_value: string) {
  // Input send handler - no business logic
}

function onSelectAction(_id: string) {
  // Action button selection handler - no business logic
}

function onSelectTool(_id: string) {
  // Toolbar selection handler - no business logic
}
</script>

<template>
  <div class="page">
    <TopBar
      :current-tab="currentTab"
      @update:current-tab="currentTab = $event"
    />
    <MainContent />
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
  background: $ai-bg;
  overflow: hidden;
  font-family: $ai-font-family;
}
</style>
