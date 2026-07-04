export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface JwtPayload {
  userId: number
  username: string
}

export interface RegisterInput {
  username: string
  password: string
  email: string
}

export interface LoginInput {
  username: string
  password: string
}