import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { unstable_cache } from "next/cache"

async function getTestResults(userId: string) {
  const supabase = createClient()

  // Get the latest test results
  const { data, error } = await supabase
    .from("unified_test_results")
    .select("*")
    .eq("test_type", "personality_assessment")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("[v0] Error fetching test results:", error)
    return null
  }

  return data
}

// Cache results for 1 hour
const cachedGetTestResults = unstable_cache(
  async (userId: string) => getTestResults(userId),
  ["test-results"],
  { revalidate: 3600, tags: ["test-results"] }
)

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = await cachedGetTestResults(user.id)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
