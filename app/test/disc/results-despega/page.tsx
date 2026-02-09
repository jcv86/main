"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Brain, Zap, Target, Users, Rocket, TrendingUp, Download, Share2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { DISCContextForm, type UserContext } from "@/components/disc-context-form"

interface DesperaResult {
  energia: number
  enfoque: number
  relaciones: number
  plan_ejecutivo: number
  created_at: string
}

export default function DesperaResultsPage() {
  const { user } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"
  const { toast } = useToast()

  const [resultado, setResultado] = useState<DesperaResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContextForm, setShowContextForm] = useState(false)
  const [userContext, setUserContext] = useState<UserContext | null>(null)

  useEffect(() => {
    if (!user && !isDemoMode) {
      router.push("/")
      return
    }
    loadResults()
  }, [user, router, isDemoMode])

  const loadResults = async () => {
    if (isDemoMode) {
      setResultado({
        energia: 75,
        enfoque: 65,
        relaciones: 85,
        plan_ejecutivo: 70,
        created_at: new Date().toISOString(),
      })
      setLoading(false)
      return
    }

    if (!user) return

    try {
      const result = await UnifiedTestSystem.loadTestResult(user.email!, "Despega Cerebral")

      if (result.success && result.data) {
        const scores = result.data.results

        setResultado({
          energia: scores.energia || 0,
          enfoque: scores.enfoque || 0,
          relaciones: scores.relaciones || 0,
          plan_ejecutivo: scores.plan_ejecutivo || 0,
          created_at: result.data.completed_at || new Date().toISOString(),
        })

        const context = result.data.user_context || null
        if (!context) {
          setShowContextForm(true)
        }
        setUserContext(context)
      } else {
        toast({
          title: "No hay resultados",
          description: "No se encontraron resultados del test Despega Cerebral",
          variant: "destructive",
        })
        router.push("/test/disc")
      }
    } catch (error) {
      console.error("Error loading results:", error)
      toast({
        title: "Error",
        description: "Hubo un problema cargando tus resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case "energia":
        return "from-yellow-500 to-orange-500"
      case "enfoque":
        return "from-blue-500 to-cyan-500"
      case "relaciones":
        return "from-red-500 to-pink-500"
      case "plan_ejecutivo":
        return "from-green-500 to-emerald-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case "energia":
        return <Zap className="w-5 h-5" />
      case "enfoque":
        return <Target className="w-5 h-5" />
      case "relaciones":
        return <Users className="w-5 h-5" />
      case "plan_ejecutivo":
        return <Rocket className="w-5 h-5" />
      default:
        return <TrendingUp className="w-5 h-5" />
    }
  }

  const getInsight = (dimension: string, score: number) => {
    const insights: Record<string, Record<string, string>> = {
      energia: {
        high: "Tienes excelente gestión de energía. Mantén tus hábitos consistentes y aprovecha esta energía para proyectos desafiantes.",
        medium: "Tu energía es equilibrada. Considera optimizar tu rutina de sueño, ejercicio o alimentación para potenciar aún más.",
        low: "Necesitas enfocarte en recuperar energía. Implementa rituales de descanso y cuidado personal.",
      },
      enfoque: {
        high: "Excelente capacidad de concentración. Eres muy efectivo en la ejecución de tus planes.",
        medium: "Buen enfoque general. Puedes mejorar limitando distracciones y priorizando mejor.",
        low: "Necesitas mejorar tu concentración. Implementa técnicas de gestión de atención y claridad de prioridades.",
      },
      relaciones: {
        high: "Excelentes habilidades relacionales. Eres un conector efectivo y construyes relaciones significativas.",
        medium: "Buenas relaciones. Puedes profundizar invirtiendo más tiempo en escucha auténtica.",
        low: "Oportunidad de mejorar tus conexiones. Inicia con pequeños actos de autenticidad y vulnerabilidad.",
      },
      plan_ejecutivo: {
        high: "Visión clara y ejecución efectiva. Eres muy capaz de materializar tus objetivos.",
        medium: "Buen balance entre visión y ejecución. Afina tus rituales y sistemas de medición.",
        low: "Necesitas claridad de visión. Dedica tiempo a definir tus objetivos 1, 3 y 5 años.",
      },
    }

    const level = score >= 70 ? "high" : score >= 50 ? "medium" : "low"
    return insights[dimension]?.[level] || "Continúa desarrollando esta dimensión."
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Brain className="w-12 h-12 mx-auto animate-pulse" />
          <p className="text-lg text-muted-foreground">Cargando tus resultados...</p>
        </div>
      </div>
    )
  }

  if (!resultado) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">No se pudieron cargar tus resultados.</p>
            <Button onClick={() => router.push("/test/disc")} className="w-full">
              Volver al Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/test")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Tests
          </button>
          <div className="flex items-center gap-4">
            <Brain className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Despega Cerebral</h1>
              <p className="text-sm text-muted-foreground">Tu Check-in de Autoconocimiento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { name: "Energía", key: "energia", icon: "⚡" },
            { name: "Enfoque", key: "enfoque", icon: "🎯" },
            { name: "Relaciones", key: "relaciones", icon: "🤝" },
            { name: "Plan Ejecutivo", key: "plan_ejecutivo", icon: "🚀" },
          ].map((dimension) => {
            const score = resultado[dimension.key as keyof DesperaResult] as number
            return (
              <Card key={dimension.key} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{dimension.name}</CardTitle>
                    <span className="text-2xl">{dimension.icon}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{score}%</div>
                  <Progress value={score} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {score >= 70 ? "Alto" : score >= 50 ? "Medio" : "Bajo"}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Insights */}
        <Tabs defaultValue="energia" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="energia">Energía</TabsTrigger>
            <TabsTrigger value="enfoque">Enfoque</TabsTrigger>
            <TabsTrigger value="relaciones">Relaciones</TabsTrigger>
            <TabsTrigger value="plan_ejecutivo">Plan Ejecutivo</TabsTrigger>
          </TabsList>

          {[
            { key: "energia", name: "Energía", description: "Cómo gestiones tu energía vital" },
            { key: "enfoque", name: "Enfoque", description: "Tu capacidad de concentración y ejecución" },
            { key: "relaciones", name: "Relaciones", description: "Calidad de tus conexiones interpersonales" },
            {
              key: "plan_ejecutivo",
              name: "Plan Ejecutivo",
              description: "Tu capacidad de visión y ejecución a largo plazo",
            },
          ].map((dimension) => {
            const score = resultado[dimension.key as keyof DesperaResult] as number
            return (
              <TabsContent key={dimension.key} value={dimension.key}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getDimensionIcon(dimension.key)}
                      {dimension.name}
                    </CardTitle>
                    <CardDescription>{dimension.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Tu Score</span>
                        <span className="text-2xl font-bold">{score}%</span>
                      </div>
                      <Progress value={score} className="h-3" />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="mt-2">
                        {getInsight(dimension.key, score)}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Recomendaciones</h4>
                      <ul className="space-y-2 text-sm">
                        {dimension.key === "energia" && (
                          <>
                            <li>✓ Prioriza 7-8 horas de sueño consistente</li>
                            <li>✓ Ejercitate 3-4 veces por semana</li>
                            <li>✓ Toma descansos estratégicos durante el día</li>
                          </>
                        )}
                        {dimension.key === "enfoque" && (
                          <>
                            <li>✓ Define tus 3 prioridades claras diarias</li>
                            <li>✓ Desactiva notificaciones durante trabajo profundo</li>
                            <li>✓ Implementa bloques de tiempo sin interrupciones</li>
                          </>
                        )}
                        {dimension.key === "relaciones" && (
                          <>
                            <li>✓ Dedica tiempo a escucha auténtica</li>
                            <li>✓ Expresa gratitud regularmente</li>
                            <li>✓ Sé vulnerable y auténtico en tus conexiones</li>
                          </>
                        )}
                        {dimension.key === "plan_ejecutivo" && (
                          <>
                            <li>✓ Define visión clara para 1, 3 y 5 años</li>
                            <li>✓ Alinea decisiones diarias con objetivos</li>
                            <li>✓ Mide progreso semanalmente</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="lg" className="gap-2">
            <Download className="w-4 h-4" />
            Descargar Reporte
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Share2 className="w-4 h-4" />
            Compartir Resultados
          </Button>
          <Button size="lg" onClick={() => router.push("/coaching")} className="gap-2">
            <Rocket className="w-4 h-4" />
            Ver Plan 90 Días
          </Button>
        </div>
      </div>
    </div>
  )
}
