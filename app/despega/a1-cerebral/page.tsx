"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import A1DiagnosticTest from "@/components/a1-diagnostic-test"
import { PersonalizedActionPlan } from "@/components/a1-personalized-action-plan"
import { saveA1TestResults } from "@/lib/despega/actions"

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

  // Show diagnostic test if no results yet
  if (!a1Results && stage === "test") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                🧠
              </div>
              <div>
                <h1 className="text-2xl font-bold">A1 Despega Cerebral - Diagnóstico</h1>
                <p className="text-muted-foreground">Responde 20 preguntas para identificar tus áreas de oportunidad</p>
              </div>
            </div>
          </div>

          <A1DiagnosticTest onComplete={handleTestComplete} />
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
