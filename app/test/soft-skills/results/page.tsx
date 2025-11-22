"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Clock,
  Users,
  MessageSquare,
  Target,
  Heart,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Award,
  ArrowRight,
  BarChart3,
  PieChart,
  ArrowLeft,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts"
import { AiInsightsPanel } from "@/components/ai-insights-panel"
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"

const categoryIcons = {
  comunicacion: MessageSquare,
  liderazgo: Target,
  trabajo_equipo: Users,
  resolucion_problemas: Lightbulb,
  adaptabilidad: Brain,
  inteligencia_emocional: Heart,
  gestion_tiempo: Clock,
  pensamiento_critico: CheckCircle,
}

const categoryColors = {
  comunicacion: "#3B82F6",
  liderazgo: "#8B5CF6",
  trabajo_equipo: "#10B981",
  resolucion_problemas: "#F59E0B",
  adaptabilidad: "#14B8A6",
  inteligencia_emocional: "#EC4899",
  gestion_tiempo: "#6366F1",
  pensamiento_critico: "#EF4444",
}

const categoryNames = {
  comunicacion: "Comunicación",
  liderazgo: "Liderazgo",
  trabajo_equipo: "Trabajo en Equipo",
  resolucion_problemas: "Resolución de Problemas",
  adaptabilidad: "Adaptabilidad",
  inteligencia_emocional: "Inteligencia Emocional",
  gestion_tiempo: "Gestión del Tiempo",
  pensamiento_critico: "Pensamiento Crítico",
}

