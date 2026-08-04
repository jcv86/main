// Auth middleware utilities for consistent authentication handling
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export interface AuthContext {
  userId: string
  isDemo: false
  isDemoUser: false
}

/** Verify authentication from a Supabase session and return user context. */
export async function verifyAuth(_request: NextRequest): Promise<{
  context?: AuthContext
  error?: string
  status?: number
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('[v0] Auth verification failed:', error?.message)
      return {
        error: 'Unauthorized',
        status: 401,
      }
    }

    return {
      context: {
        userId: user.id,
        isDemo: false,
        isDemoUser: false,
      },
    }
  } catch (error) {
    console.error('[v0] Auth verification error:', error)
    return {
      error: 'Internal server error during auth',
      status: 500,
    }
  }
}

export async function requireAuth(request: NextRequest) {
  const { context, error, status } = await verifyAuth(request)

  if (error || !context) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: status || 401 },
    )
  }

  return { context }
}

export function attachAuthContext(request: NextRequest, context: AuthContext) {
  const headers = new Headers(request.headers)
  headers.set('x-user-id', context.userId)
  headers.set('x-is-demo', 'false')
  return new NextRequest(request, { headers })
}

export function getAuthContextFromHeaders(request: NextRequest): AuthContext | null {
  const userId = request.headers.get('x-user-id')
  if (!userId) return null

  return {
    userId,
    isDemo: false,
    isDemoUser: false,
  }
}
