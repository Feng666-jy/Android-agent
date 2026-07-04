import type { Response } from 'express'
import type { ApiResponse } from '../types/index.js'

export function success<T>(res: Response, data: T, message = '成功'): void {
  const body: ApiResponse<T> = { code: 0, message, data }
  res.json(body)
}

export function fail(res: Response, message: string, code = -1, status = 400): void {
  const body: ApiResponse<null> = { code, message, data: null }
  res.status(status).json(body)
}

export function unauthorized(res: Response, message = '未授权'): void {
  fail(res, message, -2, 401)
}

export function forbidden(res: Response, message = '禁止访问'): void {
  fail(res, message, -3, 403)
}

export function notFound(res: Response, message = '未找到'): void {
  fail(res, message, -4, 404)
}

export function serverError(res: Response, message = '服务器内部错误'): void {
  fail(res, message, -5, 500)
}