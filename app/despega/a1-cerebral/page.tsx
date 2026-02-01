"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { PersonalizedActionPlan } from "@/components/a1-personalized-action-plan"
import { saveA1TestResults } from "@/lib/despega/actions"

// All 20 A1 Questions - INLINE
const A1_QUESTIONS = [
  { id: 1, area: "energia", type: "scale", text: "¿Cuántas horas duermes por noche?", min: 4, max: 10, minLabel: "4 horas", maxLabel: "10 horas" },
  { id: 2, area: "energia", type: "multiple", text: "¿Cómo describes tu energía general?", options: ["Muy baja", "Baja", "Normal", "Buena", "Excelente"] },
  { id: 3, area: "energia", type: "multiple", text: "¿Con qué frecuencia haces ejercicio?", options: ["Nunca", "1-2 veces/semana", "3-4 veces/semana", "5-6 veces/semana", "Diariamente"] },
  { id: 4, area: "energia", type: "scale", text: "¿Qué tan consistente es tu rutina de sueño?", min: 1, max: 10, minLabel: "Inconsistente", maxLabel: "Muy consistente" },
  { id: 5, area: "energia", type: "scale", text: "¿Cuánta hidratación diaria tienes?", min: 0, max: 10, minLabel: "Casi nada", maxLabel: "10+ vasos" },
  
  { id: 6, area: "enfoque", type: "multiple", text: "¿Cuánto tiempo puedes concentrarte profundamente?", options: ["< 15 min", "15-30 min", "30-60 min", "1-2 horas", "> 2 horas"] },
  { id: 7, area: "enfoque", type: "multiple", text: "¿Con qué frecuencia revisas notificaciones?", options: ["Constantemente", "Cada 5-10 min", "Cada 15-30 min", "Ocasionalmente", "Casi nunca"] },
  { id: 8, area: "enfoque", type: "scale", text: "¿Cuántas tareas principales completas diariamente?", min: 1, max: 10, minLabel: "1 tarea", maxLabel: "10+ tareas" },
  { id: 9, area: "enfoque", type: "scale", text: "¿Qué tan claro tienes tu plan diario?", min: 1, max: 10, minLabel: "Muy confuso", maxLabel: "Muy claro" },
  { id: 10, area: "enfoque", type: "multiple", text: "¿Cuánto tiempo pierdes en tareas no prioritarias?", options: ["> 50%", "30-50%", "20-30%", "10-20%", "< 10%"] },
  
  { id: 11, area: "relaciones", type: "multiple", text: "¿Con qué frecuencia contactas amigos/colegas?", options: ["Casi nunca", "Mensual", "Quincenal", "Semanal", "Varias veces/semana"] },
  { id: 12, area: "relaciones", type: "scale", text: "¿Cómo describes tu escucha activa?", min: 1, max: 10, minLabel: "Pienso en mi respuesta", maxLabel: "Escucho realmente" },
  { id: 13, area: "relaciones", type: "multiple", text: "¿Cuántas relaciones profesionales significativas tienes?", options: ["Ninguna", "1-3", "4-8", "9-15", "> 15"] },
  { id: 14, area: "relaciones", type: "scale", text: "¿Facilidad para expresar gratitud?", min: 1, max: 10, minLabel: "Me cuesta", maxLabel: "Facilidad" },
  { id: 15, area: "relaciones", type: "scale", text: "¿Comodidad pidiendo ayuda?", min: 1, max: 10, minLabel: "Muy incómodo", maxLabel: "Muy cómodo" },
  
  { id: 16, area: "plan_ejecutivo", type: "scale", text: "¿Claridad sobre tus metas principales?", min: 1, max: 10, minLabel: "Confuso", maxLabel: "Cristal claro" },
  { id: 17, area: "plan_ejecutivo", type: "multiple", text: "¿Con qué frecuencia planificas tu semana?", options: ["Nunca", "Ocasionalmente", "Semanalmente", "2x/semana", "Diariamente"] },
  { id: 18, area: "plan_ejecutivo", type: "scale", text: "¿Cuántas decisiones importantes tomas/semana?", min: 0, max: 20, minLabel: "Ninguna", maxLabel: "Muchas (20+)" },
  { id: 19, area: "plan_ejecutivo", type: "multiple", text: "¿Qué tan bien ejecutas lo que planificas?", options: ["Muy mal", "Mal", "Regular", "Bien", "Excelente"] },
  { id: 20, area: "plan_ejecutivo", type: "multiple", text: "¿Tienes un ritual matutino?", options: ["No", "Irregular", "Sí (5-10 min)", "Sí (10-30 min)", "Sí (30+ min)"] },
]

