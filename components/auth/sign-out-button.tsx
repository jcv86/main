'use client'

import { useId, useRef, useState, type ComponentProps } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SIGN_OUT_ERROR, signOutCurrentBrowser } from '@/lib/auth/signout-client'

type SignOutButtonProps = Pick<ComponentProps<typeof Button>, 'variant' | 'className' | 'size'> & {
  label?: string
}

export function SignOutButton({ className, variant = 'ghost', size, label = 'Cerrar sesión' }: SignOutButtonProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inFlight = useRef(false)
  const errorId = useId()

  return (
    <form action="/api/auth/signout" method="post" onSubmit={async (event) => {
      event.preventDefault()
      if (inFlight.current) return
      inFlight.current = true
      setPending(true)
      setError(null)
      try {
        await signOutCurrentBrowser()
      } catch {
        setError(SIGN_OUT_ERROR)
      } finally {
        inFlight.current = false
        setPending(false)
      }
    }}>
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={className}
        disabled={pending}
        aria-busy={pending}
        aria-describedby={error ? errorId : undefined}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {pending ? 'Cerrando sesión…' : error ? 'Reintentar cierre de sesión' : label}
      </Button>
      {error && <p id={errorId} role="alert" className="mt-2 max-w-sm text-sm text-destructive">{error}</p>}
    </form>
  )
}
