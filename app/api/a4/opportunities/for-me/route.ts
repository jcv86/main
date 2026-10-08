import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { rankOpportunities, normalizeOpportunityWorkMode, searchFiltersFromStoredIntent, type OpportunityMatch } from '@/lib/opportunities/matching'
import { readVerifiedOpportunityInventory, type VerifiedOpportunityRow } from '@/lib/opportunities/verified-index'
import { OPPORTUNITY_PAGE_SIZE, OpportunityQueryError, parseOpportunityQuery } from '@/lib/opportunities/search-query'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store' }
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers })

export async function GET(request?: Request) {
  try {
  const user = await resolveServerUser()
  if (!user) return json({ error: 'No autenticado' }, 401)
  const supabase = createAdminClient()
  const access = await checkA4Access(user.id, supabase)
  if (!access.canAccess) {
    return json({ error: getA4AccessDenialMessage(), code: access.reason }, 403)
  }
    const query = parseOpportunityQuery(new URL(request?.url ?? 'https://www.despegatucarrera.com/api/a4/opportunities/for-me'))
    let intent = null
    if (query.view === 'saved') {
      const result = await supabase.from('career_search_intents').select('target_roles,breadth,locations,work_modes')
        .eq('user_id', user.id).eq('is_active', true).eq('is_primary', true).maybeSingle()
      if (result.error) return json({ error: 'No fue posible cargar tu búsqueda.' }, 500)
      intent = result.data
    }
    // GET only reads the verified index. A scheduled refresh owns provider calls and writes.
    const { opportunities: index, scope } = await readVerifiedOpportunityInventory(supabase, 500)
    const filters = query.view === 'explore' ? query.filters : searchFiltersFromStoredIntent(intent)
    const matches = rankOpportunities(index, filters).map(toPublic)
    // A page belongs to the exact ordered public result, including explanations.
    // Title/requirements changes can alter relevance even when verification time is unchanged.
    const snapshot = createHash('sha256').update(JSON.stringify({ version: 2, view: query.view, filters, scope, rows: matches })).digest('hex')
    if (query.snapshot && query.snapshot !== snapshot) {
      return json({ error: 'Las ofertas cambiaron. Vuelve a cargar los resultados.', code: 'inventory_changed' }, 409)
    }
    if (query.offset > 0 && query.offset >= matches.length) return json({ error: 'Vuelve a la primera página de resultados.' }, 400)
    const opportunities = matches.slice(query.offset, query.offset + OPPORTUNITY_PAGE_SIZE)
    const nextOffset = query.offset + opportunities.length
    return json({
      needs_intent: query.view === 'saved' && !intent,
      mode: query.view === 'explore' ? 'explore' : intent ? 'saved' : 'available_now',
      applied_filters: filters,
      scope,
      source: 'verified_index',
      inventory_status: index.length ? 'ready' : 'empty',
      result_status: !index.length ? 'inventory_empty' : !matches.length ? 'no_matches' : 'matches',
      fetched_at: new Date().toISOString(),
      coverage: { verified_jobs: index.length, matching_jobs: matches.length },
      total_matching: matches.length,
      pagination: { offset: query.offset, page_size: OPPORTUNITY_PAGE_SIZE, next_offset: nextOffset < matches.length ? nextOffset : null, snapshot },
      count: opportunities.length,
      opportunities,
    })
  } catch (error) {
    if (error instanceof OpportunityQueryError) return json({ error: error.message }, 400)
    return json({ error: 'No fue posible cargar las oportunidades.' }, 503)
  }
}

function toPublic(job: VerifiedOpportunityRow & { match: OpportunityMatch }) {
  return {
    source: job.source,
    sourceId: job.source_id,
    title: job.title,
    company: job.company || 'Empresa no informada',
    location: job.location,
    region: job.region || null,
    workMode: normalizeOpportunityWorkMode(job.work_mode),
    publishedAt: job.published_at,
    expiresAt: job.expires_at,
    originalUrl: job.original_url,
    verificationStatus: job.verification_status,
    lastVerifiedAt: job.last_verified_at,
    description: typeof job.description === 'string' ? job.description : null,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    skills: Array.isArray(job.skills) ? job.skills : [],
    fieldEvidence: Array.isArray(job.field_evidence) ? job.field_evidence : [],
    match: job.match,
  }
}
