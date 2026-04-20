import { createClient } from "@/lib/supabase/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface CoachingConversation {
  id: string
  user_id: string
  messages: any[]
  created_at: string
}

interface ExtractedMemory {
  memory_type: "goal" | "challenge" | "strength" | "area_improvement" | "action" | "insight"
  content: string
  linked_axis: "c1" | "c2" | "c3" | "c4" | null
  priority: "high" | "medium" | "low"
}

interface GeneratedInsight {
  insight_type: "progress" | "recommendation" | "pattern" | "breakthrough" | "opportunity"
  title: string
  content: string
  linked_axis: "c1" | "c2" | "c3" | "c4" | null
  confidence_score: number
}

export async function extractMemoryFromConversation(conversation: CoachingConversation): Promise<ExtractedMemory[]> {
  try {
    // Build conversation text
    const conversationText = conversation.messages
      .map((m: any) => `${m.sender === "user" ? "Usuario" : "Coach"}: ${m.content}`)
      .join("\n")

    const prompt = `Analiza esta conversación de coaching y extrae información clave.
    
Conversación:
${conversationText}

Extrae en formato JSON EXACTAMENTE estos tipos de información encontrada:
[
  {
    "memory_type": "goal|challenge|strength|area_improvement|action|insight",
    "content": "descripción clara",
    "linked_axis": "c1|c2|c3|c4|null",
    "priority": "high|medium|low"
  }
]

Solo retorna el JSON, sin explicaciones. Si no hay información relevante, retorna [].`

    const { text } = await (async () => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4-mini",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.5,
            max_tokens: 1000,
          }),
        })

        const data = await response.json()
        const text = data.choices[0]?.message?.content || "[]"
        return { text }
      } catch (error) {
        console.error("[v0] Error calling OpenAI API:", error)
        return { text: "[]" }
      }
    })()

    try {
      const parsed = JSON.parse(text)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      console.error("[v0] Error parsing extracted memory:", text)
      return []
    }
  } catch (error) {
    console.error("[v0] Error extracting memory:", error)
    return []
  }
}

export async function generateInsightsFromMemory(
  userId: string,
  memories: any[],
  performanceContext: any,
): Promise<GeneratedInsight[]> {
  try {
    const memorySummary = memories
      .slice(0, 10)
      .map((m: any) => `[${m.memory_type}] ${m.content}`)
      .join("\n")

    const performanceSummary = `C1: ${performanceContext?.c1_score || 0}, C2: ${performanceContext?.c2_score || 0}, C3: ${performanceContext?.c3_score || 0}, C4: ${performanceContext?.c4_score || 0}`

    const prompt = `Basado en los puntos clave de una conversación de coaching y el contexto de performance del usuario, genera insights accionables.

Puntos clave del coaching:
${memorySummary}

Performance actual (C1, C2, C3, C4):
${performanceSummary}

Genera EXACTAMENTE 3-5 insights en formato JSON:
[
  {
    "insight_type": "progress|recommendation|pattern|breakthrough|opportunity",
    "title": "título conciso",
    "content": "descripción detallada del insight",
    "linked_axis": "c1|c2|c3|c4|null",
    "confidence_score": 0.0-1.0
  }
]

Solo retorna el JSON, sin explicaciones.`

    const { text } = await (async () => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4-mini",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.6,
            max_tokens: 1500,
          }),
        })

        const data = await response.json()
        const text = data.choices[0]?.message?.content || "[]"
        return { text }
      } catch (error) {
        console.error("[v0] Error calling OpenAI API:", error)
        return { text: "[]" }
      }
    })()

    try {
      const parsed = JSON.parse(text)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      console.error("[v0] Error parsing generated insights:", text)
      return []
    }
  } catch (error) {
    console.error("[v0] Error generating insights:", error)
    return []
  }
}

export async function processWeeklyCoachingMemory() {
  try {
    const supabase = createClient()

    // Get all users with recent coaching conversations
    const { data: recentConversations, error: conversationError } = await supabase
      .from("coach_conversations")
      .select("user_id")
      .gt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })

    if (conversationError) {
      console.error("[v0] Error fetching recent conversations:", conversationError)
      return
    }

    const uniqueUsers = Array.from(new Set(recentConversations.map((c: any) => c.user_id)))

    console.log(`[v0] Processing weekly memory for ${uniqueUsers.length} users`)

    for (const userId of uniqueUsers) {
      const userIdString = userId as string
      try {
        // Fetch user's performance context
        const { data: performanceData } = await supabase
          .from("user_performance_context")
          .select("*")
          .eq("user_id", userIdString)
          .single()

        // Fetch user's recent memories
        const { data: memories } = await supabase
          .from("user_coaching_memory")
          .select("*")
          .eq("user_id", userIdString)
          .eq("action_status", "pending")
          .order("created_at", { ascending: false })
          .limit(20)

        // Generate insights only if there are recent memories
        if (memories && memories.length > 0) {
          const insights = await generateInsightsFromMemory(userIdString, memories, performanceData)

          // Save generated insights
          for (const insight of insights) {
            const { error: insertError } = await supabase.from("ai_insights_from_coaching").insert({
              user_id: userIdString,
              insight_type: insight.insight_type,
              title: insight.title,
              content: insight.content,
              linked_axis: insight.linked_axis,
              based_on_memory_ids: memories.slice(0, 5).map((m: any) => m.id),
              confidence_score: insight.confidence_score,
              generated_by: "weekly_memory_processor",
            })

            if (insertError) {
              console.error(`[v0] Error saving insight for user ${userIdString}:`, insertError)
            }
          }

          console.log(`[v0] Generated ${insights.length} insights for user ${userIdString}`)
        }
      } catch (userError) {
        console.error(`[v0] Error processing user ${userIdString}:`, userError)
      }
    }

    console.log("[v0] Weekly coaching memory processing completed")
  } catch (error) {
    console.error("[v0] Error in processWeeklyCoachingMemory:", error)
  }
}
