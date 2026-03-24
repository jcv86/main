import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    // Transform data to match Message interface
    const messages = data.map((conv: {
      id: string | number
      type: string
      content: string
      created_at: string
      category?: string | null
      suggested_actions?: unknown[] | null
      metadata?: Record<string, unknown> | null
    }) => ({
      id: conv.id.toString(),
      type: conv.type,
      content: conv.content,
      timestamp: new Date(conv.created_at),
      category: conv.category,
      suggestedActions: conv.suggested_actions || [],
      isExpanded: false,
      metadata: conv.metadata || {},
    }))

    return NextResponse.json(messages.reverse())
  } catch (error) {
    console.error("Error in conversations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, type, content, category, suggestedActions, metadata } = body

    if (!userEmail || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert({
        user_email: userEmail,
        type,
        content,
        category: category || null,
        suggested_actions: suggestedActions || [],
        metadata: metadata || {},
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving conversation:", error)
      return NextResponse.json({ error: "Failed to save conversation" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in conversation creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()
    const { error } = await supabase.from("ai_conversations").delete().eq("user_email", email)

    if (error) {
      console.error("Error deleting conversations:", error)
      return NextResponse.json({ error: "Failed to delete conversations" }, { status: 500 })
    }

    return NextResponse.json({ message: "Conversations deleted successfully" })
  } catch (error) {
    console.error("Error in conversation deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
