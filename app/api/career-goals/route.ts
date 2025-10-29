import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = await createClient()

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
    const { userId, userEmail, title, description, category, targetDate, priority } = body

    console.log("[v0] Creating career goal for userId:", userId, "email:", userEmail)

    if (!userId || !title) {
      return NextResponse.json({ error: "User ID and title required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    if (userEmail) {
      console.log("[v0] Upserting user to ensure they exist...")

      const { error: upsertError } = await adminClient.from("users").upsert(
        {
          id: userId,
          email: userEmail,
          full_name: userEmail.split("@")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email", // Use email as conflict key instead of id
          ignoreDuplicates: false,
        },
      )

      if (upsertError) {
        console.error("[v0] Error upserting user:", upsertError.message)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }

      console.log("[v0] User upserted successfully")
    }

    console.log("[v0] Inserting career goal...")
    const { data: goal, error } = await adminClient
      .from("career_goals")
      .insert({
        user_id: userId,
        title,
        description,
        category: category || "general",
        target_date: targetDate || null,
        priority: priority || "medium",
        status: "in_progress",
        progress: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error inserting career goal:", error.message)
      throw error
    }

    console.log("[v0] Career goal created successfully:", goal)
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

    const supabase = await createClient()

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
