import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, coachType, conversationCategory } = await request.json()

    if (!userEmail || !coachType || !conversationCategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: existingAssignment } = await supabase
      .from("prompt_variant_assignments")
      .select("variant_id, prompt_variants(id, version, prompt_content)")
      .eq("user_email", userEmail)
      .eq("coach_type", coachType)
      .eq("conversation_category", conversationCategory)
      .single()

    if (existingAssignment && existingAssignment.prompt_variants) {
      // User already assigned, return their variant
      return NextResponse.json({
        promptContent: (existingAssignment.prompt_variants as any).prompt_content,
        variantId: (existingAssignment.prompt_variants as any).id,
        version: (existingAssignment.prompt_variants as any).version,
      })
    }

    const { data: activeVariants, error: variantsError } = await supabase
      .from("prompt_variants")
      .select("*")
      .eq("coach_type", coachType)
      .eq("conversation_category", conversationCategory)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (variantsError) {
      console.error("[v0] Error fetching variants:", variantsError)
      return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 })
    }

    if (!activeVariants || activeVariants.length === 0) {
      // No active variants, return control version
      const { data: controlVariant } = await supabase
        .from("prompt_variants")
        .select("*")
        .eq("coach_type", coachType)
        .eq("conversation_category", conversationCategory)
        .eq("is_control", true)
        .single()

      if (!controlVariant) {
        return NextResponse.json({ error: "No control variant found" }, { status: 404 })
      }

      return NextResponse.json({
        promptContent: controlVariant.prompt_content,
        variantId: controlVariant.id,
        version: controlVariant.version,
      })
    }

    const randomIndex = Math.floor(Math.random() * activeVariants.length)
    const assignedVariant = activeVariants[randomIndex]

    await supabase.from("prompt_variant_assignments").insert({
      user_email: userEmail,
      variant_id: assignedVariant.id,
      coach_type: coachType,
      conversation_category: conversationCategory,
      assigned_at: new Date().toISOString(),
    })

    return NextResponse.json({
      promptContent: assignedVariant.prompt_content,
      variantId: assignedVariant.id,
      version: assignedVariant.version,
    })
  } catch (error) {
    console.error("[v0] Error in prompt assignment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
