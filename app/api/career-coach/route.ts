import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { mirixMemory } from "@/lib/mirix-memory"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Advanced Chilean market data with real-time insights
const advancedMarketData = {
  companies: {
    NotCo: {
      positions: 25,
      salary_range: "4M-8M CLP",
      urgency: "alta",
      growth_stage: "Series C",
      tech_stack: ["React", "Node.js", "Python", "AWS"],
      culture: "Internacional, innovación, foodtech",
      benefits: ["Stock options", "Seguro premium", "Trabajo híbrido", "Budget aprendizaje"],
    },
    Fintual: {
      positions: 18,
      salary_range: "3.5M-6M CLP",
      urgency: "alta",
      growth_stage: "Consolidado",
      tech_stack: ["React", "Python", "Django", "PostgreSQL"],
      culture: "Transparencia, fintech, crecimiento",
      benefits: ["Equity", "Seguro salud", "Vacaciones flexibles", "Presupuesto tech"],
    },
    Buk: {
      positions: 20,
      salary_range: "3M-5.5M CLP",
      urgency: "media",
      growth_stage: "Series B",
      tech_stack: ["Vue.js", "Laravel", "MySQL", "AWS"],
      culture: "HR tech, colaborativo, escalamiento",
      benefits: ["Seguro complementario", "Bono alimentación", "Capacitación", "Trabajo remoto"],
    },
    Betterfly: {
      positions: 12,
      salary_range: "4M-7M CLP",
      urgency: "media",
      growth_stage: "Series A",
      tech_stack: ["React Native", "Node.js", "MongoDB", "GCP"],
      culture: "Propósito social, insurtech, bienestar",
      benefits: ["Seguro vida", "Wellness budget", "Días de voluntariado", "Stock options"],
    },
  },
  salary_trends: {
    "Frontend Junior": { current: "1.8M-2.5M", growth: "+22%", demand: "alta" },
    "Frontend Senior": { current: "3M-4.5M", growth: "+22%", demand: "muy alta" },
    "Backend Junior": { current: "2M-2.8M", growth: "+18%", demand: "alta" },
    "Backend Senior": { current: "4M-6M", growth: "+18%", demand: "muy alta" },
    "Full Stack Senior": { current: "3.5M-5.5M", growth: "+20%", demand: "muy alta" },
    "Tech Lead": { current: "5.5M-8M", growth: "+25%", demand: "extrema" },
    "Engineering Manager": { current: "6M-9M", growth: "+28%", demand: "extrema" },
    "DevOps Engineer": { current: "4.5M-7M", growth: "+25%", demand: "muy alta" },
    "AI/ML Engineer": { current: "5M-8.5M", growth: "+35%", demand: "extrema" },
  },
  skills_demand: {
    React: { growth: "+35%", salary_premium: "+15%", companies: 45 },
    "Node.js": { growth: "+30%", salary_premium: "+12%", companies: 38 },
    Python: { growth: "+42%", salary_premium: "+20%", companies: 52 },
    "AI/ML": { growth: "+45%", salary_premium: "+40%", companies: 28 },
    Kubernetes: { growth: "+38%", salary_premium: "+30%", companies: 25 },
    AWS: { growth: "+35%", salary_premium: "+25%", companies: 42 },
    "React Native": { growth: "+28%", salary_premium: "+25%", companies: 22 },
    TypeScript: { growth: "+40%", salary_premium: "+18%", companies: 48 },
  },
  market_trends: {
    remote_work: "35% completamente remoto, 65% híbrido",
    salary_increase: "Promedio +18% vs 2023",
    hiring_urgency: "72% empresas con urgencia alta",
    skill_gaps: ["AI/ML", "Cloud Architecture", "DevOps", "Mobile"],
    top_benefits: ["Seguro complementario", "Trabajo híbrido", "Stock options", "Budget aprendizaje"],
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const userId = searchParams.get("userId") || "demo-user-id"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get memories from Mirix
    const memories = await mirixMemory.getMemories(userId, {
      agent_id: "career_coach",
      memory_type: "conversation",
      limit,
    })

    const conversations = memories.map((m) => ({
      id: m.id,
      session_id: m.session_id,
      user_id: m.user_id,
      role: "assistant",
      content: m.content,
      message_type: m.memory_type,
      intelligence_level: "expert",
      personalization_score: m.importance === "critical" ? 95 : m.importance === "high" ? 85 : 75,
      created_at: m.created_at,
    }))

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error in GET /api/career-coach:", error)
    return NextResponse.json({ conversations: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Use a default UUID if none provided
    const userUuid = userId || crypto.randomUUID()

    // Get contextual memories for better responses
    const contextualMemories = await mirixMemory.getContextualMemories(userUuid, "career_coach", message, 8)

    // Build context from memories
    let memoryContext = ""
    if (contextualMemories.length > 0) {
      memoryContext = "\n\nContexto de memoria del usuario:\n"
      contextualMemories.forEach((memory) => {
        memoryContext += `- ${memory.title}: ${memory.content}\n`
      })
    }

    // Generate response with AI
    const { text } = await generateText({
      model: openai("gpt-4"),
      system: `Eres un coach de carrera profesional especializado en orientación vocacional y desarrollo profesional. 
      
      Tu objetivo es ayudar a los usuarios a:
      - Descubrir sus fortalezas y áreas de mejora
      - Explorar opciones de carrera
      - Desarrollar planes de acción profesional
      - Mejorar habilidades de empleabilidad
      
      Mantén un tono profesional pero cercano, y proporciona consejos prácticos y personalizados.
      
      ${memoryContext}`,
      prompt: message,
    })

    // Store the conversation in memory
    await mirixMemory.storeMemory({
      user_id: userUuid,
      agent_id: "career_coach",
      session_id: sessionId,
      memory_type: "conversation",
      title: `Consulta: ${message.substring(0, 50)}...`,
      content: `Usuario: ${message}\nCoach: ${text}`,
      importance: "medium",
      tags: ["conversacion", "coaching", "consulta"],
      metadata: {
        user_message: message,
        ai_response: text,
        timestamp: new Date().toISOString(),
      },
    })

    // Extract insights and preferences from the conversation
    if (message.toLowerCase().includes("prefiero") || message.toLowerCase().includes("me gusta")) {
      await mirixMemory.storeMemory({
        user_id: userUuid,
        agent_id: "career_coach",
        session_id: sessionId,
        memory_type: "preference",
        title: "Preferencia detectada",
        content: `El usuario expresó: ${message}`,
        importance: "high",
        tags: ["preferencia", "interes"],
        metadata: { source: "conversation_analysis" },
      })
    }

    if (message.toLowerCase().includes("objetivo") || message.toLowerCase().includes("meta")) {
      await mirixMemory.storeMemory({
        user_id: userUuid,
        agent_id: "career_coach",
        session_id: sessionId,
        memory_type: "goal",
        title: "Objetivo mencionado",
        content: `El usuario mencionó: ${message}`,
        importance: "critical",
        tags: ["objetivo", "meta", "plan"],
        metadata: { source: "conversation_analysis" },
      })
    }

    return NextResponse.json({
      response: text,
      memories_used: contextualMemories.length,
      session_id: sessionId,
      user_id: userUuid,
    })
  } catch (error) {
    console.error("Career Coach API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId } = body

    if (action === "get_sessions") {
      const userUuid = userId || crypto.randomUUID()

      // Get sessions from Mirix
      const sessions = await mirixMemory.getSessions(userUuid, "career_coach")

      const formattedSessions = sessions.map((session) => ({
        id: session.id,
        user_id: session.user_id,
        session_title: `Sesión ${session.id.substring(0, 8)}`,
        session_summary: "Estrategia completa con memoria persistente y análisis personalizado",
        session_category: "career_strategy",
        total_messages: session.total_interactions,
        intelligence_level: "expert",
        user_satisfaction: 95,
        key_topics: ["Tech Lead", "Salarios", "Skills", "Mirix Memory"],
        last_activity: session.ended_at || session.started_at,
        created_at: session.created_at,
      }))

      return NextResponse.json({ sessions: formattedSessions })
    }

    return NextResponse.json({ sessions: [] })
  } catch (error) {
    console.error("Error in PUT /api/career-coach:", error)
    return NextResponse.json({ sessions: [] }, { status: 200 })
  }
}
