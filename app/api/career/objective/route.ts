import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createObjectiveHandlers, privateObjectiveJson, type ObjectiveOwnerContext } from '@/lib/opportunities/objective-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** The early objective has its own pilot gate; it grants no access to A4. */
async function authorize(): Promise<ObjectiveOwnerContext | NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return privateObjectiveJson({ error: 'No autenticado' }, 401)
    const admin = createAdminClient()
    const { data, error: accessError } = await admin.rpc('resolve_pilot_access', { p_user_id: user.id, p_claim_id: null })
    if (accessError) return privateObjectiveJson({ error: 'No pudimos verificar tu acceso. Vuelve a intentarlo.' }, 503)
    const access = Array.isArray(data) ? data[0] : data
    if (access?.allowed !== true) return privateObjectiveJson({ error: 'Tu cuenta necesita acceso al piloto para guardar un objetivo.', code: 'pilot_access_required' }, 403)
    // Reads and writes use the session client, so owner RLS also applies here.
    return { userId: user.id, supabase }
  } catch { return privateObjectiveJson({ error: 'No pudimos verificar tu acceso. Vuelve a intentarlo.' }, 503) }
}

const handlers = createObjectiveHandlers(authorize)
export const GET = handlers.GET
export const POST = handlers.POST
