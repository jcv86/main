"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { aiCoach, type AIInsight } from "@/lib/ai-coach"
import { createClient } from "@supabase/supabase-js"
import { Brain, Target, TrendingUp, Users, Lightbulb, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface AIInsightsPanelProps {
  userEmail: string
}

export default function AIInsightsPanel({ userEmail }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    loadExistingInsights()
  }, [userEmail])

  const loadExistingInsights = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("user_email", userEmail)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading insights:", error)
        return
      }

      if (data && data.length > 0) {
        const formattedInsights: AIInsight[] = data.map((item) => ({
          title: item.insight_title,
          content: item.insight_content,
          type: item.insight_type,
          confidence: item.confidence_score || 0.8,
          sourceTests: item.source_tests || [],
        }))

        setInsights(formattedInsights)
        setLastGenerated(new Date(data[0].created_at))
      }
    } catch (error) {
      console.error("Error loading insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewInsights = async () => {
    setGenerating(true)
    try {
      // Clear existing insights
      await supabase.from("ai_insights").update({ is_active: false }).eq("user_email", userEmail)

      // Generate new insights
      const newInsights = await aiCoach.generatePersonalityInsights(userEmail)
      setInsights(newInsights)
      setLastGenerated(new Date())
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
      case "growth":
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
      case "growth":
        return "text-green-600 bg-green-100"
      case "compatibility":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4" />
    if (confidence >= 0.6) return <AlertCircle className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  const groupedInsights = {
    personality: insights.filter((i) => i.type === "personality"),
    career: insights.filter((i) => i.type === "career"),
    growth: insights.filter((i) => i.type === "growth"),
    compatibility: insights.filter((i) => i.type === "compatibility"),
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando insights...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Insights de IA Personalizados
            </CardTitle>
            <CardDescription>
              Análisis inteligente basado en tus resultados de personalidad
              {lastGenerated && (
                <span className="block text-xs mt-1">Última actualización: {lastGenerated.toLocaleDateString()}</span>
              )}
            </CardDescription>
          </div>
          <Button onClick={generateNewInsights} disabled={generating} variant="outline" size="sm">
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay insights disponibles</h3>
            <p className="text-gray-500 mb-4">
              Completa algunos tests de personalidad para generar insights personalizados
            </p>
            <Button onClick={generateNewInsights} disabled={generating}>
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generando Insights...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generar Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos ({insights.length})</TabsTrigger>
              <TabsTrigger value="personality">Personalidad ({groupedInsights.personality.length})</TabsTrigger>
              <TabsTrigger value="career">Carrera ({groupedInsights.career.length})</TabsTrigger>
              <TabsTrigger value="growth">Crecimiento ({groupedInsights.growth.length})</TabsTrigger>
              <TabsTrigger value="compatibility">Equipos ({groupedInsights.compatibility.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {insights.map((insight, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{insight.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                            <div
                              className={`flex items-center gap-1 text-xs ${getConfidenceColor(insight.confidence)}`}
                            >
                              {getConfidenceIcon(insight.confidence)}
                              <span>{Math.round(insight.confidence * 100)}% confianza</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{insight.content}</p>

                    {insight.sourceTests.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Basado en:</span>
                        {insight.sourceTests.map((test, testIndex) => (
                          <Badge key={testIndex} variant="secondary" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
              <TabsContent key={category} value={category} className="space-y-4 mt-6">
                {categoryInsights.length === 0 ? (
                  <div className="text-center py-8">
                    <div className={`p-3 rounded-lg ${getInsightColor(category)} w-fit mx-auto mb-4`}>
                      {getInsightIcon(category)}
                    </div>
                    <p className="text-gray-500">No hay insights de {category} disponibles</p>
                  </div>
                ) : (
                  categoryInsights.map((insight, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                              {getInsightIcon(insight.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{insight.title}</h4>
                              <div
                                className={`flex items-center gap-1 text-xs mt-1 ${getConfidenceColor(insight.confidence)}`}
                              >
                                {getConfidenceIcon(insight.confidence)}
                                <span>{Math.round(insight.confidence * 100)}% confianza</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mb-3">{insight.content}</p>

                        {insight.sourceTests.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Basado en:</span>
                            {insight.sourceTests.map((test, testIndex) => (
                              <Badge key={testIndex} variant="secondary" className="text-xs">
                                {test}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
