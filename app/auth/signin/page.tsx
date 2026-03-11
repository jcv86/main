"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Linkedin } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold">Despega Tu Carrera</CardTitle>
          <CardDescription className="text-base">
            Ingresa con tu cuenta de Google o LinkedIn para comenzar tu transformación
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google Sign In */}
          <Button
            onClick={() => signIn("google", { callbackUrl: "/despega/onboarding" })}
            variant="outline"
            className="w-full h-12 text-base gap-2"
          >
            <Chrome className="h-5 w-5" />
            Continuar con Google
          </Button>

          {/* LinkedIn Sign In */}
          <Button
            onClick={() => signIn("linkedin", { callbackUrl: "/despega/onboarding" })}
            variant="outline"
            className="w-full h-12 text-base gap-2"
          >
            <Linkedin className="h-5 w-5" />
            Continuar con LinkedIn
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">
                O continúa con email
              </span>
            </div>
          </div>

          {/* Placeholder for email signin (optional) */}
          <p className="text-sm text-center text-muted-foreground">
            Al ingresar, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
