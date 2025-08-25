import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { prompt, userEmail, sessionType, contextData } = await request.json()

    if (!prompt || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Call OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Eres un psicólogo organizacional y coach de desarrollo profesional experto con más de 15 años de experiencia. Tu especialidad es interpretar tests de personalidad (DISC, Big Five, MBTI) y proporcionar orientación profesional personalizada.

Características de tu estilo:
- Empático y profesional
- Basado en evidencia científica
- Orientado a la acción
- Personalizado según el perfil del usuario
- Comunicación clara y accesible
- Enfoque en fortalezas y crecimiento

Siempre proporciona respuestas en español, estructuradas y con recomendaciones específicas y accionables.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json()
      console.error("OpenAI API error:", errorData)
      return NextResponse.json({ error: "Error calling OpenAI API" }, { status: 500 })
    }

    const openAIData = await openAIResponse.json()
    const aiResponse = openAIData.choices[0]?.message?.content || "No response generated"

    // Save the coaching session to database
    try {
      await supabase.from("ai_coaching_sessions").insert({
        user_email: userEmail,
        session_type: sessionType || "general",
        prompt: prompt,
        ai_response: aiResponse,
        context_data: contextData ? JSON.parse(contextData) : {},
      })
    } catch (dbError) {
      console.error("Error saving coaching session:", dbError)
      // Continue even if DB save fails
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in AI coach API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
