import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Probando API directa de OpenAI (sistema Despega Cerebral)...")
    
    const apiKey = process.env.OPENAI_API_KEY
    console.log("[v0] API Key existe:", !!apiKey)
    console.log("[v0] API Key comienza con sk-:", apiKey?.startsWith("sk-"))
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY variable de entorno no está configurada")
    }

    // Llamar a la API de OpenAI directamente
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: "Di '¡Hola desde Despega Cerebral - tu coach de carrera personal!' en español en solo una oración"
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Error de API OpenAI:", error)
      throw new Error(`Error de API OpenAI: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Respuesta de OpenAI recibida:", data.choices?.[0]?.message?.content)

    return NextResponse.json({
      success: true,
      message: "¡Llamada exitosa a Despega Cerebral!",
      response: data.choices?.[0]?.message?.content,
      model: data.model,
      usage: data.usage,
      keyInfo: {
        exists: !!apiKey,
        startsWithSk: apiKey?.startsWith("sk-"),
        length: apiKey?.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error en test de API directa de OpenAI:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
