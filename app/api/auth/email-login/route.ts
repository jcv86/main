import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

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

    // For demo, accept any email with password "demo"
    if (password !== 'demo') {
      return Response.json(
        { message: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({
      sub: email,
      email,
      name: email.split('@')[0],
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

    return Response.json({
      success: true,
      message: 'Sesión iniciada',
    })
  } catch (error) {
    console.error('[v0] Email login error:', error)
    return Response.json(
      { message: 'Error al procesar solicitud' },
      { status: 500 }
    )
  }
}
