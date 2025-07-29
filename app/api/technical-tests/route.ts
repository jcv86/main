import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { TECHNICAL_TESTS, TECHNICAL_SKILLS, calculateSkillLevel } from "@/lib/technical-skills-types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get("skillId")
    const career = searchParams.get("career")
    const difficulty = searchParams.get("difficulty")

    let tests = TECHNICAL_TESTS

    if (skillId) {
      tests = tests.filter((test) => test.skillId === skillId)
    }

    if (difficulty) {
      tests = tests.filter((test) => test.difficulty === difficulty)
    }

    if (career) {
      const relevantSkills = TECHNICAL_SKILLS.filter((skill) => skill.careerRelevance.includes(career))
      const skillIds = relevantSkills.map((skill) => skill.id)
      tests = tests.filter((test) => skillIds.includes(test.skillId))
    }

    return NextResponse.json({
      success: true,
      data: tests,
    })
  } catch (error) {
    console.error("Error fetching technical tests:", error)
    return NextResponse.json({ error: "Failed to fetch technical tests" }, { status: 500 })
  }
}

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
    const { testId, submission } = body

    const test = TECHNICAL_TESTS.find((t) => t.id === testId)
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Create submission record
    const submissionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      testId,
      submittedAt: new Date().toISOString(),
      status: "submitted" as const,
      timeSpent: submission.timeSpent || 0,
      submission,
      attempts: 1,
    }

    // Evaluate submission based on test type
    const evaluation = await evaluateSubmission(test, submission)

    submissionRecord.score = evaluation.score
    submissionRecord.feedback = evaluation.feedback
    submissionRecord.completedAt = new Date().toISOString()
    submissionRecord.status = "evaluated"

    // Save to database (simplified - in real app would use Supabase)
    // await supabase.from('test_submissions').insert(submissionRecord)

    // Update skill validation if score is high enough
    if (evaluation.score >= 60) {
      const skillLevel = calculateSkillLevel(evaluation.score)
      const validation = {
        id: `val_${Date.now()}`,
        userId: user.id,
        skillId: test.skillId,
        level: skillLevel,
        score: evaluation.score,
        validatedAt: new Date().toISOString(),
        testResults: [
          {
            testId,
            score: evaluation.score,
            completedAt: new Date().toISOString(),
          },
        ],
      }

      // Save validation (simplified)
      // await supabase.from('skill_validations').upsert(validation)
    }

    return NextResponse.json({
      success: true,
      data: {
        submission: submissionRecord,
        evaluation,
      },
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}

async function evaluateSubmission(test: any, submission: any) {
  // This would be more sophisticated in a real implementation
  // For now, we'll simulate evaluation based on test type

  let score = 0
  const feedback: any = {
    overallScore: 0,
    maxScore: test.maxScore,
    level: "beginner" as const,
    passed: false,
    strengths: [],
    improvements: [],
    detailedFeedback: [],
    nextSteps: [],
    recommendedResources: [],
    aiCoachingMessage: "",
  }

  switch (test.type) {
    case "code":
      score = await evaluateCodeSubmission(test, submission)
      break
    case "excel":
      score = await evaluateExcelSubmission(test, submission)
      break
    case "sql":
      score = await evaluateSQLSubmission(test, submission)
      break
    case "presentation":
      score = await evaluatePresentationSubmission(test, submission)
      break
    default:
      score = Math.floor(Math.random() * 100) // Placeholder
  }

  feedback.overallScore = score
  feedback.level = calculateSkillLevel(score)
  feedback.passed = score >= 60

  // Generate AI feedback
  feedback.aiCoachingMessage = generateAIFeedback(test, score, feedback.level)

  // Generate detailed feedback per criterion
  feedback.detailedFeedback = test.evaluationCriteria.map((criterion: any) => ({
    criterion: criterion.criterion,
    score: Math.floor((score * criterion.weight) / 100),
    maxScore: Math.floor((test.maxScore * criterion.weight) / 100),
    feedback: generateCriterionFeedback(criterion, score),
    suggestions: generateSuggestions(criterion, score),
  }))

  // Generate strengths and improvements
  if (score >= 75) {
    feedback.strengths = ["Excelente comprensión de los conceptos", "Implementación eficiente", "Código/trabajo limpio"]
  } else if (score >= 60) {
    feedback.strengths = ["Comprensión básica sólida", "Enfoque correcto"]
    feedback.improvements = ["Optimización de la solución", "Manejo de casos especiales"]
  } else {
    feedback.improvements = [
      "Revisar conceptos fundamentales",
      "Practicar más ejercicios",
      "Buscar recursos adicionales",
    ]
  }

  // Generate next steps
  feedback.nextSteps = generateNextSteps(test, score)

  // Generate recommended resources
  feedback.recommendedResources = generateRecommendedResources(test, score)

  return { score, feedback }
}

async function evaluateCodeSubmission(test: any, submission: any): Promise<number> {
  // In a real implementation, this would:
  // 1. Run the code against test cases
  // 2. Check for syntax errors
  // 3. Evaluate efficiency
  // 4. Check code quality

  // For now, simulate based on submission content
  const codeLength = submission.content?.length || 0
  const hasComments = submission.content?.includes("//") || submission.content?.includes("#")
  const hasFunctions = submission.content?.includes("def ") || submission.content?.includes("function")

  let score = 50 // Base score

  if (codeLength > 100) score += 20
  if (hasComments) score += 15
  if (hasFunctions) score += 15

  return Math.min(score, 100)
}

async function evaluateExcelSubmission(test: any, submission: any): Promise<number> {
  // In a real implementation, this would:
  // 1. Parse the uploaded Excel file
  // 2. Check for required elements (pivot tables, formulas, charts)
  // 3. Validate calculations
  // 4. Check formatting

  // For now, simulate based on file presence and size
  const hasFile = submission.files && submission.files.length > 0
  const fileSize = submission.files?.[0]?.size || 0

  let score = hasFile ? 60 : 20
  if (fileSize > 50000) score += 20 // Assume more complex file
  if (fileSize > 100000) score += 20

  return Math.min(score, 100)
}

async function evaluateSQLSubmission(test: any, submission: any): Promise<number> {
  // In a real implementation, this would:
  // 1. Parse SQL queries
  // 2. Run against test database
  // 3. Validate results
  // 4. Check query optimization

  const queries = submission.content?.split(";") || []
  const hasJoins = submission.content?.toLowerCase().includes("join")
  const hasAggregates = submission.content?.toLowerCase().includes("group by")

  let score = queries.length * 15
  if (hasJoins) score += 25
  if (hasAggregates) score += 25

  return Math.min(score, 100)
}

async function evaluatePresentationSubmission(test: any, submission: any): Promise<number> {
  // In a real implementation, this would use AI to analyze:
  // 1. Slide design and layout
  // 2. Content quality and structure
  // 3. Visual elements
  // 4. Message clarity

  const hasFile = submission.files && submission.files.length > 0
  const hasUrl = submission.content?.includes("http")

  return hasFile || hasUrl ? 75 : 30
}

function generateAIFeedback(test: any, score: number, level: string): string {
  const skill = TECHNICAL_SKILLS.find((s) => s.id === test.skillId)

  if (score >= 80) {
    return `¡Excelente trabajo en ${skill?.name}! Tu desempeño demuestra un dominio sólido de esta habilidad. Has alcanzado el nivel ${level}, lo que te posiciona muy bien en el mercado laboral chileno. Te recomiendo mantener estas habilidades actualizadas y considerar certificaciones adicionales para destacar aún más.`
  } else if (score >= 60) {
    return `Buen trabajo en ${skill?.name}. Has demostrado una comprensión sólida y alcanzado el nivel ${level}. Para mejorar aún más, te sugiero practicar los aspectos específicos mencionados en el feedback detallado. Con un poco más de práctica, podrás alcanzar un nivel avanzado.`
  } else {
    return `Gracias por completar la prueba de ${skill?.name}. Aunque el resultado indica que hay áreas de mejora, esto es una excelente oportunidad de aprendizaje. Te recomiendo revisar los recursos sugeridos y practicar más antes de intentar nuevamente. ¡No te desanimes, el aprendizaje es un proceso!`
  }
}

function generateCriterionFeedback(criterion: any, score: number): string {
  if (score >= 80) {
    return `Excelente desempeño en ${criterion.criterion}. Cumples completamente con los estándares esperados.`
  } else if (score >= 60) {
    return `Buen trabajo en ${criterion.criterion}. Hay algunos aspectos que podrías mejorar para alcanzar la excelencia.`
  } else {
    return `${criterion.criterion} necesita más trabajo. Te recomiendo revisar los conceptos fundamentales en esta área.`
  }
}

function generateSuggestions(criterion: any, score: number): string[] {
  const suggestions = [
    "Practica ejercicios similares regularmente",
    "Revisa documentación oficial y mejores prácticas",
    "Busca ejemplos de implementaciones exitosas",
    "Considera tomar un curso especializado en esta área",
  ]

  return suggestions.slice(0, score < 60 ? 4 : 2)
}

function generateNextSteps(test: any, score: number): string[] {
  const steps = [
    "Revisa el feedback detallado para cada criterio",
    "Identifica las áreas específicas que necesitan mejora",
    "Practica con ejercicios similares",
  ]

  if (score >= 80) {
    steps.push("Considera tomar pruebas de nivel más avanzado")
    steps.push("Explora certificaciones profesionales en esta área")
  } else if (score >= 60) {
    steps.push("Repite la prueba en 2-4 semanas después de practicar")
    steps.push("Busca recursos adicionales de aprendizaje")
  } else {
    steps.push("Comienza con recursos básicos antes de intentar nuevamente")
    steps.push("Considera buscar mentoría o tutorías")
  }

  return steps
}

function generateRecommendedResources(test: any, score: number): any[] {
  const resources = [
    {
      type: "course",
      title: "Curso Básico de la Habilidad",
      description: "Fundamentos esenciales para dominar esta habilidad",
      estimatedTime: "2-4 semanas",
    },
    {
      type: "practice",
      title: "Ejercicios Prácticos",
      description: "Conjunto de ejercicios para reforzar el aprendizaje",
      estimatedTime: "1 hora diaria",
    },
  ]

  if (score < 60) {
    resources.unshift({
      type: "tutorial",
      title: "Tutorial Paso a Paso",
      description: "Guía detallada desde conceptos básicos",
      estimatedTime: "3-5 horas",
    })
  }

  return resources
}