// Phase 4: Context Capture Component (PHASE 4)
function ContextCaptureScreen({ onContinue }: { onContinue: (context: any) => void }) {
  const [shiftWorker, setShiftWorker] = useState(false)
  const [caregiving, setCaregiving] = useState(false)
  const [neurodiversity, setNeurodiversity] = useState(false)

  const handleContinue = () => {
    onContinue({ shiftWorker, caregiving, neurodiversity })
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle>Contexto Importante</CardTitle>
        <CardDescription>
          Esto ayuda a que las misiones sean más relevantes para TI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge>{shiftWorker ? "✓" : "○"}</Badge>
            <label className="text-sm font-medium cursor-pointer">
              Trabajo por turnos o horarios irregulares
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Badge>{caregiving ? "✓" : "○"}</Badge>
            <label className="text-sm font-medium cursor-pointer">
              Tengo responsabilidades de cuidado
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Badge>{neurodiversity ? "✓" : "○"}</Badge>
            <label className="text-sm font-medium cursor-pointer">
              Neurodivergencia (TDAH, autismo, etc.)
            </label>
          </div>
        </div>
        <Button onClick={handleContinue} className="w-full">
          Comenzar Diagnóstico
        </Button>
      </CardContent>
    </Card>
  )
}

const PAQUETES_A1 = [
  {
    id: "energia",
    name: "Energía",
    description: "Sueño, hábitos base, vitalidad y consistencia",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-800",
    camino: "persona",
    acciones: [
      { dia: 1, titulo: "Establecer hora de dormir fija", descripcion: "Define tu hora de acostarte y despertarte", puntos: 10 },
      { dia: 2, titulo: "Hidratación matutina", descripcion: "Bebe un vaso de agua al despertar", puntos: 10 },
      { dia: 3, titulo: "Eliminar pantallas 1h antes de dormir", descripcion: "Reduce exposición a luz azul", puntos: 15 },
      { dia: 4, titulo: "Crear rutina de relajación nocturna", descripcion: "10 minutos de lectura o meditación", puntos: 15 },
      { dia: 5, titulo: "Evaluar calidad del sueño", descripcion: "Registra cómo dormiste esta semana", puntos: 20 },
    ],
  },
  {
    id: "enfoque",
    name: "Enfoque",
    description: "Foco, atención, productividad y sistema semanal",
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-800",
    camino: "ambos",
    acciones: [
      { dia: 1, titulo: "Definir 3 prioridades del día", descripcion: "Identifica las 3 tareas más importantes", puntos: 10 },
      { dia: 2, titulo: "Bloquear tiempo de concentración", descripcion: "2 horas sin interrupciones", puntos: 15 },
      { dia: 3, titulo: "Desactivar notificaciones", descripcion: "Elimina distracciones digitales", puntos: 10 },
      { dia: 4, titulo: "Técnica Pomodoro", descripcion: "25 min trabajo + 5 min descanso", puntos: 15 },
      { dia: 5, titulo: "Revisión semanal", descripcion: "Evalúa tu semana y planifica la siguiente", puntos: 20 },
    ],
  },
  {
    id: "relaciones",
    name: "Relaciones",
    description: "Comunicación, vínculos y networking",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
    textColor: "text-orange-800",
    camino: "persona",
    acciones: [
      { dia: 1, titulo: "Contactar a 1 persona importante", descripcion: "Envía un mensaje a alguien que valoras", puntos: 10 },
      { dia: 2, titulo: "Practicar escucha activa", descripcion: "En tu próxima conversación, solo escucha", puntos: 15 },
      { dia: 3, titulo: "Expresar gratitud", descripcion: "Agradece a alguien específicamente", puntos: 10 },
      { dia: 4, titulo: "Pedir feedback", descripcion: "Solicita retroalimentación honesta", puntos: 15 },
      { dia: 5, titulo: "Planificar conexión semanal", descripcion: "Agenda tiempo para relaciones importantes", puntos: 20 },
    ],
  },
  {
    id: "plan_ejecutivo",
    name: "Plan Ejecutivo",
    description: "Ejecución, prioridades, decisiones y rituales",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-800",
    camino: "profesional",
    acciones: [
      { dia: 1, titulo: "Definir objetivo semanal", descripcion: "1 meta clara y medible para la semana", puntos: 10 },
      { dia: 2, titulo: "Crear checklist diario", descripcion: "Lista de tareas con prioridades", puntos: 10 },
      { dia: 3, titulo: "Eliminar 1 tarea innecesaria", descripcion: "Identifica qué puedes dejar de hacer", puntos: 15 },
      { dia: 4, titulo: "Implementar ritual matutino", descripcion: "30 min de preparación mental", puntos: 15 },
      { dia: 5, titulo: "Revisar y ajustar plan", descripcion: "Evalúa progreso y ajusta estrategia", puntos: 20 },
    ],
  },
]

