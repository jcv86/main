import { NextResponse } from 'next/server'
import {
  DEMO_COOKIE_NAME,
  demoSessionCookieOptions,
} from '@/lib/auth/demo-user'

export async function POST(request: Request) {
  const hostname = new URL(request.url).hostname
  const isPreviewHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.vercel.app') || hostname.endsWith('.v0.dev')

  if (!isPreviewHost) {
    return NextResponse.json({ error: 'El acceso demo fue retirado.', code: 'DEMO_AUTH_RETIRED' }, { status: 410 })
  }

  const response = NextResponse.json({ success: true, user: { id: 'preview-user-dtc', email: 'preview@despegatucarrera.com', name: 'Usuario Preview', is_dev: true } })
  response.cookies.set(DEMO_COOKIE_NAME, 'preview', { ...demoSessionCookieOptions, httpOnly: true, maxAge: 86400 })
  response.cookies.set('dtc_preview_access', '1', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 86400 })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(DEMO_COOKIE_NAME, '', {
    ...demoSessionCookieOptions,
    maxAge: 0,
  })
  return response
}
