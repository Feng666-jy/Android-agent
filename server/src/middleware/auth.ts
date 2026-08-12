import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '../types/index.js'
import { unauthorized } from '../utils/response.js'
import { verifyApiKey } from '../services/api-key/service.js'

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

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthorized(res, 'No token provided')
    return
  }

  const token = authHeader.split(' ')[1]
  // Phase 5（T38）：sk_ 前缀视为 API Key（只存哈希，校验 O(1)）
  if (token.startsWith('sk_')) {
    try {
      const identity = await verifyApiKey(token)
      if (!identity) {
        unauthorized(res, 'Invalid API key')
        return
      }
      req.user = {
        userId: identity.userId,
        apiKeyId: identity.apiKeyId,
        apiKeyScope: identity.scope
      }
      next()
      return
    } catch {
      unauthorized(res, 'Invalid API key')
      return
    }
  }

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    unauthorized(res, 'Invalid or expired token')
  }
}
