import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      userId,
      profileContext, // { testResults, currentRole, goals, interests, careerStage }
      category, // optional filter
      limit = 5,
    } = await request.json()

    // Get user performance context for personalization
    const { data: performanceContext } = await supabase
      .from("user_performance_context")
      .select("*")
      .eq("user_id", userId)
      .single()

    // Build recommendation query based on user profile
    let query = supabase
      .from("biblioteca")
      .select("*")
      .eq("source_type", "public_data")
      .gt("relevance_score", 0.8)
      .order("relevance_score", { ascending: false })

    // Filter by category if provided
    if (category) {
      query = query.eq("category", category)
    }

    // Filter by tags based on user interests
    if (profileContext?.interests?.length > 0) {
      // PostgreSQL array overlap operator
      query = query.overlaps("tags", profileContext.interests)
    }

    const { data: recommendations } = await query.limit(limit)

    // Score and rank recommendations based on profile match
    const scoredRecommendations = (recommendations || []).map((resource: any) => {
      let score = resource.relevance_score || 0.8

      // Boost score if tags match user interests
      if (profileContext?.interests?.length > 0) {
        const matchedTags =
          resource.tags?.filter((tag: string) =>
            profileContext.interests.some((interest: string) => tag.toLowerCase().includes(interest.toLowerCase())),
          ) || []
        score += matchedTags.length * 0.05
      }

      // Boost score based on career stage
      if (profileContext?.careerStage === "early" && resource.category === "Competencias Laborales") {
        score += 0.1
      }
      if (profileContext?.careerStage === "advanced" && resource.category === "Mercado Laboral") {
        score += 0.1
      }

      return {
        ...resource,
        matchScore: Math.min(score, 1.0),
        reason: generateRecommendationReason(resource, profileContext),
      }
    })

    // Sort by match score
    scoredRecommendations.sort((a: any, b: any) => b.matchScore - a.matchScore)

    // Save recommendation interaction for analytics
    const { data: user } = await supabase.auth.getUser()
    if (user?.user?.id) {
      await supabase
        .from("resource_recommendations_log")
        .insert({
          user_id: user.user.id,
          resources_recommended: scoredRecommendations.map((r: any) => r.id),
          profile_context: profileContext,
          timestamp: new Date().toISOString(),
        })
        .select()
    }

    return NextResponse.json({
      success: true,
      recommendations: scoredRecommendations,
      totalRecommendations: scoredRecommendations.length,
      profileContext: performanceContext,
      message: `Found ${scoredRecommendations.length} personalized Chilean resources for your profile`,
    })
  } catch (error) {
    console.error("[v0] Error in Chilean resources recommendations:", error)
    return NextResponse.json({ success: false, error: "Failed to generate recommendations" }, { status: 500 })
  }
}

function generateRecommendationReason(resource: any, profileContext: any): string {
  if (profileContext?.careerStage === "early") {
    if (resource.category === "Competencias Laborales") {
      return "Perfecto para construir tu base de competencias laborales"
    }
  }

  if (
    profileContext?.interests?.some((i: string) =>
      resource.tags?.some((t: string) => t.toLowerCase().includes(i.toLowerCase())),
    )
  ) {
    return `Relevante para tu interés en ${profileContext.interests[0]}`
  }

  return `Recurso de ${resource.category} con alta relevancia para tu perfil`
}
