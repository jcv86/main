'use client'

interface OutcomeProgressCardProps {
  label: string
  comparable: boolean
  baseline: number | null
  latest: number | null
  delta: number | null
  confidence?: number | null
  nextAction?: string | null
}

export function OutcomeProgressCard({
  label,
  comparable,
  baseline,
  latest,
  delta,
  confidence,
  nextAction,
}: OutcomeProgressCardProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6" aria-label={`Evidencia de progreso: ${label}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Tu evidencia de progreso</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{label}</h3>

      {!comparable || baseline === null || latest === null || delta === null ? (
        <p className="mt-4 text-sm leading-6 text-white/70">
          Todavía no tenemos una medición comparable para afirmar mejora.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-white/50">Baseline</p>
              <p className="text-2xl font-bold text-white">{baseline.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Última comparable</p>
              <p className="text-2xl font-bold text-white">{latest.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Cambio observado</p>
              <p className="text-2xl font-bold text-white">{delta > 0 ? '+' : ''}{delta.toFixed(0)}</p>
            </div>
          </div>
          <p className="text-xs text-white/50">
            Este cambio describe mediciones comparables; no demuestra por sí solo que DTC haya causado el resultado.
          </p>
        </div>
      )}

      {confidence !== null && confidence !== undefined && (
        <p className="mt-4 text-sm text-white/60">Confianza de evidencia: {Math.round(confidence * 100)}%</p>
      )}
      {nextAction && (
        <p className="mt-3 text-sm text-white/80"><span className="font-semibold">Próxima acción:</span> {nextAction}</p>
      )}
    </section>
  )
}
