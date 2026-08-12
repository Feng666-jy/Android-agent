<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import GlassCard from '@/components/GlassCard.vue'
import type { LoginForm } from '@/types'
import { isCapacitorNative } from '@/capacitor/device-bridge'
import { storage } from '@/utils/storage'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const isNative = isCapacitorNative()
const serverBase = ref(storage.getServerBase())

const form = reactive<LoginForm>({
  username: '',
  password: ''
})

async function handleLogin() {
  if (isNative && !serverBase.value.trim()) {
    showToast('手机端请先填写服务器地址（http://电脑IP:3000）')
    return
  }
  if (!form.username.trim()) {
    showToast('请输入用户名')
    return
  }
  if (!form.password.trim()) {
    showToast('请输入密码')
    return
  }

  loading.value = true
  try {
    if (serverBase.value.trim()) {
      storage.setServerBase(serverBase.value.trim().replace(/\/+$/, ''))
    }
    await userStore.login(form)
    router.push('/home')
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}

function goRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__brand">
      <div class="login-page__logo">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="16" fill="#1A1A1A" />
          <path
            d="M20 44V24l12 10 12-10v20"
            stroke="white"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1 class="login-page__title">Android Agent</h1>
      <p class="login-page__subtitle">企业级 AI 开发平台</p>
    </div>

    <GlassCard class="login-page__card">
      <h2 class="login-page__card-title">欢迎回来</h2>

      <van-form @submit="handleLogin">
        <van-field
          v-if="isNative"
          v-model="serverBase"
          name="serverBase"
          label="服务器"
          placeholder="http://电脑IP:3000（必填）"
          clearable
        />
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
          clearable
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
          clearable
        />

        <div style="margin-top: 20px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
        </div>
      </van-form>

      <div class="login-page__footer">
        <span>还没有账号？</span>
        <button class="login-page__link" @click="goRegister">立即注册</button>
      </div>
    </GlassCard>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: #ffffff;

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
  }

  &__logo {
    margin-bottom: 16px;
  }

  &__title {
    font-size: 26px;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 6px;
    font-family: 'Inter', 'HarmonyOS Sans', sans-serif;
  }

  &__subtitle {
    font-size: 14px;
    color: $text-color-secondary;
    margin: 0;
    font-family: 'Inter', 'HarmonyOS Sans', sans-serif;
  }

  &__card {
    width: 100%;
    max-width: 400px;
    padding: 28px 20px;
  }

  &__card-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px;
    text-align: center;
    color: $text-color;
    font-family: 'Inter', 'HarmonyOS Sans', sans-serif;
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 13px;
    color: $text-color-secondary;
    font-family: 'Inter', 'HarmonyOS Sans', sans-serif;
  }

  &__link {
    background: none;
    border: none;
    color: $primary-color;
    font-size: 13px;
    cursor: pointer;
    padding: 0;
    font-family: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
