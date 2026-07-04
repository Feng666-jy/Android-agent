<script setup lang="ts">
</script>

<template>
  <section class="workspace">
    <div class="workspace__placeholder">
      <p class="workspace__text">文件</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.workspace {
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__placeholder { text-align: center; }

  &__text {
    font-family: $ai-font-family;
    font-size: $ai-font-size-aux;
    font-weight: $ai-font-weight-aux;
    color: $ai-text-placeholder;
    letter-spacing: $ai-letter-spacing;
    margin: 0;
  }
}
</style>