'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Chrome, Linkedin, AlertCircle, Loader2, Sparkles } from 'lucide-react'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false)

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

  const isLoading = isLoadingGoogle || isLoadingLinkedIn

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple/5 via-blue/5 to-blue/5 dark:from-background dark:via-muted/90 dark:to-muted/90 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple/20 dark:bg-purple/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue/20 dark:bg-blue/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200 dark:bg-cyan/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Header section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple/50 to-blue/50 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple via-blue to-blue bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-blue/40">
            Despega Tu Carrera
          </h1>
          <p className="text-lg text-muted/60 dark:text-muted/30">
            Tu transformación profesional comienza hoy
          </p>
          <p className="text-sm text-muted/50 dark:text-muted/40 max-w-sm mx-auto">
            Descubre quién eres, explora tu potencial, entrénate para triunfar
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-purple/20/50 dark:border-purple/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-background/80">
          <CardContent className="pt-8 pb-8 space-y-5">
            {/* OAuth Error Alert */}
            {error && (
              <div className="p-4 bg-red/5 dark:bg-red/20 border-l-4 border-red/50 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red/20">Error de autenticacion</p>
                    <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base gap-2 bg-white hover:bg-muted/5 border-2 border-muted/20 text-muted/90 hover:border-blue/30 hover:shadow-md transition-all duration-200 dark:bg-background dark:hover:bg-muted/80 dark:border-card dark:text-white dark:hover:border-blue/50"
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
              className="w-full h-12 text-base gap-2 bg-gradient-to-r from-blue to-blue hover:from-blue hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 dark:from-blue dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
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
                <span className="px-2 bg-white dark:bg-background text-muted/50 dark:text-muted/40">o</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple dark:text-purple/40">6</div>
                <p className="text-xs text-muted/70 dark:text-muted/40 font-medium">Tests</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue dark:text-blue/40">120+</div>
                <p className="text-xs text-muted/70 dark:text-muted/40 font-medium">Recursos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">24/7</div>
                <p className="text-xs text-muted/70 dark:text-muted/40 font-medium">Coach IA</p>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-muted/50 dark:text-muted/40 leading-relaxed pt-2">
              Al ingresar, aceptas nuestros{' '}
              <a href="/terms" className="text-blue dark:text-blue/40 hover:underline font-medium">
                términos de servicio
              </a>
              {' '}y{' '}
              <a href="/privacy" className="text-blue dark:text-blue/40 hover:underline font-medium">
                política de privacidad
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-muted/50 dark:text-muted/40">
          ¿Es tu primera vez? Crearemos tu cuenta automáticamente
        </p>
      </div>
    </div>
  )
}
