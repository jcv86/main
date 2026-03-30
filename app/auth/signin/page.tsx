'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome, Linkedin, AlertCircle } from 'lucide-react'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const [oauthError, setOauthError] = useState('')

  // Check for OAuth errors in URL
  useEffect(() => {
    const oauthErrorParam = searchParams.get('error')
    if (oauthErrorParam) {
      console.log('[v0] OAuth error detected:', oauthErrorParam)
      setOauthError(`Error OAuth: ${oauthErrorParam}`)
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold">Despega Tu Carrera</CardTitle>
          <CardDescription className="text-base">
            Ingresa para comenzar tu transformación
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OAuth Error Alert */}
          {oauthError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-semibold">Error de autenticación OAuth</p>
                <p className="text-xs mt-1">{oauthError}</p>
              </div>
            </div>
          )}

          {/* OAuth Buttons */}
          <Button
            onClick={() => {
              setOauthError('')
              signIn('google', { callbackUrl: '/despega/conozcamonos-1', redirect: true })
            }}
            variant="outline"
            className="w-full h-12 text-base gap-2"
          >
            <Chrome className="h-5 w-5" />
            Continuar con Google
          </Button>

          <Button
            onClick={() => {
              setOauthError('')
              signIn('linkedin', { callbackUrl: '/despega/conozcamonos-1', redirect: true })
            }}
            variant="outline"
            className="w-full h-12 text-base gap-2"
          >
            <Linkedin className="h-5 w-5" />
            Continuar con LinkedIn
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al ingresar, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
