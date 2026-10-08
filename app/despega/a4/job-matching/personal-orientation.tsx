'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type {
  OpportunityPersonalOrientation,
  PersonalContextSummary,
  PersonalEvidenceNature,
  PersonalEvidenceSource,
  PersonalSourceStatus,
} from '@/lib/opportunities/personal-orientation-types'

const SOURCE_LABELS: Record<PersonalEvidenceSource, string> = {
  cv: 'CV',
  dtc_goal: 'Objetivo profesional',
  dtc_a1: 'A1 · Autoconocimiento',
  dtc_a2: 'A2 · Ruta de desarrollo',
  dtc_a3: 'A3 · Entrenamiento',
}
const SOURCE_STATUS_LABELS: Record<PersonalSourceStatus, string> = {
  available: 'Disponible',
  empty: 'Sin evidencia registrada',
  unavailable: 'No disponible en esta consulta',
  partial: 'Disponible en parte',
}
const NATURE_LABELS: Record<PersonalEvidenceNature, string> = {
  declared_skill: 'Habilidad declarada',
  declared_experience: 'Experiencia declarada',
  declared_goal: 'Objetivo declarado',
  self_reported_preference: 'Preferencia autodeclarada',
  practice_artifact: 'Ejercicio registrado',
}
const OFFER_FIELD_LABELS = {
  title: 'Cargo publicado',
  requirements: 'Requisito publicado',
  skills: 'Habilidad publicada',
  workMode: 'Modalidad publicada',
  location: 'Ubicación publicada',
} as const
const RECORDED_DATE_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  hourCycle: 'h23', timeZone: 'America/Santiago',
})

// These first-party routes are also checked by the server projection. A malformed
// payload must never turn a source reference into an external or executable link.
const SOURCE_ROUTES: Record<string, string> = {
  '/despega/career-identity': 'Revisar mi objetivo',
  '/despega/a1-report': 'Revisar mi análisis de A1',
  '/despega/a2': 'Revisar mi ruta',
  '/despega/a3': 'Revisar mi entrenamiento',
  '/despega/a3/cv-builder-studio': 'Revisar mi CV',
  '/despega/a3/value-mining-lab': 'Revisar mi experiencia',
  '/despega/a3/job-decoder': 'Analizar esta oportunidad',
  '/despega/a3/answer-architecture': 'Preparar mi respuesta',
  '/despega/a3/ajuste-por-vacante': 'Preparar mi postulación',
  '/despega/recorrido': 'Revisar mi recorrido',
}

function safeSourceRoute(href?: string) {
  return href && Object.prototype.hasOwnProperty.call(SOURCE_ROUTES, href) ? href : null
}

function RecordedDate({ value, label = 'Registro' }: { value: string | null; label?: string }) {
  const date = value ? new Date(value) : null
  if (!date || !Number.isFinite(date.getTime())) return <span>Sin fecha registrada</span>
  const formatted = RECORDED_DATE_FORMATTER.format(date)
  return <span>{label}: <time dateTime={value!}>{formatted}</time> (Chile)</span>
}

const SUMMARY_COPY: Record<PersonalContextSummary['status'], { title: string; description: string }> = {
  available: {
    title: 'Tu información para orientar la búsqueda',
    description: 'Cada oferta muestra los cruces respaldados por tus datos y la publicación, junto con lo que falta confirmar.',
  },
  partial: {
    title: 'Orientación con contexto parcial',
    description: 'Usamos las fuentes disponibles. Puedes seguir explorando; en cada oferta indicamos qué está respaldado y qué falta confirmar.',
  },
  empty: {
    title: 'Todavía no hay evidencia personal registrada',
    description: 'Puedes explorar con tus filtros. Al incorporar tu CV y tu trabajo en DTC podremos buscar cruces con los requisitos de las ofertas.',
  },
  unavailable: {
    title: 'No pudimos consultar tu contexto personal',
    description: 'Puedes seguir explorando con tus filtros y volver a consultar el contexto. Este estado no indica una falta de experiencia o habilidades.',
  },
}

