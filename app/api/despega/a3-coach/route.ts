import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"

const COACH_SYSTEM_PROMPT = `Eres el Coach de Entrevistas de Despega Tu Carrera (DTC).

Tu rol es preparar al usuario para entrevistas laborales en el Pilar A3:
- Simular preguntas reales de entrevistas
- Dar feedback constructivo sobre respuestas
- Enseñar técnicas como STAR (Situación, Tarea, Acción, Resultado)
- Ayudar a manejar nervios y proyectar confianza
- Preparar para diferentes tipos de entrevistas (técnicas, conductuales, caso)

Directrices:
- Responde en español chileno profesional pero cercano
- Sé directo pero motivador en el feedback
- Ofrece ejemplos de buenas respuestas
- Sugiere mejoras específicas
- Mantén respuestas concisas (máximo 4-5 oraciones)
- Adapta el nivel de dificultad según el progreso del usuario`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, context, interviewType, difficulty } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user's interview preparation data
    const { data: profile } = await supabase
      .from("despega_user_profiles")
      .select("target_role, career_goal, a3_progress, interview_history")
      .eq("user_id", user.id)
      .single()

    const contextInfo = profile ? `
Información del usuario:
- Rol objetivo: ${profile.target_role || "No definido"}
- Meta profesional: ${profile.career_goal || "No definida"}
- Tipo de entrevista: ${interviewType || "General"}
- Nivel de dificultad: ${difficulty || "Intermedio"}
` : ""

    const { text } = await generateText({
      model: gateway("openai/gpt-4o-mini"),
      system: COACH_SYSTEM_PROMPT + contextInfo,
      messages: [
        ...(context || []),
        { role: "user", content: message }
      ],
      maxTokens: 600,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] a3-coach error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
