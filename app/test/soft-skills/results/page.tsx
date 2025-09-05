"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { getTestResult, getOpenResponses, type TestResult, type OpenResponse } from "@/lib/supabase"
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
} from "recharts"
import { AiInsightsPanel } from "@/components/ai-insights-panel"
import { AiCoachChat } from "@/components/ai-coach-chat"

const categoryIcons = {
  communication: MessageSquare,
  leadership: Target,
  teamwork: Users,
  problem_solving: Lightbulb,
  adaptability: Brain,
  emotional_intelligence: Heart,
  time_management: Clock,
  critical_thinking: CheckCircle,
}

const categoryColors = {
  communication: "#3B82F6",
  leadership: "#8B5CF6",
  teamwork: "#10B981",
  problem_solving: "#F59E0B",
  adaptability: "#14B8A6",
  emotional_intelligence: "#EC4899",
  time_management: "#6366F1",
  critical_thinking: "#EF4444",
}

const categoryNames = {
  communication: "Comunicación",
  leadership: "Liderazgo",
  teamwork: "Trabajo en Equipo",
  problem_solving: "Resolución de Problemas",
  adaptability: "Adaptabilidad",
  emotional_intelligence: "Inteligencia Emocional",
  time_management: "Gestión del Tiempo",
  critical_thinking: "Pensamiento Crítico",
}

export default function SoftSkillsResults() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [openResponses, setOpenResponses] = useState<OpenResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userEmail = "demo@example.com"

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const [result, responses] = await Promise.all([
        getTestResult(userEmail, "soft-skills"),
        getOpenResponses(userEmail, "soft-skills"),
      ])

      setTestResult(result)
      setOpenResponses(responses)
    } catch (err) {
      setError("Error loading results. Please try again.")
      console.error("Error loading results:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (error || !testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600 mb-4">{error || "No se encontraron resultados"}</div>
            <Button onClick={loadResults} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados: Habilidades Blandas</h1>
          <p className="text-gray-600">Análisis completo de tus competencias profesionales</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">{results.overall_score}%</div>
              <div className="text-xl text-gray-600 mb-4">Puntuación General</div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {getScoreLabel(results.overall_score)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="competencies">Competencias</TabsTrigger>
            <TabsTrigger value="insights">Análisis IA</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Puntuaciones por Competencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} fontSize={12} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Perfil de Competencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" fontSize={10} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} />
                      <Radar name="Puntuación" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Award className="h-5 w-5" />
                    Fortalezas Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.strengths?.slice(0, 3).map((strength: string, index: number) => {
                      const CategoryIcon = categoryIcons[strength as keyof typeof categoryIcons]
                      const score = categoryScores[strength]
                      return (
                        <div key={strength} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-green-600">{index + 1}.</div>
                            {CategoryIcon && <CategoryIcon className="h-5 w-5 text-green-600" />}
                            <span className="font-medium">{categoryNames[strength as keyof typeof categoryNames]}</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {score}%
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingUp className="h-5 w-5" />
                    Áreas de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.areas_for_improvement?.slice(0, 3).map((area: string, index: number) => {
                      const CategoryIcon = categoryIcons[area as keyof typeof categoryIcons]
                      const score = categoryScores[area]
                      return (
                        <div key={area} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-orange-600">{index + 1}.</div>
                            {CategoryIcon && <CategoryIcon className="h-5 w-5 text-orange-600" />}
                            <span className="font-medium">{categoryNames[area as keyof typeof categoryNames]}</span>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            {score}%
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competencies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoryScores).map(([category, score]) => {
                const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
                const categoryName = categoryNames[category as keyof typeof categoryNames]
                const color = categoryColors[category as keyof typeof categoryColors]

                return (
                  <Card key={category} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {CategoryIcon && <CategoryIcon className="h-6 w-6" style={{ color }} />}
                          <CardTitle className="text-lg">{categoryName}</CardTitle>
                        </div>
                        <Badge variant="secondary" className={`${getScoreColor(score)} font-bold`}>
                          {score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={score} className="h-3 mb-3" />
                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-2">{getScoreLabel(score)}</div>
                        <div className="text-xs">
                          {score >= 80 && "Excelente dominio de esta competencia"}
                          {score >= 60 && score < 80 && "Buen nivel, con oportunidades de mejora"}
                          {score < 60 && "Área prioritaria para desarrollo"}
                        </div>
                      </div>
                    </CardContent>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: color, opacity: 0.3 }}
                    />
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <AiInsightsPanel testType="soft-skills" testResult={testResult} openResponses={openResponses} />
          </TabsContent>

          <TabsContent value="coach">
            <AiCoachChat
              testType="soft-skills"
              testResult={testResult}
              context="Soy tu coach de desarrollo de habilidades blandas. Puedo ayudarte a mejorar tus competencias profesionales basándome en los resultados de tu evaluación."
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => (window.location.href = "/test/soft-skills")} variant="outline">
            Repetir Test
          </Button>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Volver al Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
