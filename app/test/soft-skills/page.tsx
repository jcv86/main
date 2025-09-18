"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, MessageSquare, Users, Target, Lightbulb, Zap, Sparkles } from "lucide-react"

interface Question {
  id: number
  question_number: number
  question_text: string
  question_type: string
  options?: string[]
  category?: string
}

interface Answer {
  questionId: number
  value: number | string
  category?: string
}

export default function SoftSkillsTest() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", "soft-skills")
        .order("question_number")

      if (error || !data || data.length === 0) {
        console.log("Using mock soft skills questions")
        setQuestions(getMockSoftSkillsQuestions())
      } else {
        const parsedQuestions = data.map((q) => ({
          ...q,
          options: parseOptions(q.options),
        }))
        setQuestions(parsedQuestions)
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setQuestions(getMockSoftSkillsQuestions())
    } finally {
      setLoading(false)
    }
  }

  const parseOptions = (options: any): string[] | undefined => {
    if (!options) return undefined

    try {
      // If it's already an array, return it
      if (Array.isArray(options)) {
        return options
      }

      // If it's a string, try to parse as JSON
      if (typeof options === "string") {
        // Try JSON parse first
        try {
          const parsed = JSON.parse(options)
          if (Array.isArray(parsed)) {
            return parsed
          }
        } catch {
          // If JSON parse fails, try other formats
          if (options.includes("|")) {
            return options.split("|").map((opt) => opt.trim())
          }
          if (options.includes(";")) {
            return options.split(";").map((opt) => opt.trim())
          }
          if (options.includes(",")) {
            return options.split(",").map((opt) => opt.trim())
          }
        }
      }

      return undefined
    } catch (error) {
      console.error("Error parsing options:", error, options)
      return undefined
    }
  }

  const getMockSoftSkillsQuestions = (): Question[] => {
    return [
      // Communication Skills (8 questions)
      {
        id: 1,
        question_number: 1,
        question_text: "¿Cómo prefieres comunicar ideas complejas a tu equipo?",
        question_type: "multiple_choice",
        options: [
          "Uso presentaciones visuales detalladas",
          "Explico verbalmente paso a paso",
          "Combino explicación verbal con ejemplos prácticos",
          "Facilito una discusión interactiva",
        ],
        category: "communication",
      },
      {
        id: 2,
        question_number: 2,
        question_text: "Cuando hay un malentendido en la comunicación, ¿qué haces?",
        question_type: "multiple_choice",
        options: [
          "Espero que se resuelva solo",
          "Culpo a la otra persona por no entender",
          "Busco aclarar inmediatamente",
          "Analizo qué causó el malentendido y mejoro mi comunicación",
        ],
        category: "communication",
      },
      {
        id: 3,
        question_number: 3,
        question_text: "¿Cómo manejas las críticas constructivas?",
        question_type: "multiple_choice",
        options: [
          "Me molesto y me pongo a la defensiva",
          "Las escucho pero no cambio nada",
          "Considero la crítica y reflexiono",
          "Agradezco la retroalimentación y busco mejorar",
        ],
        category: "communication",
      },
      {
        id: 4,
        question_number: 4,
        question_text: "En una presentación importante, ¿cómo te preparas?",
        question_type: "multiple_choice",
        options: [
          "Leo mis notas directamente",
          "Memorizo todo el contenido",
          "Practico varias veces y preparo ejemplos",
          "Me adapto completamente a la audiencia y sus necesidades",
        ],
        category: "communication",
      },
      {
        id: 5,
        question_number: 5,
        question_text: "¿Cómo comunicas malas noticias a tu equipo?",
        question_type: "multiple_choice",
        options: [
          "Las evito hasta el último momento",
          "Las comunico directamente sin contexto",
          "Explico la situación y las posibles soluciones",
          "Facilito un espacio seguro para procesar y planificar juntos",
        ],
        category: "communication",
      },
      {
        id: 6,
        question_number: 6,
        question_text: "Describe una situación donde tuviste que comunicar malas noticias. ¿Cómo lo manejaste?",
        question_type: "open_ended",
        category: "communication",
      },
      {
        id: 7,
        question_number: 7,
        question_text: "¿Cómo adaptas tu estilo de comunicación según tu audiencia?",
        question_type: "open_ended",
        category: "communication",
      },
      {
        id: 8,
        question_number: 8,
        question_text: "Describe un momento donde tu comunicación efectiva resolvió un conflicto.",
        question_type: "open_ended",
        category: "communication",
      },

      // Leadership Skills (6 questions)
      {
        id: 9,
        question_number: 9,
        question_text: "¿Cómo motivas a un equipo que está desmotivado?",
        question_type: "multiple_choice",
        options: [
          "Les digo que trabajen más duro",
          "Ofrezco incentivos económicos",
          "Escucho sus preocupaciones y busco soluciones",
          "Inspiro con una visión clara y apoyo individual",
        ],
        category: "leadership",
      },
      {
        id: 10,
        question_number: 10,
        question_text: "Cuando tomas decisiones difíciles, ¿cuál es tu enfoque?",
        question_type: "multiple_choice",
        options: [
          "Decido rápidamente basado en mi experiencia",
          "Consulto con mi supervisor",
          "Analizo datos y consulto con el equipo",
          "Facilito un proceso colaborativo de toma de decisiones",
        ],
        category: "leadership",
      },
      {
        id: 11,
        question_number: 11,
        question_text: "¿Cómo desarrollas el potencial de tu equipo?",
        question_type: "multiple_choice",
        options: [
          "Les asigno más responsabilidades",
          "Les doy retroalimentación ocasional",
          "Identifico fortalezas y áreas de mejora",
          "Creo planes de desarrollo personalizados y los apoyo activamente",
        ],
        category: "leadership",
      },
      {
        id: 12,
        question_number: 12,
        question_text: "Ante un conflicto entre miembros del equipo, ¿cómo actúas?",
        question_type: "multiple_choice",
        options: [
          "Evito involucrarme",
          "Tomo partido por uno de ellos",
          "Medío para encontrar una solución",
          "Facilito un diálogo constructivo y busco soluciones ganar-ganar",
        ],
        category: "leadership",
      },
      {
        id: 13,
        question_number: 13,
        question_text: "¿Cómo estableces la visión y dirección del equipo?",
        question_type: "multiple_choice",
        options: [
          "Sigo las instrucciones de arriba",
          "Establezco objetivos basados en mi experiencia",
          "Involucro al equipo en la definición de objetivos",
          "Co-creo una visión inspiradora con todo el equipo",
        ],
        category: "leadership",
      },
      {
        id: 14,
        question_number: 14,
        question_text: "Describe tu estilo de liderazgo y cómo lo adaptas según la situación.",
        question_type: "open_ended",
        category: "leadership",
      },

      // Teamwork Skills (6 questions)
      {
        id: 15,
        question_number: 15,
        question_text: "En un proyecto de equipo, ¿cuál es tu rol natural?",
        question_type: "multiple_choice",
        options: [
          "El que toma todas las decisiones",
          "El que ejecuta las tareas asignadas",
          "El que facilita la colaboración",
          "El que aporta ideas creativas y apoya a otros",
        ],
        category: "teamwork",
      },
      {
        id: 16,
        question_number: 16,
        question_text: "¿Cómo manejas los desacuerdos en el equipo?",
        question_type: "multiple_choice",
        options: [
          "Evito el conflicto",
          "Impongo mi punto de vista",
          "Busco un compromiso",
          "Facilito una discusión constructiva para encontrar la mejor solución",
        ],
        category: "teamwork",
      },
      {
        id: 17,
        question_number: 17,
        question_text: "Cuando un compañero no cumple con sus responsabilidades, ¿qué haces?",
        question_type: "multiple_choice",
        options: [
          "Lo reporto inmediatamente",
          "Hago su trabajo para evitar problemas",
          "Hablo con él para entender qué pasa",
          "Ofrezco apoyo y buscamos soluciones juntos",
        ],
        category: "teamwork",
      },
      {
        id: 18,
        question_number: 18,
        question_text: "¿Cómo contribuyes a crear un ambiente de trabajo positivo?",
        question_type: "multiple_choice",
        options: [
          "Mantengo un perfil bajo",
          "Soy amigable con todos",
          "Reconozco los logros de otros y ofrezco ayuda",
          "Promuevo activamente la colaboración y celebro los éxitos del equipo",
        ],
        category: "teamwork",
      },
      {
        id: 19,
        question_number: 19,
        question_text: "En equipos diversos, ¿cómo aprovechas las diferentes perspectivas?",
        question_type: "multiple_choice",
        options: [
          "Prefiero trabajar con personas similares a mí",
          "Acepto las diferencias pero no las busco",
          "Valoro las diferentes opiniones",
          "Activamente busco y integro perspectivas diversas para mejores resultados",
        ],
        category: "teamwork",
      },
      {
        id: 20,
        question_number: 20,
        question_text: "Describe una experiencia donde tu colaboración fue clave para el éxito del equipo.",
        question_type: "open_ended",
        category: "teamwork",
      },

      // Problem Solving Skills (6 questions)
      {
        id: 21,
        question_number: 21,
        question_text: "Ante un problema complejo sin solución obvia, ¿cuál es tu enfoque?",
        question_type: "multiple_choice",
        options: [
          "Busco una solución rápida aunque no sea perfecta",
          "Pido ayuda inmediatamente",
          "Analizo el problema desde múltiples ángulos",
          "Uso metodologías estructuradas y busco soluciones innovadoras",
        ],
        category: "problem_solving",
      },
      {
        id: 22,
        question_number: 22,
        question_text: "¿Cómo priorizas cuando tienes múltiples problemas urgentes?",
        question_type: "multiple_choice",
        options: [
          "Trabajo en el que llegó primero",
          "Me enfoco en el más fácil",
          "Evalúo impacto y urgencia",
          "Analizo interdependencias y optimizo la secuencia de solución",
        ],
        category: "problem_solving",
      },
      {
        id: 23,
        question_number: 23,
        question_text: "Cuando una solución no funciona como esperabas, ¿qué haces?",
        question_type: "multiple_choice",
        options: [
          "Insisto con la misma solución",
          "Abandono y busco ayuda",
          "Analizo qué falló y ajusto",
          "Uso el aprendizaje para desarrollar múltiples alternativas mejoradas",
        ],
        category: "problem_solving",
      },
      {
        id: 24,
        question_number: 24,
        question_text: "¿Cómo generas ideas creativas para resolver problemas?",
        question_type: "multiple_choice",
        options: [
          "Uso mi experiencia previa",
          "Busco soluciones en internet",
          "Hago lluvia de ideas y analizo opciones",
          "Combino técnicas creativas, investigación y colaboración",
        ],
        category: "problem_solving",
      },
      {
        id: 25,
        question_number: 25,
        question_text: "¿Cómo validas que tu solución realmente resuelve el problema?",
        question_type: "multiple_choice",
        options: [
          "Asumo que funcionará",
          "Pregunto a mi supervisor",
          "Hago pruebas básicas",
          "Implemento métricas, pruebas piloto y retroalimentación continua",
        ],
        category: "problem_solving",
      },
      {
        id: 26,
        question_number: 26,
        question_text: "Describe un problema complejo que resolviste y el proceso que seguiste.",
        question_type: "open_ended",
        category: "problem_solving",
      },

      // Adaptability Skills (4 questions)
      {
        id: 27,
        question_number: 27,
        question_text: "¿Cómo reaccionas cuando los planes cambian repentinamente?",
        question_type: "multiple_choice",
        options: [
          "Me molesto y me resisto al cambio",
          "Me adapto pero con dificultad",
          "Me adapto rápidamente",
          "Veo el cambio como una oportunidad y ayudo a otros a adaptarse",
        ],
        category: "adaptability",
      },
      {
        id: 28,
        question_number: 28,
        question_text: "Ante nuevas tecnologías o procesos, ¿cuál es tu actitud?",
        question_type: "multiple_choice",
        options: [
          "Prefiero mantener lo que ya conozco",
          "Los aprendo solo si es necesario",
          "Me intereso en aprender cosas nuevas",
          "Busco activamente oportunidades de aprendizaje y ayudo a otros a adaptarse",
        ],
        category: "adaptability",
      },
      {
        id: 29,
        question_number: 29,
        question_text: "¿Cómo manejas la incertidumbre en el trabajo?",
        question_type: "multiple_choice",
        options: [
          "Me estreso y busco certeza inmediata",
          "Espero instrucciones claras",
          "Me adapto y busco información",
          "Prospero en la ambigüedad y ayudo a crear claridad para el equipo",
        ],
        category: "adaptability",
      },
      {
        id: 30,
        question_number: 30,
        question_text: "Describe una situación donde tuviste que adaptarte rápidamente a un cambio significativo.",
        question_type: "open_ended",
        category: "adaptability",
      },
    ]
  }

  const handleAnswer = (questionId: number, value: number | string, category?: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId)
      const newAnswer = { questionId, value, category }

      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newAnswer
        return updated
      }
      return [...prev, newAnswer]
    })
  }

  const getCurrentAnswer = (questionId: number) => {
    return answers.find((a) => a.questionId === questionId)?.value
  }

  const isQuestionAnswered = (questionId: number) => {
    const answer = getCurrentAnswer(questionId)
    const question = questions.find((q) => q.id === questionId)

    if (question?.question_type === "open_ended") {
      return typeof answer === "string" && answer.length >= 50
    }
    return answer !== undefined
  }

  const canProceed = () => {
    if (currentQuestion >= questions.length - 1) {
      return questions.every((q) => isQuestionAnswered(q.id))
    }
    return isQuestionAnswered(questions[currentQuestion]?.id)
  }

  const calculateResults = () => {
    const scores = {
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problem_solving: 0,
      adaptability: 0,
    }
    const reflectiveResponses: Record<string, string> = {}

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      if (question?.category && typeof answer.value === "number") {
        scores[question.category as keyof typeof scores] += answer.value
      } else if (question?.question_type === "open_ended") {
        reflectiveResponses[`q${question.question_number}`] = answer.value as string
      }
    })

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const maxScore = 75 // Approximate max score based on multiple choice questions
    const percentage = Math.round((totalScore / maxScore) * 100)

    // Find strongest and weakest areas
    const sortedSkills = Object.entries(scores).sort(([, a], [, b]) => b - a)
    const strongestSkill = sortedSkills[0][0]
    const weakestSkill = sortedSkills[sortedSkills.length - 1][0]

    return {
      ...scores,
      total_score: totalScore,
      max_score: maxScore,
      percentage,
      strongest_skill: strongestSkill,
      weakest_skill: weakestSkill,
      reflective_responses: reflectiveResponses,
    }
  }

  const submitTest = async () => {
    try {
      setSubmitting(true)
      const results = calculateResults()

      const { error } = await supabase.from("test_results").insert({
        user_email: "travis@example.com",
        test_type: "soft-skills",
        results: results,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error
      router.push("/test/soft-skills/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Error al enviar el test. Por favor intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      communication: MessageSquare,
      leadership: Target,
      teamwork: Users,
      problem_solving: Lightbulb,
      adaptability: Zap,
    }
    return icons[category as keyof typeof icons] || MessageSquare
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      communication: "bg-blue-100 text-blue-700 border-blue-200",
      leadership: "bg-purple-100 text-purple-700 border-purple-200",
      teamwork: "bg-green-100 text-green-700 border-green-200",
      problem_solving: "bg-orange-100 text-orange-700 border-orange-200",
      adaptability: "bg-red-100 text-red-700 border-red-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getCategoryName = (category: string) => {
    const names = {
      communication: "Comunicación",
      leadership: "Liderazgo",
      teamwork: "Trabajo en Equipo",
      problem_solving: "Resolución de Problemas",
      adaptability: "Adaptabilidad",
    }
    return names[category as keyof typeof names] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
              <span>Cargando test de Habilidades Blandas...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-purple-900 mb-2">Test de Habilidades Blandas</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Evalúa tus competencias interpersonales y profesionales
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  ¿Qué son las Habilidades Blandas?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Las habilidades blandas son competencias interpersonales y de comportamiento que determinan cómo
                  interactúas con otros y manejas situaciones profesionales.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Comunicación</strong> - Expresión clara y efectiva
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">
                      <strong>Liderazgo</strong> - Inspirar y guiar a otros
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>Trabajo en Equipo</strong> - Colaboración efectiva
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">
                      <strong>Resolución de Problemas</strong> - Pensamiento crítico
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      <strong>Adaptabilidad</strong> - Flexibilidad ante cambios
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Instrucciones del Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <p className="text-sm text-gray-700">
                      Responde <strong>30 preguntas</strong> sobre situaciones profesionales
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <p className="text-sm text-gray-700">
                      Incluye preguntas de <strong>opción múltiple</strong> y <strong>reflexivas</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <p className="text-sm text-gray-700">
                      Para preguntas abiertas, escribe mínimo <strong>50 caracteres</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <p className="text-sm text-gray-700">
                      Responde basándote en tu <strong>experiencia real</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      5
                    </div>
                    <p className="text-sm text-gray-700">
                      Tiempo estimado: <strong>15-20 minutos</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">¿Listo para evaluar tus habilidades blandas?</h3>
              <p className="text-gray-600 mb-6">
                Este test te ayudará a identificar tus fortalezas y áreas de mejora en competencias interpersonales
                clave para el éxito profesional.
              </p>
              <Button
                onClick={() => setShowInstructions(false)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Comenzar Test de Habilidades Blandas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = questions.filter((q) => isQuestionAnswered(q.id)).length

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: No se pudo cargar la pregunta actual</p>
              <Button onClick={() => window.location.reload()}>Recargar página</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-purple-900">Test de Habilidades Blandas</CardTitle>
                <CardDescription>
                  Pregunta {currentQuestion + 1} de {questions.length} • {answeredCount}/{questions.length} respondidas
                </CardDescription>
              </div>
              {currentQ?.category && (
                <Badge className={getCategoryColor(currentQ.category)}>
                  {React.createElement(getCategoryIcon(currentQ.category), { className: "h-4 w-4 mr-1" })}
                  {getCategoryName(currentQ.category)}
                </Badge>
              )}
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Question Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestion
                      ? "default"
                      : isQuestionAnswered(questions[index]?.id)
                        ? "secondary"
                        : "outline"
                  }
                  size="sm"
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 ${
                    index === currentQuestion
                      ? "bg-purple-600 text-white"
                      : isQuestionAnswered(questions[index]?.id)
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question_text}</CardTitle>
            {currentQ.question_type === "open_ended" && (
              <CardDescription>Respuesta reflexiva (mínimo 50 caracteres para análisis IA)</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {currentQ.question_type === "multiple_choice" && currentQ.options ? (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={getCurrentAnswer(currentQ.id) === index ? "default" : "outline"}
                    onClick={() => handleAnswer(currentQ.id, index, currentQ.category)}
                    className={`w-full text-left justify-start p-4 h-auto ${
                      getCurrentAnswer(currentQ.id) === index ? "bg-purple-600 text-white" : "hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                        {index}
                      </div>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : currentQ.question_type === "open_ended" ? (
              <div>
                <Textarea
                  value={(getCurrentAnswer(currentQ.id) as string) || ""}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value, currentQ.category)}
                  placeholder="Describe tu experiencia con ejemplos específicos... (mínimo 50 caracteres)"
                  className="min-h-[120px]"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Caracteres: {((getCurrentAnswer(currentQ.id) as string) || "").length}/50 mínimo
                  {((getCurrentAnswer(currentQ.id) as string) || "").length >= 50 && (
                    <span className="text-green-600 ml-2">✓ Listo para análisis IA</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">Error al cargar las opciones</p>
                <p className="text-red-600 text-sm mt-1">Tipo de pregunta: {currentQ.question_type}</p>
                <p className="text-red-600 text-sm">Opciones disponibles: {currentQ.options ? "Sí" : "No"}</p>
                {currentQ.options && (
                  <p className="text-red-600 text-sm">Opciones raw: {JSON.stringify(currentQ.options)}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="text-sm text-gray-600">
                {answeredCount === questions.length ? (
                  <span className="text-green-600 font-semibold">✓ Todas las preguntas respondidas</span>
                ) : (
                  <span>Faltan {questions.length - answeredCount} preguntas</span>
                )}
              </div>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={submitTest}
                  disabled={!canProceed() || submitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    "Finalizar Test"
                  )}
                </Button>
              ) : (
                <Button onClick={nextQuestion} disabled={!canProceed()}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
