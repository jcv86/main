'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Linkedin, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { providerRedirect, type PilotOAuthProvider } from '@/lib/auth/pilot-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loadingProvider, setLoadingProvider] = useState<PilotOAuthProvider | null>(null)
  const urlError = searchParams.get('error')

  const signIn = async (provider: PilotOAuthProvider) => {
    setError('')
    setLoadingProvider(provider)
    const supabase = createClient()
    if (!supabase) {
      setError('El acceso no está disponible en este momento. Intenta nuevamente.')
      setLoadingProvider(null)
      return
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth(
      providerRedirect(provider, window.location.origin, searchParams.get('next') ?? '/despega'),
    )
    if (oauthError) {
      setError('No pudimos iniciar sesión. Intenta nuevamente.')
      setLoadingProvider(null)
    }
  }

  const safeError = error || (urlError === 'access_required'
    ? 'Esta cuenta todavía no tiene acceso al piloto. Solicita una invitación.'
    : urlError === 'invalid_invitation'
      ? 'La invitación no es válida o ya fue utilizada.'
      : urlError
        ? 'No pudimos completar el inicio de sesión. Intenta nuevamente.'
        : '')

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(80,160,170,.13),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(90,90,150,.16),transparent_45%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src="/dtc-logo.png" alt="Despega Tu Carrera" className="h-12 object-contain" />
        </div>
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-4xl font-light tracking-tight text-teal/90">Continúa tu carrera</h1>
          <p className="text-sm text-white/60">Ingresa con la cuenta que ya utilizaste. Conservaremos tu avance.</p>
        </div>

        <Card className="border-white/15 bg-slate-950/90 shadow-2xl backdrop-blur">
          <CardContent className="space-y-4 p-7">
            {searchParams.get('invited') === '1' && (
              <p className="rounded-lg border border-teal/30 bg-teal/10 p-3 text-sm text-teal/80">
                Invitación validada. Elige cómo quieres ingresar.
              </p>
            )}
            {safeError && (
              <div className="flex gap-3 rounded-lg border border-red/30 bg-red/10 p-3 text-sm text-red/80">
                <AlertCircle className="h-5 w-5 shrink-0" /><p>{safeError}</p>
              </div>
            )}

            <Button className="h-12 w-full bg-white text-slate-900 hover:bg-white/90" disabled={loadingProvider !== null} onClick={() => signIn('google')}>
              {loadingProvider === 'google' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <span className="mr-3 text-lg font-bold">G</span>}
              Continuar con Google
            </Button>
            <Button className="h-12 w-full bg-[#0A66C2] text-white hover:bg-[#0958a8]" disabled={loadingProvider !== null} onClick={() => signIn('linkedin_oidc')}>
              {loadingProvider === 'linkedin_oidc' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Linkedin className="mr-3 h-5 w-5" />}
              Continuar con LinkedIn
            </Button>

            <p className="pt-2 text-center text-xs leading-relaxed text-white/50">
              Los usuarios existentes pueden ingresar sin una nueva invitación.{' '}
              <Link href="/comenzar" className="text-teal/80 hover:underline">¿Necesitas acceso?</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
