"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react"
import { C1_QUESTIONS } from "@/lib/canon-questions"

interface C1ComponentProps {
  onComplete: (responses: Record<number, string>) => void
  onBack: () => void
}

export function ConozcamonosUnoComponent({ onComplete, onBack }: C1ComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isValid, setIsValid] = useState(false)

  const question = C1_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / C1_QUESTIONS.length) * 100
  const currentResponse = responses[question.id] || ""

  const validateResponse = (value: string) => {
    // Require at least 3 characters for meaningful responses
    const isValid = value.trim().length >= 3
    setIsValid(isValid)
    return isValid
  }

  const handleResponseChange = (value: string) => {
    setResponses({ ...responses, [question.id]: value })
    validateResponse(value)
  }

  const handleNext = () => {
    if (!isValid && currentResponse.length < 3) {
      setIsValid(false)
      return
    }

    if (currentQuestion < C1_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setIsValid(false)
    } else {
      onComplete(responses)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setIsValid(currentResponse.length >= 3)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Conozcámonos
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Antes de descubrir tu patrón Despega Cerebral, queremos entender tu contexto real.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Pregunta {currentQuestion + 1} de {C1_QUESTIONS.length}
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentResponse.length} caracteres
            </p>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  ¿Por qué estas preguntas?
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
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
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isValid && currentResponse.length < 3}
            className="flex-1 h-12"
          >
            {currentQuestion === C1_QUESTIONS.length - 1 ? (
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
        >
          Volver
        </Button>
      </div>
    </div>
  )
}
