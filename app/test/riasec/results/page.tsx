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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import AICoachChat from "@/components/ai-coach-chat"
import AIInsightsPanel from "@/components/ai-insights-panel"
import { aiCoach } from "@/lib/ai-coach"
import {
  ArrowLeft,
  Target,
  Compass,
  TrendingUp,
  Award,
  BookOpen,
  Lightbulb,
  Heart,
  Zap,
  Shield,
  Sparkles,
  Download,
  Share2,
  Building,
  Briefcase,
  Star,
} from "lucide-react"

interface RIASECResult {
  R: number // Realistic
  I: number // Investigative
  A: number // Artistic
  S: number // Social
  E: number // Enterprising
  C: number // Conventional
  primary_interests: string[]
  secondary_interests: string[]
  holland_code: string
  personality_summary: string
  career_recommendations: string[]
  work_environments: string[]
  development_areas: string[]
  strengths: string[]
  work_values: string[]
}

function RIASECResultsContent() {
  const [results, setResults] = useState<RIASECResult | null>(null)
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
        .eq("test_name", "RIASEC")
        .order("completed_at", { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setResults(data[0].results)
        await generateAIInterpretation(email, data[0].results)
      } else {
        // No results found, redirect to test
        router.push("/test/riasec")
      }
    } catch (error) {
      console.error("Error loading results:", error)
      router.push("/test/riasec")
    } finally {
      setLoading(false)
    }
  }

  const loadDemoResults = () => {
    const demoResults: RIASECResult = {
      R: 65, // Realistic
      I: 85, // Investigative
      A: 75, // Artistic
      S: 70, // Social
      E: 80, // Enterprising
      C: 60, // Conventional
      primary_interests: ["Investigativo", "Emprendedor", "Artístico"],
      secondary_interests: ["Social"],
      holland_code: "IEA",
      personality_summary:
        "Perfil de innovador emprendedor con fuerte orientación hacia la investigación y la creatividad.",
      career_recommendations: [
        "Consultor de Innovación",
        "Director de I+D",
        "Emprendedor Tecnológico",
        "Arquitecto de Soluciones",
        "Product Manager",
        "Consultor de Estrategia",
      ],
      work_environments: [
        "Startups tecnológicas",
        "Departamentos de innovación",
        "Consultorías estratégicas",
        "Centros de investigación aplicada",
        "Empresas de diseño y creatividad",
      ],
      development_areas: [
        "Desarrollar mayor paciencia con procesos rutinarios",
        "Mejorar habilidades de implementación práctica",
        "Fortalecer la atención al detalle en tareas administrativas",
      ],
      strengths: [
        "Excelente capacidad para identificar oportunidades",
        "Habilidad natural para generar ideas innovadoras",
        "Facilidad para conectar conceptos complejos",
        "Motivación intrínseca para resolver problemas",
      ],
      work_values: [
        "Autonomía e independencia",
        "Oportunidades de crecimiento",
        "Impacto y significado del trabajo",
        "Flexibilidad y variedad",
      ],
    }

    setResults(demoResults)
    setUserEmail("demo@example.com")
    setLoading(false)
  }

  const generateAIInterpretation = async (email: string, testResults: RIASECResult) => {
    try {
      setLoadingAI(true)
      const interpretation = await aiCoach.interpretTestResults(email, "RIASEC", testResults)
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus resultados RIASEC...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Completa el test RIASEC para ver tus resultados</p>
            <Button onClick={() => router.push("/test/riasec")}>Realizar Test</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const radarData = [
    { interest: "Realista", value: results.R, fullName: "Realista (R)" },
    { interest: "Investigativo", value: results.I, fullName: "Investigativo (I)" },
    { interest: "Artístico", value: results.A, fullName: "Artístico (A)" },
    { interest: "Social", value: results.S, fullName: "Social (S)" },
    { interest: "Emprendedor", value: results.E, fullName: "Emprendedor (E)" },
    { interest: "Convencional", value: results.C, fullName: "Convencional (C)" },
  ]

  const barData = [
    { name: "Realista", value: results.R, color: "#8B5CF6", description: "Trabajo práctico y manual" },
    { name: "Investigativo", value: results.I, color: "#06B6D4", description: "Análisis e investigación" },
    { name: "Artístico", value: results.A, color: "#10B981", description: "Creatividad y expresión" },
    { name: "Social", value: results.S, color: "#F59E0B", description: "Ayuda y servicio a otros" },
    { name: "Emprendedor", value: results.E, color: "#EF4444", description: "Liderazgo y persuasión" },
    { name: "Convencional", value: results.C, color: "#84CC16", description: "Organización y datos" },
  ]

  const pieData = barData.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }))

  const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#84CC16"]

  const getInterestIcon = (interest: string) => {
    switch (interest) {
      case "Realista":
        return <Zap className="h-5 w-5" />
      case "Investigativo":
        return <Target className="h-5 w-5" />
      case "Artístico":
        return <Lightbulb className="h-5 w-5" />
      case "Social":
        return <Heart className="h-5 w-5" />
      case "Emprendedor":
        return <TrendingUp className="h-5 w-5" />
      case "Convencional":
        return <Shield className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return { label: "Muy Alto", color: "bg-green-500" }
    if (score >= 60) return { label: "Alto", color: "bg-blue-500" }
    if (score >= 40) return { label: "Moderado", color: "bg-yellow-500" }
    if (score >= 20) return { label: "Bajo", color: "bg-orange-500" }
    return { label: "Muy Bajo", color: "bg-red-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resultados RIASEC</h1>
              <p className="text-gray-600">Tu perfil de intereses vocacionales según Holland</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDemo && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
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

        {/* Holland Code Overview */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {results.holland_code}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Código Holland: {results.holland_code}</h2>
                  <p className="text-gray-600">{results.personality_summary}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 mb-2">
                  Intereses Vocacionales
                </Badge>
                <div className="flex flex-wrap gap-1 justify-end">
                  {results.primary_interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    <Compass className="h-5 w-5 text-orange-600" />
                    Perfil de Intereses RIASEC
                  </CardTitle>
                  <CardDescription>Visualización de tus seis áreas de interés vocacional</CardDescription>
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
                        <PolarAngleAxis dataKey="interest" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="RIASEC"
                          dataKey="value"
                          stroke="#F97316"
                          fill="#F97316"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Distribución de Intereses
                  </CardTitle>
                  <CardDescription>Proporción de cada área de interés</CardDescription>
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
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Interest Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Desglose de Intereses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {barData.map((item) => {
                    const interpretation = getScoreInterpretation(item.value)
                    return (
                      <div key={item.name} className="text-center p-4 border rounded-lg">
                        <div className="flex items-center justify-center mb-3">
                          <div
                            className={`w-16 h-16 rounded-full ${interpretation.color} flex items-center justify-center text-white font-bold text-xl`}
                          >
                            {item.value}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {getInterestIcon(item.name)}
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{item.description}</p>
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

            {/* Primary Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  Tus Intereses Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.primary_interests.map((interest, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">{getInterestIcon(interest)}</div>
                          <div>
                            <h3 className="font-semibold text-green-800">{interest}</h3>
                            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                              #{index + 1} Interés
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Puntuaciones Detalladas
                </CardTitle>
                <CardDescription>Comparación de todas las áreas de interés</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Puntuación",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
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
                  <Button onClick={() => router.push("/test/riasec")}>
                    <Compass className="h-4 w-4 mr-2" />
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
                  <Button onClick={() => router.push("/test/riasec")}>
                    <Compass className="h-4 w-4 mr-2" />
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
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Carreras Recomendadas
                </CardTitle>
                <CardDescription>Profesiones que se alinean con tu perfil de intereses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.career_recommendations.map((career, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Briefcase className="h-5 w-5 text-blue-600" />
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
                    <Building className="h-5 w-5 text-green-600" />
                    Ambientes de Trabajo Ideales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.work_environments.map((environment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Building className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-green-800">{environment}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-purple-600" />
                    Valores Laborales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.work_values.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
                      >
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Heart className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-purple-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Plan de Desarrollo Profesional
                </CardTitle>
                <CardDescription>Pasos recomendados para tu crecimiento profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-indigo-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800 mb-1">Próximos 30 días</h4>
                      <p className="text-indigo-700 text-sm">
                        Explora oportunidades en tu área de interés principal ({results.primary_interests[0]})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-indigo-600 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800 mb-1">Próximos 90 días</h4>
                      <p className="text-indigo-700 text-sm">
                        Desarrolla habilidades que combinen tus intereses principales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-indigo-600 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800 mb-1">Próximos 6 meses</h4>
                      <p className="text-indigo-700 text-sm">
                        Busca roles que se alineen con tu código Holland ({results.holland_code})
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function RIASECResults() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <RIASECResultsContent />
    </Suspense>
  )
}
