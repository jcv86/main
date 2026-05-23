// Advanced caching layer for API responses
import type { NextRequest, NextResponse } from 'next/server'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // seconds
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startCleanup()
  }

  /**
   * Generate cache key from request
   */
  getCacheKey(prefix: string, userId: string, params?: Record<string, any>): string {
    const paramStr = params ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}` : ''
    return `${prefix}:${userId}${paramStr}`
  }

  /**
   * Get from cache if valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const age = (Date.now() - entry.timestamp) / 1000
    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    console.log(`[v0] Cache HIT: ${key}`)
    return entry.data as T
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds
    })
    console.log(`[v0] Cache SET: ${key} (TTL: ${ttlSeconds}s)`)
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key)
    console.log(`[v0] Cache INVALIDATED: ${key}`)
  }

  /**
   * Invalidate by pattern
   */
  invalidatePattern(pattern: string): void {
    let count = 0
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
        count++
      }
    }
    if (count > 0) {
      console.log(`[v0] Cache INVALIDATED ${count} entries matching: ${pattern}`)
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    console.log(`[v0] Cache CLEARED (${size} entries)`)
  }

  /**
   * Get cache stats
   */
  getStats() {
    let totalSize = 0
    let expiredCount = 0
    const now = Date.now()

    for (const entry of this.cache.values()) {
      const age = (now - entry.timestamp) / 1000
      if (age > entry.ttl) {
        expiredCount++
      } else {
        totalSize += JSON.stringify(entry.data).length
      }
    }

    return {
      entries: this.cache.size,
      expiredEntries: expiredCount,
      approximateSizeBytes: totalSize,
      approximateSizeMB: (totalSize / 1024 / 1024).toFixed(2)
    }
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      let removed = 0
      const now = Date.now()

      for (const [key, entry] of this.cache.entries()) {
        const age = (now - entry.timestamp) / 1000
        if (age > entry.ttl) {
          this.cache.delete(key)
          removed++
        }
      }

      if (removed > 0) {
        console.log(`[v0] Cache cleanup: removed ${removed} expired entries`)
      }
    }, 60000) // Run every minute
  }

  /**
   * Stop cleanup
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager()

/**
 * Cache decorator for async functions
 */
export function cached<T>(ttlSeconds: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // Simple cache key from function name and args
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`
      const cached = cacheManager.get<T>(cacheKey)
      if (cached) return cached

      const result = await originalMethod.apply(this, args)
      cacheManager.set(cacheKey, result, ttlSeconds)
      return result
    }

    return descriptor
  }
}

/**
 * Middleware to cache GET responses
 */
export function withCaching(ttlSeconds: number = 300) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return handler(req)
      }

      // Generate cache key from URL and user ID
      const userId = req.headers.get('x-user-id') || 'anonymous'
      const cacheKey = `http:${userId}:${req.nextUrl.pathname}:${req.nextUrl.search}`

      // Check cache
      const cached = cacheManager.get<NextResponse>(cacheKey)
      if (cached) {
        return cached.clone()
      }

      // Call handler
      const response = await handler(req)

      // Cache successful responses only
      if (response.status === 200 && response.headers.get('content-type')?.includes('application/json')) {
        cacheManager.set(cacheKey, response.clone(), ttlSeconds)
      }

      return response
    }
  }
}
