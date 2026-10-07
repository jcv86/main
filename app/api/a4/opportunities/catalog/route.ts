import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { filterOpportunities } from '@/lib/opportunities/matching'
import { catalogFromJobs, regionCatalogFromJobs } from '@/lib/opportunities/taxonomy'
import { readVerifiedOpportunities } from '@/lib/opportunities/verified-index'

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
  try {
    const cached = await readVerifiedOpportunities(supabase, 500)
    const url = new URL(request.url)
    const selectedRegions = url.searchParams.getAll('region').map(value => value.trim()).filter(Boolean)
    const selectedModes = url.searchParams.getAll('mode').map(value => value.trim()).filter(Boolean)
    const filtered = filterOpportunities(cached, { locations: selectedRegions, workModes: selectedModes })
    const catalog = catalogFromJobs(filtered)
    const regions = regionCatalogFromJobs(cached)
    return NextResponse.json({
      source: 'verified_index',
      inventory_status: cached.length ? 'ready' : 'empty',
      fetched_at: new Date().toISOString(),
      coverage: { verified_jobs: cached.length, filtered_jobs: filtered.length },
      total: filtered.length,
      total_available: cached.length,
      areas: catalog.areas.filter(item => item.count > 0),
      roles: catalog.roles.filter(item => item.count > 0).slice(0, 50),
      regions,
      filters: { regions: selectedRegions, modes: selectedModes },
    })
  } catch {
    return NextResponse.json({ error: 'No fue posible cargar el catálogo de oportunidades.' }, { status: 503 })
  }
}
