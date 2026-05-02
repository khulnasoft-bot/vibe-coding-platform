/**
 * Simple in-memory rate limiter
 * Note: This is not suitable for multi-server deployments
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the window
   * @default 60
   */
  maxRequests?: number
  /**
   * Window size in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number
}

/**
 * Checks if a request should be rate limited
 * @returns true if the request is allowed, false if it should be blocked
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): boolean {
  const { maxRequests = 60, windowMs = 60 * 1000 } = options
  const now = Date.now()

  const entry = store.get(identifier)

  if (!entry || entry.resetAt <= now) {
    // First request or window has expired
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return true
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return false
  }

  // Increment count
  entry.count++
  return true
}

/**
 * Gets the remaining requests for an identifier
 */
export function getRemainingRequests(
  identifier: string,
  options: RateLimitOptions = {}
): number {
  const { maxRequests = 60 } = options
  const entry = store.get(identifier)

  if (!entry || entry.resetAt <= Date.now()) {
    return maxRequests
  }

  return Math.max(0, maxRequests - entry.count)
}
