import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userMessage, userEmail } = await req.json()

    if (!userMessage) {
      return NextResponse.json({ error: "User message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Eres un compañero de lectura inteligente especializado en desarrollo profesional y personal. 
Ayudas a los usuarios a:
- Comprender conceptos complejos de libros
- Generar resúmenes e insights
- Crear conexiones entre diferentes libros
- Sugerir aplicaciones prácticas
- Responder preguntas sobre el contenido

Mantén un tono amigable, profesional y educativo. Proporciona respuestas específicas y accionables.`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to generate response from OpenAI" }, { status: response.status })
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "No response generated"

    return NextResponse.json({ text })
  } catch (error) {
    console.error("[v0] Reading companion API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
