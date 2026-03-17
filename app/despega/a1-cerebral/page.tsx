"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { TestIntroScreen } from "@/components/test-intro-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { DISC_TEST_QUESTIONS } from "@/lib/disc-test-questions"
import { DiscResultsPage } from "@/components/disc-results-page"

const A1_QUESTIONS = DISC_TEST_QUESTIONS

export default function A1CerebralPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, loading: authLoading } = useAuthRedirect()
  const [stage, setStage] = useState<"intro" | "test" | "results">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userLevel, setUserLevel] = useState<"principiante" | "intermedio" | "avanzado" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !user?.id) return
    const loadUserLevel = async () => {
      try {
        const { data: testResults } = await supabase
          .from("despega_a1_test_results")
          .select("nivel_detectado")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (testResults?.nivel_detectado) {
          setUserLevel(testResults.nivel_detectado as any)
        } else {
          setUserLevel("principiante")
        }
      } catch (error) {
        console.log("[v0] Could not load user level:", error)
        setUserLevel("principiante")
      } finally {
        setLoading(false)
      }
    }
    loadUserLevel()
  }, [authLoading, user?.id, supabase])

  const handleStartTest = () => {
    setStage("test")
    setCurrentIdx(0)
    setAnswers({})
  }

  const handleAnswer = (value: any) => {
    const question = A1_QUESTIONS[currentIdx]
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (currentIdx < A1_QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1)
  }

  const handlePrevious = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const calculateDISCScores = () => {
    const scores: Record<string, number> = { energia: 0, enfoque: 0, relaciones: 0, plan_ejecutivo: 0 }
    const counts: Record<string, number> = { energia: 0, enfoque: 0, relaciones: 0, plan_ejecutivo: 0 }

    A1_QUESTIONS.forEach(question => {
      const answer = answers[question.id]
      if (answer === undefined) return

      const dimension = question.category || "energia"
      let normalizedScore = 0

      if (question.type === "scale") {
        const min = (question as any).min || 1
        const max = (question as any).max || 5
        normalizedScore = ((answer - min) / (max - min)) * 100
      } else if (question.type === "multiple") {
        const optionIndex = (question.options as string[])?.indexOf(answer) || 0
        normalizedScore = (optionIndex / ((question.options as string[])?.length || 1 - 1)) * 100
      }

      scores[dimension] += normalizedScore
      counts[dimension]++
    })

    return {
      energia: counts.energia > 0 ? Math.round(scores.energia / counts.energia) : 0,
      enfoque: counts.enfoque > 0 ? Math.round(scores.enfoque / counts.enfoque) : 0,
      relaciones: counts.relaciones > 0 ? Math.round(scores.relaciones / counts.relaciones) : 0,
      plan_ejecutivo: counts.plan_ejecutivo > 0 ? Math.round(scores.plan_ejecutivo / counts.plan_ejecutivo) : 0,
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("[v0] No user found")
        setStage("results")
        return
      }

      const scores = calculateDISCScores()
      console.log("[v0] Test results:", scores)
      setStage("results")
    } finally {
      setIsSubmitting(false)
    }
  }

  const question = A1_QUESTIONS[currentIdx]
  const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100
  const isAnswered = question && answers[question.id] !== undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  const renderStage = () => {
    if (stage === "intro") {
      return (
        <TestIntroScreen
          title="Despega Cerebral A1"
          description="Descubre tus 4 dimensiones clave: Energía, Enfoque, Relaciones y Plan Ejecutivo"
          onStart={handleStartTest}
        />
      )
    }

    if (stage === "test" && question) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
          <div className="max-w-2xl mx-auto">
            <Progress value={progress} className="mb-8" />
            <Card>
              <CardHeader>
                <CardTitle>{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.type === "scale" && (
                  <div className="flex justify-between">
                    {Array.from({ length: ((question as any).max || 5) - ((question as any).min || 1) + 1 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(((question as any).min || 1) + i)}
                        className={`px-3 py-2 rounded ${
                          answers[question.id] === ((question as any).min || 1) + i
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {((question as any).min || 1) + i}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "multiple" && (
                  <div className="space-y-2">
                    {(question.options as string[])?.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`w-full p-3 text-left rounded border ${
                          answers[question.id] === option
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 justify-between pt-4">
                  <Button onClick={handlePrevious} variant="outline" disabled={currentIdx === 0}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                  {currentIdx === A1_QUESTIONS.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting || !isAnswered}>
                      {isSubmitting ? "Enviando..." : "Enviar"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!isAnswered}>
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (stage === "results") {
      const scores = calculateDISCScores()
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">¡Test Completado!</h1>
              <p className="text-lg text-gray-600">Tu Perfil Despega Cerebral</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {Object.entries(scores).map(([dim, score]) => (
                <Card key={dim}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{dim.replace(/_/g, ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-4">{Math.round(score)}%</div>
                    <Progress value={score} className="mb-4" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => router.push("/despega")} size="lg">
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }

  return renderStage()
}
