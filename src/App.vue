<script setup lang="ts">
</script>

<template>
  <div class="app-root">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables" as *;
@use "@/styles/mixins" as *;

.app-root {
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
  overflow-x: hidden;

  @include dark-mode {
    background-color: $dark-bg-color;
  }
}
</style>
