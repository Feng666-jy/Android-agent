<script setup lang="ts">
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button class="create-fab" aria-label="创建任务" @click="emit('click')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
    <span class="create-fab__plus">+</span>
  </button>
</template>

<style scoped lang="scss">
@use "../tokens" as *;

.create-fab {
  position: absolute;
  right: $pc-fab-right;
  bottom: $pc-fab-bottom;
  width: $pc-fab-size;
  height: $pc-fab-size;
  border-radius: $pc-radius-full;
  border: none;
  background: $pc-fab-gradient;
  box-shadow: 0 $pc-fab-shadow 24px rgba(91, 76, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #FFFFFF;
  transition: transform 0.15s ease;
  animation: scaleIn 0.3s ease forwards;

  svg {
    width: $pc-fab-icon-size;
    height: $pc-fab-icon-size;
  }

  &:active {
    transform: scale(0.92);
  }

  &__plus {
    position: absolute;
    font-size: 20px;
    font-weight: 300;
    color: #FFFFFF;
    line-height: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
