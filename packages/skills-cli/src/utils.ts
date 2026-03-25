// Color output utilities
export const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  white: '\x1b[37m'
}

export function log(color: string, prefix: string, message: string) {
  return `${color}${prefix}${colors.reset} ${message}`
}

export function info(msg: string) { return log(colors.blue, 'ℹ', msg) }
export function success(msg: string) { return log(colors.green, '✓', msg) }
export function warn(msg: string) { return log(colors.yellow, '⚠', msg) }
export function error(msg: string) { return log(colors.red, '✗', msg) }
