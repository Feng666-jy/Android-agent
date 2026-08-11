const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const;
type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "debug";

function formatTimestamp(): string {
  return new Date().toISOString();
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

function formatEntry(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}]`;
  return entry.data !== undefined
    ? `${base} ${entry.message}`
    : `${base} ${entry.message}`;
}

function createLogger(context: string) {
  function log(level: LogLevel, message: string, data?: unknown): void {
    if (!shouldLog(level)) return;
    const entry: LogEntry = { timestamp: formatTimestamp(), level, context, message, data };
    const output = formatEntry(entry);
    switch (level) {
      case "debug": console.debug(output); break;
      case "info":  console.info(output);  break;
      case "warn":  console.warn(output);  break;
      case "error": console.error(output); break;
    }
  }

  return {
    debug(message: string, data?: unknown): void { log("debug", message, data); },
    info(message: string, data?: unknown): void { log("info", message, data); },
    warn(message: string, data?: unknown): void { log("warn", message, data); },
    error(message: string, data?: unknown): void { log("error", message, data); },
    child(subContext: string) {
      return createLogger(`${context}:${subContext}`);
    }
  };
}

export const logger = createLogger("app");