"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Lock, Zap } from "lucide-react"
import { A3ScenarioSimulator } from "@/components/a3-scenario-simulator"

const RUTAS = [
  {
    id: "energia",
    name: "Ruta Energía",
    description: "Optimiza tu vitalidad física y mental",
    icon: "⚡",
    color: "bg-yellow-500",
    lightColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    camino: "persona",
    temas: ["Sueño reparador", "Nutrición energética", "Ejercicio estratégico", "Gestión del estrés"],
    librosRelacionados: ["Atomic Habits", "The Power of Full Engagement", "Why We Sleep"],
  },
  {
    id: "enfoque",
    name: "Ruta Enfoque",
    description: "Domina tu atención y productividad",
    icon: "🎯",
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-800",
    camino: "ambos",
    temas: ["Deep Work", "Eliminación de distracciones", "Sistema de prioridades", "Bloques de tiempo"],
    librosRelacionados: ["Deep Work", "Getting Things Done", "Essentialism"],
  },
  {
    id: "relaciones",
    name: "Ruta Relaciones",
    description: "Construye conexiones significativas",
    icon: "🤝",
    color: "bg-pink-500",
    lightColor: "bg-pink-100",
    textColor: "text-pink-800",
    camino: "persona",
    temas: ["Comunicación efectiva", "Networking estratégico", "Resolución de conflictos", "Liderazgo relacional"],
    librosRelacionados: ["How to Win Friends", "Crucial Conversations", "Never Split the Difference"],
  },
  {
    id: "plan_ejecutivo",
    name: "Ruta Plan Ejecutivo",
    description: "Ejecuta con precisión y consistencia",
    icon: "📋",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-800",
    camino: "profesional",
    temas: ["Planificación estratégica", "Toma de decisiones", "Rituales de alto rendimiento", "Revisión semanal"],
    librosRelacionados: ["The 7 Habits", "The Goal", "Thinking Fast and Slow"],
  },
]

