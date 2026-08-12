import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { logger } from './utils/logger.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error.js'
import { connectDatabase } from './prisma.js'
import { createServer } from 'node:http'
import { deviceBridge } from './services/android/bridge.js'

const app = express()
const PORT = parseInt(process.env.PORT || '3000', 10)

app.use(helmet({ contentSecurityPolicy: false }))
// CORS：支持逗号分隔多 origin；Capacitor WebView origin 为 https://localhost
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean)
app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

async function start(): Promise<void> {
  await connectDatabase()

  const server = createServer(app)
  deviceBridge.attach(server, '/ws/device')

  server.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`)
    logger.info(`Health check: http://localhost:${PORT}/health`)
    logger.info(`Device bridge: ws://localhost:${PORT}/ws/device`)
  })
}

start().catch(err => {
  logger.error('Failed to start server:', err)
  process.exit(1)
})

export default app
