"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import { ArrowLeft, ArrowRight, Target, Clock, FileText, CheckCircle, Compass } from "lucide-react"

interface Question {
  id: number
  text: string
  category: "R" | "I" | "A" | "S" | "E" | "C"
}

const riasecQuestions: Question[] = [
  // Realistic (R) - 5 questions
  { id: 1, text: "Me gusta trabajar con herramientas y maquinaria", category: "R" },
  { id: 2, text: "Prefiero actividades prácticas y manuales", category: "R" },
  { id: 3, text: "Me interesa reparar y construir cosas", category: "R" },
  { id: 4, text: "Disfruto trabajando al aire libre", category: "R" },
  { id: 5, text: "Me gusta resolver problemas técnicos", category: "R" },

  // Investigative (I) - 5 questions
  { id: 6, text: "Me fascina investigar y analizar datos", category: "I" },
  { id: 7, text: "Disfruto resolviendo problemas complejos", category: "I" },
  { id: 8, text: "Me gusta experimentar y probar teorías", category: "I" },
  { id: 9, text: "Prefiero trabajar de forma independiente", category: "I" },
  { id: 10, text: "Me interesa entender cómo funcionan las cosas", category: "I" },

  // Artistic (A) - 5 questions
  { id: 11, text: "Me gusta expresarme creativamente", category: "A" },
  { id: 12, text: "Disfruto diseñando y creando cosas nuevas", category: "A" },
  { id: 13, text: "Me interesa el arte, la música o la literatura", category: "A" },
  { id: 14, text: "Prefiero ambientes de trabajo flexibles", category: "A" },
  { id: 15, text: "Me gusta trabajar en proyectos originales", category: "A" },

  // Social (S) - 5 questions
  { id: 16, text: "Me gusta ayudar y enseñar a otros", category: "S" },
  { id: 17, text: "Disfruto trabajando en equipo", category: "S" },
  { id: 18, text: "Me interesa el bienestar de las personas", category: "S" },
  { id: 19, text: "Prefiero actividades que involucren interacción social", category: "S" },
  { id: 20, text: "Me gusta resolver conflictos y mediar", category: "S" },

  // Enterprising (E) - 5 questions
  { id: 21, text: "Me gusta liderar y dirigir proyectos", category: "E" },
  { id: 22, text: "Disfruto persuadiendo y vendiendo ideas", category: "E" },
  { id: 23, text: "Me interesa iniciar nuevos negocios", category: "E" },
  { id: 24, text: "Prefiero tomar decisiones importantes", category: "E" },
  { id: 25, text: "Me gusta competir y ganar", category: "E" },

  // Conventional (C) - 5 questions
  { id: 26, text: "Me gusta organizar y planificar actividades", category: "C" },
  { id: 27, text: "Disfruto trabajando con datos y números", category: "C" },
  { id: 28, text: "Me interesa seguir procedimientos establecidos", category: "C" },
  { id: 29, text: "Prefiero ambientes de trabajo estructurados", category: "C" },
  { id: 30, text: "Me gusta mantener registros detallados", category: "C" },
]

