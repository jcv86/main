import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Database,
  FileSearch,
  Radar,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  computeA4EvidencePulse,
  pulsePriorityLabel,
  type A4ReviewQueueItem,
} from '@/lib/a4/evidence-pulse'
import type { A4Decision, A4VerifiedSignal } from '@/lib/a4/strategic-radar'

interface EvidencePulseProps {
  signals: A4VerifiedSignal[]
  decisions: A4Decision[]
}

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeZone: 'America/Santiago',
  }).format(date)
}

function reviewTiming(item: A4ReviewQueueItem) {
  if (item.timing === 'overdue') {
    return {
      label: `Vencida hace ${Math.abs(item.daysFromToday)} día${Math.abs(item.daysFromToday) === 1 ? '' : 's'}`,
      className: 'border-red-400/30 bg-red-400/10 text-red-200',
    }
  }
  if (item.timing === 'due_today') {
    return {
      label: 'Revisar hoy',
      className: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
    }
  }
  if (item.timing === 'next_7_days') {
    return {
      label: `En ${item.daysFromToday} día${item.daysFromToday === 1 ? '' : 's'}`,
      className: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
    }
  }
  return {
    label: formatDate(item.decision.review_on),
    className: 'border-slate-600 bg-slate-800 text-slate-200',
  }
}

export function EvidencePulse({ signals, decisions }: EvidencePulseProps) {
  const pulse = computeA4EvidencePulse(signals, decisions)
  const priority = pulsePriorityLabel(pulse.priority)
  const activeCount = Math.max(pulse.activeSignals.length, 1)

  return (
    <section className="space-y-6" aria-labelledby="a4-evidence-pulse-title">
      <Card className="overflow-hidden border-cyan-400/25 bg-gradient-to-br from-cyan-400/10 via-slate-900/80 to-purple-500/10">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-100">
                Pulso de Evidencia
              </Badge>
              <Badge variant="outline" className="border-white/15 text-slate-300">
                {formatDate(pulse.today)}
              </Badge>
            </div>
            <h2 id="a4-evidence-pulse-title" className="mt-4 text-3xl font-bold text-white">
              {priority.label}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
              {priority.detail} Este pulso ordena fechas, fuentes, clasificaciones y
              cobertura persistidas; no genera noticias, tesis ni puntajes estratégicos.
            </p>
          </div>
          <Button asChild variant="outline" className="border-white/20">
            <a href="#a4-workspace">Abrir bitácora</a>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Evidencia reciente',
            value: pulse.recentSignals.length,
            detail: 'Fuentes de los últimos 7 días',
            icon: <Database className="h-5 w-5 text-emerald-300" />,
          },
          {
            label: 'Revisiones vencidas',
            value: pulse.overdueReviews,
            detail: `${pulse.reviewsToday} programada${pulse.reviewsToday === 1 ? '' : 's'} para hoy`,
            icon: <AlertTriangle className="h-5 w-5 text-red-300" />,
          },
          {
            label: 'Hipótesis abiertas',
            value: pulse.hypotheses,
            detail: `${pulse.lowConfidenceHypotheses.length} con confianza 1–2/5`,
            icon: <FileSearch className="h-5 w-5 text-amber-300" />,
          },
          {
            label: 'Cobertura temática',
            value: `${pulse.coveredCategories}/7`,
            detail: `${pulse.uncoveredCategories.length} categoría${pulse.uncoveredCategories.length === 1 ? '' : 's'} sin señal activa`,
            icon: <Radar className="h-5 w-5 text-cyan-300" />,
          },
        ].map((item) => (
          <Card key={item.label} className="border-slate-800 bg-slate-900/70">
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.detail}</p>
              </div>
              {item.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-cyan-300" /> Agenda de revisión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pulse.reviewQueue.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
                <p className="flex items-center gap-2 font-semibold text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" /> Sin revisiones abiertas
                </p>
                <p className="mt-2 text-sm text-emerald-100/65">
                  Las decisiones revisadas o descartadas no aparecen en esta agenda.
                </p>
              </div>
            ) : (
              pulse.reviewQueue.slice(0, 6).map((item) => {
                const timing = reviewTiming(item)
                const signal = signals.find(
                  (candidate) => candidate.id === item.decision.signal_id,
                )
                return (
                  <div
                    key={item.decision.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{item.decision.decision}</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                          Señal: {signal?.title || 'Señal no disponible'}
                        </p>
                      </div>
                      <Badge variant="outline" className={timing.className}>
                        {timing.label}
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Fecha comprometida: {formatDate(item.decision.review_on)}
                    </p>
                  </div>
                )
              })
            )}
            {pulse.reviewQueue.length > 6 && (
              <p className="text-xs text-slate-500">
                Hay {pulse.reviewQueue.length - 6} revisiones adicionales en la bitácora.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" /> Cobertura de señales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pulse.categoryCoverage.map((category) => {
              const percentage = Math.round((category.count / activeCount) * 100)
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">{category.label}</span>
                    <span className="font-semibold text-white">{category.count}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-300/70"
                      style={{ width: `${category.count === 0 ? 0 : Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {pulse.activeSignals.length === 0 && (
              <p className="rounded-xl border border-slate-800 bg-slate-950/45 p-4 text-sm text-slate-400">
                La cobertura aparecerá cuando registres señales activas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-300" /> Delta verificable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pulse.recentSignals.length === 0 ? (
              <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100/70">
                No hay fuentes activas de los últimos siete días. El Radar no inferirá qué
                cambió sin evidencia reciente.
              </p>
            ) : (
              pulse.recentSignals.slice(0, 5).map((signal) => (
                <div
                  key={signal.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{formatDate(signal.source_date)}</Badge>
                    <Badge
                      className={
                        signal.classification === 'fact'
                          ? 'bg-emerald-500/15 text-emerald-200'
                          : 'bg-amber-500/15 text-amber-200'
                      }
                    >
                      {signal.classification === 'fact' ? 'Hecho' : 'Hipótesis'}
                    </Badge>
                  </div>
                  <p className="mt-3 font-semibold text-white">{signal.title}</p>
                  <p className="mt-2 text-xs text-slate-500">Fuente: {signal.source_name}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-amber-300" /> Calidad pendiente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="font-semibold text-white">Fuentes desactualizadas</p>
              <p className="mt-2 text-slate-400">
                {pulse.staleSignals.length} señal{pulse.staleSignals.length === 1 ? '' : 'es'} activa
                {pulse.staleSignals.length === 1 ? '' : 's'} usa{pulse.staleSignals.length === 1 ? '' : 'n'} una
                fuente de más de 30 días.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="font-semibold text-white">Hipótesis con baja confianza</p>
              <p className="mt-2 text-slate-400">
                {pulse.lowConfidenceHypotheses.length} hipótesis activa
                {pulse.lowConfidenceHypotheses.length === 1 ? '' : 's'} requiere
                {pulse.lowConfidenceHypotheses.length === 1 ? '' : 'n'} más contraste.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="font-semibold text-white">Decisiones cerradas</p>
              <p className="mt-2 text-slate-400">
                {pulse.closedDecisions} decisión{pulse.closedDecisions === 1 ? '' : 'es'} revisada
                {pulse.closedDecisions === 1 ? '' : 's'} o descartada
                {pulse.closedDecisions === 1 ? '' : 's'} conserva
                {pulse.closedDecisions === 1 ? '' : 'n'} su historial fuera de la agenda activa.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
