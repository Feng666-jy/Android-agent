<script setup lang="ts">
import ChatInput from "./ChatInput.vue"
import ActionButtons from "./ActionButtons.vue"
import BottomToolbar from "./BottomToolbar.vue"
import type { AiModel } from "@/types"

defineProps<{
  mode: "work" | "code"
}>()

const emit = defineEmits<{
  send: [value: string]
  selectAction: [id: string]
  selectTool: [id: string]
  selectModel: [model: AiModel]
}>()
</script>

<template>
  <footer class="bottom-card">
    <div class="bottom-card__divider" />
    <div class="bottom-card__content">
      <ChatInput @send="emit('send', $event)" />
      <ActionButtons @select="emit('selectModel', $event)" />
      <BottomToolbar
        :mode="mode"
        @select="emit('selectTool', $event)"
      />
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.bottom-card {
  width: 100%;
  background: $ai-card-bg;
  border-radius: $ai-bottom-card-radius $ai-bottom-card-radius 0 0;
  box-shadow: $ai-shadow-card;
  padding: 0 $ai-bottom-card-padding-h $ai-bottom-card-padding-bottom;
  flex-shrink: 0;

  &__divider {
    width: 36px;
    height: 4px;
    background: $ai-border;
    border-radius: $ai-radius-full;
    margin: 6px auto 8px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $ai-bottom-card-content-gap;
  }
}
</style>