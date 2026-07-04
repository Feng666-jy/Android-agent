import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'
import type { JwtPayload, RegisterInput, LoginInput } from '../types/index.js'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const authService = {
  async register(input: RegisterInput) {
    const { username, password, email } = input

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    })
    if (existing) {
      if (existing.username === username) {
        throw new AppError('Username already exists', -11)
      }
      throw new AppError('Email already exists', -12)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, email },
      select: { id: true, username: true, email: true, createdAt: true }
    })

    const token = generateToken({ userId: user.id, username: user.username })
    return { user, token }
  },

  async login(input: LoginInput) {
    const { username, password } = input

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      throw new AppError('Invalid username or password', -13)
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new AppError('Invalid username or password', -13)
    }

    const token = generateToken({ userId: user.id, username: user.username })
    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  },

  async getUserInfo(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true, updatedAt: true }
    })
    if (!user) {
      throw new AppError('User not found', -14)
    }
    return user
  },

  async updateProfile(userId: number, data: { email?: string; avatar?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, username: true, email: true, avatar: true, updatedAt: true }
    })
    return user
  }
}

export class AppError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
    this.name = 'AppError'
  }
}