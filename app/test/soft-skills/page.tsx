"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Users,
  Lightbulb,
  Clock,
  Target,
  Heart,
  Zap,
  Brain,
} from "lucide-react"

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
      // Try to fetch from database first
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", "soft-skills")
        .order("question_number")

      if (error || !data || data.length === 0) {
        console.log("Using mock soft skills questions")
        setQuestions(getMockSoftSkillsQuestions())
      } else {
        // Parse options for each question with robust error handling
        const parsedQuestions = data.map((q) => {
          let parsedOptions: string[] | undefined = undefined

          if (q.options && q.question_type === "multiple_choice") {
            try {
              // Handle different option formats
              if (typeof q.options === "string") {
                // Try to parse as JSON first
                try {
                  parsedOptions = JSON.parse(q.options)
                } catch (jsonError) {
                  // If JSON parsing fails, try other formats
                  if (q.options.includes("|")) {
                    parsedOptions = q.options.split("|").map((opt: string) => opt.trim())
                  } else if (q.options.includes(";")) {
                    parsedOptions = q.options.split(";").map((opt: string) => opt.trim())
                  } else if (q.options.includes(",")) {
                    parsedOptions = q.options.split(",").map((opt: string) => opt.trim())
                  } else {
                    console.error(`Error parsing options for question ${q.question_number}:`, q.options)
                    parsedOptions = ["Opción no disponible"]
                  }
                }
              } else if (Array.isArray(q.options)) {
                parsedOptions = q.options
              }
            } catch (parseError) {
              console.error(`Error parsing options for question ${q.question_number}:`, parseError)
              parsedOptions = ["Error al cargar opciones"]
            }
          }

          return {
            ...q,
            options: parsedOptions,
          }
        })
        setQuestions(parsedQuestions)
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setQuestions(getMockSoftSkillsQuestions())
    } finally {
      setLoading(false)
    }
  }

  const getMockSoftSkillsQuestions = (): Question[] => {
    return [
      // Communication (8 questions)
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
        question_text: "¿Cómo adaptas tu estilo de comunicación según tu audiencia?",
        question_type: "multiple_choice",
        options: [
          "No cambio mi estilo",
          "Hago pequeños ajustes",
          "Adapto significativamente mi enfoque",
          "Personalizo completamente mi comunicación",
        ],
        category: "communication",
      },
      {
        id: 4,
        question_number: 4,
        question_text: "En presentaciones importantes, ¿cómo manejas los nervios?",
        question_type: "multiple_choice",
        options: [
          "Me pongo muy nervioso y se nota",
          "Trato de ocultarlo pero me afecta",
          "Uso técnicas para mantener la calma",
          "Convierto los nervios en energía positiva",
        ],
        category: "communication",
      },
      {
        id: 5,
        question_number: 5,
        question_text: "¿Qué tan efectivo eres dando retroalimentación constructiva?",
        question_type: "multiple_choice",
        options: [
          "Evito dar retroalimentación",
          "La doy pero de forma directa",
          "La doy de manera constructiva",
          "Soy experto en dar retroalimentación que motiva",
        ],
        category: "communication",
      },
      {
        id: 6,
        question_number: 6,
        question_text: "Cuando alguien no está de acuerdo contigo, ¿cómo respondes?",
        question_type: "multiple_choice",
        options: [
          "Me molesto y defiendo mi posición",
          "Escucho pero mantengo mi opinión",
          "Trato de entender su perspectiva",
          "Busco puntos en común y soluciones colaborativas",
        ],
        category: "communication",
      },
      {
        id: 7,
        question_number: 7,
        question_text: "¿Cómo manejas las conversaciones difíciles o conflictivas?",
        question_type: "multiple_choice",
        options: [
          "Las evito a toda costa",
          "Las abordo directamente sin preparación",
          "Me preparo y busco el momento adecuado",
          "Las facilito creando un ambiente seguro para todos",
        ],
        category: "communication",
      },
      {
        id: 8,
        question_number: 8,
        question_text: "Describe una situación donde tuviste que comunicar malas noticias. ¿Cómo lo manejaste?",
        question_type: "open_ended",
        category: "communication",
      },

      // Leadership (6 questions)
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
        question_text: "Cuando lideras un proyecto, ¿cuál es tu enfoque principal?",
        question_type: "multiple_choice",
        options: [
          "Controlo todos los detalles",
          "Delego pero superviso de cerca",
          "Empodero al equipo y facilito",
          "Creo una visión compartida y apoyo el crecimiento",
        ],
        category: "leadership",
      },
      {
        id: 11,
        question_number: 11,
        question_text: "¿Cómo tomas decisiones difíciles que afectan al equipo?",
        question_type: "multiple_choice",
        options: [
          "Decido solo basándome en datos",
          "Consulto a algunos miembros clave",
          "Involucro al equipo en el proceso",
          "Facilito una decisión colaborativa considerando todos los factores",
        ],
        category: "leadership",
      },
      {
        id: 12,
        question_number: 12,
        question_text: "Ante un miembro del equipo con bajo rendimiento, ¿qué haces?",
        question_type: "multiple_choice",
        options: [
          "Lo critico directamente",
          "Espero que mejore solo",
          "Ofrezco apoyo y recursos",
          "Desarrollo un plan personalizado de mejora",
        ],
        category: "leadership",
      },
      {
        id: 13,
        question_number: 13,
        question_text: "¿Cómo desarrollas el potencial de tu equipo?",
        question_type: "multiple_choice",
        options: [
          "Me enfoco en completar tareas",
          "Doy retroalimentación ocasional",
          "Ofrezco oportunidades de crecimiento",
          "Mentoreo activamente y creo planes de desarrollo",
        ],
        category: "leadership",
      },
      {
        id: 14,
        question_number: 14,
        question_text: "Describe tu experiencia liderando un proyecto desafiante. ¿Qué aprendiste?",
        question_type: "open_ended",
        category: "leadership",
      },

      // Teamwork (6 questions)
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
        question_text: "¿Cómo manejas los conflictos dentro del equipo?",
        question_type: "multiple_choice",
        options: [
          "Los ignoro esperando que se resuelvan",
          "Tomo partido por una de las partes",
          "Trato de mediar neutralmente",
          "Facilito una resolución colaborativa",
        ],
        category: "teamwork",
      },
      {
        id: 17,
        question_number: 17,
        question_text: "Cuando un compañero no cumple con su parte del trabajo, ¿qué haces?",
        question_type: "multiple_choice",
        options: [
          "Me quejo con otros",
          "Hago su trabajo para evitar problemas",
          "Hablo directamente con él",
          "Busco entender las causas y ofrezco apoyo",
        ],
        category: "teamwork",
      },
      {
        id: 18,
        question_number: 18,
        question_text: "¿Cómo contribuyes a crear un ambiente de equipo positivo?",
        question_type: "multiple_choice",
        options: [
          "Me enfoco en mi trabajo",
          "Soy amigable cuando es necesario",
          "Participo activamente en actividades de equipo",
          "Lidero iniciativas para fortalecer la cohesión",
        ],
        category: "teamwork",
      },
      {
        id: 19,
        question_number: 19,
        question_text: "Ante ideas diferentes en el equipo, ¿cómo reaccionas?",
        question_type: "multiple_choice",
        options: [
          "Defiendo mi idea",
          "Acepto la mayoría",
          "Busco combinar las mejores ideas",
          "Facilito un proceso para evaluar todas las opciones",
        ],
        category: "teamwork",
      },
      {
        id: 20,
        question_number: 20,
        question_text: "Comparte un ejemplo de cómo ayudaste a resolver un conflicto en tu equipo.",
        question_type: "open_ended",
        category: "teamwork",
      },

      // Problem Solving (6 questions)
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
          "Trabajo en el que grita más fuerte",
          "Hago una lista y trabajo en orden",
          "Evalúo impacto y urgencia",
          "Uso frameworks de priorización y considero recursos",
        ],
        category: "problem_solving",
      },
      {
        id: 23,
        question_number: 23,
        question_text: "Cuando una solución no funciona, ¿qué haces?",
        question_type: "multiple_choice",
        options: [
          "Insisto hasta que funcione",
          "Busco otra solución similar",
          "Analizo por qué falló y ajusto",
          "Reevalúo completamente el problema y exploro nuevos enfoques",
        ],
        category: "problem_solving",
      },
      {
        id: 24,
        question_number: 24,
        question_text: "¿Cómo involucras a otros en la resolución de problemas?",
        question_type: "multiple_choice",
        options: [
          "Prefiero resolver solo",
          "Pido opiniones ocasionalmente",
          "Colaboro activamente con otros",
          "Facilito sesiones de brainstorming y co-creación",
        ],
        category: "problem_solving",
      },
      {
        id: 25,
        question_number: 25,
        question_text: "Ante un problema que requiere creatividad, ¿cómo procedes?",
        question_type: "multiple_choice",
        options: [
          "Uso soluciones que ya conozco",
          "Busco ejemplos en internet",
          "Genero múltiples ideas creativas",
          "Combino técnicas de creatividad con análisis sistemático",
        ],
        category: "problem_solving",
      },
      {
        id: 26,
        question_number: 26,
        question_text: "Describe el problema más complejo que has resuelto y tu proceso.",
        question_type: "open_ended",
        category: "problem_solving",
      },

      // Adaptability (4 questions)
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
          "Los evito si puedo",
          "Los aprendo cuando es necesario",
          "Los adopto proactivamente",
          "Los domino y ayudo a otros a adoptarlos",
        ],
        category: "adaptability",
      },
      {
        id: 29,
        question_number: 29,
        question_text: "¿Cómo manejas la incertidumbre en el trabajo?",
        question_type: "multiple_choice",
        options: [
          "Me estresa mucho",
          "Trato de evitarla",
          "La acepto como parte del trabajo",
          "La abrazo como oportunidad de crecimiento",
        ],
        category: "adaptability",
      },
      {
        id: 30,
        question_number: 30,
        question_text: "Comparte una experiencia donde tuviste que adaptarte rápidamente a un cambio significativo.",
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
    const scores: Record<string, number> = {
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problem_solving: 0,
      adaptability: 0,
      emotional_intelligence: 0,
      time_management: 0,
      critical_thinking: 0,
    }

    const reflectiveResponses: Record<string, string> = {}
    const categoryProgress: Record<string, { answered: number; total: number }> = {}

    // Initialize category progress
    questions.forEach((q) => {
      if (q.category) {
        if (!categoryProgress[q.category]) {
          categoryProgress[q.category] = { answered: 0, total: 0 }
        }
        categoryProgress[q.category].total++
      }
    })

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      if (question?.category && typeof answer.value === "number") {
        scores[question.category] += answer.value
        categoryProgress[question.category].answered++
      } else if (question?.question_type === "open_ended") {
        reflectiveResponses[`q${question.question_number}`] = answer.value as string
        if (question.category) {
          categoryProgress[question.category].answered++
        }
      }
    })

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const maxPossibleScore = questions.filter((q) => q.question_type === "multiple_choice").length * 3
    const percentage = Math.round((totalScore / maxPossibleScore) * 100)

    // Get top skills
    const sortedSkills = Object.entries(scores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    return {
      ...scores,
      total_score: totalScore,
      max_score: maxPossibleScore,
      percentage,
      top_skills: sortedSkills.map(([skill]) => skill),
      category_progress: categoryProgress,
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
      communication: MessageCircle,
      leadership: Users,
      teamwork: Users,
      problem_solving: Lightbulb,
      adaptability: Zap,
      emotional_intelligence: Heart,
      time_management: Clock,
      critical_thinking: Brain,
    }
    return icons[category as keyof typeof icons] || Target
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      communication: "bg-blue-100 text-blue-700 border-blue-200",
      leadership: "bg-purple-100 text-purple-700 border-purple-200",
      teamwork: "bg-green-100 text-green-700 border-green-200",
      problem_solving: "bg-yellow-100 text-yellow-700 border-yellow-200",
      adaptability: "bg-orange-100 text-orange-700 border-orange-200",
      emotional_intelligence: "bg-pink-100 text-pink-700 border-pink-200",
      time_management: "bg-indigo-100 text-indigo-700 border-indigo-200",
      critical_thinking: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
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
                  <Target className="h-5 w-5 text-purple-600" />
                  ¿Qué son las Habilidades Blandas?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Las habilidades blandas son competencias interpersonales y de carácter que determinan cómo
                  interactúas, trabajas y te relacionas con otros en el entorno profesional.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Comunicación</strong> - Expresar ideas claramente
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">
                      <strong>Liderazgo</strong> - Guiar e inspirar equipos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>Trabajo en Equipo</strong> - Colaborar efectivamente
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">
                      <strong>Resolución de Problemas</strong> - Encontrar soluciones
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-600" />
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
                  <Brain className="h-5 w-5 text-green-600" />
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
                      Responde <strong>30 preguntas</strong> sobre tus habilidades interpersonales
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
                      Sé honesto sobre tus <strong>experiencias reales</strong>
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
                Este test te ayudará a identificar tus fortalezas en competencias interpersonales y áreas de mejora para
                tu desarrollo profesional.
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
                  {currentQ.category.replace("_", " ")}
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
                      <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
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
                  placeholder="Escribe tu respuesta aquí... (mínimo 50 caracteres)"
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
                <p className="text-red-600">Error: No se pudieron cargar las opciones para esta pregunta.</p>
                <p className="text-sm text-gray-600 mt-2">Tipo: {currentQ.question_type}</p>
                <p className="text-sm text-gray-600">Opciones: {JSON.stringify(currentQ.options)}</p>
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
