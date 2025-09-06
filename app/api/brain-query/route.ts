import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase"

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

// POST - Send message and get AI response
export async function POST(request: NextRequest) {
  try {
    const { message, userId = "demo-user", conversationId, context } = await request.json()

    // Create context-aware prompt
    const systemPrompt = `
Eres un coach de carrera profesional especializado en desarrollo de habilidades blandas. 
Tu nombre es Coach IA y ayudas a las personas a desarrollar sus competencias profesionales.

Contexto del usuario: ${context ? JSON.stringify(context) : "Usuario realizando evaluación de habilidades blandas"}

Responde de manera:
- Profesional pero amigable
- Específica y accionable
- Motivadora y constructiva
- En español
- Con ejemplos prácticos cuando sea apropiado

Mantén las respuestas concisas pero útiles (máximo 300 palabras).
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 500,
    })

    const aiResponse = {
      id: Date.now().toString(),
      role: "assistant" as const,
      content: text,
      timestamp: new Date().toISOString(),
    }

    const userMessage = {
      id: (Date.now() - 1).toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    }

    // Try to save to database
    const supabase = createClient()

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
        const newConversationId = `conv_${Date.now()}`
        await supabase.from("ai_conversations").insert({
          id: newConversationId,
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
      conversationId: conversationId || `conv_${Date.now()}`,
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
      },
      conversationId: `conv_${Date.now()}`,
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
