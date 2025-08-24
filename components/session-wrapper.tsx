"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import DashboardContent from "@/components/dashboard-content"
import LandingPage from "@/components/landing-page"
import { Loader2 } from "lucide-react"

export default function SessionWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // Primero verificar sesión de Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsAuthenticated(true)
        setUserEmail(session.user.email || "")
        setLoading(false)
        return
      }

      // Si no hay sesión de Supabase, verificar sesión local
      const localSession = localStorage.getItem("dtc_session")
      if (localSession) {
        try {
          const sessionData = JSON.parse(localSession)
          if (sessionData.authenticated && sessionData.user) {
            setIsAuthenticated(true)
            setUserEmail(sessionData.user.email)
            setLoading(false)
            return
          }
        } catch (error) {
          console.log("Invalid local session data")
          localStorage.removeItem("dtc_session")
        }
      }

      // No hay sesión válida
      setIsAuthenticated(false)
      setLoading(false)
    } catch (error) {
      console.error("Error checking authentication:", error)

      // Fallback a verificar sesión local
      const localSession = localStorage.getItem("dtc_session")
      if (localSession) {
        try {
          const sessionData = JSON.parse(localSession)
          if (sessionData.authenticated) {
            setIsAuthenticated(true)
            setUserEmail(sessionData.user?.email || "")
          }
        } catch (error) {
          console.log("Invalid local session")
        }
      }

      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <DashboardContent /> : <LandingPage />
}
