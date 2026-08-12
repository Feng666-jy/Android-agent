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

/** 校验 token 并返回 payload（WSS 设备连接等非 HTTP 场景复用） */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET!) as JwtPayload
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthorized(res, 'No token provided')
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    unauthorized(res, 'Invalid or expired token')
  }
}
