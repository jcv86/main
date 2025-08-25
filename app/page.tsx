"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import AuthBypass from "@/components/auth-bypass"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, TrendingUp, Award, Target, Brain } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plataforma...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">DTC Final</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma integral para el desarrollo profesional y crecimiento de carrera
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Brain className="w-4 h-4 mr-1" />
              Tests de Personalidad
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <BookOpen className="w-4 h-4 mr-1" />
              Biblioteca de Conocimiento
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              Seguimiento de Progreso
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Evaluaciones Personalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tests DISC, Big Five y evaluaciones de habilidades para conocer tus fortalezas
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Biblioteca de Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Acceso a guías, artículos y recursos para tu desarrollo profesional</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Seguimiento de Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Monitorea tu crecimiento y alcanza tus objetivos profesionales</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <AuthBypass />
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">¿Quieres explorar sin registrarte?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push("/test/disc")} variant="outline" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Probar Test DISC
            </Button>
            <Button onClick={() => router.push("/demo")} variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Ver Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
