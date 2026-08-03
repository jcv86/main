import type { createAdminClient } from '@/lib/supabase/server'
import { computeA4EvidencePulse } from './evidence-pulse'
import {
  compareA4DailySnapshots,
  dailySnapshotFromPulse,
  normalizeA4DailySnapshot,
  type A4DailyEvidenceSnapshot,
  type A4SnapshotComparison,
} from './daily-snapshots'
import type { A4Decision, A4VerifiedSignal } from './strategic-radar'

export const A4_SNAPSHOT_COLUMNS = [
  'id',
  'snapshot_date',
  'timezone',
  'priority',
  'active_signals',
  'facts',
  'hypotheses',
  'recent_signals',
  'stale_signals',
  'low_confidence_hypotheses',
  'covered_categories',
  'category_counts',
  'overdue_reviews',
  'reviews_today',
  'reviews_next_7_days',
  'reviews_later',
  'open_decisions',
  'closed_decisions',
  'created_at',
  'updated_at',
].join(',')

const SIGNAL_COLUMNS = [
  'id',
  'title',
  'category',
  'classification',
  'summary',
  'relevance',
  'confidence',
  'source_type',
  'source_name',
  'source_url',
  'source_reference',
  'source_date',
  'status',
  'created_at',
  'updated_at',
].join(',')

const DECISION_COLUMNS = [
  'id',
  'signal_id',
  'decision',
  'rationale',
  'expected_evidence',
  'status',
  'review_on',
  'outcome',
  'reviewed_at',
  'created_at',
  'updated_at',
].join(',')

type AdminClient = ReturnType<typeof createAdminClient>

export interface A4SnapshotCaptureSummary {
  currentDate: string
  previousDate: string
  daysApart: number
  metrics: A4SnapshotComparison['metrics']
  categoryChanges: A4SnapshotComparison['categoryChanges']
}

export type A4SnapshotCaptureResult =
  | {
      status: 'no_evidence'
      snapshot: null
      previousSnapshot: null
      evidenceChanged: false
      summary: null
      latestEvidenceUpdatedAt: null
    }
  | {
      status: 'captured'
      snapshot: A4DailyEvidenceSnapshot
      previousSnapshot: A4DailyEvidenceSnapshot | null
      evidenceChanged: boolean
      summary: A4SnapshotCaptureSummary | null
      latestEvidenceUpdatedAt: string
    }

function latestTimestamp(values: Array<string | null | undefined>): string | null {
  let latest: string | null = null
  for (const value of values) {
    if (!value || Number.isNaN(new Date(value).getTime())) continue
    if (!latest || value > latest) latest = value
  }
  return latest
}

export async function captureA4DailySnapshotForUser({
  userId,
  supabase,
  now = new Date(),
}: {
  userId: string
  supabase: AdminClient
  now?: Date
}): Promise<A4SnapshotCaptureResult> {
  const [signalsResult, decisionsResult] = await Promise.all([
    supabase
      .from('a4_verified_signals')
      .select(SIGNAL_COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('a4_decision_log')
      .select(DECISION_COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  if (signalsResult.error || decisionsResult.error) {
    throw new Error(
      `Unable to load A4 evidence: ${
        signalsResult.error?.message || decisionsResult.error?.message || 'unknown error'
      }`,
    )
  }

  const signals = (signalsResult.data ?? []) as unknown as A4VerifiedSignal[]
  const decisions = (decisionsResult.data ?? []) as unknown as A4Decision[]
  const latestEvidenceUpdatedAt = latestTimestamp([
    ...signals.map((signal) => signal.updated_at),
    ...decisions.map((decision) => decision.updated_at),
  ])

  if (!latestEvidenceUpdatedAt) {
    return {
      status: 'no_evidence',
      snapshot: null,
      previousSnapshot: null,
      evidenceChanged: false,
      summary: null,
      latestEvidenceUpdatedAt: null,
    }
  }

  const pulse = computeA4EvidencePulse(signals, decisions, now)
  const values = dailySnapshotFromPulse(pulse)
  const { data: previousData, error: previousError } = await supabase
    .from('a4_daily_evidence_snapshots')
    .select(A4_SNAPSHOT_COLUMNS)
    .eq('user_id', userId)
    .lt('snapshot_date', values.snapshot_date)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (previousError) {
    throw new Error(`Unable to load previous A4 snapshot: ${previousError.message}`)
  }

  const previousSnapshot = previousData
    ? normalizeA4DailySnapshot(
        previousData as unknown as Record<string, unknown>,
      )
    : null
  const evidenceChanged = previousSnapshot
    ? latestEvidenceUpdatedAt > previousSnapshot.updated_at
    : true

  const { data: saved, error: saveError } = await supabase
    .from('a4_daily_evidence_snapshots')
    .upsert(
      {
        user_id: userId,
        ...values,
      },
      { onConflict: 'user_id,snapshot_date' },
    )
    .select(A4_SNAPSHOT_COLUMNS)
    .single()

  if (saveError || !saved) {
    throw new Error(
      `Unable to save A4 daily snapshot: ${saveError?.message || 'missing row'}`,
    )
  }

  const snapshot = normalizeA4DailySnapshot(
    saved as unknown as Record<string, unknown>,
  )
  const comparison = compareA4DailySnapshots(snapshot, previousSnapshot)
  const summary = evidenceChanged && comparison
    ? {
        currentDate: comparison.currentDate,
        previousDate: comparison.previousDate,
        daysApart: comparison.daysApart,
        metrics: comparison.metrics,
        categoryChanges: comparison.categoryChanges,
      }
    : null

  return {
    status: 'captured',
    snapshot,
    previousSnapshot,
    evidenceChanged,
    summary,
    latestEvidenceUpdatedAt,
  }
}
