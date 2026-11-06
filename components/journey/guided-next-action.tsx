import type { GuidedNextAction as GuidedNextActionData } from '@/lib/journey/next-action'

function dateLabel(value: string | undefined) {
  if (!value) return null
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(dateOnly ? `${value}T12:00:00Z` : value)
  if (!Number.isFinite(date.getTime())) return null
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeZone: dateOnly ? 'UTC' : 'America/Santiago',
  }).format(date)
}

const sourceStatus = {
  available: 'Registro disponible',
  missing: 'Sin registro guardado',
  unavailable: 'Lectura pendiente',
} as const

/** Adds context to the existing next-step card. Navigation stays with its caller. */
export function GuidedNextAction({ guidance, reloadHref }: {
  guidance: GuidedNextActionData
  reloadHref: '/despega/dashboard' | '/despega/recorrido' | '/despega/a2/coach'
}) {
  const adjustment = guidance.adjustment
  const reviewDate = dateLabel(adjustment?.reviewDate)
  const canRetry = guidance.sources.some(source => source.status === 'unavailable')

  return <div className="mt-4 min-w-0 space-y-4 border-t border-border pt-4 text-sm" data-guided-next-action>
    {guidance.objective && <div className="min-w-0 space-y-1" data-guided-objective>
      <p className="font-semibold text-foreground">Tu dirección actual</p>
      <p className="break-words leading-6 text-muted-foreground">{guidance.objective.summary}</p>
    </div>}

    {adjustment && <div className="min-w-0 space-y-2 rounded-xl border border-border bg-background/60 p-4" data-guided-adjustment>
      <p className="font-semibold text-foreground">El paso que dejaste definido</p>
      <p className="whitespace-pre-wrap break-words leading-6 text-foreground">{adjustment.nextAction}</p>
      <p className="break-words leading-5 text-muted-foreground">Día {adjustment.dayNumber} · {adjustment.barrierLabel}</p>
      {reviewDate && <p className="text-muted-foreground">Fecha que elegiste para revisarlo: <time dateTime={adjustment.reviewDate}>{reviewDate}</time>.</p>}
    </div>}

    <p className="break-words leading-6 text-muted-foreground" data-guided-reason>{guidance.reason}</p>

    {(guidance.limitations.length > 0 || canRetry) && <div className="min-w-0 space-y-2 rounded-xl border border-border bg-background/60 p-4" data-guided-limitations>
      {guidance.limitations.map((limitation, index) => <p key={index} className="break-words leading-6 text-muted-foreground">{limitation}</p>)}
      {canRetry && <a href={reloadHref} className="inline-flex min-h-11 items-center rounded-md py-2 font-semibold text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Volver a comprobar mi contexto</a>}
    </div>}

    <details className="min-w-0 rounded-xl border border-border px-4" data-guided-sources>
      <summary className="min-h-11 cursor-pointer rounded-md py-3 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Ver en qué se basa este paso</summary>
      <div className="min-w-0 space-y-4 pb-4">
        {adjustment?.retainedWork && <div className="space-y-1">
          <p className="font-semibold text-foreground">Lo que decidiste conservar</p>
          <p className="whitespace-pre-wrap break-words leading-6 text-muted-foreground">{adjustment.retainedWork}</p>
        </div>}
        <ul className="space-y-3">
          {guidance.sources.map(source => {
            const recordedAt = dateLabel(source.recordedAt)
            return <li key={source.id} className="min-w-0 space-y-1">
              <p className="break-words font-medium text-foreground">{source.label}</p>
              <p className="break-words leading-5 text-muted-foreground">{sourceStatus[source.status]}{recordedAt && <> · <time dateTime={source.recordedAt}>{recordedAt}</time></>}</p>
            </li>
          })}
        </ul>
      </div>
    </details>
  </div>
}
