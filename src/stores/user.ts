import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, LoginForm, RegisterForm } from '@/types'
import { userAPI } from '@/api'
import { storage } from '@/utils/storage'
import { showToast } from 'vant'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(storage.getToken())
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref(!!token.value)

  async function login(form: LoginForm) {
    const res = await userAPI.login(form)
    const data = res.data
    token.value = data.token
    userInfo.value = data.user
    isLoggedIn.value = true
    storage.setToken(data.token)
    showToast('Login successful')
  }

  async function register(form: RegisterForm) {
    const res = await userAPI.register(form)
    const data = res.data
    token.value = data.token
    userInfo.value = data.user
    isLoggedIn.value = true
    storage.setToken(data.token)
    showToast('Registration successful')
  }

  async function fetchUserInfo() {
    try {
      const res = await userAPI.getInfo()
      userInfo.value = res.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    userInfo.value = null
    isLoggedIn.value = false
    storage.removeToken()
  }

  return { token, userInfo, isLoggedIn, login, register, fetchUserInfo, logout }
})