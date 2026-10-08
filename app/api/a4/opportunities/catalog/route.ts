import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { filterOpportunities } from '@/lib/opportunities/matching'
import { catalogFromJobs, regionCatalogFromJobs } from '@/lib/opportunities/taxonomy'
import { readVerifiedOpportunityInventory } from '@/lib/opportunities/verified-index'
import { OpportunityQueryError, parseOpportunityQuery } from '@/lib/opportunities/search-query'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store' }
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers })

export async function GET(request: Request) {
  try {
  const user = await resolveServerUser()
  if (!user) return json({ error: 'No autenticado' }, 401)
  const supabase = createAdminClient()
  const access = await checkA4Access(user.id, supabase)
  if (!access.canAccess) {
    return json({ error: getA4AccessDenialMessage(), code: access.reason }, 403)
  }
    const { filters } = parseOpportunityQuery(new URL(request.url), 'explore')
    const { opportunities: cached, scope } = await readVerifiedOpportunityInventory(supabase, 500)
    const filtered = filterOpportunities(cached, filters)
    // Facets remain available when a role is selected; the preview count applies every filter.
    const catalog = catalogFromJobs(filterOpportunities(cached, { locations: filters.locations, workModes: filters.workModes }))
    const regions = regionCatalogFromJobs(cached)
    return json({
      source: 'verified_index',
      inventory_status: cached.length ? 'ready' : 'empty',
      fetched_at: new Date().toISOString(),
      coverage: { verified_jobs: cached.length, filtered_jobs: filtered.length },
      total: filtered.length,
      total_available: cached.length,
      scope,
      applied_filters: filters,
      areas: catalog.areas.filter(item => item.count > 0),
      roles: catalog.roles.filter(item => item.count > 0).slice(0, 50),
      regions,
      filters: { regions: filters.locations, modes: filters.workModes },
    })
  } catch (error) {
    if (error instanceof OpportunityQueryError) return json({ error: error.message }, 400)
    return json({ error: 'No fue posible cargar el catálogo de oportunidades.' }, 503)
  }
}
