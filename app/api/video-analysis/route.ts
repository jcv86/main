import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500mb",
    },
  },
  maxDuration: 300, // 5 minutes timeout for long videos
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const videoFile = formData.get("video") as File

    if (!videoFile) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    // TODO: Implement video processing with GPT-4o
    // For now, return a mock response showing the structure

    const mockResult = {
      videoName: videoFile.name,
      duration: "15:32",
      detectedQuestions: [
        "¿Cómo manejas la presión en situaciones de alto estrés?",
        "¿Prefieres trabajar en equipo o de forma independiente?",
        "¿Cuál es tu mayor fortaleza profesional?",
      ],
      detectedAnswers: ["Respuesta rápida y decisiva", "Prefiero el trabajo colaborativo", "Liderazgo y comunicación"],
      testType: "DISC - Dominancia Predominante",
      similarityScore: 87,
      analysis: `Análisis del video:
- Se detectaron 12 preguntas del test DISC
- Las respuestas muestran un perfil D-I (Dominancia-Influencia)
- Concordancia del 87% con el patrón DISC estándar
- El video es de buena calidad y las respuestas son claras
- Recomendación: Los resultados pueden ser usados para validación`,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error("[v0] Video analysis error:", error)
    return NextResponse.json({ error: "Error processing video" }, { status: 500 })
  }
}
