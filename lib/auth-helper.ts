import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.admin.getUserById(
      (await cookies()).get('sb-auth-token')?.value || ''
    )

    if (error || !user) {
      // Try alternative method
      const cookieStore = await cookies()
      const authToken = cookieStore.get('sb-auth-token')?.value

      if (!authToken) {
        return null
      }

      // Decode JWT token to get user ID
      try {
        const payload = JSON.parse(
          Buffer.from(authToken.split('.')[1], 'base64').toString()
        )
        return { id: payload.sub }
      } catch {
        return null
      }
    }

    return user
  } catch (error) {
    console.error('[v0] Error getting current user:', error)
    return null
  }
}
