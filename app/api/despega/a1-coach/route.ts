import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const A1CoachResponseSchema = z.object({
  response: z.string().describe("The coaching response in Spanish"),
  type: z.enum(["insight", "suggestion", "question", "support"]).describe("Type of coaching response"),
  actionItems: z.array(z.string()).optional().describe("Specific action items if applicable"),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, context } = await request.json()

    if (!message || !context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const systemPrompt = `Eres un coach de desarrollo personal especializado en el programa Despega Tu Carrera. 
Tu nombre es ${Math.random() > 0.5 ? "Sofia" : "Dani"}.

El usuario está trabajando en el pilar: ${context.pilarActive}
Ha completado ${context.missionsCompleted} de ${context.missionsTotal} misiones.

Su diagnóstico A1 muestra:
- Energía: ${context.a1Results.score_energia}%
- Enfoque: ${context.a1Results.score_enfoque}%
- Relaciones: ${context.a1Results.score_relaciones}%
- Plan Ejecutivo: ${context.a1Results.score_plan_ejecutivo}%

Tu rol es:
1. Proporcionar coaching personalizado basado en sus resultados
2. Motivar y celebrar pequeños logros
3. Ofrecer estrategias prácticas
4. Hacer preguntas reflexivas cuando sea apropiado
5. Adaptar tu tono a su progreso actual

Responde siempre en español, de manera empática y motivadora. Sé breve pero impactante.`

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: A1CoachResponseSchema,
      system: systemPrompt,
      prompt: message,
    })

    return NextResponse.json({
      response: result.object.response,
      type: result.object.type,
      actionItems: result.object.actionItems,
    })
  } catch (error) {
    console.error("Error in A1 coach endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
