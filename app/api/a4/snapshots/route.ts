import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import {
  A4_SNAPSHOT_COLUMNS,
  captureA4DailySnapshotForUser,
} from '@/lib/a4/snapshot-capture'
import { normalizeA4DailySnapshot } from '@/lib/a4/daily-snapshots'

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
      .select(A4_SNAPSHOT_COLUMNS)
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

    const result = await captureA4DailySnapshotForUser({
      userId: resolved.currentUser!.id,
      supabase: resolved.supabase!,
      now: new Date(),
    })

    if (result.status === 'no_evidence') {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'NO_EVIDENCE',
        message: 'El primer corte se creará cuando registres una señal o decisión.',
      })
    }

    return NextResponse.json({
      success: true,
      skipped: false,
      snapshot: result.snapshot,
      previousSnapshot: result.previousSnapshot,
      evidenceChanged: result.evidenceChanged,
      summary: result.summary,
      refreshedAt: result.snapshot.updated_at,
    })
  } catch (error) {
    console.error('[v0] A4 snapshot POST error:', error)
    return NextResponse.json(
      { error: 'No pudimos guardar el corte diario del Radar.' },
      { status: 500 },
    )
  }
}
