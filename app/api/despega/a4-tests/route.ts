import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    console.log("[v0] Fetching A4 tests for user:", user.id, "Category:", category)

    // Fetch available tests
    let query = supabase
      .from("a4_gamified_tests")
      .select("*")
      .eq("is_active", true)

    if (category) {
      query = query.eq("category", category)
    }

    const { data: tests, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    // Get user's completed tests
    const { data: completed } = await supabase
      .from("a4_user_test_completions")
      .select("test_id, score, completed_at")
      .eq("user_id", user.id)

    const completedIds = new Set(completed?.map(c => c.test_id) || [])

    // Enrich tests with completion status
    const enrichedTests = tests.map(test => ({
      ...test,
      completed: completedIds.has(test.id),
      userScore: completed?.find(c => c.test_id === test.id)?.score
    }))

    return NextResponse.json({ tests: enrichedTests })
  } catch (error) {
    console.error("[v0] A4 tests API error:", error)
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { testId, answers, score } = await req.json()

    console.log("[v0] Submitting test completion:", testId, "Score:", score)

    // Save test completion
    const { data, error } = await supabase
      .from("a4_user_test_completions")
      .insert([
        {
          user_id: user.id,
          test_id: testId,
          answers: answers,
          score: score,
          completed_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    // Update user points in pilar_progress
    const pointsEarned = Math.floor(score * 10)
    const { data: progress } = await supabase
      .from("despega_pilar_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("pilar", "a4")
      .single()

    if (progress) {
      await supabase
        .from("despega_pilar_progress")
        .update({ score: (progress.score || 0) + pointsEarned })
        .eq("id", progress.id)
    }

    console.log("[v0] Test completion saved, points earned:", pointsEarned)

    return NextResponse.json({ 
      success: true, 
      pointsEarned,
      completion: data 
    })
  } catch (error) {
    console.error("[v0] A4 test submission error:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}
