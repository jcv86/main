"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "./session-wrapper"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function AuthBypass() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useSession()
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleQuickAuth = async (userEmail: string, userName: string) => {
    setIsLoading(true)
    try {
      await handleLocalAuth(userEmail, userName)
    } catch (error) {
      console.error("Quick auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocalAuth = async (userEmail: string, userName: string) => {
    try {
      // Create user object
      const userData = {
        email: userEmail,
        full_name: userName,
        position: userEmail === "travis@dtcfinal.com" ? "Senior Developer" : "Team Member",
        department: "Technology",
      }

      // Set user in session
      setUser(userData)

      // Try to create/update user in database (with fallback)
      try {
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
            full_name: userName,
            position: userData.position,
            department: userData.department,
            documents_read: 0,
            tests_completed: 0,
          })

          if (insertError) {
            console.warn("Database insert error:", insertError)
          }
        }
      } catch (dbError) {
        console.warn("Database not available, using local session only:", dbError)
      }

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Auth error:", error)
      throw error
    }
  }

  const handleCustomAuth = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      await handleLocalAuth(email, email.split("@")[0])
    } catch (error) {
      console.error("Custom auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Acceso a la Plataforma</CardTitle>
          <CardDescription>Selecciona un usuario de prueba o ingresa tu email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Access Buttons */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Acceso Rápido:</div>

            <Button
              onClick={() => handleQuickAuth("travis@dtcfinal.com", "Travis Johnson")}
              disabled={isLoading}
              className="w-full justify-between bg-blue-600 hover:bg-blue-700"
            >
              <span>Travis Johnson</span>
              <Badge variant="secondary" className="ml-2">
                Senior Dev
              </Badge>
            </Button>

            <Button
              onClick={() => handleQuickAuth("demo@dtcfinal.com", "Usuario Demo")}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-between"
            >
              <span>Usuario Demo</span>
              <Badge variant="outline" className="ml-2">
                Demo
              </Badge>
            </Button>

            <Button
              onClick={() => handleQuickAuth("test@dtcfinal.com", "Usuario Test")}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-between"
            >
              <span>Usuario Test</span>
              <Badge variant="outline" className="ml-2">
                Test
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
              {isLoading ? "Accediendo..." : "Acceder con Email"}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Acciones Rápidas:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => router.push("/test/disc")} variant="outline" size="sm" className="text-xs">
                Test DISC
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline" size="sm" className="text-xs">
                Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
