import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { getA3SystemPrompt, validateA3Response } from "@/lib/a3-coach-prompts"
import { detectRedFlags } from "@/lib/brandie-coherence-test"

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

    // Call OpenAI API directly
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: contextualPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    const responseText = data.choices?.[0]?.message?.content || ""

    if (!responseText || responseText.trim() === "") {
      console.warn("[A3 Coach] Empty response from OpenAI")
      return NextResponse.json({
        response: "No pude procesar tu escenario en este momento. Por favor intenta de nuevo.",
        type: "scenario_intro",
        includes_pause: false,
        micro_experiment_proposed: false,
        coherenceCheck: {
          redFlagsDetected: [],
          pillarCompliant: false,
        },
      })
    }

    // Parse structured response
    let result: any
    try {
      result = JSON.parse(responseText)
    } catch {
      result = {
        response: responseText,
        type: "scenario_intro",
        includes_pause: false,
        micro_experiment_proposed: false,
      }
    }

    // Post-generation validation
    const internalValidation = validateA3Response(result.response)
    const redFlags = detectRedFlags(result.response, "a3")

    return NextResponse.json({
      response: result.response,
      type: result.type || "scenario_intro",
      includes_pause: result.includes_pause || false,
      micro_experiment_proposed: result.micro_experiment_proposed || false,
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
