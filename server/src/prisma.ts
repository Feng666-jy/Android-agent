import { PrismaClient } from "@prisma/client"
import { logger } from "./utils/logger.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..", "..")
const dbUrl = "file:" + path.join(projectRoot, "dev.db").replace(/\\/g, "/")

export const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } },
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
})

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect()
    logger.info("Database connected:", dbUrl)
  } catch (error) {
    logger.error("Failed to connect to database:", error instanceof Error ? error.message : error)
    logger.warn("Server will start without database.")
  }
}