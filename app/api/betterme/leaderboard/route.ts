import { createClient } from "@/app/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Obtener top usuarios por puntos
    const { data: topUsers, error } = await supabase
      .from("user_reading_stats")
      .select("user_id, points, reading_streak, books_read")
      .order("points", { ascending: false })
      .limit(100)

    if (error) throw error

    // Enriquecer con información de usuarios
    const enrichedUsers = await Promise.all(
      topUsers.map(async (stat, index) => {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", stat.user_id)
          .single()

        return {
          rank: index + 1,
          user_id: stat.user_id,
          name: userProfile?.full_name || "Usuario",
          avatar: userProfile?.avatar_url,
          points: stat.points,
          streak: stat.reading_streak,
          booksCompleted: stat.books_read,
        }
      })
    )

    // Obtener ranking por streak
    const { data: streakRanking } = await supabase
      .from("user_reading_stats")
      .select("user_id, reading_streak")
      .order("reading_streak", { ascending: false })
      .limit(10)

    const topStreaks = await Promise.all(
      streakRanking?.map(async (stat, index) => {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", stat.user_id)
          .single()

        return {
          rank: index + 1,
          name: userProfile?.full_name || "Usuario",
          streak: stat.reading_streak,
        }
      }) || []
    )

    return NextResponse.json({
      topUsers: enrichedUsers,
      topStreaks,
      totalParticipants: topUsers.length,
    })
  } catch (error) {
    console.error("[v0] Leaderboard error:", error)
    return NextResponse.json(
      { error: "Error fetching leaderboard" },
      { status: 500 }
    )
  }
}
