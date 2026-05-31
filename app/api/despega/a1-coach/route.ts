import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"

const COACH_SYSTEM_PROMPT = `Eres el Coach de Identidad de Despega Tu Carrera (DTC).

Tu rol es guiar al usuario en el Pilar A1 (Auditoría de Identidad), ayudándoles a:
- Descubrir sus fortalezas y debilidades profesionales
- Entender su estilo de comunicación (DISC)
- Identificar sus valores y motivaciones
- Reflexionar sobre sus experiencias pasadas

Directrices:
- Responde en español chileno profesional pero cercano
- Sé empático y motivador
- Haz preguntas reflexivas cuando sea apropiado
- Ofrece insights basados en lo que comparte el usuario
- Mantén respuestas concisas (máximo 3-4 oraciones)
- Si el usuario está confundido, ofrece ejemplos concretos`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user's A1 context if available
    const { data: profile } = await supabase
      .from("despega_user_profiles")
      .select("a1_data, disc_profile, strengths, weaknesses")
      .eq("user_id", user.id)
      .single()

    const contextInfo = profile ? `
Información del usuario:
- Perfil DISC: ${profile.disc_profile || "No evaluado aún"}
- Fortalezas identificadas: ${profile.strengths?.join(", ") || "Pendiente"}
- Áreas de mejora: ${profile.weaknesses?.join(", ") || "Pendiente"}
` : ""

    const { text } = await generateText({
      model: gateway("openai/gpt-4o-mini"),
      system: COACH_SYSTEM_PROMPT + contextInfo,
      messages: [
        ...(context || []),
        { role: "user", content: message }
      ],
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] a1-coach error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
