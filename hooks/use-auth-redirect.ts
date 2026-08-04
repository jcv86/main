import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SIGN_IN_PATH } from '@/lib/auth/routes'

export function useAuthRedirect() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('demo_user')
    }

    const applySession = (sessionUser: any | null) => {
      if (!active) return
      setUser(sessionUser)
      setLoading(false)
      if (!sessionUser) router.replace(SIGN_IN_PATH)
    }

    const initialize = async () => {
      const {
        data: { user: verifiedUser },
        error,
      } = await supabase.auth.getUser()

      if (!active) return
      if (error || !verifiedUser) {
        applySession(null)
        return
      }
      applySession(verifiedUser)
    }

    void initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return

      if (event === 'SIGNED_OUT') {
        applySession(null)
        return
      }

      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        applySession(session?.user ?? null)
      }
    })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  return { user, loading }
}
