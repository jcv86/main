import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json(
        { message: 'Email y contraseña requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    console.log('[v0] Email login - attempting sign in:', email)
    
    // Use Supabase signInWithPassword to create proper Supabase session
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log('[v0] Supabase sign in error:', error.message)
      return Response.json(
        { message: error.message || 'Email o contraseña incorrectos' },
        { status: 401 }
      )
    }

    if (!data.user) {
      return Response.json(
        { message: 'Error al iniciar sesión' },
        { status: 401 }
      )
    }

    console.log('[v0] User authenticated via Supabase:', email)

    return Response.json({
      success: true,
      message: 'Sesión iniciada',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    })
  } catch (error) {
    console.error('[v0] Email login error:', error)
    return Response.json(
      { message: 'Error al procesar solicitud' },
      { status: 500 }
    )
  }
}
