import { createClient } from "@/app/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obtener stats del usuario
    const { data: stats } = await supabase
      .from("user_reading_stats")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // Obtener libros completados
    const { data: completedBooks } = await supabase
      .from("user_progress")
      .select("book_id, completed_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })

    // Obtener logros
    const { data: achievements } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)

    // Calcular streak actual
    let currentStreak = stats?.current_streak || 0
    if (completedBooks && completedBooks.length > 0) {
      const lastRead = new Date(completedBooks[0].completed_at)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff <= 1) {
        currentStreak = stats?.current_streak || 1
      }
    }

    return NextResponse.json({
      stats: {
        current_streak: currentStreak,
        total_points: stats?.total_points || 0,
        total_books_completed: completedBooks?.length || 0,
        books_in_progress: stats?.books_in_progress || [],
      },
      achievements: achievements || [],
      recentlyCompleted: completedBooks?.slice(0, 3) || [],
    })
  } catch (error) {
    console.error("[v0] Progress error:", error)
    return NextResponse.json({ error: "Error fetching progress" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookId, action, points } = await request.json()

    // Actualizar stats
    const { data: currentStats } = await supabase
      .from("user_reading_stats")
      .select("*")
      .eq("user_id", user.id)
      .single()

    const newPoints = (currentStats?.total_points || 0) + (points || 0)

    const { error } = await supabase
      .from("user_reading_stats")
      .upsert(
        {
          user_id: user.id,
          total_points: newPoints,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

    if (error) throw error

    return NextResponse.json({
      success: true,
      newPoints,
    })
  } catch (error) {
    console.error("[v0] Update progress error:", error)
    return NextResponse.json({ error: "Error updating progress" }, { status: 500 })
  }
}
