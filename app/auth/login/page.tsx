"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [showDemoInfo, setShowDemoInfo] = useState(false)

  const { signIn, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(email))
  }, [email])

  // Password validation
  useEffect(() => {
    setPasswordValid(password.length >= 6)
  }, [password])

  // Handle user authentication state changes
  useEffect(() => {
    if (user && !authLoading && !loading) {
      console.log("User authenticated, redirecting to:", redirectTo)
      router.replace(redirectTo)
    }
  }, [user, authLoading, loading, redirectTo, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setError("")
    setLoading(true)

    try {
      console.log("Attempting login with:", email)
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Login error:", error)
        let errorMessage = "Error al iniciar sesión"

        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email o contraseña incorrectos. Verifica tus credenciales."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor confirma tu email antes de iniciar sesión."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Espera unos minutos antes de intentar nuevamente."
        } else {
          errorMessage = error.message
        }

        setError(errorMessage)
      } else {
        console.log("Login successful")
        setTimeout(() => {
          router.replace(redirectTo)
        }, 100)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("Ocurrió un error inesperado. Por favor intenta nuevamente.")
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const handleDemoLogin = async () => {
    if (loading) return

    setEmail("demo@careercoach.cl")
    setPassword("demo123456")
    setError("")
    setLoading(true)

    try {
      console.log("Attempting demo login")
      const { error } = await signIn("demo@careercoach.cl", "demo123456")

      if (error) {
        console.error("Demo login error:", error)
        setError(
          "La cuenta demo no está disponible en este momento. Puedes crear una cuenta nueva o contactar soporte.",
        )
        setShowDemoInfo(true)
      } else {
        console.log("Demo login successful")
        setTimeout(() => {
          router.replace(redirectTo)
        }, 100)
      }
    } catch (err) {
      console.error("Unexpected demo login error:", err)
      setError("Error al acceder a la cuenta demo. Puedes crear una cuenta nueva.")
      setShowDemoInfo(true)
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const isFormValid = emailValid && passwordValid

  // If user is already authenticated, redirect immediately
  if (user && !authLoading) {
    router.replace(redirectTo)
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa a tu cuenta para continuar con tu desarrollo profesional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showDemoInfo && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cuenta Demo no disponible</strong>
                  <br />
                  Puedes crear una cuenta nueva gratis haciendo clic en "Regístrate aquí" abajo.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={loading || authLoading}
                />
                {email && (
                  <div className="absolute right-3 top-3">
                    {emailValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={loading || authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading || authLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && !passwordValid && (
                <p className="text-sm text-red-500">La contraseña debe tener al menos 6 caracteres</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={!isFormValid || loading || authLoading}>
              {loading || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleDemoLogin}
              disabled={loading || authLoading}
            >
              {loading || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando demo...
                </>
              ) : (
                "Probar con cuenta demo"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="text-sm text-center">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
            <strong>Cuenta Demo:</strong>
            <br />
            Si la cuenta demo no funciona, puedes crear una cuenta nueva gratis.
            <br />
            <span className="text-gray-400">Email: demo@careercoach.cl | Contraseña: demo123456</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
