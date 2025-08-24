"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Rocket, User, ArrowRight } from "lucide-react"

export default function AuthBypass() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBypassLogin = async () => {
    setLoading(true)

    // Simular login exitoso sin Supabase
    localStorage.setItem(
      "dtc_demo_user",
      JSON.stringify({
        email: "demo@despegaturcarrera.com",
        name: "Usuario Demo",
        authenticated: true,
        timestamp: Date.now(),
      }),
    )

    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Rocket className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">DespegaTuCarrera</h1>
          </div>
          <p className="text-gray-600">Acceso Temporal - Demo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acceso Demo Directo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Modo Demo</span>
              </div>
              <p className="text-sm text-blue-700">
                Accede directamente a la plataforma con datos de demostración completos
              </p>
            </div>

            <Button onClick={handleBypassLogin} className="w-full" disabled={loading}>
              {loading ? "Conectando..." : "Acceder a Demo"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center">
              <Button variant="link" onClick={() => router.push("/auth")} className="text-sm">
                Volver al Login Normal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
