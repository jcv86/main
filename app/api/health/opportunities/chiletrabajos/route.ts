import { NextResponse } from 'next/server'
import {
  ChileTrabajosProviderError,
  fetchChileTrabajosBatch,
  probeChileTrabajosJob,
} from '@/lib/opportunities/sources/chiletrabajos'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const headers = { 'Cache-Control': 'no-store' }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const startedAt = Date.now()
  const timing = () => ({ latency_ms: Date.now() - startedAt, checked_at: new Date().toISOString() })
  try {
    if (id !== null && !/^\d{5,10}$/.test(id)) {
      return NextResponse.json({ ok: false, provider: 'chiletrabajos', code: 'invalid_id', ...timing() }, { status: 400, headers })
    }
    if (!id) {
      // Discover a current offer once instead of using a hardcoded historical ID.
      const batch = await fetchChileTrabajosBatch('', 'Santiago', 1, { maxCandidates: 4, budgetMs: 10_000, timeoutMs: 4_000 })
      const connectionOk = !['unavailable', 'parse_failed'].includes(batch.diagnostics.outcome)
      return NextResponse.json({
        ok: connectionOk,
        connection_ok: connectionOk,
        offer_active: batch.jobs.length > 0,
        provider: 'chiletrabajos',
        ...batch.diagnostics,
        job: batch.jobs[0] || null,
        ...timing(),
      }, { status: connectionOk ? 200 : batch.diagnostics.outcome === 'parse_failed' ? 502 : 503, headers })
    }
    const job = await probeChileTrabajosJob(id, { budgetMs: 8_000, timeoutMs: 5_000 })
    return NextResponse.json({
      ok: job.verificationStatus === 'verified_active',
      connection_ok: true,
      offer_active: job.verificationStatus === 'verified_active',
      provider: 'chiletrabajos',
      code: job.verificationStatus === 'stale' ? 'offer_stale' : job.verificationStatus === 'unknown' ? 'offer_unverified' : undefined,
      job,
      ...timing(),
    }, { status: job.verificationStatus === 'unknown' ? 502 : 200, headers })
  } catch (error) {
    const failure = error instanceof ChileTrabajosProviderError ? error : null
    return NextResponse.json({
      ok: false, connection_ok: false, offer_active: false, provider: 'chiletrabajos',
      code: failure?.code || 'provider_unavailable',
      ...timing(),
    }, { status: failure?.kind === 'invalid_request' ? 400 : failure?.kind === 'parse_failed' ? 502 : 503, headers })
  }
}
