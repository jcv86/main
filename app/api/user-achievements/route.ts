import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch user achievements
    const { data: achievements, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_email", email)
      .order("earned_at", { ascending: false })

    if (error) {
      console.error("Error fetching achievements:", error)
      return NextResponse.json({ achievements: [] }, { status: 200 })
    }

    return NextResponse.json({ achievements: achievements || [] }, { status: 200 })
  } catch (error) {
    console.error("Error in achievements API:", error)
    return NextResponse.json({ achievements: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userEmail, achievementType, achievementName, description, badgeIcon, xpReward } = body

    if (!userEmail || !achievementName) {
      return NextResponse.json({ error: "User email and achievement name are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if achievement already exists
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_email", userEmail)
      .eq("achievement_name", achievementName)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Achievement already earned" }, { status: 200 })
    }

    // Award achievement
    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_email: userEmail,
        achievement_type: achievementType || "milestone",
        achievement_name: achievementName,
        achievement_description: description,
        badge_icon: badgeIcon || "trophy",
        xp_reward: xpReward || 100,
        earned_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error awarding achievement:", error)
      return NextResponse.json({ error: "Failed to award achievement" }, { status: 500 })
    }

    return NextResponse.json({ achievement: data }, { status: 201 })
  } catch (error) {
    console.error("Error in achievement creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
