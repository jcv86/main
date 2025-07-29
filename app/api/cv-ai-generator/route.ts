import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { generationType, inputData, templateId } = body

    // Simulate AI generation (in a real app, this would call OpenAI or similar)
    let generatedContent = {}

    switch (generationType) {
      case "complete":
        generatedContent = await generateCompleteCV(inputData)
        break
      case "section":
        generatedContent = await generateCVSection(inputData)
        break
      case "optimize":
        generatedContent = await optimizeCV(inputData)
        break
      default:
        return NextResponse.json({ error: "Invalid generation type" }, { status: 400 })
    }

    // Calculate quality score
    const qualityScore = calculateQualityScore(generatedContent)

    // Generate feedback
    const feedback = generateFeedback(generatedContent)

    // Save to database
    const { data: generationRecord, error: saveError } = await supabase
      .from("cv_generation_history")
      .insert({
        user_id: user.id,
        generation_type: generationType,
        input_data: inputData,
        generated_content: generatedContent,
        template_id: templateId,
        quality_score: qualityScore,
        feedback: feedback,
      })
      .select()
      .single()

    if (saveError) {
      console.error("Error saving generation:", saveError)
      return NextResponse.json({ error: "Failed to save generation" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: generationRecord.id,
        generatedContent,
        qualityScore,
        feedback,
      },
    })
  } catch (error) {
    console.error("CV generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const { data: generations, error } = await supabase
      .from("cv_generation_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching generations:", error)
      return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: generations,
    })
  } catch (error) {
    console.error("Error fetching CV generations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateCompleteCV(inputData: any) {
  // Simulate AI-generated complete CV
  return {
    personalInfo: {
      fullName: inputData.fullName || "Profesional Chileno",
      email: inputData.email || "profesional@email.com",
      phone: inputData.phone || "+56 9 1234 5678",
      location: inputData.location || "Santiago, Chile",
      jobTitle: inputData.targetRole || "Profesional Senior",
      summary: `Profesional experimentado en ${inputData.industry || "tecnología"} con sólida experiencia en el mercado chileno. Especializado en liderar equipos y entregar resultados excepcionales que impulsan el crecimiento empresarial.`,
    },
    experience: [
      {
        id: "exp1",
        jobTitle: inputData.targetRole || "Profesional Senior",
        company: "Empresa Líder Chile",
        location: "Santiago, Chile",
        startDate: "2020-01",
        endDate: "",
        description: `Lideré iniciativas estratégicas en ${inputData.industry || "tecnología"}, logrando mejoras significativas en eficiencia operacional y satisfacción del cliente.`,
        achievements: [
          "Incremento del 30% en productividad del equipo",
          "Implementación exitosa de nuevos procesos",
          "Liderazgo de proyectos de alto impacto",
        ],
        technologies: inputData.skills || ["Liderazgo", "Gestión de Proyectos", "Análisis de Datos"],
      },
    ],
    skills: (inputData.skills || ["Liderazgo", "Comunicación", "Resolución de Problemas"]).map(
      (skill: string, index: number) => ({
        id: `skill${index + 1}`,
        name: skill,
        level: 80 + Math.floor(Math.random() * 20),
        category: "Técnica",
        yearsOfExperience: 3 + Math.floor(Math.random() * 5),
      }),
    ),
    education: [
      {
        id: "edu1",
        degree: inputData.education || "Título Profesional",
        institution: "Universidad Prestigiosa de Chile",
        location: "Santiago, Chile",
        startDate: "2016-03",
        endDate: "2020-12",
        description: "Formación integral con enfoque en excelencia académica y desarrollo profesional.",
      },
    ],
    languages: [
      { id: "lang1", name: "Español", proficiency: "Nativo" },
      { id: "lang2", name: "Inglés", proficiency: "Avanzado" },
    ],
    projects: [],
    certifications: [],
  }
}

async function generateCVSection(inputData: any) {
  const { section, context } = inputData

  switch (section) {
    case "summary":
      return {
        summary: `Profesional altamente calificado con experiencia comprobada en ${context.industry || "el sector"}. Especializado en liderar equipos multidisciplinarios y entregar resultados excepcionales que impulsan el crecimiento empresarial en el mercado chileno.`,
      }
    case "experience":
      return {
        experience: {
          id: "new_exp",
          jobTitle: context.role || "Profesional Senior",
          company: context.company || "Empresa Chilena",
          location: "Santiago, Chile",
          startDate: "2022-01",
          endDate: "",
          description: `Responsable de liderar iniciativas estratégicas y gestionar equipos de alto rendimiento, logrando mejoras significativas en eficiencia operacional.`,
          achievements: [
            "Incremento del 25% en productividad del equipo",
            "Implementación exitosa de nuevos procesos",
            "Reducción del 15% en costos operacionales",
          ],
          technologies: context.skills || ["Liderazgo", "Gestión de Proyectos"],
        },
      }
    default:
      return { [section]: "Contenido generado por IA" }
  }
}

async function optimizeCV(inputData: any) {
  const { cvData, targetRole, jobDescription } = inputData

  // Simulate CV optimization
  return {
    optimizedSummary: `${cvData.personalInfo?.summary || "Profesional experimentado"} con enfoque específico en ${targetRole} y experiencia comprobada en el mercado chileno.`,
    keywordSuggestions: ["liderazgo", "gestión de equipos", "resultados", "eficiencia", "innovación"],
    improvementAreas: [
      "Agregar más métricas cuantificables",
      "Incluir palabras clave específicas del rol",
      "Destacar logros relevantes para la posición",
    ],
  }
}

function calculateQualityScore(content: any): number {
  let score = 0

  // Check completeness
  if (content.personalInfo?.fullName) score += 10
  if (content.personalInfo?.summary) score += 15
  if (content.experience?.length > 0) score += 25
  if (content.skills?.length > 0) score += 20
  if (content.education?.length > 0) score += 15
  if (content.languages?.length > 0) score += 10
  if (content.projects?.length > 0) score += 5

  return Math.min(score, 100)
}

function generateFeedback(content: any) {
  const feedback = []

  if (!content.personalInfo?.summary) {
    feedback.push({
      type: "missing",
      priority: "high",
      message: "Agrega un resumen profesional para destacar tu perfil",
      section: "summary",
    })
  }

  if (!content.experience || content.experience.length === 0) {
    feedback.push({
      type: "missing",
      priority: "high",
      message: "Incluye tu experiencia laboral para mostrar tu trayectoria",
      section: "experience",
    })
  }

  if (!content.skills || content.skills.length < 5) {
    feedback.push({
      type: "improvement",
      priority: "medium",
      message: "Agrega más habilidades relevantes para tu área",
      section: "skills",
    })
  }

  feedback.push({
    type: "suggestion",
    priority: "low",
    message: "Considera agregar proyectos relevantes para destacar tu experiencia práctica",
    section: "projects",
  })

  return feedback
}
