import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { A2_COACH_PROMPT, validateA2Response } from "@/lib/a2-coach-prompts"
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
          { role: "system", content: A2_COACH_PROMPT.systemPrompt },
          { role: "user", content: contextualPrompt },
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

    // Parse structured response - expect JSON with response, type, patternExplored, contextIntroduced
    let parsedResponse: any
    try {
      parsedResponse = JSON.parse(responseText)
    } catch {
      // If not JSON, wrap as text response
      parsedResponse = {
        response: responseText,
        type: "pattern_exploration",
        patternExplored: undefined,
        contextIntroduced: undefined,
      }
    }

    // Post-generation validation
    const validation = validateA2Response(parsedResponse.response)
    const redFlags = detectRedFlags(parsedResponse.response, "a2")

    // Log any violations
    if (!validation.valid || redFlags.length > 0) {
      console.warn("[A2 Coach] Coherence check:", {
        validationViolations: validation.violations,
        redFlags,
      })
    }

    return NextResponse.json({
      response: parsedResponse.response,
      type: parsedResponse.type,
      patternExplored: parsedResponse.patternExplored,
      contextIntroduced: parsedResponse.contextIntroduced,
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
