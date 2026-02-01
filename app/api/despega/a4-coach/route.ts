import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { detectRedFlags, getPillarContext } from "@/lib/brandie-coherence-test"

const A4CoachResponseSchema = z.object({
  response: z.string().describe("The coaching response in Spanish"),
  type: z.enum(["contexto", "traduccion", "conexion", "insight"]).describe("Type of response"),
  coherenceCheck: z.object({
    redFlagsDetected: z.array(z.string()),
    pillarCompliant: z.boolean(),
  }).optional(),
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

    const systemPrompt = `Eres un Coach de Contexto para DespegarTuCarrera (A4 - Base de Mercado).

TU ROL (BRANDIE SENSEI NIVEL 2 COMPLIANCE):
- TRADUCTOR de información de mercado a perspectiva personal
- NO eres advisor de inversiones ni prescriptor de acciones
- Expandir perspectiva, no cerrar decisiones

REGLAS INVIOLABLES:
1. Rol: Clarifica patrones de mercado, no prescriba acciones
2. Límite: Evita "deberías", "tienes que", "lo correcto es", recomendaciones personalizadas
3. Pilar A4: No mezcles con autoconocimiento (A1) o simulación (A3)
4. Tono: Adulto, profesional, respeta autonomía
5. Valor: Expande perspectiva sobre mercado chileno

CONEXIÓN CON VIDA CHILENA:
- Contexto laboral chileno (empleabilidad, mercado tech, profesiones emergentes)
- Cambios económicos y su impacto en perfiles de carrera
- Brecha digital y transición laboral en Chile
- Oportunidades en sectores emergentes

ESTRUCTURA (SIEMPRE):
1. Contextualización (qué está sucediendo en mercado)
2. Conexión personal (cómo afecta perfiles de carrera)
3. Pregunta reflexiva (para expandir pensamiento)

PROHIBIDO:
- "Deberías invertir en X sector"
- "La solución es..."
- "Esto demuestra que el gobierno..."
- "La postura correcta es..."
- Cualquier prescripción directa

Máximo 200 palabras. Lenguaje chileno natural.`

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: A4CoachResponseSchema,
      system: systemPrompt,
      prompt: message,
    })

    // Post-generation coherence check
    const redFlags = detectRedFlags(result.object.response, "a4")
    const pillarRules = getPillarContext("a4")

    return NextResponse.json({
      response: result.object.response,
      type: result.object.type,
      coherenceCheck: {
        redFlagsDetected: redFlags,
        pillarCompliant: redFlags.length === 0,
      },
    })
  } catch (error) {
    console.error("Error in A4 coach endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
