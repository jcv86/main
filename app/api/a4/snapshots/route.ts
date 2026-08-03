import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { computeA4EvidencePulse } from '@/lib/a4/evidence-pulse'
import {
  dailySnapshotFromPulse,
  normalizeA4DailySnapshot,
} from '@/lib/a4/daily-snapshots'
import type { A4Decision, A4VerifiedSignal } from '@/lib/a4/strategic-radar'

const SNAPSHOT_COLUMNS = [
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

async function resolveA4Request() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return {
      response: NextResponse.json({ error: 'No autenticado' }, { status: 401 }),
      currentUser: null,
      supabase: null,
    }
  }

  const supabase = createAdminClient()
  const access = await checkA4Access(currentUser.id, supabase)
  if (!access.canAccess) {
    return {
      response: NextResponse.json(
        { error: getA4AccessDenialMessage(), code: access.reason },
        { status: 403 },
      ),
      currentUser: null,
      supabase: null,
    }
  }

  return { response: null, currentUser, supabase }
}

export async function GET() {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    const { data, error } = await resolved.supabase!
      .from('a4_daily_evidence_snapshots')
      .select(SNAPSHOT_COLUMNS)
      .eq('user_id', resolved.currentUser!.id)
      .order('snapshot_date', { ascending: false })
      .limit(31)

    if (error) {
      console.error('[v0] A4 snapshot history error:', error)
      return NextResponse.json(
        { error: 'No pudimos cargar el historial diario del Radar.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      snapshots: (data ?? []).map((row) =>
        normalizeA4DailySnapshot(row as Record<string, unknown>),
      ),
    })
  } catch (error) {
    console.error('[v0] A4 snapshot GET error:', error)
    return NextResponse.json(
      { error: 'No pudimos cargar el historial diario del Radar.' },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    const userId = resolved.currentUser!.id
    const supabase = resolved.supabase!
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
      console.error('[v0] A4 snapshot source error:', {
        signals: signalsResult.error,
        decisions: decisionsResult.error,
      })
      return NextResponse.json(
        { error: 'No pudimos calcular el corte desde la evidencia actual.' },
        { status: 500 },
      )
    }

    const pulse = computeA4EvidencePulse(
      (signalsResult.data ?? []) as A4VerifiedSignal[],
      (decisionsResult.data ?? []) as A4Decision[],
      new Date(),
    )
    const snapshotValues = dailySnapshotFromPulse(pulse)

    const { data: saved, error: saveError } = await supabase
      .from('a4_daily_evidence_snapshots')
      .upsert(
        {
          user_id: userId,
          ...snapshotValues,
        },
        { onConflict: 'user_id,snapshot_date' },
      )
      .select(SNAPSHOT_COLUMNS)
      .single()

    if (saveError || !saved) {
      console.error('[v0] A4 snapshot save error:', saveError)
      return NextResponse.json(
        { error: 'No pudimos guardar el corte diario del Radar.' },
        { status: 500 },
      )
    }

    const snapshot = normalizeA4DailySnapshot(
      saved as Record<string, unknown>,
    )
    const { data: previousData, error: previousError } = await supabase
      .from('a4_daily_evidence_snapshots')
      .select(SNAPSHOT_COLUMNS)
      .eq('user_id', userId)
      .lt('snapshot_date', snapshot.snapshot_date)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (previousError) {
      console.error('[v0] A4 previous snapshot error:', previousError)
    }

    return NextResponse.json({
      success: true,
      snapshot,
      previousSnapshot: previousData
        ? normalizeA4DailySnapshot(previousData as Record<string, unknown>)
        : null,
      refreshedAt: snapshot.updated_at,
    })
  } catch (error) {
    console.error('[v0] A4 snapshot POST error:', error)
    return NextResponse.json(
      { error: 'No pudimos guardar el corte diario del Radar.' },
      { status: 500 },
    )
  }
}
