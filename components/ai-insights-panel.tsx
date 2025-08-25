"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { aiCoach, type AIInsight } from "@/lib/ai-coach"
import { Sparkles, Brain, Target, TrendingUp, Users, RefreshCw, Lightbulb, Award } from "lucide-react"

interface AIInsightsPanelProps {
  userEmail: string
}

export default function AIInsightsPanel({ userEmail }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [userEmail])

  const loadInsights = async () => {
    try {
      setLoading(true)
      const existingInsights = await aiCoach.getExistingInsights(userEmail)
      setInsights(existingInsights)
    } catch (error) {
      console.error("Error loading insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewInsights = async () => {
    try {
      setGenerating(true)
      const newInsights = await aiCoach.generateInsights(userEmail)
      setInsights((prev) => [...newInsights, ...prev])
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setGenerating(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "personality":
        return <Brain className="h-5 w-5" />
      case "career":
        return <Target className="h-5 w-5" />
      case "development":
        return <TrendingUp className="h-5 w-5" />
      case "compatibility":
        return <Users className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "personality":
        return "text-purple-600 bg-purple-100"
      case "career":
        return "text-blue-600 bg-blue-100"
      case "development":
        return "text-green-600 bg-green-100"
      case "compatibility":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-blue-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
            <span className="text-gray-600">Cargando insights...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                Insights Personalizados con IA
              </CardTitle>
              <CardDescription>Análisis inteligente basado en todos tus resultados de tests</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {insights.length} Insights
              </Badge>
              <Button
                onClick={generateNewInsights}
                disabled={generating}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generar Nuevos
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Insights Grid */}
      {insights.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay insights disponibles</h3>
            <p className="text-gray-600 mb-4">Completa al menos 2 tests para generar insights personalizados con IA</p>
            <Button onClick={generateNewInsights} disabled={generating}>
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generando Insights...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar Insights
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => (
            <Card key={insight.id} className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {insight.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(insight.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">confianza</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{insight.content}</p>

                {/* Confidence Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Nivel de confianza</span>
                    <span>{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                </div>

                {/* Source Tests */}
                {insight.source_tests && insight.source_tests.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Basado en:</div>
                    <div className="flex flex-wrap gap-1">
                      {insight.source_tests.map((test, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Resumen de Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {insights.filter((i) => i.type === "personality").length}
                </div>
                <div className="text-sm text-purple-700">Personalidad</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {insights.filter((i) => i.type === "career").length}
                </div>
                <div className="text-sm text-blue-700">Carrera</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {insights.filter((i) => i.type === "development").length}
                </div>
                <div className="text-sm text-green-700">Desarrollo</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
                </div>
                <div className="text-sm text-orange-700">Confianza Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
