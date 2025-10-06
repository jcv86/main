import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase"
import { semanticSearch } from "@/lib/embeddings"

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

// POST - Send message and get AI response with semantic search
export async function POST(request: NextRequest) {
  try {
    const { message, userId = "demo-user", conversationId, context } = await request.json()

    // Perform semantic search to find relevant knowledge
    let relevantKnowledge: any[] = []
    let knowledgeContext = ""

    try {
      relevantKnowledge = await semanticSearch(message, {
        similarityThreshold: 0.75,
        limit: 3,
      })

      if (relevantKnowledge.length > 0) {
        knowledgeContext = "\n\n**Conocimiento Relevante Encontrado:**\n"
        relevantKnowledge.forEach((item, index) => {
          knowledgeContext += `\n${index + 1}. **${item.title}** por ${item.author} (${item.category})\n`
          knowledgeContext += `   ${item.contentPreview.substring(0, 200)}...\n`
        })
      }
    } catch (searchError) {
      console.error("Semantic search error:", searchError)
      // Continue without semantic search results
    }

    // Create enhanced context-aware prompt
    const systemPrompt = `
Eres un coach de carrera profesional especializado en desarrollo de habilidades blandas y crecimiento profesional. 
Tu nombre es Coach IA y ayudas a las personas a desarrollar sus competencias profesionales.

Tienes acceso a una base de conocimiento de más de 120 libros profesionales y 100 recursos web especializados.

${knowledgeContext}

Contexto del usuario: ${context ? JSON.stringify(context) : "Usuario buscando orientación profesional"}

Responde de manera:
- Profesional pero amigable y cercana
- Específica y accionable con pasos concretos
- Motivadora y constructiva
- En español chileno cuando sea apropiado
- Con ejemplos prácticos aplicables al contexto laboral chileno
- Citando las fuentes del conocimiento relevante cuando sea apropiado

Si tienes conocimiento relevante disponible, refiérelo en tu respuesta para que el usuario sepa de dónde viene la información.

Mantén las respuestas útiles y bien estructuradas (máximo 400 palabras).
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 600,
    })

    // Add sources information if we found relevant knowledge
    let enhancedResponse = text

    if (relevantKnowledge.length > 0) {
      enhancedResponse += "\n\n📚 **Fuentes Consultadas:**\n"
      relevantKnowledge.forEach((item, index) => {
        const sourceIcon = item.sourceType === "book" ? "📖" : "🌐"
        enhancedResponse += `${sourceIcon} ${item.title} - ${item.author} (${(item.similarityScore * 100).toFixed(0)}% relevancia)\n`
      })
    }

    const aiResponse = {
      id: Date.now().toString(),
      role: "assistant" as const,
      content: enhancedResponse,
      timestamp: new Date().toISOString(),
      sources: relevantKnowledge.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        category: item.category,
        sourceType: item.sourceType,
        similarityScore: item.similarityScore,
      })),
    }

    const userMessage = {
      id: (Date.now() - 1).toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    }

    // Try to save to database
    const supabase = createClient()
    const finalConversationId = conversationId || `conv_${Date.now()}`

    try {
      if (conversationId) {
        // Update existing conversation
        const { data: existingConv } = await supabase
          .from("ai_conversations")
          .select("messages")
          .eq("id", conversationId)
          .single()

        const updatedMessages = [...(existingConv?.messages || []), userMessage, aiResponse]

        await supabase
          .from("ai_conversations")
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId)
      } else {
        // Create new conversation
        await supabase.from("ai_conversations").insert({
          id: finalConversationId,
          user_id: userId,
          title: message.substring(0, 50) + "...",
          messages: [userMessage, aiResponse],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (dbError) {
      console.error("Database save error:", dbError)
      // Continue without saving to database
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: finalConversationId,
      sourcesFound: relevantKnowledge.length,
    })
  } catch (error) {
    console.error("Error in POST /api/brain-query:", error)

    // Fallback response
    return NextResponse.json({
      response: {
        id: Date.now().toString(),
        role: "assistant" as const,
        content:
          "Gracias por tu pregunta. Como coach de carrera, te recomiendo enfocarte en el desarrollo continuo de tus habilidades. ¿Hay alguna competencia específica en la que te gustaría trabajar?",
        timestamp: new Date().toISOString(),
        sources: [],
      },
      conversationId: `conv_${Date.now()}`,
      sourcesFound: 0,
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
