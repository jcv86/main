import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase"
import {
  selectPersonality,
  COACH_PERSONALITIES,
  type CoachPersonality,
  generateStructuredResponse,
} from "@/lib/sofia-dani-prompts"
import { detectIntention, getPromptForIntention, getCategoryInfo, trackEngagement } from "@/lib/intention-detector"

export const runtime = "nodejs"

// GET - Retrieve conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "demo-user"
    const conversationId = searchParams.get("conversationId")

    const supabase = createClient()

    if (conversationId) {
      // Get specific conversation
      const { data, error } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", userId)
        .single()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({
          conversation: null,
          messages: [],
        })
      }

      return NextResponse.json({
        conversation: data,
        messages: data?.messages || [],
      })
    } else {
      // Get all conversations for user
      const { data, error } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json({ conversations: [] })
      }

      return NextResponse.json({ conversations: data || [] })
    }
  } catch (error) {
    console.error("Error in GET /api/brain-query:", error)
    return NextResponse.json({
      conversations: [],
      messages: [],
    })
  }
}

// POST - Send message and get AI response with user context
export async function POST(request: NextRequest) {
  try {
    const {
      message,
      userId = "demo-user",
      conversationId,
      context,
      conversationHistory,
      userEmail,
    } = await request.json()

    console.log("[v0] POST /api/brain-query - message:", message.substring(0, 50))
    console.log("[v0] userEmail:", userEmail)

    const supabase = createClient()
    if (userEmail) {
      await supabase.from("brain_analytics_events").insert({
        event_type: "query_received",
        event_category: "coaching",
        user_email: userEmail,
        session_id: conversationId || `session_${Date.now()}`,
        event_data: { message_length: message.length },
      })
    }

    const intentionResult = detectIntention(message)
    console.log("[v0] Detected intention:", {
      intention: intentionResult.intention,
      confidence: intentionResult.confidence,
      keywords: intentionResult.matchedKeywords,
    })

    const promptInfo = getPromptForIntention(intentionResult.intention, intentionResult.suggestedPromptId)
    const categoryInfo = getCategoryInfo(intentionResult.intention)

    if (promptInfo) {
      console.log("[v0] Matched prompt:", promptInfo.id)
    }
    if (categoryInfo) {
      console.log("[v0] Category:", categoryInfo.name)
    }

    let userContext: any = {}
    let actualUserId = userId

    if (userEmail) {
      console.log("[v0] Fetching user context for:", userEmail)

      const { data: user } = await supabase.from("users").select("id").eq("email", userEmail).single()

      if (user?.id) {
        actualUserId = user.id
        console.log("[v0] User UUID:", actualUserId)
      } else {
        console.log("[v0] User not found in users table, trying user_profiles")
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_email", userEmail).single()

        if (profile) {
          console.log("[v0] Profile found in user_profiles")
          userContext.profile = profile
        }
      }

      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })
      console.log("[v0] Test results count:", testResults?.length || 0)

      let personality = null
      if (actualUserId !== "demo-user") {
        const { data: personalityData } = await supabase
          .from("personality_assessments")
          .select("*")
          .eq("user_id", actualUserId)
          .order("completed_at", { ascending: false })
          .limit(1)

        personality = personalityData?.[0] || null
        console.log("[v0] Personality data:", !!personality)
        
        // Fetch A4 Strategic Score for enriched context
        const { data: a4ScoreData } = await supabase
          .from("a4_strategic_scores")
          .select("score, trend, level")
          .eq("user_id", actualUserId)
          .order("created_at", { ascending: false })
          .limit(1)
        
        if (a4ScoreData?.[0]) {
          userContext.a4_strategic_score = a4ScoreData[0]
          console.log("[v0] A4 Strategic Score:", a4ScoreData[0].score)
        }
      } else {
        console.log("[v0] Skipping personality query - no valid user UUID")
      }

      userContext = {
        ...userContext,
        testResults: testResults || [],
        personality: personality || {},
        hasCompletedTests: (testResults?.length || 0) > 0,
        hasPersonalityData: !!personality,
      }

      console.log("[v0] User context summary:", {
        hasProfile: !!userContext.profile,
        testCount: testResults?.length || 0,
        hasPersonality: !!personality,
      })
    } else {
      console.log("[v0] No userEmail provided, skipping context fetch")
    }

    const personality: CoachPersonality = selectPersonality(message, userContext, intentionResult.intention)
    
    // Map "auto" to a default personality or based on context
    const selectedPersonality: "sofia" | "dani" = personality === "auto" 
      ? (intentionResult.intention === "career_exploration" ? "sofia" : "dani")
      : personality
    
    const coachConfig = COACH_PERSONALITIES[selectedPersonality]

    console.log("[v0] Selected coach:", selectedPersonality, "for intention:", intentionResult.intention)

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await trackEngagement({
      userId: actualUserId,
      sessionId,
      timestamp: new Date(),
      eventType: "message_sent",
      intention: intentionResult.intention,
      coachPersonality: selectedPersonality,
      metadata: {
        messageLength: message.length,
        confidence: intentionResult.confidence,
        promptId: promptInfo?.id,
        matchedKeywords: intentionResult.matchedKeywords,
      },
    })

    const relevantKnowledge: any[] = []

    let text = ""
    let usedFallback = false

    try {
      const apiKey = process.env.OPENAI_API_KEY

      if (!apiKey || !apiKey.startsWith("sk-") || apiKey.length < 40) {
        throw new Error("OpenAI API key not configured")
      }

      // Build context description
      let contextDescription = "Usuario buscando orientación profesional en Chile"

      if (userContext.hasCompletedTests) {
        contextDescription += "\n\nResultados de evaluaciones del usuario:"
        userContext.testResults.slice(0, 3).forEach((test: any) => {
          contextDescription += `\n- ${test.test_name}: Score ${test.score}/100`
          if (test.results) {
            contextDescription += ` - ${JSON.stringify(test.results).substring(0, 200)}`
          }
        })
      }

      // Add A4 Strategic Context if available
      if (userContext.a4_strategic_score) {
        contextDescription += `\n\nContexto Estratégico A4:`
        contextDescription += `\n- Puntaje Estratégico: ${userContext.a4_strategic_score.score}/100`
        contextDescription += `\n- Nivel: ${userContext.a4_strategic_score.level}`
        contextDescription += `\n- Tendencia: ${userContext.a4_strategic_score.trend}`
        contextDescription += "\n\nEl usuario está en fase de análisis estratégico del mercado y su contexto profesional."
      }

      if (userContext.hasPersonalityData) {
        const p = userContext.personality
        contextDescription += "\n\nPerfil de personalidad:"
        if (p.personality_type) contextDescription += `\n- Tipo: ${p.personality_type}`
        if (p.strengths) contextDescription += `\n- Fortalezas: ${p.strengths.join(", ")}`
        if (p.growth_areas) contextDescription += `\n- Áreas de desarrollo: ${p.growth_areas.join(", ")}`
        if (p.career_suggestions) contextDescription += `\n- Carreras sugeridas: ${p.career_suggestions.join(", ")}`
      }

      if (userContext.profile?.career_goals) {
        contextDescription += `\n\nObjetivos de carrera: ${userContext.profile.career_goals}`
      }

      // Build the complete prompt
      const prompt = `${coachConfig.systemPrompt}

Contexto del usuario: ${contextDescription}

Responde siguiendo tu estructura obligatoria y mantén tu personalidad única. Usa el contexto del usuario para dar respuestas personalizadas y relevantes.

Usuario: ${message}`

      console.log("[v0] Calling OpenAI with direct API")

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: coachConfig.systemPrompt,
            },
            {
              role: "user",
              content: `Contexto del usuario: ${contextDescription}\n\nResponde siguiendo tu estructura obligatoria y mantén tu personalidad única. Usa el contexto del usuario para dar respuestas personalizadas y relevantes.\n\nUsuario: ${message}`,
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      })

      if (!openaiResponse.ok) {
        const error = await openaiResponse.text()
        throw new Error(`OpenAI API error: ${error}`)
      }

      const data = await openaiResponse.json()
      const responseText = data.choices?.[0]?.message?.content

      if (!responseText) {
        throw new Error("No response content from OpenAI")
      }

      text = responseText
      console.log("[v0] OpenAI response received, length:", text.length)
    } catch (aiError: any) {
      console.error("[v0] AI generation error:", aiError.message || aiError)
      console.error("[v0] Full error:", aiError)
      text = generateStructuredResponse(personality, message, userContext)
      usedFallback = true
      console.log("[v0] Using fallback response")
    }

    await trackEngagement({
      userId: actualUserId,
      sessionId,
      timestamp: new Date(),
      eventType: "response_received",
      intention: intentionResult.intention,
      coachPersonality: personality,
      metadata: {
        responseLength: text.length,
        usedFallback,
        sourcesFound: relevantKnowledge.length,
      },
    })

    if (userEmail) {
      await supabase.from("brain_analytics_events").insert({
        event_type: "response_sent",
        event_category: "coaching",
        user_email: userEmail,
        session_id: conversationId || sessionId,
        event_data: {
          coach: personality,
          used_fallback: usedFallback,
          response_length: text.length,
        },
      })
    }

    let enhancedResponse = text

    if (relevantKnowledge.length > 0 && !usedFallback) {
      enhancedResponse += "\n\n📚 **Fuentes Consultadas:**\n"
      relevantKnowledge.forEach((item, index) => {
        const sourceIcon = item.sourceType === "book" ? "📖" : "🌐"
        enhancedResponse += `${sourceIcon} ${item.title} - ${item.author} (${(item.similarityScore * 100).toFixed(0)}% relevancia)\n`
      })
    }

    const suggestedQuestions = generateFollowUpSuggestions(message, text, intentionResult.intention, userContext)

    console.log("[v0] About to return response with suggestions count:", suggestedQuestions.length)

    return NextResponse.json({
      response: enhancedResponse,
      coach: personality,
      coachName: personality === "sofia" ? "Sofia" : "Dani",
      conversationId: conversationId || `conv_${Date.now()}`,
      sourcesFound: relevantKnowledge.length,
      sources: relevantKnowledge.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        category: item.category,
        sourceType: item.sourceType,
        similarityScore: item.similarityScore,
      })),
      usedFallback,
      intention: intentionResult.intention,
      intentionConfidence: intentionResult.confidence,
      sessionId,
      suggestions: suggestedQuestions && Array.isArray(suggestedQuestions) ? suggestedQuestions : [],
    })
  } catch (error) {
    console.error("[v0] Error in POST /api/brain-query:", error)

    const personality: CoachPersonality = "sofia"
    const fallbackText = generateStructuredResponse(personality, "ayuda general", {})

    return NextResponse.json({
      response: fallbackText,
      coach: personality,
      coachName: "Sofia",
      conversationId: `conv_${Date.now()}`,
      sourcesFound: 0,
      sources: [],
      usedFallback: true,
      intention: "general_question",
      intentionConfidence: 0.5,
      suggestions: [], // Ensure suggestions is always an array
    })
  }
}

