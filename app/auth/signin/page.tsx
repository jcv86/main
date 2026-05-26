'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Chrome, Linkedin, AlertCircle, Loader2, Sparkles } from 'lucide-react'

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
      // Check if this is the Travis dev account (has full access)
      const isTravisDev = testEmail === 'travis@nuanu.com'
      
      // For demo access, create a demo session in localStorage
      // This bypasses real Supabase auth for testing purposes
      const demoUser = {
        id: isTravisDev ? '64738eef-ee31-4da9-8270-9adfa46c74ba' : `demo-${testEmail.split('@')[0]}`,
        email: testEmail,
        aud: 'authenticated',
        role: isTravisDev ? 'dev' : 'authenticated',
        is_dev: isTravisDev,
      }

      // Store demo user in localStorage for client-side access
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      
      // Also set a cookie so middleware can read it - with proper attributes
      const expiryDate = new Date()
      expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
      const cookieValue = encodeURIComponent(JSON.stringify(demoUser))
      document.cookie = `demo_user=${cookieValue}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`
      
      console.log('[v0] Demo user set:', demoUser.email, isTravisDev ? '(DEV MODE)' : '')
      
      // Travis dev account goes directly to dashboard, others go to onboarding
      const defaultRoute = isTravisDev ? '/dashboard' : '/despega/conozcamonos-1'
      const next = searchParams.get('next') || defaultRoute
      
      // Use hard navigation to ensure cookie is sent with the request
      window.location.href = next
    } catch (err) {
      console.error('[v0] Quick login error:', err)
      setError('Error al iniciar sesión. Por favor intenta nuevamente.')
      setIsLoadingDemo(false)
    }
  }

  const isLoading = isLoadingGoogle || isLoadingLinkedIn || isLoadingDemo

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      {/* Optimized: Minimal CSS-only decorative elements to reduce paint layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple/10 rounded-full opacity-20" style={{ filter: 'blur(80px)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue/10 rounded-full opacity-20" style={{ filter: 'blur(80px)' }} />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Header section - optimized for FCP */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl" style={{ color: 'rgba(80, 160, 170, 0.8)', fontWeight: '500' }}>
            Despega Tu Carrera
          </h1>
          <p className="text-lg text-muted-foreground dark:text-white/85">
            Tu transformación profesional comienza hoy
          </p>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground max-w-sm mx-auto">
            Descubre quién eres, explora tu potencial, entrénate para triunfar
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-xl backdrop-blur-sm dark:bg-background/80" style={{ borderColor: 'rgba(80, 160, 170, 0.6)', backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <CardContent className="pt-8 pb-8 space-y-5">
            {/* OAuth Error Alert */}
            {error && (
              <div className="p-4 bg-red/5 dark:bg-red/20 border-l-4 border-red/50 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red dark:text-red/40 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red dark:text-red/20">Error de autenticacion</p>
                    <p className="text-sm text-red dark:text-red/30 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base gap-2 bg-white hover:bg-muted/5 border-2 border-muted/20 text-muted/90 hover:border-blue/30 transition-colors duration-200 dark:bg-background dark:hover:bg-muted/80 dark:border-card dark:text-white dark:hover:border-blue/50"
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
              className="w-full h-12 text-base gap-2 text-white transition-colors duration-200"
              style={{ backgroundColor: 'rgba(14, 118, 168, 0.6)' }}
            >
              {isLoadingLinkedIn ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Linkedin className="h-5 w-5" />
              )}
              Continuar con LinkedIn
            </Button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted/20 dark:border-card" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-background text-muted-foreground dark:text-muted-foreground">o accede como demo</span>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("travis@nuanu.com")}
                disabled={isLoading}
                className="text-xs h-10"
              >
                {isLoadingDemo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Travis (Dev)"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("demo@despegaturcarrera.com")}
                disabled={isLoading}
                className="text-xs h-10"
              >
                {isLoadingDemo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ana (Marketing)"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("test@dtc.com")}
                disabled={isLoading}
                className="text-xs h-10"
              >
                {isLoadingDemo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Carlos (PM)"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("admin@dtc.com")}
                disabled={isLoading}
                className="text-xs h-10"
              >
                {isLoadingDemo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "María (Admin)"
                )}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 py-2 border-t border-muted/10 pt-4" style={{ borderColor: 'rgb(80, 160, 170, 0.6)' }}>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>6</div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground font-medium">Tests</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>120+</div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground font-medium">Recursos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>24/7</div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground font-medium">Coach IA</p>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground dark:text-muted-foreground leading-relaxed pt-2">
              Al ingresar, aceptas nuestros{' '}
              <a href="/terms" className="hover:underline font-medium" style={{ color: 'rgba(80, 160, 170)' }}>
                términos de servicio
              </a>
              {' '}y{' '}
              <a href="/privacy" className="hover:underline font-medium" style={{ color: 'rgba(80, 160, 170)' }}>
                política de privacidad
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground dark:text-muted-foreground">
          ¿Es tu primera vez? Crearemos tu cuenta automáticamente
        </p>
      </div>
    </div>
  )
}
