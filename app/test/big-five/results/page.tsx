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
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"

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
          <TabsList className="grid w-full grid-cols-6">
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
            <SofiaDaniCoach
              conversationCategory="autoconocimiento"
              userContext={{
                testType: "Big Five",
                testResults: results,
                userEmail: userEmail,
                completedAt: testResult.completed_at,
              }}
              suggestedAction={`Explora el test RIASEC para descubrir carreras alineadas con tu personalidad`}
            />
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
        </Tabs>
      </div>
    </div>
  )
}
