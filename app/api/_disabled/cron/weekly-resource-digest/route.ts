import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

export async function GET(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get("authorization")?.replace("Bearer ", "")
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get all active users
    const { data: users } = await supabase.from("auth.users").select("id").limit(100)

    if (!users || users.length === 0) {
      return NextResponse.json({ success: true, digests_created: 0 })
    }

    let digestsCreated = 0

    // For each user, create personalized digest
    for (const user of users) {
      try {
        // Get user profile and performance
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

        const { data: performanceContext } = await supabase
          .from("user_performance_context")
          .select("*")
          .eq("user_id", user.id)
          .single()

        // Get top 7 resources for this user
        const { data: allResources } = await supabase
          .from("biblioteca")
          .select("*")
          .eq("source_type", "public_data")
          .order("relevance_score", { ascending: false })
          .limit(7)

        if (allResources && allResources.length > 0) {
          // Create digest entry
          await supabase.from("resource_digests").insert({
            user_id: user.id,
            resources: allResources.map((r: any) => ({
              id: r.id,
              name: r.name,
              category: r.category,
              url: r.base_url,
              relevance_score: r.relevance_score,
            })),
            digest_week: new Date().toISOString().split("T")[0],
            created_at: new Date().toISOString(),
          })

          digestsCreated++
        }
      } catch (userError) {
        console.error(`[v0] Error creating digest for user ${user.id}:`, userError)
        // Continue with next user
      }
    }

    return NextResponse.json({
      success: true,
      digests_created: digestsCreated,
      message: `Created ${digestsCreated} personalized resource digests`,
    })
  } catch (error) {
    console.error("[v0] Error in weekly resource digest cron:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
