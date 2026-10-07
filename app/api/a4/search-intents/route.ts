import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TABLE = 'career_search_intents'
const COLUMNS = 'id,name,target_roles,breadth,locations,work_modes,industries,excluded_industries,seniority_min,salary_min_clp,employment_types,languages,is_primary,is_active,source,created_at,updated_at'
const breadths = new Set(['precise', 'related', 'exploratory'])
const modes = new Set(['onsite', 'hybrid', 'remote', 'flexible'])

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  })
}

function cleanList(value: unknown, max = 8, maxLength = 160) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((item): item is string => typeof item === 'string')
    .map(item => item.trim().slice(0, maxLength)).filter(Boolean))].slice(0, max)
}

type AuthorizedContext = { userId: string; supabase: ReturnType<typeof createAdminClient> }

async function authorize(): Promise<AuthorizedContext | NextResponse> {
  try {
    const user = await resolveServerUser()
    if (!user) return privateJson({ error: 'No autenticado' }, 401)
    const supabase = createAdminClient()
    const access = await checkA4Access(user.id, supabase)
    if (!access.canAccess) {
      return privateJson({ error: getA4AccessDenialMessage(), code: access.reason }, 403)
    }
    return { userId: user.id, supabase }
  } catch {
    return privateJson({ error: 'No fue posible verificar tu acceso al Radar.' }, 503)
  }
}

export async function GET() {
  const context = await authorize()
  if (context instanceof NextResponse) return context
  try {
    const { data, error } = await context.supabase.from(TABLE).select(COLUMNS)
      .eq('user_id', context.userId).eq('is_active', true)
      .order('is_primary', { ascending: false }).order('updated_at', { ascending: false })
      .order('id', { ascending: true }).limit(100)
    if (error || !Array.isArray(data)) throw new Error('Intent read unavailable')
    return privateJson({ intents: data })
  } catch {
    return privateJson({ error: 'No fue posible cargar tus búsquedas.' }, 503)
  }
}

export async function POST(request: Request) {
  const context = await authorize()
  if (context instanceof NextResponse) return context
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return privateJson({ error: 'Revisa los datos de tu búsqueda.' }, 400)
  }
  const input = body as Record<string, unknown>
  const targetRoles = cleanList(input.targetRoles, 8, 200)
  if (!targetRoles.length) {
    return privateJson({ error: 'Agrega al menos un cargo o dirección profesional.' }, 400)
  }
  if (input.salaryMinClp != null && (!Number.isSafeInteger(input.salaryMinClp)
      || Number(input.salaryMinClp) < 0 || Number(input.salaryMinClp) > 2_147_483_647)) {
    return privateJson({ error: 'Revisa el monto de renta mínima.' }, 400)
  }
  const isPrimary = input.isPrimary !== false
  const values: Record<string, unknown> = {
    target_roles: targetRoles,
    breadth: typeof input.breadth === 'string' && breadths.has(input.breadth) ? input.breadth : 'related',
    locations: cleanList(input.locations, 6),
    work_modes: cleanList(input.workModes, 4).filter(value => modes.has(value)),
    source: 'user_confirmed',
  }
  // Omitted advanced preferences retain their existing values on an update.
  // New rows use the already-defined database defaults.
  if (typeof input.name === 'string' && input.name.trim()) values.name = input.name.trim().slice(0, 80)
  for (const [key, column, limit] of [
    ['industries', 'industries', 8], ['excludedIndustries', 'excluded_industries', 8],
    ['employmentTypes', 'employment_types', 6], ['languages', 'languages', 6],
  ] as const) {
    if (Object.hasOwn(input, key)) values[column] = cleanList(input[key], limit)
  }
  if (Object.hasOwn(input, 'seniorityMin')) {
    values.seniority_min = typeof input.seniorityMin === 'string' ? input.seniorityMin.trim().slice(0, 60) || null : null
  }
  if (Object.hasOwn(input, 'salaryMinClp')) values.salary_min_clp = input.salaryMinClp ?? null

  try {
    const { supabase, userId } = context
    if (isPrimary) {
      const { data: existing, error: readError } = await supabase.from(TABLE)
        .select('id,updated_at').eq('user_id', userId)
        .eq('is_primary', true).eq('is_active', true).maybeSingle()
      if (readError) throw new Error('Primary intent read unavailable')
      if (existing) {
        if (typeof existing.id !== 'string' || typeof existing.updated_at !== 'string') {
          throw new Error('Invalid primary intent identity')
        }
        // Replace the current primary in one atomic statement. Never demote it
        // before a second statement that could fail. The timestamp guards a
        // concurrent save, and every mutation retains the verified owner scope.
        const { data, error } = await supabase.from(TABLE).update(values)
          .eq('id', existing.id).eq('user_id', userId)
          .eq('is_primary', true).eq('is_active', true)
          .eq('updated_at', existing.updated_at).select(COLUMNS).maybeSingle()
        if (error) throw new Error('Primary intent update unavailable')
        if (!data) return conflictResponse()
        return privateJson({ intent: data }, 200)
      }
    }

    // The existing unique active-primary index arbitrates concurrent creation.
    // A conflict does not demote, overwrite or retry against the winning row.
    const { data, error } = await supabase.from(TABLE).insert({
      ...values, user_id: userId, is_primary: isPrimary, is_active: true,
    }).select(COLUMNS).single()
    if (error?.code === '23505') return conflictResponse()
    if (error || !data) throw new Error('Intent creation unavailable')
    return privateJson({ intent: data }, 201)
  } catch {
    return privateJson({ error: 'No fue posible confirmar el guardado de tu búsqueda.' }, 503)
  }
}

function conflictResponse() {
  return privateJson({ error: 'Tu búsqueda cambió mientras guardabas. Vuelve a intentarlo.' }, 409)
}
