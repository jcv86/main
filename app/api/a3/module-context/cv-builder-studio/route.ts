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
      .select('module_id,deliverable,completed_at')
      .eq('user_id', user.id)
      .in('module_id', ['cv-builder-studio', 'module-3'])
      .limit(2)
    if (error) return NextResponse.json({ error: 'No pudimos recuperar el CV guardado.' }, { status: 500, headers })
    // completed_at is the original completion date, not the last edit. The
    // canonical row owns subsequent edits; the legacy alias is only a fallback.
    const saved = data?.find((row) => row.module_id === 'cv-builder-studio')
      ?? data?.find((row) => row.module_id === 'module-3')
    return NextResponse.json({ savedCv: saved ? normalizeCvBuilderState(saved.deliverable) : null, completedAt: saved?.completed_at || null }, { headers })
  } catch {
    return NextResponse.json({ error: 'No pudimos recuperar el CV guardado.' }, { status: 500, headers })
  }
}
