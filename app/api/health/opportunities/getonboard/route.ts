import { NextResponse } from 'next/server'
import { fetchGetOnBoardBatch, GetOnBoardProviderError, isGetOnBoardJobUrl } from '@/lib/opportunities/sources/getonboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0', 'CDN-Cache-Control': 'no-store' }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = (searchParams.get('category') || 'programming').slice(0, 80)
  const startedAt = Date.now()
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
        ok: false,
        provider: 'getonboard',
        category,
        count: 0,
        valid_original_urls: 0,
        latency_ms: Date.now() - startedAt,
        checked_at: batch.fetchedAt,
        diagnostics,
        sample: [],
        code: 'GETONBOARD_PAYLOAD_INVALID',
        error: 'Get on Board respondió con un formato que no pudimos interpretar.',
      }, { status: 502, headers: NO_STORE_HEADERS })
    }
    const opportunities = batch.jobs
    const sample = opportunities.slice(0, 3).map((item) => ({
      sourceId: item.sourceId,
      title: item.title,
      company: item.company,
      location: item.location,
      workMode: item.workMode,
      originalUrl: item.originalUrl,
      publishedAt: item.publishedAt,
      verificationStatus: item.verificationStatus,
    }))
    return NextResponse.json({
      // An explicit empty data array is a successful connection with no matches.
      ok: true,
      provider: 'getonboard',
      category,
      count: opportunities.length,
      valid_original_urls: opportunities.filter((item) => isGetOnBoardJobUrl(item.originalUrl, item.sourceId)).length,
      location_resolved: opportunities.filter((item) => Boolean(item.location)).length,
      work_mode_resolved: opportunities.filter((item) => Boolean(item.workMode)).length,
      latency_ms: Date.now() - startedAt,
      checked_at: batch.fetchedAt,
      diagnostics,
      sample,
    }, { headers: NO_STORE_HEADERS })
  } catch (error) {
    const base = {
      ok: false,
      provider: 'getonboard',
      category,
      count: 0,
      latency_ms: Date.now() - startedAt,
      checked_at: new Date().toISOString(),
      sample: [],
    }
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
