"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"

interface A1Question {
  id: string
  area: "energia" | "enfoque" | "relaciones" | "plan_ejecutivo"
  question: string
  subtext?: string
  type: "scale" | "multiple-choice"
  options?: string[]
  scale?: { min: number; max: number; minLabel: string; maxLabel: string }
}

const A1_QUESTIONS: A1Question[] = [
  // ENERGÍA (5 preguntas)
  {
    id: "energia_1",
    area: "energia",
    question: "¿Cuántas horas duermes típicamente por noche?",
    type: "scale",
    scale: { min: 4, max: 10, minLabel: "4 horas", maxLabel: "10 horas" },
  },
  {
    id: "energia_2",
    area: "energia",
    question: "¿Cómo describirías tu energía general durante el día?",
    type: "multiple-choice",
    options: ["Muy baja - me cuesta levantarme", "Baja - me siento cansado", "Normal - variable", "Buena - me siento activo", "Excelente - tengo energía constante"],
  },
  {
    id: "energia_3",
    area: "energia",
    question: "¿Con qué frecuencia haces ejercicio o actividad física?",
    type: "multiple-choice",
    options: ["Nunca o casi nunca", "1-2 veces por semana", "3-4 veces por semana", "5-6 veces por semana", "Diariamente"],
  },
  {
    id: "energia_4",
    area: "energia",
    question: "¿Qué tan consistente es tu rutina de sueño?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "Muy inconsistente", maxLabel: "Muy consistente" },
  },
  {
    id: "energia_5",
    area: "energia",
    question: "¿Cuánta hidratación diaria tienes? (vasos de agua aprox)",
    type: "scale",
    scale: { min: 0, max: 10, minLabel: "Casi nada", maxLabel: "10+ vasos" },
  },

  // ENFOQUE (5 preguntas)
  {
    id: "enfoque_1",
    area: "enfoque",
    question: "¿Cuánto tiempo puedes mantener concentración profunda sin distracciones?",
    type: "multiple-choice",
    options: ["Menos de 15 minutos", "15-30 minutos", "30-60 minutos", "1-2 horas", "Más de 2 horas"],
  },
  {
    id: "enfoque_2",
    area: "enfoque",
    question: "¿Con qué frecuencia tienes que revisar tus notificaciones durante el trabajo?",
    type: "multiple-choice",
    options: ["Constantemente", "Cada 5-10 minutos", "Cada 15-30 minutos", "Ocasionalmente", "Casi nunca"],
  },
  {
    id: "enfoque_3",
    area: "enfoque",
    question: "¿Cuántas tareas principales completas al día de forma efectiva?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "1 tarea", maxLabel: "10+ tareas" },
  },
  {
    id: "enfoque_4",
    area: "enfoque",
    question: "¿Qué tan claro tienes tu plan o prioridades para hoy?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "Muy confuso", maxLabel: "Muy claro" },
  },
  {
    id: "enfoque_5",
    area: "enfoque",
    question: "¿Cuánto tiempo pierdes en tareas no prioritarias?",
    type: "multiple-choice",
    options: ["Más del 50% del tiempo", "30-50%", "20-30%", "10-20%", "Menos del 10%"],
  },

  // RELACIONES (5 preguntas)
  {
    id: "relaciones_1",
    area: "relaciones",
    question: "¿Con qué frecuencia contactas a amigos o colegas importantes?",
    type: "multiple-choice",
    options: ["Casi nunca", "Ocasionalmente (mensual)", "A veces (quincenal)", "Regularmente (semanal)", "Frecuentemente (varios veces/semana)"],
  },
  {
    id: "relaciones_2",
    area: "relaciones",
    question: "¿Cómo describes tu capacidad de escucha activa?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "Muy baja - pienso en mi respuesta", maxLabel: "Muy alta - realmente escucho" },
  },
  {
    id: "relaciones_3",
    area: "relaciones",
    question: "¿Cuántas relaciones profesionales significativas tienes?",
    type: "multiple-choice",
    options: ["Ninguna o muy pocas", "1-3 personas", "4-8 personas", "9-15 personas", "Más de 15 personas"],
  },
  {
    id: "relaciones_4",
    area: "relaciones",
    question: "¿Con qué facilidad expresas gratitud y reconocimiento?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "Me cuesta mucho", maxLabel: "Lo hago fácilmente" },
  },
  {
    id: "relaciones_5",
    area: "relaciones",
    question: "¿Qué tan cómodo te sientes pidiendo ayuda?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "Muy incómodo", maxLabel: "Muy cómodo" },
  },

  // PLAN EJECUTIVO (5 preguntas)
  {
    id: "plan_ejecutivo_1",
    area: "plan_ejecutivo",
    question: "¿Cuál es tu claridad sobre tus metas principales (3-6 meses)?",
    type: "scale",
    scale: { min: 1, max: 10, minLabel: "Muy confuso", maxLabel: "Cristal claro" },
  },
  {
    id: "plan_ejecutivo_2",
    area: "plan_ejecutivo",
    question: "¿Con qué frecuencia planificas tu semana?",
    type: "multiple-choice",
    options: ["Nunca", "Ocasionalmente", "Semanalmente", "2 veces por semana", "Diariamente"],
  },
  {
    id: "plan_ejecutivo_3",
    area: "plan_ejecutivo",
    question: "¿Cuántas decisiones importantes tomas por semana?",
    type: "scale",
    scale: { min: 0, max: 20, minLabel: "Ninguna", maxLabel: "Muchas (20+)" },
  },
  {
    id: "plan_ejecutivo_4",
    area: "plan_ejecutivo",
    question: "¿Qué tan bien ejecutas lo que planificas?",
    type: "multiple-choice",
    options: ["Muy mal - ejecuto poco", "Mal - ejecuto algunos", "Regular - ejecuto la mitad", "Bien - ejecuto la mayoría", "Excelente - ejecuto todo"],
  },
  {
    id: "plan_ejecutivo_5",
    area: "plan_ejecutivo",
    question: "¿Tienes un ritual matutino que te prepare mentalmente?",
    type: "multiple-choice",
    options: ["No tengo ritual", "Tengo pero es irregular", "Sí, pero corto (5-10 min)", "Sí, moderado (10-30 min)", "Sí, robusto (30+ min)"],
  },
]

