import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// This endpoint should be called by a cron job every 2 months
// Configure in Vercel: https://vercel.com/docs/cron-jobs
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    console.log("[v0] Starting bimonthly analysis...")

    // 1. Identify critical prompts
    const { data: criticalPrompts, error: criticalError } = await supabase.rpc("get_critical_prompts")

    if (criticalError) throw criticalError

    console.log(`[v0] Found ${criticalPrompts?.length || 0} critical prompts`)

    // 2. Create review tasks for each critical prompt
    const reviewTasks = criticalPrompts?.map((prompt: any) => ({
      prompt_version_id: prompt.version_id,
      severity: prompt.avg_satisfaction < 3 ? "high" : prompt.avg_satisfaction < 4 ? "medium" : "low",
      issue_type:
        prompt.avg_satisfaction < 4.3
          ? "low_satisfaction"
          : prompt.avg_action_completion < 0.6
            ? "low_action_completion"
            : "low_engagement",
      notes:
        `Automated bimonthly analysis detected issues:\n` +
        `- Satisfaction: ${prompt.avg_satisfaction?.toFixed(2)}/5\n` +
        `- Action Completion: ${(prompt.avg_action_completion * 100)?.toFixed(1)}%\n` +
        `- Engagement: ${prompt.avg_engagement?.toFixed(1)} messages\n` +
        `- Total Sessions: ${prompt.total_sessions}`,
    }))

    if (reviewTasks && reviewTasks.length > 0) {
      const { error: tasksError } = await supabase.from("prompt_review_tasks").insert(reviewTasks)

      if (tasksError) throw tasksError
      console.log(`[v0] Created ${reviewTasks.length} review tasks`)
    }

    // 3. Analyze A/B tests and identify winners
    const { data: abTests, error: abError } = await supabase
      .from("prompt_versions")
      .select(`
        *,
        metrics:coaching_metrics(count)
      `)
      .eq("is_active", true)
      .eq("is_published", false)

    if (abError) throw abError

    const testsWithEnoughData = abTests?.filter(
      (test: any) => test.metrics && test.metrics.length > 0 && test.metrics[0].count >= 30,
    )

    console.log(`[v0] Found ${testsWithEnoughData?.length || 0} A/B tests with enough data`)

    // 4. Create notifications for admins
    const notifications = []

    if (reviewTasks && reviewTasks.length > 0) {
      notifications.push({
        type: "critical_prompts_detected",
        title: "Prompts Críticos Detectados",
        message: `Se detectaron ${reviewTasks.length} prompts que necesitan revisión en el análisis bimestral.`,
        priority: "high",
        action_url: "/admin/review-workflow",
      })
    }

    if (testsWithEnoughData && testsWithEnoughData.length > 0) {
      notifications.push({
        type: "ab_tests_ready",
        title: "Tests A/B Listos para Análisis",
        message: `${testsWithEnoughData.length} tests A/B tienen suficientes datos para determinar ganadores.`,
        priority: "medium",
        action_url: "/admin/ab-test-results",
      })
    }

    if (notifications.length > 0) {
      const { error: notifError } = await supabase.from("admin_notifications").insert(notifications)

      if (notifError) throw notifError
      console.log(`[v0] Created ${notifications.length} admin notifications`)
    }

    // 5. Generate summary report
    const summary = {
      timestamp: new Date().toISOString(),
      critical_prompts_found: criticalPrompts?.length || 0,
      review_tasks_created: reviewTasks?.length || 0,
      ab_tests_ready: testsWithEnoughData?.length || 0,
      notifications_sent: notifications.length,
    }

    console.log("[v0] Bimonthly analysis completed:", summary)

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error: any) {
    console.error("[v0] Error in bimonthly analysis:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
