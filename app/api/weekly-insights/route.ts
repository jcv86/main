import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json({ error: "User ID and email required" }, { status: 400 })
    }

    // Check user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("weekly_insights_email")
      .eq("user_id", userId)
      .single()

    if (preferences && !preferences.weekly_insights_email) {
      return NextResponse.json({ message: "User has disabled weekly insights" }, { status: 200 })
    }

    // Get user's recent activity
    const { data: testResults } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_email", email)
      .order("completed_at", { ascending: false })
      .limit(5)

    const { data: goals } = await supabase
      .from("career_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "in_progress")

    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_email", email)
      .order("earned_at", { ascending: false })
      .limit(3)

    // Generate insights content
    const insightsContent = {
      weekSummary: {
        testsCompleted: testResults?.length || 0,
        goalsInProgress: goals?.length || 0,
        newAchievements: achievements?.length || 0,
      },
      recommendations: [
        "Completa tu evaluación de Inteligencia Emocional para obtener insights más profundos",
        "Revisa tus metas de carrera y actualiza tu progreso",
        "Explora nuevos libros en la biblioteca profesional",
      ],
      upcomingGoals: goals?.slice(0, 3) || [],
      recentAchievements: achievements || [],
    }

    // Save email history
    await supabase.from("email_insights_history").insert({
      user_id: userId,
      email_type: "weekly_insights",
      content: insightsContent,
      sent_at: new Date().toISOString(),
    })

    // In production, this would send an actual email via a service like SendGrid or Resend
    // For now, we'll just return the content
    return NextResponse.json({
      message: "Weekly insights generated successfully",
      insights: insightsContent,
    })
  } catch (error) {
    console.error("Error generating weekly insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data: history, error } = await supabase
      .from("email_insights_history")
      .select("*")
      .eq("user_id", userId)
      .order("sent_at", { ascending: false })
      .limit(10)

    if (error) throw error

    return NextResponse.json({ history: history || [] })
  } catch (error) {
    console.error("Error fetching insights history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
