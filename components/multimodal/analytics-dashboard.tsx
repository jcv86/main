'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Loader2, TrendingUp } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export function MultimodalAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/multimodal/analytics?period=month')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('[v0] Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <Card className="border-2 border-training/40">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-training" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card className="border-2 border-training/40">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No hay datos disponibles aún
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-training/40">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Sesiones Totales</p>
            <p className="text-3xl font-bold">{metrics.total_sessions}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-training/40">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Puntuación Promedio</p>
            <p className="text-3xl font-bold">{metrics.average_score}/100</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-training/40">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Mejora Detectada</p>
            <p className="text-3xl font-bold text-training">
              {metrics.improvement_trend >= 0 ? '+' : ''}{metrics.improvement_trend}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-training/40">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Coherencia Promedio</p>
            <p className="text-3xl font-bold text-training">{metrics.coherence_average}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics by Type */}
      <Card className="border-2 border-training/40">
        <CardHeader>
          <CardTitle>Desempeño por Tipo de Entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.by_type && Object.entries(metrics.by_type).map(([type, data]: [string, any]) => (
              <div key={type} className="p-4 bg-muted/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium capitalize">{type}</h4>
                  <span className="text-sm text-muted-foreground">{data.count} sesiones</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div
                    className="bg-blue h-2 rounded-full"
                    style={{ width: `${Math.min(data.average_score, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{data.average_score}/100</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Component Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-training/40">
          <CardHeader>
            <CardTitle className="text-lg">Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-training">{metrics.visual_average}%</p>
            <p className="text-sm text-muted-foreground mt-2">Postura, gestos, contacto visual</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-training/40">
          <CardHeader>
            <CardTitle className="text-lg">Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-training">{metrics.audio_average}%</p>
            <p className="text-sm text-muted-foreground mt-2">Tono, claridad, confianza</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-training/40">
          <CardHeader>
            <CardTitle className="text-lg">Coherencia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-training">{metrics.coherence_average}%</p>
            <p className="text-sm text-muted-foreground mt-2">Visual + Audio alineados</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Strengths */}
      <Card className="border-2 border-training/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-training" />
            Fortalezas Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.top_strengths && metrics.top_strengths.length > 0 ? (
              metrics.top_strengths.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-training/5 rounded-lg">
                  <span className="text-sm">{item.strength}</span>
                  <span className="text-xs bg-training/20 text-training px-2 py-1 rounded">{item.count}x</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Improvements */}
      <Card className="border-2 border-training/40">
        <CardHeader>
          <CardTitle>Áreas para Mejorar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.top_improvements && metrics.top_improvements.length > 0 ? (
              metrics.top_improvements.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-training/5 rounded-lg">
                  <span className="text-sm">{item.improvement}</span>
                  <span className="text-xs bg-training/20 text-training px-2 py-1 rounded">{item.count}x</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
