<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goProviders() {
  router.push('/workspace/settings/providers')
}

function goModels() {
  router.push('/workspace/settings/models')
}

function goTools() {
  router.push('/workspace/settings/tools')
}
</script>

<template>
  <section class="settings">
    <div class="settings__header">
      <h1 class="settings__title">设置</h1>
    </div>
    <div class="settings__content">
      <div class="settings__group">
        <div class="settings__item" @click="goProviders">
          <span class="settings__item-label">供应商管理</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div class="settings__item" @click="goModels">
          <span class="settings__item-label">模型管理</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div class="settings__item" @click="goTools">
          <span class="settings__item-label">工具管理</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <router-view />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/ai-tokens' as *;

.settings {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: $ai-bg;

  &__header {
    padding: 20px 16px 8px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: $ai-text-primary;
  }

  &__content {
    flex: 1;
    padding: 8px 16px;
  }

  &__group {
    background: $ai-card-bg;
    border-radius: $ai-radius-medium;
    overflow: hidden;
    box-shadow: $ai-shadow-card;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    cursor: pointer;
    transition: background 0.15s;

    &:active {
      background: rgba(0, 0, 0, 0.03);
    }

    & + & {
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }
  }

  &__item-label {
    font-size: $ai-font-size-body;
    font-weight: $ai-font-weight-body;
    color: $ai-text-primary;
  }
}
</style>