interface A1DiagnosticTestProps {
  onComplete: (results: any) => void
}

export default function A1DiagnosticTest({ onComplete }: A1DiagnosticTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQuestion = A1_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / A1_QUESTIONS.length) * 100
  const answeredCount = Object.keys(answers).length

  const handleAnswer = (value: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < A1_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateResults = () => {
    const areas = ["energia", "enfoque", "relaciones", "plan_ejecutivo"]
    const results: Record<string, number> = {}

    areas.forEach(area => {
      const areaQuestions = A1_QUESTIONS.filter(q => q.area === area)
      const areaAnswers = areaQuestions
        .map(q => answers[q.id])
        .filter(a => a !== undefined)

      if (areaAnswers.length > 0) {
        const sum = areaAnswers.reduce((acc, val) => {
          if (typeof val === "number") return acc + val
          // Convert option index to scale
          return acc + ((typeof val === "string" ? A1_QUESTIONS.find(q => q.id === Object.keys(answers).find(k => answers[k] === val))?.options?.indexOf(val as string) || 0 : 0) + 1) * 2
        }, 0)
        results[`score_${area}`] = Math.round((sum / (areaQuestions.length * 10)) * 100)
      }
    })

    const diagnostico = detectNivel(results)
    onComplete({
      respuestas: answers,
      resultados: results,
      diagnostico,
      completedAt: new Date().toISOString(),
    })
    setIsCompleted(true)
  }

  const detectNivel = (results: Record<string, number>) => {
    const average = Object.values(results).reduce((a, b) => a + b, 0) / Object.keys(results).length
    if (average >= 80) return "Avanzado"
    if (average >= 60) return "Intermedio"
    return "Fundamental"
  }

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle>¡Diagnóstico Completado!</CardTitle>
          <CardDescription>Tus resultados han sido registrados</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg font-medium">Hemos analizado tus 20 respuestas en los 4 pilares</p>
          <p className="text-muted-foreground">Ahora pasaremos al plan de acción personalizado</p>
        </CardContent>
      </Card>
    )
  }

  const isAnswered = answers[currentQuestion.id] !== undefined

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pregunta {currentQuestionIndex + 1} de {A1_QUESTIONS.length}</span>
          <Badge variant="outline">{answeredCount} respondidas</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge 
              className={`capitalize ${
                currentQuestion.area === "energia" ? "bg-blue-100 text-blue-800" :
                currentQuestion.area === "enfoque" ? "bg-green-100 text-green-800" :
                currentQuestion.area === "relaciones" ? "bg-orange-100 text-orange-800" :
                "bg-purple-100 text-purple-800"
              }`}
            >
              {currentQuestion.area === "energia" ? "Energía" :
               currentQuestion.area === "enfoque" ? "Enfoque" :
               currentQuestion.area === "relaciones" ? "Relaciones" :
               "Plan Ejecutivo"}
            </Badge>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          {currentQuestion.subtext && (
            <CardDescription>{currentQuestion.subtext}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion.type === "scale" && currentQuestion.scale && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Slider
                  min={currentQuestion.scale.min}
                  max={currentQuestion.scale.max}
                  step={1}
                  value={[typeof answers[currentQuestion.id] === "number" ? answers[currentQuestion.id] : currentQuestion.scale.min]}
                  onValueChange={(value) => handleAnswer(value[0])}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentQuestion.scale.minLabel}</span>
                <span className="font-medium text-foreground">{answers[currentQuestion.id] || currentQuestion.scale.min}</span>
                <span>{currentQuestion.scale.maxLabel}</span>
              </div>
            </div>
          )}

          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <RadioGroup value={String(answers[currentQuestion.id] || "")} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
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
      <div className="flex gap-3 justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="ml-auto"
        >
          {currentQuestionIndex === A1_QUESTIONS.length - 1 ? (
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
