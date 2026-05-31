import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

const COACH_SYSTEM_PROMPT = `Eres el Coach de Entrenamiento de Despega Tu Carrera (DTC).

Tu rol es guiar al usuario en el Pilar A2 (Rutas de Desarrollo), ayudándoles a:
- Desarrollar habilidades específicas para su carrera objetivo
- Practicar comunicación profesional
- Mejorar su networking y marca personal
- Completar sus tareas diarias de entrenamiento

Directrices:
- Responde en español chileno profesional pero cercano
- Sé práctico y orientado a la acción
- Ofrece consejos específicos y aplicables
- Celebra sus logros y progreso
- Mantén respuestas concisas (máximo 3-4 oraciones)
- Sugiere próximos pasos cuando sea apropiado`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, context, currentDay, currentTask } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user's A2 progress
    const { data: profile } = await supabase
      .from("despega_user_profiles")
      .select("a2_progress, career_goal, target_role")
      .eq("user_id", user.id)
      .single()

    const contextInfo = profile ? `
Información del usuario:
- Meta profesional: ${profile.career_goal || "No definida"}
- Rol objetivo: ${profile.target_role || "No definido"}
- Día actual: ${currentDay || "N/A"}
- Tarea actual: ${currentTask || "N/A"}
` : ""

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 600,
      messages: [
        {
          role: "system" as const,
          content: COACH_SYSTEM_PROMPT + contextInfo
        },
        ...(context || []).map((msg: any) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        { role: "user" as const, content: message }
      ] as any,
    })

    const text = response.choices[0].message.content || ""

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] a2-coach error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
