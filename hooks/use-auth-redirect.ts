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
    // Check for demo user first
    const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null
    const demoUser = demoUserStr ? JSON.parse(demoUserStr) : null
    
    if (demoUser) {
      console.log('[v0] Demo user found in localStorage:', demoUser.email)
      setUser(demoUser)
      setLoading(false)
      setIsInitialCheck(false)
      return
    }

    // Subscribe to auth state changes for real users
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[v0] Auth event:', event, 'User:', session?.user?.email)
        
        // On INITIAL_SESSION: check if user exists, but don't redirect yet
        // Only redirect on explicit SIGNED_OUT or if session is truly missing after initial check
        if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('[v0] Initial session found:', session.user.email)
            setUser(session.user)
          }
          // Mark initial check as done, but don't redirect yet
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

        // On SIGNED_IN: update user
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[v0] User signed in:', session.user.email)
          setUser(session.user)
          setLoading(false)
          return
        }

        // On TOKEN_REFRESHED: update user
        if (event === 'TOKEN_REFRESHED' && session?.user) {
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
