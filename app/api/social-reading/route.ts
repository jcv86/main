import { createClient } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const userEmail = request.nextUrl.searchParams.get("userEmail")

  if (!userEmail) {
    return NextResponse.json({ error: "userEmail is required" }, { status: 400 })
  }

  try {
    // Fetch book clubs
    const { data: clubs, error: clubsError } = await supabase
      .from("book_clubs")
      .select("*")
      .order("created_at", { ascending: false })

    if (clubsError) throw clubsError

    // Fetch discussions
    const { data: discussions, error: discussionsError } = await supabase
      .from("book_discussions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (discussionsError) throw discussionsError

    // Fetch reading groups
    const { data: groups, error: groupsError } = await supabase
      .from("reading_groups")
      .select("*")
      .order("created_at", { ascending: false })

    if (groupsError) throw groupsError

    return NextResponse.json({
      clubs: clubs || [],
      discussions: discussions || [],
      groups: groups || [],
    })
  } catch (error) {
    console.error("[v0] Error in social-reading API:", error)
    return NextResponse.json({ error: "Failed to load social data" }, { status: 500 })
  }
}
