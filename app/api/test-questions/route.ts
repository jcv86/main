import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("type")

    if (!testType) {
      return NextResponse.json({ error: "Test type is required" }, { status: 400 })
    }

    // Try to get questions from database first
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", testType)
        .order("question_number")

      if (!error && data && data.length > 0) {
        // Parse JSON options for each question
        const questions = data.map((question) => ({
          ...question,
          options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
        }))
        return NextResponse.json(questions)
      }
    } catch (dbError) {
      console.log("Database not available, using mock data")
    }

    // Fallback to mock data
    const mockQuestions = getMockQuestions(testType)
    return NextResponse.json(mockQuestions)
  } catch (error) {
    console.error("Error fetching test questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getMockQuestions(testType: string) {
  const mockQuestions: Record<string, any[]> = {
    "emotional-intelligence": [
      {
        id: 1,
        test_type: "emotional-intelligence",
        question_number: 1,
        question_text: "¿Cómo reaccionas cuando alguien te critica constructivamente?",
        options: [
          "Me molesto y me pongo a la defensiva",
          "Escucho pero no cambio mi comportamiento",
          "Considero la crítica y reflexiono sobre ella",
          "Agradezco la retroalimentación y busco mejorar",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        test_type: "emotional-intelligence",
        question_number: 2,
        question_text: "Cuando te sientes abrumado por las emociones, ¿qué haces?",
        options: [
          "Ignoro mis sentimientos",
          "Me dejo llevar por las emociones",
          "Trato de entender qué las causa",
          "Analizo mis emociones y busco soluciones",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        test_type: "emotional-intelligence",
        question_number: 3,
        question_text: "Cuando estás muy estresado en el trabajo, ¿qué haces?",
        options: [
          "Exploto y descargo mi frustración con otros",
          "Me quedo callado pero sigo sintiéndome mal",
          "Tomo un descanso para calmarme",
          "Uso técnicas de respiración y manejo del estrés",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        test_type: "emotional-intelligence",
        question_number: 4,
        question_text: "¿Cómo manejas los impulsos negativos cuando estás molesto?",
        options: [
          "No los controlo bien",
          "A veces los controlo",
          "Generalmente los controlo",
          "Siempre los controlo efectivamente",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        test_type: "emotional-intelligence",
        question_number: 5,
        question_text: "¿Qué te motiva más en tu trabajo?",
        options: [
          "Solo el salario y los beneficios",
          "El reconocimiento de otros",
          "Los desafíos y el crecimiento personal",
          "Hacer una diferencia significativa",
        ],
        category: "motivation",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        test_type: "emotional-intelligence",
        question_number: 6,
        question_text: "Ante los obstáculos en tus metas, ¿cómo reaccionas?",
        options: [
          "Me rindo fácilmente",
          "Persisto un poco",
          "Persisto con determinación",
          "Los veo como oportunidades de crecimiento",
        ],
        category: "motivation",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        test_type: "emotional-intelligence",
        question_number: 7,
        question_text: "Cuando un compañero está visiblemente molesto, ¿cómo respondes?",
        options: [
          "Lo ignoro, no es mi problema",
          "Le pregunto qué pasa pero no profundizo",
          "Trato de entender cómo se siente",
          "Ofrezco apoyo y ayuda específica",
        ],
        category: "empathy",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        test_type: "emotional-intelligence",
        question_number: 8,
        question_text: "¿Qué tan bien puedes leer las emociones de otras personas?",
        options: ["Muy mal", "Mal", "Bien", "Muy bien"],
        category: "empathy",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 9,
        test_type: "emotional-intelligence",
        question_number: 9,
        question_text: "En una reunión de equipo con conflicto, ¿cómo actúas?",
        options: [
          "Evito participar en la discusión",
          "Tomo partido por una de las partes",
          "Trato de mediar y encontrar puntos en común",
          "Facilito una solución colaborativa",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 10,
        test_type: "emotional-intelligence",
        question_number: 10,
        question_text: "¿Cómo describirías tus habilidades de comunicación?",
        options: ["Muy pobres", "Pobres", "Buenas", "Excelentes"],
        category: "social_skills",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  }

  return mockQuestions[testType] || []
}
