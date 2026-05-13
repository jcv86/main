import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("email", user.email).single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching user profile:", error)
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.name || user.user_metadata?.full_name || "Usuario",
      },
      profile,
    })
  } catch (error) {
    console.error("[v0] Error in user profile API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, userCategory, preferences, personalityInsights, careerProfile, learningProfile } = body

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        email,
        name,
        user_category: userCategory || "standard",
        preferences: preferences || {},
        conversation_history: {
          totalMessages: 0,
          topics: [],
          lastActive: new Date().toISOString(),
          commonQuestions: [],
          progressTracking: {},
        },
        personality_insights: personalityInsights || {},
        career_profile: careerProfile || {},
        learning_profile: learningProfile || {},
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user profile:", error)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in user profile creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, ...updates } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .select()
      .single()

    if (error) {
      console.error("Error updating user profile:", error)
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in user profile update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
