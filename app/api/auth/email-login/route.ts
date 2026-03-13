import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import bcrypt from 'bcrypt'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret-key'
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json(
        { message: 'Email y contraseña requeridos' },
        { status: 400 }
      )
    }

    // Query user from database
    const supabase = await createClient()
    console.log('[v0] Email login - querying user:', email)
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single()

    console.log('[v0] Query result - error:', error?.message, 'user:', user?.email)

    if (error || !user) {
      console.log('[v0] User not found:', email, 'error:', error)
      return Response.json(
        { message: 'Email o contraseña incorrectos' },
        { status: 401 }
      )
    }

    // Verify password
    if (!user.password_hash) {
      console.log('[v0] User has no password hash:', email)
      return Response.json(
        { message: 'Este usuario no tiene contraseña configurada' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      console.log('[v0] Password mismatch for user:', email)
      return Response.json(
        { message: 'Email o contraseña incorrectos' },
        { status: 401 }
      )
    }

    console.log('[v0] User authenticated:', email)

    // Create JWT token with user data
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secret)

    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    console.log('[v0] Session created for user:', email)

    return Response.json({
      success: true,
      message: 'Sesión iniciada',
      user: {
        id: user.id,
        email: user.email,
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
