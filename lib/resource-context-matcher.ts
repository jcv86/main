import { createServerClient } from "@/lib/supabase/server"

export interface ResourceMatch {
  resourceId: string
  resourceName: string
  category: string
  matchScore: number
  linkedAxes: string[]
  reason: string
  relevanceTags: string[]
}

export async function matchResourcesToContext(
  userId: string,
  userProfile: any,
  performanceData?: any,
): Promise<ResourceMatch[]> {
  try {
    const supabase = await createServerClient()

    // Get all Chilean public resources
    const { data: resources } = await supabase
      .from("biblioteca")
      .select("*")
      .eq("source_type", "public_data")
      .gt("relevance_score", 0.7)

    if (!resources || resources.length === 0) {
      return []
    }

    // Score each resource based on context
    const matches: ResourceMatch[] = resources.map((resource: any) => {
      let score = resource.relevance_score || 0.7

      // Map to axes based on category and tags
      const linkedAxes: string[] = []

      if (
        resource.category === "Competencias Laborales" ||
        resource.tags?.some((t: string) => t.toLowerCase().includes("competencia"))
      ) {
        linkedAxes.push("C1") // Clarity on career path
        score += 0.15
      }

      if (
        resource.category === "Educación Superior" ||
        resource.tags?.some((t: string) => t.toLowerCase().includes("educación"))
      ) {
        linkedAxes.push("C4") // Growth opportunities
        score += 0.1
      }

      if (
        resource.category === "Mercado Laboral" ||
        resource.tags?.some((t: string) => t.toLowerCase().includes("mercado"))
      ) {
        linkedAxes.push("C1")
        score += 0.15
      }

      if (resource.category === "Empleo" || resource.tags?.some((t: string) => t.toLowerCase().includes("empleo"))) {
        linkedAxes.push("C3") // Connection to opportunities
        score += 0.1
      }

      // Boost if user interests match
      if (userProfile?.interests?.length > 0) {
        const matchedTags =
          resource.tags?.filter((tag: string) =>
            userProfile.interests.some((interest: string) => tag.toLowerCase().includes(interest.toLowerCase())),
          ) || []
        score += matchedTags.length * 0.05
      }

      // Boost based on career stage
      if (userProfile?.careerStage === "early" && linkedAxes.includes("C4")) {
        score += 0.1
      }

      return {
        resourceId: resource.id,
        resourceName: resource.name,
        category: resource.category,
        matchScore: Math.min(score, 1.0),
        linkedAxes,
        reason: generateMatchReason(resource, userProfile, linkedAxes),
        relevanceTags: resource.tags || [],
      }
    })

    // Sort by match score and return top matches
    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
  } catch (error) {
    console.error("[v0] Error matching resources to context:", error)
    return []
  }
}

function generateMatchReason(resource: any, userProfile: any, linkedAxes: string[]): string {
  if (linkedAxes.includes("C1")) {
    return `Recurso de ${resource.category} para clarificar tu carrera profesional`
  }
  if (linkedAxes.includes("C4")) {
    return `Oportunidad de crecimiento en ${resource.category}`
  }
  if (linkedAxes.includes("C3")) {
    return `Conecta con oportunidades en ${resource.category}`
  }
  return `Recurso relevante: ${resource.category}`
}