// PATCH - Save or rate conversation
export async function PATCH(request: NextRequest) {
  try {
    const { conversationId, action, rating, userId = "demo-user" } = await request.json()

    const supabase = createClient()

    if (action === "rate") {
      const { error } = await supabase
        .from("ai_conversations")
        .update({
          rating,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", userId)

      if (error) {
        console.error("Rating save error:", error)
        return NextResponse.json({ success: false })
      }

      return NextResponse.json({ success: true })
    }

    if (action === "save") {
      const { error } = await supabase
        .from("ai_conversations")
        .update({
          saved: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", userId)

      if (error) {
        console.error("Save conversation error:", error)
        return NextResponse.json({ success: false })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid action" })
  } catch (error) {
    console.error("Error in PATCH /api/brain-query:", error)
    return NextResponse.json({ success: false })
  }
}

function generateFollowUpSuggestions(
  userMessage: string,
  aiResponse: string,
  intention: string,
  userContext: any,
): string[] {
  const suggestions: string[] = []
  const messageLower = userMessage.toLowerCase()
  const intentionLower = intention.toLowerCase()

  console.log("[v0] Generating suggestions for intention:", intention)

  // Career development suggestions
  if (
    intentionLower.includes("career") ||
    intentionLower.includes("advancement") ||
    messageLower.includes("carrera") ||
    messageLower.includes("avanzar")
  ) {
    suggestions.push("¿Cuáles son los próximos pasos para avanzar en mi carrera?")
    suggestions.push("¿Qué habilidades debo desarrollar para alcanzar mis objetivos?")
    suggestions.push("¿Cómo puedo identificar oportunidades de crecimiento en mi área?")
  }

  // Skills development suggestions
  if (
    intentionLower.includes("skill") ||
    intentionLower.includes("habilidad") ||
    messageLower.includes("habilidad") ||
    messageLower.includes("competencia")
  ) {
    suggestions.push("¿Cuáles son las habilidades más demandadas en el mercado?")
    suggestions.push("¿Cómo puedo mejorar mis habilidades técnicas?")
    suggestions.push("¿Qué certificaciones me ayudarían a avanzar?")
  }

  // Personal development suggestions
  if (
    intentionLower.includes("development") ||
    intentionLower.includes("development") ||
    messageLower.includes("desarrollo") ||
    messageLower.includes("crecimiento")
  ) {
    suggestions.push("¿Cuál es mi plan de desarrollo personal?")
    suggestions.push("¿Cómo puedo establecer metas de crecimiento realistas?")
    suggestions.push("¿Qué recursos recomendas para mi desarrollo?")
  }

  // Assessment and evaluation suggestions
  if (
    intentionLower.includes("assessment") ||
    intentionLower.includes("evaluación") ||
    messageLower.includes("evaluación") ||
    messageLower.includes("test")
  ) {
    suggestions.push("¿Cómo interpretar mis resultados de evaluación?")
    suggestions.push("¿Qué significan mis puntuaciones en cada categoría?")
    suggestions.push("¿Cómo usar esta información para mejorar?")
  }

  // General follow-up suggestions
  if (suggestions.length === 0) {
    suggestions.push("¿Qué otros aspectos de tu carrera te gustaría explorar?")
    suggestions.push("¿Cómo te puedo ayudar a alcanzar tus metas profesionales?")
    suggestions.push("¿Hay desafíos específicos que estés enfrentando?")
    suggestions.push("¿Cuál es tu mayor fortaleza según los resultados?")
  }

  if (userContext?.hasCompletedTests || userContext?.testResults?.length > 0) {
    suggestions.push("Basándome en tus evaluaciones, ¿cuál es tu siguiente paso?")
  }

  // Return top 3-4 unique suggestions
  const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 4)
  console.log("[v0] Generated suggestions count:", uniqueSuggestions.length)
  console.log("[v0] Suggestions:", uniqueSuggestions)

  return uniqueSuggestions
}
