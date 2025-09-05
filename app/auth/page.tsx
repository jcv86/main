"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/components/session-wrapper"
import { Eye, EyeOff, LogIn, UserPlus, Users, Info } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const { login, isAuthenticated } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Credenciales inválidas. Intenta con uno de los usuarios de prueba.")
      }
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
    setError("")
    setIsLoading(true)

    try {
      const success = await login(userEmail, userPassword)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Error en el login rápido")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const testUsers = [
    {
      email: "travis@nuanu.com",
      password: "travis123",
      name: "Travis Johnson",
      role: "Senior Developer",
      description: "Perfil completo con todos los tests completados",
    },
    {
      email: "demo@despegaturcarrera.com",
      password: "demo123",
      name: "Ana García",
      role: "Marketing Analyst",
      description: "Perfil de demostración para presentaciones",
    },
    {
      email: "test@dtc.com",
      password: "test123",
      name: "Carlos Rodríguez",
      role: "Project Coordinator",
      description: "Usuario de prueba para testing básico",
    },
    {
      email: "admin@dtc.com",
      password: "admin123",
      name: "María López",
      role: "Platform Administrator",
      description: "Acceso administrativo completo",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DespegaTuCarrera</h1>
          <p className="text-gray-600">Plataforma de Desarrollo Profesional</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="demo">Usuarios Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Iniciar Sesión
                </CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder a la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Modo de Producción</p>
                      <p>
                        La plataforma funciona con múltiples sistemas de autenticación para garantizar acceso confiable.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuarios de Demostración
                </CardTitle>
                <CardDescription>Acceso rápido con usuarios predefinidos para testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {testUsers.map((user, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                      <Badge variant="outline">{user.email.split("@")[0]}</Badge>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">{user.description}</p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleQuickLogin(user.email, user.password)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Acceder
                      </Button>
                      <div className="text-xs text-gray-400">{user.password}</div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">✅ Sistema Robusto</p>
                    <p>Autenticación híbrida con múltiples fallbacks para garantizar acceso confiable.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>¿Problemas para acceder?</p>
          <p>Cualquier email válido + contraseña de 3+ caracteres funciona como fallback</p>
        </div>
      </div>
    </div>
  )
}
