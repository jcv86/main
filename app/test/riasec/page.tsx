"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, Target, Brain, Palette, Users, TrendingUp, FileText, Sparkles } from "lucide-react"

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

export default function RIASECTest() {
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
        .eq("test_type", "riasec")
        .order("question_number")

      if (error || !data || data.length === 0) {
        console.log("Using mock RIASEC questions")
        setQuestions(getMockRIASECQuestions())
      } else {
        // Parse options for each question
        const parsedQuestions = data.map((q) => ({
          ...q,
          options: q.options ? (typeof q.options === "string" ? JSON.parse(q.options) : q.options) : undefined,
        }))
        setQuestions(parsedQuestions)
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setQuestions(getMockRIASECQuestions())
    } finally {
      setLoading(false)
    }
  }

  const getMockRIASECQuestions = (): Question[] => {
    return [
      // Realistic (R) - Questions 1-5
      {
        id: 1,
        question_number: 1,
        question_text: "¿Te gusta trabajar con herramientas y maquinaria?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "R",
      },
      {
        id: 2,
        question_number: 2,
        question_text: "¿Disfrutas reparar objetos o dispositivos?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "R",
      },
      {
        id: 3,
        question_number: 3,
        question_text: "¿Te atrae trabajar al aire libre?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "R",
      },
      {
        id: 4,
        question_number: 4,
        question_text: "¿Te gusta construir o ensamblar cosas?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "R",
      },
      {
        id: 5,
        question_number: 5,
        question_text: "¿Prefieres trabajos que requieren habilidades físicas?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "R",
      },

      // Investigativo (I) - Questions 6-10
      {
        id: 6,
        question_number: 6,
        question_text: "¿Te gusta resolver problemas complejos?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "I",
      },
      {
        id: 7,
        question_number: 7,
        question_text: "¿Disfrutas investigar y analizar datos?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "I",
      },
      {
        id: 8,
        question_number: 8,
        question_text: "¿Te atrae la ciencia y la tecnología?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "I",
      },
      {
        id: 9,
        question_number: 9,
        question_text: "¿Te gusta experimentar y probar teorías?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "I",
      },
      {
        id: 10,
        question_number: 10,
        question_text: "¿Prefieres trabajar de forma independiente?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "I",
      },

      // Artístico (A) - Questions 11-15
      {
        id: 11,
        question_number: 11,
        question_text: "¿Te gusta crear arte o diseños?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "A",
      },
      {
        id: 12,
        question_number: 12,
        question_text: "¿Disfrutas escribir o componer música?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "A",
      },
      {
        id: 13,
        question_number: 13,
        question_text: "¿Te atrae la expresión creativa?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "A",
      },
      {
        id: 14,
        question_number: 14,
        question_text: "¿Te gusta innovar y crear cosas nuevas?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "A",
      },
      {
        id: 15,
        question_number: 15,
        question_text: "¿Prefieres ambientes de trabajo flexibles?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "A",
      },

      // Social (S) - Questions 16-20
      {
        id: 16,
        question_number: 16,
        question_text: "¿Te gusta ayudar y enseñar a otros?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "S",
      },
      {
        id: 17,
        question_number: 17,
        question_text: "¿Disfrutas trabajar en equipo?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "S",
      },
      {
        id: 18,
        question_number: 18,
        question_text: "¿Te atrae el trabajo comunitario?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "S",
      },
      {
        id: 19,
        question_number: 19,
        question_text: "¿Te gusta cuidar y apoyar a las personas?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "S",
      },
      {
        id: 20,
        question_number: 20,
        question_text: "¿Prefieres resolver conflictos interpersonales?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "S",
      },

      // Emprendedor (E) - Questions 21-25
      {
        id: 21,
        question_number: 21,
        question_text: "¿Te gusta liderar y dirigir proyectos?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "E",
      },
      {
        id: 22,
        question_number: 22,
        question_text: "¿Disfrutas persuadir y convencer a otros?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "E",
      },
      {
        id: 23,
        question_number: 23,
        question_text: "¿Te atrae tomar decisiones importantes?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "E",
      },
      {
        id: 24,
        question_number: 24,
        question_text: "¿Te gusta competir y ganar?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "E",
      },
      {
        id: 25,
        question_number: 25,
        question_text: "¿Prefieres ambientes dinámicos y desafiantes?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "E",
      },

      // Convencional (C) - Questions 26-30
      {
        id: 26,
        question_number: 26,
        question_text: "¿Te gusta organizar y planificar actividades?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "C",
      },
      {
        id: 27,
        question_number: 27,
        question_text: "¿Disfrutas trabajar con números y datos?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "C",
      },
      {
        id: 28,
        question_number: 28,
        question_text: "¿Te atrae seguir procedimientos establecidos?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "C",
      },
      {
        id: 29,
        question_number: 29,
        question_text: "¿Te gusta mantener registros detallados?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "C",
      },
      {
        id: 30,
        question_number: 30,
        question_text: "¿Prefieres trabajos estructurados y predecibles?",
        question_type: "multiple_choice",
        options: ["Nada", "Poco", "Algo", "Mucho"],
        category: "C",
      },

      // Open-ended questions 31-35
      {
        id: 31,
        question_number: 31,
        question_text: "¿Qué tipo de actividades te motivan más en el trabajo?",
        question_type: "open_ended",
        category: null,
      },
      {
        id: 32,
        question_number: 32,
        question_text: "¿Cómo te ves profesionalmente en 5 años?",
        question_type: "open_ended",
        category: null,
      },
      {
        id: 33,
        question_number: 33,
        question_text: "¿Cuál ha sido tu mayor logro personal o profesional?",
        question_type: "open_ended",
        category: null,
      },
      {
        id: 34,
        question_number: 34,
        question_text: "¿Cómo sueles enfrentar los desafíos o problemas?",
        question_type: "open_ended",
        category: null,
      },
      {
        id: 35,
        question_number: 35,
        question_text: "¿De qué manera contribuyes mejor en un equipo de trabajo?",
        question_type: "open_ended",
        category: null,
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
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
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
    const maxScore = 90 // 30 questions × 3 points max
    const percentage = Math.round((totalScore / maxScore) * 100)

    // Calculate Holland Code (top 3 categories)
    const sortedCategories = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    const hollandCode = sortedCategories.join("")

    // Get category names
    const categoryNames: Record<string, string> = {
      R: "Realista",
      I: "Investigativo",
      A: "Artístico",
      S: "Social",
      E: "Emprendedor",
      C: "Convencional",
    }

    const topCategories = sortedCategories.map((cat) => categoryNames[cat])

    // Career matches based on Holland Code
    const careerMatches: Record<string, string[]> = {
      IEA: [
        "Desarrollador de Software",
        "Diseñador UX/UI",
        "Consultor de Tecnología",
        "Arquitecto de Sistemas",
        "Product Manager",
      ],
      EIA: [
        "Gerente de Innovación",
        "Consultor de Negocios",
        "Director de Tecnología",
        "Emprendedor Tech",
        "Analista de Mercados",
      ],
      AIE: ["Diseñador Creativo", "Director de Arte", "Arquitecto", "Diseñador de Productos", "Creative Director"],
      ISE: ["Investigador Científico", "Analista de Datos", "Psicólogo", "Médico", "Profesor Universitario"],
      ESI: [
        "Gerente de Recursos Humanos",
        "Director de Ventas",
        "Consultor Organizacional",
        "Coach Ejecutivo",
        "Líder de Equipo",
      ],
      ASI: [
        "Terapeuta de Arte",
        "Trabajador Social Creativo",
        "Diseñador Gráfico",
        "Músico Terapeuta",
        "Educador Artístico",
      ],
    }

    return {
      ...scores,
      total_score: totalScore,
      max_score: maxScore,
      percentage,
      holland_code: hollandCode,
      top_categories: topCategories,
      career_matches: careerMatches[hollandCode] || [
        "Consultor General",
        "Analista",
        "Coordinador",
        "Especialista",
        "Asesor",
      ],
      reflective_responses: reflectiveResponses,
    }
  }

  const submitTest = async () => {
    try {
      setSubmitting(true)
      const results = calculateResults()

      const { error } = await supabase.from("test_results").insert({
        user_email: "travis@example.com",
        test_type: "riasec",
        results: results,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error
      router.push("/test/riasec/results")
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
      R: Target,
      I: Brain,
      A: Palette,
      S: Users,
      E: TrendingUp,
      C: FileText,
    }
    return icons[category as keyof typeof icons] || FileText
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      R: "bg-red-100 text-red-700 border-red-200",
      I: "bg-blue-100 text-blue-700 border-blue-200",
      A: "bg-purple-100 text-purple-700 border-purple-200",
      S: "bg-green-100 text-green-700 border-green-200",
      E: "bg-orange-100 text-orange-700 border-orange-200",
      C: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span>Cargando test RIASEC...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
                Test de Intereses Profesionales RIASEC
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Descubre tu código Holland y encuentra tu carrera ideal
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  ¿Qué es el Test RIASEC?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  El modelo RIASEC de John Holland identifica 6 tipos de personalidad profesional que te ayudan a
                  encontrar carreras compatibles con tus intereses y habilidades.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      <strong>R</strong>ealista - Práctico, técnico
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>I</strong>nvestigativo - Analítico, científico
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">
                      <strong>A</strong>rtístico - Creativo, expresivo
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>S</strong>ocial - Colaborativo, servicial
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">
                      <strong>E</strong>mprendedor - Persuasivo, líder
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">
                      <strong>C</strong>onvencional - Organizado, detallista
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Instrucciones del Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <p className="text-sm text-gray-700">
                      Responde <strong>35 preguntas</strong> sobre tus intereses profesionales
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <p className="text-sm text-gray-700">
                      Para las primeras 30 preguntas, selecciona: <strong>Nada, Poco, Algo, Mucho</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <p className="text-sm text-gray-700">
                      Las últimas 5 son preguntas reflexivas (mínimo <strong>50 caracteres</strong>)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <p className="text-sm text-gray-700">
                      Sé honesto y responde según tus <strong>verdaderos intereses</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      5
                    </div>
                    <p className="text-sm text-gray-700">
                      Tiempo estimado: <strong>10-15 minutos</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">¿Listo para descubrir tu código Holland?</h3>
              <p className="text-gray-600 mb-6">
                Al completar este test obtendrás tu código de 3 letras que te ayudará a identificar las carreras más
                compatibles con tu personalidad profesional.
              </p>
              <Button
                onClick={() => setShowInstructions(false)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Comenzar Test RIASEC
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-900">Test RIASEC</CardTitle>
                <CardDescription>
                  Pregunta {currentQuestion + 1} de {questions.length} • {answeredCount}/{questions.length} respondidas
                </CardDescription>
              </div>
              {currentQ?.category && (
                <Badge className={getCategoryColor(currentQ.category)}>
                  {React.createElement(getCategoryIcon(currentQ.category), { className: "h-4 w-4 mr-1" })}
                  Categoría {currentQ.category}
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
                      ? "bg-blue-600 text-white"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={getCurrentAnswer(currentQ.id) === index ? "default" : "outline"}
                    onClick={() => handleAnswer(currentQ.id, index, currentQ.category)}
                    className={`p-4 h-auto ${
                      getCurrentAnswer(currentQ.id) === index ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{option}</div>
                      <div className="text-xs opacity-75">{index} puntos</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div>
                <Textarea
                  value={(getCurrentAnswer(currentQ.id) as string) || ""}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
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
