import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    
    if (!code || typeof code !== 'string' || !code.match(/^[A-Z0-9]{6,16}$/)) {
      return NextResponse.json(
        { error: 'Código de invitación inválido' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Validar que el código existe y está activo
    const { data: invitation, error } = await supabase
      .from('invitation_codes')
      .select('id, code')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Código de invitación no encontrado o expirado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ valid: true, code: invitation.code })
  } catch (err) {
    console.error('[v0] Error validando invitación:', err)
    return NextResponse.json(
      { error: 'Error validando invitación' },
      { status: 500 }
    )
  }
}
