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
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { riasecQuestions } from "./riasec-questions"
import TestIntroScreen from "@/components/test-intro-screen"
import TestCompletionScreen from "@/components/test-completion-screen"

export default function RIASECTestClient() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
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

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) {
      toast({ title: "Por favor selecciona una respuesta" })
      return
    }
    if (currentQuestion < riasecQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateRIASECType = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    
    riasecQuestions.forEach((q) => {
      const answer = answers[q.id - 1]
      if (answer !== undefined) {
        scores[q.category as keyof typeof scores] += answer
      }
    })

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    return {
      primary: sorted[0][0],
      secondary: sorted[1][0],
      tertiary: sorted[2][0],
      scores
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < riasecQuestions.length) {
      toast({ title: "Completa todas las preguntas" })
      return
    }

    setIsSubmitting(true)
    try {
      const result = calculateRIASECType()
      const duration = Math.round((Date.now() - startTime) / 60000)

      const response = await fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "riasec",
          testName: "RIASEC Vocational Interests",
          results: result,
          answers,
          duration,
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
        setShowCompletion(true)
        toast({ title: "Test completado" })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({ title: "Error al guardar resultados", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showCompletion) return <TestCompletionScreen testType="riasec" testName="Despega Rumbo" onClose={() => router.push("/despega/journey")} />
  if (showIntro) {
    return (
      <TestIntroScreen
        title="Test RIASEC"
        description="Intereses Vocacionales - Descubre tu tipo de carrera ideal"
        onStart={() => setShowIntro(false)}
      />
    )
  }

  const question = riasecQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / riasecQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">{currentQuestion + 1} de {riasecQuestions.length}</Badge>
            <Briefcase className="w-5 h-5 text-teal-600" />
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup value={answers[currentQuestion]?.toString() || ""} onValueChange={(v) => handleAnswer(parseInt(v))}>
            <div className="space-y-2">
              {["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"].map((label, idx) => (
                <Label key={idx} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-100">
                  <RadioGroupItem value={(idx + 1).toString()} />
                  <span className="text-sm">{label}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>

          <div className="flex gap-3 justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
            </Button>

            {currentQuestion < riasecQuestions.length - 1 ? (
              <Button onClick={handleNext} disabled={answers[currentQuestion] === undefined}>
                Siguiente <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                {isSubmitting ? "Procesando..." : "Completar Test"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
