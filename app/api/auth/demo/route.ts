import { NextResponse } from 'next/server'
import {
  createDemoSessionToken,
  DEMO_COOKIE_NAME,
  demoSessionCookieOptions,
  getTravisDemoUser,
} from '@/lib/auth/demo-user'

export async function POST() {
  try {
    const token = await createDemoSessionToken()
    const user = getTravisDemoUser()
    const response = NextResponse.json({ user })
    response.cookies.set(DEMO_COOKIE_NAME, token, demoSessionCookieOptions)
    return response
  } catch {
    return NextResponse.json({ error: 'Demo access is not configured' }, { status: 503 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(DEMO_COOKIE_NAME, '', {
    ...demoSessionCookieOptions,
    maxAge: 0,
  })
  return response
}
