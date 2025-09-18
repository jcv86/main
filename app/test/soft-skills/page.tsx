"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Users, MessageSquare, Target, Heart, CheckCircle, Lightbulb } from "lucide-react"
import { getTestQuestions, saveOpenResponse, saveTestResult, type TestQuestion } from "@/lib/supabase"

const categoryIcons = {
  communication: MessageSquare,
  leadership: Target,
  teamwork: Users,
  problem_solving: Lightbulb,
  adaptability: Brain,
  emotional_intelligence: Heart,
  time_management: Clock,
  critical_thinking: CheckCircle,
}

const categoryColors = {
  communication: "text-blue-600",
  leadership: "text-purple-600",
  teamwork: "text-green-600",
  problem_solving: "text-orange-600",
  adaptability: "text-teal-600",
  emotional_intelligence: "text-pink-600",
  time_management: "text-indigo-600",
  critical_thinking: "text-red-600",
}

const categoryNames = {
  communication: "Comunicación",
  leadership: "Liderazgo",
  teamwork: "Trabajo en Equipo",
  problem_solving: "Resolución de Problemas",
  adaptability: "Adaptabilidad",
  emotional_intelligence: "Inteligencia Emocional",
  time_management: "Gestión del Tiempo",
  critical_thinking: "Pensamiento Crítico",
}

export default function SoftSkillsTest() {
  const router = useRouter()
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [openResponses, setOpenResponses] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userEmail = "demo@example.com" // In real app, get from auth

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const questionsData = await getTestQuestions("soft-skills")
      console.log("Loaded questions:", questionsData)
      setQuestions(questionsData)
    } catch (err) {
      setError("Error loading questions. Please try again.")
      console.error("Error loading questions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleOpenResponseChange = (questionId: number, value: string) => {
    setOpenResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const categoryScores: Record<string, { total: number; count: number }> = {}

    // Initialize categories
    Object.keys(categoryNames).forEach((category) => {
      categoryScores[category] = { total: 0, count: 0 }
    })

    // Calculate scores for multiple choice questions
    questions.forEach((question) => {
      if (question.question_type === "multiple_choice" && answers[question.id]) {
        const answerIndex = Number.parseInt(answers[question.id])
        const score = answerIndex + 1 // Convert 0-based to 1-based scoring

        if (!categoryScores[question.category!]) {
          categoryScores[question.category!] = { total: 0, count: 0 }
        }

        categoryScores[question.category!].total += score
        categoryScores[question.category!].count += 1
      }
    })

    // Calculate average scores and convert to percentage
    const results: Record<string, number> = {}
    let totalScore = 0
    let categoryCount = 0

    Object.entries(categoryScores).forEach(([category, data]) => {
      if (data.count > 0) {
        const avgScore = data.total / data.count
        results[category] = Math.round((avgScore / 4) * 100) // Convert to percentage (4 is max score)
        totalScore += results[category]
        categoryCount += 1
      }
    })

    const overallScore = categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0

    return {
      overall_score: overallScore,
      category_scores: results,
      strengths: Object.entries(results)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category),
      areas_for_improvement: Object.entries(results)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 2)
        .map(([category]) => category),
    }
  }

  const submitTest = async () => {
    try {
      setSubmitting(true)

      // Save open-ended responses first
      for (const question of questions) {
        if (question.question_type === "open_ended" && openResponses[question.id]) {
          await saveOpenResponse(userEmail, "soft-skills", question.id, openResponses[question.id])
        }
      }

      // Calculate and save results
      const results = calculateResults()
      await saveTestResult(userEmail, "soft-skills", results, results.overall_score)

      // Redirect to results
      router.push("/test/soft-skills/results")
    } catch (err) {
      setError("Error submitting test. Please try again.")
      console.error("Error submitting test:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando test de habilidades blandas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600 mb-4">{error}</div>
            <Button onClick={loadQuestions} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">No hay preguntas disponibles.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isAnswered =
    question.question_type === "multiple_choice"
      ? answers[question.id] !== undefined
      : openResponses[question.id]?.trim().length > 0

  const CategoryIcon = categoryIcons[question.category as keyof typeof categoryIcons] || Brain
  const categoryColor = categoryColors[question.category as keyof typeof categoryColors] || "text-gray-600"
  const categoryName = categoryNames[question.category as keyof typeof categoryNames] || question.category

  // Parse options safely with better error handling
  let parsedOptions: string[] = []
  if (question.question_type === "multiple_choice" && question.options) {
    try {
      // Handle both string and array formats
      if (typeof question.options === "string") {
        // Try to parse as JSON first
        try {
          parsedOptions = JSON.parse(question.options)
        } catch (jsonError) {
          // If JSON parsing fails, try to split by common delimiters
          if (question.options.includes("|")) {
            parsedOptions = question.options.split("|").map((opt) => opt.trim())
          } else if (question.options.includes(";")) {
            parsedOptions = question.options.split(";").map((opt) => opt.trim())
          } else if (question.options.includes(",")) {
            parsedOptions = question.options.split(",").map((opt) => opt.trim())
          } else {
            // Fallback: treat as single option
            parsedOptions = [question.options]
          }
        }
      } else if (Array.isArray(question.options)) {
        parsedOptions = question.options
      } else {
        console.warn("Unexpected options format:", question.options)
        parsedOptions = []
      }
    } catch (e) {
      console.error("Error parsing options for question", question.id, ":", e)
      parsedOptions = []
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test de Habilidades Blandas</h1>
          <p className="text-gray-600">Evalúa tus competencias profesionales clave</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CategoryIcon className={`h-6 w-6 ${categoryColor}`} />
              <span className={`text-sm font-medium ${categoryColor}`}>{categoryName}</span>
            </div>
            <CardTitle className="text-xl">{question.question_text}</CardTitle>
            {question.question_type === "open_ended" && (
              <CardDescription>
                Responde con detalle. Tu respuesta será analizada por IA para proporcionar insights personalizados.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {question.question_type === "multiple_choice" ? (
              parsedOptions.length > 0 ? (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  {parsedOptions.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-red-500 p-4 border border-red-200 rounded">
                  Error: No se pudieron cargar las opciones para esta pregunta.
                  <br />
                  <small>
                    Formato de opciones: {typeof question.options} - {String(question.options).substring(0, 100)}...
                  </small>
                </div>
              )
            ) : (
              <Textarea
                placeholder="Escribe tu respuesta aquí..."
                value={openResponses[question.id] || ""}
                onChange={(e) => handleOpenResponseChange(question.id, e.target.value)}
                className="min-h-[120px]"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
            Anterior
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion ? "bg-blue-600" : index < currentQuestion ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button onClick={submitTest} disabled={!isAnswered || submitting} className="min-w-[120px]">
              {submitting ? "Enviando..." : "Finalizar Test"}
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={!isAnswered}>
              Siguiente
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div>
              <div className="font-medium text-blue-600">
                {questions.filter((q) => q.question_type === "multiple_choice").length}
              </div>
              <div>Opción múltiple</div>
            </div>
            <div>
              <div className="font-medium text-green-600">
                {questions.filter((q) => q.question_type === "open_ended").length}
              </div>
              <div>Respuesta abierta</div>
            </div>
            <div>
              <div className="font-medium text-purple-600">{Object.keys(categoryNames).length}</div>
              <div>Competencias</div>
            </div>
            <div>
              <div className="font-medium text-orange-600">
                {Object.values(answers).length + Object.values(openResponses).filter((r) => r.trim().length > 0).length}
              </div>
              <div>Respondidas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
