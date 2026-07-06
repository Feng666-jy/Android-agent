import { PrismaClient } from "@prisma/client"
import { logger } from "./utils/logger.js"

const datasourceUrl = process.env.DATABASE_URL

export const prisma = new PrismaClient(
  datasourceUrl
    ? { datasources: { db: { url: datasourceUrl } } }
    : undefined
)

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect()
    logger.info("Database connected")
  } catch (error) {
    logger.error("Failed to connect to database:", error instanceof Error ? error.message : error)
    logger.warn("Server will start without database.")
  }
}