<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import ThemeToggle from '@/components/ThemeToggle.vue'
import GlassCard from '@/components/GlassCard.vue'
import type { RegisterForm } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive<RegisterForm>({
  username: '',
  password: '',
  email: ''
})

const confirmPassword = ref('')

async function handleRegister() {
  if (!form.username.trim() || form.username.length < 3) {
    showToast('Username must be at least 3 characters')
    return
  }
  if (!form.password.trim() || form.password.length < 6) {
    showToast('Password must be at least 6 characters')
    return
  }
  if (form.password !== confirmPassword.value) {
    showToast('Passwords do not match')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    showToast('Please enter a valid email')
    return
  }

  loading.value = true
  try {
    await userStore.register(form)
    router.push('/home')
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <div class="register-page__header">
      <div class="register-page__theme">
        <ThemeToggle />
      </div>
    </div>

    <div class="register-page__brand">
      <div class="register-page__logo">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="16" fill="#07c160" />
          <path d="M20 32l8 8 16-16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1 class="register-page__title">Create Account</h1>
      <p class="register-page__subtitle">Join the platform</p>
    </div>

    <GlassCard class="register-page__card">
      <h2 class="register-page__card-title">Sign Up</h2>

      <van-form @submit="handleRegister">
        <van-field
          v-model="form.username"
          name="username"
          label="Username"
          placeholder="At least 3 characters"
          :rules="[{ required: true, message: 'Username is required' }]"
          clearable
        />
        <van-field
          v-model="form.email"
          name="email"
          label="Email"
          placeholder="Enter email address"
          :rules="[
            { required: true, message: 'Email is required' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
          ]"
          clearable
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="Password"
          placeholder="At least 6 characters"
          :rules="[{ required: true, message: 'Password is required' }]"
          clearable
        />
        <van-field
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          label="Confirm"
          placeholder="Confirm password"
          :rules="[{ required: true, message: 'Please confirm password' }]"
          clearable
        />

        <div style="margin-top: 20px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="Creating account..."
            color="#07c160"
          >
            Register
          </van-button>
        </div>
      </van-form>

      <div class="register-page__footer">
        <span>Already have an account?</span>
        <button class="register-page__link" @click="goLogin">Login</button>
      </div>
    </GlassCard>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);

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
    padding: 24px 0 20px;
  }

  &__logo {
    margin-bottom: 12px;
    animation: float 3s ease-in-out infinite;
  }

  &__title {
    font-size: 26px;
    font-weight: 700;
    color: white;
    margin-bottom: 6px;
  }

  &__subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  &__card {
    margin-top: 4px;
    padding: 24px 20px;
  }

  &__card-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
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
    margin-top: 16px;
    font-size: 13px;
    color: $text-color-secondary;

    @include dark-mode {
      color: $dark-text-color-secondary;
    }
  }

  &__link {
    background: none;
    border: none;
    color: #07c160;
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