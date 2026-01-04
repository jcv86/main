import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      },
    )

    const { userEmail } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 400 })
    }

    console.log("[v0] Loading coach history for:", userEmail)

    const { data, error } = await supabase
      .from("coach_conversations")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("[v0] Error loading conversation:", error)
      return NextResponse.json({ suggestions: [] })
    }

    if (!data || data.length === 0) {
      console.log("[v0] No previous conversations found")
      return NextResponse.json({ suggestions: [] })
    }

    const latestConversation = data[0]
    const messagesData = latestConversation.messages
    const lastSuggestions = messagesData?.suggestions || []

    console.log("[v0] Loaded suggestions from history:", lastSuggestions.length)

    const formattedSuggestions = lastSuggestions.slice(0, 5).map((text: string, index: number) => ({
      id: `loaded_${index}`,
      text,
      category: determineSuggestionCategory(text),
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
    }))

    return NextResponse.json({ suggestions: formattedSuggestions, success: true })
  } catch (error) {
    console.error("[v0] Error in coach conversation load:", error)
    return NextResponse.json({ suggestions: [], error: String(error) })
  }
}

function determineSuggestionCategory(text: string): "career" | "skills" | "development" {
  const lower = text.toLowerCase()
  if (lower.includes("habilidad") || lower.includes("skill")) return "skills"
  if (lower.includes("carrera") || lower.includes("profesional")) return "career"
  return "development"
}
