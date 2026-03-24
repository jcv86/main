import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { c1_score, c2_score, c3_score, c4_score, test_results_summary } = body

    console.log("[v0] Syncing performance for user:", user.id)

    // Insert or update user performance context
    const { data, error } = await supabase
      .from("user_performance_context")
      .upsert(
        {
          user_id: user.id,
          c1_score: c1_score ?? 0,
          c2_score: c2_score ?? 0,
          c3_score: c3_score ?? 0,
          c4_score: c4_score ?? 0,
          test_results_summary,
          last_test_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select()

    if (error) {
      console.error("[v0] Error syncing performance:", error)
      return NextResponse.json({ error: "Failed to sync performance" }, { status: 500 })
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error("[v0] Error in user-performance-sync:", error)
    return NextResponse.json({ error: "Failed to sync performance" }, { status: 500 })
  }
}
