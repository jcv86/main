"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Target, Users, TrendingUp, Award, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">¡Bienvenido de vuelta!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Continúa tu desarrollo profesional en el mercado chileno
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Ir al Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
            🇨🇱 Especializado en el mercado chileno
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Impulsa tu carrera en
            <span className="text-blue-600"> Chile</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma integral de desarrollo profesional diseñada específicamente para el mercado laboral chileno.
            Descubre oportunidades, desarrolla habilidades y conecta con las mejores empresas del país.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Tests de Personalidad</CardTitle>
              <CardDescription>
                Descubre tu perfil profesional con evaluaciones adaptadas al contexto laboral chileno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Test DISC personalizado</li>
                <li>• Evaluación de habilidades blandas</li>
                <li>• Análisis de compatibilidad laboral</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Coach IA Especializado</CardTitle>
              <CardDescription>
                Recibe orientación personalizada de un coach que conoce el mercado chileno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Consejos sobre empresas chilenas</li>
                <li>• Estrategias de negociación salarial</li>
                <li>• Preparación para entrevistas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Biblioteca Digital</CardTitle>
              <CardDescription>
                Accede a libros especializados en desarrollo profesional y crecimiento personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Libros de liderazgo y productividad</li>
                <li>• Contenido interactivo</li>
                <li>• Seguimiento de progreso</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Búsqueda de Empleo</CardTitle>
              <CardDescription>
                Encuentra oportunidades en las mejores empresas chilenas con IA personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Integración con portales chilenos</li>
                <li>• Matching inteligente</li>
                <li>• Alertas personalizadas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <Award className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Simulador de Entrevistas</CardTitle>
              <CardDescription>Practica entrevistas con IA adaptada a la cultura empresarial chilena</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Preguntas típicas del mercado</li>
                <li>• Feedback en tiempo real</li>
                <li>• Análisis de desempeño</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Constructor de CV</CardTitle>
              <CardDescription>
                Crea CVs optimizados para el mercado laboral chileno con plantillas profesionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Plantillas adaptadas a Chile</li>
                <li>• Optimización ATS</li>
                <li>• Exportación PDF</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Companies Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Conecta con las mejores empresas de Chile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <span className="font-bold text-gray-700">NotCo</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <span className="font-bold text-gray-700">Fintual</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <span className="font-bold text-gray-700">Cornershop</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <span className="font-bold text-gray-700">Banco de Chile</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <span className="font-bold text-gray-700">Falabella</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <span className="font-bold text-gray-700">Buk</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para impulsar tu carrera?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están desarrollando sus carreras con nuestra plataforma
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Comenzar Ahora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
