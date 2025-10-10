import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data: goals, error } = await supabase
      .from("career_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ goals: goals || [] })
  } catch (error) {
    console.error("Error fetching career goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, category, targetDate, priority } = body

    if (!userId || !title) {
      return NextResponse.json({ error: "User ID and title required" }, { status: 400 })
    }

    const { data: goal, error } = await supabase
      .from("career_goals")
      .insert({
        user_id: userId,
        title,
        description,
        category: category || "general",
        target_date: targetDate,
        priority: priority || "medium",
        status: "in_progress",
        progress: 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ goal })
  } catch (error) {
    console.error("Error creating career goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { goalId, progress, status } = body

    if (!goalId) {
      return NextResponse.json({ error: "Goal ID required" }, { status: 400 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (progress !== undefined) updateData.progress = progress
    if (status) updateData.status = status

    const { data: goal, error } = await supabase
      .from("career_goals")
      .update(updateData)
      .eq("id", goalId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ goal })
  } catch (error) {
    console.error("Error updating career goal:", error)
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}
