<script setup lang="ts">
</script>

<template>
  <div class="model-empty">
    <span class="model-empty__text">当前无可用模型</span>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.model-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  &__text {
    font-family: $ai-font-family;
    font-size: $ai-font-size-aux;
    font-weight: $ai-font-weight-aux;
    color: $ai-text-placeholder;
    letter-spacing: $ai-letter-spacing;
  }
}
</style>