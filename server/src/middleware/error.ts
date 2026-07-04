import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { serverError, fail } from '../utils/response.js'
import { logger } from '../utils/logger.js'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error('Unhandled error:', err.message, err.stack)

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        fail(res, 'Resource already exists', -20, 409)
        return
      case 'P2025':
        fail(res, 'Resource not found', -21, 404)
        return
      case 'P1001':
        fail(res, 'Database connection failed - is MySQL running?', -22, 503)
        return
      default:
        fail(res, `Database error: ${err.code}`, -23, 500)
        return
    }
  }

  // Prisma connection errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    fail(res, 'Database connection failed - is MySQL running?', -22, 503)
    return
  }

  // Generic server error
  serverError(res, process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message)
}