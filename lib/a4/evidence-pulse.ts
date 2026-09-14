import {
  A4_SIGNAL_CATEGORIES,
  type A4Decision,
  type A4SignalCategory,
  type A4VerifiedSignal,
} from './strategic-radar'

export const A4_PULSE_PRIORITIES = [
  {
    id: 'overdue_reviews',
    label: 'Revisiones vencidas',
    detail: 'Hay decisiones cuya fecha de revisión ya pasó.',
  },
  {
    id: 'reviews_today',
    label: 'Revisiones para hoy',
    detail: 'Hay decisiones que deben contrastarse con evidencia hoy.',
  },
  {
    id: 'building_evidence',
    label: 'Construyendo evidencia',
    detail: 'La base activa todavía tiene menos de tres señales.',
  },
  {
    id: 'refresh_sources',
    label: 'Actualizar fuentes',
    detail: 'No hay señales activas con fuente de los últimos siete días.',
  },
  {
    id: 'monitoring',
    label: 'Seguimiento al día',
    detail: 'No hay revisiones vencidas y existe evidencia reciente.',
  },
] as const

export type A4PulsePriority = (typeof A4_PULSE_PRIORITIES)[number]['id']
export type A4ReviewTiming = 'overdue' | 'due_today' | 'next_7_days' | 'later'
export type A4NextActionKind =
  | 'review_decision'
  | 'add_signal'
  | 'refresh_signal'
  | 'monitor'

export interface A4NextAction {
  kind: A4NextActionKind
  title: string
  detail: string
  href: string
  cta: string
}

export interface A4CategoryCoverage {
  id: A4SignalCategory
  label: string
  count: number
}

export interface A4ReviewQueueItem {
  decision: A4Decision
  timing: A4ReviewTiming
  daysFromToday: number
}

export interface A4EvidencePulse {
  today: string
  priority: A4PulsePriority
  nextAction: A4NextAction
  activeSignals: A4VerifiedSignal[]
  recentSignals: A4VerifiedSignal[]
  staleSignals: A4VerifiedSignal[]
  lowConfidenceHypotheses: A4VerifiedSignal[]
  facts: number
  hypotheses: number
  categoryCoverage: A4CategoryCoverage[]
  coveredCategories: number
  uncoveredCategories: A4CategoryCoverage[]
  reviewQueue: A4ReviewQueueItem[]
  overdueReviews: number
  reviewsToday: number
  reviewsNext7Days: number
  reviewsLater: number
  closedDecisions: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function isoDateToUtc(value: string): Date {
  return new Date(`${value}T12:00:00.000Z`)
}

function addDays(value: string, days: number): string {
  const date = isoDateToUtc(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function daysBetween(from: string, to: string): number {
  return Math.round(
    (isoDateToUtc(to).getTime() - isoDateToUtc(from).getTime()) / DAY_MS,
  )
}

function isClosedDecision(decision: A4Decision): boolean {
  return decision.status === 'reviewed' || decision.status === 'discarded'
}

function reviewTiming(daysFromToday: number): A4ReviewTiming {
  if (daysFromToday < 0) return 'overdue'
  if (daysFromToday === 0) return 'due_today'
  if (daysFromToday <= 7) return 'next_7_days'
  return 'later'
}

function signalDateDescending(a: A4VerifiedSignal, b: A4VerifiedSignal): number {
  return b.source_date.localeCompare(a.source_date) || b.created_at.localeCompare(a.created_at)
}

function signalDateAscending(a: A4VerifiedSignal, b: A4VerifiedSignal): number {
  return a.source_date.localeCompare(b.source_date) || a.created_at.localeCompare(b.created_at)
}

export function pulsePriorityLabel(priority: A4PulsePriority) {
  return A4_PULSE_PRIORITIES.find((item) => item.id === priority)!
}

export function computeA4EvidencePulse(
  signals: A4VerifiedSignal[],
  decisions: A4Decision[],
  now = new Date(),
): A4EvidencePulse {
  const today = todayIso(now)
  const recentBoundary = addDays(today, -6)
  const staleBoundary = addDays(today, -30)
  const activeSignals = signals
    .filter((signal) => signal.status === 'active')
    .sort(signalDateDescending)
  const recentSignals = activeSignals.filter(
    (signal) => signal.source_date >= recentBoundary && signal.source_date <= today,
  )
  const staleSignals = activeSignals
    .filter((signal) => signal.source_date < staleBoundary)
    .sort(signalDateAscending)
  const lowConfidenceHypotheses = activeSignals.filter(
    (signal) => signal.classification === 'hypothesis' && signal.confidence <= 2,
  )
  const facts = activeSignals.filter((signal) => signal.classification === 'fact').length
  const hypotheses = activeSignals.length - facts
  const categoryCoverage = A4_SIGNAL_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    count: activeSignals.filter((signal) => signal.category === category.id).length,
  }))
  const uncoveredCategories = categoryCoverage.filter((category) => category.count === 0)

