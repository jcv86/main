import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { filterOpportunities, normalizeOpportunityWorkMode, searchFiltersFromStoredIntent } from '@/lib/opportunities/matching'
import { readVerifiedOpportunities } from '@/lib/opportunities/verified-index'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await resolveServerUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const supabase = createAdminClient()
  const access = await checkA4Access(user.id, supabase)
  if (!access.canAccess) {
    return NextResponse.json({ error: getA4AccessDenialMessage(), code: access.reason }, { status: 403 })
  }
  const { data: intent, error } = await supabase.from('career_search_intents').select('*')
    .eq('user_id', user.id).eq('is_active', true).eq('is_primary', true).maybeSingle()
  if (error) return NextResponse.json({ error: 'No fue posible cargar tu búsqueda.' }, { status: 500 })

  try {
    // GET only reads the verified index. A scheduled refresh owns provider calls and writes.
    const index = await readVerifiedOpportunities(supabase, 500)
    const matches = intent ? filterOpportunities(index, searchFiltersFromStoredIntent(intent)) : index
    const opportunities = matches.slice(0, 18).map(toPublic)
    return NextResponse.json({
      needs_intent: !intent,
      ...(!intent ? { mode: 'available_now' } : {}),
      source: 'verified_index',
      inventory_status: index.length ? 'ready' : 'empty',
      result_status: !index.length ? 'inventory_empty' : !matches.length ? 'no_matches' : 'matches',
      fetched_at: new Date().toISOString(),
      coverage: { verified_jobs: index.length, matching_jobs: matches.length },
      count: opportunities.length,
      opportunities,
    })
  } catch {
    return NextResponse.json({ error: 'No fue posible cargar las oportunidades.' }, { status: 503 })
  }
}

function toPublic(job: any) {
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
  }
}
