"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Heart,
  Users,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
  Star,
  Zap,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Question {
  id: number
  question_number: number
  question_text: string
  options: string[]
  category: string
  question_type: string
}

const categoryInfo = {
  self_awareness: {
    name: "Autoconciencia",
    icon: Brain,
    color: "bg-blue-500",
    description: "Reconocimiento de tus propias emociones y su impacto",
  },
  self_regulation: {
    name: "Autorregulación",
    icon: Target,
    color: "bg-green-500",
    description: "Manejo efectivo de tus emociones y impulsos",
  },
  motivation: {
    name: "Motivación",
    icon: Lightbulb,
    color: "bg-yellow-500",
    description: "Impulso interno hacia el logro y la excelencia",
  },
  empathy: {
    name: "Empatía",
    icon: Heart,
    color: "bg-red-500",
    description: "Comprensión y conexión con las emociones de otros",
  },
  social_skills: {
    name: "Habilidades Sociales",
    icon: Users,
    color: "bg-purple-500",
    description: "Manejo efectivo de relaciones interpersonales",
  },
}

export default function EmotionalIntelligenceTest() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"intro" | "test" | "submitting">("intro")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    if (currentStep === "test") {
      fetchQuestions()
      setStartTime(new Date())
    }
  }, [currentStep])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-questions?type=emotional-intelligence")
      if (!response.ok) throw new Error("Failed to fetch questions")
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las preguntas. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
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
    const categoryScores: { [key: string]: { total: number; count: number } } = {}

    // Initialize category scores
    Object.keys(categoryInfo).forEach((category) => {
      categoryScores[category] = { total: 0, count: 0 }
    })

    // Calculate scores by category
    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined && question.category && categoryScores[question.category]) {
        const score = (answer + 1) * 25 // Convert 0-3 to 25-100 scale
        categoryScores[question.category].total += score
        categoryScores[question.category].count += 1
      }
    })

    // Calculate average scores
    const competencyScores: { [key: string]: number } = {}
    let totalScore = 0

    Object.keys(categoryScores).forEach((category) => {
      const { total, count } = categoryScores[category]
      competencyScores[category] = count > 0 ? Math.round(total / count) : 0
      totalScore += competencyScores[category]
    })

    const overallScore = Math.round(totalScore / Object.keys(categoryScores).length)

    return {
      overall_score: overallScore,
      competency_scores: {
        self_awareness: competencyScores.self_awareness || 0,
        self_regulation: competencyScores.self_regulation || 0,
        motivation: competencyScores.motivation || 0,
        empathy: competencyScores.empathy || 0,
        social_skills: competencyScores.social_skills || 0,
      },
    }
  }

  const submitTest = async () => {
    setCurrentStep("submitting")

    const duration = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 60000) : 0
    const results = calculateResults()

    try {
      const response = await fetch("/api/test-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "emotional-intelligence",
          testName: "Test de Inteligencia Emocional",
          results,
          answers,
          duration,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit test")

      toast({
        title: "¡Test completado!",
        description: "Tus resultados han sido guardados exitosamente.",
      })

      router.push("/test/emotional-intelligence/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar tus resultados. Intenta de nuevo.",
        variant: "destructive",
      })
      setCurrentStep("test")
    }
  }

  const getProgressByCategory = () => {
    const categoryProgress: { [key: string]: { answered: number; total: number } } = {}

    Object.keys(categoryInfo).forEach((category) => {
      categoryProgress[category] = { answered: 0, total: 0 }
    })

    questions.forEach((question) => {
      // Safety check: only process if category exists in our categoryInfo
      if (question.category && categoryProgress[question.category]) {
        categoryProgress[question.category].total += 1
        if (answers[question.id] !== undefined) {
          categoryProgress[question.category].answered += 1
        }
      }
    })

    return categoryProgress
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test de Inteligencia Emocional</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre tu nivel de inteligencia emocional y cómo puedes mejorar tus habilidades para manejar emociones,
              relacionarte con otros y liderar con efectividad.
            </p>
          </div>

          {/* Test Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Duración</h3>
                <p className="text-gray-600">20-30 minutos</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Preguntas</h3>
                <p className="text-gray-600">30 preguntas</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <Star className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Resultado</h3>
                <p className="text-gray-600">Análisis detallado</p>
              </CardContent>
            </Card>
          </div>

          {/* Competencies */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">¿Qué evalúa este test?</CardTitle>
              <CardDescription className="text-center text-lg">
                El test mide cinco competencias clave de la inteligencia emocional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categoryInfo).map(([key, info]) => {
                  const IconComponent = info.icon
                  return (
                    <div key={key} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-3 rounded-lg ${info.color} bg-opacity-20`}>
                        <IconComponent className="h-8 w-8 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{info.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-red-500" />
                <span>Instrucciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>
                    Responde honestamente basándote en cómo realmente actúas, no en cómo crees que deberías actuar
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>No hay respuestas correctas o incorrectas, solo diferentes estilos emocionales</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Tómate tu tiempo para reflexionar sobre cada pregunta</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Puedes navegar entre preguntas y cambiar tus respuestas antes de enviar</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={() => setCurrentStep("test")}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-12 py-4 text-lg"
            >
              Comenzar Test
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "submitting") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <Heart className="h-16 w-16 animate-pulse mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Procesando resultados...</h2>
            <p className="text-gray-600 mb-6">
              Estamos analizando tus respuestas y generando tu perfil emocional personalizado.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-12 w-12 animate-pulse mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  // Safety check: if currentQuestion doesn't exist, show loading
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-12 w-12 animate-pulse mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Cargando pregunta...</p>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const categoryProgress = getProgressByCategory()

  // Safety check for current category - provide fallback if category doesn't exist
  const currentCategory = categoryInfo[currentQuestion.category as keyof typeof categoryInfo] || {
    name: "General",
    icon: Brain,
    color: "bg-gray-500",
    description: "Pregunta general",
  }

  const IconComponent = currentCategory.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test de Inteligencia Emocional</h1>
          <p className="text-gray-600">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso General</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 mb-6" />

          {/* Category Progress */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(categoryProgress).map(([category, progress]) => {
              const info = categoryInfo[category as keyof typeof categoryInfo]
              if (!info) return null

              const CategoryIcon = info.icon
              const percentage = progress.total > 0 ? (progress.answered / progress.total) * 100 : 0

              return (
                <div key={category} className="text-center">
                  <div className={`p-2 rounded-lg ${info.color} bg-opacity-20 mb-2 mx-auto w-fit`}>
                    <CategoryIcon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="text-xs font-medium text-gray-700 mb-1">{info.name}</div>
                  <div className="text-xs text-gray-500">
                    {progress.answered}/{progress.total}
                  </div>
                  <Progress value={percentage} className="h-1 mt-1" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${currentCategory.color} bg-opacity-20`}>
                <IconComponent className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <Badge variant="outline" className="mb-1">
                  {currentCategory.name}
                </Badge>
                <CardDescription>{currentCategory.description}</CardDescription>
              </div>
            </div>
            <CardTitle className="text-xl leading-relaxed">{currentQuestion.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value))}
            >
              {currentQuestion.options &&
                currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                      {option}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2 bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Anterior</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Respondidas: {Object.keys(answers).length} / {questions.length}
            </p>
            {Object.keys(answers).length === questions.length && (
              <Badge className="bg-green-100 text-green-800">¡Todas las preguntas respondidas!</Badge>
            )}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={Object.keys(answers).length !== questions.length}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center space-x-2"
            >
              <span>Finalizar Test</span>
              <CheckCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              disabled={answers[currentQuestion.id] === undefined}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center space-x-2"
            >
              <span>Siguiente</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
