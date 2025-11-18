"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Download, Share2, TrendingUp, Users, Target, Sparkles, Loader2, Lightbulb, BookOpen } from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MultiTestInsights } from "@/components/multi-test-insights"
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"

interface DISCResult {
  d_score: number
  i_score: number
  s_score: number
  c_score: number
  primary_type: string
  analysis: string
  recommendations: string
  created_at: string
}

interface AIInterpretation {
  interpretation: string
  generated_at: string
}

interface HybridInsight {
  source: 'openai' | 'cerebro' | 'hybrid'
  category: string
  title: string
  description: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
  reasoningSource: string
  personalizedContext?: string
  actionableSteps: string[]
}

interface HybridInsightsResponse {
  insights: HybridInsight[]
  recommendations: Array<{
    title: string
    description: string
    timeframe: string
    difficulty: string
    source: 'openai' | 'cerebro' | 'hybrid'
  }>
  developmentPlan: {
    shortTerm: string[]
    mediumTerm: string[]
    longTerm: string[]
  }
  metadata?: {
    openaiInsightsCount: number
    cerebroInsightsCount: number
    totalInsights: number
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DISCResultsPage() {
  const { user } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"

  const [discResult, setDiscResult] = useState<DISCResult | null>(null)
  const [aiInterpretation, setAiInterpretation] = useState<string>("")
  const [hybridInsights, setHybridInsights] = useState<HybridInsightsResponse | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [loading, setLoading] = useState(true)
  const [demoQuestionsUsed, setDemoQuestionsUsed] = useState(0)
  const DEMO_QUESTION_LIMIT = 3

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (!user && !isDemoMode) {
      router.push("/")
      return
    }
    loadResults()
  }, [user, router, isDemoMode])

