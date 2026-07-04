import { Router } from 'express'
import { z } from 'zod'
import { authController } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters').max(50),
  email: z.string().email('Invalid email format')
})

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

const updateProfileSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  avatar: z.string().url('Invalid URL').optional()
})

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.get('/info', authMiddleware, authController.getInfo)
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile)

export default router