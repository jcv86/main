import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { generateContextualSuggestions, type SuggestedQuestion } from "@/lib/suggestion-generator"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { contextType, performanceData, coachingMemory } = body as {
      contextType: string
      performanceData?: any
      coachingMemory?: any
    }

    console.log("[v0] Generating suggestions for user:", user.id, "context:", contextType)

    // Generate suggestions using AI
    const suggestions: SuggestedQuestion[] = await generateContextualSuggestions(
      user.id,
      contextType as any,
      performanceData,
      coachingMemory,
    )

    // Save to database
    const { error: saveError } = await supabase.from("contextual_suggestions").insert({
      user_id: user.id,
      context_type: contextType,
      questions: suggestions,
      based_on: performanceData?.based_on || "user_profile",
      performance_data: performanceData,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    if (saveError) {
      console.error("[v0] Error saving suggestions:", saveError)
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("[v0] Error in generate-suggestions:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
