const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const
type LogLevel = keyof typeof LOG_LEVELS

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug'

function formatTimestamp(): string {
  return new Date().toISOString()
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]
}

export const logger = {
  debug(...args: unknown[]): void {
    if (shouldLog('debug')) console.debug(`[${formatTimestamp()}] [DEBUG]`, ...args)
  },
  info(...args: unknown[]): void {
    if (shouldLog('info')) console.info(`[${formatTimestamp()}] [INFO]`, ...args)
  },
  warn(...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(`[${formatTimestamp()}] [WARN]`, ...args)
  },
  error(...args: unknown[]): void {
    if (shouldLog('error')) console.error(`[${formatTimestamp()}] [ERROR]`, ...args)
  }
}