export default function SoftSkillsResults() {
  const [testResult, setTestResult] = useState<any>(null)
  const [openResponses, setOpenResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const user = session?.user

  useEffect(() => {
    loadResults()
  }, [user])

  const loadResults = async () => {
    try {
      setLoading(true)

      const email = user?.email
      if (!email) {
        toast({
          title: "No autenticado",
          description: "Debes iniciar sesión para ver tus resultados.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const result = await UnifiedTestSystem.loadTestResult(email, "Competencias Blandas Despega")

      if (result.success && result.data) {
        setTestResult(result.data)
      } else {
        toast({
          title: "No se encontraron resultados",
          description: "No tienes resultados guardados para este test.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error loading soft skills results:", error)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resultados: Competencias Blandas Despega</h1>
            <p className="text-xl text-gray-600">No se encontraron resultados para esta evaluación.</p>
          </div>
        </div>
      </div>
    )
  }

  const results = testResult.results
  const categoryScores = results.category_scores || {}

  // Prepare data for charts
  const barChartData = Object.entries(categoryScores).map(([category, score]) => ({
    category: categoryNames[category as keyof typeof categoryNames] || category,
    score: score,
    color: categoryColors[category as keyof typeof categoryColors] || "#6B7280",
  }))

  const radarChartData = Object.entries(categoryScores).map(([category, score]) => ({
    category: categoryNames[category as keyof typeof categoryNames] || category,
    score: score,
    fullMark: 100,
  }))

  const pieChartData = Object.entries(categoryScores).map(([category, score]) => ({
    name: categoryNames[category as keyof typeof categoryNames] || category,
    value: score,
    color: categoryColors[category as keyof typeof categoryColors] || "#6B7280",
  }))

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente"
    if (score >= 60) return "Bueno"
    return "Necesita Mejora"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Tests
          </Button>
          <Badge variant="secondary" className="text-sm">
            Competencias Blandas Despega
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resultados: Competencias Blandas Despega</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tu perfil completo de competencias interpersonales y profesionales
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">{results.overall_score}%</div>
              <div className="text-2xl text-gray-700 mb-4">Puntuación General</div>
              <Badge className={`text-lg px-6 py-2 ${getScoreBadgeColor(results.overall_score)}`}>
                {getScoreLabel(results.overall_score)}
              </Badge>
              <div className="mt-4 max-w-2xl mx-auto">
                <Progress value={results.overall_score} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="competencies" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Competencias
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Análisis IA
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Coach IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Puntuaciones por Competencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={11} interval={0} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Puntuación"]} labelStyle={{ color: "#374151" }} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Perfil de Competencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarChartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" fontSize={10} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} />
                      <Radar
                        name="Puntuación"
                        dataKey="score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Award className="h-5 w-5" />
                    Fortalezas Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.strengths?.slice(0, 3).map((strength: string, index: number) => {
                      const CategoryIcon = categoryIcons[strength as keyof typeof categoryIcons]
                      const score = categoryScores[strength]
                      const analysis = results.detailed_analysis?.[strength]
                      return (
                        <div key={strength} className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                <span className="text-green-700 font-bold text-sm">{index + 1}</span>
                              </div>
                              {CategoryIcon && <CategoryIcon className="h-5 w-5 text-green-600" />}
                              <span className="font-semibold text-green-800">
                                {categoryNames[strength as keyof typeof categoryNames]}
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 font-bold">{score}%</Badge>
                          </div>
                          {analysis && (
                            <div className="text-sm text-green-700 mt-2">
                              <p className="mb-2">{analysis.feedback}</p>
                              <div className="flex flex-wrap gap-1">
                                {analysis.examples?.map((example: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-green-300">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <TrendingUp className="h-5 w-5" />
                    Áreas de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.areas_for_improvement?.slice(0, 3).map((area: string, index: number) => {
                      const CategoryIcon = categoryIcons[area as keyof typeof categoryIcons]
                      const score = categoryScores[area]
                      const analysis = results.detailed_analysis?.[area]
                      return (
                        <div key={area} className="bg-white p-4 rounded-lg border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                                <span className="text-orange-700 font-bold text-sm">{index + 1}</span>
                              </div>
                              {CategoryIcon && <CategoryIcon className="h-5 w-5 text-orange-600" />}
                              <span className="font-semibold text-orange-800">
                                {categoryNames[area as keyof typeof categoryNames]}
                              </span>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 font-bold">{score}%</Badge>
                          </div>
                          {analysis && (
                            <div className="text-sm text-orange-700 mt-2">
                              <p className="mb-2">{analysis.feedback}</p>
                              <div className="flex flex-wrap gap-1">
                                {analysis.examples?.map((example: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-orange-300">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Open Responses Analysis */}
            {openResponses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Análisis de Respuestas Detalladas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {openResponses.map((response) => (
                      <Card key={response.id} className="border-purple-200 bg-purple-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-purple-800">{response.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                            <p className="line-clamp-3">{response.response}</p>
                          </div>
                          {response.ai_analysis && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-purple-700">Análisis IA:</span>
                                <Badge className="bg-purple-100 text-purple-800">{response.ai_analysis.score}%</Badge>
                              </div>
                              <p className="text-xs text-purple-700">{response.ai_analysis.feedback}</p>
                              <div className="flex flex-wrap gap-1">
                                {response.ai_analysis.strengths?.map((strength: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-purple-300">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competencies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoryScores).map(([category, score]) => {
                const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
                const categoryName = categoryNames[category as keyof typeof categoryNames]
                const color = categoryColors[category as keyof typeof categoryColors]
                const analysis = results.detailed_analysis?.[category]

                return (
                  <Card key={category} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {CategoryIcon && <CategoryIcon className="h-6 w-6" style={{ color }} />}
                          <CardTitle className="text-lg">{categoryName}</CardTitle>
                        </div>
                        <Badge className={`font-bold ${getScoreBadgeColor(score)}`}>{score}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={score} className="h-3" />

                      <div className="text-sm">
                        <div className="font-medium mb-2 flex items-center gap-2">
                          <span className={getScoreColor(score)}>{getScoreLabel(score)}</span>
                        </div>

                        {analysis && (
                          <div className="space-y-3">
                            <p className="text-gray-700">{analysis.feedback}</p>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Evidencias:</h4>
                              <div className="flex flex-wrap gap-1">
                                {analysis.examples?.map((example: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: color, opacity: 0.6 }}
                    />
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <AiInsightsPanel testType="soft-skills" results={results} responses={openResponses} />
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <SofiaDaniCoach
              conversationCategory="desarrollo_habilidades"
              userContext={{
                testType: "Soft Skills",
                testResults: results,
                userEmail: testResult.user_email || "",
                completedAt: testResult.completed_at,
              }}
              suggestedAction={`Practica tus habilidades de liderazgo en un proyecto real`}
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-8 border-t">
          <Button
            onClick={() => (window.location.href = "/test/soft-skills")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Repetir Evaluación
          </Button>
          <Button onClick={() => (window.location.href = "/dashboard")} className="flex items-center gap-2">
            Volver al Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => (window.location.href = "/test")}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Otras Evaluaciones
          </Button>
        </div>
      </div>
    </div>
  )
}
