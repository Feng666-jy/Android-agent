<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <div class="theme-toggle" @click="themeStore.toggle()">
    <div class="theme-toggle__icon">
      <span v-if="themeStore.isDark">☀️</span>
      <span v-else>🌙</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.theme-toggle {
  @include flex-center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color $transition-fast;
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);

    @include dark-mode {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &__icon {
    font-size: 20px;
    transition: transform $transition-normal;
  }
}
</style>