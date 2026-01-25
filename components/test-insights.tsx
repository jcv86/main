"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Brain, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HybridInsight {
  source: "openai" | "cerebro" | "hybrid"
  category: string
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  reasoningSource: string
  personalizedContext?: string
  actionableSteps: string[]
}

interface TestInsightsProps {
  testType: string
  testResults: any
  testResponses?: any
  userId: string
  onInsightsLoaded?: (insights: any) => void
}

export function TestInsights({ testType, testResults, testResponses, userId, onInsightsLoaded }: TestInsightsProps) {
  const [insights, setInsights] = useState<HybridInsight[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [developmentPlan, setDevelopmentPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<any>(null)

  useEffect(() => {
    loadHybridInsights()
  }, [testType, userId])

  const loadHybridInsights = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Fetching hybrid insights for", testType)

      const response = await fetch("/api/post-test-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType,
          results: testResults,
          testResponses: testResponses || {},
          userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to load insights")
      }

      const data = await response.json()
      console.log("[v0] Received hybrid insights:", {
        insightsCount: data.insights?.length,
        recommendationsCount: data.recommendations?.length,
        processingTime: data.processingTime,
      })

      setInsights(data.insights || [])
      setRecommendations(data.recommendations || [])
      setDevelopmentPlan(data.developmentPlan || null)
      setMetadata(data.metadata || null)

      if (onInsightsLoaded) {
        onInsightsLoaded(data)
      }
    } catch (err) {
      console.error("[v0] Error loading insights:", err)
      setError(err instanceof Error ? err.message : "Error loading insights")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            Analizando con Cerebro...
          </CardTitle>
          <CardDescription>Generando insights personalizados basados en tu contexto</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const highPriorityInsights = insights.filter((i) => i.priority === "high")
  const cerebroInsights = insights.filter((i) => i.source === "cerebro")

  return (
    <div className="space-y-6">
      {/* Metadata Badge */}
      {metadata && (
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-50">
            <Sparkles className="mr-1 h-3 w-3" />
            {metadata.totalInsights} Insights Híbridos
          </Badge>
          <Badge variant="outline" className="bg-purple-50">
            <Brain className="mr-1 h-3 w-3" />
            {metadata.cerebroInsightsCount} del Cerebro
          </Badge>
          {metadata.processingTime && (
            <Badge variant="outline" className="text-xs">
              {metadata.processingTime}ms
            </Badge>
          )}
        </div>
      )}

      {/* High Priority Insights */}
      {highPriorityInsights.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-lg">Insights Prioritarios</CardTitle>
            <CardDescription>Áreas clave para enfocarte ahora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highPriorityInsights.map((insight, idx) => (
              <div key={idx} className="space-y-2 rounded-lg bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                  <div className="flex gap-1">
                    {insight.source === "cerebro" && (
                      <Badge variant="outline" className="text-xs bg-purple-50">
                        Cerebro
                      </Badge>
                    )}
                    {insight.source === "openai" && (
                      <Badge variant="outline" className="text-xs bg-blue-50">
                        OpenAI
                      </Badge>
                    )}
                    {insight.source === "hybrid" && (
                      <Badge variant="outline" className="text-xs bg-emerald-50">
                        Híbrido
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {(insight.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                {insight.personalizedContext && (
                  <div className="rounded bg-blue-50 p-2 text-xs italic text-gray-700">
                    Contexto: {insight.personalizedContext}
                  </div>
                )}

                {insight.actionableSteps.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-600">Pasos Accionables:</p>
                    <ul className="space-y-1">
                      {insight.actionableSteps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-2 text-xs text-gray-600">
                          <span className="font-bold text-emerald-600">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.reasoningSource && (
                  <p className="text-xs text-gray-500">Fuente: {insight.reasoningSource}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Todos los Insights ({insights.length})</CardTitle>
          <CardDescription>Análisis completo desde múltiples perspectivas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-3 ${
                insight.source === "cerebro"
                  ? "border-purple-200 bg-purple-50"
                  : insight.source === "openai"
                    ? "border-blue-200 bg-blue-50"
                    : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {insight.category}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recomendaciones Personalizadas</CardTitle>
            <CardDescription>Basadas en el Cerebro y tu Biblioteca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3">
                <p className="font-semibold text-sm">{rec.title}</p>
                <p className="text-xs text-gray-600">{rec.description}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.timeframe}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rec.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Development Plan */}
      {developmentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plan de Desarrollo</CardTitle>
            <CardDescription>Estrategia personalizada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {developmentPlan.shortTerm?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Corto Plazo (1-3 meses)</h4>
                <ul className="space-y-1">
                  {developmentPlan.shortTerm.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-xs text-gray-600">
                      <span className="font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {developmentPlan.mediumTerm?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Mediano Plazo (3-6 meses)</h4>
                <ul className="space-y-1">
                  {developmentPlan.mediumTerm.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-xs text-gray-600">
                      <span className="font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {developmentPlan.longTerm?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Largo Plazo (6+ meses)</h4>
                <ul className="space-y-1">
                  {developmentPlan.longTerm.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-xs text-gray-600">
                      <span className="font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {cerebroInsights.length > 0 && (
        <Alert className="bg-purple-50 border-purple-200">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            {cerebroInsights.length} insights basados en tu Cerebro y {cerebroInsights.some((i) => i.personalizedContext) ? "contexto personalizado" : "historial"}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
