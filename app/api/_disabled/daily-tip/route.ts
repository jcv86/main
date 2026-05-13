import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const careerStage = searchParams.get("stage") || "all"

    const supabase = await createClient()

    // Get a random tip for the user's career stage
    const { data: tips, error } = await supabase
      .from("career_tips")
      .select("*")
      .eq("is_active", true)
      .or(`career_stage.eq.${careerStage},career_stage.eq.all`)
      .limit(10)

    if (error) {
      console.error("Error fetching tips:", error)
      return NextResponse.json(
        {
          tip: {
            title: "Aprendizaje Continuo",
            content:
              "Dedica tiempo cada día a aprender algo nuevo. El crecimiento profesional es un viaje, no un destino.",
            category: "learning",
            icon: "book-open",
          },
        },
        { status: 200 },
      )
    }

    // Select a random tip based on the day of the year to ensure consistency throughout the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const randomIndex = dayOfYear % (tips?.length || 1)
    const selectedTip = tips?.[randomIndex] || tips?.[0]

    return NextResponse.json({ tip: selectedTip }, { status: 200 })
  } catch (error) {
    console.error("Error in daily tip API:", error)
    return NextResponse.json(
      {
        tip: {
          title: "Desarrollo Profesional",
          content: "Cada día es una oportunidad para crecer. Mantén tu enfoque en el aprendizaje continuo.",
          category: "growth",
          icon: "trending-up",
        },
      },
      { status: 200 },
    )
  }
}
