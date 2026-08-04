'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Linkedin, AlertCircle, Loader2, Check, Lock } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false)
  const [invitationStatus, setInvitationStatus] = useState<{
    total: number
    used: number
    remaining: number
    available: boolean
  } | null>(null)
  const [invitationCode, setInvitationCode] = useState('')
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    setIsPreview(
      searchParams.get('preview') === '1' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.v0.dev')
    )
  }, [])

  const handlePreviewAccess = () => {
    localStorage.setItem('demo_user', JSON.stringify({
      id: 'preview-user-dtc',
      email: 'preview@despegatucarrera.com',
      name: 'Usuario Preview',
      is_dev: true,
    }))
    document.cookie = 'dtc_preview_access=1; path=/; max-age=86400; SameSite=Lax'
    const nextPath = searchParams.get('next') || '/despega/conozcamonos-1'
    const separator = nextPath.includes('?') ? '&' : '?'
    router.push(`${nextPath}${separator}preview=1`)
  }

  // Fetch invitation status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/auth/invitation-status')
        const data = await res.json()
        setInvitationStatus(data)
      } catch (err) {
        console.error('[v0] Error fetching invitation status:', err)
      }
    }
    fetchStatus()
  }, [])

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (errorParam) {
      setError(errorDescription || `Error de autenticacion: ${errorParam}`)
    }
  }, [searchParams])

  const handleLinkedInSignIn = async () => {
    if (!invitationCode.trim()) {
      setError('Por favor ingresa tu código de invitación')
      return
    }

    // Validar código antes de OAuth
    setError('')
    setIsValidatingCode(true)

    try {
      const validateRes = await fetch('/api/auth/validate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: invitationCode.toUpperCase() })
      })

      if (!validateRes.ok) {
        const data = await validateRes.json()
        setError(data.error || 'Código inválido')
        setIsValidatingCode(false)
        return
      }

      setIsValidatingCode(false)
      setIsLoadingLinkedIn(true)

      const supabase = createClient()
      if (!supabase) {
        setError('Error de configuracion')
        setIsLoadingLinkedIn(false)
        return
      }

      const redirectTo = `${window.location.origin}/auth/callback`
      const next = searchParams.get('next') || '/despega/conozcamonos-1'

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${redirectTo}?next=${encodeURIComponent(next)}&code=${invitationCode.toUpperCase()}`,
        },
      })

      if (oauthError) {
        setError(oauthError.message)
        setIsLoadingLinkedIn(false)
      }
    } catch (err) {
      console.error('[v0] LinkedIn signin error:', err)
      setError('Error al iniciar sesión con LinkedIn')
      setIsLoadingLinkedIn(false)
    }
  }

  const isLoading = isLoadingLinkedIn || isValidatingCode

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple/5 rounded-full opacity-40" style={{ filter: 'blur(80px)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan/5 rounded-full opacity-40" style={{ filter: 'blur(80px)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo at top */}
        <div className="flex justify-center mb-8">
          <img src="/dtc-logo.png" alt="DTC Logo" className="h-12 object-contain" />
        </div>

        {/* Header section */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-4xl font-light tracking-tight" style={{ color: 'rgba(80, 160, 170, 0.9)' }}>
            Despega Tu Carrera
          </h1>
          <p className="text-base text-white/70">
            Tu transformación profesional comienza aquí
          </p>
          <p className="text-sm text-white/60">
            Acceso limitado • 100 cupos disponibles
          </p>
        </div>

        {/* Main Card */}
        <Card 
          className="border backdrop-blur-sm shadow-2xl relative overflow-hidden"
          style={{ 
            borderColor: 'rgba(90, 90, 150, 0.6)',
            backgroundColor: 'rgba(15, 17, 23, 0.9)',
          }}
        >
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(90, 90, 150, 0.1) 0%, rgba(80, 160, 170, 0.05) 100%)'
            }}
          />

          <CardContent className="pt-8 pb-8 space-y-6 relative z-10">
            {/* Invitation Status Alert */}
            {invitationStatus && (
              <div className={`p-4 rounded-lg border backdrop-blur-sm ${
                invitationStatus.available 
                  ? 'bg-teal/5 border-teal/30' 
                  : 'bg-red/5 border-red/30'
              }`}>
                <div className="flex items-center gap-3">
                  {invitationStatus.available ? (
                    <Check className="h-5 w-5 text-teal/60 flex-shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-red/60 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${invitationStatus.available ? 'text-teal/80' : 'text-red/80'}`}>
                      {invitationStatus.available 
                        ? `${invitationStatus.remaining} cupo${invitationStatus.remaining !== 1 ? 's' : ''} disponible${invitationStatus.remaining !== 1 ? 's' : ''}`
                        : 'Todos los cupos asignados'}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {invitationStatus.used} / {invitationStatus.total} inscripciones
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red/5 border-l-4 border-red/40 rounded-lg backdrop-blur-sm">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red/80 text-sm">Error</p>
                    <p className="text-xs text-red/60 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Invitation Code Input */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-white/80">Código de Invitación</span>
              </label>
              <input
                type="text"
                placeholder="Ej: ABC123DEF"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal/40 transition-colors disabled:opacity-50"
              />
              <p className="text-xs text-white/40">
                Ingresa el código de invitación que recibiste por email
              </p>
            </div>

            {/* LinkedIn Button */}
            <Button
              onClick={handleLinkedInSignIn}
              disabled={isLoading || !invitationCode.trim()}
              className="w-full h-12 text-base font-medium gap-3 text-white transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: 'rgba(0, 119, 181, 0.7)',
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Linkedin className="h-5 w-5" />
              )}
              {isValidatingCode ? 'Validando...' : 'Continuar con LinkedIn'}
            </Button>

            {isPreview && (
              <Button
                type="button"
                onClick={handlePreviewAccess}
                variant="outline"
                className="w-full h-11 text-base font-medium border-cyan/40 text-cyan/80 hover:text-cyan hover:bg-cyan/10"
              >
                Entrar en modo Preview
              </Button>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-black/60 text-white/60 font-medium uppercase tracking-wide">
                  Sin código aún?
                </span>
              </div>
            </div>

            {/* Waitlist Link */}
            <Button
              onClick={() => setShowWaitlist(true)}
              variant="outline"
              className="w-full h-11 text-base font-medium border-white/20 text-white/80 hover:text-white hover:bg-white/10"
            >
              Únete a la Lista de Espera
            </Button>

            {/* Disclaimer */}
            <div className="p-4 bg-yellow/5 border border-yellow/20 rounded-lg">
              <p className="text-xs text-yellow/60">
                <strong>Acceso limitado:</strong> Solo 100 cupos disponibles. Registráte ahora o espera tu código de invitación.
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-white/60 leading-relaxed font-light">
              Al ingresar, aceptas nuestros{' '}
              <a href="/terms" className="hover:underline font-medium transition-colors text-teal/60 hover:text-teal/80">
                términos
              </a>
              {' '}y{' '}
              <a href="/privacy" className="hover:underline font-medium transition-colors text-teal/60 hover:text-teal/80">
                privacidad
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Waitlist Modal Overlay */}
        {showWaitlist && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-sm bg-black/90 border-white/20">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Lista de Espera</h2>
                  <p className="text-sm text-white/60">
                    Registra tu email para recibir un código de invitación cuando haya disponibilidad
                  </p>
                </div>

                <WaitlistForm onClose={() => setShowWaitlist(false)} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function WaitlistForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/waitlist/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrarte')
        setLoading(false)
        return
      }

      setSubmitted(true)
      setLoading(false)

      setTimeout(onClose, 3000)
    } catch (err) {
      setError('Error al conectar')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <Check className="h-12 w-12 text-teal/60 mx-auto" />
        <div>
          <p className="text-white font-medium mb-1">¡Te registraste!</p>
          <p className="text-sm text-white/60">Te enviaremos un código pronto</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red/5 border border-red/30 rounded text-sm text-red/60">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal/40 transition-colors disabled:opacity-50"
      />

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="flex-1 border-white/20 text-white/80"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-teal/30 hover:bg-teal/40 text-white"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Registrarse'}
        </Button>
      </div>
    </form>
  )
}
