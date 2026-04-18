import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const [usersResult, testsResult, booksResult, coachingResult] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("test_results").select("id", { count: "exact", head: true }),
      supabase.from("books").select("id", { count: "exact", head: true }),
      supabase.from("coaching_metrics").select("satisfaction_rating").not("satisfaction_rating", "is", null),
    ])

    // Calculate average satisfaction from real data
    const satisfactionScores = coachingResult.data || []
    const avgSatisfaction =
      satisfactionScores.length > 0
        ? satisfactionScores.reduce((sum, item) => sum + (item.satisfaction_rating || 0), 0) / satisfactionScores.length
        : 0

    return NextResponse.json({
      users: usersResult.count || 0,
      testsCompleted: testsResult.count || 0,
      booksAvailable: booksResult.count || 0,
      satisfactionPercentage: Math.round((avgSatisfaction / 5) * 100), // Convert 5-point scale to percentage
    })
  } catch (error) {
    console.error("[v0] Error fetching whitepaper stats:", error)
    return NextResponse.json(
      {
        users: 0,
        testsCompleted: 0,
        booksAvailable: 0,
        satisfactionPercentage: 0,
      },
      { status: 500 },
    )
  }
}
