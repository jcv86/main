import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { scenario, messages, messageCount } = await req.json()

    // Build context from scenario
    const systemPrompt = buildSystemPrompt(scenario)

    // Prepare messages for API
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    // Call AI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.8,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || "Lo siento, hubo un error. ¿Puedes repetir?"

    // Generate feedback for user's last message
    const feedback = generateFeedback(messages[messages.length - 1]?.content, scenario)

    // Check if simulation should end
    const shouldEnd =
      messageCount >= 10 ||
      aiResponse.toLowerCase().includes("gracias por tu tiempo") ||
      aiResponse.toLowerCase().includes("ha sido un placer") ||
      aiResponse.toLowerCase().includes("terminamos por hoy")

    // Generate evaluation if ending
    let evaluation = null
    if (shouldEnd) {
      evaluation = await generateEvaluation(messages, scenario)
    }

    return NextResponse.json({
      response: aiResponse,
      feedback,
      shouldEnd,
      evaluation,
    })
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json({ error: "Error en la simulación" }, { status: 500 })
  }
}

function buildSystemPrompt(scenario: {
  id: string
  title: string
  aiRole: string
  userRole: string
  context: string
  subcategory: string
  evaluationCriteria: string[]
}): string {
  const basePrompt = `Eres un simulador de conversaciones para Despega Tu Carrera (DTC).

Tu rol: ${scenario.aiRole}
El usuario es: ${scenario.userRole}
Contexto: ${scenario.context}

INSTRUCCIONES:
1. Mantén el personaje de forma realista pero constructiva
2. Responde de manera natural, como lo haría una persona real en esta situación
3. Si el usuario comete errores, reacciona de forma realista pero permite que la conversación continúe
4. Haz preguntas de seguimiento relevantes
5. Después de 8-10 intercambios, busca una conclusión natural

CRITERIOS A EVALUAR:
${scenario.evaluationCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

TONO:
- ${scenario.subcategory === "jefe" ? "Profesional pero con personalidad, puede ser exigente" : ""}
- ${scenario.subcategory === "pareja" ? "Emocional, personal, puede ser defensivo/a inicialmente" : ""}
- ${scenario.subcategory === "familia" ? "Cariñoso pero puede ser tradicional o preocupado" : ""}
- ${scenario.subcategory === "conductual" ? "Profesional, estructurado, busca ejemplos específicos" : ""}
- ${scenario.subcategory === "tecnica" ? "Analítico, hace preguntas de seguimiento técnicas" : ""}
- ${scenario.subcategory === "case" ? "Desafiante, busca estructura y lógica" : ""}
- ${scenario.subcategory === "negociacion" ? "Amable pero firme, tiene límites presupuestarios" : ""}

Responde SOLO como tu personaje. No rompas el personaje ni des retroalimentación directa.
Mantén respuestas concisas (2-4 oraciones máximo).`

  return basePrompt
}

function generateFeedback(
  userMessage: string,
  scenario: { subcategory: string; evaluationCriteria: string[] },
): { type: "positive" | "improvement"; text: string } | undefined {
  if (!userMessage) return undefined

  // Simple heuristic feedback
  const message = userMessage.toLowerCase()

  // Positive indicators
  if (message.includes("por ejemplo") || message.includes("específicamente")) {
    return { type: "positive", text: "Buen uso de ejemplos específicos" }
  }
  if (message.includes("resultado") || message.includes("logré") || message.includes("conseguí")) {
    return { type: "positive", text: "Excelente - mencionaste resultados concretos" }
  }
  if (message.includes("entiendo") || message.includes("comprendo") || message.includes("escucho")) {
    return { type: "positive", text: "Buena demostración de escucha activa" }
  }
  if (message.length > 200 && message.length < 500) {
    return { type: "positive", text: "Buena extensión de respuesta" }
  }

  // Improvement suggestions
  if (message.length < 50) {
    return { type: "improvement", text: "Tip: Desarrolla más tu respuesta con detalles" }
  }
  if (message.length > 600) {
    return { type: "improvement", text: "Tip: Intenta ser más conciso" }
  }
  if (!message.includes("yo") && !message.includes("mi")) {
    return { type: "improvement", text: "Tip: Personaliza más con tu experiencia" }
  }

  return undefined
}

async function generateEvaluation(
  messages: { role: string; content: string }[],
  scenario: { title: string; evaluationCriteria: string[] },
): Promise<{
  score: number
  strengths: string[]
  improvements: string[]
  tips: string[]
}> {
  try {
    const userMessages = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n---\n")

    const evalPrompt = `Evalúa el desempeño del usuario en esta simulación de "${scenario.title}".

Respuestas del usuario:
${userMessages}

Criterios de evaluación:
${scenario.evaluationCriteria.join(", ")}

Responde en JSON exactamente así:
{
  "score": [número del 1-100],
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "improvements": ["mejora 1", "mejora 2", "mejora 3"],
  "tips": ["tip práctico 1", "tip práctico 2", "tip práctico 3"]
}

Sé específico y constructivo. El score debe reflejar qué tan bien cumplió los criterios.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: evalPrompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error("Evaluation error:", error)
  }

  // Default evaluation if AI fails
  return {
    score: 70,
    strengths: ["Completaste la simulación", "Mantuviste el diálogo activo", "Mostraste disposición a practicar"],
    improvements: [
      "Practica usar más ejemplos específicos",
      "Trabaja en la estructura de tus respuestas",
      "Intenta ser más conciso en puntos clave",
    ],
    tips: [
      "Graba tus respuestas y escúchalas",
      "Prepara 3-4 historias STAR antes de entrevistas reales",
      "Practica frente a un espejo para trabajar lenguaje corporal",
    ],
  }
}
