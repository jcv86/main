"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  TestTube,
  Play,
  RotateCcw,
  AlertTriangle,
} from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "error"
  message: string
  duration?: number
}

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")

  // Test data
  const [testEmail, setTestEmail] = useState("test@careerdev.cl")
  const [testPassword, setTestPassword] = useState("TestPass123!")
  const [testName, setTestName] = useState("Usuario Test")
  const [showPassword, setShowPassword] = useState(false)

  const { signUp, signIn, signOut, resetPassword, user, loading } = useAuth()

  const updateTestResult = (name: string, status: TestResult["status"], message: string, duration?: number) => {
    setTestResults((prev) => {
      const existing = prev.find((t) => t.name === name)
      if (existing) {
        return prev.map((t) => (t.name === name ? { ...t, status, message, duration } : t))
      }
      return [...prev, { name, status, message, duration }]
    })
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    const startTime = Date.now()
    setCurrentTest(testName)
    updateTestResult(testName, "running", "Ejecutando...")

    try {
      await testFn()
      const duration = Date.now() - startTime
      updateTestResult(testName, "success", "Completado exitosamente", duration)
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestResult(testName, "error", error instanceof Error ? error.message : "Error desconocido", duration)
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    try {
      // Test 1: Registro de usuario
      await runTest("Registro de Usuario", async () => {
        const { error } = await signUp(testEmail, testPassword, testName)
        if (error) throw new Error(`Error en registro: ${error.message}`)
        await sleep(1000) // Simular tiempo de procesamiento
      })

      await sleep(2000)

      // Test 2: Login con credenciales correctas
      await runTest("Login Exitoso", async () => {
        const { error } = await signIn("demo@careercoach.cl", "demo123456")
        if (error) throw new Error(`Error en login: ${error.message}`)
        await sleep(1000)
      })

      await sleep(2000)

      // Test 3: Logout
      await runTest("Logout", async () => {
        await signOut()
        await sleep(1000)
        if (user) throw new Error("Usuario aún autenticado después del logout")
      })

      await sleep(2000)

      // Test 4: Login con credenciales incorrectas
      await runTest("Login con Credenciales Incorrectas", async () => {
        const { error } = await signIn("wrong@email.com", "wrongpassword")
        if (!error) throw new Error("Login debería haber fallado con credenciales incorrectas")
        // Este es el comportamiento esperado
      })

      await sleep(2000)

      // Test 5: Reset de contraseña
      await runTest("Reset de Contraseña", async () => {
        const { error } = await resetPassword(testEmail)
        if (error) throw new Error(`Error en reset: ${error.message}`)
        await sleep(1000)
      })

      await sleep(2000)

      // Test 6: Validación de email inválido
      await runTest("Validación Email Inválido", async () => {
        const { error } = await signUp("invalid-email", testPassword, testName)
        if (!error) throw new Error("Registro debería fallar con email inválido")
        // Este es el comportamiento esperado
      })

      await sleep(2000)

      // Test 7: Validación de contraseña débil
      await runTest("Validación Contraseña Débil", async () => {
        const { error } = await signUp("test2@careerdev.cl", "123", testName)
        if (!error) throw new Error("Registro debería fallar con contraseña débil")
        // Este es el comportamiento esperado
      })
    } catch (error) {
      console.error("Error en suite de tests:", error)
    } finally {
      setIsRunning(false)
      setCurrentTest("")
    }
  }

  const resetTests = () => {
    setTestResults([])
    setCurrentTest("")
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Exitoso
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "running":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Ejecutando
          </Badge>
        )
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const successCount = testResults.filter((t) => t.status === "success").length
  const errorCount = testResults.filter((t) => t.status === "error").length
  const totalTests = testResults.length

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TestTube className="h-8 w-8 text-blue-600" />
          Suite de Pruebas de Autenticación
        </h1>
        <p className="text-gray-600">
          Prueba completa de todos los flujos de autenticación: registro, login, reset de contraseña y validaciones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Control */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Control de Pruebas
              </CardTitle>
              <CardDescription>Configura y ejecuta las pruebas de autenticación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Email de Prueba</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="pl-10"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testPassword">Contraseña de Prueba</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="testPassword"
                    type={showPassword ? "text" : "password"}
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isRunning}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isRunning}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testName">Nombre de Prueba</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="testName"
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="pl-10"
                    disabled={isRunning}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button onClick={runAllTests} disabled={isRunning || loading} className="flex-1">
                  {isRunning ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Ejecutar Todas
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetTests} disabled={isRunning}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {totalTests > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Resumen de Resultados</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{totalTests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Exitosos:</span>
                      <span className="font-medium text-green-600">{successCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Errores:</span>
                      <span className="font-medium text-red-600">{errorCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estado Actual */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Estado de Autenticación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Usuario:</span>
                  <span className={user ? "text-green-600" : "text-gray-500"}>
                    {user ? "Autenticado" : "No autenticado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-gray-600 truncate max-w-32">{user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loading:</span>
                  <span className={loading ? "text-blue-600" : "text-gray-500"}>{loading ? "Sí" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultados de Pruebas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultados de Pruebas</CardTitle>
              <CardDescription>Estado detallado de cada prueba ejecutada</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se han ejecutado pruebas aún</p>
                  <p className="text-sm">Haz clic en "Ejecutar Todas" para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg transition-all ${
                        result.status === "running"
                          ? "border-blue-200 bg-blue-50"
                          : result.status === "success"
                            ? "border-green-200 bg-green-50"
                            : result.status === "error"
                              ? "border-red-200 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium">{result.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.duration && <span className="text-xs text-gray-500">{result.duration}ms</span>}
                          {getStatusBadge(result.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {currentTest && (
                <Alert className="mt-4">
                  <Clock className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Ejecutando: <strong>{currentTest}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pruebas Incluidas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Registro de usuario con validaciones
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Login exitoso con credenciales válidas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Logout y limpieza de sesión
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Manejo de credenciales incorrectas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Reset de contraseña por email
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Validación de email inválido
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Validación de contraseña débil
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Credenciales de Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800 mb-1">Cuenta Demo</div>
                <div className="text-blue-700">
                  <div>Email: demo@careercoach.cl</div>
                  <div>Contraseña: demo123456</div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Las pruebas pueden crear usuarios reales en la base de datos. Usa emails de prueba únicos para evitar
                  conflictos.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
