<script setup lang="ts">
import { useRouter } from "vue-router";
import SegmentControl from "./SegmentControl.vue"

defineProps<{
  currentTab: "work" | "code"
}>()

const emit = defineEmits<{
  "update:currentTab": [value: "work" | "code"]
}>()

const router = useRouter()

function onTabChange(tab: "work" | "code") {
  emit("update:currentTab", tab)
}

function onBack() {
  router.push("/personal-center")
}
</script>

<template>
  <header class="topbar">
    <button class="topbar__back" aria-label="返回" @click="onBack">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
    <SegmentControl
      :model-value="currentTab"
      @update:model-value="onTabChange"
    />
  </header>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.topbar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex-shrink: 0;

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
}
</style>
