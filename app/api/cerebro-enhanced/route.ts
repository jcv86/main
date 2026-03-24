import { type NextRequest, NextResponse } from "next/server"
import { cerebroIntelligence } from "@/lib/cerebro-intelligence"
import { semanticSearch } from "@/lib/embeddings"
import { callOpenAI } from "@/lib/openai-wrapper"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationId, context } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    const startTime = Date.now()

    // 1. Retrieve relevant memories
    const memories = await cerebroIntelligence.retrieveRelevantMemories(userId, message, {
      similarityThreshold: 0.75,
      limit: 5,
    })

    // 2. Get user patterns for personalization
    const userPatterns = await cerebroIntelligence.getUserPatterns(userId)

    // 3. Get comprehensive user context
    const userContext = await cerebroIntelligence.getUserContext(userId)

    // 4. Perform semantic search on knowledge base
    const knowledgeResults = await semanticSearch(message, {
      similarityThreshold: 0.75,
      limit: 3,
    })

    // 5. Get pending predictive insights
    const pendingInsights = await cerebroIntelligence.getPendingInsights(userId, 3)

    // 6. Build enhanced context for AI
    const enhancedContext = buildEnhancedContext({
      memories,
      userPatterns,
      userContext,
      knowledgeResults,
      pendingInsights,
      message,
    })

    // 7. Generate response with multi-step reasoning
    const { text, reasoning } = await generateEnhancedResponse(message, enhancedContext)

    // 8. Store reasoning chain
    const processingTime = Date.now() - startTime
    await cerebroIntelligence.storeReasoningChain(
      userId,
      {
        query: message,
        steps: reasoning.steps,
        conclusion: text,
        overallConfidence: reasoning.confidence,
        sourcesUsed: knowledgeResults,
      },
      processingTime,
    )

    // 9. Extract and store new memories
    await extractAndStoreMemories(userId, conversationId, message, text, userContext)

    // 10. Learn patterns from this interaction
    await learnFromInteraction(userId, message, text, userPatterns)

    return NextResponse.json({
      response: text,
      confidence: reasoning.confidence,
      sources: knowledgeResults.map((k) => ({
        title: k.title,
        author: k.author,
        category: k.category,
        similarity: k.similarityScore,
      })),
      memoriesUsed: memories.length,
      patternsApplied: userPatterns.length,
      processingTime,
      insights: pendingInsights,
    })
  } catch (error) {
    console.error("Error in enhanced Cerebro:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function buildEnhancedContext(data: any): string {
  let context = "# Enhanced User Context\n\n"

  // Add memories
  if (data.memories && data.memories.length > 0) {
    context += "## Relevant Memories:\n"
    data.memories.forEach((m: any, i: number) => {
      context += `${i + 1}. [${m.memoryType}] ${m.content} (importance: ${m.importanceScore}/10)\n`
    })
    context += "\n"
  }

  // Add user patterns
  if (data.userPatterns && data.userPatterns.length > 0) {
    context += "## User Learning Patterns:\n"
    data.userPatterns.forEach((p: any) => {
      context += `- ${p.patternType}: ${JSON.stringify(p.patternData)} (confidence: ${Math.round(p.confidence * 100)}%)\n`
    })
    context += "\n"
  }

  // Add user profile
  if (data.userContext) {
    context += "## User Profile:\n"
    if (data.userContext.career_profile) {
      context += `Career: ${JSON.stringify(data.userContext.career_profile)}\n`
    }
    if (data.userContext.active_goals) {
      context += `Active Goals: ${JSON.stringify(data.userContext.active_goals)}\n`
    }
    if (data.userContext.recent_tests) {
      context += `Recent Tests: ${JSON.stringify(data.userContext.recent_tests)}\n`
    }
    context += "\n"
  }

  // Add knowledge base results
  if (data.knowledgeResults && data.knowledgeResults.length > 0) {
    context += "## Relevant Knowledge:\n"
    data.knowledgeResults.forEach((k: any, i: number) => {
      context += `${i + 1}. "${k.title}" by ${k.author} (${k.category})\n`
      context += `   ${k.contentPreview.substring(0, 200)}...\n\n`
    })
  }

  // Add pending insights
  if (data.pendingInsights && data.pendingInsights.length > 0) {
    context += "## Proactive Insights to Consider:\n"
    data.pendingInsights.forEach((insight: any, i: number) => {
      context += `${i + 1}. [${insight.insightType}] ${insight.prediction}\n`
    })
    context += "\n"
  }

  return context
}

async function generateEnhancedResponse(query: string, context: string): Promise<{ text: string; reasoning: any }> {
  const systemPrompt = `You are Cerebro, an advanced AI coach with deep memory, reasoning capabilities, and personalization.

You have access to:
- Long-term memory of past conversations
- User learning patterns and preferences
- Comprehensive user profile and goals
- 120+ professional development books
- Predictive insights about user needs

Your capabilities:
1. **Multi-Step Reasoning**: Break down complex questions into logical steps
2. **Personalization**: Adapt your communication style to user preferences
3. **Proactive Guidance**: Anticipate needs and suggest relevant actions
4. **Context Awareness**: Remember past conversations and build on them
5. **Evidence-Based**: Always cite sources and explain your reasoning

Communication style:
- Professional yet warm and encouraging
- Specific and actionable with concrete steps
- Adapted to Chilean professional context
- Use examples from the knowledge base when relevant
- Show your reasoning process when helpful

${context}

Respond thoughtfully, showing your reasoning when appropriate, and provide actionable guidance.`

  const text = await callOpenAI(
    systemPrompt,
    query,
    { temperature: 0.7 }
  )

  // Simulate reasoning extraction (in production, use structured output)
  const reasoning = {
    steps: [
      {
        step: 1,
        thought: "Analyzed user query and retrieved relevant context",
        evidence: ["User memories", "Knowledge base"],
        confidence: 0.9,
      },
      {
        step: 2,
        thought: "Applied user learning patterns for personalization",
        evidence: ["User patterns", "Past interactions"],
        confidence: 0.85,
      },
      {
        step: 3,
        thought: "Generated response with actionable recommendations",
        evidence: ["Professional knowledge", "User goals"],
        confidence: 0.88,
      },
    ],
    confidence: 0.88,
  }

  return { text, reasoning }
}

async function extractAndStoreMemories(
  userId: string,
  conversationId: string,
  query: string,
  response: string,
  userContext: any,
): Promise<void> {
  // Extract important facts, preferences, or goals from the conversation
  // This is a simplified version - in production, use NLP to extract entities

  // Example: If user mentions a goal
  if (query.toLowerCase().includes("quiero") || query.toLowerCase().includes("objetivo")) {
    await cerebroIntelligence.storeMemory(userId, conversationId, {
      memoryType: "goal",
      content: `Usuario expresó: ${query}`,
      importanceScore: 8,
      confidenceScore: 0.85,
      tags: ["goal", "career"],
    })
  }

  // Example: If user expresses a preference
  if (query.toLowerCase().includes("prefiero") || query.toLowerCase().includes("me gusta")) {
    await cerebroIntelligence.storeMemory(userId, conversationId, {
      memoryType: "preference",
      content: `Preferencia del usuario: ${query}`,
      importanceScore: 7,
      confidenceScore: 0.8,
      tags: ["preference", "learning_style"],
    })
  }
}

async function learnFromInteraction(
  userId: string,
  query: string,
  response: string,
  existingPatterns: any[],
): Promise<void> {
  // Analyze query characteristics
  const queryLength = query.split(" ").length
  const hasQuestion = query.includes("?")
  const timeOfDay = new Date().getHours()

  // Learn query style pattern
  const queryStylePattern = existingPatterns.find((p) => p.patternType === "query_style")
  const avgQueryLength = queryStylePattern?.patternData?.avgLength || queryLength

  await cerebroIntelligence.learnUserPattern(userId, {
    patternType: "query_style",
    patternData: {
      avgLength: (avgQueryLength + queryLength) / 2,
      usesQuestions: hasQuestion,
      preferredTimeOfDay: timeOfDay,
    },
    confidence: 0.75,
    sampleSize: (queryStylePattern?.sampleSize || 0) + 1,
  })

  // Learn topic interest
  const topics = extractTopics(query)
  if (topics.length > 0) {
    await cerebroIntelligence.learnUserPattern(userId, {
      patternType: "topic_interest",
      patternData: {
        recentTopics: topics,
        timestamp: new Date().toISOString(),
      },
      confidence: 0.7,
      sampleSize: 1,
    })
  }
}

function extractTopics(text: string): string[] {
  const topicKeywords = {
    liderazgo: ["liderazgo", "líder", "equipo", "gestión"],
    productividad: ["productividad", "tiempo", "eficiencia", "organización"],
    carrera: ["carrera", "profesional", "trabajo", "empleo"],
    habilidades: ["habilidades", "competencias", "skills", "capacidades"],
    comunicación: ["comunicación", "hablar", "presentar", "expresar"],
  }

  const lowerText = text.toLowerCase()
  const foundTopics: string[] = []

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      foundTopics.push(topic)
    }
  }

  return foundTopics
}
