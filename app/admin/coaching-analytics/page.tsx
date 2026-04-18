"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Star, CheckCircle, TrendingUp, AlertTriangle, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface MetricsData {
  aggregates: {
    totalSessions: number
    avgEngagement: number
    avgSatisfaction: number
    actionsCompleted: number
    completionRate: number
    meetsEngagementTarget: boolean
    meetsSatisfactionTarget: boolean
    meetsActionTarget: boolean
  }
  byCoach: {
    sofia: CoachMetrics
    dani: CoachMetrics
  }
  byCategory: CategoryMetrics[]
  criticalPrompts: CriticalPrompt[]
  trends: TrendData[]
}

interface CoachMetrics {
  totalSessions: number
  avgSatisfaction: number
  avgEngagement: number
  completionRate: number
}

interface CategoryMetrics {
  category: string
  sessions: number
  avgSatisfaction: number
  avgEngagement: number
  completionRate: number
}

interface CriticalPrompt {
  category: string
  coach: string
  sessions: number
  avgSatisfaction: number
  avgEngagement: number
  completionRate: number
  issues: string[]
}

interface TrendData {
  date: string
  satisfaction: number
  engagement: number
  completionRate: number
}

const COLORS = {
  sofia: "#8b5cf6",
  dani: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
}

export default function CoachingAnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    fetchMetrics()
  }, [timeRange])

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/coaching-analytics?range=${timeRange}`)
      if (!response.ok) throw new Error("Error fetching analytics")

      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("[v0] Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando análisis...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <p className="text-muted-foreground">No se pudieron cargar las métricas</p>
        </div>
      </div>
    )
  }

  const { aggregates, byCoach, byCategory, criticalPrompts, trends } = metrics

  // Prepare chart data
  const coachComparisonData = [
    {
      name: "Sofia",
      Satisfacción: byCoach.sofia.avgSatisfaction,
      Engagement: byCoach.sofia.avgEngagement,
      "Tasa Completación": byCoach.sofia.completionRate,
    },
    {
      name: "Dani",
      Satisfacción: byCoach.dani.avgSatisfaction,
      Engagement: byCoach.dani.avgEngagement,
      "Tasa Completación": byCoach.dani.completionRate,
    },
  ]

  const sessionDistribution = [
    { name: "Sofia", value: byCoach.sofia.totalSessions, color: COLORS.sofia },
    { name: "Dani", value: byCoach.dani.totalSessions, color: COLORS.dani },
  ]

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análisis de Coaching</h1>
          <p className="text-muted-foreground mt-1">Métricas de rendimiento de Sofia & Dani</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.totalSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sofia: {byCoach.sofia.totalSessions} | Dani: {byCoach.dani.totalSessions}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.avgSatisfaction.toFixed(1)}★</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={aggregates.meetsSatisfactionTarget ? "default" : "secondary"}>
                {aggregates.meetsSatisfactionTarget ? "✓ Meta: 4.0+" : "⚠ Bajo meta"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.avgEngagement.toFixed(1)} msg</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={aggregates.meetsEngagementTarget ? "default" : "secondary"}>
                {aggregates.meetsEngagementTarget ? "✓ Meta: 2+" : "⚠ Bajo meta"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Completación</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.completionRate.toFixed(0)}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={aggregates.meetsActionTarget ? "default" : "secondary"}>
                {aggregates.meetsActionTarget ? "✓ Meta: 60%+" : "⚠ Bajo meta"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="coaches">Por Coach</TabsTrigger>
          <TabsTrigger value="categories">Por Categoría</TabsTrigger>
          <TabsTrigger value="critical">Prompts Críticos</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Coaches</CardTitle>
                <CardDescription>Rendimiento de Sofia vs Dani</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coachComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Satisfacción" fill={COLORS.sofia} />
                    <Bar dataKey="Engagement" fill={COLORS.dani} />
                    <Bar dataKey="Tasa Completación" fill={COLORS.success} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Sesiones</CardTitle>
                <CardDescription>Total de sesiones por coach</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sessionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent = 0 }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sessionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Metas del Documento */}
          <Card>
            <CardHeader>
              <CardTitle>Cumplimiento de Metas</CardTitle>
              <CardDescription>Según documento (páginas 61-63)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Engagement (2+ mensajes por sesión)</span>
                  <Badge variant={aggregates.meetsEngagementTarget ? "default" : "destructive"}>
                    {aggregates.avgEngagement.toFixed(1)} mensajes
                  </Badge>
                </div>
                <Progress value={(aggregates.avgEngagement / 2) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Satisfacción (4+ estrellas)</span>
                  <Badge variant={aggregates.meetsSatisfactionTarget ? "default" : "destructive"}>
                    {aggregates.avgSatisfaction.toFixed(1)}★
                  </Badge>
                </div>
                <Progress value={(aggregates.avgSatisfaction / 5) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tasa de Completación (60%+)</span>
                  <Badge variant={aggregates.meetsActionTarget ? "default" : "destructive"}>
                    {aggregates.completionRate.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={aggregates.completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coaches Tab */}
        <TabsContent value="coaches" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sofia Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center">
                    <span className="text-2xl">👩‍💼</span>
                  </div>
                  <div>
                    <CardTitle>Sofia</CardTitle>
                    <CardDescription>Coach de Autoconocimiento</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sesiones</p>
                    <p className="text-2xl font-bold">{byCoach.sofia.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfacción</p>
                    <p className="text-2xl font-bold">{byCoach.sofia.avgSatisfaction.toFixed(1)}★</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">{byCoach.sofia.avgEngagement.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completación</p>
                    <p className="text-2xl font-bold">{byCoach.sofia.completionRate.toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dani Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center">
                    <span className="text-2xl">👨‍💼</span>
                  </div>
                  <div>
                    <CardTitle>Dani</CardTitle>
                    <CardDescription>Coach de Desarrollo & Carrera</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sesiones</p>
                    <p className="text-2xl font-bold">{byCoach.dani.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfacción</p>
                    <p className="text-2xl font-bold">{byCoach.dani.avgSatisfaction.toFixed(1)}★</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">{byCoach.dani.avgEngagement.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completación</p>
                    <p className="text-2xl font-bold">{byCoach.dani.completionRate.toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas por Categoría</CardTitle>
              <CardDescription>Rendimiento por tipo de conversación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {byCategory.map((cat) => (
                  <div key={cat.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold capitalize">{cat.category.replace(/_/g, " ")}</h3>
                      <Badge>{cat.sessions} sesiones</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Satisfacción</p>
                        <p className="font-bold">{cat.avgSatisfaction.toFixed(1)}★</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-bold">{cat.avgEngagement.toFixed(1)} msg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completación</p>
                        <p className="font-bold">{cat.completionRate.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Prompts Tab */}
        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Prompts Críticos que Requieren Mejora
              </CardTitle>
              <CardDescription>
                Prompts con satisfaction &lt; 4.3★, action &lt; 60%, o engagement &lt; 70%
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalPrompts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
                  <p>No hay prompts críticos. Todas las métricas están dentro de los objetivos.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {criticalPrompts.map((prompt, index) => (
                    <div key={index} className="border border-warning/50 rounded-lg p-4 bg-warning/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold capitalize">{prompt.category.replace(/_/g, " ")}</h3>
                          <p className="text-sm text-muted-foreground">Coach: {prompt.coach}</p>
                        </div>
                        <Badge variant="outline">{prompt.sessions} sesiones</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Satisfacción</p>
                          <p className="font-bold text-warning">{prompt.avgSatisfaction.toFixed(1)}★</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-bold text-warning">{prompt.avgEngagement.toFixed(1)} msg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completación</p>
                          <p className="font-bold text-warning">{prompt.completionRate.toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Problemas identificados:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {prompt.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-warning">•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias en el Tiempo</CardTitle>
              <CardDescription>Evolución de métricas clave</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke={COLORS.sofia}
                    name="Satisfacción"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="engagement" stroke={COLORS.dani} name="Engagement" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="completionRate"
                    stroke={COLORS.success}
                    name="Tasa Completación"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
