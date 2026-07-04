<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

interface DefaultLayoutProps {
  title?: string
  showBack?: boolean
}

withDefaults(defineProps<DefaultLayoutProps>(), {
  title: '',
  showBack: false
})
</script>

<template>
  <div class="layout">
    <NavBar :title="title" :show-back="showBack" />
    <main class="layout__content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
}
</style>