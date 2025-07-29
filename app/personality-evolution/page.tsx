"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  Users,
  RefreshCw,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  Share2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

interface PersonalitySnapshot {
  id: string
  date: string
  disc: {
    D: number
    I: number
    S: number
    C: number
    primary: string
    secondary: string
  } | null
  bigFive: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  } | null
  context: {
    lifeEvents: string[]
    goals: string[]
    achievements: string[]
  }
}

interface EvolutionInsight {
  trait: string
  change: number
  direction: "increase" | "decrease" | "stable"
  significance: "high" | "medium" | "low"
  possibleCauses: string[]
  recommendations: string[]
}

export default function PersonalityEvolutionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [snapshots, setSnapshots] = useState<PersonalitySnapshot[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")
  const [selectedComparison, setSelectedComparison] = useState("latest-vs-first")
  const [evolutionInsights, setEvolutionInsights] = useState<EvolutionInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadEvolutionData()
  }, [user, router])

  const loadEvolutionData = async () => {
    try {
      setIsLoading(true)

      // Mock evolution data - in real app, load from database
      const mockSnapshots: PersonalitySnapshot[] = [
        {
          id: "1",
          date: "2023-01-15",
          disc: {
            D: 65,
            I: 45,
            S: 55,
            C: 35,
            primary: "D",
            secondary: "S",
          },
          bigFive: {
            openness: 72,
            conscientiousness: 68,
            extraversion: 58,
            agreeableness: 74,
            neuroticism: 45,
          },
          context: {
            lifeEvents: ["Comenzó nuevo trabajo", "Mudanza a Santiago"],
            goals: ["Mejorar liderazgo", "Desarrollar equipo"],
            achievements: ["Promoción a supervisor"],
          },
        },
        {
          id: "2",
          date: "2023-07-20",
          disc: {
            D: 70,
            I: 52,
            S: 48,
            C: 38,
            primary: "D",
            secondary: "I",
          },
          bigFive: {
            openness: 75,
            conscientiousness: 71,
            extraversion: 62,
            agreeableness: 70,
            neuroticism: 38,
          },
          context: {
            lifeEvents: ["Lideró proyecto importante", "Curso de management"],
            goals: ["Expandir red profesional", "Mejorar comunicación"],
            achievements: ["Proyecto exitoso", "Reconocimiento del CEO"],
          },
        },
        {
          id: "3",
          date: "2024-01-10",
          disc: {
            D: 75,
            I: 58,
            S: 42,
            C: 40,
            primary: "D",
            secondary: "I",
          },
          bigFive: {
            openness: 78,
            conscientiousness: 74,
            extraversion: 68,
            agreeableness: 68,
            neuroticism: 32,
          },
          context: {
            lifeEvents: ["Ascenso a gerente", "Conferencia internacional"],
            goals: ["Desarrollar visión estratégica", "Mentoring de equipo"],
            achievements: ["Gerente del año", "Equipo top performer"],
          },
        },
      ]

      setSnapshots(mockSnapshots)

      // Generate evolution insights
      const insights = generateEvolutionInsights(mockSnapshots)
      setEvolutionInsights(insights)
    } catch (error) {
      console.error("Error loading evolution data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateEvolutionInsights = (snapshots: PersonalitySnapshot[]): EvolutionInsight[] => {
    if (snapshots.length < 2) return []

    const insights: EvolutionInsight[] = []
    const first = snapshots[0]
    const latest = snapshots[snapshots.length - 1]

    // DISC evolution insights
    if (first.disc && latest.disc) {
      Object.entries(first.disc).forEach(([trait, firstValue]) => {
        if (typeof firstValue === "number") {
          const latestValue = latest.disc![trait as keyof typeof latest.disc] as number
          const change = latestValue - firstValue

          if (Math.abs(change) >= 5) {
            // Significant change threshold
            insights.push({
              trait: `DISC ${trait}`,
              change: Math.abs(change),
              direction: change > 0 ? "increase" : "decrease",
              significance: Math.abs(change) >= 15 ? "high" : Math.abs(change) >= 10 ? "medium" : "low",
              possibleCauses: getPossibleCauses(trait, change, snapshots),
              recommendations: getRecommendations(trait, change),
            })
          }
        }
      })
    }

    // Big Five evolution insights
    if (first.bigFive && latest.bigFive) {
      Object.entries(first.bigFive).forEach(([trait, firstValue]) => {
        const latestValue = latest.bigFive![trait as keyof typeof latest.bigFive]
        const change = latestValue - firstValue

        if (Math.abs(change) >= 5) {
          insights.push({
            trait: `Big Five ${trait}`,
            change: Math.abs(change),
            direction: change > 0 ? "increase" : "decrease",
            significance: Math.abs(change) >= 15 ? "high" : Math.abs(change) >= 10 ? "medium" : "low",
            possibleCauses: getPossibleCauses(trait, change, snapshots),
            recommendations: getRecommendations(trait, change),
          })
        }
      })
    }

    return insights.sort((a, b) => b.change - a.change).slice(0, 8)
  }

  const getPossibleCauses = (trait: string, change: number, snapshots: PersonalitySnapshot[]): string[] => {
    const causes = []
    const recentEvents = snapshots.slice(-2).flatMap((s) => s.context.lifeEvents)

    if (trait === "D" && change > 0) {
      if (recentEvents.some((e) => e.includes("lider") || e.includes("gerente") || e.includes("ascenso"))) {
        causes.push("Nuevas responsabilidades de liderazgo")
      }
      if (recentEvents.some((e) => e.includes("proyecto") || e.includes("reto"))) {
        causes.push("Experiencias desafiantes exitosas")
      }
    }

    if (trait === "I" && change > 0) {
      if (recentEvents.some((e) => e.includes("curso") || e.includes("conferencia"))) {
        causes.push("Desarrollo de habilidades de comunicación")
      }
      if (recentEvents.some((e) => e.includes("equipo") || e.includes("networking"))) {
        causes.push("Mayor exposición social profesional")
      }
    }

    if (trait === "extraversion" && change > 0) {
      causes.push("Incremento en responsabilidades públicas")
      causes.push("Desarrollo de confianza profesional")
    }

    if (trait === "conscientiousness" && change > 0) {
      causes.push("Madurez profesional y responsabilidades crecientes")
      causes.push("Experiencias que requieren mayor organización")
    }

    if (trait === "neuroticism" && change < 0) {
      causes.push("Mayor estabilidad profesional y personal")
      causes.push("Desarrollo de técnicas de manejo del estrés")
    }

    return causes.length > 0 ? causes : ["Desarrollo natural de la personalidad", "Experiencias de vida acumuladas"]
  }

  const getRecommendations = (trait: string, change: number): string[] => {
    const recommendations = []

    if (trait === "D" && change > 0) {
      recommendations.push("Continúa desarrollando habilidades de liderazgo estratégico")
      recommendations.push("Busca roles con mayor responsabilidad y autonomía")
      recommendations.push("Practica la delegación efectiva")
    }

    if (trait === "I" && change > 0) {
      recommendations.push("Aprovecha tus habilidades mejoradas de comunicación")
      recommendations.push("Considera roles que involucren presentaciones públicas")
      recommendations.push("Desarrolla tu red profesional activamente")
    }

    if (trait === "extraversion" && change > 0) {
      recommendations.push("Busca oportunidades de networking y eventos profesionales")
      recommendations.push("Considera roles customer-facing o de relaciones públicas")
    }

    if (trait === "conscientiousness" && change > 0) {
      recommendations.push("Aprovecha tu mayor organización para proyectos complejos")
      recommendations.push("Considera roles de gestión de procesos o calidad")
    }

    return recommendations.length > 0 ? recommendations : ["Mantén el desarrollo positivo de este rasgo"]
  }

  const prepareChartData = () => {
    if (!snapshots.length) return []

    return snapshots.map((snapshot) => ({
      date: new Date(snapshot.date).toLocaleDateString("es-ES", { month: "short", year: "numeric" }),
      D: snapshot.disc?.D || 0,
      I: snapshot.disc?.I || 0,
      S: snapshot.disc?.S || 0,
      C: snapshot.disc?.C || 0,
      openness: snapshot.bigFive?.openness || 0,
      conscientiousness: snapshot.bigFive?.conscientiousness || 0,
      extraversion: snapshot.bigFive?.extraversion || 0,
      agreeableness: snapshot.bigFive?.agreeableness || 0,
      neuroticism: snapshot.bigFive?.neuroticism || 0,
    }))
  }

  const prepareRadarData = () => {
    if (snapshots.length < 2) return []

    const first = snapshots[0]
    const latest = snapshots[snapshots.length - 1]

    const traits = [
      { trait: "D", first: first.disc?.D || 0, latest: latest.disc?.D || 0 },
      { trait: "I", first: first.disc?.I || 0, latest: latest.disc?.I || 0 },
      { trait: "S", first: first.disc?.S || 0, latest: latest.disc?.S || 0 },
      { trait: "C", first: first.disc?.C || 0, latest: latest.disc?.C || 0 },
      { trait: "Apertura", first: first.bigFive?.openness || 0, latest: latest.bigFive?.openness || 0 },
      {
        trait: "Responsabilidad",
        first: first.bigFive?.conscientiousness || 0,
        latest: latest.bigFive?.conscientiousness || 0,
      },
      { trait: "Extraversión", first: first.bigFive?.extraversion || 0, latest: latest.bigFive?.extraversion || 0 },
      { trait: "Amabilidad", first: first.bigFive?.agreeableness || 0, latest: latest.bigFive?.agreeableness || 0 },
      { trait: "Neuroticismo", first: first.bigFive?.neuroticism || 0, latest: latest.bigFive?.neuroticism || 0 },
    ]

    return traits
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analizando tu evolución de personalidad...</p>
        </div>
      </div>
    )
  }

  const chartData = prepareChartData()
  const radarData = prepareRadarData()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Evolución de tu Personalidad</h1>
            <p className="text-muted-foreground">
              Seguimiento de cambios en tu perfil psicológico a lo largo del tiempo
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Período:</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el período</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
                <SelectItem value="6months">Últimos 6 meses</SelectItem>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Comparación:</label>
            <Select value={selectedComparison} onValueChange={setSelectedComparison}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest-vs-first">Actual vs Inicial</SelectItem>
                <SelectItem value="latest-vs-previous">Actual vs Anterior</SelectItem>
                <SelectItem value="trend-analysis">Análisis de tendencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {snapshots.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay datos de evolución</h3>
            <p className="text-muted-foreground mb-6">
              Necesitas al menos dos evaluaciones de personalidad para ver tu evolución
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/disc-test")}>Realizar Test DISC</Button>
              <Button variant="outline" onClick={() => router.push("/big-five-test")}>
                Realizar Test Big Five
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="context">Contexto</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Evaluaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{snapshots.length}</div>
                  <p className="text-sm text-muted-foreground">
                    Desde {new Date(snapshots[0].date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Cambios Significativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{evolutionInsights.length}</div>
                  <p className="text-sm text-muted-foreground">Rasgos con evolución notable</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Desarrollo Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {evolutionInsights.length > 0 && (
                    <>
                      <div className="text-lg font-bold text-purple-600">{evolutionInsights[0].trait}</div>
                      <p className="text-sm text-muted-foreground">
                        {evolutionInsights[0].direction === "increase" ? "+" : "-"}
                        {evolutionInsights[0].change}% de cambio
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Comparación Temporal</CardTitle>
                <CardDescription>Evolución de tus rasgos de personalidad entre evaluaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="trait" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} />
                      <Radar
                        name="Primera evaluación"
                        dataKey="first"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.1}
                      />
                      <Radar
                        name="Evaluación actual"
                        dataKey="latest"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.1}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* DISC Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución DISC</CardTitle>
                <CardDescription>Cambios en tu perfil DISC a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="D" stroke="#ef4444" strokeWidth={2} name="Dominancia" />
                      <Line type="monotone" dataKey="I" stroke="#f59e0b" strokeWidth={2} name="Influencia" />
                      <Line type="monotone" dataKey="S" stroke="#10b981" strokeWidth={2} name="Estabilidad" />
                      <Line type="monotone" dataKey="C" stroke="#3b82f6" strokeWidth={2} name="Cumplimiento" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Big Five Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución Big Five</CardTitle>
                <CardDescription>Cambios en los cinco grandes factores de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="openness" stroke="#8b5cf6" strokeWidth={2} name="Apertura" />
                      <Line
                        type="monotone"
                        dataKey="conscientiousness"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        name="Responsabilidad"
                      />
                      <Line
                        type="monotone"
                        dataKey="extraversion"
                        stroke="#84cc16"
                        strokeWidth={2}
                        name="Extraversión"
                      />
                      <Line
                        type="monotone"
                        dataKey="agreeableness"
                        stroke="#f97316"
                        strokeWidth={2}
                        name="Amabilidad"
                      />
                      <Line
                        type="monotone"
                        dataKey="neuroticism"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="Neuroticismo"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-4">
              {evolutionInsights.map((insight, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    insight.significance === "high"
                      ? "border-l-red-500"
                      : insight.significance === "medium"
                        ? "border-l-yellow-500"
                        : "border-l-green-500"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {insight.direction === "increase" ? (
                          <ArrowUp className="w-5 h-5 text-green-600" />
                        ) : insight.direction === "decrease" ? (
                          <ArrowDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-600" />
                        )}
                        {insight.trait}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            insight.significance === "high"
                              ? "destructive"
                              : insight.significance === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {insight.significance === "high"
                            ? "Alta"
                            : insight.significance === "medium"
                              ? "Media"
                              : "Baja"}
                        </Badge>
                        <Badge variant="outline">
                          {insight.direction === "increase" ? "+" : "-"}
                          {insight.change}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Posibles Causas:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {insight.possibleCauses.map((cause, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Recomendaciones:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {insight.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {evolutionInsights.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sin cambios significativos</h3>
                    <p className="text-muted-foreground">Tu personalidad ha mantenido estabilidad entre evaluaciones</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="context" className="space-y-6">
            <div className="space-y-6">
              {snapshots.map((snapshot, index) => (
                <Card key={snapshot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {new Date(snapshot.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <Badge variant={index === snapshots.length - 1 ? "default" : "secondary"}>
                        {index === snapshots.length - 1
                          ? "Actual"
                          : `Hace ${snapshots.length - index - 1} evaluación${snapshots.length - index - 1 > 1 ? "es" : ""}`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Eventos de Vida
                        </h4>
                        <ul className="space-y-2">
                          {snapshot.context.lifeEvents.map((event, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Objetivos
                        </h4>
                        <ul className="space-y-2">
                          {snapshot.context.goals.map((goal, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Logros
                        </h4>
                        <ul className="space-y-2">
                          {snapshot.context.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Personality Snapshot */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="grid md:grid-cols-2 gap-6">
                        {snapshot.disc && (
                          <div>
                            <h4 className="font-semibold text-sm mb-3">Perfil DISC</h4>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-blue-100 text-blue-800">
                                {snapshot.disc.primary}
                                {snapshot.disc.secondary}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                D:{snapshot.disc.D}% I:{snapshot.disc.I}% S:{snapshot.disc.S}% C:{snapshot.disc.C}%
                              </div>
                            </div>
                          </div>
                        )}

                        {snapshot.bigFive && (
                          <div>
                            <h4 className="font-semibold text-sm mb-3">Big Five Highlights</h4>
                            <div className="flex flex-wrap gap-1">
                              {snapshot.bigFive.openness >= 70 && (
                                <Badge variant="outline" className="text-xs">
                                  Alta Apertura
                                </Badge>
                              )}
                              {snapshot.bigFive.conscientiousness >= 70 && (
                                <Badge variant="outline" className="text-xs">
                                  Alta Responsabilidad
                                </Badge>
                              )}
                              {snapshot.bigFive.extraversion >= 70 && (
                                <Badge variant="outline" className="text-xs">
                                  Alta Extraversión
                                </Badge>
                              )}
                              {snapshot.bigFive.agreeableness >= 70 && (
                                <Badge variant="outline" className="text-xs">
                                  Alta Amabilidad
                                </Badge>
                              )}
                              {snapshot.bigFive.neuroticism <= 30 && (
                                <Badge variant="outline" className="text-xs">
                                  Estabilidad Emocional
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Call to Action */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">¿Listo para tu próxima evaluación?</h3>
              <p className="text-muted-foreground">
                Recomendamos repetir las evaluaciones cada 6-12 meses para seguir tu desarrollo personal
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/personality-coach")}>
                <Users className="w-4 h-4 mr-2" />
                Hablar con Coach
              </Button>
              <Button onClick={() => router.push("/personality-dashboard")}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Nueva Evaluación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
