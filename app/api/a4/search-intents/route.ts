import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { createObjectiveHandlers, privateObjectiveJson, type ObjectiveOwnerContext } from '@/lib/opportunities/objective-api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function authorize(): Promise<ObjectiveOwnerContext | NextResponse> {
  try {
    const user = await resolveServerUser()
    if (!user) return privateObjectiveJson({ error: 'No autenticado' }, 401)
    const supabase = createAdminClient()
    const access = await checkA4Access(user.id, supabase)
    if (!access.canAccess) return privateObjectiveJson({ error: getA4AccessDenialMessage(), code: access.reason }, 403)
    return { userId: user.id, supabase }
  } catch { return privateObjectiveJson({ error: 'No fue posible verificar tu acceso al Radar.' }, 503) }
}

const handlers = createObjectiveHandlers(authorize)
export const GET = handlers.GET
export const POST = handlers.POST
