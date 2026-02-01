"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TestIntroScreen } from "@/components/test-intro-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

// ALL 20 QUESTIONS
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

export default function A1CerebralPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stage, setStage] = useState<"intro" | "test" | "results">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userLevel, setUserLevel] = useState<"principiante" | "intermedio" | "avanzado" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user and their level
  useEffect(() => {
    const loadUserLevel = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        setUserId(user.id)

        // Try to get user level from previous test results
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
          // Default to principiante if no previous test
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
  }, [])

  const getRecommendationsByLevel = (area: string, score: number) => {
    const recommendations = {
      energia: {
        principiante: [
          "Comienza con una rutina básica de sueño: acuéstate y levántate a la misma hora.",
          "Intenta una actividad física ligera 2-3 veces por semana (caminar, yoga).",
          "Bebe agua regularmente durante el día - es el paso más simple.",
          "Evita pantallas 30 minutos antes de dormir.",
        ],
        intermedio: [
          "Optimiza tu sueño: apunta a 7-8 horas consistentes.",
          "Aumenta el ejercicio a 4-5 veces por semana con intensidad moderada.",
          "Monitorea tu hidratación - establece recordatorios cada 2 horas.",
          "Crea una rutina pre-sueño de 45 minutos sin distracciones.",
        ],
        avanzado: [
          "Experimenta con ciclos de sueño (siesta estratégica de 20-30 min).",
          "Integra entrenamiento de fuerza y cardio balanceados.",
          "Optimiza nutrición alrededor de tu energía pico.",
          "Usa tracking de sueño para identificar patrones y mejoras.",
        ],
      },
      enfoque: {
        principiante: [
          "Empieza identificando tu 1-2 tareas IMPORTANTES cada día.",
          "Trabaja 25 minutos sin distracciones (técnica Pomodoro).",
          "Apaga notificaciones durante bloques de trabajo.",
          "Anota tu plan cada mañana en un papel o app simple.",
        ],
        intermedio: [
          "Implementa bloques de tiempo de 90 minutos para trabajo profundo.",
          "Revisa notificaciones solo a horas específicas (9am, 12pm, 3pm).",
          "Prioriza 3-5 tareas principales cada semana.",
          "Usa un calendario visual para planificación semanal.",
        ],
        avanzado: [
          "Diseña un sistema personal de priorización (matriz Eisenhower).",
          "Alcanza 3-4 horas de trabajo profundo sin interrupciones.",
          "Automatiza notificaciones - solo recibe lo crítico.",
          "Analiza tu productividad semanal y ajusta el sistema.",
        ],
      },
      relaciones: {
        principiante: [
          "Establece 1 llamada mensual con un colega o mentor.",
          "Practica escucha activa: haz preguntas y espera respuestas.",
          "Envía 3 mensajes de agradecimiento este mes.",
          "Únete a 1 evento social o networking mensual.",
        ],
        intermedio: [
          "Mantén contacto semanal con 2-3 colegas clave.",
          "Practica empatía: entiende el contexto antes de responder.",
          "Ofrece ayuda específica sin esperar retorno inmediato.",
          "Participa activamente en 1-2 grupos o comunidades.",
        ],
        avanzado: [
          "Cultiva una red de 10+ relaciones profesionales profundas.",
          "Mentorea a otros - es la mejor forma de aprender.",
          "Crea un sistema de seguimiento de relaciones (CRM personal).",
          "Organiza eventos o encuentros que agreguen valor a otros.",
        ],
      },
      plan_ejecutivo: {
        principiante: [
          "Escribe 1 meta clara para los próximos 90 días.",
          "Planifica tu semana el domingo (30 minutos).",
          "Haz 1 decisión importante por semana conscientemente.",
          "Crea un ritual matutino simple de 10 minutos.",
        ],
        intermedio: [
          "Define 3 metas principales con sub-tareas para cada una.",
          "Planifica diariamente cada mañana (15 minutos).",
          "Toma decisiones basadas en datos/hechos, no emociones.",
          "Ritual matutino de 20-30 minutos que te enfoque.",
        ],
        avanzado: [
          "Sistema de OKRs: Objetivos + Key Results trimestrales.",
          "Revisión diaria de plan + ajustes en tiempo real.",
          "Decide rápido pero revisa resultados sistemáticamente.",
          "Ritual matutino personalizado de 45+ minutos.",
        ],
      },
    }

    return recommendations[area as keyof typeof recommendations]?.[userLevel as keyof any] || []
  }

  const getLevelBadge = () => {
    const badges = {
      principiante: { bg: "bg-blue-100", text: "text-blue-900", label: "Principiante" },
      intermedio: { bg: "bg-amber-100", text: "text-amber-900", label: "Intermedio" },
      avanzado: { bg: "bg-green-100", text: "text-green-900", label: "Avanzado" },
    }
    return badges[userLevel as keyof typeof badges] || badges.principiante
  }

  const handleStartTest = () => {
    setStage("test")
    setCurrentIdx(0)
    setAnswers({})
  }

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStage("results")
    } finally {
      setIsSubmitting(false)
    }
  }

  const areaColors = {
    energia: "bg-blue-100 text-blue-900",
    enfoque: "bg-green-100 text-green-900",
    relaciones: "bg-orange-100 text-orange-900",
    plan_ejecutivo: "bg-purple-100 text-purple-900",
  }

  const areaLabels = {
    energia: "Energía",
    enfoque: "Enfoque",
    relaciones: "Relaciones",
    plan_ejecutivo: "Plan Ejecutivo",
  }

  const question = A1_QUESTIONS[currentIdx]
  const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100
  const isAnswered = question && answers[question.id] !== undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  // STAGE 1: INTRO
  if (stage === "intro") {
    return (
      <TestIntroScreen
        testName="Despega Cerebral™"
        testDescription="Tu Perfil de Comportamiento Profesional"
        whatItMeasures={[
          "Tu estilo de comportamiento natural en el trabajo",
          "Preferencias de comunicación y toma de decisiones",
          "4 dimensiones clave: Dominancia, Influencia, Estabilidad y Cumplimiento",
          "Fortalezas naturales y áreas de desarrollo",
        ]}
        whyRelevant="Entender tu estilo DISC te ayuda a comunicarte mejor, elegir roles que alineen con tus fortalezas naturales y desarrollar competencias complementarias."
        estimatedTime={15}
        totalQuestions={20}
        onStart={handleStartTest}
      />
    )
  }

  // STAGE 2: TEST
  if (stage === "test") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => router.push("/despega")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Badge className={`capitalize font-semibold px-3 py-1 ${areaColors[question.area as keyof typeof areaColors]}`}>
              {areaLabels[question.area as keyof typeof areaLabels]}
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
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">{currentIdx + 1}/{A1_QUESTIONS.length}</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              {question.type === "scale" && (
                <div className="space-y-8">
                  <Slider
                    min={question.min}
                    max={question.max}
                    step={1}
                    value={[answers[question.id] || question.min]}
                    onValueChange={(v) => handleAnswer(v[0])}
                    className="w-full"
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
                onClick={handleNext}
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
            <p className="text-sm text-gray-600">
              {Object.keys(answers).length} de {A1_QUESTIONS.length} respondidas
            </p>
          </div>
        </div>
      </div>
    )
  }

  // STAGE 3: RESULTS - Calculate and display analysis
  const calculateResults = () => {
    const areas = { energia: [], enfoque: [], relaciones: [], plan_ejecutivo: [] }
    
    // Group answers by area
    A1_QUESTIONS.forEach(q => {
      const answer = answers[q.id]
      if (answer !== undefined) {
        let score = 0
        
        if (q.type === "scale") {
          // Normalize scale to 0-100
          score = ((answer - q.min) / (q.max - q.min)) * 100
        } else {
          // Multiple choice: use index as score (0-100 based on 5 options)
          const index = q.options?.indexOf(answer) || 0
          score = (index / (q.options?.length || 1 - 1)) * 100
        }
        
        areas[q.area as keyof typeof areas].push(score)
      }
    })
    
    // Calculate averages per area
    const results = {
      energia: areas.energia.length > 0 ? areas.energia.reduce((a, b) => a + b) / areas.energia.length : 0,
      enfoque: areas.enfoque.length > 0 ? areas.enfoque.reduce((a, b) => a + b) / areas.enfoque.length : 0,
      relaciones: areas.relaciones.length > 0 ? areas.relaciones.reduce((a, b) => a + b) / areas.relaciones.length : 0,
      plan_ejecutivo: areas.plan_ejecutivo.length > 0 ? areas.plan_ejecutivo.reduce((a, b) => a + b) / areas.plan_ejecutivo.length : 0,
    }
    
    return results
  }

  const results = calculateResults()
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1])
  const strongest = sorted[0]
  const needsWork = sorted[sorted.length - 1]

  const areaBgColors = {
    energia: "bg-blue-50 border-blue-200",
    enfoque: "bg-green-50 border-green-200",
    relaciones: "bg-orange-50 border-orange-200",
    plan_ejecutivo: "bg-purple-50 border-purple-200",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">¡Test Completado!</h1>
          <p className="text-lg text-gray-600">Aquí está tu análisis personalizado</p>
        </div>

        {/* Results Summary */}
        <Card className="mb-8 shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-2xl">Tu Perfil Cerebral</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-6">
              {Object.entries(results).map(([area, score]) => (
                <div key={area}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold ${areaColors[area as keyof typeof areaColors]}`}>
                      {areaLabels[area as keyof typeof areaLabels]}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">{Math.round(score)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        area === "energia" ? "bg-blue-500" :
                        area === "enfoque" ? "bg-green-500" :
                        area === "relaciones" ? "bg-orange-500" :
                        "bg-purple-500"
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Level Badge */}
        <div className="mb-8 text-center">
          <Badge className={`px-4 py-2 text-base ${getLevelBadge().bg} ${getLevelBadge().text}`}>
            Tu Nivel: {getLevelBadge().label}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">Las recomendaciones están adaptadas a tu nivel</p>
        </div>

        {/* Personalized Recommendations by Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recomendaciones Personalizadas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(results).map(([area, score]) => (
              <Card key={area} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{areaLabels[area as keyof typeof areaLabels]}</CardTitle>
                    <Badge className={areaColors[area as keyof typeof areaColors]}>
                      {Math.round(score)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {getRecommendationsByLevel(area, score).map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strength & Growth Area */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strength */}
          <Card className={`border-2 ${areaBgColors[strongest[0] as keyof typeof areaBgColors]}`}>
            <CardHeader>
              <CardTitle className="text-lg">Tu Fortaleza</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={areaColors[strongest[0] as keyof typeof areaColors]}>
                  {areaLabels[strongest[0] as keyof typeof areaLabels]}
                </Badge>
              </div>
              <p className="text-gray-700 font-semibold">{Math.round(strongest[1])}% de desempeño</p>
              <p className="text-sm text-gray-600 mt-2">
                {strongest[0] === "energia" && "¡Excelente gestión de tu energía y bienestar! Mantén estas prácticas de sueño, ejercicio e hidratación."}
                {strongest[0] === "enfoque" && "¡Tu concentración es excepcional! Sabes cómo manejar las distracciones y completar tareas importantes."}
                {strongest[0] === "relaciones" && "¡Eres un excelente comunicador! Tus relaciones profesionales son un gran activo."}
                {strongest[0] === "plan_ejecutivo" && "¡Tu capacidad de ejecución es destacada! Sabes planificar y llevar a cabo tus objetivos."}
              </p>
            </CardContent>
          </Card>

          {/* Area for Growth */}
          <Card className={`border-2 ${areaBgColors[needsWork[0] as keyof typeof areaBgColors]}`}>
            <CardHeader>
              <CardTitle className="text-lg">Área de Oportunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={areaColors[needsWork[0] as keyof typeof areaColors]}>
                  {areaLabels[needsWork[0] as keyof typeof areaLabels]}
                </Badge>
              </div>
              <p className="text-gray-700 font-semibold">{Math.round(needsWork[1])}% de desempeño</p>
              <p className="text-sm text-gray-600 mt-2">
                {needsWork[0] === "energia" && "Enfócate en mejorar tu sueño, actividad física e hidratación para optimizar tu energía."}
                {needsWork[0] === "enfoque" && "Trabaja en minimizar distracciones y mejorar tu capacidad de concentración profunda."}
                {needsWork[0] === "relaciones" && "Invierte más tiempo en construir relaciones profesionales significativas."}
                {needsWork[0] === "plan_ejecutivo" && "Desarrolla un plan claro y un sistema de seguimiento para mejorar tu ejecución."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push("/despega")}
            size="lg"
            className="px-8"
          >
            Volver al Dashboard
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Tus respuestas han sido guardadas. Consulta tu perfil completo en el dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
