import { NextResponse } from 'next/server'
import { probeChileTrabajosJob } from '@/lib/opportunities/sources/chiletrabajos'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || '3894888'
  const startedAt = Date.now()
  try {
    const job = await probeChileTrabajosJob(id)
    return NextResponse.json({ ok: true, provider: 'chiletrabajos', latency_ms: Date.now()-startedAt, checked_at: new Date().toISOString(), job })
  } catch (error) {
    return NextResponse.json({ ok: false, provider: 'chiletrabajos', latency_ms: Date.now()-startedAt, checked_at: new Date().toISOString(), error: error instanceof Error ? error.message : 'provider unavailable' }, { status: 503 })
  }
}
