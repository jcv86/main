/**
 * API Response Caching Configuration
 * 
 * Implements caching strategies for performance optimization
 * Reduces database queries and improves API response times
 */

import { unstable_cache } from 'next/cache'

/**
 * Cached wrapper for API calls
 * Automatically revalidates after specified duration
 */
export function createCachedFetch<T>(
  fn: () => Promise<T>,
  {
    key,
    revalidate = 300, // Default 5 minutes
    tags = [],
  }: {
    key: string
    revalidate?: number | false
    tags?: string[]
  }
): () => Promise<T> {
  return unstable_cache(fn, [key], {
    revalidate,
    tags,
  })
}

/**
 * Fetch with automatic caching for user profile
 */
export const cachedGetUserProfile = createCachedFetch(
  async () => {
    // This would be replaced with actual fetch logic
    return null
  },
  {
    key: 'user-profile',
    revalidate: 600,
    tags: ['user-profile'],
  }
)

/**
 * Fetch with automatic caching for pillar progress
 */
export const cachedGetPillarProgress = createCachedFetch(
  async () => {
    return null
  },
  {
    key: 'pillar-progress',
    revalidate: 300,
    tags: ['pillar-progress'],
  }
)

/**
 * Fetch with automatic caching for test results
 */
export const cachedGetTestResults = createCachedFetch(
  async () => {
    return null
  },
  {
    key: 'test-results',
    revalidate: 1800, // 30 minutes
    tags: ['test-results'],
  }
)

/**
 * Revalidate cache on-demand
 */
export async function revalidateCache(tags: string[]) {
  // Import the revalidateTag function from next/cache
  const { revalidateTag } = await import('next/cache')
  
  for (const tag of tags) {
    revalidateTag(tag)
  }
}
