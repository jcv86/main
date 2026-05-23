import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function useAuthRedirect() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialCheck, setIsInitialCheck] = useState(true)

  useEffect(() => {
    // Subscribe to auth state changes for real users (this is the PRIMARY auth source)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[v0] Auth event:', event, 'User:', session?.user?.email)
        
        // On INITIAL_SESSION: check if user exists
        if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            // Real authenticated user found - clear demo user and use real auth
            console.log('[v0] Initial session found:', session.user.email)
            localStorage.removeItem('demo_user')
            setUser(session.user)
          } else {
            // No real session - check for demo user as fallback
            const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null
            if (demoUserStr) {
              const demoUser = JSON.parse(demoUserStr)
              console.log('[v0] Using demo user from localStorage:', demoUser.email)
              setUser(demoUser)
            } else {
              console.log('[v0] No session and no demo user - will redirect')
              setUser(null)
            }
          }
          setIsInitialCheck(false)
          setLoading(false)
          return
        }

        // On SIGNED_OUT: redirect to login
        if (event === 'SIGNED_OUT') {
          console.log('[v0] User signed out, redirecting to login')
          router.push('/auth/signin')
          setUser(null)
          setLoading(false)
          return
        }

        // On SIGNED_IN: update user and clear demo user
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[v0] User signed in:', session.user.email)
          localStorage.removeItem('demo_user')
          setUser(session.user)
          setLoading(false)
          return
        }

        // On TOKEN_REFRESHED: update user
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('[v0] Token refreshed for:', session.user.email)
          setUser(session.user)
          setLoading(false)
          return
        }

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
