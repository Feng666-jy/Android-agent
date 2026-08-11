import type { Request, Response, NextFunction } from 'express'
import { DbError } from '../db/errors.js'
import { serverError, fail } from '../utils/response.js'
import { logger } from '../utils/logger.js'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(`未处理的错误: ${err.message}`, err.stack)

  if (err instanceof DbError) {
    switch (err.kind) {
      case 'unique':
        fail(res, '资源已存在', -20, 409)
        return
      case 'not_found':
        fail(res, '资源不存在', -21, 404)
        return
      case 'connection':
        fail(res, '数据库连接失败', -22, 503)
        return
      default:
        fail(res, '数据库错误', -23, 500)
        return
    }
  }

  serverError(res, process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message)
}
