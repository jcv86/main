import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchGetOnBoardJobs } from '@/lib/opportunities/sources/getonboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const user = await resolveServerUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = createAdminClient()
  const access = await checkA4Access(user.id, supabase)
  if (!access.canAccess) {
    return NextResponse.json({ error: getA4AccessDenialMessage(), code: access.reason }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').slice(0, 120)
  try {
    const opportunities = await fetchGetOnBoardJobs(query)
    return NextResponse.json({
      success: true,
      source: 'getonboard',
      coverage: 'public_api',
      fetched_at: new Date().toISOString(),
      count: opportunities.length,
      opportunities: opportunities.map(({ raw: _raw, ...item }) => item),
    })
  } catch (error) {
    console.error('[v0] Get on Board opportunity source error:', error)
    return NextResponse.json({
      success: false,
      source: 'getonboard',
      opportunities: [],
      error: 'La fuente Get on Board no está disponible temporalmente.',
    }, { status: 502 })
  }
}
