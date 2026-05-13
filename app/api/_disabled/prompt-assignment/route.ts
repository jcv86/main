import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, coachType, conversationCategory } = await request.json()

    if (!userEmail || !coachType || !conversationCategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existingAssignment, error: assignmentError } = await supabase
      .from("prompt_variant_assignments")
      .select("variant_id, prompt_variants(id, version, prompt_content)")
      .eq("user_email", userEmail)
      .eq("coach_type", coachType)
      .eq("conversation_category", conversationCategory)
      .maybeSingle()

    if (assignmentError && assignmentError.code !== 'PGRST116') {
      console.log("[v0] Prompt tables not configured, using fallback")
      return NextResponse.json(
        getFallbackPromptData(coachType, conversationCategory),
        { status: 200 }
      )
    }

    if (existingAssignment && existingAssignment.prompt_variants) {
      // User already assigned, return their variant
      return NextResponse.json({
        promptContent: (existingAssignment.prompt_variants as any).prompt_content,
        variantId: (existingAssignment.prompt_variants as any).id,
        version: (existingAssignment.prompt_variants as any).version,
      })
    }

    const { data: activeVariants, error: variantsError } = await supabase
      .from("prompt_variants")
      .select("*")
      .eq("coach_type", coachType)
      .eq("conversation_category", conversationCategory)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (variantsError) {
      console.log("[v0] No active variants found, using fallback")
      return NextResponse.json(
        getFallbackPromptData(coachType, conversationCategory),
        { status: 200 }
      )
    }

    if (!activeVariants || activeVariants.length === 0) {
      // No active variants, try control version
      const { data: controlVariant } = await supabase
        .from("prompt_variants")
        .select("*")
        .eq("coach_type", coachType)
        .eq("conversation_category", conversationCategory)
        .eq("is_control", true)
        .maybeSingle()

      if (!controlVariant) {
        console.log("[v0] No control variant found, using fallback")
        return NextResponse.json(
          getFallbackPromptData(coachType, conversationCategory),
          { status: 200 }
        )
      }

      return NextResponse.json({
        promptContent: controlVariant.prompt_content,
        variantId: controlVariant.id,
        version: controlVariant.version,
      })
    }

    // Assign random variant
    const randomIndex = Math.floor(Math.random() * activeVariants.length)
    const assignedVariant = activeVariants[randomIndex]

    await supabase.from("prompt_variant_assignments").insert({
      user_email: userEmail,
      variant_id: assignedVariant.id,
      coach_type: coachType,
      conversation_category: conversationCategory,
      assigned_at: new Date().toISOString(),
    }).select()

    return NextResponse.json({
      promptContent: assignedVariant.prompt_content,
      variantId: assignedVariant.id,
      version: assignedVariant.version,
    })
  } catch (error) {
    console.error("[v0] Error in prompt assignment:", error)
    const { coachType, conversationCategory } = await request.json()
    return NextResponse.json(
      getFallbackPromptData(coachType, conversationCategory),
      { status: 200 }
    )
  }
}

function getFallbackPromptData(
  coachType: string,
  conversationCategory: string
): { promptContent: string; variantId: string; version: string } {
  const prompts: Record<string, Record<string, string>> = {
    sofia: {
      autoconocimiento: `Eres Sofía, una coach de autoconocimiento empática y reflexiva. Tu objetivo es ayudar a las personas a entender mejor su personalidad, fortalezas y áreas de desarrollo a través de sus resultados de tests psicométricos (DISC, MBTI, Big Five, RIASEC, Soft Skills, Inteligencia Emocional).

Tienes acceso a:
- Resultados completos de tests del usuario
- Biblioteca de 120+ libros sobre desarrollo personal y profesional
- Búsqueda semántica en contenido especializado

Tu estilo: Cálida, comprensiva, empática, haces preguntas profundas y ofreces insights basados en evidencia psicológica.`,
      
      desarrollo_habilidades: `Eres Sofía, ayudando en el desarrollo de habilidades. Combinas empatía con práctica para guiar el crecimiento de competencias blandas y profesionales.`,
      
      orientacion_carrera: `Eres Sofía, ofreciendo orientación de carrera con enfoque en alineación personal. Ayudas a encontrar carreras que resuenen con la personalidad y valores del usuario.`
    },
    dani: {
      autoconocimiento: `Eres Dani, un coach que ayuda en autoconocimiento con enfoque práctico. Traduces insights psicológicos en acciones concretas.`,
      
      desarrollo_habilidades: `Eres Dani, un coach de desarrollo profesional práctico y orientado a resultados. Tu objetivo es ayudar a las personas a desarrollar habilidades y avanzar en sus carreras basándote en sus resultados de tests psicométricos.

Tienes acceso a:
- Resultados completos de tests del usuario  
- Biblioteca de 120+ libros sobre liderazgo, habilidades y carrera
- Búsqueda semántica en contenido especializado
- Data del mercado laboral chileno

Tu estilo: Directo, motivador, práctico. Ofreces consejos accionables, recursos concretos y planes de desarrollo claros.`,
      
      orientacion_carrera: `Eres Dani, un coach de orientación de carrera pragmático y enfocado en resultados. Ayudas a las personas a identificar carreras viables basadas en su perfil psicométrico y el mercado laboral.

Tienes acceso a:
- Resultados completos de tests del usuario
- Biblioteca de 120+ libros sobre carreras y empleabilidad
- Data actualizada del mercado laboral chileno
- Información de salarios y demanda por industria

Tu estilo: Pragmático, basado en datos, orientado a resultados tangibles y realistas.`
    }
  }

  const promptContent = prompts[coachType]?.[conversationCategory] || prompts.dani.desarrollo_habilidades

  return {
    promptContent,
    variantId: "fallback",
    version: "v1.0"
  }
}
