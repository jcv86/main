import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function useAuthRedirect() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[v0] Auth state changed:', event, 'User:', session?.user?.email)
        
        if (!session?.user) {
          console.log('[v0] No session, redirecting to login')
          router.push('/auth/signin')
          setLoading(false)
          return
        }

        setUser(session.user)
        setLoading(false)
      }
    )

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  return { user, loading }
}
