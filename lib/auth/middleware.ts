// Auth middleware utilities for consistent authentication handling
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDemoUserFromRequest } from '@/lib/auth/demo-user'

export interface AuthContext {
  userId: string
  isDemo: boolean
  isDemoUser: boolean
}

/**
 * Verify authentication and return user context
 * Handles both Supabase auth and demo users
 * Returns 401 if neither is valid
 */
export async function verifyAuth(request: NextRequest): Promise<{
  context?: AuthContext
  error?: string
  status?: number
}> {
  try {
    // Check for demo user first
    const demoUser = await getDemoUserFromRequest(request)
    if (demoUser) {
      return {
        context: {
          userId: demoUser.id,
          isDemo: true,
          isDemoUser: true
        }
      }
    }

    // Check Supabase auth
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('[v0] Auth verification failed:', error?.message)
      return {
        error: 'Unauthorized',
        status: 401
      }
    }

    return {
      context: {
        userId: user.id,
        isDemo: false,
        isDemoUser: false
      }
    }
  } catch (error) {
    console.error('[v0] Auth verification error:', error)
    return {
      error: 'Internal server error during auth',
      status: 500
    }
  }
}

/**
 * Require authentication for an API route
 * Returns early with 401 if not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const { context, error, status } = await verifyAuth(request)

  if (error || !context) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: status || 401 }
    )
  }

  return { context }
}

/**
 * Attach auth context to request for use in handlers
 */
export function attachAuthContext(request: NextRequest, context: AuthContext) {
  // Store in headers for retrieval downstream
  const headers = new Headers(request.headers)
  headers.set('x-user-id', context.userId)
  headers.set('x-is-demo', context.isDemo.toString())
  return new NextRequest(request, { headers })
}

/**
 * Get auth context from request headers
 */
export function getAuthContextFromHeaders(request: NextRequest): AuthContext | null {
  const userId = request.headers.get('x-user-id')
  const isDemo = request.headers.get('x-is-demo') === 'true'

  if (!userId) return null

  return {
    userId,
    isDemo,
    isDemoUser: isDemo
  }
}