export default function A1CerebralPage() {
  const [loading, setLoading] = useState(true)
  const [a1Results, setA1Results] = useState<any>(null)
  const [pilarProgress, setPilarProgress] = useState<any>(null)
  const [completedAcciones, setCompletedAcciones] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [stage, setStage] = useState<"context" | "test" | "results" | "actions">("context")
  const [testInProgress, setTestInProgress] = useState(false)
  const [contextData, setContextData] = useState<any>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      setUserId(user.id)

      const { data: a1Data } = await supabase
        .from("despega_a1_test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (a1Data) {
        setA1Results(a1Data)
        // If results exist, skip to results screen
        setStage("results")
      } else {
        // No results yet, auto-advance to test (skip context screen)
        setStage("test")
      }

      const { data: progressData } = await supabase
        .from("despega_pilar_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("pilar", "a1_cerebral")
        .single()

      if (progressData) setPilarProgress(progressData)

      // Load completed acciones
      const { data: misionesData } = await supabase
        .from("despega_user_misiones")
        .select("mision_id")
        .eq("user_id", user.id)
        .eq("completed", true)

      if (misionesData) {
        setCompletedAcciones(new Set(misionesData.map(m => m.mision_id)))
      }

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const handleTestComplete = async (testResults: any) => {
    setTestInProgress(true)
    try {
      await saveA1TestResults(
        testResults.respuestas,
        testResults.resultados,
        testResults.diagnostico
      )
      setA1Results(testResults.resultados)
      setStage("results")
    } catch (error) {
      console.error("Error saving test results:", error)
    } finally {
      setTestInProgress(false)
    }
  }

  const handleStartPillar = (pilarId: string) => {
    setStage("actions")
    // Could navigate to the specific pillar here
  }

  const handleCompleteAccion = async (paqueteId: string, dia: number, puntos: number) => {
    if (!userId) return
    
    const misionId = `a1_${paqueteId}_dia${dia}`
    
    // Mark as completed
    await supabase.from("despega_user_misiones").upsert({
      user_id: userId,
      mision_id: misionId,
      completed: true,
      completed_at: new Date().toISOString(),
      puntos_earned: puntos,
    })

    // Update progress
    const newProgress = (pilarProgress?.progreso || 0) + 2
    const newScore = (pilarProgress?.score || 0) + puntos

    await supabase.from("despega_pilar_progress").upsert({
      user_id: userId,
      pilar: "a1_cerebral",
      progreso: Math.min(newProgress, 100),
      score: newScore,
    })

    // Update rankings
    await supabase.from("despega_rankings").upsert({
      user_id: userId,
      score_pilar_a1: newScore,
    })

    setCompletedAcciones(prev => new Set([...prev, misionId]))
    setPilarProgress((prev: any) => ({ ...prev, progreso: Math.min(newProgress, 100), score: newScore }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  // Show context capture if not captured yet (SKIP THIS - go straight to test)
  // Removed: if (!contextData && stage === "context") { ... }

  // Show diagnostic test if no results yet - INLINE RENDERING
  if (!a1Results && stage === "test") {
    const curr = A1_QUESTIONS[currentIdx]
    const answered = answers[curr.id] !== undefined
    const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100

    const handleAnswer = (value: any) => {
      setAnswers(prev => ({ ...prev, [curr.id]: value }))
    }

    const handleNext = async () => {
      if (currentIdx < A1_QUESTIONS.length - 1) {
        setCurrentIdx(currentIdx + 1)
      } else {
        setStage("results")
        setA1Results(answers)
        if (userId) await saveA1TestResults(userId, answers, pilarProgress)
      }
    }

    const handlePrevious = () => {
      if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>

          <h1 className="text-3xl font-bold mb-2">Despega Cerebral</h1>
          <p className="text-muted-foreground mb-8">Pregunta {currentIdx + 1} de {A1_QUESTIONS.length}</p>

          <Progress value={progress} className="mb-8 h-3" />

          <Card className="mb-8 border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={`capitalize font-semibold px-3 py-1 ${
                  curr.area === "energia" ? "bg-blue-100 text-blue-900" :
                  curr.area === "enfoque" ? "bg-green-100 text-green-900" :
                  curr.area === "relaciones" ? "bg-orange-100 text-orange-900" :
                  "bg-purple-100 text-purple-900"
                }`}>
                  {curr.area === "energia" ? "Energía" :
                   curr.area === "enfoque" ? "Enfoque" :
                   curr.area === "relaciones" ? "Relaciones" :
                   "Plan Ejecutivo"}
                </Badge>
                <span className="text-sm font-semibold text-gray-600">{currentIdx + 1}/{A1_QUESTIONS.length}</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{curr.text}</CardTitle>
            </CardHeader>

            <CardContent className="pt-8 pb-8">
              {curr.type === "scale" && (
                <div className="space-y-8">
                  <Slider
                    min={curr.min}
                    max={curr.max}
                    step={1}
                    value={[answers[curr.id] || curr.min]}
                    onValueChange={(v) => handleAnswer(v[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">{curr.minLabel}</span>
                    <span className="text-2xl font-bold text-blue-600">{answers[curr.id] || curr.min}</span>
                    <span className="font-medium text-gray-600">{curr.maxLabel}</span>
                  </div>
                </div>
              )}

              {curr.type === "multiple" && (
                <RadioGroup value={String(answers[curr.id] || "")} onValueChange={handleAnswer}>
                  <div className="space-y-3">
                    {curr.options?.map((opt, i) => (
                      <div key={i} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
                        <RadioGroupItem value={opt} id={`opt-${i}`} />
                        <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-medium text-gray-800">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handlePrevious} disabled={currentIdx === 0} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <Button onClick={handleNext} disabled={!answered} className="flex-1">
              {currentIdx === A1_QUESTIONS.length - 1 ? (
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
      </div>
    )
  }

  // Show action plan after test completion
  if (a1Results && stage === "results") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>

          <PersonalizedActionPlan results={a1Results} onStartPillar={handleStartPillar} />
        </div>
      </div>
    )
  }

  // Show action execution view

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
              🧠
            </div>
            <div>
              <h1 className="text-2xl font-bold">A1 Despega Cerebral</h1>
              <p className="text-muted-foreground">Diagnóstico base y acciones fundamentales</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold">{pilarProgress?.progreso || 0}%</div>
                <div className="text-sm text-muted-foreground">Progreso</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{pilarProgress?.score || 0}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Día {pilarProgress?.ciclo_dia || 1}</div>
                <div className="text-sm text-muted-foreground">Ciclo {pilarProgress?.ciclo_actual || 30}</div>
              </div>
            </div>
            <Progress value={pilarProgress?.progreso || 0} className="h-3" />
          </CardContent>
        </Card>

        {/* Diagnóstico Resumen */}
        {a1Results && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tu Diagnóstico</CardTitle>
              <CardDescription>Áreas de oportunidad detectadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Energía", score: a1Results.score_energia, color: "bg-blue-500" },
                  { name: "Enfoque", score: a1Results.score_enfoque, color: "bg-green-500" },
                  { name: "Relaciones", score: a1Results.score_relaciones, color: "bg-orange-500" },
                  { name: "Plan Ejecutivo", score: a1Results.score_plan_ejecutivo, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className={`font-medium ${item.score < 50 ? "text-red-500" : item.score < 70 ? "text-yellow-500" : "text-green-500"}`}>
                        {item.score}%
                      </span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paquetes de Acción */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Paquetes de Acción</h2>
          <Tabs defaultValue="energia" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {PAQUETES_A1.map((paquete) => (
                <TabsTrigger key={paquete.id} value={paquete.id} className="text-xs md:text-sm">
                  {paquete.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {PAQUETES_A1.map((paquete) => (
              <TabsContent key={paquete.id} value={paquete.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{paquete.name}</CardTitle>
                        <CardDescription>{paquete.description}</CardDescription>
                      </div>
                      <Badge className={`${paquete.lightColor} ${paquete.textColor} border-0`}>
                        {paquete.camino === "ambos" ? "Ambos Caminos" : `Camino ${paquete.camino.charAt(0).toUpperCase() + paquete.camino.slice(1)}`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {paquete.acciones.map((accion) => {
                        const misionId = `a1_${paquete.id}_dia${accion.dia}`
                        const isCompleted = completedAcciones.has(misionId)
                        
                        return (
                          <div 
                            key={accion.dia} 
                            className={`p-4 border rounded-lg ${isCompleted ? "bg-green-50 border-green-200" : "bg-background"}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">Día {accion.dia}</Badge>
                                  <span className="font-medium">{accion.titulo}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{accion.descripcion}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-primary">+{accion.puntos} pts</span>
                                {isCompleted ? (
                                  <Badge className="bg-green-500">Completado</Badge>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleCompleteAccion(paquete.id, accion.dia, accion.puntos)}
                                  >
                                    Completar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
