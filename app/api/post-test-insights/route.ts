import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { cerebroIntelligence } from "@/lib/cerebro-intelligence"
import { semanticSearch } from "@/lib/embeddings"
import { createClient } from "@/lib/supabase"

export const runtime = "nodejs"

// Schema for structured insights
const InsightSchema = z.object({
  insights: z.array(
    z.object({
      source: z.enum(["openai", "cerebro", "hybrid"]),
      category: z.string(),
      title: z.string(),
      description: z.string(),
      confidence: z.number().min(0).max(1),
      priority: z.enum(["high", "medium", "low"]),
      reasoningSource: z.string(),
      personalizedContext: z.string().optional(),
      actionableSteps: z.array(z.string()),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      timeframe: z.string(),
      difficulty: z.string(),
      source: z.enum(["openai", "cerebro", "hybrid"]),
      matchScore: z.number().min(0).max(100).describe("Percentage match to user profile (0-100)"),
      isHighlighted: z.boolean().optional().describe("True if this recommendation should be highlighted (best in threshold)"),
      inThresholdZone: z.boolean().optional().describe("True if match score is in 68-72% range"),
    }),
  ),
  developmentPlan: z.object({
    shortTerm: z.array(z.string()),
    mediumTerm: z.array(z.string()),
    longTerm: z.array(z.string()),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const { testType, results, userId, testResponses } = await request.json()

    if (!testType || !results || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Starting hybrid insights generation for", testType)
    const startTime = Date.now()

    // Step 1: Generate OpenAI insights (fast, general analysis)
    const openaiInsights = await generateOpenAIInsights(testType, results, testResponses)

    // Step 2: Generate Cerebro insights (personalized, context-aware)
    const cerebroInsights = await generateCerebroInsights(userId, testType, results, testResponses)

    // Step 3: Merge and rank insights
    const mergedInsights = mergeAndRankInsights(openaiInsights, cerebroInsights)

    // Step 4: Store hybrid insights
    await storeHybridInsights(userId, testType, mergedInsights)

    // Step 5: Generate predictive insights for future
    await generatePredictiveInsights(userId, testType, results, mergedInsights)

    const processingTime = Date.now() - startTime
    console.log("[v0] Hybrid insights generated in", processingTime, "ms")

    return NextResponse.json({
      ...mergedInsights,
      processingTime,
      metadata: {
        openaiInsightsCount: openaiInsights.insights.length,
        cerebroInsightsCount: cerebroInsights.insights.length,
        totalInsights: mergedInsights.insights.length,
      },
    })
  } catch (error) {
    console.error("Error generating hybrid insights:", error)
    return NextResponse.json(
      {
        error: "Failed to generate insights",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * Generate insights using OpenAI (general analysis)
 */
async function generateOpenAIInsights(testType: string, results: any, responses: any): Promise<any> {
  const prompt = `Analiza los siguientes resultados del test "${testType}" y genera insights profesionales detallados.

Resultados del Test:
${JSON.stringify(results, null, 2)}

Respuestas del Usuario:
${JSON.stringify(responses, null, 2)}

Genera un análisis completo que incluya:
1. Insights clave sobre fortalezas y áreas de desarrollo
2. Recomendaciones específicas y accionables
3. Plan de desarrollo a corto, mediano y largo plazo

Enfócate en:
- Análisis basado en evidencia de los resultados
- Recomendaciones prácticas y específicas
- Pasos accionables con timeframes claros
- Contexto del mercado laboral chileno`

  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: InsightSchema,
    prompt,
    temperature: 0.7,
    mode: "json",
  })

  // Mark all insights as from OpenAI
  return {
    insights: object.insights.map((i) => ({ ...i, source: "openai" as const })),
    recommendations: object.recommendations.map((r) => ({ ...r, source: "openai" as const })),
    developmentPlan: object.developmentPlan,
  }
}

/**
 * Generate insights using Cerebro (personalized, context-aware)
 */
async function generateCerebroInsights(userId: string, testType: string, results: any, responses: any): Promise<any> {
  // 1. Get user context and patterns
  const userContext = await cerebroIntelligence.getUserContext(userId)
  const userPatterns = await cerebroIntelligence.getUserPatterns(userId)
  const memories = await cerebroIntelligence.retrieveRelevantMemories(userId, `test ${testType} results`, {
    limit: 5,
  })

  // 2. Search knowledge base for relevant content
  const knowledgeResults = await semanticSearch(`${testType} professional development career guidance`, {
    limit: 3,
    similarityThreshold: 0.75,
  })

  // 3. Build personalized context
  const personalizedContext = buildPersonalizedContext({
    userContext,
    userPatterns,
    memories,
    knowledgeResults,
    testType,
    results,
  })

  // 4. Generate insights with Cerebro context
  const prompt = `Como Cerebro, el coach IA avanzado de Despega Tu Carrera, analiza estos resultados del test "${testType}" con contexto personalizado del usuario.

Resultados del Test:
${JSON.stringify(results, null, 2)}

Contexto Personalizado del Usuario:
${personalizedContext}

Genera insights altamente personalizados que:
1. Conecten con los objetivos y contexto específico del usuario
2. Consideren su historial de aprendizaje y preferencias
3. Se basen en el conocimiento de 120+ libros profesionales
4. Sean específicos para el mercado laboral chileno
5. Incluyan pasos accionables adaptados a su situación

Enfócate en personalización profunda y recomendaciones contextualizadas.`

  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: InsightSchema,
    prompt,
    temperature: 0.8,
    mode: "json",
  })

  // Mark all insights as from Cerebro and add personalized context
  return {
    insights: object.insights.map((i) => ({
      ...i,
      source: "cerebro" as const,
      personalizedContext: `Basado en tu perfil y objetivos`,
    })),
    recommendations: object.recommendations.map((r) => ({ ...r, source: "cerebro" as const })),
    developmentPlan: object.developmentPlan,
  }
}

/**
 * Build personalized context from user data
 */
function buildPersonalizedContext(data: any): string {
  let context = "# Contexto Personalizado del Usuario\n\n"

  if (data.userContext) {
    context += "## Perfil del Usuario:\n"
    if (data.userContext.career_profile) {
      context += `Carrera: ${JSON.stringify(data.userContext.career_profile)}\n`
    }
    if (data.userContext.active_goals) {
      context += `Objetivos Activos: ${JSON.stringify(data.userContext.active_goals)}\n`
    }
    if (data.userContext.recent_tests) {
      context += `Tests Recientes: ${JSON.stringify(data.userContext.recent_tests)}\n`
    }
    context += "\n"
  }

  if (data.userPatterns && data.userPatterns.length > 0) {
    context += "## Patrones de Aprendizaje:\n"
    data.userPatterns.forEach((p: any) => {
      context += `- ${p.patternType}: ${JSON.stringify(p.patternData)}\n`
    })
    context += "\n"
  }

  if (data.memories && data.memories.length > 0) {
    context += "## Memoria de Interacciones Previas:\n"
    data.memories.forEach((m: any, i: number) => {
      context += `${i + 1}. ${m.content}\n`
    })
    context += "\n"
  }

  if (data.knowledgeResults && data.knowledgeResults.length > 0) {
    context += "## Conocimiento Relevante de la Biblioteca:\n"
    data.knowledgeResults.forEach((k: any, i: number) => {
      context += `${i + 1}. "${k.title}" por ${k.author}\n`
    })
    context += "\n"
  }

  return context
}

/**
 * Merge and rank insights from both sources
 */
function mergeAndRankInsights(openaiInsights: any, cerebroInsights: any): any {
  // Combine insights
  const allInsights = [...openaiInsights.insights, ...cerebroInsights.insights]

  // Remove duplicates based on title similarity
  const uniqueInsights = allInsights.filter(
    (insight, index, self) => index === self.findIndex((i) => i.title.toLowerCase() === insight.title.toLowerCase()),
  )

  // Sort by priority and confidence
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  uniqueInsights.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.confidence - a.confidence
  })

  // Combine recommendations
  const allRecommendations = [...openaiInsights.recommendations, ...cerebroInsights.recommendations]
  const uniqueRecommendations = allRecommendations.filter(
    (rec, index, self) => index === self.findIndex((r) => r.title.toLowerCase() === rec.title.toLowerCase()),
  )

  // Calculate match scores and determine highlighting
  const recommendationsWithScores = calculateRecommendationScores(uniqueRecommendations, cerebroInsights)

  // Merge development plans
  const developmentPlan = {
    shortTerm: [
      ...new Set([...openaiInsights.developmentPlan.shortTerm, ...cerebroInsights.developmentPlan.shortTerm]),
    ],
    mediumTerm: [
      ...new Set([...openaiInsights.developmentPlan.mediumTerm, ...cerebroInsights.developmentPlan.mediumTerm]),
    ],
    longTerm: [...new Set([...openaiInsights.developmentPlan.longTerm, ...cerebroInsights.developmentPlan.longTerm])],
  }

  return {
    insights: uniqueInsights,
    recommendations: recommendationsWithScores,
    developmentPlan,
  }
}

/**
 * Calculate recommendation match scores and determine which should be highlighted
 */
function calculateRecommendationScores(recommendations: any[], cerebroInsights: any): any[] {
  // Calculate a match score for each recommendation based on source and context
  const scored = recommendations.map((rec, index) => {
    let matchScore = 0

    // Cerebro insights get higher base score (more personalized)
    const isCerebroSource = rec.source === "cerebro"
    const baseScore = isCerebroSource ? 75 : 60

    // Boost score based on position in cerebro's list (first recommendations are best)
    const cerebroRecIndex = cerebroInsights.recommendations.findIndex(
      (r: any) => r.title.toLowerCase() === rec.title.toLowerCase()
    )
    if (cerebroRecIndex !== -1) {
      const proximityBoost = Math.max(0, 15 - cerebroRecIndex * 5)
      matchScore = baseScore + proximityBoost
    } else {
      matchScore = baseScore
    }

    // Cap at 100
    matchScore = Math.min(100, matchScore)

    return {
      ...rec,
      matchScore,
      isHighlighted: false, // Will be set below
    }
  })

  // Find recommendations in threshold range (68-72%, ±2% around 70%)
  const THRESHOLD_CENTER = 70
  const THRESHOLD_RANGE = 2
  const THRESHOLD_MIN = THRESHOLD_CENTER - THRESHOLD_RANGE // 68
  const THRESHOLD_MAX = THRESHOLD_CENTER + THRESHOLD_RANGE // 72

  const inThreshold = scored.filter((r) => r.matchScore >= THRESHOLD_MIN && r.matchScore <= THRESHOLD_MAX)

  // If any are in threshold range, highlight the one with highest score
  if (inThreshold.length > 0) {
    const bestMatch = inThreshold.reduce((best, current) => 
      current.matchScore > best.matchScore ? current : best
    )
    
    return scored.map((rec) => ({
      ...rec,
      isHighlighted: rec.matchScore === bestMatch.matchScore,
      inThresholdZone: rec.matchScore >= THRESHOLD_MIN && rec.matchScore <= THRESHOLD_MAX,
    }))
  }

  return scored.map((rec) => ({
    ...rec,
    inThresholdZone: rec.matchScore >= THRESHOLD_MIN && rec.matchScore <= THRESHOLD_MAX,
  }))
}

/**
 * Store hybrid insights in database
 */
async function storeHybridInsights(userId: string, testType: string, insights: any): Promise<void> {
  const supabase = createClient()

  try {
    await supabase.from("cerebro_hybrid_insights").insert({
      user_id: userId,
      test_type: testType,
      insights: insights.insights,
      recommendations: insights.recommendations,
      development_plan: insights.developmentPlan,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error storing hybrid insights:", error)
  }
}

/**
 * Generate predictive insights for future proactive guidance
 */
async function generatePredictiveInsights(
  userId: string,
  testType: string,
  results: any,
  insights: any,
): Promise<void> {
  // Analyze results to predict future needs
  const predictions = []

  // Example: If user scores low in a skill, predict they might need training
  if (results.score < 60) {
    predictions.push({
      insightType: "learning_recommendation" as const,
      prediction: `Considera tomar un curso o taller sobre ${testType} para fortalecer estas competencias`,
      reasoning: `Tu puntuación de ${results.score}% indica oportunidad de desarrollo`,
      confidenceScore: 0.8,
      priority: 8,
    })
  }

  // Store predictions
  for (const prediction of predictions) {
    await cerebroIntelligence.generatePredictiveInsight(userId, prediction)
  }
}
