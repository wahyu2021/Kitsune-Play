/**
 * @fileoverview Structured logger for the renderer process.
 * @module renderer/utils/logger
 */

const isDev = import.meta.env.DEV

type LogScope = 'Audio' | 'System' | 'Game' | 'UI'

/** Scoped logger with colored output for different log levels. */
export const logger = {
  info: (scope: LogScope, message: string): void => {
    console.info(
      `%c[${scope}]%c ${message}`,
      'color: #3b82f6; font-weight: bold;',
      'color: inherit;'
    )
  },

  warn: (scope: LogScope, message: string, details?: unknown): void => {
    console.warn(
      `%c[${scope}]%c ${message}`,
      'color: #f59e0b; font-weight: bold;',
      'color: inherit;'
    )
    if (details && isDev) console.warn(details)
  },

  error: (scope: LogScope, message: string, error?: unknown): void => {
    console.error(
      `%c[${scope}]%c ${message}`,
      'color: #ef4444; font-weight: bold;',
      'color: inherit;'
    )
    if (error) console.error(error)
  },

  debug: (scope: LogScope, message: string, details?: unknown): void => {
    if (isDev) {
      console.log(
        `%c[${scope}]%c ${message}`,
        'color: #10b981; font-weight: bold;',
        'color: inherit;'
      )
      if (details) console.log(details)
    }
  }
}