  const loadResults = async () => {
    if (isDemoMode) {
      setDiscResult({
        d_score: 75,
        i_score: 65,
        s_score: 45,
        c_score: 85,
        primary_type: "Compliance",
        analysis:
          "Tu estilo principal es Compliance con puntuaciones: D=75%, I=65%, S=45%, C=85%. Eres analítico, preciso y orientado a la calidad.",
        recommendations: "Continúa desarrollando tus fortalezas naturales mientras trabajas en áreas de crecimiento.",
        created_at: new Date().toISOString(),
      })
      setAiInterpretation(
        "Basado en tu perfil DISC, muestras un fuerte enfoque en Compliance (85%) y Dominancia (75%). Esto indica que eres una persona que valora la precisión, la calidad y los resultados. Tu combinación de alta C y alta D te hace excelente para roles que requieren tanto atención al detalle como capacidad de toma de decisiones.\n\nTus fortalezas incluyen:\n- Pensamiento analítico y sistemático\n- Orientación a resultados y eficiencia\n- Alta calidad en el trabajo\n- Capacidad de liderazgo basada en datos\n\nÁreas de desarrollo:\n- Flexibilidad en situaciones ambiguas\n- Paciencia con procesos menos estructurados\n- Delegación y confianza en otros\n- Balance entre perfección y pragmatismo",
      )
      setLoading(false)
      return
    }

    if (!user) return

    try {
      // Load DISC results
      const { data: discData, error: discError } = await supabase
        .from("disc_results")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (discError && discError.code !== "PGRST116") {
        console.error("Error loading DISC results:", discError)
      }

      // Load AI interpretation
      const { data: aiData, error: aiError } = await supabase
        .from("ai_interpretations")
        .select("*")
        .eq("user_email", user.email)
        .eq("test_name", "DISC Assessment")
        .order("generated_at", { ascending: false })
        .limit(1)
        .single()

      if (aiError && aiError.code !== "PGRST116") {
        console.error("Error loading AI interpretation:", aiError)
      }

      // Load test results for additional AI interpretation
      const { data: testData, error: testError } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", user.email)
        .eq("test_name", "DISC Assessment")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (testError && testError.code !== "PGRST116") {
        console.error("Error loading test results:", testError)
      }

      if (discData) {
        setDiscResult(discData)
        await loadHybridInsights(discData)
      } else {
        // Create demo data if no results found
        setDiscResult({
          d_score: 75,
          i_score: 65,
          s_score: 45,
          c_score: 85,
          primary_type: "Compliance",
          analysis: "Tu estilo principal es Compliance con puntuaciones: D=75%, I=65%, S=45%, C=85%",
          recommendations: "Continúa desarrollando tus fortalezas naturales mientras trabajas en áreas de crecimiento.",
          created_at: new Date().toISOString(),
        })
      }

      // Set AI interpretation from multiple sources
      if (aiData?.interpretation) {
        setAiInterpretation(aiData.interpretation)
      } else if (testData?.results?.ai_interpretation) {
        setAiInterpretation(testData.results.ai_interpretation)
      }
    } catch (error) {
      console.error("Error loading results:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHybridInsights = async (discData: DISCResult) => {
    if (!user || isDemoMode) return

    setLoadingInsights(true)
    try {
      const response = await fetch('/api/post-test-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'DISC',
          results: {
            d_score: discData.d_score,
            i_score: discData.i_score,
            s_score: discData.s_score,
            c_score: discData.c_score,
            primary_type: discData.primary_type,
          },
          userId: user.id,
          testResponses: discData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setHybridInsights(data)
      }
    } catch (error) {
      console.error('Error loading hybrid insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!discResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No se encontraron resultados</CardTitle>
            <CardDescription>Parece que aún no has completado el test DISC.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/test/disc")} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Realizar Test DISC
            </Button>
            <Button variant="outline" onClick={() => router.push(isDemoMode ? "/" : "/dashboard")} className="w-full">
              {isDemoMode ? "Volver al Inicio" : "Volver al Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const radarData = [
    { subject: "Dominancia", A: discResult.d_score, fullMark: 100 },
    { subject: "Influencia", A: discResult.i_score, fullMark: 100 },
    { subject: "Estabilidad", A: discResult.s_score, fullMark: 100 },
    { subject: "Cumplimiento", A: discResult.c_score, fullMark: 100 },
  ]

  const barData = [
    { name: "D", value: discResult.d_score, color: "#0088FE" },
    { name: "I", value: discResult.i_score, color: "#00C49F" },
    { name: "S", value: discResult.s_score, color: "#FFBB28" },
    { name: "C", value: discResult.c_score, color: "#FF8042" },
  ]

  const pieData = [
    { name: "Dominancia", value: discResult.d_score },
    { name: "Influencia", value: discResult.i_score },
    { name: "Estabilidad", value: discResult.s_score },
    { name: "Cumplimiento", value: discResult.c_score },
  ]

  const getStyleDescription = (type: string) => {
    switch (type) {
      case "Dominance":
        return {
          title: "Dominancia (D)",
          description: "Orientado a resultados, directo, decidido y competitivo",
          strengths: ["Liderazgo natural", "Toma de decisiones rápida", "Orientación a resultados", "Confianza"],
          challenges: ["Puede ser impaciente", "Necesita trabajar en diplomacia", "Tendencia a ser directo"],
          workStyle: "Prefiere autonomía, desafíos y responsabilidades de liderazgo",
        }
      case "Influence":
        return {
          title: "Influencia (I)",
          description: "Sociable, optimista, persuasivo y entusiasta",
          strengths: ["Excelente comunicador", "Motivador natural", "Optimista", "Trabajo en equipo"],
          challenges: ["Puede ser desorganizado", "Necesita estructura", "Tendencia a ser impulsivo"],
          workStyle: "Prefiere interacción social, variedad y reconocimiento público",
        }
      case "Steadiness":
        return {
          title: "Estabilidad (S)",
          description: "Paciente, leal, confiable y colaborativo",
          strengths: ["Muy confiable", "Excelente escucha", "Paciente", "Leal al equipo"],
          challenges: ["Resistencia al cambio", "Dificultad para decir no", "Evita conflictos"],
          workStyle: "Prefiere estabilidad, trabajo en equipo y ambiente armonioso",
        }
      case "Compliance":
        return {
          title: "Cumplimiento (C)",
          description: "Analítico, preciso, sistemático y orientado a la calidad",
          strengths: ["Atención al detalle", "Pensamiento analítico", "Alta calidad", "Sistemático"],
          challenges: ["Puede ser perfeccionista", "Lento en decisiones", "Crítico consigo mismo"],
          workStyle: "Prefiere precisión, datos claros y tiempo para analizar",
        }
      default:
        return {
          title: "Estilo Mixto",
          description: "Combinación equilibrada de diferentes estilos",
          strengths: ["Versatilidad", "Adaptabilidad", "Balance"],
          challenges: ["Puede necesitar más claridad en su enfoque"],
          workStyle: "Adaptable a diferentes situaciones y equipos",
        }
    }
  }

  const styleInfo = getStyleDescription(discResult.primary_type)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'openai': return { label: 'GPT-4', color: 'bg-purple-100 text-purple-800' }
      case 'cerebro': return { label: 'Cerebro', color: 'bg-blue-100 text-blue-800' }
      case 'hybrid': return { label: 'Híbrido', color: 'bg-green-100 text-green-800' }
      default: return { label: 'IA', color: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push(isDemoMode ? "/" : "/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isDemoMode ? "Volver al Inicio" : "Volver al Dashboard"}
          </Button>
          <div className="flex items-center space-x-2">
            {isDemoMode && (
              <Badge variant="secondary" className="mr-2">
                Modo Demo
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl">Resultados del Test DISC</CardTitle>
            <CardDescription>Completado el {new Date(discResult.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-2">
                Estilo Principal: {styleInfo.title}
              </Badge>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{styleInfo.description}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="hybrid-insights">
              <Brain className="h-4 w-4 mr-1" />
              Cerebro + GPT
            </TabsTrigger>
            <TabsTrigger value="ai-analysis">Análisis IA</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Puntuaciones DISC</CardTitle>
                  <CardDescription>Tus puntuaciones en cada dimensión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Dominancia (D)</span>
                        <span className="text-sm text-gray-600">{discResult.d_score}%</span>
                      </div>
                      <Progress value={discResult.d_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Influencia (I)</span>
                        <span className="text-sm text-gray-600">{discResult.i_score}%</span>
                      </div>
                      <Progress value={discResult.i_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Estabilidad (S)</span>
                        <span className="text-sm text-gray-600">{discResult.s_score}%</span>
                      </div>
                      <Progress value={discResult.s_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Cumplimiento (C)</span>
                        <span className="text-sm text-gray-600">{discResult.c_score}%</span>
                      </div>
                      <Progress value={discResult.c_score} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tu Estilo: {styleInfo.title}</CardTitle>
                  <CardDescription>Características principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Fortalezas
                      </h4>
                      <ul className="text-sm space-y-1">
                        {styleInfo.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-orange-600" />
                        Áreas de Desarrollo
                      </h4>
                      <ul className="text-sm space-y-1">
                        {styleInfo.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Estilo de Trabajo Preferido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{styleInfo.workStyle}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico Radar - Perfil DISC</CardTitle>
                  <CardDescription>Visualización completa de tu perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="DISC"
                          dataKey="A"
                          stroke="#0088FE"
                          fill="#0088FE"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de Barras - Puntuaciones</CardTitle>
                  <CardDescription>Comparación de puntuaciones por dimensión</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Estilos</CardTitle>
                <CardDescription>Proporción de cada estilo en tu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado</CardTitle>
                <CardDescription>Interpretación profunda de tus resultados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Análisis Automático</h3>
                  <p className="text-sm">{discResult.analysis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Dimensiones Altas (&gt;70%)</h4>
                    {[
                      { name: "Dominancia", score: discResult.d_score },
                      { name: "Influencia", score: discResult.i_score },
                      { name: "Estabilidad", score: discResult.s_score },
                      { name: "Cumplimiento", score: discResult.c_score },
                    ]
                      .filter((item) => item.score > 70)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="default">{item.score}%</Badge>
                        </div>
                      ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Dimensiones a Desarrollar (&lt;50%)</h4>
                    {[
                      { name: "Dominancia", score: discResult.d_score },
                      { name: "Influencia", score: discResult.i_score },
                      { name: "Estabilidad", score: discResult.s_score },
                      { name: "Cumplimiento", score: discResult.c_score },
                    ]
                      .filter((item) => item.score < 50)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="outline">{item.score}%</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hybrid-insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Análisis Híbrido: Cerebro + GPT-4
                </CardTitle>
                <CardDescription>
                  Insights personalizados generados por el Cerebro (búsqueda semántica en 120+ libros) + GPT-4
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <p className="text-gray-600">Generando insights personalizados con IA híbrida...</p>
                  </div>
                ) : hybridInsights ? (
                  <div className="space-y-6">
                    {/* Metadata */}
                    {hybridInsights.metadata && (
                      <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{hybridInsights.metadata.totalInsights}</div>
                          <div className="text-xs text-gray-600">Total Insights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{hybridInsights.metadata.openaiInsightsCount}</div>
                          <div className="text-xs text-gray-600">GPT-4</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{hybridInsights.metadata.cerebroInsightsCount}</div>
                          <div className="text-xs text-gray-600">Cerebro</div>
                        </div>
                      </div>
                    )}

                    {/* Insights */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        Insights Clave
                      </h3>
                      <div className="grid gap-4">
                        {hybridInsights.insights.map((insight, index) => {
                          const sourceBadge = getSourceBadge(insight.source)
                          return (
                            <Card key={index} className="border-l-4 border-l-blue-500">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-base">{insight.title}</CardTitle>
                                  <div className="flex gap-2">
                                    <Badge className={sourceBadge.color}>{sourceBadge.label}</Badge>
                                    <Badge variant={getPriorityColor(insight.priority)}>
                                      {insight.priority}
                                    </Badge>
                                  </div>
                                </div>
                                <CardDescription className="text-xs">
                                  {insight.category} • Confianza: {(insight.confidence * 100).toFixed(0)}%
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-gray-700">{insight.description}</p>
                                
                                {insight.personalizedContext && (
                                  <div className="bg-blue-50 p-3 rounded text-sm">
                                    <strong>Contexto:</strong> {insight.personalizedContext}
                                  </div>
                                )}

                                {insight.actionableSteps.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold mb-2">Pasos Accionables:</p>
                                    <ul className="space-y-1">
                                      {insight.actionableSteps.map((step, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                          <span className="text-blue-600 font-bold">{i + 1}.</span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <p className="text-xs text-gray-500 italic">
                                  Fuente: {insight.reasoningSource}
                                </p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        Recomendaciones
                      </h3>
                      <div className="grid gap-3">
                        {hybridInsights.recommendations.map((rec, index) => {
                          const sourceBadge = getSourceBadge(rec.source)
                          return (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                                  <Badge className={sourceBadge.color} variant="outline">
                                    {sourceBadge.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                                <div className="flex gap-2 text-xs text-gray-500">
                                  <span>📅 {rec.timeframe}</span>
                                  <span>•</span>
                                  <span>🎯 {rec.difficulty}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    {/* Development Plan */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        Plan de Desarrollo
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Corto Plazo (1-3 meses)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hybridInsights.developmentPlan.shortTerm.map((item, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Mediano Plazo (3-6 meses)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hybridInsights.developmentPlan.mediumTerm.map((item, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span className="text-blue-600">→</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Largo Plazo (6-12 meses)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hybridInsights.developmentPlan.longTerm.map((item, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span className="text-purple-600">★</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Los insights híbridos no están disponibles en modo demo.
                    </p>
                    <Button onClick={() => router.push('/test/disc')}>
                      Realizar Test Real
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            <MultiTestInsights userEmail={user?.email || ""} currentTestType="DISC" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  Análisis con Inteligencia Artificial
                </CardTitle>
                <CardDescription>Interpretación avanzada de tus resultados DISC</CardDescription>
              </CardHeader>
              <CardContent>
                {aiInterpretation ? (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">{aiInterpretation}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis IA no disponible</h3>
                    <p className="text-gray-600 mb-4">
                      El análisis con IA se genera automáticamente al completar el test.
                    </p>
                    <Button onClick={() => router.push("/test/disc")} variant="outline">
                      Realizar Test Nuevamente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <SofiaDaniCoach
              conversationCategory="autoconocimiento"
              userContext={{
                testType: "DISC",
                testResults: discResult,
                userEmail: user?.email || "demo@example.com",
                completedAt: discResult.created_at,
              }}
              suggestedAction={`Completa el test de Soft Skills para desarrollar tus habilidades de comunicación`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
