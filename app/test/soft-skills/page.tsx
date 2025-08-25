"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, ArrowRight, CheckCircle, Clock, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Question {
  id: number
  question_number: number
  question_text: string
  options: string
  category: string
}

export default function SoftSkillsTest() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", "soft-skills")
        .order("question_number")

      if (error) throw error

      if (!data || data.length === 0) {
        throw new Error("No se encontraron preguntas para el test de habilidades blandas")
      }

      setQuestions(data)
    } catch (err) {
      console.error("Error loading questions:", err)
      setError(err instanceof Error ? err.message : "Error desconocido al cargar las preguntas")
    } finally {
      setLoading(false)
    }
  }

  const parseOptions = (optionsString: string): string[] => {
    if (!optionsString) return ["Opción no disponible"]

    // Handle different formats
    if (typeof optionsString === "string") {
      // Try pipe-separated format first
      if (optionsString.includes("|")) {
        return optionsString
          .split("|")
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0)
      }

      // Try JSON format
      try {
        const parsed = JSON.parse(optionsString)
        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch {
        // Not JSON, continue
      }

      // Try comma-separated format
      if (optionsString.includes(",")) {
        return optionsString
          .split(",")
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0)
      }

      // Single option
      return [optionsString]
    }

    // If it's already an array
    if (Array.isArray(optionsString)) {
      return optionsString
    }

    // Fallback
    return ["Opción no disponible"]
  }

  const handleAnswerChange = (value: string) => {
    const answerIndex = Number.parseInt(value)
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }))
  }

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateResults = () => {
    const competencyScores: Record<string, { total: number; count: number }> = {
      communication: { total: 0, count: 0 },
      leadership: { total: 0, count: 0 },
      teamwork: { total: 0, count: 0 },
      "problem-solving": { total: 0, count: 0 },
      adaptability: { total: 0, count: 0 },
      "emotional-intelligence": { total: 0, count: 0 },
      "time-management": { total: 0, count: 0 },
      "critical-thinking": { total: 0, count: 0 },
      creativity: { total: 0, count: 0 },
    }

    questions.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer !== undefined) {
        const category = question.category
        if (competencyScores[category]) {
          // Score based on answer quality (0-3 scale converted to 0-100)
          const score = ((userAnswer + 1) / 4) * 100
          competencyScores[category].total += score
          competencyScores[category].count += 1
        }
      }
    })

    // Calculate averages
    const finalScores: Record<string, number> = {}
    let overallTotal = 0
    let competencyCount = 0

    Object.entries(competencyScores).forEach(([competency, data]) => {
      if (data.count > 0) {
        finalScores[competency] = Math.round(data.total / data.count)
        overallTotal += finalScores[competency]
        competencyCount += 1
      } else {
        finalScores[competency] = 0
      }
    })

    const overallScore = competencyCount > 0 ? Math.round(overallTotal / competencyCount) : 0

    return {
      overall_score: overallScore,
      competency_scores: finalScores,
      answers: answers,
      total_questions: questions.length,
      answered_questions: Object.keys(answers).length,
    }
  }

  const submitTest = async () => {
    try {
      setSubmitting(true)
      const results = calculateResults()

      const { error } = await supabase.from("test_results").insert({
        user_email: "demo@example.com",
        test_name: "Test de Habilidades Blandas",
        test_type: "soft-skills",
        results: results,
        score: results.overall_score,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error

      // Redirect to results page
      router.push("/test/soft-skills/results")
    } catch (err) {
      console.error("Error submitting test:", err)
      setError("Error al enviar el test. Por favor, inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Cargando Test de Habilidades Blandas</h2>
            <p className="text-gray-600 mb-4">Preparando las preguntas...</p>
            <Progress value={50} className="h-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadQuestions} variant="outline">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No hay preguntas disponibles</h2>
            <p className="text-gray-600 mb-4">El test de habilidades blandas no está configurado correctamente.</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const options = parseOptions(currentQ.options)
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = answers[currentQuestion] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-8 w-8 text-pink-500" />
                <h1 className="text-3xl font-bold text-gray-900">Test de Habilidades Blandas</h1>
              </div>
              <p className="text-gray-600">Evalúa tus competencias profesionales en situaciones del mundo real</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {currentQuestion + 1} de {questions.length}
              </Badge>
              <div className="text-sm text-gray-500">{answeredCount} respondidas</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pregunta {currentQuestion + 1}</CardTitle>
              <Badge variant="outline" className="capitalize">
                {currentQ.category?.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">{currentQ.question_text}</p>
            </div>

            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 text-gray-700 cursor-pointer leading-relaxed">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goToPrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Sin límite de tiempo</span>
          </div>

          {isLastQuestion ? (
            <Button onClick={submitTest} disabled={!canProceed || submitting} className="bg-pink-600 hover:bg-pink-700">
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Test
                </>
              )}
            </Button>
          ) : (
            <Button onClick={goToNext} disabled={!canProceed} className="bg-pink-600 hover:bg-pink-700">
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Test Info */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-pink-500" />
                <div>
                  <div className="font-semibold">25 Preguntas</div>
                  <div className="text-sm text-gray-500">Escenarios profesionales</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-semibold">9 Competencias</div>
                  <div className="text-sm text-gray-500">Habilidades evaluadas</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-semibold">Sin límite</div>
                  <div className="text-sm text-gray-500">Tómate tu tiempo</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
