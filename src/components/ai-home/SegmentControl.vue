<script setup lang="ts">
defineProps<{
  modelValue: "work" | "code"
}>()

const emit = defineEmits<{
  "update:modelValue": [value: "work" | "code"]
}>()

function select(tab: "work" | "code") {
  emit("update:modelValue", tab)
}
</script>

<template>
  <div class="segment" role="tablist" aria-label="模式切换">
    <div
      class="segment__slider"
      :class="modelValue === 'code' ? 'segment__slider--right' : ''"
    />
    <button
      class="segment__item"
      :class="modelValue === 'work' ? 'segment__item--active' : ''"
      role="tab"
      :aria-selected="modelValue === 'work'"
      aria-label="工作模式"
      @click="select('work')"
    >
      工作
    </button>
    <button
      class="segment__item"
      :class="modelValue === 'code' ? 'segment__item--active' : ''"
      role="tab"
      :aria-selected="modelValue === 'code'"
      aria-label="代码模式"
      @click="select('code')"
    >
      代码
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.segment {
  position: relative;
  display: flex;
  align-items: center;
  height: $ai-segment-height;
  background: $ai-segment-bg;
  border-radius: $ai-radius-full;
  padding: 3px;
  width: 180px;
  margin: auto;

  &__slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: calc(50% - 3px);
    height: calc(100% - 6px);
    background: $ai-card-bg;
    border-radius: $ai-radius-full;
    box-shadow: $ai-shadow-button;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;

    &--right {
      transform: translateX(100%);
    }
  }

  &__item {
    position: relative;
    z-index: 2;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    font-family: $ai-font-family;
    font-size: $ai-font-size-button;
    font-weight: $ai-font-weight-body;
    letter-spacing: $ai-letter-spacing;
    color: $ai-text-secondary;
    cursor: pointer;
    border-radius: $ai-radius-full;
    transition: color 0.25s ease;
    outline: none;

    &--active {
      color: $ai-text-primary;
      font-weight: $ai-font-weight-button;
    }
  }
}
</style>