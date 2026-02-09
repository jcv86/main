import { createBrowserClient } from "@supabase/ssr"

export interface ABTestVariant {
  id: string
  testType: string
  questionId: number
  variantName: string
  variantText: string
  config?: any
  isActive: boolean
  trafficPercentage: number
}

export interface ABTestResult {
  userId: string
  testType: string
  questionId: number
  variantName: string
  responseTimeMs: number
  responseQuality: number
  answerProvided: any
  timestamp: string
}

/**
 * Create or update an A/B test variant for a question
 */
export async function createABVariant(
  testType: string,
  questionId: number,
  variantName: string,
  variantText: string,
  config?: any,
  trafficPercentage: number = 50,
): Promise<{ success: boolean; variantId?: string; error?: string }> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    console.log(`[v0] Creating A/B variant for ${testType} question ${questionId}`)

    const { data, error } = await supabase
      .from("ab_test_question_variants")
      .upsert(
        {
          test_type: testType,
          question_id: questionId,
          variant_name: variantName,
          variant_text: variantText,
          variant_config: config,
          is_active: true,
          traffic_percentage: trafficPercentage,
        },
        {
          onConflict: "test_type,question_id,variant_name",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating A/B variant:", error)
      return { success: false, error: error.message }
    }

    return { success: true, variantId: data.id }
  } catch (e: any) {
    console.error("[v0] Exception creating A/B variant:", e)
    return { success: false, error: e.message }
  }
}

/**
 * Get A/B test variant for a question (random assignment based on traffic percentage)
 */
export async function getABVariant(
  testType: string,
  questionId: number,
  userEmail: string,
): Promise<{ variantName: string; variantText: string; variantId: string } | null> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    // Fetch all active variants for this question
    const { data: variants, error } = await supabase
      .from("ab_test_question_variants")
      .select("*")
      .eq("test_type", testType)
      .eq("question_id", questionId)
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (error || !variants || variants.length === 0) {
      console.log(`[v0] No A/B variants found for ${testType} question ${questionId}`)
      return null
    }

    // If only one variant, return it
    if (variants.length === 1) {
      return {
        variantName: variants[0].variant_name,
        variantText: variants[0].variant_text,
        variantId: variants[0].id,
      }
    }

    // Select variant based on traffic percentage (deterministic per user)
    const userHash = hashUserEmail(userEmail)
    const selectedVariant = selectVariantByTraffic(variants, userHash)

    console.log(
      `[v0] Selected variant '${selectedVariant.variant_name}' for ${testType} question ${questionId}`,
    )

    return {
      variantName: selectedVariant.variant_name,
      variantText: selectedVariant.variant_text,
      variantId: selectedVariant.id,
    }
  } catch (e: any) {
    console.error("[v0] Exception getting A/B variant:", e)
    return null
  }
}

/**
 * Log A/B test result for tracking
 */
export async function logABTestResult(
  userEmail: string,
  testType: string,
  questionId: number,
  variantName: string,
  responseTimeMs: number,
  responseQuality: number,
  answerProvided: any,
): Promise<void> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    await supabase.from("ab_test_results_tracking").insert({
      user_email: userEmail,
      test_type: testType,
      question_id: questionId,
      variant_name: variantName,
      response_time_ms: responseTimeMs,
      response_quality: responseQuality,
      answer_provided: answerProvided,
    })

    console.log(
      `[v0] Logged A/B test result for variant '${variantName}' (time: ${responseTimeMs}ms, quality: ${responseQuality})`,
    )
  } catch (e) {
    console.warn("[v0] Failed to log A/B test result:", e)
  }
}

/**
 * Get A/B test performance metrics
 */
export async function getABTestMetrics(
  testType: string,
  questionId: number,
): Promise<{
  variants: Array<{
    name: string
    avgResponseTimeMs: number
    avgResponseQuality: number
    responseCount: number
  }>
}> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase
      .from("ab_test_results_tracking")
      .select("variant_name, response_time_ms, response_quality")
      .eq("test_type", testType)
      .eq("question_id", questionId)

    if (error || !data) {
      return { variants: [] }
    }

    // Group by variant and calculate metrics
    const variantMetrics: Record<
      string,
      { responseTimeMs: number[]; responseQuality: number[]; count: number }
    > = {}

    data.forEach((result) => {
      if (!variantMetrics[result.variant_name]) {
        variantMetrics[result.variant_name] = {
          responseTimeMs: [],
          responseQuality: [],
          count: 0,
        }
      }

      variantMetrics[result.variant_name].responseTimeMs.push(
        result.response_time_ms || 0,
      )
      variantMetrics[result.variant_name].responseQuality.push(
        result.response_quality || 0,
      )
      variantMetrics[result.variant_name].count++
    })

    // Calculate averages
    const metrics = Object.entries(variantMetrics).map(
      ([variantName, metrics]) => ({
        name: variantName,
        avgResponseTimeMs: Math.round(
          metrics.responseTimeMs.reduce((a, b) => a + b, 0) / metrics.responseTimeMs.length,
        ),
        avgResponseQuality:
          metrics.responseQuality.reduce((a, b) => a + b, 0) / metrics.responseQuality.length,
        responseCount: metrics.count,
      }),
    )

    return { variants: metrics }
  } catch (e) {
    console.warn("[v0] Failed to get A/B test metrics:", e)
    return { variants: [] }
  }
}

/**
 * Disable an A/B test variant
 */
export async function disableABVariant(variantId: string): Promise<void> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    await supabase
      .from("ab_test_question_variants")
      .update({ is_active: false })
      .eq("id", variantId)

    console.log(`[v0] Disabled A/B variant ${variantId}`)
  } catch (e) {
    console.warn("[v0] Failed to disable A/B variant:", e)
  }
}

// Helper: Hash user email to a number (0-100)
function hashUserEmail(email: string): number {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash) % 100
}

// Helper: Select variant based on traffic percentage and user hash
function selectVariantByTraffic(variants: any[], userHash: number) {
  let accumulatedTraffic = 0

  for (const variant of variants) {
    accumulatedTraffic += variant.traffic_percentage
    if (userHash <= accumulatedTraffic) {
      return variant
    }
  }

  return variants[variants.length - 1]
}

export const ABTestSystem = {
  createABVariant,
  getABVariant,
  logABTestResult,
  getABTestMetrics,
  disableABVariant,
}
