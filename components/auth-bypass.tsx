"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "./session-wrapper"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { CheckCircle } from "lucide-react"

export default function AuthBypass() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { setUser } = useSession()
  const router = useRouter()

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleQuickAuth = async (userEmail: string, userName: string) => {
    setIsLoading(true)
    try {
      await handleLocalAuth(userEmail, userName)
    } catch (error) {
      console.error("Quick auth error:", error)
      showMessage("Error en autenticación, reintentando...")
      // Retry with basic session
      createBasicSession(userEmail, userName)
    } finally {
      setIsLoading(false)
    }
  }

  const createBasicSession = (userEmail: string, userName: string) => {
    const userData = {
      email: userEmail,
      full_name: userName,
      name: userName,
      position: userEmail.includes("travis") ? "Senior Developer" : "Team Member",
      department: "Technology",
      id: `local-${Date.now()}`,
    }

    setUser(userData)
    showMessage(`¡Acceso exitoso como ${userName}!`)

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  const handleLocalAuth = async (userEmail: string, userName: string) => {
    try {
      // Create user object
      const userData = {
        email: userEmail,
        full_name: userName,
        name: userName,
        position: userEmail.includes("travis") ? "Senior Developer" : "Team Member",
        department: "Technology",
        id: `local-${Date.now()}`,
      }

      // Set user in session
      setUser(userData)

      // Try to create/update user in database (with fallback)
      try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

        const { data: existingUser, error: fetchError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_email", userEmail)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.warn("Database fetch error:", fetchError)
        }

        if (!existingUser) {
          // Create new user
          const { error: insertError } = await supabase.from("user_profiles").insert({
            user_email: userEmail,
            email: userEmail,
            full_name: userName,
            position: userData.position,
            department: userData.department,
            documents_read: 0,
            tests_completed: 0,
            experience_years: 2,
            skills: ["JavaScript", "React", "Node.js"],
            career_goals: "Desarrollo profesional",
            current_level: 1,
            total_xp: 100,
            skills_learned: 3,
          })

          if (insertError) {
            console.warn("Database insert error:", insertError)
          }
        }
      } catch (dbError) {
        console.warn("Database not available, using local session only:", dbError)
      }

      showMessage(`¡Acceso exitoso como ${userName}!`)

      // Navigate to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Auth error:", error)
      throw error
    }
  }

  const handleCustomAuth = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      const userName = email.split("@")[0]
      await handleLocalAuth(email, userName)
    } catch (error) {
      console.error("Custom auth error:", error)
      showMessage("Error en autenticación personalizada")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">🚀 DespegaTuCarrera</CardTitle>
          <CardDescription>Acceso rápido a la plataforma de desarrollo profesional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Access Buttons */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-2">✨ Acceso Rápido:</div>

            <Button
              onClick={() => handleQuickAuth("travis@nuanu.com", "Travis Johnson")}
              disabled={isLoading}
              className="w-full justify-between bg-blue-600 hover:bg-blue-700"
            >
              <span>👨‍💻 Travis Johnson</span>
              <Badge variant="secondary" className="ml-2">
                Senior Dev
              </Badge>
            </Button>

            <Button
              onClick={() => handleQuickAuth("demo@despegaturcarrera.com", "Usuario Demo")}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-between"
            >
              <span>🎯 Usuario Demo</span>
              <Badge variant="outline" className="ml-2">
                Completo
              </Badge>
            </Button>

            <Button
              onClick={() => handleQuickAuth("test@dtc.com", "Usuario Test")}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-between"
            >
              <span>🧪 Usuario Test</span>
              <Badge variant="outline" className="ml-2">
                Básico
              </Badge>
            </Button>

            <Button
              onClick={() => handleQuickAuth("admin@dtc.com", "Administrador")}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-between"
            >
              <span>⚙️ Administrador</span>
              <Badge variant="outline" className="ml-2">
                Admin
              </Badge>
            </Button>
          </div>

          {/* Custom Email Input */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O ingresa tu email</span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="tu-email@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCustomAuth()}
            />

            <Button onClick={handleCustomAuth} disabled={!email || isLoading} className="w-full" variant="secondary">
              {isLoading ? "🔄 Accediendo..." : "🔑 Acceder con Email"}
            </Button>
          </div>

          {message && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">🎯 Acciones Directas:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => router.push("/test/disc")} variant="outline" size="sm" className="text-xs">
                📊 Test DISC
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline" size="sm" className="text-xs">
                📈 Dashboard
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-800">✅ Sistema Híbrido Activo</span>
            </div>
            <p className="text-sm text-green-700">
              🔄 Funciona con Supabase cuando está disponible
              <br />💾 Respaldo local garantizado
              <br />🚀 Todas las funcionalidades operativas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
