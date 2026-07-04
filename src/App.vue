<script setup lang="ts">
</script>

<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>

<style lang="scss">
@use "@/styles/variables" as *;
@use "@/styles/mixins" as *;
</style>