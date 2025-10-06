import { type NextRequest, NextResponse } from "next/server"
import { advancedBrain } from "@/lib/advanced-brain-engine"
import { createClient } from "@/lib/supabase"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { message, userId = "demo-user", conversationId, context } = await request.json()

    // Process query with advanced brain
    const brainResponse = await advancedBrain.processQuery({
      query: message,
      userId,
      conversationId,
      context,
    })

    // Format response message
    let responseContent = brainResponse.answer

    // Add sources
    if (brainResponse.sources.length > 0) {
      responseContent += "\n\n📚 **Fuentes Consultadas:**\n"
      brainResponse.sources.forEach((source, index) => {
        const icon = source.sourceType === "book" ? "📖" : "🌐"
        responseContent += `${icon} **${source.title}** - ${source.author}\n`
        responseContent += `   └ ${source.relevanceReason} (${(source.similarityScore * 100).toFixed(0)}% relevancia)\n`
      })
    }

    // Add actionable steps
    if (brainResponse.actionableSteps.length > 0) {
      responseContent += "\n\n🎯 **Próximos Pasos:**\n"
      brainResponse.actionableSteps.forEach((step, index) => {
        responseContent += `${index + 1}. ${step}\n`
      })
    }

    // Add follow-up questions
    if (brainResponse.followUpQuestions.length > 0) {
      responseContent += "\n\n💭 **Preguntas para profundizar:**\n"
      brainResponse.followUpQuestions.forEach((question) => {
        responseContent += `• ${question}\n`
      })
    }

    const aiMessage = {
      id: Date.now().toString(),
      role: "assistant" as const,
      content: responseContent,
      timestamp: new Date().toISOString(),
      sources: brainResponse.sources,
      metadata: {
        confidence: brainResponse.confidence,
        personalizationLevel: brainResponse.personalizationLevel,
        reasoning: brainResponse.reasoning,
        relatedTopics: brainResponse.relatedTopics,
        actionableSteps: brainResponse.actionableSteps,
        followUpQuestions: brainResponse.followUpQuestions,
      },
    }

    const userMessage = {
      id: (Date.now() - 1).toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    }

    // Save to database
    const supabase = createClient()
    const finalConversationId = conversationId || `conv_${Date.now()}`

    try {
      if (conversationId) {
        const { data: existingConv } = await supabase
          .from("ai_conversations")
          .select("messages")
          .eq("id", conversationId)
          .single()

        const updatedMessages = [...(existingConv?.messages || []), userMessage, aiMessage]

        await supabase
          .from("ai_conversations")
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId)
      } else {
        await supabase.from("ai_conversations").insert({
          id: finalConversationId,
          user_id: userId,
          title: message.substring(0, 50) + "...",
          messages: [userMessage, aiMessage],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (dbError) {
      console.error("Database save error:", dbError)
    }

    return NextResponse.json({
      response: aiMessage,
      conversationId: finalConversationId,
      metadata: {
        confidence: brainResponse.confidence,
        personalizationLevel: brainResponse.personalizationLevel,
        sourcesFound: brainResponse.sources.length,
        reasoning: brainResponse.reasoning,
      },
    })
  } catch (error) {
    console.error("Error in advanced brain query:", error)
    return NextResponse.json(
      {
        error: "Error processing query",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST feedback endpoint
export async function PATCH(request: NextRequest) {
  try {
    const { conversationId, userId, rating, feedback } = await request.json()

    await advancedBrain.learnFromFeedback(userId, conversationId, rating, feedback)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