export default function RutasPage() {
  const [loading, setLoading] = useState(true)
  const [rutasProgress, setRutasProgress] = useState<Record<string, number>>({})
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedScenario, setSelectedScenario] = useState<any>(null)
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("a2")
  const supabase = createClient()

  // Sample A3 scenarios
  const A3_SCENARIOS = [
    {
      id: "escenario_enfoque_1",
      titulo: "Reunión Excesiva",
      contexto: "Tu equipo está en 5 reuniones simultáneas y nadie está haciendo trabajo profundo.",
      tipo: "decision",
      nivel: "intermedio",
      puntos: 25,
      decisiones: [
        {
          id: "opt_1",
          text: "Cancelar todas las reuniones innecesarias",
          description: "Decisión radical pero efectiva",
          outcome: "Algunos equipos se sienten frustrados, pero la productividad aumenta 40%",
          score_impact: 20,
          reasoning: "Buen instinto, pero falta diplomacia. Mejor comunicar gradualmente."
        },
        {
          id: "opt_2",
          text: "Crear 'Deep Work Hours' sin reuniones",
          description: "Establecer bloques protegidos de enfoque",
          outcome: "Todos adaptan gradualmente. Productividad aumenta 25% sin conflictos.",
          score_impact: 25,
          reasoning: "Excelente balance entre efectividad y relaciones. Este es el enfoque recomendado."
        },
      ],
      metricas_exito: [
        { label: "Productividad", description: "Aumento en trabajo profundo completado", weight: 0.4 },
        { label: "Moral del equipo", description: "Satisfacción con cambios", weight: 0.3 },
      ]
    },
    {
      id: "escenario_relaciones_1",
      titulo: "Conflicto entre Colegas",
      contexto: "Dos miembros clave del equipo tienen desacuerdo sobre la dirección del proyecto.",
      tipo: "negociacion",
      nivel: "intermedio",
      puntos: 30,
      decisiones: [
        {
          id: "opt_1",
          text: "Escuchar a ambos por separado",
          description: "Entendimiento individual antes de negociación",
          outcome: "Ambos se sienten escuchados. Identificas el verdadero problema subyacente.",
          score_impact: 25,
          reasoning: "Excelente comunicación empática. Siempre escucha primero antes de decidir."
        },
      ],
      metricas_exito: [
        { label: "Resolución", description: "Problema efectivamente resuelto", weight: 0.35 },
        { label: "Relaciones", description: "Confianza entre las partes", weight: 0.35 },
      ]
    },
  ]

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData) setUserProfile(profileData)

      const { data: progressData } = await supabase
        .from("despega_user_ruta_progress")
        .select("*")
        .eq("user_id", user.id)

      if (progressData) {
        const progressMap: Record<string, number> = {}
        progressData.forEach((p: any) => {
          progressMap[p.ruta_id] = p.progreso
        })
        setRutasProgress(progressMap)
      }

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const handleScenarioComplete = async (result: any) => {
    setCompletedScenarios(prev => new Set([...prev, result.scenario_id]))
    setSelectedScenario(null)
  }

  // Check if ruta is available based on user's selected camino
  const isRutaAvailable = (rutaCamino: string): boolean => {
    if (!userProfile) return true
    
    // If camino is "ambos", it's always available
    if (rutaCamino === "ambos") return true
    
    // Check if user's disc_profile matches the ruta's camino requirement
    const userCamino = userProfile.disc_profile || ""
    
    // Map disc profiles to camino paths
    const discToCamino: Record<string, string[]> = {
      persona: ["D", "I", "S"],  // Personal development profiles
      profesional: ["C", "D"],     // Professional profiles
    }
    
    // If ruta requires a specific camino, check if user matches
    if (rutaCamino === "persona") return discToCamino.persona.includes(userCamino)
    if (rutaCamino === "profesional") return discToCamino.profesional.includes(userCamino)
    
    return true
  }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

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
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
              🛤️
            </div>
            <div>
              <h1 className="text-2xl font-bold">A2 Rutas</h1>
              <p className="text-muted-foreground">Elige tu ruta de desarrollo especializado</p>
            </div>
          </div>
        </div>

        {/* Tabs for A2 and A3 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="a2">A2 Rutas Temáticas</TabsTrigger>
            <TabsTrigger value="a3" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              A3 Simulaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="a2" className="space-y-6">
          {RUTAS.map((ruta) => {
            const available = isRutaAvailable(ruta.camino)
            const progress = rutasProgress[ruta.id] || 0

            return (
              <Card 
                key={ruta.id} 
                className={`${!available ? "opacity-60" : ""} transition-all hover:shadow-md`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl ${ruta.lightColor} flex items-center justify-center text-3xl`}>
                        {ruta.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{ruta.name}</CardTitle>
                          {!available && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <CardDescription>{ruta.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={`${ruta.lightColor} ${ruta.textColor} border-0`}>
                      {ruta.camino === "ambos" ? "Ambos" : ruta.camino.charAt(0).toUpperCase() + ruta.camino.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Temas */}
                  <div>
                    <p className="text-sm font-medium mb-2">Temas que cubrirás:</p>
                    <div className="flex flex-wrap gap-2">
                      {ruta.temas.map((tema) => (
                        <Badge key={tema} variant="outline" className="text-xs">
                          {tema}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Libros Relacionados */}
                  <div>
                    <p className="text-sm font-medium mb-2">Lecturas recomendadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {ruta.librosRelacionados.map((libro) => (
                        <Badge key={libro} variant="secondary" className="text-xs">
                          {libro}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {available ? (
                    <Button asChild className="w-full">
                      <Link href={`/despega/rutas/${ruta.id}`}>
                        {progress > 0 ? "Continuar Ruta" : "Comenzar Ruta"}
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Activa el Camino {ruta.camino.charAt(0).toUpperCase() + ruta.camino.slice(1)} para desbloquear
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="a3" className="space-y-6">
          {/* A3 Simulations */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Escenarios de Simulación</h2>
            <div className="text-sm text-muted-foreground mb-4">
              Aprende enfrentando situaciones realistas. Cada simulación te proporciona feedback personalizado.
            </div>
            <div className="grid gap-4">
              {A3_SCENARIOS.map((scenario) => {
                const isCompleted = completedScenarios.has(scenario.id)
                const tipoIcons: Record<string, string> = {
                  decision: "🤔",
                  comunicacion: "💬",
                  negociacion: "🤝",
                  liderazgo: "👥",
                  crisis: "🚨",
                  planificacion: "📋",
                }

                return (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isCompleted ? "opacity-60 bg-muted" : ""
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{tipoIcons[scenario.tipo]}</span>
                            <div>
                              <div className="font-medium">{scenario.titulo}</div>
                              <div className="text-sm text-muted-foreground">{scenario.contexto}</div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {scenario.nivel}
                            </Badge>
                            <Badge className="bg-primary">
                              +{scenario.puntos}
                            </Badge>
                          </div>
                          {!isCompleted ? (
                            <Button
                              size="sm"
                              onClick={() => setSelectedScenario(scenario)}
                            >
                              Comenzar
                            </Button>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">
                              Completado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
