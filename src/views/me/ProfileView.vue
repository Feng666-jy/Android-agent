<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { showToast } from "vant";

const router = useRouter();
const userStore = useUserStore();

const displayName = computed(() => userStore.userInfo?.username || "未登录");
const email = computed(() => userStore.userInfo?.email || "");
const avatarText = computed(() => (displayName.value || "U").slice(0, 1).toUpperCase());

onMounted(() => {
  if (!userStore.userInfo) {
    void userStore.fetchUserInfo();
  }
});

function goBack() {
  void router.push("/personal-center");
}

function editProfile() {
  showToast("资料编辑即将上线");
}

function member() {
  showToast("会员功能即将上线");
}
</script>

<template>
  <div class="profile">
    <header class="profile__header">
      <h1 class="profile__title">设置</h1>
      <button class="profile__close" aria-label="关闭" @click="goBack">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </header>

    <main class="profile__content">
      <!-- 用户区 -->
      <section class="pc-card profile__user">
        <div class="profile__avatar" :style="{ background: 'linear-gradient(135deg, #5B4CFF, #4530E0)' }">
          {{ avatarText }}
        </div>
        <div class="profile__user-info">
          <p class="profile__name">{{ displayName }}</p>
          <p class="profile__contact">{{ email || "未绑定邮箱" }} · 暂无手机号</p>
          <p class="profile__member">普通会员</p>
        </div>
        <button class="profile__edit" @click="editProfile">编辑资料</button>
      </section>

      <!-- 第一组 -->
      <section class="pc-card pc-group">
        <div class="pc-group__item">
          <span class="pc-group__label">账户</span>
          <span class="pc-group__value">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
        </div>
        <div class="pc-group__item">
          <span class="pc-group__label">消息</span>
          <span class="pc-group__value"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
        </div>
        <div class="pc-group__item">
          <span class="pc-group__label">积分</span>
          <span class="pc-group__value pc-group__value--text" @click="member">4500</span>
        </div>
      </section>

      <!-- 第二组 -->
      <section class="pc-card pc-group">
        <div class="pc-group__item">
          <span class="pc-group__label">语言</span>
          <span class="pc-group__value pc-group__value--text">中文</span>
        </div>
        <div class="pc-group__item">
          <span class="pc-group__label">通知</span>
          <span class="pc-group__value"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
        </div>
        <div class="pc-group__item">
          <span class="pc-group__label">帮助与反馈</span>
          <span class="pc-group__value"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
        </div>
      </section>

      <!-- 第三组 -->
      <section class="pc-card pc-group">
        <div class="pc-group__item">
          <span class="pc-group__label">设备管理</span>
          <span class="pc-group__value"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use "../personal-center/tokens" as *;

.profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: $pc-bg;
  font-family: $pc-font-family;
  overflow: hidden;

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $pc-header-height;
    padding: $pc-safe-top 20px 0;
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: $pc-title-color;
  }

  &__close {
    position: absolute;
    right: 20px;
    top: calc(#{$pc-safe-top} + 6px);
    width: 32px;
    height: 32px;
    border: none;
    border-radius: $pc-radius-full;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $pc-title-color;
  }

  &__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 16px;
  }

  &__avatar {
    width: 60px;
    height: 60px;
    border-radius: $pc-radius-full;
    color: #ffffff;
    font-size: 26px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__user-info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 600;
    color: $pc-title-color;
  }

  &__contact {
    margin: 0 0 4px;
    font-size: 13px;
    color: $pc-empty-text-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__member {
    margin: 0;
    font-size: 12px;
    color: #5B4CFF;
  }

  &__edit {
    flex-shrink: 0;
    padding: 7px 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: $pc-radius-full;
    background: #ffffff;
    font-family: $pc-font-family;
    font-size: 13px;
    color: $pc-title-color;
    cursor: pointer;

    &:active {
      background: rgba(0, 0, 0, 0.04);
    }
  }
}

.pc-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.pc-group {
  display: flex;
  flex-direction: column;
  padding: 4px 16px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;

    & + .pc-group__item {
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
  }

  &__label {
    font-size: 15px;
    color: $pc-title-color;
  }

  &__value {
    display: flex;
    align-items: center;
    color: #c4c4c4;

    &--text {
      color: $pc-empty-text-color;
      cursor: pointer;
    }
  }
}
</style>