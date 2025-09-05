"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Lock, LogIn } from "lucide-react"

export default function AuthBypass() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Credenciales inválidas. Intenta con uno de los usuarios de prueba.")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setIsLoading(true)
    setError("")

    try {
      const success = await login(demoEmail, demoPassword)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Error al acceder con usuario demo")
      }
    } catch (err) {
      setError("Error al iniciar sesión demo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <LogIn className="w-5 h-5" />
          Acceso a la Plataforma
        </CardTitle>
        <CardDescription>Inicia sesión para acceder a tu dashboard personalizado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O prueba con</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("travis@nuanu.com", "travis123")}
            disabled={isLoading}
            className="text-xs"
          >
            Travis (Dev)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("demo@despegaturcarrera.com", "demo123")}
            disabled={isLoading}
            className="text-xs"
          >
            Ana (Marketing)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("test@dtc.com", "test123")}
            disabled={isLoading}
            className="text-xs"
          >
            Carlos (PM)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("admin@dtc.com", "admin123")}
            disabled={isLoading}
            className="text-xs"
          >
            María (Admin)
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Usuarios de prueba disponibles con perfiles completos</p>
        </div>
      </CardContent>
    </Card>
  )
}
