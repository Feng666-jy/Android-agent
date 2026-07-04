<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import ThemeToggle from '@/components/ThemeToggle.vue'
import GlassCard from '@/components/GlassCard.vue'
import type { LoginForm } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive<LoginForm>({
  username: '',
  password: ''
})

async function handleLogin() {
  if (!form.username.trim()) {
    showToast('Please enter username')
    return
  }
  if (!form.password.trim()) {
    showToast('Please enter password')
    return
  }

  loading.value = true
  try {
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
    <div class="login-page__header">
      <div class="login-page__theme">
        <ThemeToggle />
      </div>
    </div>

    <div class="login-page__brand">
      <div class="login-page__logo">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="16" fill="#1989fa" />
          <path d="M20 44V24l12 10 12-10v20" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1 class="login-page__title">Android Agent</h1>
      <p class="login-page__subtitle">Enterprise AI Development Platform</p>
    </div>

    <GlassCard class="login-page__card">
      <h2 class="login-page__card-title">Welcome Back</h2>

      <van-form @submit="handleLogin">
        <van-field
          v-model="form.username"
          name="username"
          label="Username"
          placeholder="Enter username"
          :rules="[{ required: true, message: 'Username is required' }]"
          clearable
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          :rules="[{ required: true, message: 'Password is required' }]"
          clearable
        />

        <div style="margin-top: 20px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="Logging in..."
          >
            Login
          </van-button>
        </div>
      </van-form>

      <div class="login-page__footer">
        <span>Don't have an account?</span>
        <button class="login-page__link" @click="goRegister">Register</button>
      </div>
    </GlassCard>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @include dark-mode {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 32px;
  }

  &__logo {
    margin-bottom: 16px;
    animation: float 3s ease-in-out infinite;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  &__card {
    margin-top: 8px;
    padding: 28px 20px;
  }

  &__card-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;

    @include dark-mode {
      color: $dark-text-color;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 13px;
    color: $text-color-secondary;

    @include dark-mode {
      color: $dark-text-color-secondary;
    }
  }

  &__link {
    background: none;
    border: none;
    color: $primary-color;
    font-size: 13px;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>