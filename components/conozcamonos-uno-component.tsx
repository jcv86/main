"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react"
import { C1_QUESTIONS } from "@/lib/canon-questions"

interface C1ComponentProps {
  onComplete: (responses: Record<number, string>, insights: string) => void
  onBack: () => void
}

export function ConozcamonosUnoComponent({ onComplete, onBack }: C1ComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const question = C1_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / C1_QUESTIONS.length) * 100
  const currentResponse = responses[question.id] || ""

  const validateResponse = (value: string) => {
    const isValid = value.trim().length >= 3
    setIsValid(isValid)
    return isValid
  }

  const handleResponseChange = (value: string) => {
    setResponses({ ...responses, [question.id]: value })
    validateResponse(value)
  }

  const generateC1Insights = async (c1Responses: Record<number, string>) => {
    try {
      console.log('[v0] Llamando a C1→OpenAI para generar insights...')
      const res = await fetch('/api/canon/c1-openai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c1Responses })
      })

      if (!res.ok) {
        console.error('[v0] Error en C1→OpenAI:', res.status)
        return 'Contexto capturado. Listo para el test Despega Cerebral.'
      }

      const data = await res.json()
      console.log('[v0] Insights generados:', data.insights)
      return data.insights || 'Contexto capturado. Listo para el test.'
    } catch (error) {
      console.error('[v0] Error generando insights:', error)
      return 'Contexto capturado. Continuando...'
    }
  }

  const handleNext = async () => {
    if (!isValid && currentResponse.length < 3) {
      setIsValid(false)
      return
    }

    if (currentQuestion < C1_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setIsValid(false)
    } else {
      setIsLoading(true)
      const insights = await generateC1Insights(responses)
      setIsLoading(false)
      onComplete(responses, insights)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setIsValid(currentResponse.length >= 3)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Conozcámonos
          </h2>
          <p className="text-lg text-muted-foreground">
            Antes de descubrir tu patrón Despega Cerebral, queremos entender tu contexto real.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-muted-foreground">
              Pregunta {currentQuestion + 1} de {C1_QUESTIONS.length}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-foreground">
              {question.question}
            </CardTitle>
            {question.subtitle && (
              <CardDescription className="text-base mt-2">
                {question.subtitle}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "textarea" ? (
              <Textarea
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder={question.placeholder}
                className="min-h-32 text-base resize-none"
              />
            ) : (
              <Input
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder={question.placeholder}
                className="text-base h-12"
                type="text"
              />
            )}
            <p className="text-xs text-muted-foreground">
              {currentResponse.length} caracteres
            </p>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-8 bg-purple/5 border-purple/30">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  ¿Por qué estas preguntas?
                </p>
                <p className="text-sm text-muted-foreground">
                  Tu contexto real ayuda a personalizar tu informe Despega Cerebral. Los datos que compartes permiten generar una ruta de 90 días que tenga sentido en tu vida actual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isLoading}
            variant="outline"
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={(!isValid && currentResponse.length < 3) || isLoading}
            className="flex-1 h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : currentQuestion === C1_QUESTIONS.length - 1 ? (
              <>
                Completar
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full mt-4"
          disabled={isLoading}
        >
          Volver
        </Button>
      </div>
    </div>
  )
}
