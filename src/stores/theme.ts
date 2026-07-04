import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '@/utils/storage'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(storage.getTheme() === 'dark')

  function init() {
    const saved = storage.getTheme()
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
    applyTheme()
  }

  function applyTheme() {
    const theme = isDark.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    storage.setTheme(theme)
  }

  watch(isDark, applyTheme)

  return { isDark, init, toggle }
})