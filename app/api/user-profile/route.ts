import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("user_profiles").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }
      throw error
    }

    // Transform database format to application format
    const profile = {
      id: data.id,
      email: data.email,
      name: data.name,
      preferences: data.preferences,
      testResults: data.test_results,
      conversationHistory: data.conversation_history,
      personalityInsights: data.personality_insights,
      careerProfile: data.career_profile,
      learningProfile: data.learning_profile,
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const profileData = {
      email: body.email,
      name: body.name,
      preferences: body.preferences,
      test_results: body.testResults,
      conversation_history: body.conversationHistory,
      personality_insights: body.personalityInsights,
      career_profile: body.careerProfile,
      learning_profile: body.learningProfile,
    }

    const { data, error } = await supabase.from("user_profiles").insert(profileData).select().single()

    if (error) {
      throw error
    }

    // Transform back to application format
    const profile = {
      id: data.id,
      email: data.email,
      name: data.name,
      preferences: data.preferences,
      testResults: data.test_results,
      conversationHistory: data.conversation_history,
      personalityInsights: data.personality_insights,
      careerProfile: data.career_profile,
      learningProfile: data.learning_profile,
    }

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("Error creating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const profileData = {
      name: body.name,
      preferences: body.preferences,
      test_results: body.testResults,
      conversation_history: body.conversationHistory,
      personality_insights: body.personalityInsights,
      career_profile: body.careerProfile,
      learning_profile: body.learningProfile,
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update(profileData)
      .eq("email", body.email)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Transform back to application format
    const profile = {
      id: data.id,
      email: data.email,
      name: data.name,
      preferences: data.preferences,
      testResults: data.test_results,
      conversationHistory: data.conversation_history,
      personalityInsights: data.personality_insights,
      careerProfile: data.career_profile,
      learningProfile: data.learning_profile,
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
