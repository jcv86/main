"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Brain, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "¡Bienvenido de vuelta!",
          description: "Has iniciado sesión exitosamente",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setFormData({
      email: "demo@dtc.cl",
      password: "demo123456",
    })

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@dtc.cl",
        password: "demo123456",
      })

      if (error) {
        // If demo user doesn't exist, create it
        const { error: signUpError } = await supabase.auth.signUp({
          email: "demo@dtc.cl",
          password: "demo123456",
          options: {
            data: {
              first_name: "Usuario",
              last_name: "Demo",
            },
          },
        })

        if (signUpError) {
          setError("Error creando usuario demo")
          return
        }

        // Try to sign in again
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: "demo@dtc.cl",
          password: "demo123456",
        })

        if (signInError) {
          setError("Error iniciando sesión con usuario demo")
          return
        }
      }

      toast({
        title: "¡Bienvenido al Demo!",
        description: "Explora todas las funcionalidades de DTC",
      })
      router.push("/")
    } catch (error) {
      console.error("Demo login error:", error)
      setError("Error con el acceso demo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a DTC</h1>
          <p className="text-gray-600">Inicia sesión para continuar tu desarrollo profesional</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta para continuar con tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Probar Demo
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">¿Qué puedes hacer con DTC?</p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white/50 p-3 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="font-medium">Tests Adaptativos</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="font-medium">Coach IA 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
