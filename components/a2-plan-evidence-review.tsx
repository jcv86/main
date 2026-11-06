'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { a2PlanToday } from '@/lib/a2/plan-contract'
import {
  buildA2ReviewSuggestion,
  a2ReviewSourceRefs,
  type A2ReviewCapture,
  type A2ReviewDecision,
  type A2ReviewEvidence,
  type A2ReviewSourceRef,
} from '@/lib/a2/review-evidence-contract'

const sourceMessages = {
  a3: {
    missing: 'No hay respuestas guardadas en esta versión del ejercicio.',
    unavailable: 'No pudimos recuperar tus respuestas. Esto no significa que no estén guardadas.',
    locked: 'El registro de Entrenamiento aún no está habilitado en tu recorrido.',
    not_applicable: 'Esta fuente no se usa en tu camino personal.',
  },
  a4: {
    missing: 'No hay decisiones guardadas para esta revisión.',
    unavailable: 'No pudimos recuperar tus decisiones. Esto no significa que no estén guardadas.',
    locked: 'El Radar aún no está habilitado en tu recorrido.',
    not_applicable: 'Esta fuente no se usa en tu camino personal.',
  },
} as const

const classificationLabels = {
  evidence_supported: 'Declaraste que la evidencia respaldó la decisión.',
  evidence_not_supported: 'Declaraste que la evidencia no respaldó la decisión.',
  inconclusive: 'Declaraste que la evidencia fue inconclusa.',
  decision_changed: 'Declaraste que la evidencia te llevó a cambiar la decisión.',
  decision_abandoned: 'Declaraste que abandonaste la decisión.',
} as const

function dateLabel(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium', ...(dateOnly ? {} : { timeStyle: 'short' as const }),
    timeZone: dateOnly ? 'UTC' : 'America/Santiago',
  }).format(new Date(dateOnly ? `${value}T12:00:00Z` : value))
}

function excerpt(value: string) {
  const characters = Array.from(value)
  return characters.length > 300 ? `${characters.slice(0, 300).join('').trimEnd()}…` : value
}

function SourceLink({ source }: { source: A2ReviewSourceRef | undefined }) {
  if (!source) return null
  return <Link href={source.href} className="inline-flex min-h-11 items-center rounded-md py-2 font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    {source.href === '/despega/a4' ? 'Ver decisiones en el Radar' : 'Ver mis respuestas guardadas'}
  </Link>
}

function CaptureSummary({ capture, label, source }: { capture: A2ReviewCapture; label: string; source: A2ReviewSourceRef | undefined }) {
  return <div className="min-w-0 space-y-2 rounded-lg border border-border p-3">
    <p className="font-semibold">{label}</p>
    <p className="text-xs leading-5 text-muted-foreground">Registrado el <time dateTime={capture.observedAt}>{dateLabel(capture.observedAt)}</time> · hora de Chile.</p>
    <p className="whitespace-pre-wrap break-words"><span className="font-medium">Lo que declaraste sobre tu brecha o próximo paso: </span>{excerpt(capture.responsePayload.challenge)}</p>
    <SourceLink source={source} />
  </div>
}

function DecisionSummary({ decision, label, source }: { decision: A2ReviewDecision; label: string; source: A2ReviewSourceRef | undefined }) {
  return <div className="min-w-0 space-y-2 rounded-lg border border-border p-3">
    <p className="font-semibold">{label}</p>
    <p className="whitespace-pre-wrap break-words">{excerpt(decision.decision)}</p>
    <p className="whitespace-pre-wrap break-words"><span className="font-medium">Esperabas observar: </span>{excerpt(decision.expectedEvidence)}</p>
    <p className="text-xs leading-5 text-muted-foreground">Registro actualizado el <time dateTime={decision.updatedAt}>{dateLabel(decision.updatedAt)}</time> · hora de Chile.</p>
    <p>Fecha elegida para revisar: <time dateTime={decision.reviewOn}>{dateLabel(decision.reviewOn)}</time>.</p>
    {decision.reviewedAt && decision.reviewedAt !== decision.updatedAt && <p className="text-xs leading-5 text-muted-foreground">Revisión registrada el <time dateTime={decision.reviewedAt}>{dateLabel(decision.reviewedAt)}</time> · hora de Chile.</p>}
    {decision.reviewClassification && <p>{classificationLabels[decision.reviewClassification]}</p>}
    {decision.outcome && <p className="whitespace-pre-wrap break-words"><span className="font-medium">Resultado declarado por ti: </span>{excerpt(decision.outcome)}</p>}
    <SourceLink source={source} />
  </div>
}

