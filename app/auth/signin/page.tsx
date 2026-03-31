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
            prompt: 'consent',
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Header section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400">
            Despega Tu Carrera
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Tu transformación profesional comienza hoy
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Descubre quién eres, explora tu potencial, entrénate para triunfar
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-purple-200/50 dark:border-purple-900/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-950/80">
          <CardContent className="pt-8 pb-8 space-y-5">
            {/* OAuth Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-200">Error de autenticacion</p>
                    <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-slate-900 hover:border-blue-300 hover:shadow-md transition-all duration-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:border-blue-500"
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
              className="w-full h-12 text-base gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
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
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">o</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">6</div>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Tests</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">120+</div>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Recursos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">24/7</div>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Coach IA</p>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
              Al ingresar, aceptas nuestros{' '}
              <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                términos de servicio
              </a>
              {' '}y{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                política de privacidad
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          ¿Es tu primera vez? Crearemos tu cuenta automáticamente
        </p>
      </div>
    </div>
  )
}
