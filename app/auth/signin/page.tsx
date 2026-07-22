'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Chrome, Linkedin, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (errorParam) {
      setError(errorDescription || `Error de autenticacion: ${errorParam}`)
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setError('')
    setIsLoadingGoogle(true)
    
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Error de configuracion: Supabase no esta disponible')
        setIsLoadingGoogle(false)
        return
      }

      const redirectTo = `${window.location.origin}/auth/callback`
      const next = searchParams.get('next') || '/despega/conozcamonos-1'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectTo}?next=${encodeURIComponent(next)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'login',
          },
        },
      })

      if (error) {
        setError(error.message)
        setIsLoadingGoogle(false)
      }
    } catch (err) {
      setError('Error al iniciar sesion con Google')
      setIsLoadingGoogle(false)
    }
  }

  const handleLinkedInSignIn = async () => {
    setError('')
    setIsLoadingLinkedIn(true)
    
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Error de configuracion: Supabase no esta disponible')
        setIsLoadingLinkedIn(false)
        return
      }

      const redirectTo = `${window.location.origin}/auth/callback`
      const next = searchParams.get('next') || '/despega/conozcamonos-1'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${redirectTo}?next=${encodeURIComponent(next)}`,
        },
      })

      if (error) {
        setError(error.message)
        setIsLoadingLinkedIn(false)
      }
    } catch (err) {
      setError('Error al iniciar sesion con LinkedIn')
      setIsLoadingLinkedIn(false)
    }
  }

  const quickLogin = async (testEmail: string) => {
    setError('')
    setIsLoadingDemo(true)

    try {
      if (testEmail !== 'travis@nuanu.com') {
        setError('Este perfil demo no está disponible temporalmente.')
        setIsLoadingDemo(false)
        return
      }

      const response = await fetch('/api/auth/demo', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No fue posible iniciar la sesión demo')

      // Client-side identity hint only; authorization uses the signed HttpOnly cookie.
      localStorage.setItem('demo_user', JSON.stringify(data.user))

      const next = searchParams.get('next') || '/dashboard'
      window.location.href = next
    } catch (err) {
      console.error('[v0] Quick login error:', err)
      setError('Error al iniciar sesión. Por favor intenta nuevamente.')
      setIsLoadingDemo(false)
    }
  }

  const isLoading = isLoadingGoogle || isLoadingLinkedIn || isLoadingDemo

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Background gradient elements - subtle and elegant */}
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
          <p className="text-base text-muted-foreground dark:text-white/70">
            Tu transformación profesional comienza hoy
          </p>
          <p className="text-sm text-muted-foreground dark:text-white/60">
            Descubre quién eres, explora tu potencial, entrénate para triunfar
          </p>
        </div>

        {/* Main Card with improved styling */}
        <Card 
          className="border backdrop-blur-sm shadow-2xl relative overflow-hidden dark:bg-black/60"
          style={{ 
            borderColor: 'rgba(90, 90, 150, 0.6)',
            backgroundColor: 'rgba(15, 17, 23, 0.9)',
          }}
        >
          {/* Gradient overlay for premium feel */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(90, 90, 150, 0.1) 0%, rgba(80, 160, 170, 0.05) 100%)'
            }}
          />

          <CardContent className="pt-8 pb-8 space-y-6 relative z-10">
            {/* OAuth Error Alert */}
            {error && (
              <div className="p-4 bg-red/5 dark:bg-red/10 border-l-4 border-red/40 rounded-lg backdrop-blur-sm">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red/80 text-sm">Error de autenticación</p>
                    <p className="text-xs text-red/60 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium gap-3 transition-all duration-300 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white"
            >
              {isLoadingGoogle ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Chrome className="h-5 w-5" />
              )}
              Continuar con Google
            </Button>

            {/* LinkedIn OAuth Button */}
            <Button
              onClick={handleLinkedInSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium gap-3 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue/20"
              style={{ 
                backgroundColor: 'rgba(0, 119, 181, 0.7)',
              }}
            >
              {isLoadingLinkedIn ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Linkedin className="h-5 w-5" />
              )}
              Continuar con LinkedIn
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'rgba(90, 90, 150, 0.3)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-black/60 text-muted-foreground dark:text-muted-foreground font-medium uppercase tracking-wide text-xs">
                  o accede como demo
                </span>
              </div>
            </div>

            {/* Demo Login Buttons - Premium Grid Style */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLogin("travis@nuanu.com")}
                disabled={isLoading}
                className="group relative h-11 rounded-lg overflow-hidden font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, rgba(80, 160, 170, 0.15) 0%, rgba(90, 90, 150, 0.1) 100%)',
                  border: '1px solid rgba(80, 160, 170, 0.3)',
                  color: 'rgba(80, 160, 170, 1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2 h-full">
                  {isLoadingDemo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Travis (Dev)</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={() => quickLogin("demo@despegaturcarrera.com")}
                disabled={isLoading}
                className="group relative h-11 rounded-lg overflow-hidden font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, rgba(90, 90, 150, 0.15) 0%, rgba(80, 160, 170, 0.1) 100%)',
                  border: '1px solid rgba(90, 90, 150, 0.3)',
                  color: 'rgba(90, 90, 150, 1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center h-full">
                  {isLoadingDemo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Ana (Marketing)"
                  )}
                </div>
              </button>

              <button
                onClick={() => quickLogin("test@dtc.com")}
                disabled={isLoading}
                className="group relative h-11 rounded-lg overflow-hidden font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, rgba(80, 160, 170, 0.15) 0%, rgba(90, 90, 150, 0.1) 100%)',
                  border: '1px solid rgba(80, 160, 170, 0.3)',
                  color: 'rgba(80, 160, 170, 1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center h-full">
                  {isLoadingDemo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Carlos (PM)"
                  )}
                </div>
              </button>

              <button
                onClick={() => quickLogin("admin@dtc.com")}
                disabled={isLoading}
                className="group relative h-11 rounded-lg overflow-hidden font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, rgba(90, 90, 150, 0.15) 0%, rgba(80, 160, 170, 0.1) 100%)',
                  border: '1px solid rgba(90, 90, 150, 0.3)',
                  color: 'rgba(90, 90, 150, 1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center h-full">
                  {isLoadingDemo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "María (Admin)"
                  )}
                </div>
              </button>
            </div>

            {/* Trust indicators - improved styling */}
            <div 
              className="grid grid-cols-3 gap-4 py-4 border-t border-t-purple/30 pt-6"
            >
              <div className="text-center space-y-1">
                <div className="text-2xl font-light" style={{ color: 'rgba(80, 160, 170, 0.9)' }}>6</div>
                <p className="text-xs text-muted-foreground dark:text-white/60 font-medium uppercase tracking-wide">Tests</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-light" style={{ color: 'rgba(80, 160, 170, 0.9)' }}>120+</div>
                <p className="text-xs text-muted-foreground dark:text-white/60 font-medium uppercase tracking-wide">Recursos</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-light" style={{ color: 'rgba(80, 160, 170, 0.9)' }}>24/7</div>
                <p className="text-xs text-muted-foreground dark:text-white/60 font-medium uppercase tracking-wide">Coach IA</p>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground dark:text-white/60 leading-relaxed pt-2 font-light">
              Al ingresar, aceptas nuestros{' '}
              <a href="/terms" className="hover:underline font-medium transition-colors" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>
                términos de servicio
              </a>
              {' '}y{' '}
              <a href="/privacy" className="hover:underline font-medium transition-colors" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>
                política de privacidad
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground dark:text-white/60 mt-8 font-light">
          ¿Es tu primera vez? Crearemos tu cuenta automáticamente
        </p>
      </div>
    </div>
  )
}
