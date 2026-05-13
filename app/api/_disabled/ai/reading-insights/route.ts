import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { type, selectedBook, prompts } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })
    }

    const systemPrompt =
      "Eres un experto en desarrollo profesional y personal que ayuda a los lectores a obtener insights profundos de sus libros."
    const userPrompt = prompts[type as keyof typeof prompts] || prompts.summary

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData)
      return NextResponse.json({ error: "OpenAI API error" }, { status: response.status })
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ""

    return NextResponse.json({ text })
  } catch (error) {
    console.error("[v0] Error in reading-insights route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
