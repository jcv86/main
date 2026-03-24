import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, variantId, userEmail } = await request.json()

    if (!sessionId || !variantId || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("coaching_sessions")
      .update({ prompt_variant_id: variantId })
      .eq("id", sessionId)

    if (error) {
      console.error("[v0] Error tracking prompt usage:", error)
      return NextResponse.json({ error: "Failed to track usage" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in prompt usage tracking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
