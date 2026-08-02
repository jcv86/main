import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SIGN_IN_PATH } from '@/lib/auth/routes'

function readDemoUser() {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem('demo_user')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('[v0] Failed to parse demo user:', error)
    window.localStorage.removeItem('demo_user')
    return null
  }
}

export function useAuthRedirect() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setUser(readDemoUser())
      setLoading(false)
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          window.localStorage.removeItem('demo_user')
          setUser(session.user)
        } else {
          setUser(readDemoUser())
        }
        setLoading(false)
        return
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        router.push(SIGN_IN_PATH)
        return
      }

      if (
        (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
        session?.user
      ) {
        window.localStorage.removeItem('demo_user')
        setUser(session.user)
        setLoading(false)
        return
      }

      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [router, supabase])

  return { user, loading }
}