/** Uses the same verified plan read; viewing evidence never writes or replaces an edit. */
export function A2PlanEvidenceReview({ evidence, hasPlan, hasDraft, disabled, onReview }: {
  evidence: A2ReviewEvidence
  hasPlan: boolean
  hasDraft: boolean
  disabled: boolean
  onReview: () => void
}) {
  // Time affects the suggestion, never the stored evidence or its context hash.
  const suggestion = buildA2ReviewSuggestion(evidence, a2PlanToday())
  const history = evidence.a3.history
  const sources = a2ReviewSourceRefs(evidence)
  const source = (id: A2ReviewSourceRef['id']) => sources.find(ref => ref.id === id)

  return <section data-a2-plan-evidence-review aria-label="Revisión del plan con tus registros" className="min-w-0 space-y-3 rounded-lg border border-border bg-background/60 p-3 text-sm leading-6">
    <h4 className="font-semibold">Antes de seguir</h4>
    <div role="status" className="space-y-2" data-a2-review-suggestion>
      <p className="font-medium">{suggestion.title}</p>
      <p>{suggestion.reason}</p>
      {suggestion.suggestedAction && <p><span className="font-medium">Para revisar: </span>{suggestion.suggestedAction}</p>}
    </div>
    <Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal" disabled={disabled} onClick={onReview}>
      {hasDraft ? 'Volver a mi edición' : hasPlan ? 'Revisar mi plan' : 'Revisar antes de preparar mi plan'}
    </Button>
    <details className="min-w-0 border-t border-border pt-2">
      <summary className="min-h-11 cursor-pointer rounded-md py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Ver registros usados</summary>
      <div className="min-w-0 space-y-5 pt-2">
        <section aria-label="Registros de Entrenamiento" data-a2-review-source="a3" className="min-w-0 space-y-3">
          <h5 className="font-semibold">Entrenamiento · A3</h5>
          {evidence.a3.status !== 'available' ? <p>{sourceMessages.a3[evidence.a3.status]}</p> : history && <>
            <p>Respuestas declaradas por ti; sin evaluación de capacidad.</p>
            {history.baseline && <CaptureSummary capture={history.baseline} label="Punto de partida" source={source('a3_baseline')} />}
            {history.followUp && <CaptureSummary capture={history.followUp} label="Seguimiento" source={source('a3_follow_up')} />}
            {history.pairStatus === 'out_of_order' && <p>El punto de partida es posterior al seguimiento; no representan un antes y después.</p>}
            {history.pairStatus === 'follow_up_only' && <p>Hay seguimiento, pero no un punto de partida de esta versión.</p>}
            {history.pairStatus === 'baseline_only' && <p>Aún no hay un seguimiento guardado en esta versión.</p>}
          </>}
        </section>
        <section aria-label="Registros del Radar" data-a2-review-source="a4" className="min-w-0 space-y-3">
          <h5 className="font-semibold">Radar · A4</h5>
          {evidence.a4.status !== 'available' ? <p>{sourceMessages.a4[evidence.a4.status]}</p> : <>
            <p>Decisiones y resultados que declaraste; no confirman por sí solos un resultado externo ni su causa.</p>
            {evidence.a4.nextReview && <DecisionSummary decision={evidence.a4.nextReview} label="Decisión por revisar" source={source('a4_next_review')} />}
            {evidence.a4.latestReview && <DecisionSummary decision={evidence.a4.latestReview} label="Revisión registrada" source={source('a4_latest_review')} />}
          </>}
        </section>
      </div>
    </details>
  </section>
}