/** Availability only. Personal interpretation and source excerpts come from the API. */
export function PersonalContextStatus({ context, onRefresh }: {
  context?: PersonalContextSummary
  onRefresh?: () => void
}) {
  if (!context) return null
  const copy = SUMMARY_COPY[context.status]
  const incomplete = context.sources.filter(source => source.status !== 'available')
  return <section aria-label="Datos para la orientación personal" className="min-w-0 space-y-3 rounded-xl border border-border bg-card p-4">
    <div>
      <h3 className="text-base font-semibold text-foreground">{copy.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
    </div>
    {!!incomplete.length && <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground" aria-label="Fuentes pendientes de orientación">
      {incomplete.map(source => <li key={source.source} className="break-words"><span className="font-medium text-foreground">{SOURCE_LABELS[source.source]}:</span> {SOURCE_STATUS_LABELS[source.status]}</li>)}
    </ul>}
    <details className="group/context min-w-0 rounded-lg border border-border">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span>Qué datos usamos</span><ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open/context:rotate-180" />
      </summary>
      <ul className="space-y-3 border-t border-border p-3 text-sm">
        {context.sources.map(source => <li key={source.source} className="min-w-0 space-y-1">
          <p className="break-words text-foreground"><span className="font-medium">{SOURCE_LABELS[source.source]}:</span> {SOURCE_STATUS_LABELS[source.status]}</p>
          <p className="text-xs text-muted-foreground"><RecordedDate value={source.updatedAt} /></p>
        </li>)}
      </ul>
    </details>
    {(context.status === 'unavailable' || context.status === 'partial') && onRefresh && <button type="button" onClick={onRefresh} className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Volver a consultar mi contexto</button>}
  </section>
}

/** Render server-issued reasons, questions and support; never inspect a local profile. */
export function PersonalOrientation({ orientation, title }: {
  orientation?: OpportunityPersonalOrientation
  title: string
}) {
  if (!orientation) return null
  const reasons = orientation.reasons.slice(0, 3)
  const questions = orientation.toConfirm.slice(0, 3)
  const referenced = new Set([...reasons.flatMap(reason => reason.supportIds), ...orientation.nextStep.supportIds])
  const support = orientation.support.filter((proof, index, proofs) => referenced.has(proof.id) && proofs.findIndex(item => item.id === proof.id) === index).slice(0, 6)
  const actionHref = safeSourceRoute(orientation.nextStep.href)
  return <section aria-label={'Tu orientación para ' + title} className="min-w-0 space-y-4 rounded-xl border border-border bg-muted/20 p-4">
    <div>
      <h4 className="text-sm font-semibold text-foreground">Tu orientación para esta oferta</h4>
      <p className="mt-1.5 break-words text-sm leading-relaxed text-muted-foreground">{orientation.summary}</p>
    </div>
    {!!reasons.length && <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-foreground" aria-label="Motivos respaldados">
      {reasons.map((reason, index) => <li key={reason.code + ':' + index} className="break-words">{reason.label}</li>)}
    </ul>}
    {!!questions.length && <div>
      <h5 className="text-sm font-semibold text-foreground">Por confirmar</h5>
      <ul className="mt-2 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
        {questions.map((question, index) => <li key={question.code + ':' + index} className="break-words">
          <span>{question.label}</span>
          {question.offer?.excerpt && !question.label.includes(question.offer.excerpt) && <p className="mt-1.5 text-xs leading-relaxed"><span className="font-medium">En la oferta: </span><q>{question.offer.excerpt}</q></p>}
        </li>)}
      </ul>
    </div>}
    <div>
      <h5 className="text-sm font-semibold text-foreground">Tu siguiente paso</h5>
      <p className="mt-1.5 break-words text-sm leading-relaxed text-foreground">{orientation.nextStep.label}</p>
      {actionHref && <Link href={actionHref} className="mt-1 inline-flex min-h-11 max-w-full items-center rounded-sm text-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">{SOURCE_ROUTES[actionHref]}</Link>}
    </div>
    {!!support.length && <details className="group/support min-w-0 rounded-lg border border-border bg-background/40">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
        <span>Ver en qué nos basamos<span className="sr-only"> para {title}</span></span><ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open/support:rotate-180" />
      </summary>
      <ul className="min-w-0 space-y-4 border-t border-border p-3">
        {support.map(proof => {
          const href = safeSourceRoute(proof.personal.href)
          return <li key={proof.id} className="min-w-0 space-y-3 rounded-lg border border-border bg-card p-3">
            <div className="min-w-0">
              <p className="break-words text-xs font-semibold text-foreground">{SOURCE_LABELS[proof.personal.source]} · {NATURE_LABELS[proof.personal.nature]}</p>
              <p className="mt-1 break-words text-sm font-medium text-foreground">{proof.personal.label}</p>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground"><q>{proof.personal.text}</q></p>
              <p className="mt-2 text-xs text-muted-foreground"><RecordedDate value={proof.personal.observedAt} /></p>
              {proof.personal.expiresAt && <p className="mt-1 text-xs text-muted-foreground"><RecordedDate value={proof.personal.expiresAt} label="Vigencia hasta" /></p>}
            </div>
            <div className="min-w-0 border-t border-border pt-3">
              <p className="text-xs font-semibold text-foreground">En la oferta · {OFFER_FIELD_LABELS[proof.offer.field]}</p>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground"><q>{proof.offer.excerpt || proof.offer.value}</q></p>
            </div>
            {href && <Link href={href} className="inline-flex min-h-11 max-w-full items-center rounded-sm text-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><span className="break-words">Revisar fuente<span className="sr-only">: {proof.personal.label}</span></span></Link>}
          </li>
        })}
      </ul>
    </details>}
  </section>
}
