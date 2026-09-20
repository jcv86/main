'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type FunnelStage = 'c1' | 'a1' | 'a2' | 'a3' | 'a4'

interface AnalyticsMetrics {
  byStage: Record<FunnelStage | 'cross', number>
  completionRate: Record<string, number>
  dropOffPoints: Record<string, string>
  totalErrors: number
  uniqueSessions: number
  conversionC1toA1: number
  conversionA1toA2: number
  conversionA2toA3: number
  conversionA3toA4: number
}

interface AnalyticsResponse {
  metrics?: AnalyticsMetrics
  available?: boolean
  windowDays?: number
  error?: string
}

const STAGE_LABEL: Record<FunnelStage, string> = {
  c1: 'C1',
  a1: 'A1',
  a2: 'A2',
  a3: 'A3',
  a4: 'A4',
}

function dropOffTone(rate: string) {
  if (rate === 'Sin base') return 'text-muted-foreground'
  const value = Number.parseFloat(rate)
  if (!Number.isFinite(value)) return 'text-muted-foreground'
  if (value >= 50) return 'text-red'
  if (value >= 30) return 'text-yellow'
  return 'text-green'
}

export default function V1ObservationDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState(7)

  useEffect(() => {
    let active = true

    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/v1-analytics?days=${timeRange}`, {
          credentials: 'include',
          cache: 'no-store',
        })
        const data = (await response.json()) as AnalyticsResponse
        if (!active) return

        if (!response.ok) {
          setLoadError(data.error ?? 'No pudimos cargar la observación.')
          setMetrics(null)
          return
        }

        setMetrics(data.metrics ?? null)
        setAvailable(data.available !== false)
        setLoadError(null)
      } catch {
        if (!active) return
        setLoadError('No pudimos cargar la observación.')
        setMetrics(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    setLoading(true)
    void fetchMetrics()
    const interval = window.setInterval(fetchMetrics, 60_000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [timeRange])

  const stageRows = useMemo(() => {
    if (!metrics) return []
    const stages: FunnelStage[] = ['c1', 'a1', 'a2', 'a3', 'a4']
    const maxSessions = Math.max(1, ...stages.map(stage => metrics.byStage[stage] ?? 0))
    return stages.map(stage => ({
      stage,
      count: metrics.byStage[stage] ?? 0,
      width: `${((metrics.byStage[stage] ?? 0) / maxSessions) * 100}%`,
    }))
  }, [metrics])

  if (loading) {
    return <div className="p-8 text-center">Cargando observación...</div>
  }

  if (loadError) {
    return (
      <div className="p-8 text-center">
        <p className="font-semibold">Observación no disponible</p>
        <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
      </div>
    )
  }

  if (!metrics) {
    return <div className="p-8 text-center">No hay datos analíticos disponibles.</div>
  }

  const hasData = metrics.uniqueSessions > 0

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">V1 Observation Dashboard</h1>
        <p className="text-muted-foreground">
          Funnel agregado del piloto. No incluye respuestas ni texto libre de usuarios.
        </p>
        <div className="mt-4 flex gap-2">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`rounded px-4 py-2 ${
                timeRange === days
                  ? 'bg-blue/50 text-white'
                  : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
              }`}
            >
              {days} días
            </button>
          ))}
        </div>
      </div>

      {!available && (
        <Card className="border-yellow/30">
          <CardContent className="p-5 text-sm text-muted-foreground">
            El almacenamiento analítico no está disponible. No mostramos inferencias a partir de datos incompletos.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Funnel de etapas</CardTitle>
          <CardDescription>Sesiones únicas observadas por etapa en el período.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stageRows.map(({ stage, count, width }) => (
            <div key={stage} className="flex items-center gap-4">
              <span className="w-12 font-semibold">{STAGE_LABEL[stage]}</span>
              <div className="h-8 flex-1 overflow-hidden rounded bg-blue/10">
                <div
                  className="flex h-full min-w-0 items-center justify-end rounded bg-blue/50 pr-3 font-bold text-white"
                  style={{ width }}
                >
                  {count > 0 ? count : ''}
                </div>
              </div>
              <span className="w-12 text-right text-sm text-muted-foreground">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Drop-off entre etapas</CardTitle>
          <CardDescription>
            Calculado por intersección de la misma sesión entre etapas; “Sin base” evita falsos 100% cuando no hay denominador.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(metrics.dropOffPoints).map(([point, rate]) => (
            <div key={point} className="flex items-center justify-between rounded bg-muted/5 p-3">
              <span className="font-medium">{point}</span>
              <span className={`font-bold ${dropOffTone(rate)}`}>{rate}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones que completaron eventos</CardTitle>
          <CardDescription>Conteos únicos por evento de finalización observado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.keys(metrics.completionRate).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin eventos de finalización en este período.</p>
          ) : (
            Object.entries(metrics.completionRate).map(([key, count]) => (
              <div key={key} className="flex justify-between p-2 text-sm">
                <span>{key}</span>
                <span className="font-semibold">{count} sesiones</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salud general</CardTitle>
          <CardDescription>Métricas agregadas de observación.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="rounded bg-blue/5 p-4 text-center">
            <div className="text-3xl font-bold text-blue">{metrics.uniqueSessions}</div>
            <div className="text-sm text-muted-foreground">Sesiones únicas</div>
          </div>
          <div className="rounded bg-red/5 p-4 text-center">
            <div className="text-3xl font-bold text-red">{metrics.totalErrors}</div>
            <div className="text-sm text-muted-foreground">Eventos de error</div>
          </div>
          <div className="rounded bg-yellow/5 p-4 text-center">
            <div className="text-3xl font-bold text-yellow">
              {metrics.byStage.c1 > 0 ? `${(metrics.conversionC1toA1 * 100).toFixed(1)}%` : 'Sin base'}
            </div>
            <div className="text-sm text-muted-foreground">Conversión C1→A1</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>Señales para revisar</CardTitle>
          <CardDescription>
            Son indicadores descriptivos; no prueban por sí solos la causa de una caída.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {!hasData && (
            <div className="rounded bg-muted/5 p-3 text-muted-foreground">
              Aún no hay una base de sesiones suficiente para evaluar el funnel.
            </div>
          )}
          {hasData && metrics.totalErrors > 0 && (
            <div className="rounded bg-red/5 p-3 text-red">
              {metrics.totalErrors} eventos de error observados. Revisar evidencia técnica asociada.
            </div>
          )}
          {metrics.byStage.c1 > 0 && metrics.conversionC1toA1 < 0.5 && (
            <div className="rounded bg-red/5 p-3 text-red">
              Conversión C1→A1 bajo 50% ({(metrics.conversionC1toA1 * 100).toFixed(1)}%). Revisar la transición con evidencia adicional.
            </div>
          )}
          {metrics.byStage.a1 > 0 && metrics.conversionA1toA2 < 0.3 && (
            <div className="rounded bg-red/5 p-3 text-red">
              Conversión A1→A2 bajo 30% ({(metrics.conversionA1toA2 * 100).toFixed(1)}%). Revisar la transición con evidencia adicional.
            </div>
          )}
          {metrics.byStage.a2 > 0 && metrics.conversionA2toA3 < 0.3 && (
            <div className="rounded bg-yellow/5 p-3 text-yellow">
              Conversión A2→A3 bajo 30% ({(metrics.conversionA2toA3 * 100).toFixed(1)}%). Revisar si el período contiene suficiente madurez del ciclo.
            </div>
          )}
          {metrics.byStage.a3 > 0 && metrics.conversionA3toA4 < 0.3 && (
            <div className="rounded bg-yellow/5 p-3 text-yellow">
              Conversión A3→A4 bajo 30% ({(metrics.conversionA3toA4 * 100).toFixed(1)}%). Revisar la transición antes de atribuir una causa.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
