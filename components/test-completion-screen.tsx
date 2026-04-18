"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, FileText, MessageCircle, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface TestCompletionScreenProps {
  testName?: string
  quickSummary?: string
  highlightedInsight?: string
  keyInsight?: string
  resultsPath?: string
  testType: "disc" | "ei" | "mbti" | "big-five" | "riasec" | "soft-skills"
  onClose?: () => void
  onViewFullReport?: () => void
  onTalkToCoach?: () => void
}

export function TestCompletionScreen({
  testName = "Test Completed",
  quickSummary = "Great job! You've completed the assessment.",
  highlightedInsight = "You're making progress on your personal development journey.",
  keyInsight,
  resultsPath = "/results",
  testType,
  onClose,
  onViewFullReport,
  onTalkToCoach,
}: TestCompletionScreenProps) {
  const router = useRouter()

  useEffect(() => {
    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  const handleViewFullReport = onViewFullReport || (() => {
    router.push(resultsPath)
  })

  const handleTalkToCoach = onTalkToCoach || (() => {
    // Navigate to coach with context
    router.push(`/coach?context=test-completed&test=${testType}`)
  })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-[20px] bg-purple/10 p-4">
              <CheckCircle2 className="w-12 h-12 text-purple" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">¡Evaluación Completada!</CardTitle>
          <CardDescription className="text-lg">
            Has terminado el <span className="font-semibold text-foreground">{testName}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Summary */}
          <div className="bg-muted/50 rounded-[28px] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple" />
              <h3 className="font-semibold text-lg">Resumen Rápido</h3>
            </div>
            <p className="text-muted-foreground">{quickSummary}</p>
          </div>

          {/* Highlighted Insight */}
          <div className="border-l-4 border-purple pl-4 py-2">
            <p className="font-medium text-lg">💡 {keyInsight || highlightedInsight}</p>
          </div>

          {/* Next steps */}
          <div className="space-y-3 pt-4">
            <h3 className="font-semibold text-center mb-4">¿Qué quieres hacer ahora?</h3>

            <div className="grid gap-3">
              <Button onClick={handleViewFullReport} size="lg" className="w-full text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Ver Informe Completo
              </Button>

              <Button onClick={handleTalkToCoach} variant="outline" size="lg" className="w-full text-lg bg-transparent">
                <MessageCircle className="w-5 h-5 mr-2" />
                Hablar con tu Coach IA
              </Button>

              {onClose && (
                <Button onClick={onClose} variant="ghost" size="lg" className="w-full text-lg">
                  Volver al Inicio
                </Button>
              )}
            </div>
          </div>

          {/* Additional info */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>
              Tu informe completo incluye análisis detallado, recomendaciones personalizadas y un plan de desarrollo de
              90 días.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestCompletionScreen
