import { createBrowserClient } from "@supabase/ssr"

export interface TestMetrics {
  testType: string
  totalCompletions: number
  totalAttempts: number
  avgDurationMinutes: number
  completionRate: number
  avgScore: number
  medianDuration: number
  p95Duration: number
  commonDropoffQuestion: number | null
}

export interface CompletionSnapshot {
  timestamp: string
  testType: string
  completionTime: number
  questionsAnswered: number
  totalQuestions: number
  score?: number
}

/**
 * Log test completion time to metrics
 */
export async function logTestCompletion(
  userEmail: string,
  testType: string,
  durationMinutes: number,
  questionsCount: number,
  score?: number,
): Promise<void> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    await supabase.from("test_completion_metrics").insert({
      user_email: userEmail,
      test_type: testType,
      duration_minutes: durationMinutes,
      questions_count: questionsCount,
      completion_percentage: 100,
      started_at: new Date(Date.now() - durationMinutes * 60000).toISOString(),
      completed_at: new Date().toISOString(),
    })

    console.log(`[v0] Logged completion metrics for ${testType}`)
  } catch (e) {
    console.warn("[v0] Failed to log completion metrics:", e)
  }
}

/**
 * Get average completion time for a specific test
 */
export async function getAverageCompletionTime(testType: string): Promise<number> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase
      .from("test_completion_metrics")
      .select("duration_minutes")
      .eq("test_type", testType)
      .eq("completion_percentage", 100)

    if (error) {
      console.warn("[v0] Error fetching completion times:", error)
      return 0
    }

    if (!data || data.length === 0) return 0

    const total = data.reduce((sum, item) => sum + item.duration_minutes, 0)
    const average = total / data.length

    console.log(`[v0] Average completion time for ${testType}: ${average.toFixed(2)} minutes`)
    return parseFloat(average.toFixed(2))
  } catch (e) {
    console.warn("[v0] Exception getting average completion time:", e)
    return 0
  }
}

/**
 * Get completion time statistics by test type
 */
export async function getCompletionTimeStats(testType: string): Promise<{
  average: number
  median: number
  min: number
  max: number
  p95: number
  sampleSize: number
}> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase
      .from("test_completion_metrics")
      .select("duration_minutes")
      .eq("test_type", testType)
      .eq("completion_percentage", 100)
      .order("duration_minutes", { ascending: true })

    if (error || !data || data.length === 0) {
      return { average: 0, median: 0, min: 0, max: 0, p95: 0, sampleSize: 0 }
    }

    const durations = data.map((d) => d.duration_minutes)
    const sorted = [...durations].sort((a, b) => a - b)

    const average = durations.reduce((a, b) => a + b, 0) / durations.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const p95Index = Math.ceil(sorted.length * 0.95) - 1
    const p95 = sorted[Math.max(0, p95Index)]

    return {
      average: parseFloat(average.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      p95: parseFloat(p95.toFixed(2)),
      sampleSize: durations.length,
    }
  } catch (e) {
    console.warn("[v0] Exception getting completion time stats:", e)
    return { average: 0, median: 0, min: 0, max: 0, p95: 0, sampleSize: 0 }
  }
}

/**
 * Refresh test analytics summary
 */
export async function refreshAnalyticsSummary(testType: string): Promise<void> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    // Get completion metrics
    const stats = await getCompletionTimeStats(testType)

    // Get total completions
    const { count: totalCompletions } = await supabase
      .from("test_completion_metrics")
      .select("*", { count: "exact", head: true })
      .eq("test_type", testType)
      .eq("completion_percentage", 100)

    // Get total attempts
    const { count: totalAttempts } = await supabase
      .from("test_results")
      .select("*", { count: "exact", head: true })
      .eq("test_type", testType)

    // Update summary
    await supabase.from("test_analytics_summary").upsert({
      test_type: testType,
      total_completions: totalCompletions || 0,
      total_attempts: totalAttempts || 0,
      avg_duration_minutes: stats.average,
      median_duration_minutes: stats.median,
      p95_duration_minutes: stats.p95,
      completion_rate_percentage: totalAttempts
        ? ((totalCompletions || 0) / totalAttempts) * 100
        : 0,
      last_updated: new Date().toISOString(),
    })

    console.log(`[v0] Analytics summary updated for ${testType}`)
  } catch (e) {
    console.warn("[v0] Failed to refresh analytics summary:", e)
  }
}

/**
 * Get analytics summary for a test
 */
export async function getAnalyticsSummary(testType: string): Promise<TestMetrics | null> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase
      .from("test_analytics_summary")
      .select("*")
      .eq("test_type", testType)
      .single()

    if (error || !data) {
      // If summary doesn't exist, create it
      await refreshAnalyticsSummary(testType)
      return null
    }

    return {
      testType: data.test_type,
      totalCompletions: data.total_completions,
      totalAttempts: data.total_attempts,
      avgDurationMinutes: data.avg_duration_minutes,
      completionRate: data.completion_rate_percentage,
      avgScore: data.avg_score,
      medianDuration: data.median_duration_minutes,
      p95Duration: data.p95_duration_minutes,
      commonDropoffQuestion: data.common_dropoff_question,
    }
  } catch (e) {
    console.warn("[v0] Failed to get analytics summary:", e)
    return null
  }
}

/**
 * Get all test analytics summaries
 */
export async function getAllAnalyticsSummaries(): Promise<TestMetrics[]> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase
      .from("test_analytics_summary")
      .select("*")
      .order("last_updated", { ascending: false })

    if (error || !data) return []

    return data.map((d) => ({
      testType: d.test_type,
      totalCompletions: d.total_completions,
      totalAttempts: d.total_attempts,
      avgDurationMinutes: d.avg_duration_minutes,
      completionRate: d.completion_rate_percentage,
      avgScore: d.avg_score,
      medianDuration: d.median_duration_minutes,
      p95Duration: d.p95_duration_minutes,
      commonDropoffQuestion: d.common_dropoff_question,
    }))
  } catch (e) {
    console.warn("[v0] Failed to get all analytics summaries:", e)
    return []
  }
}

export const TestMetricsSystem = {
  logTestCompletion,
  getAverageCompletionTime,
  getCompletionTimeStats,
  refreshAnalyticsSummary,
  getAnalyticsSummary,
  getAllAnalyticsSummaries,
}
