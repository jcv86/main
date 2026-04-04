import { NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = "https://api.openai.com/v1"

export async function POST(request: NextRequest) {
  try {
    const { messages, coachType, userProfile } = await request.json()

    if (!OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY not configured")
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Build system prompt based on coach type and user profile
    let systemPrompt = buildSystemPrompt(coachType, userProfile)

    console.log("[v0] Chat request - Coach:", coachType, "Messages:", messages.length)

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] OpenAI API error:", error)
      return NextResponse.json({ error: "OpenAI API error" }, { status: response.status })
    }

    // Create a readable stream from OpenAI response
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break

            const text = decoder.decode(value, { stream: true })
            const lines = text.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") {
                  controller.close()
                  return
                }
                if (data) {
                  try {
                    const json = JSON.parse(data)
                    const chunk = json.choices?.[0]?.delta?.content
                    if (chunk) {
                      controller.enqueue(chunk)
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function buildSystemPrompt(coachType: string, userProfile: any): string {
  const basePrompt = `Eres un coach profesional especializado en desarrollo de carrera y liderazgo. 
Tu objetivo es ayudar a la persona a alcanzar sus metas profesionales con conversaciones empáticas, claras y accionables.`

  const profileContext = userProfile
    ? `\n\nPerfil del usuario:
- Tipo DISC: ${userProfile.discType || "No especificado"}
- Etapa de carrera: ${userProfile.careerStage || "No especificado"}
- Objetivos: ${userProfile.goals || "No especificado"}`
    : ""

  const coachSpecific = {
    tecnico: `\n\nEspecialidad: Coach Técnico
Enfoque: Habilidades técnicas, desarrollo profesional, carrera en tech, productividad, aprendizaje.
Proporciona consejos prácticos, recursos, y pasos concretos para mejorar habilidades técnicas.`,
    liderazgo: `\n\nEspecialidad: Coach de Liderazgo
Enfoque: Liderazgo, gestión de equipos, comunicación, inteligencia emocional, visión estratégica.
Proporciona perspectiva de liderazgo, desarrolla habilidades de influencia y gestión.`,
    cerebro: `\n\nEspecialidad: Cerebro Inteligente (Asesor de Recursos)
Enfoque: Buscar y recomendar recursos, libros, herramientas y estrategias basadas en las necesidades del usuario.
Proporciona recomendaciones específicas con fuentes confiables.`,
  }[coachType] || ""

  return basePrompt + profileContext + coachSpecific
}
