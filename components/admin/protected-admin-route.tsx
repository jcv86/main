"use client"

import { useSession } from "next-auth/react"
import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

interface ProtectedAdminRouteProps {
  children: ReactNode
}

// Admin user IDs (should be configured in environment or database)
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || []

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="border-0 bg-card/70 backdrop-blur-sm max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="text-xl font-bold text-center">Acceso Requerido</h1>
              <p className="text-sm text-muted-foreground text-center">
                Necesitas iniciar sesión para acceder al panel de administración.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email)

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="border-0 bg-card/70 backdrop-blur-sm max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="text-xl font-bold text-center">Acceso Denegado</h1>
              <p className="text-sm text-muted-foreground text-center">
                No tienes permisos para acceder al panel de administración.
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Usuario actual: {session?.user?.email}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
