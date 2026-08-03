import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { extractCvContext } from '@/lib/a3/job-decoder'

export async function GET() {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('a3_module_completion')
      .select('module_id, deliverable, completed_at')
      .eq('user_id', currentUser.id)
      .in('module_id', ['cv-builder-studio', 'module-3'])
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[v0] Job decoder context lookup error:', error)
      return NextResponse.json(
        { error: 'No pudimos cargar el CV aprobado.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      cvBuilder: extractCvContext(data?.deliverable),
    })
  } catch (error) {
    console.error('[v0] Job decoder context error:', error)
    return NextResponse.json(
      { error: 'No pudimos cargar el contexto del módulo.' },
      { status: 500 },
    )
  }
}
