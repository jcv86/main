import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase"
import {
  selectPersonality,
  COACH_PERSONALITIES,
  type CoachPersonality,
  generateStructuredResponse, // Import fallback response generator
} from "@/lib/sofia-dani-prompts"

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
    let userContext: any = {}

    if (userEmail) {
      console.log("[v0] Fetching user context for:", userEmail)

      // Get user profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_email", userEmail).single()
      console.log("[v0] Profile fetched:", !!profile)

      // Get test results
      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })
      console.log("[v0] Test results count:", testResults?.length || 0)

      // Get personality assessments
      const { data: personality } = await supabase
        .from("personality_assessments")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()
      console.log("[v0] Personality data:", !!personality)

      userContext = {
        profile: profile || {},
        testResults: testResults || [],
        personality: personality || {},
        hasCompletedTests: (testResults?.length || 0) > 0,
        hasPersonalityData: !!personality,
      }

      console.log("[v0] User context summary:", {
        hasProfile: !!profile,
        testCount: testResults?.length || 0,
        hasPersonality: !!personality,
      })
    } else {
      console.log("[v0] No userEmail provided, skipping context fetch")
    }

    const personality: CoachPersonality = selectPersonality(message, userContext)
    const coachConfig = COACH_PERSONALITIES[personality]

    console.log("[v0] Selected coach:", personality, "for message:", message.substring(0, 50))

    const relevantKnowledge: any[] = []
    const knowledgeContext = ""

    // Semantic search is optional and not critical for Sofia & Dani chat
    // It will be re-enabled once OpenAI API key is properly configured
    /*
    const apiKey = process.env.OPENAI_API_KEY
    const hasValidKey = apiKey && apiKey.startsWith("sk-") && apiKey.length > 40

    if (hasValidKey) {
      try {
        relevantKnowledge = await semanticSearch(message, {
          similarityThreshold: 0.75,
          limit: 3,
        })

        if (relevantKnowledge.length > 0) {
          knowledgeContext = "\n\nConocimiento relevante disponible:\n"
          relevantKnowledge.forEach((item, index) => {
            knowledgeContext += `${index + 1}. "${item.title}" por ${item.author} - ${item.contentPreview.substring(0, 150)}...\n`
          })
          knowledgeContext += "\nPuedes mencionar estas fuentes si son relevantes para tu respuesta.\n"
        }
      } catch (searchError) {
        // Silently skip semantic search if it fails
      }
    }
    */

    let text = ""
    let usedFallback = false

    try {
      const apiKey = process.env.OPENAI_API_KEY
      const hasValidKey = apiKey && apiKey.startsWith("sk-") && apiKey.length > 40

      console.log("[v0] OpenAI API key check:", {
        exists: !!apiKey,
        startsWithSk: apiKey?.startsWith("sk-"),
        length: apiKey?.length,
        hasValidKey,
      })

      if (!hasValidKey) {
        throw new Error("OpenAI API key not configured")
      }

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

      console.log("[v0] Context description length:", contextDescription.length)

      const systemPrompt = `${coachConfig.systemPrompt}

${knowledgeContext}

Contexto del usuario: ${contextDescription}

Responde siguiendo tu estructura obligatoria y mantén tu personalidad única. Usa el contexto del usuario para dar respuestas personalizadas y relevantes.`

      console.log("[v0] Calling OpenAI with model: openai/gpt-4o")

      const result = await generateText({
        model: "openai/gpt-4o",
        system: systemPrompt,
        prompt: message,
        temperature: personality === "sofia" ? 0.8 : 0.6,
        maxTokens: 400,
      })

      text = result.text
      console.log("[v0] OpenAI response received, length:", text.length)
    } catch (aiError: any) {
      console.error("[v0] AI generation error:", aiError.message || aiError)
      console.error("[v0] Full error:", aiError)
      text = generateStructuredResponse(personality, message, userContext)
      usedFallback = true
      console.log("[v0] Using fallback response")
    }

    let enhancedResponse = text

    if (relevantKnowledge.length > 0 && !usedFallback) {
      enhancedResponse += "\n\n📚 **Fuentes Consultadas:**\n"
      relevantKnowledge.forEach((item, index) => {
        const sourceIcon = item.sourceType === "book" ? "📖" : "🌐"
        enhancedResponse += `${sourceIcon} ${item.title} - ${item.author} (${(item.similarityScore * 100).toFixed(0)}% relevancia)\n`
      })
    }

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