export default function RIASECTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkUserSession()
    setStartTime(new Date())
  }, [])

  const checkUserSession = async () => {
    // Check local session first
    const localSession = localStorage.getItem("dtc_session")
    if (localSession) {
      try {
        const sessionData = JSON.parse(localSession)
        if (sessionData.authenticated && sessionData.user) {
          setUserEmail(sessionData.user.email)
          return
        }
      } catch (error) {
        console.log("Invalid local session")
      }
    }

    // Check Supabase session
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
      } else {
        router.push("/auth")
      }
    } catch (error) {
      router.push("/auth")
    }
  }

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: Number.parseInt(value) })
  }

  const nextQuestion = () => {
    if (currentQuestion < riasecQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

    riasecQuestions.forEach((question, index) => {
      const answer = answers[index] || 0
      scores[question.category] += answer
    })

    // Convert to percentages (max score per category is 25 = 5 questions × 5 points)
    const maxScore = 25
    const percentageScores = {
      R: Math.round((scores.R / maxScore) * 100),
      I: Math.round((scores.I / maxScore) * 100),
      A: Math.round((scores.A / maxScore) * 100),
      S: Math.round((scores.S / maxScore) * 100),
      E: Math.round((scores.E / maxScore) * 100),
      C: Math.round((scores.C / maxScore) * 100),
    }

    // Get top 3 interests
    const sortedInterests = Object.entries(percentageScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    const interestNames = {
      R: "Realista",
      I: "Investigativo",
      A: "Artístico",
      S: "Social",
      E: "Emprendedor",
      C: "Convencional",
    }

    const primary_interests = sortedInterests.map(([key]) => interestNames[key as keyof typeof interestNames])
    const holland_code = sortedInterests.map(([key]) => key).join("")

    // Generate career recommendations based on top interests
    const careerRecommendations = generateCareerRecommendations(holland_code)
    const workEnvironments = generateWorkEnvironments(holland_code)
    const strengths = generateStrengths(holland_code)
    const workValues = generateWorkValues(holland_code)

    return {
      ...percentageScores,
      primary_interests,
      secondary_interests: primary_interests.slice(1),
      holland_code,
      personality_summary: generatePersonalitySummary(holland_code, primary_interests),
      career_recommendations: careerRecommendations,
      work_environments: workEnvironments,
      development_areas: [
        "Explorar áreas de interés secundarias para ampliar oportunidades",
        "Desarrollar habilidades complementarias a tus intereses principales",
        "Buscar experiencias que combinen múltiples áreas de interés",
      ],
      strengths,
      work_values: workValues,
    }
  }

  const generatePersonalitySummary = (code: string, interests: string[]) => {
    const summaries: Record<string, string> = {
      IEA: "Perfil de innovador emprendedor con fuerte orientación hacia la investigación y la creatividad.",
      EIA: "Líder visionario que combina habilidades empresariales con pensamiento analítico y creatividad.",
      AEI: "Creativo emprendedor con capacidad para innovar y liderar proyectos artísticos o de diseño.",
      SEA: "Líder social con orientación hacia el servicio y la creatividad en el desarrollo de otros.",
      ESA: "Emprendedor social que combina liderazgo empresarial con compromiso hacia el bienestar comunitario.",
      ASE: "Creativo social con habilidades para liderar proyectos que impacten positivamente en las personas.",
    }

    return summaries[code] || `Perfil con intereses principales en ${interests.join(", ").toLowerCase()}.`
  }

  const generateCareerRecommendations = (code: string): string[] => {
    const recommendations: Record<string, string[]> = {
      IEA: [
        "Consultor de Innovación",
        "Director de I+D",
        "Emprendedor Tecnológico",
        "Arquitecto de Soluciones",
        "Product Manager",
      ],
      EIA: [
        "CEO/Fundador",
        "Director de Estrategia",
        "Consultor Senior",
        "Venture Capitalist",
        "Director de Innovación",
      ],
      AEI: [
        "Director Creativo",
        "Fundador de Agencia",
        "Product Designer",
        "Director de Marketing Creativo",
        "Emprendedor Creativo",
      ],
      SEA: [
        "Director de RRHH",
        "Consultor Organizacional",
        "Coach Ejecutivo",
        "Director de Desarrollo",
        "Líder de Transformación",
      ],
      ESA: [
        "Emprendedor Social",
        "Director de ONG",
        "Consultor de Impacto",
        "Líder Comunitario",
        "Director de Sostenibilidad",
      ],
      ASE: [
        "Director de Experiencia",
        "Diseñador de Servicios",
        "Facilitador de Innovación",
        "Director de Cultura",
        "Coach Creativo",
      ],
    }

    return recommendations[code] || ["Consultor", "Gerente de Proyecto", "Especialista", "Coordinador", "Analista"]
  }

  const generateWorkEnvironments = (code: string): string[] => {
    const environments: Record<string, string[]> = {
      IEA: [
        "Startups tecnológicas",
        "Centros de I+D",
        "Consultorías de innovación",
        "Laboratorios de diseño",
        "Incubadoras",
      ],
      EIA: [
        "Empresas de consultoría",
        "Startups",
        "Corporaciones multinacionales",
        "Fondos de inversión",
        "Think tanks",
      ],
      AEI: [
        "Agencias creativas",
        "Estudios de diseño",
        "Empresas de medios",
        "Startups creativas",
        "Consultorías de marca",
      ],
      SEA: [
        "ONGs",
        "Empresas con propósito",
        "Consultorías de RRHH",
        "Instituciones educativas",
        "Organizaciones de desarrollo",
      ],
      ESA: [
        "Empresas B-Corp",
        "Organizaciones sociales",
        "Consultorías de impacto",
        "Fundaciones",
        "Empresas de economía circular",
      ],
      ASE: [
        "Agencias de experiencia",
        "Consultorías de diseño",
        "Empresas de innovación social",
        "Estudios creativos",
        "Organizaciones culturales",
      ],
    }

    return (
      environments[code] || [
        "Oficinas corporativas",
        "Empresas medianas",
        "Organizaciones diversas",
        "Equipos multidisciplinarios",
      ]
    )
  }

  const generateStrengths = (code: string): string[] => {
    const strengths: Record<string, string[]> = {
      IEA: [
        "Excelente capacidad para identificar oportunidades de innovación",
        "Habilidad natural para generar ideas creativas y viables",
        "Facilidad para conectar conceptos complejos de diferentes áreas",
        "Motivación intrínseca para resolver problemas desafiantes",
      ],
      EIA: [
        "Liderazgo natural con visión estratégica",
        "Capacidad para tomar decisiones basadas en análisis profundo",
        "Habilidad para inspirar y motivar equipos hacia objetivos ambiciosos",
        "Facilidad para identificar y capitalizar oportunidades de mercado",
      ],
      AEI: [
        "Creatividad aplicada a soluciones empresariales",
        "Capacidad para innovar en productos y servicios",
        "Habilidad para comunicar ideas complejas de forma atractiva",
        "Visión estética combinada con pensamiento estratégico",
      ],
    }

    return (
      strengths[code] || [
        "Combinación única de intereses que aporta perspectiva diversa",
        "Capacidad para trabajar en múltiples áreas de especialización",
        "Flexibilidad para adaptarse a diferentes contextos laborales",
        "Potencial para roles interdisciplinarios",
      ]
    )
  }

  const generateWorkValues = (code: string): string[] => {
    const values: Record<string, string[]> = {
      IEA: [
        "Autonomía e independencia",
        "Oportunidades de crecimiento intelectual",
        "Impacto e innovación",
        "Flexibilidad creativa",
      ],
      EIA: [
        "Liderazgo y responsabilidad",
        "Crecimiento profesional acelerado",
        "Impacto estratégico",
        "Reconocimiento por logros",
      ],
      AEI: ["Expresión creativa", "Innovación y originalidad", "Flexibilidad y variedad", "Reconocimiento artístico"],
      SEA: [
        "Propósito y significado",
        "Impacto social positivo",
        "Colaboración y trabajo en equipo",
        "Desarrollo personal y profesional",
      ],
      ESA: [
        "Liderazgo con propósito",
        "Impacto social y ambiental",
        "Crecimiento sostenible",
        "Valores organizacionales alineados",
      ],
      ASE: [
        "Creatividad con propósito",
        "Impacto en la experiencia humana",
        "Colaboración interdisciplinaria",
        "Innovación social",
      ],
    }

    return (
      values[code] || [
        "Estabilidad laboral",
        "Buen ambiente de trabajo",
        "Oportunidades de aprendizaje",
        "Balance vida-trabajo",
      ]
    )
  }

  const submitTest = async () => {
    if (!startTime || !userEmail) return

    setLoading(true)

    try {
      const endTime = new Date()
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
      const results = calculateResults()
      const totalScore = Math.round(
        Object.values(results)
          .slice(0, 6)
          .reduce((a: number, b: number) => a + b, 0) / 6,
      )

      // Save to database
      const { error } = await supabase.from("test_results").insert({
        user_email: userEmail,
        test_name: "RIASEC",
        test_type: "vocational",
        score: totalScore,
        results: results,
        completed_at: endTime.toISOString(),
        duration_minutes: durationMinutes,
      })

      if (error) throw error

      // Update user profile
      await supabase.from("user_profiles").upsert({
        email: userEmail,
        tests_completed: supabase.raw("tests_completed + 1"),
        total_xp: supabase.raw("total_xp + 50"),
      })

      // Add activity
      await supabase.from("user_activities").insert({
        user_email: userEmail,
        activity_type: "test_completed",
        activity_description: `Completó el test RIASEC con puntuación de ${totalScore}%`,
        xp_earned: 50,
      })

      router.push("/test/riasec/results")
    } catch (error) {
      console.error("Error saving test results:", error)
      alert("Error al guardar los resultados. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const progress = ((currentQuestion + 1) / riasecQuestions.length) * 100
  const isLastQuestion = currentQuestion === riasecQuestions.length - 1
  const canProceed = answers[currentQuestion] !== undefined
  const allQuestionsAnswered = Object.keys(answers).length === riasecQuestions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test RIASEC</h1>
              <p className="text-gray-600">Evaluación de Intereses Vocacionales</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              <Compass className="h-3 w-3 mr-1" />
              Vocacional
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>8-12 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>30 preguntas</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Pregunta {currentQuestion + 1} de {riasecQuestions.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">{currentQuestion + 1}</span>
              </div>
              Pregunta {currentQuestion + 1}
            </CardTitle>
            <CardDescription>Indica qué tan de acuerdo estás con la siguiente afirmación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium text-gray-900 p-4 bg-gray-50 rounded-lg">
              {riasecQuestions[currentQuestion].text}
            </div>

            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="1" id="option-1" />
                <Label htmlFor="option-1" className="flex-1 cursor-pointer">
                  <span className="font-medium">Totalmente en desacuerdo</span>
                  <span className="block text-sm text-gray-500">Esta actividad no me interesa para nada</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="2" id="option-2" />
                <Label htmlFor="option-2" className="flex-1 cursor-pointer">
                  <span className="font-medium">En desacuerdo</span>
                  <span className="block text-sm text-gray-500">Esta actividad me interesa poco</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="3" id="option-3" />
                <Label htmlFor="option-3" className="flex-1 cursor-pointer">
                  <span className="font-medium">Neutral</span>
                  <span className="block text-sm text-gray-500">No estoy seguro sobre esta actividad</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="4" id="option-4" />
                <Label htmlFor="option-4" className="flex-1 cursor-pointer">
                  <span className="font-medium">De acuerdo</span>
                  <span className="block text-sm text-gray-500">Esta actividad me interesa bastante</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="5" id="option-5" />
                <Label htmlFor="option-5" className="flex-1 cursor-pointer">
                  <span className="font-medium">Totalmente de acuerdo</span>
                  <span className="block text-sm text-gray-500">Esta actividad me interesa mucho</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {riasecQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestion
                    ? "bg-orange-500"
                    : answers[index] !== undefined
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={submitTest}
              disabled={!allQuestionsAnswered || loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Test
                </>
              )}
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={!canProceed} className="bg-orange-600 hover:bg-orange-700">
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instrucciones</h3>
                <p className="text-sm text-gray-600">
                  El test RIASEC evalúa tus intereses vocacionales en 6 áreas: <strong>Realista</strong> (trabajo
                  práctico),
                  <strong> Investigativo</strong> (análisis y investigación), <strong>Artístico</strong> (creatividad),
                  <strong> Social</strong> (ayuda a otros), <strong>Emprendedor</strong> (liderazgo y ventas), y
                  <strong> Convencional</strong> (organización y datos). Responde honestamente según tus verdaderos
                  intereses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
