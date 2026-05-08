import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-auth-token')?.value

    if (!authToken) {
      return null
    }

    // Decode JWT token to get user ID
    try {
      const parts = authToken.split('.')
      if (parts.length !== 3) {
        console.error('[v0] Invalid token format')
        return null
      }

      // Decode the JWT payload (second part)
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      )
      
      if (!payload.sub) {
        console.error('[v0] No user ID in token')
        return null
      }

      return { id: payload.sub }
    } catch (decodeError) {
      console.error('[v0] Error decoding JWT token:', decodeError)
      return null
    }
  } catch (error) {
    console.error('[v0] Error getting current user:', error)
    return null
  }
}
