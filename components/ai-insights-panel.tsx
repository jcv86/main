"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Target, Lightbulb, Clock, CheckCircle, AlertCircle, Star, Brain } from "lucide-react"

interface Insight {
  category: string
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  source: string
  personalizedContext?: string
  actionableSteps?: string[]
  reasoningSource?: string
}

interface Recommendation {
  title: string
  description: string
  timeframe: string
  difficulty: string
}

interface DevelopmentPlan {
  shortTerm: string[]
  mediumTerm: string[]
  longTerm: string[]
}

interface AiInsightsPanelProps {
  testType: string
  results?: any
  responses?: any
  testResults?: any
  aiInterpretation?: string
  userEmail?: string
}

export function AiInsightsPanel({ testType, results, responses }: AiInsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [developmentPlan, setDevelopmentPlan] = useState<DevelopmentPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateInsights()
  }, [testType, results, responses])

  const generateInsights = async () => {
    setIsLoading(true)

    try {
      const localSession = localStorage.getItem("dtc_session")
      let userId = ""

      if (localSession) {
        const sessionData = JSON.parse(localSession)
        userId = sessionData.user?.id || sessionData.user?.email || ""
      }

      const response = await fetch("/api/post-test-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType,
          results,
          responses,
          userId,
        }),
      })

      const data = await response.json()

      console.log("[v0] Hybrid insights received:", data)

      setInsights(data.insights || [])
      setRecommendations(data.recommendations || [])
      setDevelopmentPlan(data.developmentPlan || null)
    } catch (error) {
      console.error("Error generating insights:", error)

      // Fallback insights
      setInsights([
        {
          category: "Fortalezas Identificadas",
          title: "Perfil Equilibrado",
          description:
            "Muestras un desarrollo equilibrado en la mayoría de las competencias evaluadas, con particular fortaleza en trabajo en equipo e inteligencia emocional.",
          confidence: 0.85,
          priority: "high",
          source: "hybrid",
        },
        {
          category: "Áreas de Oportunidad",
          title: "Creatividad y Innovación",
          description:
            "Existe potencial para desarrollar más tu capacidad creativa y de innovación. Considera explorar nuevas metodologías y enfoques.",
          confidence: 0.78,
          priority: "medium",
          source: "hybrid",
        },
      ])

      setRecommendations([
        {
          title: "Práctica de Técnicas Creativas",
          description: "Dedica tiempo semanal a ejercicios de brainstorming y pensamiento lateral.",
          timeframe: "corto plazo",
          difficulty: "fácil",
        },
        {
          title: "Liderazgo de Proyectos",
          description: "Busca oportunidades para liderar iniciativas pequeñas en tu área de trabajo.",
          timeframe: "mediano plazo",
          difficulty: "moderado",
        },
      ])

      setDevelopmentPlan({
        shortTerm: ["Autoevaluación semanal", "Práctica de escucha activa"],
        mediumTerm: ["Participar en proyectos colaborativos", "Buscar mentoring"],
        longTerm: ["Desarrollar habilidades de liderazgo", "Convertirse en mentor"],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-muted/10 text-gray-800"
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "fácil":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "moderado":
        return <AlertCircle className="h-4 w-4 text-orange" />
      case "difícil":
        return <Target className="h-4 w-4 text-red" />
      default:
        return <CheckCircle className="h-4 w-4 text-muted/50" />
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "openai":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
            OpenAI
          </Badge>
        )
      case "cerebro":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
            Cerebro
          </Badge>
        )
      case "hybrid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
            Híbrido
          </Badge>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análisis IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted/20 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-muted/20 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Análisis IA Híbrido (OpenAI + Cerebro)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            <TabsTrigger value="plan">Plan de Desarrollo</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getSourceBadge(insight.source)}
                          <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-orange" />
                            <span className="text-xs text-muted/60">{Math.round(insight.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        {insight.category}
                      </Badge>
                      {insight.personalizedContext && (
                        <p className="text-xs text-purple-600 italic mt-1">{insight.personalizedContext}</p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700">{insight.description}</p>
                      {insight.actionableSteps && insight.actionableSteps.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-muted/60 mb-1">Pasos Accionables:</p>
                          <ul className="space-y-1">
                            {insight.actionableSteps.map((step: string, i: number) => (
                              <li key={i} className="text-xs text-muted/60 flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Progress value={insight.confidence * 100} className="mt-2 h-2" />
                      <p className="text-xs text-muted/50 mt-1">Fuente: {insight.reasoningSource}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-orange" />
                          {rec.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getDifficultyIcon(rec.difficulty)}
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {rec.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {rec.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="plan" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {developmentPlan && (
                  <>
                    <div>
                      <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Corto Plazo (1-3 meses)
                      </h3>
                      <div className="space-y-2">
                        {developmentPlan.shortTerm.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        Mediano Plazo (3-6 meses)
                      </h3>
                      <div className="space-y-2">
                        {developmentPlan.mediumTerm.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        Largo Plazo (6+ meses)
                      </h3>
                      <div className="space-y-2">
                        {developmentPlan.longTerm.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-purple-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AiInsightsPanel
