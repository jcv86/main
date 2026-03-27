"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Brain, Clock, ArrowLeft, ArrowRight, CheckCircle, Sparkles, MessageSquare } from "lucide-react"
import { useSession } from "@/components/session-wrapper"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useToast } from "@/hooks/use-toast"
import TestIntroScreen from "@/components/test-intro-screen"
import TestCompletionScreen from "@/components/test-completion-screen"

interface Question {
  id: number
  text: string
  type: "likert" | "open" | "scenario"
  factor: "O" | "C" | "E" | "A" | "N"
  reverse?: boolean
  options?: string[]
}

const bigFiveQuestions: Question[] = [
  // Openness to Experience (O)
  { id: 1, text: "Me gusta explorar nuevas ideas y conceptos", type: "likert", factor: "O" },
  {
    id: 2,
    text: "¿Cómo te describes en términos de creatividad e innovación? Describe una situación donde hayas aplicado tu creatividad.",
    type: "open",
    factor: "O",
  },
  { id: 3, text: "Disfruto de actividades artísticas y creativas", type: "likert", factor: "O" },
  { id: 4, text: "Prefiero seguir rutinas establecidas", type: "likert", factor: "O", reverse: true },
  { id: 5, text: "Me interesa aprender sobre diferentes culturas", type: "likert", factor: "O" },
  { id: 6, text: "Tengo una imaginación muy activa", type: "likert", factor: "O" },

  // Conscientiousness (C)
  { id: 7, text: "Siempre cumplo con mis compromisos y plazos", type: "likert", factor: "C" },
  {
    id: 8,
    text: "¿Qué tan organizado eres en tu vida diaria y trabajo? Describe tu sistema de organización personal.",
    type: "open",
    factor: "C",
  },
  { id: 9, text: "Soy muy organizado en mi trabajo y vida personal", type: "likert", factor: "C" },
  { id: 10, text: "A menudo dejo las cosas para el último minuto", type: "likert", factor: "C", reverse: true },
  { id: 11, text: "Presto atención a los detalles importantes", type: "likert", factor: "C" },
  { id: 12, text: "Tengo autodisciplina para completar tareas difíciles", type: "likert", factor: "C" },

  // Extraversion (E)
  { id: 13, text: "Me siento energizado cuando estoy con otras personas", type: "likert", factor: "E" },
  {
    id: 14,
    text: "¿Cómo te sientes en situaciones sociales y de liderazgo? Describe tu estilo de interacción.",
    type: "open",
    factor: "E",
  },
  { id: 15, text: "Prefiero trabajar solo que en equipo", type: "likert", factor: "E", reverse: true },
  { id: 16, text: "Soy el alma de las fiestas y reuniones sociales", type: "likert", factor: "E" },
  { id: 17, text: "Me gusta ser el centro de atención", type: "likert", factor: "E" },
  { id: 18, text: "Inicio conversaciones con extraños fácilmente", type: "likert", factor: "E" },

  // Agreeableness (A)
  { id: 19, text: "Siempre trato de ayudar a otros cuando puedo", type: "likert", factor: "A" },
  {
    id: 20,
    text: "¿Cómo manejas los conflictos y la cooperación con otros? Describe tu enfoque.",
    type: "open",
    factor: "A",
  },
  { id: 21, text: "Confío en las buenas intenciones de las personas", type: "likert", factor: "A" },
  { id: 22, text: "Puedo ser bastante competitivo y agresivo", type: "likert", factor: "A", reverse: true },
  { id: 23, text: "Me preocupo genuinamente por el bienestar de otros", type: "likert", factor: "A" },
  { id: 24, text: "Prefiero cooperar que competir", type: "likert", factor: "A" },

  // Neuroticism (N)
  { id: 25, text: "Me preocupo frecuentemente por cosas pequeñas", type: "likert", factor: "N" },
  {
    id: 26,
    text: "¿Cómo respondes al estrés y la presión? Describe tus estrategias de manejo.",
    type: "open",
    factor: "N",
  },
  { id: 27, text: "Mantengo la calma bajo presión", type: "likert", factor: "N", reverse: true },
  { id: 28, text: "Mis emociones cambian rápidamente", type: "likert", factor: "N" },
  { id: 29, text: "Me siento ansioso en situaciones nuevas", type: "likert", factor: "N" },
  { id: 30, text: "Soy emocionalmente estable", type: "likert", factor: "N", reverse: true },
]

const likertOptions = [
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
]

