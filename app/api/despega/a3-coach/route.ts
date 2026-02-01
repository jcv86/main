import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { getA3SystemPrompt, validateA3Response } from "@/lib/a3-coach-prompts"
import { detectRedFlags } from "@/lib/brandie-coherence-test"

const A3CoachResponseSchema = z.object({
  response: z.string().describe("The coaching response in Spanish for A3 simulation context"),
  type: z.enum(["scenario_intro", "pause_explain", "micro_experiment", "closure", "invitation", "reflection"])
    .describe("Type of A3 coach response"),
  includes_pause: z.boolean().describe("Whether this response pauses to explain a pattern"),
  micro_experiment_proposed: z.boolean().describe("Whether a micro-experiment is proposed"),
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

    const { message, context, simulationStage, previousResponses } = await request.json()

    if (!message || !context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Build context-aware system prompt
    let contextualPrompt = getA3SystemPrompt()

    // Add stage-specific guidance
    if (simulationStage === "initial") {
      contextualPrompt += `

## AHORA: INTRODUCCIÓN A SIMULACIÓN
Propones un escenario simulado que el usuario pueda explorar. 
El escenario debe ser realista pero contenido (no abrumador).
Invitas claramente a la experimentación.`
    } else if (simulationStage === "exploring") {
      contextualPrompt += `

## AHORA: EXPLORACIÓN EN CURSO
El usuario está dentro de la simulación. Tu rol es:
1. Continuar el escenario con realismo
2. Si ves patrones interesantes, puedes pausar para explicar
3. Si la respuesta es interesante, invita a micro-experimentos
4. Mantén el ambiente seguro y experimental`
    } else if (simulationStage === "pause") {
      contextualPrompt += `

## AHORA: PAUSA EXPLICATIVA
Explica el patrón que observaste sin evaluar.
Vincula con conceptos de A1/A2 si es relevante.
Propón micro-experimento inversamente.`
    } else if (simulationStage === "micro_experiment") {
      contextualPrompt += `

## AHORA: MICRO-EXPERIMENTO
El usuario probará una variación pequeña.
Tu rol: anima a experimentar sin presión, contrasta resultados.`
    } else if (simulationStage === "closing") {
      contextualPrompt += `

## AHORA: CIERRE DE SIMULACIÓN
Resume lo aprendido, destaca patrones, deja abierta la aplicación.
No impongas conclusiones.`
    }

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: A3CoachResponseSchema,
      system: contextualPrompt,
      prompt: message,
    })

    // Post-generation validation
    const internalValidation = validateA3Response(result.object.response)
    const redFlags = detectRedFlags(result.object.response, "a3")

    return NextResponse.json({
      response: result.object.response,
      type: result.object.type,
      includes_pause: result.object.includes_pause,
      micro_experiment_proposed: result.object.micro_experiment_proposed,
      coherenceCheck: {
        redFlagsDetected: redFlags,
        pillarCompliant: redFlags.length === 0 && internalValidation.valid,
      },
    })
  } catch (error) {
    console.error("[v0] Error in A3 coach endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
