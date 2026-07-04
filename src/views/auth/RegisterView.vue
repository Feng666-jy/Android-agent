<script setup lang="ts">
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { showToast } from "vant"
import GlassCard from "@/components/GlassCard.vue"
import type { RegisterForm } from "@/types"

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive<RegisterForm>({
  username: "",
  password: "",
  email: ""
})

const confirmPassword = ref("")

async function handleRegister() {
  if (!form.username.trim() || form.username.length < 3) {
    showToast("用户名至少 3 个字符")
    return
  }
  if (!form.password.trim() || form.password.length < 6) {
    showToast("密码至少 6 个字符")
    return
  }
  if (form.password !== confirmPassword.value) {
    showToast("两次密码输入不一致")
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    showToast("请输入有效的邮箱地址")
    return
  }

  loading.value = true
  try {
    await userStore.register(form)
    router.push("/home")
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push("/login")
}
</script>

<template>
  <div class="register-page">
    <div class="register-page__brand">
      <div class="register-page__logo">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="16" fill="#1A1A1A" />
          <path d="M20 32l8 8 16-16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1 class="register-page__title">创建账号</h1>
      <p class="register-page__subtitle">加入平台</p>
    </div>

    <GlassCard class="register-page__card">
      <h2 class="register-page__card-title">注册</h2>

      <van-form @submit="handleRegister">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="至少 3 个字符"
          :rules="[{ required: true, message: '请输入用户名' }]"
          clearable
        />
        <van-field
          v-model="form.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱地址"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }
          ]"
          clearable
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="至少 6 个字符"
          :rules="[{ required: true, message: '请输入密码' }]"
          clearable
        />
        <van-field
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[{ required: true, message: '请确认密码' }]"
          clearable
        />

        <div style="margin-top: 20px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="注册中..."
          >
            注册
          </van-button>
        </div>
      </van-form>

      <div class="register-page__footer">
        <span>已有账号？</span>
        <button class="register-page__link" @click="goLogin">去登录</button>
      </div>
    </GlassCard>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: #FFFFFF;

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
  }

  &__logo {
    margin-bottom: 14px;
  }

  &__title {
    font-size: 26px;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 6px;
    font-family: "Inter", "HarmonyOS Sans", sans-serif;
  }

  &__subtitle {
    font-size: 14px;
    color: $text-color-secondary;
    margin: 0;
    font-family: "Inter", "HarmonyOS Sans", sans-serif;
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
    font-family: "Inter", "HarmonyOS Sans", sans-serif;
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 13px;
    color: $text-color-secondary;
    font-family: "Inter", "HarmonyOS Sans", sans-serif;
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