"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Brain,
  Users,
  MessageSquare,
  Target,
  Lightbulb,
  Shield,
  Zap,
  Award,
  BookOpen,
} from "lucide-react"

interface Question {
  id: number
  question_text: string
  options: string
  category: string
  test_type: string
}

interface CompetencyInfo {
  name: string
  icon: any
  color: string
  description: string
}

const competencyMap: Record<string, CompetencyInfo> = {
  communication: {
    name: "Comunicación",
    icon: MessageSquare,
    color: "bg-blue-500",
    description: "Capacidad para transmitir ideas de forma clara y efectiva",
  },
  leadership: {
    name: "Liderazgo",
    icon: Users,
    color: "bg-purple-500",
    description: "Habilidad para guiar, motivar e inspirar a otros",
  },
  teamwork: {
    name: "Trabajo en Equipo",
    icon: Users,
    color: "bg-green-500",
    description: "Colaboración efectiva con otros para lograr objetivos comunes",
  },
  "problem-solving": {
    name: "Resolución de Problemas",
    icon: Lightbulb,
    color: "bg-yellow-500",
    description: "Capacidad para identificar, analizar y resolver desafíos",
  },
  adaptability: {
    name: "Adaptabilidad",
    icon: Zap,
    color: "bg-orange-500",
    description: "Flexibilidad para ajustarse a cambios y nuevas situaciones",
  },
  "critical-thinking": {
    name: "Pensamiento Crítico",
    icon: Brain,
    color: "bg-indigo-500",
    description: "Análisis objetivo y evaluación de información para tomar decisiones",
  },
  "time-management": {
    name: "Gestión del Tiempo",
    icon: Target,
    color: "bg-red-500",
    description: "Organización eficiente del tiempo y priorización de tareas",
  },
  "emotional-intelligence": {
    name: "Inteligencia Emocional",
    icon: Shield,
    color: "bg-pink-500",
    description: "Comprensión y manejo de emociones propias y ajenas",
  },
  creativity: {
    name: "Creatividad",
    icon: BookOpen,
    color: "bg-teal-500",
    description: "Capacidad para generar ideas innovadoras y soluciones originales",
  },
}

export default function SoftSkillsTest() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkUserAndLoadQuestions()
  }, [])

  const checkUserAndLoadQuestions = async () => {
    try {
      // Set demo user email for testing
      setUserEmail("demo@example.com")
      await loadQuestions()
    } catch (error) {
      console.error("Error checking user session:", error)
      setError("Error de autenticación")
    }
  }

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", "soft-skills")
        .order("question_number")

      if (error) throw error

      if (data && data.length > 0) {
        setQuestions(data)
      } else {
        setError("No se encontraron preguntas para el test")
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setError("Error al cargar las preguntas")
    } finally {
      setLoading(false)
    }
  }

  const parseOptions = (optionsString: string): string[] => {
    try {
      // Try JSON parsing first
      const parsed = JSON.parse(optionsString)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // If JSON parsing fails, try pipe-separated
      if (optionsString.includes("|")) {
        return optionsString.split("|").map((opt) => opt.trim())
      }
      // If comma-separated
      if (optionsString.includes(",")) {
        return optionsString.split(",").map((opt) => opt.trim())
      }
    }
    return [optionsString] // Fallback to single option
  }

  const handleAnswerChange = (value: string) => {
    const questionId = questions[currentQuestionIndex].id
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Number.parseInt(value),
    }))
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateResults = () => {
    const competencyScores: Record<string, { total: number; count: number }> = {}

    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        if (!competencyScores[question.category]) {
          competencyScores[question.category] = { total: 0, count: 0 }
        }
        // Convert 0-3 scale to percentage (0-100)
        const score = (answer / 3) * 100
        competencyScores[question.category].total += score
        competencyScores[question.category].count += 1
      }
    })

    const results: Record<string, number> = {}
    let overallTotal = 0
    let competencyCount = 0

    Object.keys(competencyScores).forEach((competency) => {
      const { total, count } = competencyScores[competency]
      if (count > 0) {
        results[competency] = Math.round(total / count)
        overallTotal += results[competency]
        competencyCount += 1
      } else {
        results[competency] = 0
      }
    })

    const overallScore = competencyCount > 0 ? Math.round(overallTotal / competencyCount) : 0

    return {
      overall_score: overallScore,
      competency_scores: results,
      answers: answers,
      total_questions: questions.length,
      answered_questions: Object.keys(answers).length,
    }
  }

  const submitTest = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Por favor responde todas las preguntas")
      return
    }

    setSubmitting(true)
    try {
      const results = calculateResults()

      const { error } = await supabase.from("test_results").insert({
        user_email: userEmail,
        test_name: "Test de Habilidades Blandas",
        test_type: "soft-skills",
        results: results,
        score: results.overall_score,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error

      router.push("/test/soft-skills/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      setError("Error al enviar el test")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando test de habilidades blandas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/dashboard")}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay preguntas disponibles</h3>
            <p className="text-gray-600 mb-4">El test no está configurado correctamente</p>
            <Button onClick={() => router.push("/dashboard")}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion.id]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length
  const competencyInfo = competencyMap[currentQuestion.category]
  const options = parseOptions(currentQuestion.options)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test de Habilidades Blandas</h1>
              <p className="text-gray-600">Evalúa tus competencias profesionales clave</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-pink-100 text-pink-700">
            {answeredQuestions}/{questions.length} completadas
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Competency */}
        {competencyInfo && (
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <div className={`p-2 ${competencyInfo.color} rounded-lg`}>
                <competencyInfo.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{competencyInfo.name}</h3>
                <p className="text-sm text-gray-600">{competencyInfo.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
            <CardDescription>Selecciona la opción que mejor describa tu situación</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer?.toString() || ""} onValueChange={handleAnswerChange}>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {currentAnswer !== undefined && <CheckCircle className="h-5 w-5 text-green-500" />}
            <span className="text-sm text-gray-600">
              {currentAnswer !== undefined ? "Respondida" : "Sin responder"}
            </span>
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={currentAnswer === undefined || submitting}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  Finalizar Test
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              disabled={currentAnswer === undefined}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question Overview */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-3">Progreso por Competencia</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {Object.entries(competencyMap).map(([key, info]) => {
              const competencyQuestions = questions.filter((q) => q.category === key)
              const answeredInCompetency = competencyQuestions.filter((q) => answers[q.id] !== undefined).length
              const totalInCompetency = competencyQuestions.length
              const completionRate = totalInCompetency > 0 ? (answeredInCompetency / totalInCompetency) * 100 : 0

              return (
                <div key={key} className="text-center">
                  <div className={`w-8 h-8 ${info.color} rounded-full mx-auto mb-1 flex items-center justify-center`}>
                    <info.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-xs text-gray-600">
                    {answeredInCompetency}/{totalInCompetency}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full ${info.color.replace("bg-", "bg-")}`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
