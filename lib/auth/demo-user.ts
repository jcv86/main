/**
 * Demo User Authentication Utility
 * Handles demo user sessions for development/testing
 */

import { NextRequest } from 'next/server'

export function getDemoUserFromRequest(request: NextRequest): { id: string; email: string } | null {
  try {
    // Check cookie first
    const demoUserCookie = request.cookies.get('demo_user')?.value
    if (demoUserCookie) {
      const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
      return demoUser
    }

    // Check Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer demo-')) {
      const demoData = authHeader.substring(7)
      try {
        const demoUser = JSON.parse(decodeURIComponent(demoData))
        return demoUser
      } catch {
        return null
      }
    }

    return null
  } catch (error) {
    console.error('[v0] Error parsing demo user:', error)
    return null
  }
}

export function isDemoUser(userId?: string | null): boolean {
  return userId?.startsWith('demo-') ?? false
}
