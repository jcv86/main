import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createClient } from '@/lib/supabase/server'
import { normalizeCvBuilderState } from '@/lib/a3/cv-builder'

const headers = { 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' }

export async function GET() {
  try {
    const user = await resolveServerUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers })
    const supabase = await createClient()
    const { data, error } = await supabase.from('a3_module_completion')
      .select('deliverable,completed_at')
      .eq('user_id', user.id)
      .in('module_id', ['cv-builder-studio', 'module-3'])
      .order('completed_at', { ascending: false }).limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: 'No pudimos recuperar el CV guardado.' }, { status: 500, headers })
    return NextResponse.json({ savedCv: data ? normalizeCvBuilderState(data.deliverable) : null, completedAt: data?.completed_at || null }, { headers })
  } catch {
    return NextResponse.json({ error: 'No pudimos recuperar el CV guardado.' }, { status: 500, headers })
  }
}
