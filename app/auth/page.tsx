"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2, CheckCircle, User, Mail, Lock, UserPlus, LogIn, Play } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, signup, isLoading: sessionLoading } = useSession()

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // UI states
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Set initial tab based on URL parameter
  useEffect(() => {
    const mode = searchParams.get("mode")
    if (mode === "signup") {
      setActiveTab("signup")
    } else if (mode === "demo") {
      setActiveTab("demo")
    } else {
      setActiveTab("login")
    }
  }, [searchParams])

  // Demo users for quick access
  const demoUsers = [
    { email: "travis@nuanu.com", password: "travis123", name: "Travis Herrera", role: "Senior Developer" },
    { email: "demo@despegaturcarrera.com", password: "demo123", name: "Ana García", role: "Marketing Analyst" },
    { email: "test@dtc.com", password: "test123", name: "Carlos Mendoza", role: "Project Coordinator" },
    { email: "admin@dtc.com", password: "admin123", name: "María López", role: "Platform Administrator" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const success = await login(loginForm.email, loginForm.password)
      if (success) {
        setMessage({ type: "success", text: "¡Inicio de sesión exitoso!" })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setMessage({ type: "error", text: "Credenciales inválidas. Intenta de nuevo." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al iniciar sesión. Intenta de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validation
    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." })
      setIsLoading(false)
      return
    }

    if (signupForm.password.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." })
      setIsLoading(false)
      return
    }

    if (!signupForm.name.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido." })
      setIsLoading(false)
      return
    }

    try {
      const success = await signup(signupForm.email, signupForm.password, signupForm.name)
      if (success) {
        setMessage({ type: "success", text: "¡Cuenta creada exitosamente!" })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setMessage({ type: "error", text: "Error al crear la cuenta. Intenta de nuevo." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al crear la cuenta. Intenta de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoUser: (typeof demoUsers)[0]) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const success = await login(demoUser.email, demoUser.password)
      if (success) {
        setMessage({ type: "success", text: `¡Acceso como ${demoUser.name}!` })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setMessage({ type: "error", text: "Error al acceder con la cuenta demo." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al acceder con la cuenta demo." })
    } finally {
      setIsLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DTC Final</h1>
          <p className="text-gray-600">Plataforma de Desarrollo Profesional</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Crear Cuenta
            </TabsTrigger>
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Demo
            </TabsTrigger>
          </TabsList>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Crear Nueva Cuenta
                </CardTitle>
                <CardDescription>Únete a nuestra plataforma y comienza tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre Completo
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear Cuenta
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">¿Qué obtienes con tu cuenta?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Tests de personalidad y habilidades</li>
                    <li>• Dashboard personalizado</li>
                    <li>• Análisis con IA</li>
                    <li>• Coach virtual 24/7</li>
                    <li>• Seguimiento de progreso</li>
                  </ul>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Iniciar Sesión
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-blue-600" />
                  Iniciar Sesión
                </CardTitle>
                <CardDescription>Accede a tu cuenta para continuar tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Crear Cuenta
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-600" />
                  Acceso Demo
                </CardTitle>
                <CardDescription>Prueba la plataforma con cuentas de demostración</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {user.role}
                        </Badge>
                      </div>
                      <Button onClick={() => handleDemoLogin(user)} disabled={isLoading} size="sm" variant="outline">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Play className="mr-1 h-3 w-3" />
                            Acceder
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Cuentas Demo</h4>
                  <p className="text-sm text-green-800">
                    Estas cuentas tienen datos precargados para que puedas explorar todas las funcionalidades de la
                    plataforma sin necesidad de completar tests.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Message Display */}
        {message && (
          <Alert
            className={`mt-4 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertDescription className="text-red-800">{message.text}</AlertDescription>
            )}
            {message.type === "success" && (
              <AlertDescription className="text-green-800">{message.text}</AlertDescription>
            )}
          </Alert>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>
      </div>
    </div>
  )
}
