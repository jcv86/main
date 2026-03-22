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
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-600">
          No hay datos disponibles aún
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Sesiones Totales</p>
            <p className="text-3xl font-bold">{metrics.total_sessions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Puntuación Promedio</p>
            <p className="text-3xl font-bold">{metrics.average_score}/100</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Mejora Detectada</p>
            <p className={`text-3xl font-bold ${metrics.improvement_trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.improvement_trend >= 0 ? '+' : ''}{metrics.improvement_trend}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Coherencia Promedio</p>
            <p className="text-3xl font-bold">{metrics.coherence_average}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Desempeño por Tipo de Entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.by_type && Object.entries(metrics.by_type).map(([type, data]: [string, any]) => (
              <div key={type} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium capitalize">{type}</h4>
                  <span className="text-sm text-gray-600">{data.count} sesiones</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(data.average_score, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{data.average_score}/100</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Component Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{metrics.visual_average}%</p>
            <p className="text-sm text-gray-600 mt-2">Postura, gestos, contacto visual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{metrics.audio_average}%</p>
            <p className="text-sm text-gray-600 mt-2">Tono, claridad, confianza</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coherencia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{metrics.coherence_average}%</p>
            <p className="text-sm text-gray-600 mt-2">Visual + Audio alineados</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Fortalezas Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.top_strengths.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm">{item.strength}</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">{item.count}x</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Improvements */}
      <Card>
        <CardHeader>
          <CardTitle>Áreas para Mejorar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.top_improvements.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm">{item.improvement}</span>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">{item.count}x</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
