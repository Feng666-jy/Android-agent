<script setup lang="ts">
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span class="empty-state__plus">+</span>
    </div>
    <p class="empty-state__text">
      还没有任务，点右下角「+」创建第一个<br />任务
    </p>
  </div>
</template>

<style scoped lang="scss">
@use "../tokens" as *;

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    position: relative;
    width: $pc-empty-icon-size;
    height: $pc-empty-icon-size;
    border: $pc-empty-icon-stroke solid $pc-empty-color;
    border-radius: $pc-radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $pc-empty-color;

    svg {
      width: 60%;
      height: 60%;
    }
  }

  &__plus {
    position: absolute;
    font-size: $pc-empty-plus-size;
    font-weight: 300;
    line-height: 1;
    color: $pc-empty-color;
  }

  &__text {
    margin-top: $pc-empty-text-gap;
    font-family: $pc-font-family;
    font-size: $pc-empty-text-size;
    color: $pc-empty-text-color;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
