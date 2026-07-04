import type { Request, Response, NextFunction } from 'express'
import { authService, AppError } from '../services/auth.service.js'
import { success, fail } from '../utils/response.js'
import { logger } from '../utils/logger.js'

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body)
      logger.info('用户注册: ' + result.user.username)
      success(res, result, '注册成功')
    } catch (error) {
      if (error instanceof AppError) {
        fail(res, error.message, error.code)
      } else {
        next(error)
      }
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body)
      logger.info('用户登录: ' + result.user.username)
      success(res, result, '登录成功')
    } catch (error) {
      if (error instanceof AppError) {
        fail(res, error.message, error.code)
      } else {
        next(error)
      }
    }
  },

  async getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
      const user = await authService.getUserInfo(userId)
      success(res, user)
    } catch (error) {
      if (error instanceof AppError) {
        fail(res, error.message, error.code)
      } else {
        next(error)
      }
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
      const { email, avatar } = req.body
      const user = await authService.updateProfile(userId, { email, avatar })
      success(res, user, '资料已更新')
    } catch (error) {
      if (error instanceof AppError) {
        fail(res, error.message, error.code)
      } else {
        next(error)
      }
    }
  }
}