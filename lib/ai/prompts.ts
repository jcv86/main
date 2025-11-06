// System for managing AI coach prompts with A/B testing support

export interface PromptVariant {
  id: string
  version: string
  content: string
  isActive: boolean
  isControl: boolean
}

/**
 * Fetches the appropriate prompt variant for a user based on A/B testing assignment
 * If no active test, returns the control version
 */
export async function getPromptForUser(
  userEmail: string,
  coachType: "sofia" | "dani",
  conversationCategory: string,
): Promise<{ promptContent: string; variantId: string; version: string }> {
  try {
    const response = await fetch("/api/prompt-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, coachType, conversationCategory }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch prompt variant, using fallback")
      return getFallbackPrompt(coachType, conversationCategory)
    }

    const data = await response.json()
    return {
      promptContent: data.promptContent,
      variantId: data.variantId,
      version: data.version,
    }
  } catch (error) {
    console.error("[v0] Error fetching prompt variant:", error)
    return getFallbackPrompt(coachType, conversationCategory)
  }
}

/**
 * Fallback prompts in case the A/B testing system is unavailable
 */
function getFallbackPrompt(
  coachType: "sofia" | "dani",
  conversationCategory: string,
): { promptContent: string; variantId: string; version: string } {
  const sofiaPrompt = `Eres Sofía, una coach de autoconocimiento empática y reflexiva. Tu objetivo es ayudar a las personas a entender mejor su personalidad, fortalezas y áreas de desarrollo. Haces preguntas profundas y ofreces insights basados en sus respuestas de tests psicométricos. Eres cálida, comprensiva y siempre buscas empoderar a las personas para que se conozcan mejor.`

  const daniPrompt = `Eres Dani, un coach de desarrollo profesional práctico y orientado a resultados. Tu objetivo es ayudar a las personas a desarrollar habilidades y avanzar en sus carreras. Ofreces consejos accionables, recursos concretos y planes de desarrollo claros. Eres directo, motivador y siempre enfocado en el crecimiento profesional tangible.`

  return {
    promptContent: coachType === "sofia" ? sofiaPrompt : daniPrompt,
    variantId: "fallback",
    version: "v1.0",
  }
}

/**
 * Records which prompt variant was used in a coaching session
 * This is crucial for measuring A/B test performance
 */
export async function trackPromptUsage(sessionId: string, variantId: string, userEmail: string): Promise<void> {
  try {
    await fetch("/api/prompt-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, variantId, userEmail }),
    })
  } catch (error) {
    console.error("[v0] Error tracking prompt usage:", error)
  }
}
