import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase.from("user_profiles").select("*").eq("email", email).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in user profile API:", error)
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

    const supabase = createClient()
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

    const supabase = createClient()
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
