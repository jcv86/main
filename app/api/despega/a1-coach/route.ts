import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { A1_COACH_PROMPT, validateA1Response } from "@/lib/a1-coach-prompts"
import { detectRedFlags, detectMedicalBoundaryViolation } from "@/lib/brandie-coherence-test"

const A1CoachResponseSchema = z.object({
  response: z.string().describe("The coaching response in Spanish"),
  type: z.enum(["pattern_explanation", "normalization", "contextualization", "question"]).describe("Type of coaching response"),
  patternIdentified: z.string().optional().describe("The pattern explained"),
})

// Rubric-based evaluation scores
async function evaluateResponseRubric(response: string, pillar: string): Promise<{
  explainSystem: number  // 0-10: Does it explain context/invisibles vs personality?
  preserveAgency: number // 0-10: Does it keep user in control?
  avoidPrescription: number // 0-10: No "debes/tienes que/recomiendo"?
  overall: number // 0-10: Aggregate score
}> {
  const rubricPrompt = `Evalúa esta respuesta de coach en DTC en base a 3 criterios (0-10 cada uno):

RESPUESTA A EVALUAR:
"${response}"

CRITERIOS:
1. EXPLICACIÓN DE SISTEMA (0-10): ¿Explica patrones invisibles/contexto o describe personalidad/rasgos? (10=contextual, 0=personality-based)
2. PRESERVACIÓN DE AGENCIA (0-10): ¿Mantiene al usuario en control de sus decisiones o presiona? (10=user_agency, 0=prescriptive)
3. EVITACIÓN DE PRESCRIPCIÓN (0-10): ¿Evita "debes/tienes que/recomiendo/solución es"? (10=explorative, 0=prescriptive)

Responde SOLO con JSON:
{"explainSystem": X, "preserveAgency": Y, "avoidPrescription": Z}`

  try {
    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: z.object({
        explainSystem: z.number().min(0).max(10),
        preserveAgency: z.number().min(0).max(10),
        avoidPrescription: z.number().min(0).max(10),
      }),
      prompt: rubricPrompt,
    })

    const overall = Math.round((result.object.explainSystem + result.object.preserveAgency + result.object.avoidPrescription) / 3)

    return {
      explainSystem: result.object.explainSystem,
      preserveAgency: result.object.preserveAgency,
      avoidPrescription: result.object.avoidPrescription,
      overall,
    }
  } catch (error) {
    console.error("[Rubric Evaluator] Error evaluating response:", error)
    return { explainSystem: 5, preserveAgency: 5, avoidPrescription: 5, overall: 5 }
  }
}

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

    // Phase 1: Rubric-based evaluation (NEW)
    const rubricScore = await evaluateResponseRubric(result.object.response, "a1")

    // Phase 2: Medical boundary check (NEW)
    const medicalCheck = detectMedicalBoundaryViolation(result.object.response)
    if (medicalCheck.violated) {
      console.error("[A1 Coach] MEDICAL BOUNDARY VIOLATION:", {
        keywords: medicalCheck.keywords,
        response: result.object.response.substring(0, 150),
      })
      // Return safe fallback response
      return NextResponse.json({
        response: "Parece que lo que describes requiere atención de un profesional de salud. Te recomendaría hablar con un psicólogo o médico que pueda ayudarte de forma adecuada. En DTC podemos trabajar sistemas cuando el bienestar base está presente.",
        type: "boundary_crossed",
        medicalBoundaryViolation: true,
        medicalKeywords: medicalCheck.keywords,
        coherenceCheck: { isValid: false, violations: ["Medical boundary crossed"] },
        rubricScore: { explainSystem: 0, preserveAgency: 0, avoidPrescription: 0, overall: 0 },
      })
    }

    // Phase 3: Post-generation coherence check
    const validation = validateA1Response(result.object.response)
    const redFlags = detectRedFlags(result.object.response, "a1")

    // Log low-scoring responses for improvement
    if (rubricScore.overall < 7) {
      console.warn("[A1 Coach] Low rubric score:", {
        score: rubricScore.overall,
        details: rubricScore,
        response: result.object.response.substring(0, 100),
      })
    }

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
      rubricScore: rubricScore,
    })
  } catch (error) {
    console.error("Error in A1 coach endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
