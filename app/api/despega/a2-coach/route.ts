import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { A2_COACH_PROMPT, validateA2Response, A2CoachResponseSchema } from "@/lib/a2-coach-prompts"
import { detectRedFlags } from "@/lib/brandie-coherence-test"

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

    // Build contextual prompt
    const contextualPrompt = `Contexto del usuario en A2 - Profundización Cognitiva:

Patrón A1 identificado:
${context.a1Pattern || "No especificado"}

Contextos donde el usuario ha observado variaciones:
${context.variantContexts?.join("\n") || "No especificados"}

Tensiones internas reportadas:
${context.internalTensions?.join("\n") || "Ninguna reportada"}

Mensaje del usuario:
${message}`

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: A2CoachResponseSchema,
      system: A2_COACH_PROMPT.systemPrompt,
      prompt: contextualPrompt,
    })

    // Post-generation validation
    const validation = validateA2Response(result.object.response)
    const redFlags = detectRedFlags(result.object.response, "a2")

    // Log any violations
    if (!validation.valid || redFlags.length > 0) {
      console.warn("[A2 Coach] Coherence check:", {
        validationViolations: validation.violations,
        redFlags,
      })
    }

    return NextResponse.json({
      response: result.object.response,
      type: result.object.type,
      patternExplored: result.object.patternExplored,
      contextIntroduced: result.object.contextIntroduced,
      coherenceCheck: {
        isValid: validation.valid && redFlags.length === 0,
        violations: validation.violations,
        redFlags,
      },
    })
  } catch (error) {
    console.error("Error in A2 coach endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
