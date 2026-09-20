import { NextResponse } from 'next/server'
import { discoverChileTrabajosJobIds, fetchChileTrabajosOpportunities } from '@/lib/opportunities/sources/chiletrabajos'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').slice(0,100)
  const location = (searchParams.get('location') || 'Santiago').slice(0,100)
  const startedAt = Date.now()
  try {
    const discovery = await discoverChileTrabajosJobIds(query, location)
    const jobs = await fetchChileTrabajosOpportunities(query, location, 5)
    return NextResponse.json({
      ok: discovery.ids.length > 0 && jobs.length > 0,
      provider: 'chiletrabajos',
      discovered: discovery.ids.length,
      verified_active: jobs.length,
      valid_original_urls: jobs.filter((job) => /^https:\/\//i.test(job.originalUrl)).length,
      location_resolved: jobs.filter((job) => Boolean(job.location)).length,
      latency_ms: Date.now() - startedAt,
      checked_at: new Date().toISOString(),
      sample: jobs.slice(0,3),
    }, { status: jobs.length > 0 ? 200 : 503 })
  } catch (error) {
    return NextResponse.json({ ok:false, provider:'chiletrabajos', discovered:0, verified_active:0, latency_ms:Date.now()-startedAt, checked_at:new Date().toISOString(), error:error instanceof Error ? error.message : 'provider unavailable' }, { status:503 })
  }
}
