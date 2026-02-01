"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"

interface Question {
  id: string
  area: "energia" | "enfoque" | "relaciones" | "plan_ejecutivo"
  question: string
  type: "scale" | "multiple-choice"
  options?: string[]
  scale?: { min: number; max: number; minLabel: string; maxLabel: string }
}

const QUESTIONS: Question[] = [
  // ENERGÍA
  { id: "e1", area: "energia", question: "¿Cuántas horas duermes por noche?", type: "scale", scale: { min: 4, max: 10, minLabel: "4h", maxLabel: "10h" } },
  { id: "e2", area: "energia", question: "¿Cómo es tu energía general?", type: "multiple-choice", options: ["Muy baja", "Baja", "Normal", "Buena", "Excelente"] },
  { id: "e3", area: "energia", question: "¿Con qué frecuencia haces ejercicio?", type: "multiple-choice", options: ["Nunca", "1-2x/semana", "3-4x/semana", "5-6x/semana", "Diario"] },
  { id: "e4", area: "energia", question: "¿Qué tan consistente es tu sueño?", type: "scale", scale: { min: 1, max: 10, minLabel: "Inconsistente", maxLabel: "Consistente" } },
  { id: "e5", area: "energia", question: "¿Cuánta agua bebes diario?", type: "scale", scale: { min: 0, max: 10, minLabel: "Casi nada", maxLabel: "Mucha" } },
  
  // ENFOQUE
  { id: "f1", area: "enfoque", question: "¿Cuánto tiempo de enfoque profundo tienes?", type: "multiple-choice", options: ["<15 min", "15-30 min", "30-60 min", "1-2 horas", ">2 horas"] },
  { id: "f2", area: "enfoque", question: "¿Con qué frecuencia revisas notificaciones?", type: "multiple-choice", options: ["Constantemente", "Cada 5-10 min", "Cada 15-30 min", "Ocasionalmente", "Casi nunca"] },
  { id: "f3", area: "enfoque", question: "¿Cuántas tareas completas al día?", type: "scale", scale: { min: 1, max: 10, minLabel: "1 tarea", maxLabel: "10+ tareas" } },
  { id: "f4", area: "enfoque", question: "¿Qué tan claro tienes tu plan de hoy?", type: "scale", scale: { min: 1, max: 10, minLabel: "Confuso", maxLabel: "Cristal claro" } },
  { id: "f5", area: "enfoque", question: "¿Cuánto tiempo pierdes en tareas no prioritarias?", type: "multiple-choice", options: [">50%", "30-50%", "20-30%", "10-20%", "<10%"] },
  
  // RELACIONES
  { id: "r1", area: "relaciones", question: "¿Con qué frecuencia contactas a amigos/colegas?", type: "multiple-choice", options: ["Casi nunca", "Mensual", "Quincenal", "Semanal", "Varias veces/semana"] },
  { id: "r2", area: "relaciones", question: "¿Cómo es tu escucha activa?", type: "scale", scale: { min: 1, max: 10, minLabel: "Baja", maxLabel: "Alta" } },
  { id: "r3", area: "relaciones", question: "¿Cuántas relaciones profesionales significativas tienes?", type: "multiple-choice", options: ["Ninguna", "1-3", "4-8", "9-15", ">15"] },
  { id: "r4", area: "relaciones", question: "¿Expresas gratitud fácilmente?", type: "scale", scale: { min: 1, max: 10, minLabel: "Me cuesta", maxLabel: "Fácil" } },
  { id: "r5", area: "relaciones", question: "¿Cómo te sientes pidiendo ayuda?", type: "scale", scale: { min: 1, max: 10, minLabel: "Incómodo", maxLabel: "Cómodo" } },
  
  // PLAN EJECUTIVO
  { id: "p1", area: "plan_ejecutivo", question: "¿Claridad en metas (3-6 meses)?", type: "scale", scale: { min: 1, max: 10, minLabel: "Confuso", maxLabel: "Cristal claro" } },
  { id: "p2", area: "plan_ejecutivo", question: "¿Con qué frecuencia planificas tu semana?", type: "multiple-choice", options: ["Nunca", "Ocasionalmente", "Semanalmente", "2x/semana", "Diario"] },
  { id: "p3", area: "plan_ejecutivo", question: "¿Cuántas decisiones importantes tomas/semana?", type: "scale", scale: { min: 0, max: 20, minLabel: "Ninguna", maxLabel: "Muchas" } },
  { id: "p4", area: "plan_ejecutivo", question: "¿Qué tan bien ejecutas lo que planificas?", type: "multiple-choice", options: ["Muy mal", "Mal", "Regular", "Bien", "Excelente"] },
  { id: "p5", area: "plan_ejecutivo", question: "¿Tienes ritual matutino?", type: "multiple-choice", options: ["No", "Irregular", "5-10 min", "10-30 min", "30+ min"] },
]

interface Props {
  onComplete: (results: any) => void
}

export default function A1DiagnosticTest({ onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [done, setDone] = useState(false)

  const q = QUESTIONS[index]
  const progress = ((index + 1) / QUESTIONS.length) * 100
  const answered = answers[q.id] !== undefined

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }))
  }

  const handleNext = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1)
    } else {
      setDone(true)
      onComplete(answers)
    }
  }

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1)
  }

  if (done) {
    return (
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">¡Diagnóstico Completado!</h2>
        <p className="text-gray-600">Tus respuestas han sido guardadas</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Pregunta {index + 1} de {QUESTIONS.length}</span>
          <span>{Object.keys(answers).length} respondidas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-96">
        {/* Badge & Header */}
        <div className="mb-8 pb-6 border-b-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Badge className={`px-3 py-1 ${
              q.area === "energia" ? "bg-blue-100 text-blue-900" :
              q.area === "enfoque" ? "bg-green-100 text-green-900" :
              q.area === "relaciones" ? "bg-orange-100 text-orange-900" :
              "bg-purple-100 text-purple-900"
            }`}>
              {q.area === "energia" ? "Energía" : q.area === "enfoque" ? "Enfoque" : q.area === "relaciones" ? "Relaciones" : "Plan Ejecutivo"}
            </Badge>
            <span className="text-sm font-semibold text-gray-600">Pregunta {index + 1}/20</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {q.question}
          </h2>
        </div>

        {/* Answers */}
        <div className="space-y-6">
          {q.type === "scale" && q.scale && (
            <div className="space-y-6">
              <Slider
                min={q.scale.min}
                max={q.scale.max}
                step={1}
                value={[answers[q.id] || q.scale.min]}
                onValueChange={(v) => handleAnswer(v[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">{q.scale.minLabel}</span>
                <span className="text-2xl font-bold text-blue-600">{answers[q.id] || q.scale.min}</span>
                <span className="text-gray-600">{q.scale.maxLabel}</span>
              </div>
            </div>
          )}

          {q.type === "multiple-choice" && q.options && (
            <RadioGroup value={String(answers[q.id] || "")} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
                    <RadioGroupItem value={opt} id={`opt-${i}`} />
                    <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base font-medium ml-3 text-gray-800">
                      {opt}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={index === 0}
          size="lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!answered}
          size="lg"
        >
          {index === QUESTIONS.length - 1 ? (
            <>
              Completar
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
