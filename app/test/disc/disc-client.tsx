"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Brain, CheckCircle, Clock, Hand } from "lucide-react"
import { Breadcrumbs, TestStructuredData } from "@/components/seo-optimized-content"
import { TestNavigationFlow } from "@/components/test-navigation-flow"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useToast } from "@/hooks/use-toast"
import { discQuestions } from "./disc-questions" // Fixed imports - using correct paths and named import for discQuestions
import TestIntroScreen from "@/components/test-intro-screen"
import TestCompletionScreen from "@/components/test-completion-screen"

const breadcrumbItems = [
  { name: "Inicio", url: "/" },
  { name: "Tests", url: "/test" },
  { name: "Test Despega Cerebral", url: "/test/disc" },
]

interface Question {
  id: number
  text?: string
  question?: string
  type?: "multiple_choice" | "open_ended" | "scenario"
  options?: string[]
  dimension?: "D" | "I" | "S" | "C"
  category?: "D" | "I" | "S" | "C"
}

export default function DISCTestClient() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [mounted, setMounted] = useState(false)
  const [gestureLog, setGestureLog] = useState<string[]>([])
  const [touchSupport, setTouchSupport] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    setTouchSupport("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  const handleGestureUsed = (gesture: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setGestureLog((prev) => [`[${timestamp}] ${gesture}`, ...prev.slice(0, 4)])
  }

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [discQuestions[currentQuestion].id]: answer })
    handleGestureUsed(`Answer selected: ${answer.substring(0, 30)}...`)
  }

  const nextQuestion = () => {
    if (currentQuestion < discQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      handleGestureUsed("Navigated to next question")
    } else {
      setIsCompleted(true)
      handleGestureUsed("Test completed")
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      handleGestureUsed("Navigated to previous question")
    }
  }

  const calculateDISCScores = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    discQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        // Check if question has options (multiple choice)
        if (question.options && Array.isArray(question.options)) {
          const answerIndex = question.options.indexOf(answer)
          if (answerIndex === 0) scores.D += 3
          else if (answerIndex === 1) scores.I += 3
          else if (answerIndex === 2) scores.S += 3
          else if (answerIndex === 3) scores.C += 3
        } else {
          // For open-ended or scenario questions, use dimension
          const dimension = (question.dimension || question.category) as "D" | "I" | "S" | "C"
          if (dimension) {
            scores[dimension] += 2
          }
        }
      }
    })

    const total = scores.D + scores.I + scores.S + scores.C
    if (total > 0) {
      scores.D = Math.round((scores.D / total) * 100)
      scores.I = Math.round((scores.I / total) * 100)
      scores.S = Math.round((scores.S / total) * 100)
      scores.C = Math.round((scores.C / total) * 100)
    }

    return scores
  }

  const getPrimaryStyle = (scores: { D: number; I: number; S: number; C: number }) => {
    const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
    if (scores.D === maxScore) return "Dominance"
    if (scores.I === maxScore) return "Influence"
    if (scores.S === maxScore) return "Steadiness"
    return "Compliance"
  }

  const submitTest = async () => {
    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para guardar tus resultados",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const scores = calculateDISCScores()
      const primaryStyle = getPrimaryStyle(scores)
      const duration = Math.round((Date.now() - startTime) / 60000)

      const testResults = {
        D: scores.D,
        I: scores.I,
        S: scores.S,
        C: scores.C,
        primary_style: primaryStyle,
        answers: answers,
        gesture_interactions: gestureLog.length,
        touch_enabled: touchSupport,
      }

      console.log("[v0] Saving Despega Cerebral test results with unified system...")

      const result = await UnifiedTestSystem.saveTestResult({
        userEmail: user.email!,
        testType: "Despega Cerebral",
        testResults,
        durationMinutes: duration,
      })

      if (!result.savedToDatabase) {
        toast({
          title: "Error Crítico",
          description:
            result.error || "No se pudieron guardar los resultados en la base de datos. Por favor contacta soporte.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Test completado",
        description: "Tus resultados han sido guardados exitosamente",
      })

      setCompletionData({
        primaryStyle,
        scores,
        duration,
      })
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error submitting test:", error)
      toast({
        title: "Error",
        description: "Hubo un error al procesar tus resultados. Por favor intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showIntro) {
    return (
      <TestIntroScreen
        testName="Despega Cerebral"
        testDescription="Tu Perfil de Comportamiento Profesional"
        whatItMeasures={[
          "Tu estilo de comportamiento natural en el trabajo",
          "Preferencias de comunicación y toma de decisiones",
          "4 dimensiones clave: Dominancia, Influencia, Estabilidad y Cumplimiento",
          "Fortalezas naturales y áreas de desarrollo",
        ]}
        whyRelevant="Entender tu estilo DISC te ayuda a comunicarte mejor, elegir roles que se alineen con tus fortalezas naturales y desarrollar competencias complementarias."
        estimatedTime={15}
        totalQuestions={discQuestions.length}
        onStart={() => setShowIntro(false)}
      />
    )
  }

  if (showCompletion && completionData) {
    const styleLabels: Record<string, string> = {
      Dominance: "Dominancia",
      Influence: "Influencia",
      Steadiness: "Estabilidad",
      Compliance: "Cumplimiento",
    }

    return (
      <TestCompletionScreen
        testName="Despega Cerebral"
        quickSummary={`Tu estilo principal es ${styleLabels[completionData.primaryStyle] || completionData.primaryStyle}. Este perfil refleja tu forma natural de actuar en entornos profesionales.`}
        highlightedInsight={`Puntaje ${styleLabels[completionData.primaryStyle]}: ${completionData.scores[completionData.primaryStyle.charAt(0)]}%`}
        resultsPath="/test/disc/results"
        testType="disc"
      />
    )
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Despega Cerebral assessment...</p>
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

  const progress = answers[discQuestions[currentQuestion].id]
    ? ((currentQuestion + 1) / discQuestions.length) * 100
    : (currentQuestion / discQuestions.length) * 100

  const question = discQuestions[currentQuestion]
  const currentAnswer = answers[question.id]

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Test Despega Cerebral Completado!</CardTitle>
            <CardDescription>Has respondido todas las preguntas. Ahora procesaremos tus resultados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={submitTest} disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? "Procesando..." : "Ver Mis Resultados"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <div className="flex items-center space-x-2">
            {touchSupport && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                <Hand className="h-4 w-4 mr-1" />
                Gesture Enabled
              </Badge>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{Math.round((Date.now() - startTime) / 60000)} min</span>
            </div>
          </div>
        </div>

        <Breadcrumbs items={breadcrumbItems} />
        <TestStructuredData
          name="Despega Cerebral - Evaluación de Comportamiento Profesional"
          description="Evaluación psicométrica DISC para identificar tu estilo de comportamiento en el trabajo"
          duration={15}
          questions={28}
        />

        <article className="prose lg:prose-xl max-w-4xl mx-auto mb-8">
          <h1>Despega Cerebral: Descubre tu Estilo de Comportamiento Profesional</h1>
        </article>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Despega Cerebral</h2>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestion + 1} of {discQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{Math.round((Date.now() - startTime) / 60000)} minutes elapsed</p>
        </div>

        <Card className="transition-all duration-300" style={{ transform: `scale(${Math.min(zoomLevel, 1.1)})` }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {question.type === "multiple_choice" && "Multiple Choice"}
                {question.type === "open_ended" && "Open Response"}
                {question.type === "scenario" && "Scenario"}
              </Badge>
              <Badge variant="secondary">Question {currentQuestion + 1}</Badge>
            </div>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple_choice" && question.options && (
              <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 border border-gray-200 cursor-pointer transition-colors"
                      onClick={() => handleAnswer(option)}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {(question.type === "open_ended" || question.type === "scenario") && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Write your detailed response here..."
                  value={currentAnswer || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex items-center text-xs text-gray-500">
                  <Brain className="h-3 w-3 mr-1 text-blue-600" />
                  This response will be analyzed for personalized insights
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={nextQuestion} disabled={!currentAnswer} size="lg">
                {currentQuestion === discQuestions.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Test
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gestureLog.length > 0 && (
          <Card className="mt-6 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hand className="h-4 w-4" />
                Recent Gesture Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {gestureLog.map((log, index) => (
                  <div key={index} className="text-xs text-purple-700 bg-white p-2 rounded border">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">About the Despega Cerebral Assessment</h3>
                <p className="text-sm text-gray-600 mt-1">
                  The Despega Cerebral assessment evaluates four behavioral dimensions: Dominance (D), Influence (I),
                  Steadiness (S), and Compliance (C). Your responses will help identify your natural behavioral style
                  and communication preferences in professional settings.
                  {touchSupport && " This version includes gesture support for enhanced mobile interaction."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <TestNavigationFlow testType="disc" />
      </div>
    </div>
  )
}
