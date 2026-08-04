'use client'

import { Fragment, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AccessPayload {
  canAccess?: boolean
  nextPath?: string | null
  error?: string
}

export function A2AccessBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [allowed, setAllowed] = useState(pathname === '/despega/a2/intro')
  const [checking, setChecking] = useState(pathname !== '/despega/a2/intro')

  useEffect(() => {
    if (pathname === '/despega/a2/intro') {
      setAllowed(true)
      setChecking(false)
      return
    }

    let active = true
    const verify = async () => {
      setChecking(true)
      try {
        const response = await fetch('/api/journey/module-access?module=A2', {
          credentials: 'include',
          cache: 'no-store',
        })
        const payload = (await response.json().catch(() => ({}))) as AccessPayload
        if (!active) return

        if (!response.ok || !payload.canAccess) {
          router.replace(payload.nextPath || '/auth/signin')
          return
        }
        setAllowed(true)
      } catch (error) {
        console.error('[v0] A2 access boundary error:', error)
        if (active) router.replace('/despega')
      } finally {
        if (active) setChecking(false)
      }
    }

    void verify()
    return () => {
      active = false
    }
  }, [pathname, router])

  if (checking || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          Verificando tu recorrido…
        </div>
      </div>
    )
  }

  return <Fragment>{children}</Fragment>
}
