"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import AICoachChat from "@/components/ai-coach-chat"
import AIInsightsPanel from "@/components/ai-insights-panel"
import { aiCoach } from "@/lib/ai-coach"
import {
  ArrowLeft,
  Brain,
  Target,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Lightbulb,
  Zap,
  Shield,
  Sparkles,
  Download,
  Share2,
} from "lucide-react"

interface BigFiveResult {
  O: number // Openness
  C: number // Conscientiousness
  E: number // Extraversion
  A: number // Agreeableness
  N: number // Neuroticism
  primary_traits: string[]
  secondary_traits: string[]
  personality_summary: string
  career_recommendations: string[]
  development_areas: string[]
  strengths: string[]
}

function BigFiveResultsContent() {
  const [results, setResults] = useState<BigFiveResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [aiInterpretation, setAiInterpretation] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (isDemo) {
      loadDemoResults()
    } else {
      checkUserAndLoadResults()
    }
  }, [isDemo])

  const checkUserAndLoadResults = async () => {
    try {
      // Check local session first
      const localSession = localStorage.getItem("dtc_session")
      if (localSession) {
        const sessionData = JSON.parse(localSession)
        if (sessionData.authenticated && sessionData.user) {
          setUserEmail(sessionData.user.email)
          await loadUserResults(sessionData.user.email)
          return
        }
      }

      // Check Supabase session
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        await loadUserResults(user.email || "")
      } else {
        router.push("/auth")
      }
    } catch (error) {
      console.error("Error checking user session:", error)
      router.push("/auth")
    }
  }

  const loadUserResults = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", email)
        .eq("test_name", "Big Five")
        .order("completed_at", { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setResults(data[0].results)
        await generateAIInterpretation(email, data[0].results)
      } else {
        // No results found, redirect to test
        router.push("/test/big-five")
      }
    } catch (error) {
      console.error("Error loading results:", error)
      router.push("/test/big-five")
    } finally {
      setLoading(false)
    }
  }

  const loadDemoResults = () => {
    const demoResults: BigFiveResult = {
      O: 85, // High Openness
      C: 78, // High Conscientiousness
      E: 72, // Moderate-High Extraversion
      A: 68, // Moderate Agreeableness
      N: 35, // Low Neuroticism
      primary_traits: ["Creativo", "Organizado", "Sociable"],
      secondary_traits: ["Curioso", "Responsable", "Empático"],
      personality_summary: "Perfil de innovador organizado con alta estabilidad emocional y orientación social.",
      career_recommendations: [
        "Director de Innovación",
        "Consultor de Estrategia",
        "Product Manager",
        "Arquitecto de Soluciones",
        "Líder de Transformación Digital",
      ],
      development_areas: [
        "Desarrollar mayor flexibilidad en situaciones imprevistas",
        "Mejorar habilidades de negociación en conflictos",
        "Fortalecer la paciencia con procesos lentos",
      ],
      strengths: [
        "Excelente capacidad para generar ideas innovadoras",
        "Alta disciplina y organización personal",
        "Facilidad para conectar con diferentes tipos de personas",
        "Estabilidad emocional en situaciones de presión",
      ],
    }

    setResults(demoResults)
    setUserEmail("demo@example.com")
    setLoading(false)
  }

  const generateAIInterpretation = async (email: string, testResults: BigFiveResult) => {
    try {
      setLoadingAI(true)
      const interpretation = await aiCoach.interpretTestResults(email, "Big Five", testResults)
      setAiInterpretation(interpretation)
    } catch (error) {
      console.error("Error generating AI interpretation:", error)
      setAiInterpretation("No se pudo generar la interpretación con IA en este momento.")
    } finally {
      setLoadingAI(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus resultados Big Five...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Completa el test Big Five para ver tus resultados</p>
            <Button onClick={() => router.push("/test/big-five")}>Realizar Test</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const radarData = [
    { factor: "Apertura", value: results.O, fullName: "Apertura a la Experiencia" },
    { factor: "Responsabilidad", value: results.C, fullName: "Responsabilidad" },
    { factor: "Extraversión", value: results.E, fullName: "Extraversión" },
    { factor: "Amabilidad", value: results.A, fullName: "Amabilidad" },
    { factor: "Neuroticismo", value: 100 - results.N, fullName: "Estabilidad Emocional" }, // Inverted for better visualization
  ]

  const barData = [
    { name: "Apertura", value: results.O, color: "#8B5CF6" },
    { name: "Responsabilidad", value: results.C, color: "#06B6D4" },
    { name: "Extraversión", value: results.E, color: "#10B981" },
    { name: "Amabilidad", value: results.A, color: "#F59E0B" },
    { name: "Estabilidad", value: 100 - results.N, color: "#EF4444" },
  ]

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return { label: "Muy Alto", color: "bg-green-500" }
    if (score >= 60) return { label: "Alto", color: "bg-blue-500" }
    if (score >= 40) return { label: "Moderado", color: "bg-yellow-500" }
    if (score >= 20) return { label: "Bajo", color: "bg-orange-500" }
    return { label: "Muy Bajo", color: "bg-red-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resultados Big Five</h1>
              <p className="text-gray-600">Análisis completo de los cinco factores de personalidad</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDemo && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Modo Demo
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="detailed">Análisis Detallado</TabsTrigger>
            <TabsTrigger value="ai-coach">
              <Sparkles className="h-4 w-4 mr-2" />
              Coach IA
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Sparkles className="h-4 w-4 mr-2" />
              Insights IA
            </TabsTrigger>
            <TabsTrigger value="career">Carrera</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Perfil de Personalidad Big Five
                  </CardTitle>
                  <CardDescription>Visualización de los cinco factores principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Puntuación",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="factor" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Big Five"
                          dataKey="value"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Puntuaciones por Factor
                  </CardTitle>
                  <CardDescription>Comparación detallada de cada dimensión</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Puntuación",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Desglose de Puntuaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {radarData.map((item) => {
                    const interpretation = getScoreInterpretation(item.value)
                    return (
                      <div key={item.factor} className="text-center p-4 border rounded-lg">
                        <div
                          className={`w-16 h-16 rounded-full ${interpretation.color} mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl`}
                        >
                          {item.value}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{item.fullName}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {interpretation.label}
                        </Badge>
                        <Progress value={item.value} className="mt-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  Resumen de Personalidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{results.personality_summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Rasgos Principales
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.primary_traits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Rasgos Secundarios
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.secondary_traits.map((trait, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Fortalezas Identificadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Áreas de Desarrollo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.development_areas.map((area, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* AI Interpretation */}
            {!isDemo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Interpretación con IA
                  </CardTitle>
                  <CardDescription>Análisis personalizado generado por inteligencia artificial</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAI ? (
                    <div className="flex items-center gap-3 py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="text-gray-600">Generando interpretación personalizada...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{aiInterpretation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Coach Tab */}
          <TabsContent value="ai-coach" className="space-y-6">
            {!isDemo ? (
              <AICoachChat userEmail={userEmail} initialContext={JSON.stringify(results)} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Coach IA no disponible en modo demo</h3>
                  <p className="text-gray-600 mb-4">Completa el test real para acceder al coach personalizado</p>
                  <Button onClick={() => router.push("/test/big-five")}>
                    <Brain className="h-4 w-4 mr-2" />
                    Realizar Test Real
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {!isDemo ? (
              <AIInsightsPanel userEmail={userEmail} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Insights IA no disponibles en modo demo</h3>
                  <p className="text-gray-600 mb-4">Completa el test real para generar insights personalizados</p>
                  <Button onClick={() => router.push("/test/big-five")}>
                    <Brain className="h-4 w-4 mr-2" />
                    Realizar Test Real
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Recomendaciones de Carrera
                </CardTitle>
                <CardDescription>Roles profesionales ideales basados en tu perfil Big Five</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.career_recommendations.map((career, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{career}</h3>
                            <Badge variant="secondary" className="mt-1">
                              Recomendado
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Compatibilidad en Equipos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Trabajas mejor con:</h4>
                      <p className="text-green-700 text-sm">
                        Personas organizadas y orientadas a objetivos que valoren la creatividad y la innovación.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Tu rol ideal en equipos:</h4>
                      <p className="text-blue-700 text-sm">
                        Generador de ideas, organizador de proyectos y facilitador de comunicación entre miembros del
                        equipo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Plan de Desarrollo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Próximos 30 días</h4>
                        <p className="text-gray-600 text-sm">
                          Identifica oportunidades para liderar proyectos creativos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Próximos 90 días</h4>
                        <p className="text-gray-600 text-sm">Desarrolla habilidades de gestión de conflictos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Próximos 6 meses</h4>
                        <p className="text-gray-600 text-sm">Busca roles con mayor responsabilidad estratégica</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function BigFiveResults() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <BigFiveResultsContent />
    </Suspense>
  )
}
