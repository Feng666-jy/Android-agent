<script setup lang="ts">
import ChatInput from "./ChatInput.vue"
import ActionButtons from "./ActionButtons.vue"
import BottomToolbar from "./BottomToolbar.vue"

defineProps<{
  mode: "work" | "code"
}>()

const emit = defineEmits<{
  send: [value: string]
  selectAction: [id: string]
  selectTool: [id: string]
}>()
</script>

<template>
  <footer class="bottom-card">
    <div class="bottom-card__divider" />
    <div class="bottom-card__content">
      <ChatInput @send="emit('send', $event)" />
      <ActionButtons @select="emit('selectAction', $event)" />
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
  padding: 0 $ai-bottom-card-padding $ai-bottom-card-padding;

  &__divider {
    width: 36px;
    height: 4px;
    background: $ai-border;
    border-radius: $ai-radius-full;
    margin: $ai-space-1 auto $ai-space-2;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $ai-space-2;
  }
}
</style>
