import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  A2_ACTIVITY_TIMEZONE,
  buildA2ActivitySummary,
} from '@/lib/a2/activity'

interface CompletionActivityRow {
  day?: unknown
  created_at?: unknown
  completed_at?: unknown
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * GET /api/a2/activity
 *
 * Uses the immutable row creation instant as the original completion activity
 * date. `completed_at` is a compatibility fallback for older rows.
 */
export async function GET() {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json(
        {
          success: true,
          ...buildA2ActivitySummary([], new Date(), A2_ACTIVITY_TIMEZONE),
        },
        { status: 200 },
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('a2_user_task_completions')
      .select('day, created_at, completed_at')
      .eq('user_id', currentUser.id)
      .not('completed_at', 'is', null)

    if (error) {
      console.error('[v0] Error reading A2 activity:', error)
      return NextResponse.json(
        { error: 'No pudimos cargar la continuidad de Tu Ruta.' },
        { status: 500 },
      )
    }

    const records = ((data || []) as CompletionActivityRow[]).map((row) => ({
      day: Number(row.day),
      activityAt: textValue(row.created_at) || textValue(row.completed_at) || null,
    }))

    return NextResponse.json(
      {
        success: true,
        ...buildA2ActivitySummary(records, new Date(), A2_ACTIVITY_TIMEZONE),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[v0] A2 activity summary error:', error)
    return NextResponse.json(
      { error: 'No pudimos calcular la continuidad de Tu Ruta.' },
      { status: 500 },
    )
  }
}
