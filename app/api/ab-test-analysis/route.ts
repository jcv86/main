import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { performStatisticalTest, calculateConfidenceInterval, interpretEffectSize } from "@/lib/statistics"

// Thresholds from document (page 61-63)
const THRESHOLDS = {
  satisfaction: 4.3,
  actionCompletion: 0.6,
  engagement: 0.7,
  minSampleSize: 30, // Minimum sessions per variant to make decision
  significanceLevel: 0.05, // 95% confidence
}

interface VariantMetrics {
  version_id: string
  version_name: string
  coach_type: string
  conversation_category: string
  total_sessions: number
  avg_satisfaction: number
  action_completion_rate: number
  avg_engagement: number
  overall_score: number
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all active A/B tests with their metrics
    const { data: activeTests, error: testsError } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", false)

    if (testsError) throw testsError

    const results = []

    // Group by coach_type and conversation_category to find competing variants
    const testGroups = new Map<string, any[]>()

    for (const test of activeTests || []) {
      const key = `${test.coach_type}-${test.conversation_category}`
      if (!testGroups.has(key)) {
        testGroups.set(key, [])
      }
      testGroups.get(key)!.push(test)
    }

    // Analyze each group
    for (const [key, variants] of testGroups) {
      if (variants.length < 2) continue // Need at least 2 variants to compare

      // Get metrics for each variant
      const variantMetrics: VariantMetrics[] = []
      const rawMetricsData: Map<string, any> = new Map()

      for (const variant of variants) {
        const { data: metrics, error: metricsError } = await supabase.rpc("get_variant_metrics", {
          variant_id: variant.id,
        })

        if (metricsError) {
          console.error("Error fetching metrics:", metricsError)
          continue
        }

        if (metrics && metrics.length > 0) {
          const m = metrics[0]
          variantMetrics.push({
            version_id: variant.id,
            version_name: variant.version_name,
            coach_type: variant.coach_type,
            conversation_category: variant.conversation_category,
            total_sessions: m.total_sessions || 0,
            avg_satisfaction: m.avg_satisfaction || 0,
            action_completion_rate: m.action_completion_rate || 0,
            avg_engagement: m.avg_engagement || 0,
            overall_score: calculateOverallScore(m),
          })
          rawMetricsData.set(variant.id, m)
        }
      }

      // Check if we have enough data
      const hasEnoughData = variantMetrics.every((v) => v.total_sessions >= THRESHOLDS.minSampleSize)

      if (!hasEnoughData) {
        results.push({
          group: key,
          status: "insufficient_data",
          variants: variantMetrics,
          message: `Need at least ${THRESHOLDS.minSampleSize} sessions per variant`,
        })
        continue
      }

      let statisticalAnalysis = null
      if (hasEnoughData && variantMetrics.length === 2) {
        const [control, variant] = variantMetrics
        const controlRaw = rawMetricsData.get(control.version_id)
        const variantRaw = rawMetricsData.get(variant.version_id)

        // Perform statistical test on satisfaction (primary metric)
        const satisfactionTest = performStatisticalTest(
          {
            sampleSize: control.total_sessions,
            mean: control.avg_satisfaction,
            stdDev: controlRaw?.satisfaction_std_dev || 0.5,
          },
          {
            sampleSize: variant.total_sessions,
            mean: variant.avg_satisfaction,
            stdDev: variantRaw?.satisfaction_std_dev || 0.5,
          },
        )

        // Calculate confidence intervals
        const controlCI = calculateConfidenceInterval(
          control.avg_satisfaction,
          controlRaw?.satisfaction_std_dev || 0.5,
          control.total_sessions,
        )
        const variantCI = calculateConfidenceInterval(
          variant.avg_satisfaction,
          variantRaw?.satisfaction_std_dev || 0.5,
          variant.total_sessions,
        )

        statisticalAnalysis = {
          pValue: satisfactionTest.pValue,
          zScore: satisfactionTest.zScore,
          isSignificant: satisfactionTest.isSignificant,
          effectSize: satisfactionTest.effectSize,
          effectSizeInterpretation: interpretEffectSize(satisfactionTest.effectSize),
          controlCI,
          variantCI,
        }
      }

      // Find winner (highest overall score)
      const winner = variantMetrics.reduce((best, current) =>
        current.overall_score > best.overall_score ? current : best,
      )

      // Check if winner meets quality thresholds
      const meetsThresholds =
        winner.avg_satisfaction >= THRESHOLDS.satisfaction &&
        winner.action_completion_rate >= THRESHOLDS.actionCompletion &&
        winner.avg_engagement >= THRESHOLDS.engagement

      results.push({
        group: key,
        status: meetsThresholds ? "ready_to_publish" : "no_clear_winner",
        winner: winner,
        variants: variantMetrics,
        meetsThresholds,
        statisticalAnalysis,
        message: meetsThresholds ? `Winner identified: ${winner.version_name}` : "No variant meets quality thresholds",
      })
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error("Error analyzing A/B tests:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { version_id, auto_publish = false } = await request.json()
    const supabase = await createClient()

    // Get the winning variant
    const { data: winner, error: winnerError } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("id", version_id)
      .single()

    if (winnerError) throw winnerError

    // Deactivate other variants in the same group
    const { error: deactivateError } = await supabase
      .from("prompt_versions")
      .update({ is_active: false })
      .eq("coach_type", winner.coach_type)
      .eq("conversation_category", winner.conversation_category)
      .neq("id", version_id)

    if (deactivateError) throw deactivateError

    // Publish the winner
    const { error: publishError } = await supabase
      .from("prompt_versions")
      .update({
        is_published: true,
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", version_id)

    if (publishError) throw publishError

    // Create notification for admins
    await supabase.from("admin_notifications").insert({
      type: auto_publish ? "auto_publish" : "manual_publish",
      title: `Prompt Published: ${winner.version_name}`,
      message: `${winner.coach_type} - ${winner.conversation_category} prompt has been published`,
      metadata: {
        version_id,
        version_name: winner.version_name,
        coach_type: winner.coach_type,
        conversation_category: winner.conversation_category,
        auto_publish,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Successfully published ${winner.version_name}`,
    })
  } catch (error: any) {
    console.error("Error publishing winner:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function calculateOverallScore(metrics: any): number {
  const satisfaction = (metrics.avg_satisfaction || 0) / 5 // Normalize to 0-1
  const actionCompletion = metrics.action_completion_rate || 0
  const engagement = Math.min((metrics.avg_engagement || 0) / 10, 1) // Cap at 10 messages

  // Weighted average (satisfaction is most important per document)
  return satisfaction * 0.5 + actionCompletion * 0.3 + engagement * 0.2
}
