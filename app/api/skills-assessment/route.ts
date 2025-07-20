import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { responses, assessmentType } = body

    // Mock skills assessment results
    const results = {
      technical: {
        overall_score: 82,
        categories: {
          programming: 85,
          databases: 78,
          cloud_platforms: 75,
          devops: 70,
          testing: 80,
        },
        skills: [
          { name: "JavaScript", level: 90, category: "programming" },
          { name: "React", level: 88, category: "programming" },
          { name: "Node.js", level: 85, category: "programming" },
          { name: "PostgreSQL", level: 78, category: "databases" },
          { name: "AWS", level: 75, category: "cloud_platforms" },
          { name: "Docker", level: 70, category: "devops" },
          { name: "Jest", level: 80, category: "testing" },
        ],
        recommendations: [
          "Profundizar en arquitectura de microservicios",
          "Obtener certificación AWS",
          "Mejorar habilidades en testing automatizado",
        ],
      },
      soft_skills: {
        overall_score: 76,
        categories: {
          communication: 82,
          leadership: 75,
          teamwork: 85,
          problem_solving: 80,
          adaptability: 70,
        },
        strengths: [
          "Excelente trabajo en equipo",
          "Comunicación clara y efectiva",
          "Fuerte capacidad de resolución de problemas",
        ],
        areas_for_improvement: [
          "Liderazgo de equipos grandes",
          "Adaptabilidad a cambios rápidos",
          "Presentaciones públicas",
        ],
      },
    }

    const assessmentResult = results[assessmentType as keyof typeof results] || results.technical

    return NextResponse.json({
      success: true,
      results: assessmentResult,
      market_insights: {
        demand_level: "Alta",
        salary_range: "CLP 2,800,000 - 4,500,000",
        growth_projection: "15% anual",
        top_employers: ["NotCo", "Fintual", "Cornershop", "Banco de Chile"],
      },
    })
  } catch (error) {
    console.error("Skills Assessment API Error:", error)
    return NextResponse.json({ success: false, error: "Error processing assessment" }, { status: 500 })
  }
}
