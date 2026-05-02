/**
 * Security utilities for validating inputs and preventing common attacks
 */

/**
 * Validates that a sandbox ID matches the expected format
 * Vercel Sandbox IDs typically start with "sbx_"
 */
export function validateSandboxId(sandboxId: string): boolean {
  if (!sandboxId || typeof sandboxId !== 'string') {
    return false
  }

  // Sandbox ID should be a non-empty string with reasonable length
  if (sandboxId.length < 10 || sandboxId.length > 100) {
    return false
  }

  // Should only contain alphanumeric characters, underscores, and hyphens
  const validPattern = /^[a-zA-Z0-9_-]+$/
  return validPattern.test(sandboxId)
}

/**
 * Validates file paths to prevent directory traversal attacks
 * Ensures paths stay within the sandbox root directory
 */
export function validateFilePath(path: string): boolean {
  if (!path || typeof path !== 'string') {
    return false
  }

  // Check for directory traversal attempts
  if (path.includes('..') || path.includes('~')) {
    return false
  }

  // Check for absolute paths that might escape the sandbox
  if (path.startsWith('/') || path.startsWith('\\')) {
    return false
  }

  // Check for null bytes
  if (path.includes('\0')) {
    return false
  }

  // Validate path length
  if (path.length > 4096) {
    return false
  }

  return true
}

/**
 * Validates that a port number is valid
 */
export function validatePort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

/**
 * Sanitizes a command argument to prevent command injection
 */
export function sanitizeArgument(arg: string): string {
  // Remove null bytes
  return arg.replace(/\0/g, '')
}

/**
 * Validates command arguments
 */
export function validateArgs(args: string[]): boolean {
  if (!Array.isArray(args)) {
    return false
  }

  // Limit number of arguments
  if (args.length > 50) {
    return false
  }

  // Validate each argument
  for (const arg of args) {
    if (typeof arg !== 'string') {
      return false
    }
    if (arg.length > 1000) {
      return false
    }
    // Check for null bytes
    if (arg.includes('\0')) {
      return false
    }
  }

  return true
}
