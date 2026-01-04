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

    const { userEmail, sessionId, message, aiResponse, suggestions } = await request.json()

    if (!userEmail || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Saving coach conversation for:", userEmail)

    const { error: insertError } = await supabase.from("coach_conversations").insert({
      user_email: userEmail,
      conversation_title: "Coach Session",
      mentor_philosophy: "personalized-guidance",
      is_active: true,
      messages: {
        user_message: message,
        ai_response: aiResponse,
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        suggestions: suggestions.map((s: any) => s.text),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[v0] Error saving conversation:", insertError)
      return NextResponse.json({ error: "Failed to save conversation", details: insertError.message }, { status: 500 })
    }

    console.log("[v0] Conversation saved successfully")

    return NextResponse.json({ success: true, saved: true })
  } catch (error) {
    console.error("[v0] Error in coach conversation save:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
