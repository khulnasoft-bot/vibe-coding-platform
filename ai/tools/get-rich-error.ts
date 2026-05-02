import { APIError } from '@vercel/sandbox/dist/api-client/api-error'

interface Params {
  args?: Record<string, unknown>
  action: string
  error: unknown
}

/**
 * Allows to parse a thrown error to check its metadata and construct a rich
 * message that can be handed to the LLM.
 */
export function getRichError({ action, args, error }: Params) {
  const fields = getErrorFields(error)
  let message = `Error during ${action}: ${fields.message}`
  if (args) message += `\nParameters: ${JSON.stringify(args, null, 2)}`
  if (fields.json) message += `\nJSON: ${JSON.stringify(fields.json, null, 2)}`
  if (fields.text) message += `\nText: ${fields.text}`
  if (fields.stack) message += `\nStack: ${fields.stack}`
  return {
    message: message,
    error: fields,
  }
}

function getErrorFields(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      message: String(error),
      json: error,
    }
  } else if (error instanceof APIError) {
    return {
      message: error.message,
      json: error.json,
      text: error.text,
      status: error.status,
      stack: error.stack,
    }
  } else {
    return {
      message: error.message,
      json: error,
      stack: error.stack,
    }
  }
}

/**
 * Determines if an error is transient and should be retried
 */
export function isTransientError(error: unknown): boolean {
  if (error instanceof APIError) {
    // Retry on rate limits or server errors
    return error.status === 429 || error.status >= 500
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('etimedout') ||
      message.includes('network')
    )
  }
  return false
}

/**
 * Retry wrapper for transient errors
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delayMs?: number } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000 } = options
  let lastError: unknown

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries && isTransientError(error)) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * Math.pow(2, i))
        )
        continue
      }
      throw error
    }
  }

  throw lastError
}
