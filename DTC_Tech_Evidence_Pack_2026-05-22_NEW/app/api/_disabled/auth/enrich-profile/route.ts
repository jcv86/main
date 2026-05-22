import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { enrichProfileFromGoogle, enrichProfileFromLinkedIn } from "@/lib/enrich-profile"

/**
 * Endpoint para enriquecer el perfil después de autenticarse
 * Se llama desde el callback de NextAuth
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Auth Callback: Starting profile enrichment...")

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] No session found")
      return NextResponse.json(
        { success: false, error: "No session" },
        { status: 401 }
      )
    }

    const userId = user.id

    if (!userId) {
      console.error("[v0] No user ID in session")
      return NextResponse.json(
        { success: false, error: "No user ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { provider, profile, accessToken } = body

    console.log("[v0] Enriching profile for provider:", provider)

    if (provider === "google" && profile) {
      await enrichProfileFromGoogle(userId, {
        email: profile.email,
        name: profile.name,
        image: profile.image,
      })
    } else if (provider === "linkedin" && profile && accessToken) {
      await enrichProfileFromLinkedIn(userId, profile, accessToken)
    }

    console.log("[v0] Profile enrichment completed")

    return NextResponse.json({
      success: true,
      message: "Profile enriched successfully",
      userId,
    })
  } catch (error) {
    console.error("[v0] Error in auth callback:", error)
    return NextResponse.json(
      { success: false, error: "Enrichment failed" },
      { status: 500 }
    )
  }
}
