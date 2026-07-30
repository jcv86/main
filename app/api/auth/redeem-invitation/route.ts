import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    
    // Obtener user del token Bearer (post-OAuth)
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { code } = await request.json()
    
    if (!code || typeof code !== 'string' || !code.match(/^[A-Z0-9]{6,16}$/)) {
      return NextResponse.json(
        { error: 'Código de invitación inválido' },
        { status: 400 }
      )
    }

    // Obtener el código de invitación
    const { data: invitation, error: invError } = await supabase
      .from('invitation_codes')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (invError || !invitation) {
      return NextResponse.json(
        { error: 'Código no válido' },
        { status: 404 }
      )
    }

    // Registrar el uso de la invitación
    const { error: redeemError } = await supabase
      .from('user_invitations')
      .insert({
        user_id: user.id,
        invitation_code_id: invitation.id,
      })

    if (redeemError) {
      if (redeemError.code === '23505') { // unique constraint
        return NextResponse.json(
          { error: 'Esta invitación ya fue usada por este usuario' },
          { status: 409 }
        )
      }
      throw redeemError
    }

    // Marcar en waitlist como "registered" si el email está ahí
    const userEmail = user.email
    if (userEmail) {
      await supabase
        .from('waitlist_signups')
        .update({ status: 'registered' })
        .eq('email', userEmail)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[v0] Error redimiendo invitación:', err)
    return NextResponse.json(
      { error: 'Error al redimir invitación' },
      { status: 500 }
    )
  }
}