export default function BigFiveTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)

  const router = useRouter()
  const { user, isLoading } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  const handleLikertAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleOpenAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const calculateScores = () => {
    const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
    const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    bigFiveQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined && question.type === "likert") {
        const numericAnswer = typeof answer === "number" ? answer : 3
        const score = question.reverse ? 6 - numericAnswer : numericAnswer
        scores[question.factor] += score
        counts[question.factor]++
      }
    })

    // Convert to percentages (1-5 scale to 0-100)
    const percentageScores = {
      O: Math.round(((scores.O / Math.max(counts.O, 1) - 1) / 4) * 100),
      C: Math.round(((scores.C / Math.max(counts.C, 1) - 1) / 4) * 100),
      E: Math.round(((scores.E / Math.max(counts.E, 1) - 1) / 4) * 100),
      A: Math.round(((scores.A / Math.max(counts.A, 1) - 1) / 4) * 100),
      N: Math.round(((scores.N / Math.max(counts.N, 1) - 1) / 4) * 100),
    }

    return percentageScores
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < bigFiveQuestions.length) {
      toast({
        title: "Incomplete Test",
        description: "Por favor responde todas las preguntas antes de continuar.",
        variant: "destructive",
      })
      return
    }

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Debes estar autenticado para guardar los resultados.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    setIsSubmitting(true)
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const scores = calculateScores()
    const overallScore = Math.round((scores.O + scores.C + scores.E + scores.A + (100 - scores.N)) / 5)

    const results = {
      ...scores,
      overall_score: overallScore,
      duration_minutes: duration,
      completion_date: endTime.toISOString(),
      total_questions: bigFiveQuestions.length,
      answered_questions: Object.keys(answers).length,
      answers,
    }

    try {
    console.log("[v0] Submitting Big Five test results to database...")
    const saveResult = await UnifiedTestSystem.saveTestResult(user.email, "Big Five", results, duration)

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save results")
      }

      console.log("[v0] Big Five test results saved successfully to database")
      setCompletionData({
        scores,
        overallScore,
        duration,
      })
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error submitting 5 Dimensiones test:", error)
      toast({
        title: "Error saving results",
        description: "No se pudieron guardar tus resultados en la base de datos. Por favor contacta soporte.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Despega Brújula...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (showIntro) {
    return (
      <TestIntroScreen
        testName="5 Dimensiones Despega"
        testDescription="Descubre tu perfil de personalidad completo"
        whatItMeasures={["Este test evalúa cinco dimensiones fundamentales de tu personalidad:"]}
        dimensions={[
          {
            name: "Apertura a la Experiencia",
            description: "Tu curiosidad intelectual, creatividad e interés por nuevas ideas",
          },
          {
            name: "Responsabilidad",
            description: "Tu nivel de organización, autodisciplina y orientación a objetivos",
          },
          {
            name: "Extraversión",
            description: "Tu energía social, asertividad y nivel de actividad",
          },
          {
            name: "Amabilidad",
            description: "Tu cooperación, empatía y consideración hacia otros",
          },
          {
            name: "Estabilidad Emocional",
            description: "Tu capacidad para manejar el estrés y mantener la calma",
          },
        ]}
        whyRelevant="Entender tus rasgos de personalidad te ayuda a identificar tus fortalezas naturales, áreas de desarrollo, y cómo te relacionas con otros en diferentes contextos personales y profesionales."
        estimatedTime={20}
        onStart={() => setShowIntro(false)}
        onBack={() => router.push("/test")}
      />
    )
  }

  if (showCompletion && completionData) {
    const highestDimension = Object.entries(completionData.scores).reduce((a, b) =>
      (a[1] as number) > (b[1] as number) ? a : b,
    )
    const dimensionNames = {
      O: "Apertura a la Experiencia",
      C: "Responsabilidad",
      E: "Extraversión",
      A: "Amabilidad",
      N: "Neuroticismo (bajo = Estabilidad Emocional)",
    }

    return (
      <TestCompletionScreen
        testType="big-five"
        testName="5 Dimensiones Despega"
        quickSummary={`Tu puntuación general es ${completionData.overallScore}%. Tu dimensión más desarrollada es ${dimensionNames[highestDimension[0] as keyof typeof dimensionNames]} con ${highestDimension[1]}%.`}
        keyInsight={`Tu perfil de personalidad muestra una combinación única de rasgos. Tu alta ${dimensionNames[highestDimension[0] as keyof typeof dimensionNames]} te permite destacar en situaciones que requieren estas características, mientras que las otras dimensiones complementan tu forma de ser en diferentes contextos.`}
        onViewFullReport={() => router.push("/test/big-five/results")}
        onTalkToCoach={() => router.push("/coach")}
      />
    )
  }

  const progress = ((currentQuestion + 1) / bigFiveQuestions.length) * 100
  const question = bigFiveQuestions[currentQuestion]
  const canProceed = answers[question.id] !== undefined && answers[question.id] !== ""

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <Badge variant="secondary" className="text-sm">
              <Brain className="h-4 w-4 mr-1" />Despega Brújula
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Despega Brújula</h2>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {bigFiveQuestions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>~20 minutes</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  With AI Analysis
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{question.text}</CardTitle>
              <Badge variant={question.type === "open" ? "default" : "secondary"}>
                {question.type === "open" ? (
                  <>
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Open Response
                  </>
                ) : (
                  "Likert Scale"
                )}
              </Badge>
            </div>
            <CardDescription>
              {question.type === "open"
                ? "Describe your experience or perspective in detail (minimum 50 characters)"
                : "Select the option that best describes your usual behavior or preference"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {question.type === "likert" ? (
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleLikertAnswer(question.id, Number.parseInt(value))}
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your experience, perspective, or approach in this area..."
                  value={(answers[question.id] as string) || ""}
                  onChange={(e) => handleOpenAnswer(question.id, e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{((answers[question.id] as string) || "").length} characters (minimum 50 required)</span>
                  {((answers[question.id] as string) || "").length >= 50 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === bigFiveQuestions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={!canProceed || isSubmitting}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Test
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(bigFiveQuestions.length - 1, currentQuestion + 1))}
              disabled={!canProceed}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-1">
            {bigFiveQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-gray-900"
                    : answers[bigFiveQuestions[index].id]
                      ? "bg-gray-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} of {bigFiveQuestions.length} questions answered
          </p>
        </div>
      </div>
    </div>
  )
}
