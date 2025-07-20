import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { responses, testType } = body

    // Mock personality analysis based on test type
    let analysis

    if (testType === "disc") {
      analysis = {
        primary_type: "D",
        secondary_type: "I",
        scores: {
          D: 85, // Dominance
          I: 72, // Influence
          S: 45, // Steadiness
          C: 38, // Conscientiousness
        },
        description:
          "Eres un líder natural con alta orientación a resultados y excelentes habilidades de comunicación.",
        strengths: [
          "Liderazgo natural",
          "Orientación a resultados",
          "Comunicación efectiva",
          "Toma de decisiones rápida",
        ],
        challenges: [
          "Puede ser impaciente",
          "Tendencia a dominar conversaciones",
          "Necesita trabajar en la escucha activa",
        ],
        career_fit: ["Gerente de Proyectos", "Director de Ventas", "Emprendedor", "Consultor Senior"],
      }
    } else {
      // Big Five or other personality tests
      analysis = {
        traits: {
          openness: 78,
          conscientiousness: 85,
          extraversion: 72,
          agreeableness: 65,
          neuroticism: 32,
        },
        summary: "Perfil de personalidad equilibrado con alta consciencia y apertura a nuevas experiencias.",
        career_recommendations: [
          "Roles que requieren creatividad e innovación",
          "Posiciones de liderazgo y gestión",
          "Trabajos que involucren resolución de problemas complejos",
        ],
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Personality Analysis API Error:", error)
    return NextResponse.json({ success: false, error: "Error analyzing personality" }, { status: 500 })
  }
}
