import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// A4 Tests data - gamified assessments for document readiness
const A4_TESTS = [
  {
    id: "cv-readiness",
    name: "CV Readiness Assessment",
    description: "Evalúa qué tan preparado está tu CV para el mercado laboral",
    category: "documents",
    questions_count: 10,
    estimated_time_minutes: 8,
    icon: "file-text",
  },
  {
    id: "linkedin-optimization",
    name: "LinkedIn Profile Check",
    description: "Descubre cómo mejorar tu perfil de LinkedIn",
    category: "branding",
    questions_count: 12,
    estimated_time_minutes: 10,
    icon: "linkedin",
  },
  {
    id: "star-stories",
    name: "STAR Stories Builder",
    description: "Prepara historias de éxito para tus entrevistas",
    category: "interviews",
    questions_count: 8,
    estimated_time_minutes: 15,
    icon: "star",
  },
  {
    id: "portfolio-readiness",
    name: "Portfolio Assessment",
    description: "Evalúa si necesitas un portafolio profesional",
    category: "documents",
    questions_count: 6,
    estimated_time_minutes: 5,
    icon: "briefcase",
  },
  {
    id: "cover-letter",
    name: "Cover Letter Skills",
    description: "Mejora tus cartas de presentación",
    category: "documents",
    questions_count: 8,
    estimated_time_minutes: 7,
    icon: "mail",
  },
]

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Get user's completed tests
    const { data: completedTests } = await supabase
      .from("despega_test_results")
      .select("test_type, completed_at, results")
      .eq("user_id", user.id)
      .in("test_type", A4_TESTS.map(t => t.id))

    const completedMap = new Map(
      completedTests?.map(t => [t.test_type, t]) || []
    )

    // Enrich tests with completion status
    let tests = A4_TESTS.map(test => ({
      ...test,
      completed: completedMap.has(test.id),
      completed_at: completedMap.get(test.id)?.completed_at,
      last_score: completedMap.get(test.id)?.results?.score,
    }))

    // Filter by category if specified
    if (category) {
      tests = tests.filter(t => t.category === category)
    }

    // Calculate overall progress
    const totalTests = A4_TESTS.length
    const completedCount = completedTests?.length || 0
    const progress = Math.round((completedCount / totalTests) * 100)

    return NextResponse.json({
      tests,
      stats: {
        total: totalTests,
        completed: completedCount,
        progress,
        categories: ["documents", "branding", "interviews"],
      }
    })
  } catch (error) {
    console.error("[v0] a4-tests GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
