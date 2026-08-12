import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { showToast } from 'vant'
import { storage } from './storage'
import type { ApiResponse } from '@/types'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
    if (token && config.headers) {
      config.headers.Authorization = 'Bearer ' + token
    }
    // 手机端（Capacitor WebView）：登录时保存的服务器地址优先，
    // 把相对路径 /api/xxx 改写为 http://电脑IP:3000/api/xxx
    const serverBase = storage.getServerBase()
    if (serverBase && config.url && !config.url.startsWith('http')) {
      config.url = serverBase.replace(/\/+$/, '') + '/api' + config.url
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const data = response.data as ApiResponse
    if (data.code !== 0) {
      showToast(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    return data as any
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          showToast('登录已过期，请重新登录')
          storage.removeToken()
          window.location.href = '/login'
          break
        case 403:
          showToast('没有权限')
          break
        case 404:
          showToast('资源不存在')
          break
        case 500:
          showToast('服务器错误')
          break
        default:
          showToast('错误: ' + status)
      }
    } else if (error.message.includes('Network Error')) {
      showToast('网络错误，请检查连接')
    } else {
      showToast('未知错误')
    }
    return Promise.reject(error)
  }
)

export default request
