'use client'

import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { emailLoginErrorMessage, getEmailLoginContext } from '@/lib/auth/email-login'

export default function EmailLoginPage() {
  const searchParams = useSearchParams()
  const { nextPath, invited, recovery, signInHref } = getEmailLoginContext(searchParams.toString())
  const submitting = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true
    let navigating = false
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || data?.success !== true) {
        setError(emailLoginErrorMessage(res.status, data))
        return
      }

      // The endpoint sets SSR cookies. A new document remounts Providers and
      // the browser Supabase client from those cookies, including a prior
      // signed-out context that did not receive a browser SIGNED_IN event.
      window.location.replace(nextPath)
      navigating = true
    } catch {
      setError('No pudimos conectarnos. Revisa tu conexión e intenta nuevamente.')
    } finally {
      if (!navigating) {
        submitting.current = false
        setLoading(false)
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Despega Tu Carrera</CardTitle>
          <CardDescription>Ingresa con email y contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          {invited && (
            <p className="mb-4 text-sm text-muted-foreground">Tu invitación se comprobará al ingresar con tu cuenta.</p>
          )}
          {recovery && (
            <div role="status" className="mb-4 rounded-md border p-3 text-sm">
              <p className="font-medium">{recovery.title}</p>
              <p className="mt-1 text-muted-foreground">{recovery.message}</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4" aria-busy={loading}>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              maxLength={254}
              disabled={loading}
              aria-describedby={error ? 'email-login-error' : undefined}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              maxLength={256}
              disabled={loading}
              aria-describedby={error ? 'email-login-error' : undefined}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p id="email-login-error" role="alert" className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-[var(--dtc-indigo-700)] text-white hover:bg-[var(--dtc-indigo-600)]">
              {loading ? 'Cargando...' : 'Ingresar'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Usa una cuenta habilitada para este entorno. Al volver podrás retomar tu avance.
          </p>
          <p className="mt-4 text-center text-sm">
            <Link href={signInHref} className="underline underline-offset-4">Volver a las opciones de acceso</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
