import { NextResponse } from 'next/server'
import { fetchChileTrabajosBatch, isChileTrabajosJobUrl } from '@/lib/opportunities/sources/chiletrabajos'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').slice(0, 100)
  const location = (searchParams.get('location') ?? 'Santiago').slice(0, 100)
  const startedAt = Date.now()
  const batch = await fetchChileTrabajosBatch(query, location, 5, { maxCandidates: 20, budgetMs: 12_000, timeoutMs: 4_000 })
  const invalidQuery = batch.diagnostics.failure_code === 'unsupported_location'
  const connectionOk = !['unavailable', 'parse_failed'].includes(batch.diagnostics.outcome)
  const status = invalidQuery ? 400 : connectionOk ? 200 : batch.diagnostics.outcome === 'parse_failed' ? 502 : 503
  return NextResponse.json({
    ok: connectionOk,
    connection_ok: connectionOk,
    has_matches: batch.jobs.length > 0,
    provider: 'chiletrabajos',
    ...batch.diagnostics,
    // Compatibility metrics now describe active parsing separately from relevance.
    verified_active: batch.diagnostics.active,
    valid_original_urls: batch.jobs.filter(job => isChileTrabajosJobUrl(job.originalUrl, job.sourceId)).length,
    location_resolved: batch.jobs.filter(job => Boolean(job.location)).length,
    description_resolved: batch.jobs.filter(job => Boolean(job.description && job.description.length >= 40)).length,
    work_mode_resolved: batch.jobs.filter(job => Boolean(job.workMode)).length,
    latency_ms: Date.now() - startedAt,
    checked_at: batch.fetchedAt,
    sample: batch.jobs.slice(0, 3).map(job => ({
      ...job,
      description: job.description?.slice(0, 160),
      description_length: job.description?.length || 0,
    })),
  }, { status, headers: { 'Cache-Control': 'no-store' } })
}
