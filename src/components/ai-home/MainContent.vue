<script setup lang="ts">
</script>

<template>
  <section class="main-content">
    <div class="main-content__inner">
      <!-- Future chat messages -->
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: $ai-space-2;
    padding: $ai-space-3 0;
    min-height: 100%;
  }
}
</style>