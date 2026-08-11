import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '../types/index.js'
import { unauthorized } from '../utils/response.js'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set')

/**
 * 兼容 Query token 的鉴权中间件（SSE / EventSource 无法携带 Authorization header）。
 * 优先读 ?token=，其次回退到 Bearer header；与 authMiddleware 判定逻辑一致。
 */
export function authQueryMiddleware(req: Request, res: Response, next: NextFunction): void {
  let token = typeof req.query.token === 'string' ? req.query.token : undefined
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.slice(7)
  }
  if (!token) {
    unauthorized(res, 'No token provided')
    return
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload
    req.user = decoded
    next()
  } catch {
    unauthorized(res, 'Invalid or expired token')
  }
}
