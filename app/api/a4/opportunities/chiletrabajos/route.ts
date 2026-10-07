import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchChileTrabajosBatch } from '@/lib/opportunities/sources/chiletrabajos'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const user = await resolveServerUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const supabase = createAdminClient()
  const access = await checkA4Access(user.id, supabase)
  if (!access.canAccess) return NextResponse.json({ error: getA4AccessDenialMessage(), code: access.reason }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').slice(0, 100)
  const location = (searchParams.get('location') ?? 'Santiago').slice(0, 100)
  const batch = await fetchChileTrabajosBatch(query, location, 12)
  const invalidQuery = batch.diagnostics.failure_code === 'unsupported_location'
  const unavailable = ['unavailable', 'parse_failed'].includes(batch.diagnostics.outcome)
  return NextResponse.json({
    success: !unavailable,
    source: 'chiletrabajos',
    fetched_at: batch.fetchedAt,
    query,
    location,
    count: batch.jobs.length,
    opportunities: batch.jobs,
    provider_status: batch.diagnostics.outcome,
    diagnostics: batch.diagnostics,
    ...(invalidQuery ? { code: 'unsupported_location', error: 'Selecciona una ciudad compatible o busca en todo Chile.' } :
      unavailable ? { code: 'provider_unavailable', error: 'No pudimos verificar las ofertas de Chiletrabajos. Intenta nuevamente más tarde.' } : {}),
  }, {
    status: invalidQuery ? 400 : unavailable ? batch.diagnostics.outcome === 'parse_failed' ? 502 : 503 : 200,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
