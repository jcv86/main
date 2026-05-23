/**
 * Production-safe logger utility
 * Replaces console.log with proper structured logging
 * Only logs errors and warnings in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  log(message: string, context?: Record<string, unknown>): void {
    this.write('info', message, context)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.write('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.write('warn', message, context)
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.write('error', message, context)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.write('debug', message, context)
    }
  }

  private write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // Only log errors/warns in production, all in development
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    }

    // Use appropriate console method
    const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
    
    // Log JSON format for structured logging
    console[method](JSON.stringify(entry))
  }
}

export const logger = new Logger()
