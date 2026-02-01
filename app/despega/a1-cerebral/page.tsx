"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, CheckCircle, Brain } from "lucide-react"

// ALL 20 QUESTIONS INLINE
const A1_QUESTIONS = [
  { id: 1, area: "energia", type: "scale", text: "¿Cuántas horas duermes por noche?", min: 4, max: 10, minLabel: "4 horas", maxLabel: "10 horas" },
  { id: 2, area: "energia", type: "multiple", text: "¿Cómo describes tu energía general durante el día?", options: ["Muy baja", "Baja", "Normal", "Buena", "Excelente"] },
  { id: 3, area: "energia", type: "multiple", text: "¿Con qué frecuencia haces ejercicio?", options: ["Nunca", "1-2 veces/semana", "3-4 veces/semana", "5-6 veces/semana", "Diariamente"] },
  { id: 4, area: "energia", type: "scale", text: "¿Qué tan consistente es tu rutina de sueño?", min: 1, max: 10, minLabel: "Inconsistente", maxLabel: "Consistente" },
  { id: 5, area: "energia", type: "scale", text: "¿Cuánta hidratación diaria tienes?", min: 0, max: 10, minLabel: "Casi nada", maxLabel: "10+ vasos" },
  
  { id: 6, area: "enfoque", type: "multiple", text: "¿Cuánto tiempo puedes concentrarte profundamente?", options: ["< 15 min", "15-30 min", "30-60 min", "1-2 horas", "> 2 horas"] },
  { id: 7, area: "enfoque", type: "multiple", text: "¿Con qué frecuencia revisas notificaciones?", options: ["Constantemente", "Cada 5-10 min", "Cada 15-30 min", "Ocasionalmente", "Casi nunca"] },
  { id: 8, area: "enfoque", type: "scale", text: "¿Cuántas tareas principales completas al día?", min: 1, max: 10, minLabel: "1 tarea", maxLabel: "10+ tareas" },
  { id: 9, area: "enfoque", type: "scale", text: "¿Qué tan claro tienes tu plan diario?", min: 1, max: 10, minLabel: "Confuso", maxLabel: "Muy claro" },
  { id: 10, area: "enfoque", type: "multiple", text: "¿Cuánto tiempo pierdes en tareas no prioritarias?", options: ["> 50%", "30-50%", "20-30%", "10-20%", "< 10%"] },
  
  { id: 11, area: "relaciones", type: "multiple", text: "¿Con qué frecuencia contactas amigos/colegas?", options: ["Casi nunca", "Mensual", "Quincenal", "Semanal", "Varias veces/semana"] },
  { id: 12, area: "relaciones", type: "scale", text: "¿Cómo describes tu escucha activa?", min: 1, max: 10, minLabel: "Pienso en mi respuesta", maxLabel: "Escucho realmente" },
  { id: 13, area: "relaciones", type: "multiple", text: "¿Cuántas relaciones profesionales significativas?", options: ["Ninguna", "1-3", "4-8", "9-15", "> 15"] },
  { id: 14, area: "relaciones", type: "scale", text: "¿Facilidad para expresar gratitud?", min: 1, max: 10, minLabel: "Me cuesta", maxLabel: "Facilidad" },
  { id: 15, area: "relaciones", type: "scale", text: "¿Comodidad pidiendo ayuda?", min: 1, max: 10, minLabel: "Incómodo", maxLabel: "Cómodo" },
  
  { id: 16, area: "plan_ejecutivo", type: "scale", text: "¿Claridad sobre tus metas principales?", min: 1, max: 10, minLabel: "Confuso", maxLabel: "Cristal claro" },
  { id: 17, area: "plan_ejecutivo", type: "multiple", text: "¿Con qué frecuencia planificas tu semana?", options: ["Nunca", "Ocasionalmente", "Semanalmente", "2x/semana", "Diariamente"] },
  { id: 18, area: "plan_ejecutivo", type: "scale", text: "¿Decisiones importantes por semana?", min: 0, max: 20, minLabel: "Ninguna", maxLabel: "Muchas" },
  { id: 19, area: "plan_ejecutivo", type: "multiple", text: "¿Qué tan bien ejecutas lo que planificas?", options: ["Muy mal", "Mal", "Regular", "Bien", "Excelente"] },
  { id: 20, area: "plan_ejecutivo", type: "multiple", text: "¿Tienes un ritual matutino?", options: ["No", "Irregular", "Sí (5-10 min)", "Sí (10-30 min)", "Sí (30+ min)"] },
]

export default function A1CerebralTestPage() {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const question = A1_QUESTIONS[currentIdx]
  const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100
  const isAnswered = answers[question.id] !== undefined
  const canProceed = isAnswered

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
    // Auto-advance to next question after answering (optional - remove if not desired)
    // if (currentIdx < A1_QUESTIONS.length - 1) {
    //   setTimeout(() => setCurrentIdx(currentIdx + 1), 300)
    // }
  }

  const handleNext = () => {
    if (currentIdx < A1_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Save test results
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Test completed with answers:", answers)
      router.push("/despega")
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const areaLabels = {
    energia: "Energía",
    enfoque: "Enfoque",
    relaciones: "Relaciones",
    plan_ejecutivo: "Plan Ejecutivo"
  }

  const areaBg = {
    energia: "bg-blue-100",
    enfoque: "bg-green-100",
    relaciones: "bg-orange-100",
    plan_ejecutivo: "bg-purple-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/despega")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Badge className={`${areaBg[question.area]} text-sm font-semibold`}>
            <Brain className="h-4 w-4 mr-1" />
            {areaLabels[question.area]}
          </Badge>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Despega Cerebral™</h1>
          <p className="text-gray-600">Pregunta {currentIdx + 1} de {A1_QUESTIONS.length}</p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-8 h-3" />

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {question.type === "scale" && (
              <div>
                <Slider
                  min={question.min}
                  max={question.max}
                  step={1}
                  value={[answers[question.id] || question.min]}
                  onValueChange={(v) => handleAnswer(v[0])}
                  className="w-full mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">{question.minLabel}</span>
                  <span className="text-2xl font-bold text-blue-600">{answers[question.id] || question.min}</span>
                  <span className="font-medium text-gray-600">{question.maxLabel}</span>
                </div>
              </div>
            )}

            {question.type === "multiple" && (
              <RadioGroup value={String(answers[question.id] || "")} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {question.options?.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <RadioGroupItem value={option} id={`opt-${idx}`} />
                      <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-gray-800">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIdx === 0}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentIdx === A1_QUESTIONS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => {
                console.log("[v0] Next clicked. Current answered:", isAnswered)
                handleNext()
              }}
              disabled={!isAnswered}
              className="flex-1"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-1 flex-wrap mb-4">
            {A1_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx < currentIdx
                    ? "bg-blue-600"
                    : answers[A1_QUESTIONS[idx].id] !== undefined
                      ? "bg-blue-300"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {Object.keys(answers).length} de {A1_QUESTIONS.length} respondidas
          </p>
        </div>
      </div>
    </div>
  )
}
