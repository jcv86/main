"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, AlertCircle, CheckCircle, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VariantMetrics {
  version_id: string
  version_name: string
  coach_type: string
  conversation_category: string
  total_sessions: number
  avg_satisfaction: number
  action_completion_rate: number
  avg_engagement: number
  overall_score: number
}

interface StatisticalAnalysis {
  pValue: number
  zScore: number
  isSignificant: boolean
  effectSize: number
  effectSizeInterpretation: string
  controlCI: {
    lower: number
    upper: number
    mean: number
    confidenceLevel: number
  }
  variantCI: {
    lower: number
    upper: number
    mean: number
    confidenceLevel: number
  }
}

interface TestResult {
  group: string
  status: string
  winner?: VariantMetrics
  variants: VariantMetrics[]
  meetsThresholds?: boolean
  statisticalAnalysis?: StatisticalAnalysis | null
  message: string
}

export function ABTestResultsDashboard() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ab-test-analysis")
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Error fetching A/B test results:", error)
    } finally {
      setLoading(false)
    }
  }

  const publishWinner = async (versionId: string, autoPublish = false) => {
    try {
      setPublishing(versionId)
      const response = await fetch("/api/ab-test-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version_id: versionId, auto_publish: autoPublish }),
      })

      if (response.ok) {
        await fetchResults() // Refresh results
      }
    } catch (error) {
      console.error("Error publishing winner:", error)
    } finally {
      setPublishing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resultados de A/B Testing</h1>
          <p className="text-muted-foreground mt-2">
            Análisis automático de variantes de prompts y publicación de ganadores
          </p>
        </div>

        {results.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No hay tests A/B activos en este momento.</AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6">
            {results.map((result, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {result.group.replace("-", " → ")}
                        {result.status === "ready_to_publish" && (
                          <Badge className="bg-green-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            Listo para publicar
                          </Badge>
                        )}
                        {result.status === "insufficient_data" && (
                          <Badge variant="secondary">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Recolectando datos
                          </Badge>
                        )}
                        {result.status === "no_clear_winner" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Sin ganador claro
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{result.message}</CardDescription>
                    </div>
                    {result.status === "ready_to_publish" && result.winner && (
                      <Button
                        onClick={() => publishWinner(result.winner!.version_id, false)}
                        disabled={publishing === result.winner!.version_id}
                      >
                        {publishing === result.winner!.version_id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Publicando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publicar Ganador
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.statisticalAnalysis && (
                      <div className="p-4 bg-muted rounded-lg space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          Análisis Estadístico
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Análisis estadístico basado en test z de dos muestras con nivel de significancia del 5%
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">P-Value</div>
                            <div className="font-mono font-bold">{result.statisticalAnalysis.pValue.toFixed(4)}</div>
                            {result.statisticalAnalysis.isSignificant && (
                              <Badge variant="default" className="mt-1 text-xs">
                                Significativo
                              </Badge>
                            )}
                          </div>
                          <div>
                            <div className="text-muted-foreground">Z-Score</div>
                            <div className="font-mono font-bold">{result.statisticalAnalysis.zScore.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Effect Size</div>
                            <div className="font-mono font-bold">
                              {result.statisticalAnalysis.effectSize.toFixed(3)}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {result.statisticalAnalysis.effectSizeInterpretation}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Intervalo de Confianza (95%)</div>
                            <div className="text-xs space-y-1 mt-1">
                              <div>
                                Control: [{result.statisticalAnalysis.controlCI.lower.toFixed(2)},{" "}
                                {result.statisticalAnalysis.controlCI.upper.toFixed(2)}]
                              </div>
                              <div>
                                Variante: [{result.statisticalAnalysis.variantCI.lower.toFixed(2)},{" "}
                                {result.statisticalAnalysis.variantCI.upper.toFixed(2)}]
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {result.variants.map((variant) => {
                      const isWinner = variant.version_id === result.winner?.version_id
                      return (
                        <div
                          key={variant.version_id}
                          className={`p-4 rounded-[28px] border-2 ${
                            isWinner ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{variant.version_name}</h3>
                              {isWinner && (
                                <Badge className="bg-green-500">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Ganador
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{variant.total_sessions} sesiones</div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Satisfacción</div>
                              <div className="text-2xl font-bold">{variant.avg_satisfaction.toFixed(2)}★</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Acción Completada</div>
                              <div className="text-2xl font-bold">
                                {(variant.action_completion_rate * 100).toFixed(0)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Engagement</div>
                              <div className="text-2xl font-bold">{variant.avg_engagement.toFixed(1)} msgs</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Score Total</div>
                              <div className="text-2xl font-bold">{(variant.overall_score * 100).toFixed(0)}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default ABTestResultsDashboard
