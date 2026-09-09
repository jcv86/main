import { NextResponse } from 'next/server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { ANALYTICS_STAGES, eventSchema } from '@/lib/v1-analytics/schema'

const emptyMetrics = () => ({
  byStage: { c1: 0, a1: 0, a2: 0, a3: 0, a4: 0, cross: 0 },
  completionRate: {} as Record<string, number>,
  dropOffPoints: {} as Record<string, string>,
  totalErrors: 0,
  uniqueSessions: 0,
  conversionC1toA1: 0,
  conversionA1toA2: 0,
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })

  const parsed = eventSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Evento analítico inválido.' }, { status: 400 })
  }

  const { error } = await supabase.from('v1_analytics').insert({
    event_type: parsed.data.event,
    stage: parsed.data.stage,
    timestamp: new Date().toISOString(),
    session_id: parsed.data.sessionId,
    user_id: user.id,
    metadata: parsed.data.metadata ?? {},
  })

  if (error) {
    // Analytics must never break the journey. Do not log payloads, IDs or DB details.
    console.warn('[v1-analytics] storage unavailable')
    return NextResponse.json(
      { accepted: true, stored: false, reason: 'analytics_storage_unavailable' },
      { status: 202 },
    )
  }

  return NextResponse.json({ accepted: true, stored: true }, { status: 201 })
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })

  const admin = createAdminClient()
  const { data: role } = await admin
    .from('user_roles_extended')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (role?.role !== 'superadmin') {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const requestedDays = Number(new URL(request.url).searchParams.get('days') ?? 7)
  const days = Number.isFinite(requestedDays) ? Math.min(90, Math.max(1, Math.trunc(requestedDays))) : 7
  const since = new Date(Date.now() - days * 86_400_000).toISOString()
  const { data, error } = await admin
    .from('v1_analytics')
    .select('event_type,stage,session_id')
    .gte('timestamp', since)
    .limit(10_000)

  if (error) {
    return NextResponse.json({ metrics: emptyMetrics(), available: false }, { status: 200 })
  }

  const rows = data ?? []
  const metrics = emptyMetrics()
  const sessionsByStage = Object.fromEntries(
    ANALYTICS_STAGES.map(stage => [stage, new Set<string>()]),
  ) as Record<typeof ANALYTICS_STAGES[number], Set<string>>
  const sessionsByCompletion = new Map<string, Set<string>>()

  for (const row of rows) {
    if (row.stage in sessionsByStage) {
      sessionsByStage[row.stage as typeof ANALYTICS_STAGES[number]].add(row.session_id)
    }
    if (row.event_type.endsWith('_completed')) {
      const sessions = sessionsByCompletion.get(row.event_type) ?? new Set<string>()
      sessions.add(row.session_id)
      sessionsByCompletion.set(row.event_type, sessions)
    }
    if (row.event_type.includes('error')) metrics.totalErrors++
  }

  for (const stage of ANALYTICS_STAGES) metrics.byStage[stage] = sessionsByStage[stage].size
  for (const [event, sessions] of sessionsByCompletion) {
    metrics.completionRate[event] = sessions.size
  }

  metrics.uniqueSessions = new Set(rows.map(row => row.session_id)).size
  metrics.conversionC1toA1 = metrics.byStage.c1 ? metrics.byStage.a1 / metrics.byStage.c1 : 0
  metrics.conversionA1toA2 = metrics.byStage.a1 ? metrics.byStage.a2 / metrics.byStage.a1 : 0
  metrics.dropOffPoints = {
    'C1 → A1': `${Math.max(0, (1 - metrics.conversionC1toA1) * 100).toFixed(1)}%`,
    'A1 → A2': `${Math.max(0, (1 - metrics.conversionA1toA2) * 100).toFixed(1)}%`,
  }

  return NextResponse.json({ metrics, available: true, windowDays: days })
}
