import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { response, category, question } = await request.json()

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const prompt = `
Analiza la siguiente respuesta a una pregunta de evaluación de habilidades blandas:

Categoría: ${category}
Pregunta: ${question}
Respuesta del usuario: "${response}"

Proporciona un análisis constructivo que incluya:
1. Fortalezas identificadas en la respuesta
2. Áreas de mejora
3. Sugerencias específicas para el desarrollo
4. Una puntuación del 1 al 10 para esta competencia

Responde en español de manera profesional y motivadora.
Formato de respuesta:
{
  "analysis": "Análisis detallado de la respuesta",
  "strengths": ["Fortaleza 1", "Fortaleza 2"],
  "improvements": ["Mejora 1", "Mejora 2"],
  "suggestions": ["Sugerencia 1", "Sugerencia 2"],
  "score": 8
}
`

    const response_api = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response_api.ok) {
      console.error("OpenAI API error:", response_api.statusText)
      return NextResponse.json(
        {
          analysis: "Gracias por tu respuesta. Continúa trabajando en el desarrollo de esta competencia.",
          strengths: ["Participación activa", "Disposición al aprendizaje"],
          improvements: ["Desarrollo continuo"],
          suggestions: ["Práctica regular", "Autoevaluación constante"],
          score: 6,
        },
        { status: 200 }
      )
    }

    const data = await response_api.json()
    const text = data.choices[0].message.content

    // Try to parse as JSON, fallback if needed
    let analysis
    try {
      analysis = JSON.parse(text)
    } catch (parseError) {
      analysis = {
        analysis:
          "Tu respuesta muestra reflexión y autoconocimiento. Continúa desarrollando esta competencia a través de la práctica y la retroalimentación.",
        strengths: ["Capacidad de reflexión", "Honestidad en la autoevaluación"],
        improvements: ["Profundizar en ejemplos específicos", "Desarrollar estrategias concretas"],
        suggestions: ["Practica con situaciones reales", "Busca feedback de colegas"],
        score: 7,
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing response:", error)

    return NextResponse.json(
      {
        analysis: "Gracias por tu respuesta. Continúa trabajando en el desarrollo de esta competencia.",
        strengths: ["Participación activa", "Disposición al aprendizaje"],
        improvements: ["Desarrollo continuo"],
        suggestions: ["Práctica regular", "Autoevaluación constante"],
        score: 6,
      },
      { status: 200 }
    )
  }
}
