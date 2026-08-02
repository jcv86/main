import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { DEMO_COOKIE_NAME } from '@/lib/auth/demo-user'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('[v0] Error signing out Supabase session:', error)
  }

  const cookieStore = await cookies()
  cookieStore.delete(DEMO_COOKIE_NAME)

  const response = NextResponse.redirect(new URL('/auth/signin', request.url), 303)
  response.cookies.delete(DEMO_COOKIE_NAME)
  return response
}
