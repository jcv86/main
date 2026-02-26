"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mbtiQuestions } from "./mbti-questions"
import TestIntroScreen from "@/components/test-intro-screen"
import TestCompletionScreen from "@/components/test-completion-screen"

export default function MBTITestClient() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [mounted, isLoading, user, router])

  if (!mounted || isLoading || !user) return null

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast({ title: "Por favor selecciona una respuesta" })
      return
    }
    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateMBTIType = () => {
    const dimensionScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    
    mbtiQuestions.forEach((q) => {
      const answerIndex = answers[q.id - 1]
      if (q.category === "EI") {
        if (answerIndex === "0" || answerIndex === "1") dimensionScores.E += (3 - parseInt(answerIndex))
        else dimensionScores.I += (3 - parseInt(answerIndex))
      } else if (q.category === "SN") {
        if (answerIndex === "0" || answerIndex === "1") dimensionScores.S += (3 - parseInt(answerIndex))
        else dimensionScores.N += (3 - parseInt(answerIndex))
      } else if (q.category === "TF") {
        if (answerIndex === "0" || answerIndex === "1") dimensionScores.T += (3 - parseInt(answerIndex))
        else dimensionScores.F += (3 - parseInt(answerIndex))
      } else if (q.category === "JP") {
        if (answerIndex === "0" || answerIndex === "1") dimensionScores.J += (3 - parseInt(answerIndex))
        else dimensionScores.P += (3 - parseInt(answerIndex))
      }
    })

    const type = (dimensionScores.E > dimensionScores.I ? "E" : "I") +
      (dimensionScores.S > dimensionScores.N ? "S" : "N") +
      (dimensionScores.T > dimensionScores.F ? "T" : "F") +
      (dimensionScores.J > dimensionScores.P ? "J" : "P")

    return type
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < mbtiQuestions.length) {
      toast({ title: "Completa todas las preguntas" })
      return
    }

    setIsSubmitting(true)
    try {
      const mbtiType = calculateMBTIType()
      const duration = Math.round((Date.now() - startTime) / 60000)

      const response = await fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "mbti",
          testName: "Myers-Briggs Type Indicator",
          results: { mbti_type: mbtiType },
          answers,
          duration,
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
        setShowCompletion(true)
        toast({ title: "Test completado. Análisis en progreso..." })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({ title: "Error al guardar resultados", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showCompletion) return <TestCompletionScreen testType="mbti" onClose={() => router.push("/despega/journey")} />
  if (showIntro) {
    return (
      <TestIntroScreen
        title="Test MBTI"
        description="Myers-Briggs Type Indicator - Descubre tu tipo de personalidad"
        onStart={() => setShowIntro(false)}
      />
    )
  }

  const question = mbtiQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">{currentQuestion + 1} de {mbtiQuestions.length}</Badge>
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {question.options?.map((option, idx) => (
                <Label key={idx} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <RadioGroupItem value={idx.toString()} />
                  <span>{option}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>

          <div className="flex gap-3 justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
            </Button>

            {currentQuestion < mbtiQuestions.length - 1 ? (
              <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
                Siguiente <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Procesando..." : "Completar Test"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
