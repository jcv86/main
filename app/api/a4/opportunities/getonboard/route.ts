import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchGetOnBoardBatch, GetOnBoardProviderError } from '@/lib/opportunities/sources/getonboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store' }

export async function GET(request: Request) {
  const user = await resolveServerUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers: NO_STORE_HEADERS })

  const supabase = createAdminClient()
  const access = await checkA4Access(user.id, supabase)
  if (!access.canAccess) {
    return NextResponse.json({ error: getA4AccessDenialMessage(), code: access.reason }, { status: 403, headers: NO_STORE_HEADERS })
  }

  const { searchParams } = new URL(request.url)
  const category = (searchParams.get('category') || 'programming').slice(0, 80)
  const context = { source: 'getonboard', coverage: 'public_api', category }
  try {
    const batch = await fetchGetOnBoardBatch(category, 1, { signal: request.signal })
    const diagnostics = {
      received: batch.diagnostics.received,
      considered: batch.diagnostics.considered,
      normalized: batch.diagnostics.normalized,
      rejected: batch.diagnostics.rejected,
      returned: batch.diagnostics.returned,
      outcome: batch.diagnostics.outcome,
      ...(['payload_shape', 'no_valid_jobs'].includes(batch.diagnostics.failure_code || '')
        ? { failure_code: batch.diagnostics.failure_code } : {}),
    }
    if (diagnostics.outcome === 'parse_failed') {
      return NextResponse.json({
        ...context, success: false, fetched_at: batch.fetchedAt, count: 0, opportunities: [], diagnostics,
        code: 'GETONBOARD_PAYLOAD_INVALID',
        error: 'Get on Board respondió con un formato que no pudimos interpretar.',
      }, { status: 502, headers: NO_STORE_HEADERS })
    }

    // This endpoint only reads the provider. Catalog persistence belongs to the scheduler.
    const opportunities = batch.jobs.map((item) => ({
      source: item.source,
      sourceId: item.sourceId,
      title: item.title,
      company: item.company,
      location: item.location,
      remote: item.remote,
      workMode: item.workMode,
      description: item.description,
      requirements: item.requirements,
      skills: item.skills,
      originalUrl: item.originalUrl,
      publishedAt: item.publishedAt,
      lastVerifiedAt: item.lastVerifiedAt,
      verificationStatus: item.verificationStatus,
    }))
    return NextResponse.json({
      ...context,
      success: true,
      fetched_at: batch.fetchedAt,
      count: opportunities.length,
      diagnostics,
      opportunities,
    }, { headers: NO_STORE_HEADERS })
  } catch (error) {
    const base = { ...context, success: false, count: 0, opportunities: [] }
    if (error instanceof GetOnBoardProviderError && error.kind === 'invalid_request') {
      return NextResponse.json({
        ...base, code: 'GETONBOARD_INVALID_REQUEST', error: 'La categoría solicitada no es válida.',
      }, { status: 400, headers: NO_STORE_HEADERS })
    }
    if (error instanceof GetOnBoardProviderError && error.kind === 'parse_failed') {
      return NextResponse.json({
        ...base, code: 'GETONBOARD_PAYLOAD_INVALID',
        error: 'Get on Board respondió con un formato que no pudimos interpretar.',
      }, { status: 502, headers: NO_STORE_HEADERS })
    }
    return NextResponse.json({
      ...base, code: 'GETONBOARD_UNAVAILABLE',
      error: 'La fuente Get on Board no está disponible temporalmente.',
    }, { status: 503, headers: NO_STORE_HEADERS })
  }
}
