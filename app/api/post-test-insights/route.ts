import { type NextRequest, NextResponse } from "next/server"
import { getCerebroIntelligence } from "@/lib/cerebro-intelligence"
import { semanticSearch } from "@/lib/embeddings"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { testType, results, userId, testResponses } = await request.json()

    if (!testType || !results || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Starting hybrid insights generation for", testType)
    const startTime = Date.now()

    // Generate insights from OpenAI
    const openaiInsights = await generateOpenAIInsights(testType, results, testResponses)

    // Generate insights from Cerebro (personalized)
    const cerebroInsights = await generateCerebroInsights(userId, testType, results, testResponses)

    // Hybrid insights - combine both sources
    const hybridInsights = {
      insights: [...openaiInsights.insights, ...cerebroInsights.insights],
      recommendations: [...openaiInsights.recommendations, ...cerebroInsights.recommendations],
      developmentPlan: cerebroInsights.developmentPlan,
    }

    console.log(`[v0] Insights generation completed in ${Date.now() - startTime}ms`)

    return NextResponse.json(hybridInsights)
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

/**
 * Generate insights using OpenAI
 */
async function generateOpenAIInsights(testType: string, results: any, responses: any): Promise<any> {
  const prompt = `Eres un coach profesional experto en desarrollo de carrera.

Analiza los resultados del test "${testType}" y genera un análisis completo.

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
- Contexto del mercado laboral chileno

Responde SOLO con JSON válido con esta estructura:
{
  "insights": [{"category": "", "title": "", "description": "", "confidence": 0.8, "priority": "high", "actionableSteps": []}],
  "recommendations": [{"title": "", "description": "", "timeframe": "", "difficulty": ""}],
  "developmentPlan": {"shortTerm": [], "mediumTerm": [], "longTerm": []}
}`

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  })

  if (!openaiResponse.ok) {
    throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
  }

  const data = await openaiResponse.json()
  const responseText = data.choices?.[0]?.message?.content || ""

  if (!responseText) {
    throw new Error("No response from OpenAI")
  }

  const object = JSON.parse(responseText)

  // Mark all insights as from OpenAI
  return {
    insights: (object.insights || []).map((i: any) => ({ ...i, source: "openai" as const })),
    recommendations: (object.recommendations || []).map((r: any) => ({ ...r, source: "openai" as const })),
    developmentPlan: object.developmentPlan || { shortTerm: [], mediumTerm: [], longTerm: [] },
  }
}

/**
 * Generate insights using Cerebro (personalized, context-aware)
 */
async function generateCerebroInsights(userId: string, testType: string, results: any, responses: any): Promise<any> {
  try {
    // 1. Get user context and patterns
    const userContext = await getCerebroIntelligence().getUserContext(userId)
    const userPatterns = await getCerebroIntelligence().getUserPatterns(userId)
    const memories = await getCerebroIntelligence().retrieveRelevantMemories(userId, `test ${testType} results`, {
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

Enfócate en personalización profunda y recomendaciones contextualizadas.

Responde SOLO con JSON válido con esta estructura:
{
  "insights": [{"category": "", "title": "", "description": "", "confidence": 0.9, "priority": "high", "actionableSteps": []}],
  "recommendations": [{"title": "", "description": "", "timeframe": "", "difficulty": ""}],
  "developmentPlan": {"shortTerm": [], "mediumTerm": [], "longTerm": []}
}`

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    const responseText = data.choices?.[0]?.message?.content || ""

    if (!responseText) {
      throw new Error("No response from OpenAI")
    }

    const object = JSON.parse(responseText)

    // Mark all insights as from Cerebro and add personalized context
    return {
      insights: (object.insights || []).map((i: any) => ({
        ...i,
        source: "cerebro" as const,
        personalizedContext: `Basado en tu perfil y objetivos`,
      })),
      recommendations: (object.recommendations || []).map((r: any) => ({ ...r, source: "cerebro" as const })),
      developmentPlan: object.developmentPlan || { shortTerm: [], mediumTerm: [], longTerm: [] },
    }
  } catch (error) {
    console.error("[v0] Cerebro insights generation failed:", error)
    // Return empty cerebro results if generation fails
    return {
      insights: [],
      recommendations: [],
      developmentPlan: { shortTerm: [], mediumTerm: [], longTerm: [] },
    }
  }
}

/**
 * Build personalized context from user data
 */
function buildPersonalizedContext(data: any): string {
  let context = "# Contexto Personalizado del Usuario\n\n"

  if (data.userContext) {
    context += `## Perfil del Usuario\n${JSON.stringify(data.userContext, null, 2)}\n\n`
  }

  if (data.userPatterns) {
    context += `## Patrones Identificados\n${JSON.stringify(data.userPatterns, null, 2)}\n\n`
  }

  if (data.memories && data.memories.length > 0) {
    context += `## Historial Relevante\n${data.memories.map((m: any) => `- ${m.content}`).join("\n")}\n\n`
  }

  if (data.knowledgeResults && data.knowledgeResults.length > 0) {
    context += `## Recursos Relevantes\n${data.knowledgeResults.map((k: any) => `- ${k.title || k.content}`).join("\n")}\n\n`
  }

  return context
}
