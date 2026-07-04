import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { serverError, fail } from '../utils/response.js'
import { logger } from '../utils/logger.js'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error('未处理的错误:', err.message, err.stack)

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        fail(res, '资源已存在', -20, 409)
        return
      case 'P2025':
        fail(res, '资源不存在', -21, 404)
        return
      case 'P1001':
        fail(res, '数据库连接失败', -22, 503)
        return
      default:
        fail(res, `数据库错误: ${err.code}`, -23, 500)
        return
    }
  }

  // Prisma connection errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    fail(res, '数据库连接失败', -22, 503)
    return
  }

  // Generic server error
  serverError(res, process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message)
}
