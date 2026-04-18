import { type NextRequest, NextResponse } from "next/server"
import { advancedBrain } from "@/lib/advanced-brain-engine"
import { createClient } from "@/lib/supabase/server"
import {
  generateQueryHash,
  getCachedResponse,
  cacheResponse,
  trackAPIUsage,
  trackAnalyticsEvent,
} from "@/lib/performance-optimizer"

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let cacheHit = false

  try {
    const { message, userId = "demo-user", conversationId, context } = await request.json()

    // Check for Supabase credentials
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('[v0] Supabase not configured, using fallback mode')
      return NextResponse.json({
        response: "Supabase no está configurado en este entorno",
        conversationId: conversationId || "demo",
        metadata: {
          cacheHit: false,
          responseTimeMs: Date.now() - startTime,
          mode: 'fallback'
        }
      })
    }

    const supabase = await createClient()

    // Generate cache key
    const queryHash = generateQueryHash(message, { userId, conversationId })

    // Check cache first
    const cachedResponse = await getCachedResponse(queryHash)
    if (cachedResponse) {
      cacheHit = true
      const responseTimeMs = Date.now() - startTime

      // Track analytics
      await trackAnalyticsEvent(
        "brain_query",
        {
          category: "cached",
          response_time_ms: responseTimeMs,
          cache_hit: true,
        },
        userId,
      )

      // Track API usage (cached)
      await trackAPIUsage("brain-query-advanced", "openai", "gpt-4o", 0, responseTimeMs, true)

      return NextResponse.json({
        response: cachedResponse.response,
        conversationId: cachedResponse.conversationId,
        metadata: {
          ...cachedResponse.metadata,
          cacheHit: true,
          responseTimeMs,
        },
      })
    }

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
      brainResponse.sources.forEach((source) => {
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

    const responseTimeMs = Date.now() - startTime

    // Save to database
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

    const responseData = {
      response: aiMessage,
      conversationId: finalConversationId,
      metadata: {
        confidence: brainResponse.confidence,
        personalizationLevel: brainResponse.personalizationLevel,
        sourcesFound: brainResponse.sources.length,
        reasoning: brainResponse.reasoning,
        cacheHit: false,
        responseTimeMs,
      },
    }

    // Cache response (24 hours TTL)
    await cacheResponse(queryHash, message, responseData, { ttlHours: 24 })

    // Track analytics
    await trackAnalyticsEvent(
      "brain_query",
      {
        category: "success",
        confidence: brainResponse.confidence,
        sources_count: brainResponse.sources.length,
        response_time_ms: responseTimeMs,
        cache_hit: false,
      },
      userId,
      finalConversationId,
    )

    // Track API usage (estimate tokens)
    const estimatedTokens = Math.ceil(
      (message.length + brainResponse.answer.length + JSON.stringify(brainResponse.sources).length) / 4,
    )
    await trackAPIUsage("brain-query-advanced", "openai", "gpt-4o", estimatedTokens, responseTimeMs, false)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error in advanced brain query:", error)

    const responseTimeMs = Date.now() - startTime

    // Track error
    await trackAnalyticsEvent("brain_query_error", {
      category: "error",
      error_message: error instanceof Error ? error.message : "Unknown error",
      response_time_ms: responseTimeMs,
    })

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

    // Track feedback event
    await trackAnalyticsEvent(
      "brain_feedback",
      {
        category: "feedback",
        rating,
        has_text_feedback: !!feedback,
      },
      userId,
      conversationId,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
