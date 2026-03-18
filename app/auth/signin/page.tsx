"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Linkedin, Mail } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log('[v0] Email login - client-side auth starting:', email)
      
      // Use client-side Supabase auth directly - this properly manages session
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('[v0] Client auth error:', error.message)
        setError(error.message || "Email o contraseña incorrectos")
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Error al iniciar sesión")
        setLoading(false)
        return
      }

      console.log('[v0] User authenticated via client-side Supabase:', email)
      
      // Session is now properly stored in client - redirect to conozcamonos-1
      router.push("/despega/conozcamonos-1")
    } catch (err) {
      console.error('[v0] Email login error:', err)
      setError("Error de conexión")
      setLoading(false)
    }
  }

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
          {!showEmailForm ? (
            <>
              {/* OAuth Buttons */}
              <Button
                onClick={() => signIn("google", { callbackUrl: "/despega/conozcamonos-1" })}
                variant="outline"
                className="w-full h-12 text-base gap-2"
              >
                <Chrome className="h-5 w-5" />
                Continuar con Google
              </Button>

              <Button
                onClick={() => signIn("linkedin", { callbackUrl: "/despega/conozcamonos-1" })}
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

              {/* Email Button */}
              <Button
                onClick={() => setShowEmailForm(true)}
                variant="secondary"
                className="w-full h-12 text-base gap-2"
              >
                <Mail className="h-5 w-5" />
                Ingresar con Email
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Al ingresar, aceptas nuestros términos de servicio y política de privacidad.
              </p>
            </>
          ) : (
            <>
              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />

                {error && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3">
                    <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11"
                >
                  {loading ? "Cargando..." : "Ingresar"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowEmailForm(false)
                    setError("")
                    setEmail("")
                    setPassword("")
                  }}
                  className="w-full"
                >
                  Volver atrás
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Demo: usa cualquier email y contraseña <strong>"demo"</strong>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

