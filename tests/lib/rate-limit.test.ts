import { checkRateLimit, getRemainingRequests } from '@/lib/rate-limit'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear the rate limit store between tests
    // Note: This is a simple in-memory store, so we can't easily clear it
    // In a real implementation, you'd want to export a clear function
  })

  it('should allow requests within limit', () => {
    const identifier = 'test-ip-1'

    for (let i = 0; i < 60; i++) {
      expect(checkRateLimit(identifier)).toBe(true)
    }
  })

  it('should block requests over limit', () => {
    const identifier = 'test-ip-2'

    for (let i = 0; i < 60; i++) {
      checkRateLimit(identifier)
    }

    expect(checkRateLimit(identifier)).toBe(false)
  })

  it('should track remaining requests', () => {
    const identifier = 'test-ip-3'

    expect(getRemainingRequests(identifier)).toBe(60)

    checkRateLimit(identifier)
    expect(getRemainingRequests(identifier)).toBe(59)
  })
})
