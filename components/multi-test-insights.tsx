"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Target, Sparkles, Users, Briefcase, MapPin, DollarSign, RefreshCw } from "lucide-react"

interface MultiTestInsightsProps {
  userEmail: string
  currentTestType: string
}

interface CerebroInsight {
  insight_text: string
  confidence_score: number
  source: string
  category: string
  created_at: string
}

interface MarketInsight {
  industry: string
  role_title: string
  avg_salary_clp: number
  demand_level: string
  required_skills: string[]
  growth_projection: string
}

interface TestCombination {
  test_combination: string[]
  career_path: string
  success_probability: number
  recommended_skills: string[]
  market_demand: string
}

export function MultiTestInsights({ userEmail, currentTestType }: MultiTestInsightsProps) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)
  const [cerebroInsights, setCerebroInsights] = useState<CerebroInsight[]>([])
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([])
  const [testCombinations, setTestCombinations] = useState<TestCombination[]>([])

  useEffect(() => {
    loadMultiTestAnalysis()
  }, [userEmail])

  const loadMultiTestAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/cerebro-analyze-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
        setCerebroInsights(data.cerebroInsights || [])
        setMarketInsights(data.marketInsights || [])
        setTestCombinations(data.testCombinations || [])
      }
    } catch (error) {
      console.error("[v0] Error loading multi-test analysis:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analizando todos tus tests con Cerebro...</p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Completa más tests para obtener un análisis completo</p>
          <Button onClick={() => (window.location.href = "/test")} variant="outline">
            Ver Tests Disponibles
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple" />
                Análisis Multi-Test con Cerebro
              </CardTitle>
              <CardDescription className="mt-2">
                Insights combinados de {analysis.completedTests?.length || 0} tests completados
              </CardDescription>
            </div>
            <Button onClick={loadMultiTestAnalysis} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.completedTests?.map((test: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-white">
                {test}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil Completo</TabsTrigger>
          <TabsTrigger value="career">Carrera</TabsTrigger>
          <TabsTrigger value="market">Mercado Chileno</TabsTrigger>
          <TabsTrigger value="insights">Insights Cerebro</TabsTrigger>
        </TabsList>

        {/* Professional Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue" />
                Tu Perfil Profesional Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue/5 p-4 rounded-[28px]">
                <h4 className="font-semibold text-blue mb-2">Resumen</h4>
                <p className="text-sm text-blue">{analysis.professionalProfile?.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green" />
                    Fortalezas Clave
                  </h4>
                  <ul className="space-y-2">
                    {analysis.professionalProfile?.keyStrengths?.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green rounded-full mt-1.5"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange" />
                    Áreas de Desarrollo
                  </h4>
                  <ul className="space-y-2">
                    {analysis.professionalProfile?.developmentAreas?.map((area: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange rounded-full mt-1.5"></div>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Estilo de Trabajo</h4>
                <p className="text-sm text-muted">{analysis.professionalProfile?.workStyle}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Recommendations Tab */}
        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple" />
                Recomendaciones de Carrera Personalizadas
              </CardTitle>
              <CardDescription>Basadas en la combinación de tus resultados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCombinations.map((combo, index) => (
                <div key={index} className="border rounded-[28px] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">{combo.career_path}</h4>
                    <Badge variant={combo.success_probability > 75 ? "default" : "secondary"}>
                      {combo.success_probability}% compatibilidad
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted">Tests considerados:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {combo.test_combination.map((test, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted">Habilidades recomendadas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {combo.recommended_skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green" />
                      <span className="text-muted">Demanda: {combo.market_demand}</span>
                    </div>
                  </div>

                  <Progress value={combo.success_probability} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chilean Market Tab */}
        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red" />
                Insights del Mercado Laboral Chileno
              </CardTitle>
              <CardDescription>Oportunidades específicas para tu perfil en Chile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketInsights.map((insight, index) => (
                <div key={index} className="border rounded-[28px] p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{insight.role_title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.industry}</p>
                    </div>
                    <Badge
                      variant={
                        insight.demand_level === "Alta"
                          ? "default"
                          : insight.demand_level === "Media"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        insight.demand_level === "Alta"
                          ? "bg-green/10 text-green"
                          : insight.demand_level === "Media"
                            ? "bg-yellow/10 text-yellow"
                            : ""
                      }
                    >
                      Demanda {insight.demand_level}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green" />
                      <span className="font-medium">${insight.avg_salary_clp.toLocaleString("es-CL")} CLP/mes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue" />
                      <span>{insight.growth_projection}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-muted">Habilidades requeridas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {insight.required_skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cerebro Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple" />
                Insights Generados por Cerebro
              </CardTitle>
              <CardDescription>Análisis inteligente basado en patrones y datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cerebroInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-[28px] border-l-4 ${
                    insight.category === "career"
                      ? "border-l-blue-500 bg-blue/5"
                      : insight.category === "skills"
                        ? "border-l-green-500 bg-green/5"
                        : insight.category === "development"
                          ? "border-l-orange-500 bg-orange/5"
                          : "border-l-purple-500 bg-purple/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.source}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Progress value={insight.confidence_score} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{insight.confidence_score}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800">{insight.insight_text}</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
