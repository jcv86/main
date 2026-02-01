import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { A1_COACH_PROMPT, validateA1Response } from "@/lib/a1-coach-prompts"
import { detectRedFlags } from "@/lib/brandie-coherence-test"

const A1CoachResponseSchema = z.object({
  response: z.string().describe("The coaching response in Spanish"),
  type: z.enum(["pattern_explanation", "normalization", "contextualization", "question"]).describe("Type of coaching response"),
  patternIdentified: z.string().optional().describe("The pattern explained"),
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

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: A1CoachResponseSchema,
      system: A1_COACH_PROMPT.systemPrompt,
      prompt: `Contexto del usuario:
- Energía: ${context.a1Results?.score_energia || "no disponible"}%
- Enfoque: ${context.a1Results?.score_enfoque || "no disponible"}%
- Relaciones: ${context.a1Results?.score_relaciones || "no disponible"}%
- Plan Ejecutivo: ${context.a1Results?.score_plan_ejecutivo || "no disponible"}%

Mensaje del usuario: ${message}`,
    })

    // Post-generation coherence check
    const validation = validateA1Response(result.object.response)
    const redFlags = detectRedFlags(result.object.response, "a1")

    // If red flags detected, log warning but return response
    if (!validation.valid || redFlags.length > 0) {
      console.warn("[A1 Coach] Red flags detected:", {
        validationViolations: validation.violations,
        coherenceRedFlags: redFlags,
      })
    }

    return NextResponse.json({
      response: result.object.response,
      type: result.object.type,
      patternIdentified: result.object.patternIdentified,
      coherenceCheck: {
        isValid: validation.valid,
        violations: validation.violations,
        redFlags: redFlags,
      },
    })
  } catch (error) {
    console.error("Error in A1 coach endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
