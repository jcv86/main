import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Return a demo response when API key is not available
      const demoResponses = [
        "¡Hola! Soy tu AI Career Coach. Aunque estoy en modo demo, puedo ayudarte con consejos generales sobre desarrollo profesional. ¿En qué área te gustaría enfocar tu carrera?",
        "Entiendo que buscas orientación profesional. Te recomiendo enfocarte en desarrollar tanto habilidades técnicas como blandas. ¿Hay alguna industria específica que te interese?",
        "Para el mercado laboral chileno, es importante mantenerse actualizado con las tendencias tecnológicas y desarrollar un perfil profesional sólido. ¿Te gustaría que hablemos sobre estrategias específicas?",
        "El networking es fundamental en Chile. Te sugiero participar en eventos profesionales y mantener un perfil activo en LinkedIn. ¿Necesitas ayuda con algún aspecto específico de tu búsqueda laboral?",
      ]

      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]

      return NextResponse.json({
        response: randomResponse,
        isDemo: true,
      })
    }

    // Build conversation context
    const systemPrompt = `Eres un AI Career Coach especializado en el mercado laboral chileno. Tu objetivo es ayudar a profesionales a desarrollar sus carreras, encontrar oportunidades laborales y mejorar sus habilidades.

Características:
- Eres empático, profesional y motivador
- Tienes conocimiento profundo del mercado laboral chileno
- Ofreces consejos prácticos y accionables
- Adaptas tus respuestas al nivel y área profesional del usuario
- Mantienes un tono conversacional pero profesional

Responde en español y mantén tus respuestas concisas pero útiles (máximo 200 palabras).`

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ]

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: messages as any,
      maxTokens: 300,
      temperature: 0.7,
    })

    return NextResponse.json({
      response: text,
      isDemo: false,
    })
  } catch (error) {
    console.error("Career Coach API Error:", error)

    // Return a helpful fallback response
    const fallbackResponse =
      "Disculpa, estoy experimentando dificultades técnicas en este momento. Mientras tanto, te sugiero revisar tu perfil profesional y considerar qué habilidades te gustaría desarrollar. ¿Hay algo específico en lo que pueda ayudarte de manera general?"

    return NextResponse.json({
      response: fallbackResponse,
      isDemo: true,
      error: "Temporary service unavailable",
    })
  }
}
