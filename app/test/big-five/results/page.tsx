"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user" // Import useUser hook
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  MessageSquare,
  BarChart3,
  PieChart,
  Radar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
  Legend,
  Pie, // Import Pie from recharts
} from "recharts"
import { AiInsightsPanel } from "@/components/ai-insights-panel"
import { MultiTestInsights } from "@/components/multi-test-insights"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

interface TestResult {
  id: number
  user_email: string
  test_type: string
  test_name: string
  results: any
  score: number
  completed_at: string
  duration_minutes: number
}

interface AiInterpretation {
  id: number
  user_email: string
  test_name: string
  interpretation: string
  generated_at: string
  model_version: string
}

const factorNames = {
  O: "Apertura a la Experiencia",
  C: "Responsabilidad",
  E: "Extraversión",
  A: "Amabilidad",
  N: "Neuroticismo",
}

const factorDescriptions = {
  O: "Creatividad, curiosidad intelectual y apertura a nuevas experiencias",
  C: "Organización, disciplina y orientación hacia objetivos",
  E: "Sociabilidad, asertividad y búsqueda de estimulación",
  A: "Cooperación, confianza y orientación prosocial",
  N: "Tendencia a experimentar emociones negativas y estrés",
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"]

export default function BigFiveResults() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [aiInterpretation, setAiInterpretation] = useState<AiInterpretation | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("summary")

  const { session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { user } = useUser() // Use user hook

  useEffect(() => {
    loadResults()
  }, [user])

  const loadResults = async () => {
    if (!user?.email) {
      router.push("/auth")
      return
    }

    setLoading(true)
    try {
      const email = user.email
      const result = await UnifiedTestSystem.loadTestResult(email, "5 Dimensiones Despega")

      if (result.success && result.data) {
        setTestResult(result.data)

        const { data: aiData, error: aiError } = await supabase
          .from("ai_interpretations")
          .select("*")
          .eq("user_email", email)
          .eq("test_name", "5 Dimensiones Despega")
          .order("generated_at", { ascending: false })
          .limit(1)

        if (aiError) {
          console.error("Error loading AI interpretation:", aiError)
        } else if (aiData && aiData.length > 0) {
          setAiInterpretation(aiData[0])
        }
      } else {
        toast({
          title: "No se encontraron resultados",
          description: "No tienes resultados guardados para este test.",
          variant: "destructive",
        })
        router.push("/test/big-five")
      }
    } catch (error) {
      console.error("[v0] Error loading results:", error)
      toast({
        title: "Error al cargar resultados",
        description: "Hubo un problema cargando tus resultados.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Cargando Resultados</h3>
            <p className="text-gray-600">Preparando tu análisis personalizado...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Parece que aún no has completado el Test Big Five.</p>
            <Button onClick={() => router.push("/test/big-five")} className="bg-purple-600 hover:bg-purple-700">
              Realizar Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const results = testResult.results
  const radarData = [
    { factor: "Apertura", value: results.O, fullMark: 100 },
    { factor: "Responsabilidad", value: results.C, fullMark: 100 },
    { factor: "Extraversión", value: results.E, fullMark: 100 },
    { factor: "Amabilidad", value: results.A, fullMark: 100 },
    { factor: "Estabilidad", value: 100 - results.N, fullMark: 100 },
  ]

  const barData = [
    { name: "Apertura", value: results.O, color: "#8884d8" },
    { name: "Responsabilidad", value: results.C, color: "#82ca9d" },
    { name: "Extraversión", value: results.E, color: "#ffc658" },
    { name: "Amabilidad", value: results.A, color: "#ff7c7c" },
    { name: "Estabilidad", value: 100 - results.N, color: "#8dd1e1" },
  ]

  const pieData = [
    { name: "Apertura", value: results.O, color: "#8884d8" },
    { name: "Responsabilidad", value: results.C, color: "#82ca9d" },
    { name: "Extraversión", value: results.E, color: "#ffc658" },
    { name: "Amabilidad", value: results.A, color: "#ff7c7c" },
    { name: "Estabilidad", value: 100 - results.N, color: "#8dd1e1" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <Badge variant="secondary">
            <Brain className="h-4 w-4 mr-1" />5 Dimensiones Despega
          </Badge>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Resultados: 5 Dimensiones Despega</h1>
        <p className="text-gray-600 mb-8">Tu perfil completo de personalidad según las cinco grandes dimensiones</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Análisis
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Análisis IA
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Coach IA
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Carrera
            </TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="conexiones">Conexiones</TabsTrigger>
            <TabsTrigger value="reflexion">Reflexión</TabsTrigger>
            <TabsTrigger value="plan-90-dias">Plan 90 Días</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(factorNames).map(([key, name]) => {
                const score = key === "N" ? 100 - results[key] : results[key]
                const displayName = key === "N" ? "Estabilidad Emocional" : name
                return (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{displayName}</CardTitle>
                      <CardDescription className="text-sm">
                        {factorDescriptions[key as keyof typeof factorDescriptions]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-purple-800">{score}%</span>
                        <Badge
                          variant={score >= 70 ? "default" : score >= 40 ? "secondary" : "outline"}
                          className={
                            score >= 70
                              ? "bg-green-100 text-green-700"
                              : score >= 40
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {score >= 70 ? "Alto" : score >= 40 ? "Medio" : "Bajo"}
                        </Badge>
                      </div>
                      <Progress value={score} className="h-2" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Rasgos Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.primary_traits?.map((trait: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Fortalezas Identificadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.strengths?.slice(0, 3).map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="h-5 w-5" />
                    Perfil de Personalidad (Radar)
                  </CardTitle>
                  <CardDescription>Vista general de todos los factores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <RechartsRadar
                        name="Puntuación"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Puntuaciones por Factor (Barras)
                  </CardTitle>
                  <CardDescription>Comparación directa de puntuaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Factores (Circular)
                </CardTitle>
                <CardDescription>Proporción relativa de cada factor</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Detallado por Factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {Object.entries(results.detailed_analysis || {}).map(([factor, analysis]) => (
                        <div key={factor} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold text-purple-800 mb-2">
                            {factorNames[factor.charAt(0).toUpperCase() as keyof typeof factorNames] || factor}
                          </h4>
                          <p className="text-sm text-gray-700">{analysis as string}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Respuestas Abiertas</CardTitle>
                  <CardDescription>Tus respuestas a las preguntas de desarrollo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {results.open_responses &&
                        Object.entries(results.open_responses).map(([questionId, response]) => (
                          <div key={questionId} className="border-b pb-4 last:border-b-0">
                            <h4 className="font-semibold text-purple-800 mb-2">Pregunta {questionId}</h4>
                            <p className="text-sm text-gray-700 italic">"{response as string}"</p>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Áreas de Desarrollo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.development_areas?.map((area: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis">
            <div className="space-y-6">
              <MultiTestInsights userEmail={userEmail} currentTestType="Big Five" />
              <AiInsightsPanel
                testType="Big Five"
                testResults={results}
                aiInterpretation={aiInterpretation?.interpretation}
                userEmail={userEmail}
              />
            </div>
          </TabsContent>

          <TabsContent value="coach">
            <EnhancedCoachFlow testType="Big Five" testResults={results} />
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Recomendaciones Profesionales
                  </CardTitle>
                  <CardDescription>Roles que se alinean con tu perfil de personalidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.career_recommendations?.map((career: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Resumen de Personalidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{results.personality_summary}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-800">Rasgos Secundarios:</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.secondary_traits?.map((trait: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  Plan de Acción Personalizado
                </CardTitle>
                <CardDescription>Pasos recomendados para tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">Fortalezas a Potenciar:</h4>
                    <ul className="space-y-2">
                      {results.strengths?.slice(0, 3).map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-3">Áreas de Mejora:</h4>
                    <ul className="space-y-2">
                      {results.development_areas?.slice(0, 3).map((area: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  Oportunidades de Desarrollo
                </CardTitle>
                <CardDescription>Áreas específicas donde puedes crecer basadas en tu perfil Big Five</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué estas oportunidades son relevantes para ti</h3>
                  <p className="text-sm text-gray-700">
                    Tu perfil Big Five con Apertura: {results.O}%, Responsabilidad: {results.C}%, Extraversión:{" "}
                    {results.E}%, Amabilidad: {results.A}%, Estabilidad Emocional: {100 - results.N}% revela patrones
                    únicos de tu personalidad profunda. Estas oportunidades están diseñadas para potenciar tus rasgos
                    naturales y desarrollar áreas que amplíen tu efectividad personal y profesional.
                  </p>
                </div>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      1. Desarrollo de Apertura Mental
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-blue-800">
                        {results.O > 70
                          ? "Canalizar tu alta apertura hacia proyectos innovadores que generen impacto real en tu comunidad o industria."
                          : results.O < 40
                            ? "Expandir tu zona de confort explorando nuevas perspectivas, culturas y formas de pensar sin juzgar prematuramente."
                            : "Balancear tu apertura moderada con momentos de exploración activa y períodos de consolidación práctica."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Reto de Perspectivas (semanal):</strong> Lee un artículo de opinión con el que
                            normalmente no estarías de acuerdo e identifica 3 puntos válidos.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Experiencia Cultural:</strong> Una vez al mes, sumérgete en una expresión cultural
                            completamente nueva (música, cocina, arte, filosofía).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Diario de Ideas:</strong> Dedica 10 minutos diarios a escribir ideas creativas sin
                            filtro, sin preocuparte por su viabilidad.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                      2. Fortalecimiento de Responsabilidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-green-800">
                        {results.C > 70
                          ? "Usar tu alta disciplina para enseñar sistemas de productividad a otros, consolidando tu maestría."
                          : results.C < 40
                            ? "Desarrollar estructuras mínimas viables que te den libertad sin caer en el caos."
                            : "Optimizar tu nivel actual de organización identificando el 20% de hábitos que generan el 80% de resultados."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Sistema de 3 Prioridades:</strong> Cada mañana, identifica solo 3 cosas no
                            negociables para el día.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Revisión Semanal:</strong> Dedica 30 minutos cada domingo a revisar logros y ajustar
                            la próxima semana.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Accountability Partner:</strong> Encuentra alguien con quien compartir metas
                            semanales y hacer check-ins.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      3. Expansión de Conexión Social (Extraversión)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-purple-800">
                        {results.E > 70
                          ? "Convertir tu energía social en liderazgo de comunidad, creando espacios donde otros también puedan conectar."
                          : results.E < 40
                            ? "Desarrollar conexiones profundas 1-a-1 que te nutran sin agotarte, respetando tu necesidad de soledad."
                            : "Alternar intencionalmente entre momentos de conexión social activa y períodos de recarga en soledad."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Mapeo de Energía Social:</strong> Durante una semana, registra qué interacciones te
                            energizan vs. te agotan.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Círculo Intencional:</strong> Identifica 5 personas clave con quienes quieres
                            profundizar relación y programa tiempo mensual con cada una.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Experimento Social:</strong> Si eres introvertido, prueba una actividad grupal
                            nueva. Si eres extrovertido, pasa un día completo en soledad reflexiva.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-orange-600" />
                      4. Cultivo de Estabilidad Emocional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-orange-800">
                        {results.N < 30
                          ? "Usar tu estabilidad para ser ancla emocional de otros en momentos de crisis, desarrollando liderazgo resiliente."
                          : results.N > 70
                            ? "Desarrollar herramientas de regulación emocional que te permitan navegar la intensidad sin ser abrumado."
                            : "Fortalecer tu capacidad de mantener calma en presión sin perder la sensibilidad emocional."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Práctica de Mindfulness (diaria):</strong> 5 minutos de respiración consciente antes
                            de eventos estresantes.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Diario de Emociones:</strong> Al final del día, nombra 3 emociones que sentiste y
                            qué las provocó, sin juzgarlas.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Red de Apoyo:</strong> Identifica 2-3 personas de confianza con quienes puedas
                            hablar cuando te sientas emocionalmente desbordado.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold mb-1">Recurso Recomendado DTC</p>
                          <p className="text-sm opacity-90">Test de Inteligencia Emocional Despega</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => router.push("/test/emotional-intelligence")}
                        >
                          Hacer Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Próximo Paso</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Elige UNA oportunidad que resuene contigo y conviértela en un compromiso de 30 días. El cambio real
                    viene de la acción consistente.
                  </p>
                  <Button variant="secondary" size="sm">
                    Crear Plan de Acción
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conexiones" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>Cómo Big Five se integra con los demás tests del ecosistema DTC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">El Mapa Completo de Tu Personalidad</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Big Five mide los rasgos profundos de tu personalidad, la base sobre la cual se construyen tus
                    comportamientos (DISC), emociones (IE), preferences (MBTI), intereses (RIASEC) y habilidades (Soft
                    Skills). Es la arquitectura fundamental de quién eres.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                          💼
                        </div>
                        Despega Cerebral (DISC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <strong className="text-blue-900">Conexión:</strong>
                        <p className="text-blue-800 mt-1">
                          Big Five mide RASGOS profundos, DISC mide COMPORTAMIENTOS visibles. Tus rasgos influyen en
                          cómo te comportas.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta Extraversión (Big Five) + Alto I (DISC) = Comunicador natural
                        energético. Alta Extraversión + Bajo I = Energía social que no se traduce en influencia.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/disc")}
                      >
                        Hacer Test DISC
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-lg">
                          ❤️
                        </div>
                        Inteligencia Emocional Despega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-red-50 p-3 rounded text-sm">
                        <strong className="text-red-900">Conexión:</strong>
                        <p className="text-red-800 mt-1">
                          Big Five muestra tu TENDENCIA emocional natural (Neuroticismo), IE mide tu HABILIDAD para
                          manejar emociones.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alto Neuroticismo + Alta IE = Sientes intensamente pero sabes
                        regularte. Bajo Neuroticismo + Baja IE = Estable pero desconectado emocionalmente.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/emotional-intelligence")}
                      >
                        Hacer Test IE
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                          🧠
                        </div>
                        Mapa de Personalidad Despega (MBTI)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-purple-50 p-3 rounded text-sm">
                        <strong className="text-purple-900">Conexión:</strong>
                        <p className="text-purple-800 mt-1">
                          Big Five es DIMENSIONAL (grados), MBTI es TIPOLÓGICO (categorías). Se complementan, no
                          compiten.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta Extraversión + INTJ = Líder visionario que disfruta debates
                        intelectuales. Baja Extraversión + ENFP = Creativo introspectivo con conexiones profundas.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/mbti")}
                      >
                        Hacer Test MBTI
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
                          🎯
                        </div>
                        Brújula Vocacional Despega (RIASEC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green-50 p-3 rounded text-sm">
                        <strong className="text-green-900">Conexión:</strong>
                        <p className="text-green-800 mt-1">
                          Big Five predice qué AMBIENTES laborales encajan contigo, RIASEC predice qué ACTIVIDADES te
                          motivan.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta Apertura + tipo Artístico = Diseñador innovador. Alta
                        Responsabilidad + tipo Convencional = Auditor financiero de élite.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/riasec")}
                      >
                        Hacer Test RIASEC
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                          💡
                        </div>
                        Competencias Blandas Despega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded text-sm">
                        <strong className="text-yellow-900">Conexión:</strong>
                        <p className="text-yellow-800 mt-1">
                          Big Five muestra PREDISPOSICIONES naturales, Soft Skills mide COMPETENCIAS desarrolladas a
                          través de experiencia.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Baja Amabilidad + Alta empatía entrenada = Líder directo pero
                        empático. Alta Amabilidad + Baja asertividad = Necesita entrenar límites.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/soft-skills")}
                      >
                        Hacer Test Soft Skills
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Casos de Sinergia Big Five + Otros Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 1: El Innovador Estructurado</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Big Five:</strong> Alta Apertura + Alta Responsabilidad = Creativo disciplinado
                        </li>
                        <li>
                          • <strong>DISC:</strong> Alto D + Alto C = Ejecutor perfeccionista
                        </li>
                        <li>
                          • <strong>RIASEC:</strong> Investigador + Emprendedor = Fundador de startup tech
                        </li>
                        <li>
                          • <strong>Insight DTC:</strong> Puede crear innovación sistemática, pero necesita equipo que
                          ejecute detalles
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 2: El Líder Empático</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Big Five:</strong> Alta Amabilidad + Baja Extraversión = Líder servicial
                          introvertido
                        </li>
                        <li>
                          • <strong>IE:</strong> Alta empatía + Alta regulación emocional
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Alta escucha activa, baja auto-promoción
                        </li>
                        <li>
                          • <strong>Insight DTC:</strong> Excelente para liderar equipos técnicos, necesita trabajar
                          visibilidad
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 3: El Ejecutor Volátil</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Big Five:</strong> Alta Responsabilidad + Alto Neuroticismo = Perfeccionista ansioso
                        </li>
                        <li>
                          • <strong>DISC:</strong> Alto C + Bajo S = Crítico con otros y consigo mismo
                        </li>
                        <li>
                          • <strong>IE:</strong> Baja regulación emocional bajo presión
                        </li>
                        <li>
                          • <strong>Insight DTC:</strong> Alto desempeño pero riesgo de burnout. Urgente desarrollar IE
                          y prácticas de autocuidado
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Recomendación DTC</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Big Five es tu fundamento. Para obtener el mapa completo, combínalo con DISC (comportamiento
                    laboral) + IE (manejo emocional). Esto te da una visión 360 grados de ti mismo.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/test")}>
                    Ver Todos los Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflexion" className="space-y-6">
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-pink-600" />
                  Preguntas de Reflexión Profunda
                </CardTitle>
                <CardDescription>Conecta tu perfil Big Five con tu vida real y propósito</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué reflexionar sobre tu perfil Big Five</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Big Five no es solo estadística, es el mapa de tu arquitectura psicológica. Estas preguntas te
                    ayudan a traducir los números en autoconocimiento aplicado: cómo tus rasgos moldean tus decisiones,
                    relaciones y camino de vida.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        1. ¿Cuál de los 5 factores siento que me define más auténticamente? ¿Por qué?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Reflexiona sobre cuál dimensión (Apertura, Responsabilidad, Extraversión, Amabilidad,
                        Estabilidad) resuena más profundamente con tu identidad.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        2. ¿En qué momentos de mi vida he actuado completamente FUERA de mi perfil Big Five natural?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Identifica situaciones donde te comportaste de forma contraria a tus rasgos. ¿Qué provocó ese
                        cambio? ¿Fue positivo o costoso?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        3. Si pudiera "ajustar" UNO de mis rasgos Big Five, ¿cuál sería y hacia qué dirección?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        No para cambiarte, sino para entender qué aspecto de ti sientes que limita tu potencial. ¿Es
                        real o es juicio externo?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        4. ¿Cómo mi perfil Big Five ha afectado mis relaciones más importantes (pareja, familia,
                        amigos)?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Ejemplo: Baja Amabilidad puede causar conflictos pero también establecer límites sanos. Alta
                        Amabilidad puede crear armonía pero también sacrificar necesidades propias.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        5. ¿Qué decisiones importantes he tomado que fueron ALINEADAS vs. CONTRA mi perfil Big Five?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Carreras, relaciones, lugares de vida. ¿Cuáles resultaron mejor? Esto revela cuándo seguir tu
                        naturaleza vs. cuándo crecer más allá de ella.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        6. ¿Hay algún rasgo Big Five que la gente malinterpreta sobre mí?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Ejemplo: Baja Extraversión no es timidez, es preferencia por profundidad. Alta Apertura no es
                        falta de practicidad, es capacidad de ver posibilidades.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        7. ¿Qué tipo de persona admiro que tenga un perfil Big Five OPUESTO al mío?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Si eres highly Responsable, quizás admiras a alguien espontáneo. Si eres muy Estable, quizás
                        admiras la pasión emocional de alguien. ¿Qué te enseña eso sobre lo que necesitas integrar?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        8. ¿Mi trabajo actual me permite expresar mis rasgos Big Five naturales o me obliga a
                        reprimirlos?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Si tu trabajo contradice constantemente tus rasgos, el costo emocional será alto. ¿Es temporal o
                        insostenible?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        9. ¿Cuál de mis rasgos Big Five ha sido mi mayor FORTALEZA y mi mayor DEBILIDAD simultáneamente?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Ejemplo: Alta Responsabilidad = éxito profesional pero también rigidez. Alta Amabilidad =
                        relaciones profundas pero dificultad para decir no.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple-900">
                        10. Si tuviera que diseñar mi vida IDEAL basándome únicamente en mi perfil Big Five, ¿cómo se
                        vería?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Describe tu día típico, tipo de trabajo, relaciones, hobbies, entorno. ¿Qué tan diferente es de
                        tu vida actual? ¿Qué puedes empezar a cambiar YA?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Comparte tu reflexión con tu Coach IA</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Las preguntas profundas se responden mejor en conversación. Habla con Sofia o Dani para explorar tus
                    respuestas y descubrir patrones que no habías visto.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                    Hablar con Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Plan de Acción 90 Días - Desarrollo de Rasgos Big Five
                </CardTitle>
                <CardDescription>
                  Optimiza tus rasgos de personalidad con acciones concretas durante los próximos 3 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progreso Total del Plan</span>
                    <span className="text-sm text-muted-foreground">0/12 semanas completadas</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {/* Mes 1: Apertura y Responsabilidad */}
                  <AccordionItem value="mes-1">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          1
                        </div>
                        Mes 1: Apertura a la Experiencia y Responsabilidad
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Desarrolla tu curiosidad intelectual y tu capacidad de organización
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 1-2: Expandir Apertura</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s1-1" />
                                <label htmlFor="bf-m1s1-1">
                                  Leer un libro de un género completamente nuevo para ti
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s1-2" />
                                <label htmlFor="bf-m1s1-2">Probar una actividad artística o creativa nueva</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s1-3" />
                                <label htmlFor="bf-m1s1-3">
                                  Tener una conversación profunda sobre filosofía o ideas abstractas
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 3-4: Fortalecer Responsabilidad</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s2-1" />
                                <label htmlFor="bf-m1s2-1">
                                  Implementar un sistema de organización personal (GTD, Bullet Journal, etc.)
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s2-2" />
                                <label htmlFor="bf-m1s2-2">
                                  Establecer y cumplir 3 metas pequeñas con fechas límite
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s2-3" />
                                <label htmlFor="bf-m1s2-3">Crear una rutina matutina y mantenerla por 2 semanas</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Completar 3 experiencias nuevas y establecer sistema de
                          organización
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 2: Extraversión y Amabilidad */}
                  <AccordionItem value="mes-2">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          2
                        </div>
                        Mes 2: Extraversión y Amabilidad
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Mejora tus habilidades sociales y tu capacidad de conexión con otros
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 5-6: Desarrollar Extraversión</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s1-1" />
                                <label htmlFor="bf-m2s1-1">Iniciar conversación con 2 personas nuevas por semana</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s1-2" />
                                <label htmlFor="bf-m2s1-2">Asistir a un evento social o networking</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s1-3" />
                                <label htmlFor="bf-m2s1-3">
                                  Practicar hablar en público (reunión, presentación informal)
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 7-8: Cultivar Amabilidad</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s2-1" />
                                <label htmlFor="bf-m2s2-1">Realizar 3 actos de bondad aleatorios por semana</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s2-2" />
                                <label htmlFor="bf-m2s2-2">
                                  Practicar dar feedback constructivo a colegas o amigos
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s2-3" />
                                <label htmlFor="bf-m2s2-3">Meditar sobre compasión o practicar gratitud diaria</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Expandir red de contactos en 5 personas, 12 actos de bondad
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 3: Neuroticismo y Estabilidad */}
                  <AccordionItem value="mes-3">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          3
                        </div>
                        Mes 3: Estabilidad Emocional e Integración
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Fortalece tu resiliencia emocional e integra todos los rasgos
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 9-10: Reducir Neuroticismo</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s1-1" />
                                <label htmlFor="bf-m3s1-1">
                                  Establecer práctica diaria de mindfulness (10 min/día)
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s1-2" />
                                <label htmlFor="bf-m3s1-2">
                                  Identificar y desafiar 5 patrones de pensamiento negativo
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s1-3" />
                                <label htmlFor="bf-m3s1-3">Crear un plan de manejo del estrés personalizado</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 11-12: Integración de los 5 Rasgos</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s2-1" />
                                <label htmlFor="bf-m3s2-1">
                                  Crear perfil integrado de tus 5 rasgos con fortalezas y áreas de mejora
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s2-2" />
                                <label htmlFor="bf-m3s2-2">
                                  Diseñar plan de desarrollo continuo basado en tu perfil Big Five
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s2-3" />
                                <label htmlFor="bf-m3s2-3">Compartir aprendizajes con alguien de confianza</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Plan de manejo del estrés activo + perfil Big Five integrado
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
