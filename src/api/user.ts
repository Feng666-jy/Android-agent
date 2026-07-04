import request from '@/utils/request'
import type { ApiResponse, AuthResult, LoginForm, RegisterForm, UserInfo } from '@/types'

export const userAPI = {
  login(data: LoginForm): Promise<ApiResponse<AuthResult>> {
    return request.post('/user/login', data)
  },

  register(data: RegisterForm): Promise<ApiResponse<AuthResult>> {
    return request.post('/user/register', data)
  },

  getInfo(): Promise<ApiResponse<UserInfo>> {
    return request.get('/user/info')
  },

  updateProfile(data: { email?: string; avatar?: string }): Promise<ApiResponse<UserInfo>> {
    return request.put('/user/profile', data)
  }
}