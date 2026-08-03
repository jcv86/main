'use client'

import {
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Target,
  Trophy,
} from 'lucide-react'

export interface A2CycleReviewView {
  horizon: 30 | 60 | 90
  completedDays: number
  completionRate: number
  validatedDays: number
  validationRate: number
  evidenceDays: number
  evidenceRate: number
  checkpointsCompleted: number
  checkpointsRequired: number
  checkpointRate: number
  realActionDays: number
  averageScore: number | null
  closureScore: number
  status: 'not_started' | 'in_progress' | 'ready_to_extend' | 'completed'
  strengths: string[]
  gaps: string[]
}

interface A2CycleReviewCardProps {
  review: A2CycleReviewView
  compact?: boolean
}

export function A2CycleReviewCard({
  review,
  compact = false,
}: A2CycleReviewCardProps) {
  const metrics = [
    {
      label: 'Completitud',
      value: `${review.completedDays}/${review.horizon}`,
      detail: `${review.completionRate}%`,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    },
    {
      label: 'Validación',
      value: review.validatedDays,
      detail: `${review.validationRate}% de días completados`,
      icon: <ClipboardCheck className="h-4 w-4 text-cyan-400" />,
    },
    {
      label: 'Evidencia',
      value: review.evidenceDays,
      detail: `${review.evidenceRate}% de días completados`,
      icon: <FileCheck2 className="h-4 w-4 text-purple-400" />,
    },
    {
      label: 'Checkpoints',
      value: `${review.checkpointsCompleted}/${review.checkpointsRequired}`,
      detail: `${review.checkpointRate}%`,
      icon: <Trophy className="h-4 w-4 text-amber-400" />,
    },
    {
      label: 'Acciones reales',
      value: review.realActionDays,
      detail: 'días con actividad fuera de la plataforma',
      icon: <Target className="h-4 w-4 text-rose-400" />,
    },
    {
      label: 'Puntaje promedio',
      value: review.averageScore === null ? '—' : `${review.averageScore}/100`,
      detail: 'entregables con evaluación',
      icon: <Gauge className="h-4 w-4 text-blue-400" />,
    },
  ]

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-950/55 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Cierre verificable · {review.horizon} días
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">
            Señales acumuladas del ciclo
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Este resumen describe la evidencia disponible. No decide por ti si
            corresponde cerrar o extender Tu Ruta.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Solidez registrada
          </p>
          <p className="text-3xl font-bold text-cyan-300">
            {review.closureScore}/100
          </p>
        </div>
      </div>

      <div
        className={`mt-5 grid gap-3 ${
          compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/5 bg-slate-900/50 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {metric.label}
              </p>
              {metric.icon}
            </div>
            <p className="mt-2 text-xl font-bold text-white">{metric.value}</p>
            <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-sm font-semibold text-emerald-200">
            Señales consolidadas
          </p>
          {review.strengths.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-emerald-50/75">
              {review.strengths.map((strength) => (
                <li key={strength} className="flex gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-emerald-50/60">
              Las señales aparecerán a medida que completes y registres evidencia.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-200">
            Aspectos todavía abiertos
          </p>
          {review.gaps.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-amber-50/75">
              {review.gaps.map((gap) => (
                <li key={gap} className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-amber-50/60">
              No hay brechas estructurales visibles en los datos registrados.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
