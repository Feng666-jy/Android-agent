<script setup lang="ts">
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface NavBarProps {
  title?: string
  showBack?: boolean
  rightAction?: boolean
}

withDefaults(defineProps<NavBarProps>(), {
  title: '',
  showBack: false,
  rightAction: true
})

const emit = defineEmits<{
  back: []
}>()

const router = useRouter()

function handleBack() {
  if (router.options.history.state.back) {
    router.back()
  } else {
    emit('back')
  }
}
</script>

<template>
  <div class="navbar">
    <div class="navbar__left">
      <div v-if="showBack" class="navbar__back" @click="handleBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
    </div>
    <div class="navbar__title">{{ title }}</div>
    <div class="navbar__right">
      <ThemeToggle v-if="rightAction" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.navbar {
  @include flex-between;
  height: 56px;
  padding: 0 $spacing-lg;
  position: sticky;
  top: 0;
  z-index: $z-navbar;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid $border-color;
  transition: background-color $transition-normal, border-color $transition-normal;

  @include dark-mode {
    background-color: rgba(26, 26, 46, 0.85);
    border-bottom-color: $dark-border-color;
  }

  &__left,
  &__right {
    @include flex-center;
    min-width: 44px;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    @include ellipsis;
  }

  &__back {
    @include flex-center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color $transition-fast;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);

      @include dark-mode {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    &:active {
      transform: scale(0.92);
    }
  }
}
</style>