<script setup lang="ts">
const actions = [
  {
    id: "deepseek",
    label: "DeepSeek"
  },
  {
    id: "claude",
    label: "Claude"
  },
  {
    id: "chatgpt",
    label: "ChatGPT"
  }
]

const emit = defineEmits<{
  select: [id: string]
}>()

function handleSelect(id: string) {
  emit("select", id)
}
</script>

<template>
  <div class="action-buttons" role="group" aria-label="AI model selection">
    <button
      v-for="action in actions"
      :key="action.id"
      class="action-buttons__item"
      :aria-label="'Select ' + action.label"
      @click="handleSelect(action.id)"
    >
      <svg
        v-if="action.id === 'deepseek'"
        class="action-buttons__icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <svg
        v-else-if="action.id === 'claude'"
        class="action-buttons__icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <svg
        v-else
        class="action-buttons__icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span class="action-buttons__label">{{ action.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.action-buttons {
  display: flex;
  gap: $ai-space-1;
  width: 100%;

  &__item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: $ai-button-height;
    padding: 0 $ai-space-2;
    background: $ai-button-bg;
    border: none;
    border-radius: $ai-radius-full;
    box-shadow: $ai-shadow-button;
    cursor: pointer;
    transition: transform 0.2s ease;
    color: $ai-text-primary;
    font-family: $ai-font-family;
    font-size: $ai-font-size-button;
    font-weight: $ai-font-weight-button;
    letter-spacing: $ai-letter-spacing;
    white-space: nowrap;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__label {
    line-height: 1;
  }
}
</style>