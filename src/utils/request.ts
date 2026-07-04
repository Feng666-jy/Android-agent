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
      config.headers.Authorization = `Bearer ${token}`
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
      showToast(data.message || 'Request failed')
      return Promise.reject(new Error(data.message))
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          showToast('Login expired, please login again')
          storage.removeToken()
          window.location.href = '/login'
          break
        case 403:
          showToast('No permission')
          break
        case 404:
          showToast('Resource not found')
          break
        case 500:
          showToast('Server error')
          break
        default:
          showToast(`Error: ${status}`)
      }
    } else if (error.message.includes('Network Error')) {
      showToast('Network error, please check connection')
    } else {
      showToast('Unknown error')
    }
    return Promise.reject(error)
  }
)

export default request