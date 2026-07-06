<script setup lang="ts">
import type { AiModel } from "@/types";

defineProps<{
  model: AiModel;
  selected: boolean;
}>();

const emit = defineEmits<{
  select: [model: AiModel];
}>();
</script>

<template>
  <button
    class="model-item"
    :class="{ 'model-item--selected': selected }"
    @click="emit('select', model)"
  >
    <span class="model-item__name">{{ model.displayName }}</span>
    <svg
      v-if="selected"
      class="model-item__check"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </button>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.model-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 42px;
  padding: 0 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: $ai-radius-small;
  transition: background-color 0.15s ease;
  text-align: left;
  color: $ai-text-primary;
  font-family: $ai-font-family;

  &:hover {
    background: $ai-segment-bg;
  }

  &--selected {
    color: $ai-text-primary;
    font-weight: $ai-font-weight-button;
  }

  &__name {
    font-size: $ai-font-size-body;
    font-weight: inherit;
    letter-spacing: $ai-letter-spacing;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__check {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: $ai-text-primary;
  }
}
</style>