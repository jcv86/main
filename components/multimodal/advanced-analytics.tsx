'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Line, Bar, Radar } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { Download, TrendingUp, Award, Target } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export function AdvancedAnalyticsReporting() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeRange, setTimeRange] = useState('month')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/multimodal/advanced-analytics?period=${timeRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('[v0] Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/multimodal/export-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeRange })
      })
      const { reportUrl } = await response.json()
      window.open(reportUrl, '_blank')
    } catch (error) {
      console.error('[v0] Export error:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Avanzado</h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mes</option>
            <option value="quarter">Último Trimestre</option>
            <option value="all">Todo el Tiempo</option>
          </select>
          <Button onClick={exportReport} disabled={exporting} className="gap-2">
            <Download className="w-4 h-4" />
            {exporting ? 'Exportando...' : 'Exportar Reporte'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mejora Detectada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${analytics.improvement_trend >= 0 ? 'text-green' : 'text-red'}`}>
                  {analytics.improvement_trend >= 0 ? '+' : ''}{analytics.improvement_trend}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">vs. período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Consistency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue">{analytics.consistency_score}%</p>
                <p className="text-xs text-muted-foreground mt-1">Variación mínima en sesiones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Strongest Area</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{analytics.strongest_area}</p>
                <p className="text-xs text-muted-foreground mt-1">{analytics.strongest_score}/100</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Progresión de Puntuaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {analytics.progression_data && (
                  <Line
                    data={{
                      labels: analytics.progression_data.labels,
                      datasets: [
                        {
                          label: 'Puntuación General',
                          data: analytics.progression_data.scores,
                          borderColor: 'rgb(59, 130, 246)',
                          tension: 0.4
                        },
                        {
                          label: 'Promedio Móvil',
                          data: analytics.progression_data.movingAverage,
                          borderColor: 'rgb(107, 114, 128)',
                          borderDash: [5, 5]
                        }
                      ]
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benchmarks Tab */}
        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tu Desempeño vs. Benchmark</CardTitle>
              <CardDescription>Comparación con usuarios similares en Despega</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.benchmark_comparison && analytics.benchmark_comparison.map((item: any) => (
                  <div key={item.metric}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <div className="flex gap-2 text-sm">
                        <span className="text-blue font-semibold">Tu: {item.your_score}%</span>
                        <span className="text-muted-foreground">Benchmark: {item.benchmark}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                        <div
                          className="bg-blue h-full rounded-full"
                          style={{ width: `${Math.min(item.your_score, 100)}%` }}
                        />
                      </div>
                      <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden opacity-50">
                        <div
                          className="bg-muted/60 h-full rounded-full"
                          style={{ width: `${Math.min(item.benchmark, 100)}%` }}
                        />
                      </div>
                    </div>
                    {item.your_score > item.benchmark && (
                      <Badge className="mt-2 bg-green/10 text-green">
                        Mejor que el {Math.round(100 - item.percentile)}% de usuarios
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desglose por Componente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {analytics.component_radar && (
                  <Radar
                    data={{
                      labels: ['Postura', 'Contacto Visual', 'Tono', 'Claridad', 'Confianza', 'Coherencia'],
                      datasets: [
                        {
                          label: 'Tu Desempeño',
                          data: analytics.component_radar.your_scores,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)'
                        },
                        {
                          label: 'Benchmark',
                          data: analytics.component_radar.benchmark_scores,
                          borderColor: 'rgb(107, 114, 128)',
                          backgroundColor: 'rgba(107, 114, 128, 0.1)'
                        }
                      ]
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow" />
                  Logros Desbloqueados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.achievements && analytics.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow/5 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue" />
                  Próximos Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.next_goals && analytics.next_goals.map((goal: any) => (
                    <div key={goal.id}>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">{goal.title}</p>
                        <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                        <div
                          className="bg-blue h-full rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.ai_insights && analytics.ai_insights.map((insight: string, idx: number) => (
                <div key={idx} className="flex gap-3 p-3 bg-blue/5 rounded-lg">
                  <span className="text-blue font-bold flex-shrink-0">{idx + 1}.</span>
                  <p className="text-sm text-muted">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
