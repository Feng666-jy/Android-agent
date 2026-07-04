<script setup lang="ts">
interface GlassCardProps {
  padding?: string
  radius?: string
  hover?: boolean
}

withDefaults(defineProps<GlassCardProps>(), {
  padding: '20px',
  radius: '16px',
  hover: false
})
</script>

<template>
  <div class="glass-card" :class="{ 'glass-card--hover': hover }" :style="{ padding, borderRadius: radius }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.glass-card {
  @include glass(0.12, 10px);
  border-radius: 16px;
  transition: all $transition-normal;

  @include dark-mode {
    @include glass(0.06, 10px);
  }

  &--hover {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;

      @include dark-mode {
        box-shadow: $dark-shadow-lg;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>