<script setup lang="ts">
import { ref } from "vue"

const inputValue = ref("")

const emit = defineEmits<{
  send: [value: string]
}>()

function handleSend() {
  if (inputValue.value.trim()) {
    emit("send", inputValue.value)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="chat-input">
    <div class="chat-input__field">
      <svg class="chat-input__sparkle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l2.121 6.879L21 12l-6.879 2.121L12 21l-2.121-6.879L3 12l6.879-2.121z" />
        <path d="M5 5l14 14" />
      </svg>
      <textarea
        v-model="inputValue"
        class="chat-input__textarea"
        placeholder="今天有什么可以帮你的？"
        rows="1"
        @keydown="onKeydown"
      />
      <button
        class="chat-input__send"
        aria-label="发送消息"
        :disabled="!inputValue.trim()"
        @click="handleSend"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.chat-input {
  width: 100%;

  &__field {
    display: flex;
    align-items: center;
    gap: $ai-space-1;
    height: $ai-input-height;
    padding: 0 $ai-space-2;
    background: $ai-input-bg;
    border-radius: $ai-radius-medium;
    transition: box-shadow 0.2s ease;

    &:focus-within {
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.04);
    }
  }

  &__sparkle {
    flex-shrink: 0;
    color: $ai-text-secondary;
  }

  &__textarea {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    font-family: $ai-font-family;
    font-size: $ai-font-size-body;
    font-weight: $ai-font-weight-body;
    letter-spacing: $ai-letter-spacing;
    color: $ai-text-primary;
    resize: none;
    outline: none;
    padding: 0;
    line-height: $ai-input-height;

    &::placeholder {
      color: $ai-text-placeholder;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__send {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-text-primary;
    color: $ai-card-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>
