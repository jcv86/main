import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchChileTrabajosOpportunities } from '@/lib/opportunities/sources/chiletrabajos'

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
  const location = (searchParams.get('location') || 'Santiago').slice(0, 100)
  const opportunities = await fetchChileTrabajosOpportunities(query, location, 12)
  return NextResponse.json({
    success: true,
    source: 'chiletrabajos',
    fetched_at: new Date().toISOString(),
    query,
    location,
    count: opportunities.length,
    opportunities,
  })
}