  const openDecisions = decisions.filter((decision) => !isClosedDecision(decision))
  const reviewQueue = openDecisions
    .map((decision) => {
      const daysFromToday = daysBetween(today, decision.review_on)
      return {
        decision,
        timing: reviewTiming(daysFromToday),
        daysFromToday,
      }
    })
    .sort(
      (a, b) =>
        a.decision.review_on.localeCompare(b.decision.review_on) ||
        a.decision.created_at.localeCompare(b.decision.created_at),
    )

  const overdueReviews = reviewQueue.filter((item) => item.timing === 'overdue').length
  const reviewsToday = reviewQueue.filter((item) => item.timing === 'due_today').length
  const reviewsNext7Days = reviewQueue.filter(
    (item) => item.timing === 'next_7_days',
  ).length
  const reviewsLater = reviewQueue.filter((item) => item.timing === 'later').length

  let priority: A4PulsePriority = 'monitoring'
  if (overdueReviews > 0) priority = 'overdue_reviews'
  else if (reviewsToday > 0) priority = 'reviews_today'
  else if (activeSignals.length < 3) priority = 'building_evidence'
  else if (recentSignals.length === 0) priority = 'refresh_sources'

  const firstReview = reviewQueue.find(
    (item) => item.timing === 'overdue' || item.timing === 'due_today',
  )
  let nextAction: A4NextAction
  if (firstReview) {
    nextAction = {
      kind: 'review_decision',
      title: firstReview.decision.decision,
      detail:
        firstReview.timing === 'overdue'
          ? `La revisión está vencida hace ${Math.abs(firstReview.daysFromToday)} día${Math.abs(firstReview.daysFromToday) === 1 ? '' : 's'}.`
          : 'La revisión comprometida corresponde a hoy.',
      href: `#decision-${firstReview.decision.id}`,
      cta: 'Registrar resultado',
    }
  } else if (activeSignals.length < 3) {
    nextAction = {
      kind: 'add_signal',
      title: 'Agregar una señal verificable',
      detail: `La base activa tiene ${activeSignals.length} de las 3 señales mínimas para contrastar decisiones.`,
      href: '#a4-new-signal',
      cta: 'Registrar señal',
    }
  } else if (recentSignals.length === 0) {
    const oldestSignal = staleSignals[0]
    nextAction = {
      kind: 'refresh_signal',
      title: oldestSignal
        ? `Actualizar evidencia: ${oldestSignal.title}`
        : 'Agregar evidencia reciente',
      detail: oldestSignal
        ? `La fuente más antigua es del ${oldestSignal.source_date}. Registra una señal nueva con evidencia actual.`
        : 'No hay una fuente activa de los últimos siete días.',
      href: '#a4-new-signal',
      cta: 'Agregar evidencia',
    }
  } else {
    nextAction = {
      kind: 'monitor',
      title: 'Revisar la bitácora estratégica',
      detail: 'No hay revisiones vencidas y existe evidencia reciente. Mantén el seguimiento trazable.',
      href: '#a4-workspace',
      cta: 'Abrir bitácora',
    }
  }

  return {
    today,
    priority,
    nextAction,
    activeSignals,
    recentSignals,
    staleSignals,
    lowConfidenceHypotheses,
    facts,
    hypotheses,
    categoryCoverage,
    coveredCategories: categoryCoverage.length - uncoveredCategories.length,
    uncoveredCategories,
    reviewQueue,
    overdueReviews,
    reviewsToday,
    reviewsNext7Days,
    reviewsLater,
    closedDecisions: decisions.length - openDecisions.length,
  }
}
