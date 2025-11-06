import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface CacheConfig {
  ttlHours?: number
  useUserContext?: boolean
}

export interface PerformanceMetrics {
  responseTimeMs: number
  cacheHit: boolean
  tokensUsed?: number
  estimatedCost?: number
}

/**
 * Generate hash for query caching
 */
export function generateQueryHash(query: string, userContext?: any): string {
  const contextString = userContext ? JSON.stringify(userContext) : ""
  const combinedString = `${query}|${contextString}`
  return crypto.createHash("sha256").update(combinedString).digest("hex")
}

/**
 * Get cached brain response (returns response from cache if valid and not expired)
 */
export async function getCachedResponse(queryHash: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.rpc("get_cached_response", {
      p_query_hash: queryHash,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting cached response:", error)
    return null
  }
}

/**
 * Cache brain response with configurable TTL
 */
export async function cacheResponse(
  queryHash: string,
  queryText: string,
  responseData: any,
  config: CacheConfig = {},
): Promise<boolean> {
  try {
    const { ttlHours = 24, useUserContext = false } = config

    const userContextHash = useUserContext ? generateQueryHash(queryText) : null

    await supabase.rpc("cache_brain_response", {
      p_query_hash: queryHash,
      p_query_text: queryText,
      p_response_data: responseData,
      p_user_context_hash: userContextHash,
      p_ttl_hours: ttlHours,
    })

    return true
  } catch (error) {
    console.error("Error caching response:", error)
    return false
  }
}

/**
 * Track API usage for cost optimization
 */
export async function trackAPIUsage(
  endpoint: string,
  provider: string,
  model: string,
  tokensUsed: number,
  responseTimeMs: number,
  cacheHit = false,
): Promise<void> {
  try {
    // Pricing per 1K tokens (approximate)
    const pricingMap: Record<string, number> = {
      "gpt-4o": 0.015,
      "gpt-4o-mini": 0.0015,
      "gpt-3.5-turbo": 0.001,
      "text-embedding-3-small": 0.0001,
      "text-embedding-3-large": 0.0003,
    }

    const pricePerToken = pricingMap[model] || 0.001
    const estimatedCost = (tokensUsed / 1000) * pricePerToken

    await supabase.rpc("track_api_usage", {
      p_endpoint: endpoint,
      p_provider: provider,
      p_model: model,
      p_tokens: tokensUsed,
      p_cost: estimatedCost,
      p_response_time: responseTimeMs,
      p_cache_hit: cacheHit,
    })
  } catch (error) {
    console.error("Error tracking API usage:", error)
  }
}

/**
 * Track analytics event for user behavior analysis
 */
export async function trackAnalyticsEvent(
  eventType: string,
  eventData: any,
  userEmail?: string,
  sessionId?: string,
): Promise<void> {
  try {
    await supabase.from("brain_analytics_events").insert({
      user_email: userEmail,
      session_id: sessionId,
      event_type: eventType,
      event_category: eventData.category || "general",
      event_data: eventData,
    })
  } catch (error) {
    console.error("Error tracking analytics event:", error)
  }
}

/**
 * Get performance metrics for monitoring
 */
export async function getPerformanceMetrics(days = 7): Promise<{
  avgResponseTime: number
  cacheHitRate: number
  totalCost: number
  totalQueries: number
  uniqueUsers: number
}> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: analytics } = await supabase
      .from("brain_analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .eq("event_type", "brain_query")

    const { data: apiUsage } = await supabase
      .from("api_usage_tracking")
      .select("*")
      .gte("created_at", startDate.toISOString())

    const totalQueries = analytics?.length || 0
    const uniqueUsers = new Set(analytics?.map((a) => a.user_email)).size || 0

    const avgResponseTime =
      apiUsage?.reduce((sum, u) => sum + (u.response_time_ms || 0), 0) / (apiUsage?.length || 1) || 0

    const cacheHits = apiUsage?.filter((u) => u.cache_hit).length || 0
    const cacheHitRate = (cacheHits / (apiUsage?.length || 1)) * 100

    const totalCost = apiUsage?.reduce((sum, u) => sum + (u.estimated_cost || 0), 0) || 0

    return {
      avgResponseTime: Math.round(avgResponseTime),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalQueries,
      uniqueUsers,
    }
  } catch (error) {
    console.error("Error getting performance metrics:", error)
    return {
      avgResponseTime: 0,
      cacheHitRate: 0,
      totalCost: 0,
      totalQueries: 0,
      uniqueUsers: 0,
    }
  }
}

/**
 * A/B Test assignment (assigns user to test variant)
 */
export async function getABTestVariant(userEmail: string, testName: string): Promise<string> {
  try {
    // Check if user already has assignment
    const { data: existing } = await supabase
      .from("user_ab_assignments")
      .select("variant_name")
      .eq("user_email", userEmail)
      .eq("test_name", testName)
      .single()

    if (existing) {
      return existing.variant_name
    }

    // Get active variants
    const { data: variants } = await supabase
      .from("ab_test_variants")
      .select("variant_name")
      .eq("test_name", testName)
      .eq("is_active", true)

    if (!variants || variants.length === 0) {
      return "control"
    }

    // Randomly assign variant
    const randomIndex = Math.floor(Math.random() * variants.length)
    const variantName = variants[randomIndex].variant_name

    // Save assignment
    await supabase.from("user_ab_assignments").insert({
      user_email: userEmail,
      test_name: testName,
      variant_name: variantName,
    })

    return variantName
  } catch (error) {
    console.error("Error getting A/B test variant:", error)
    return "control"
  }
}

/**
 * Track A/B test event for variant analysis
 */
export async function trackABTestEvent(
  userEmail: string,
  testName: string,
  variantName: string,
  eventType: string,
  eventData?: any,
): Promise<void> {
  try {
    await supabase.from("ab_test_events").insert({
      user_email: userEmail,
      test_name: testName,
      variant_name: variantName,
      event_type: eventType,
      event_data: eventData || {},
    })
  } catch (error) {
    console.error("Error tracking A/B test event:", error)
  }
}

/**
 * Clean up expired cache entries (run as scheduled job)
 */
export async function cleanupExpiredCache(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("brain_response_cache")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select("id")

    if (error) throw error
    return data?.length || 0
  } catch (error) {
    console.error("Error cleaning up expired cache:", error)
    return 0
  }
}
