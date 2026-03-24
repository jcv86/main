import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { A1_COACH_PROMPT, validateA1Response } from "@/lib/a1-coach-prompts"
import { detectRedFlags, detectMedicalBoundaryViolation } from "@/lib/brandie-coherence-test"

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
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "user", content: rubricPrompt },
        ],
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    const text = data.choices?.[0]?.message?.content || ""
    
    // Parse JSON response
    const parsed = JSON.parse(text)
    const overall = Math.round((parsed.explainSystem + parsed.preserveAgency + parsed.avoidPrescription) / 3)

    return {
      explainSystem: parsed.explainSystem || 5,
      preserveAgency: parsed.preserveAgency || 5,
      avoidPrescription: parsed.avoidPrescription || 5,
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

    const prompt = `Contexto del usuario:
- Energía: ${context.a1Results?.score_energia || "no disponible"}%
- Enfoque: ${context.a1Results?.score_enfoque || "no disponible"}%
- Relaciones: ${context.a1Results?.score_relaciones || "no disponible"}%
- Plan Ejecutivo: ${context.a1Results?.score_plan_ejecutivo || "no disponible"}%

Mensaje del usuario: ${message}`

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: A1_COACH_PROMPT.systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    const responseText = data.choices?.[0]?.message?.content || ""
    
    if (!responseText) {
      throw new Error("No response from OpenAI")
    }

    // Parse structured response - expect JSON with response, type, patternIdentified
    let parsedResponse: any
    try {
      parsedResponse = JSON.parse(responseText)
    } catch {
      // If not JSON, wrap as text response
      parsedResponse = {
        response: responseText,
        type: "contextualization",
        patternIdentified: undefined,
      }
    }

    // Phase 1: Rubric-based evaluation (NEW)
    const rubricScore = await evaluateResponseRubric(parsedResponse.response, "a1")

    // Phase 2: Medical boundary check (NEW)
    const medicalCheck = detectMedicalBoundaryViolation(parsedResponse.response)
    if (medicalCheck.violated) {
      console.error("[A1 Coach] MEDICAL BOUNDARY VIOLATION:", {
        keywords: medicalCheck.keywords,
        response: parsedResponse.response.substring(0, 150),
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
    const validation = validateA1Response(parsedResponse.response)
    const redFlags = detectRedFlags(parsedResponse.response, "a1")

    // Log low-scoring responses for improvement
    if (rubricScore.overall < 7) {
      console.warn("[A1 Coach] Low rubric score:", {
        score: rubricScore.overall,
        details: rubricScore,
        response: parsedResponse.response.substring(0, 100),
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
      response: parsedResponse.response,
      type: parsedResponse.type,
      patternIdentified: parsedResponse.patternIdentified,
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
