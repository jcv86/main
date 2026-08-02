'use client'

import { useSession } from '@/components/session-wrapper'
import { type ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { SIGN_IN_PATH } from '@/lib/auth/routes'

interface ProtectedAdminRouteProps {
  children: ReactNode
}

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="mx-4 w-full max-w-md border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <h1 className="text-center text-xl font-bold">Acceso requerido</h1>
              <p className="text-center text-sm text-muted-foreground">
                Necesitas iniciar sesión para acceder al panel de administración.
              </p>
              <Button asChild className="w-full">
                <Link href={SIGN_IN_PATH}>Iniciar sesión</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAdmin = Boolean(user.email && ADMIN_EMAILS.includes(user.email))

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="mx-4 w-full max-w-md border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <h1 className="text-center text-xl font-bold">Acceso denegado</h1>
              <p className="text-center text-sm text-muted-foreground">
                No tienes permisos para acceder al panel de administración.
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Usuario actual: {user.email}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
