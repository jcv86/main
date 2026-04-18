'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsMetrics {
  byStage: Record<string, number>
  completionRate: Record<string, number>
  dropOffPoints: Record<string, string>
  totalErrors: number
  uniqueSessions: number
  conversionC1toA1: number | string
  conversionA1toA2: number | string
}

export default function V1ObservationDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(7) // days

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/v1-analytics?days=${timeRange}`)
        const data = await response.json()
        setMetrics(data.metrics)
      } catch (error) {
        console.error('[v0] Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [timeRange])

  if (loading) {
    return <div className="p-8 text-center">Cargando observación...</div>
  }

  if (!metrics) {
    return <div className="p-8 text-center">No hay datos aún</div>
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">V1 Observation Dashboard - Fase 1</h1>
        <p className="text-muted/60">Observando dónde cae gente, qué confunde, dónde falla la retención</p>
        <div className="flex gap-2 mt-4">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded ${
                timeRange === days
                  ? 'bg-blue/50 text-white'
                  : 'bg-muted/20 text-muted/70 hover:bg-muted/30'
              }`}
            >
              {days} días
            </button>
          ))}
        </div>
      </div>

      {/* Funnel Conversión */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel de Etapas</CardTitle>
          <CardDescription>¿Cuánta gente llega a cada etapa?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-20 font-semibold">C1:</span>
              <div className="flex-1 h-8 bg-blue/10 rounded" style={{ width: '100%' }}>
                <div className="h-full bg-blue/50 rounded flex items-center justify-end pr-4 text-white font-bold">
                  {metrics.byStage.c1}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-20 font-semibold">A1:</span>
              <div className="flex-1 h-8 bg-blue/10 rounded" style={{ width: metrics.conversionC1toA1 as any }}>
                <div className="h-full bg-blue/50 rounded flex items-center justify-end pr-4 text-white font-bold">
                  {metrics.byStage.a1}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-20 font-semibold">A2:</span>
              <div className="flex-1 h-8 bg-blue/10 rounded" style={{ width: metrics.conversionA1toA2 as any }}>
                <div className="h-full bg-blue/50 rounded flex items-center justify-end pr-4 text-white font-bold">
                  {metrics.byStage.a2}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-20 font-semibold">A3:</span>
              <div className="flex-1 h-8 bg-blue/10 rounded" style={{ width: `${(metrics.byStage.a3 / metrics.byStage.c1) * 100}%` }}>
                <div className="h-full bg-blue/50 rounded flex items-center justify-end pr-4 text-white font-bold">
                  {metrics.byStage.a3}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-20 font-semibold">A4:</span>
              <div className="flex-1 h-8 bg-blue/10 rounded" style={{ width: `${(metrics.byStage.a4 / metrics.byStage.c1) * 100}%` }}>
                <div className="h-full bg-blue/50 rounded flex items-center justify-end pr-4 text-white font-bold">
                  {metrics.byStage.a4}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Points */}
      <Card>
        <CardHeader>
          <CardTitle>Puntos de Drop-off Críticos</CardTitle>
          <CardDescription>¿Dónde abandona la gente?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(metrics.dropOffPoints).map(([point, rate]) => (
              <div key={point} className="flex items-center justify-between p-3 bg-muted/5 rounded">
                <span className="font-medium">{point}</span>
                <span className={`font-bold ${parseFloat(rate as string) < 30 ? 'text-red' : 'text-green'}`}>
                  {rate}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Tasas de Compleción</CardTitle>
          <CardDescription>¿Quién termina cada etapa?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(metrics.completionRate).map(([key, count]) => (
              <div key={key} className="flex justify-between p-2 text-sm">
                <span>{key}</span>
                <span className="font-semibold">{count} usuarios</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Salud General</CardTitle>
          <CardDescription>Métricas clave de observación</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue/5 rounded text-center">
            <div className="text-3xl font-bold text-blue">{metrics.uniqueSessions}</div>
            <div className="text-sm text-muted/60">Sesiones únicas</div>
          </div>
          <div className="p-4 bg-red/5 rounded text-center">
            <div className="text-3xl font-bold text-red">{metrics.totalErrors}</div>
            <div className="text-sm text-muted/60">Errores detectados</div>
          </div>
          <div className="p-4 bg-yellow/5 rounded text-center">
            <div className="text-3xl font-bold text-yellow">{(metrics.conversionC1toA1 as number * 100).toFixed(1)}%</div>
            <div className="text-sm text-muted/60">Conv. C1→A1</div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Observations */}
      <Card className="border-2 border-red/20">
        <CardHeader>
          <CardTitle className="text-red">Observaciones Críticas</CardTitle>
          <CardDescription>Patrones que indican problemas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {metrics.totalErrors > 0 && (
            <div className="p-3 bg-red/5 text-red rounded">
              ⚠️ {metrics.totalErrors} errores detectados - Revisar logs
            </div>
          )}
          {(metrics.conversionC1toA1 as number) < 0.5 && (
            <div className="p-3 bg-red/5 text-red rounded">
              ⚠️ Baja conversión C1→A1 ({(metrics.conversionC1toA1 as number * 100).toFixed(1)}%) - Confusión en resultado de A1
            </div>
          )}
          {(metrics.conversionA1toA2 as number) < 0.3 && (
            <div className="p-3 bg-red/5 text-red rounded">
              ⚠️ Muy baja conversión A1→A2 ({(metrics.conversionA1toA2 as number * 100).toFixed(1)}%) - Bridge CTA no funciona
            </div>
          )}
          {metrics.byStage.a3 === 0 && (
            <div className="p-3 bg-yellow/5 text-yellow-700 rounded">
              ℹ️ Nadie ha llegado a A3 aún - Esperar más datos o revisar A2
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
