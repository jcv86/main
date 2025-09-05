"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Target,
  Lightbulb,
  Star,
  Award,
  Users,
  Briefcase,
  Brain,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

interface Insight {
  id: string
  type: "strength" | "opportunity" | "recommendation" | "trend"
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  category: string
  actionable: boolean
  relatedTests?: string[]
}

interface AiInsightsPanelProps {
  testResults?: any[]
  userProfile?: any
  className?: string
}

export default function AiInsightsPanel({ testResults = [], userProfile, className }: AiInsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    generateInsights()
  }, [testResults])

  const generateInsights = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to generate insights
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testResults,
          userProfile,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights || [])
      } else {
        // Fallback insights if API fails
        setInsights(generateFallbackInsights())
      }
    } catch (error) {
      console.error("Error generating insights:", error)
      setInsights(generateFallbackInsights())
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackInsights = (): Insight[] => {
    const fallbackInsights: Insight[] = []

    if (testResults.length === 0) {
      return [
        {
          id: "no-tests",
          type: "recommendation",
          title: "Completa tu primera evaluación",
          description:
            "Para generar insights personalizados, necesitas completar al menos una evaluación psicométrica. Te recomendamos empezar con el test DISC.",
          confidence: 95,
          priority: "high",
          category: "getting-started",
          actionable: true,
        },
        {
          id: "platform-intro",
          type: "recommendation",
          title: "Explora las evaluaciones disponibles",
          description:
            "Tenemos 5 evaluaciones diferentes: DISC, Big Five, MBTI, RIASEC y Habilidades Blandas. Cada una te dará insights únicos sobre tu perfil profesional.",
          confidence: 90,
          priority: "medium",
          category: "getting-started",
          actionable: true,
        },
      ]
    }

    // Generate insights based on test results
    testResults.forEach((result) => {
      const score = result.score || 0

      if (score >= 80) {
        fallbackInsights.push({
          id: `strength-${result.test_type}`,
          type: "strength",
          title: `Excelente desempeño en ${result.test_type.toUpperCase()}`,
          description: `Tu puntuación de ${score}% indica un alto nivel de autoconocimiento y competencias desarrolladas en esta área.`,
          confidence: 90,
          priority: "high",
          category: "strengths",
          actionable: true,
          relatedTests: [result.test_type],
        })
      } else if (score >= 60) {
        fallbackInsights.push({
          id: `opportunity-${result.test_type}`,
          type: "opportunity",
          title: `Oportunidad de crecimiento en ${result.test_type.toUpperCase()}`,
          description: `Con ${score}%, tienes una base sólida que puedes desarrollar aún más con práctica enfocada.`,
          confidence: 85,
          priority: "medium",
          category: "development",
          actionable: true,
          relatedTests: [result.test_type],
        })
      } else {
        fallbackInsights.push({
          id: `development-${result.test_type}`,
          type: "recommendation",
          title: `Área prioritaria de desarrollo: ${result.test_type.toUpperCase()}`,
          description: `Tu puntuación de ${score}% sugiere que esta área tiene gran potencial de mejora con el enfoque correcto.`,
          confidence: 80,
          priority: "high",
          category: "development",
          actionable: true,
          relatedTests: [result.test_type],
        })
      }
    })

    // Add career recommendations
    if (testResults.length >= 2) {
      fallbackInsights.push({
        id: "career-match",
        type: "recommendation",
        title: "Análisis de compatibilidad profesional",
        description: `Basado en tus ${testResults.length} evaluaciones, has demostrado fortalezas que se alinean con roles de liderazgo y desarrollo estratégico.`,
        confidence: 85,
        priority: "high",
        category: "career",
        actionable: true,
        relatedTests: testResults.map((r) => r.test_type),
      })
    }

    return fallbackInsights
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-purple-500" />
      case "trend":
        return <BarChart3 className="h-4 w-4 text-green-500" />
      default:
        return <Brain className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const categories = [
    { id: "all", label: "Todos", icon: Brain },
    { id: "strengths", label: "Fortalezas", icon: Star },
    { id: "development", label: "Desarrollo", icon: TrendingUp },
    { id: "career", label: "Carrera", icon: Briefcase },
    { id: "getting-started", label: "Primeros Pasos", icon: Target },
  ]

  const filteredInsights =
    selectedCategory === "all" ? insights : insights.filter((i) => i.category === selectedCategory)

  const getOverallScore = () => {
    if (testResults.length === 0) return 0
    return Math.round(testResults.reduce((sum, result) => sum + (result.score || 0), 0) / testResults.length)
  }

  const getCompletionRate = () => {
    const totalTests = 5 // DISC, Big Five, MBTI, RIASEC, Soft Skills
    return Math.round((testResults.length / totalTests) * 100)
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Insights Panel</CardTitle>
              <CardDescription className="text-sm">
                {isLoading ? "Generando insights..." : `${insights.length} insights personalizados`}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {testResults.length} Tests
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <Tabs defaultValue="insights" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="insights" className="text-xs">
            <Lightbulb className="h-3 w-3 mr-1" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-xs">
            <PieChart className="h-3 w-3 mr-1" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Acciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="flex-1 flex flex-col m-0">
          <div className="p-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs whitespace-nowrap"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 px-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredInsights.length > 0 ? (
              <div className="space-y-3 pb-4">
                {filteredInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <h3 className="font-medium text-sm">{insight.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
                          {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confidence}%
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                    {insight.relatedTests && insight.relatedTests.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500">Tests relacionados:</span>
                        {insight.relatedTests.map((test, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {test.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {insight.actionable && (
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Ver detalles
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay insights para esta categoría</p>
                <p className="text-xs mt-1">Completa más evaluaciones para obtener insights personalizados</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="overview" className="flex-1 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Puntuación General</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{getOverallScore()}%</div>
                  <Progress value={getOverallScore()} className="mt-2" />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Progreso</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{getCompletionRate()}%</div>
                  <Progress value={getCompletionRate()} className="mt-2" />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Distribución de Insights
                </h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => {
                    const count = insights.filter((i) => i.category === category.id).length
                    const percentage = insights.length > 0 ? (count / insights.length) * 100 : 0
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <category.icon className="h-3 w-3" />
                          <span className="text-sm">{category.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-16 h-2" />
                          <span className="text-xs text-gray-500 w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tests Completados
                </h3>
                <div className="space-y-2">
                  {testResults.map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{result.test_type.toUpperCase()}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={result.score || 0} className="w-16 h-2" />
                        <span className="text-xs text-gray-500 w-8">{result.score || 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recommendations" className="flex-1 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {insights
                .filter((i) => i.actionable && i.type === "recommendation")
                .map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Tomar acción
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            Prioridad {insight.priority === "high" ? "Alta" : "Media"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {insights.filter((i) => i.actionable && i.type === "recommendation").length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay recomendaciones disponibles</p>
                  <p className="text-xs mt-1">Completa más evaluaciones para obtener recomendaciones personalizadas</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// Export both default and named exports
export { AiInsightsPanel }
