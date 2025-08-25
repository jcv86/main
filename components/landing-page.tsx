"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Brain, Target, Users, BookOpen, CheckCircle, ArrowRight, Zap, BarChart3, Lightbulb } from "lucide-react"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGetStarted = async () => {
    setIsLoading(true)
    router.push("/auth")
  }

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Tests Psicométricos Avanzados",
      description: "Evaluaciones científicas con análisis potenciado por IA para conocer tu personalidad y habilidades",
      badge: "IA Integrada",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Dashboard Moderno",
      description: "Visualizaciones interactivas con gráficos de radar, barras y análisis en tiempo real",
      badge: "Visualización",
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Desarrollo Personalizado",
      description: "Planes de crecimiento adaptados a tu perfil único y objetivos profesionales",
      badge: "Personalizado",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      title: "Biblioteca de Conocimiento",
      description: "Recursos curados y documentos especializados para tu desarrollo continuo",
      badge: "Recursos",
    },
  ]

  const tests = [
    {
      name: "DISC",
      description: "Evalúa tu estilo de comportamiento y comunicación",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      available: true,
    },
    {
      name: "Big Five",
      description: "Las cinco dimensiones principales de la personalidad",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-purple-500",
      available: false,
    },
    {
      name: "MBTI",
      description: "Tu tipo de personalidad Myers-Briggs",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "bg-green-500",
      available: false,
    },
    {
      name: "RIASEC",
      description: "Intereses profesionales y vocacionales",
      icon: <Target className="h-6 w-6" />,
      color: "bg-orange-500",
      available: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Potenciado por Inteligencia Artificial
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Descubre tu{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Potencial Profesional
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma integral de desarrollo profesional con tests psicométricos avanzados, análisis con IA y
              dashboard moderno para impulsar tu carrera al siguiente nivel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4 text-lg" onClick={handleGetStarted} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Cargando...
                  </>
                ) : (
                  <>
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Características Principales</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas avanzadas diseñadas para maximizar tu desarrollo profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">{feature.icon}</div>
                  <Badge variant="secondary" className="mx-auto mb-2 w-fit">
                    {feature.badge}
                  </Badge>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tests Psicométricos Disponibles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Evaluaciones científicas para conocer tu personalidad, habilidades e intereses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tests.map((test, index) => (
              <Card
                key={index}
                className={`relative ${test.available ? "hover:shadow-lg transition-shadow" : "opacity-60"}`}
              >
                <CardHeader>
                  <div className={`p-3 rounded-lg ${test.color} text-white w-fit`}>{test.icon}</div>
                  <CardTitle className="flex items-center justify-between">
                    {test.name}
                    {test.available ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Badge variant="outline">Próximamente</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{test.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para Descubrir tu Potencial?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están transformando sus carreras con nuestra plataforma de desarrollo
            integral.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              Comenzar Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DTC Final</h3>
              <p className="text-gray-400">Plataforma de desarrollo profesional con IA</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tests</h4>
              <ul className="space-y-2 text-gray-400">
                <li>DISC</li>
                <li>Big Five</li>
                <li>MBTI</li>
                <li>RIASEC</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentación</li>
                <li>Guías</li>
                <li>Blog</li>
                <li>Soporte</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@dtcfinal.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DTC Final. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
