<script setup lang="ts">
defineProps<{
  currentTab: "work" | "code"
}>()

const emit = defineEmits<{
  "update:currentTab": [value: "work" | "code"]
}>()

function onTabChange(tab: "work" | "code") {
  emit("update:currentTab", tab)
}
</script>

<template>
  <header class="topbar">
    <button class="topbar__back" aria-label="返回">
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
  align-items: center;
  height: $ai-topbar-height;
  width: 100%;
  margin-top: 8px;
  padding: 0 $ai-padding-horizontal;

  &__back {
    position: absolute;
    left: $ai-padding-horizontal;
    top: 50%;
    transform: translateY(-50%);
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
      transform: translateY(-50%) scale(1.05);
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }
  }
}
</style>