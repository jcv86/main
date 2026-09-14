import { NextResponse } from 'next/server'
import {
  DEMO_COOKIE_NAME,
  demoSessionCookieOptions,
} from '@/lib/auth/demo-user'

export async function POST() {
  return NextResponse.json(
    { error: 'El acceso demo fue retirado.', code: 'DEMO_AUTH_RETIRED' },
    { status: 410 },
  )
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(DEMO_COOKIE_NAME, '', {
    ...demoSessionCookieOptions,
    maxAge: 0,
  })
  return response
}
