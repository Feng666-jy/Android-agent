import type { Response } from 'express'
import type { ApiResponse } from '../types/index.js'

export function success<T>(res: Response, data: T, message = 'Success'): void {
  const body: ApiResponse<T> = { code: 0, message, data }
  res.json(body)
}

export function fail(res: Response, message: string, code = -1, status = 400): void {
  const body: ApiResponse<null> = { code, message, data: null }
  res.status(status).json(body)
}

export function unauthorized(res: Response, message = 'Unauthorized'): void {
  fail(res, message, -2, 401)
}

export function forbidden(res: Response, message = 'Forbidden'): void {
  fail(res, message, -3, 403)
}

export function notFound(res: Response, message = 'Not Found'): void {
  fail(res, message, -4, 404)
}

export function serverError(res: Response, message = 'Internal Server Error'): void {
  fail(res, message, -5, 500)
}