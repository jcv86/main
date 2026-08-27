/**
 * Rate limiting middleware for Next.js
 * Prevents API abuse and DDoS attacks
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: Request) => string
}

interface RequestData {
  count: number
  resetTime: number
}

// In-memory store (use Redis in production for distributed systems)
const requestStore = new Map<string, RequestData>()

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
}

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  const keyGenerator = finalConfig.keyGenerator || ((req: Request) => {
    // Use IP address as key (from headers or fallback)
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown'
    return ip
  })

  return async (req: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
    const key = keyGenerator(req)
    const now = Date.now()

    // Clean up expired entries
    const data = requestStore.get(key)
    if (data && now > data.resetTime) {
      requestStore.delete(key)
    }

    // Get or create entry
    const entry = requestStore.get(key) || {
      count: 0,
      resetTime: now + finalConfig.windowMs,
    }

    // Increment counter
    entry.count++
    requestStore.set(key, entry)

    const allowed = entry.count <= finalConfig.maxRequests
    const remaining = Math.max(0, finalConfig.maxRequests - entry.count)

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
    }
  }
}

// Pre-configured limiters for common endpoints
export const rateLimiters = {
  // Strict limit for auth endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  }),

  // Read-heavy authenticated product journeys legitimately issue several API
  // requests per screen (day state, progress, evidence and gamification).
  // Keep reads isolated from mutations so normal navigation cannot exhaust the
  // budget needed to save a completed mission.
  apiRead: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 600,
  }),

  // Mutations retain a tighter abuse boundary, but have their own counter.
  apiWrite: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 120,
  }),

  // Generous limit for public endpoints
  public: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 300,
  }),

  // Strict limit for AI endpoints (expensive)
  ai: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
  }),
}

export async function checkRateLimit(
  req: Request,
  limiter: ReturnType<typeof createRateLimiter>
): Promise<Response | null> {
  const limit = await limiter(req)

  if (!limit.allowed) {
    const resetDate = new Date(limit.resetTime)
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((limit.resetTime - Date.now()) / 1000),
        resetAt: resetDate.toISOString(),
      }),
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': limit.resetTime.toString(),
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return null
}
