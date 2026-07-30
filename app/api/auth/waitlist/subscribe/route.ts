import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }

    // Validar email format
    if (!email.match(/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}$/)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Insertar o ignorar si ya existe
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert({ email: email.toLowerCase(), status: 'pending' })
      .select()
      .single()

    if (error) {
      // Si error es unique constraint, devolver que ya está registrado
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Ya estás en la lista de espera', already_registered: true },
          { status: 200 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Te has registrado en la lista de espera. Te enviaremos un código de invitación pronto.',
      email
    })
  } catch (err) {
    console.error('[v0] Error en waitlist:', err)
    return NextResponse.json(
      { error: 'Error al registrarte en la lista de espera' },
      { status: 500 }
    )
  }
}
