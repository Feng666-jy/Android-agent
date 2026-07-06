export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResult {
  user: UserInfo;
  token: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

export interface AiModel {
  id: number;
  modelName: string;
  displayName: string;
  apiProvider: string;
  status: number;
  sort: number;
  createTime?: string;
  updateTime?: string;
}