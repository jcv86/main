'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  History,
  Loader2,
  Minus,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  compareA4DailySnapshots,
  sortA4SnapshotsDescending,
  type A4DailyEvidenceSnapshot,
} from '@/lib/a4/daily-snapshots'
import { pulsePriorityLabel } from '@/lib/a4/evidence-pulse'

interface DailySnapshotHistoryProps {
  initialSnapshots: A4DailyEvidenceSnapshot[]
}

interface SnapshotResponse {
  success?: boolean
  snapshot?: A4DailyEvidenceSnapshot
  previousSnapshot?: A4DailyEvidenceSnapshot | null
  error?: string
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeZone: 'America/Santiago',
  }).format(date)
}

function formatTimestamp(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin hora registrada'
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(date)
}

function DeltaIcon({ value }: { value: number }) {
  if (value > 0) return <ArrowUp className="h-4 w-4" />
  if (value < 0) return <ArrowDown className="h-4 w-4" />
  return <Minus className="h-4 w-4" />
}

function deltaText(value: number) {
  if (value > 0) return `+${value}`
  return String(value)
}

function mergeSnapshots(
  current: A4DailyEvidenceSnapshot[],
  incoming: A4DailyEvidenceSnapshot[],
) {
  const byDate = new Map(current.map((snapshot) => [snapshot.snapshot_date, snapshot]))
  for (const snapshot of incoming) byDate.set(snapshot.snapshot_date, snapshot)
  return sortA4SnapshotsDescending([...byDate.values()]).slice(0, 31)
}

export function DailySnapshotHistory({
  initialSnapshots,
}: DailySnapshotHistoryProps) {
  const started = useRef(false)
  const [snapshots, setSnapshots] = useState(() =>
    sortA4SnapshotsDescending(initialSnapshots),
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const current = snapshots[0] || null
  const previous = snapshots.find(
    (snapshot) => current && snapshot.snapshot_date < current.snapshot_date,
  ) || null
  const comparison = useMemo(
    () => (current ? compareA4DailySnapshots(current, previous) : null),
    [current, previous],
  )

  async function captureToday() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/a4/snapshots', {
        method: 'POST',
        credentials: 'include',
      })
      const payload = (await response.json().catch(() => ({}))) as SnapshotResponse
      if (!response.ok || !payload.snapshot) {
        throw new Error(payload.error || 'No pudimos guardar el corte de hoy.')
      }

      setSnapshots((existing) =>
        mergeSnapshots(
          existing,
          [payload.snapshot!, payload.previousSnapshot].filter(
            (item): item is A4DailyEvidenceSnapshot => Boolean(item),
          ),
        ),
      )
      setMessage('Corte diario actualizado desde la evidencia persistida.')
    } catch (captureError) {
      console.error('[v0] A4 daily snapshot error:', captureError)
      setError(
        captureError instanceof Error
          ? captureError.message
          : 'No pudimos guardar el corte de hoy.',
      )
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    void captureToday()
  }, [])

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Historial verificable
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Cortes diarios del Radar
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            Un único corte por día resume contadores y cobertura. La comparación usa el
            último día disponible; no interpreta por qué cambió cada número.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => void captureToday()}
          className="shrink-0 border-white/20"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Actualizar corte de hoy
        </Button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}
      {message && (
        <p className="flex items-center gap-2 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </p>
      )}

      {!current ? (
        <Card className="border-slate-800 bg-slate-900/70">
          <CardContent className="flex items-center gap-3 p-6 text-sm text-slate-400">
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CalendarDays className="h-5 w-5" />
            )}
            El primer corte aparecerá cuando termine el cálculo server-side.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-indigo-400/25 bg-indigo-400/5">
            <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-indigo-300" />
                  Corte del {formatDate(current.snapshot_date)}
                </CardTitle>
                <p className="mt-2 text-xs text-slate-500">
                  Última actualización: {formatTimestamp(current.updated_at)}
                </p>
              </div>
              <Badge variant="outline">
                {pulsePriorityLabel(current.priority).label}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Señales activas', current.active_signals],
                ['Categorías cubiertas', `${current.covered_categories}/7`],
                ['Decisiones abiertas', current.open_decisions],
                ['Revisiones vencidas', current.overdue_reviews],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {comparison ? (
            <Card className="border-slate-800 bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-cyan-300" />
                  Cambio desde {formatDate(comparison.previousDate)}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  Separación entre cortes: {comparison.daysApart}{' '}
                  {comparison.daysApart === 1 ? 'día' : 'días'}.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {comparison.metrics.map((metric) => (
                    <div key={metric.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <p className="text-xs text-slate-500">{metric.label}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xl font-semibold text-white">
                          {metric.current}
                        </p>
                        <span className="flex items-center gap-1 text-sm text-slate-300">
                          <DeltaIcon value={metric.delta} /> {deltaText(metric.delta)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Corte anterior: {metric.previous}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Cambios de cobertura por categoría
                  </p>
                  {comparison.categoryChanges.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      La cobertura por categoría no cambió entre ambos cortes.
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {comparison.categoryChanges.map((category) => (
                        <Badge key={category.id} variant="outline">
                          {category.label}: {category.previous} → {category.current}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-900/70">
              <CardContent className="p-6 text-sm text-slate-400">
                Este es el primer día registrado. La comparación aparecerá cuando exista
                un corte de una fecha anterior.
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle>Últimos cortes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshots.slice(0, 14).map((snapshot) => (
                <div
                  key={snapshot.id || snapshot.snapshot_date}
                  className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-medium text-white">
                      {formatDate(snapshot.snapshot_date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {pulsePriorityLabel(snapshot.priority).label}
                    </p>
                  </div>
                  <p className="text-sm text-slate-300">
                    {snapshot.active_signals} señales
                  </p>
                  <p className="text-sm text-slate-300">
                    {snapshot.covered_categories}/7 categorías
                  </p>
                  <p className="text-sm text-slate-300">
                    {snapshot.overdue_reviews} vencidas
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  )
}
