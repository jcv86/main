import { A4_SIGNAL_CATEGORIES, type A4SignalCategory } from './strategic-radar'
import type { A4EvidencePulse, A4PulsePriority } from './evidence-pulse'

export type A4CategoryCounts = Record<A4SignalCategory, number>

export interface A4DailyEvidenceSnapshot {
  id: string
  snapshot_date: string
  timezone: 'America/Santiago'
  priority: A4PulsePriority
  active_signals: number
  facts: number
  hypotheses: number
  recent_signals: number
  stale_signals: number
  low_confidence_hypotheses: number
  covered_categories: number
  category_counts: A4CategoryCounts
  overdue_reviews: number
  reviews_today: number
  reviews_next_7_days: number
  reviews_later: number
  open_decisions: number
  closed_decisions: number
  created_at: string
  updated_at: string
}

export type A4DailySnapshotInsert = Omit<
  A4DailyEvidenceSnapshot,
  'id' | 'created_at' | 'updated_at'
>

export interface A4SnapshotMetricDelta {
  id:
    | 'active_signals'
    | 'recent_signals'
    | 'stale_signals'
    | 'covered_categories'
    | 'open_decisions'
    | 'overdue_reviews'
  label: string
  current: number
  previous: number
  delta: number
}

export interface A4CategoryDelta {
  id: A4SignalCategory
  label: string
  current: number
  previous: number
  delta: number
}

export interface A4SnapshotComparison {
  currentDate: string
  previousDate: string
  daysApart: number
  metrics: A4SnapshotMetricDelta[]
  categoryChanges: A4CategoryDelta[]
}

const DAY_MS = 24 * 60 * 60 * 1000

function emptyCategoryCounts(): A4CategoryCounts {
  return Object.fromEntries(
    A4_SIGNAL_CATEGORIES.map((category) => [category.id, 0]),
  ) as A4CategoryCounts
}

function isoDateToUtc(value: string): Date {
  return new Date(`${value}T12:00:00.000Z`)
}

function daysBetween(from: string, to: string): number {
  return Math.max(
    0,
    Math.round(
      (isoDateToUtc(to).getTime() - isoDateToUtc(from).getTime()) / DAY_MS,
    ),
  )
}

function finiteNonnegative(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : 0
}

export function normalizeA4CategoryCounts(value: unknown): A4CategoryCounts {
  const normalized = emptyCategoryCounts()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return normalized

  const source = value as Record<string, unknown>
  for (const category of A4_SIGNAL_CATEGORIES) {
    normalized[category.id] = finiteNonnegative(source[category.id])
  }
  return normalized
}

export function dailySnapshotFromPulse(
  pulse: A4EvidencePulse,
): A4DailySnapshotInsert {
  const categoryCounts = emptyCategoryCounts()
  for (const category of pulse.categoryCoverage) {
    categoryCounts[category.id] = category.count
  }

  return {
    snapshot_date: pulse.today,
    timezone: 'America/Santiago',
    priority: pulse.priority,
    active_signals: pulse.activeSignals.length,
    facts: pulse.facts,
    hypotheses: pulse.hypotheses,
    recent_signals: pulse.recentSignals.length,
    stale_signals: pulse.staleSignals.length,
    low_confidence_hypotheses: pulse.lowConfidenceHypotheses.length,
    covered_categories: pulse.coveredCategories,
    category_counts: categoryCounts,
    overdue_reviews: pulse.overdueReviews,
    reviews_today: pulse.reviewsToday,
    reviews_next_7_days: pulse.reviewsNext7Days,
    reviews_later: pulse.reviewsLater,
    open_decisions: pulse.reviewQueue.length,
    closed_decisions: pulse.closedDecisions,
  }
}

export function normalizeA4DailySnapshot(
  value: Record<string, unknown>,
): A4DailyEvidenceSnapshot {
  return {
    id: String(value.id || ''),
    snapshot_date: String(value.snapshot_date || ''),
    timezone: 'America/Santiago',
    priority: String(value.priority || 'building_evidence') as A4PulsePriority,
    active_signals: finiteNonnegative(value.active_signals),
    facts: finiteNonnegative(value.facts),
    hypotheses: finiteNonnegative(value.hypotheses),
    recent_signals: finiteNonnegative(value.recent_signals),
    stale_signals: finiteNonnegative(value.stale_signals),
    low_confidence_hypotheses: finiteNonnegative(
      value.low_confidence_hypotheses,
    ),
    covered_categories: finiteNonnegative(value.covered_categories),
    category_counts: normalizeA4CategoryCounts(value.category_counts),
    overdue_reviews: finiteNonnegative(value.overdue_reviews),
    reviews_today: finiteNonnegative(value.reviews_today),
    reviews_next_7_days: finiteNonnegative(value.reviews_next_7_days),
    reviews_later: finiteNonnegative(value.reviews_later),
    open_decisions: finiteNonnegative(value.open_decisions),
    closed_decisions: finiteNonnegative(value.closed_decisions),
    created_at: String(value.created_at || ''),
    updated_at: String(value.updated_at || ''),
  }
}

export function compareA4DailySnapshots(
  current: A4DailyEvidenceSnapshot,
  previous: A4DailyEvidenceSnapshot | null,
): A4SnapshotComparison | null {
  if (!previous || previous.snapshot_date >= current.snapshot_date) return null

  const metricDefinitions = [
    ['active_signals', 'Señales activas'],
    ['recent_signals', 'Fuentes recientes'],
    ['stale_signals', 'Fuentes desactualizadas'],
    ['covered_categories', 'Categorías cubiertas'],
    ['open_decisions', 'Decisiones abiertas'],
    ['overdue_reviews', 'Revisiones vencidas'],
  ] as const

  const metrics = metricDefinitions.map(([id, label]) => ({
    id,
    label,
    current: current[id],
    previous: previous[id],
    delta: current[id] - previous[id],
  }))

  const categoryChanges = A4_SIGNAL_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    current: current.category_counts[category.id],
    previous: previous.category_counts[category.id],
    delta:
      current.category_counts[category.id] -
      previous.category_counts[category.id],
  })).filter((category) => category.delta !== 0)

  return {
    currentDate: current.snapshot_date,
    previousDate: previous.snapshot_date,
    daysApart: daysBetween(previous.snapshot_date, current.snapshot_date),
    metrics,
    categoryChanges,
  }
}

export function sortA4SnapshotsDescending(
  snapshots: A4DailyEvidenceSnapshot[],
): A4DailyEvidenceSnapshot[] {
  return [...snapshots].sort((left, right) =>
    right.snapshot_date.localeCompare(left.snapshot_date),
  )
}
