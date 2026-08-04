import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password || email.length > 254 || password.length > 256) {
      return NextResponse.json({ message: 'Email y contraseña son obligatorios.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json({ message: 'Credenciales incorrectas.' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'No se pudo iniciar sesión.' }, { status: 500 })
  }
}
