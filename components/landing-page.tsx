"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/components/session-wrapper"
import {
  Brain,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Award,
  BarChart3,
  MessageSquare,
  BookOpen,
  Menu,
  X,
} from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp } = useSession()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsLoading(true)

    try {
      let result
      if (authMode === "login") {
        result = await signIn(email, password)
      } else {
        result = await signUp(email, password, name)
      }

      if (result.success) {
        router.push("/dashboard")
      } else {
        setAuthError(result.error || "Error en la autenticación")
      }
    } catch (error) {
      setAuthError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("demo@example.com", "demo123")
      if (result.success) {
        router.push("/dashboard")
      } else {
        setAuthError("Error al acceder como demo")
      }
    } catch (error) {
      setAuthError("Error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestDemo = () => {
    router.push("/demo")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CareerDev Pro</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Características
                </a>
                <a href="#tests" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Evaluaciones
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Testimonios
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Precios
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-blue-100">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </a>
              <a
                href="#tests"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Evaluaciones
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonios
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Precios
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Main Content */}
        <div className="flex-1 lg:w-2/3">
          {/* Hero Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
                Plataforma de Desarrollo Profesional con IA
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Impulsa tu{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Carrera Profesional
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Evaluaciones psicométricas avanzadas, análisis de soft skills con IA y coaching personalizado para
                acelerar tu crecimiento profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleGuestDemo}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demo
                </Button>
              </div>

              {/* Demo Access */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Acceso Rápido</h3>
                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  {isLoading ? "Cargando..." : "Probar como Usuario Demo"}
                </Button>
                {authError && (
                  <Alert className="mt-3">
                    <AlertDescription className="text-red-600">{authError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Características Principales</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Herramientas avanzadas para el desarrollo profesional basadas en inteligencia artificial
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <Brain className="h-12 w-12 text-blue-600 mb-4" />
                    <CardTitle>Evaluaciones con IA</CardTitle>
                    <CardDescription>
                      Análisis psicométrico avanzado con interpretación inteligente de resultados
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <Target className="h-12 w-12 text-green-600 mb-4" />
                    <CardTitle>Coaching Personalizado</CardTitle>
                    <CardDescription>
                      Recomendaciones específicas basadas en tu perfil y objetivos profesionales
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                    <CardTitle>Analytics Avanzados</CardTitle>
                    <CardDescription>Seguimiento detallado de tu progreso y desarrollo de competencias</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-red-600 mb-4" />
                    <CardTitle>Datos Seguros</CardTitle>
                    <CardDescription>
                      Máxima seguridad y privacidad en el manejo de tu información personal
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                    <CardTitle>Resultados Instantáneos</CardTitle>
                    <CardDescription>
                      Obtén insights inmediatos sobre tu perfil profesional y áreas de mejora
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <Award className="h-12 w-12 text-indigo-600 mb-4" />
                    <CardTitle>Certificaciones</CardTitle>
                    <CardDescription>
                      Obtén certificados validados de tus competencias y logros profesionales
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          {/* Tests Section */}
          <section id="tests" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Evaluaciones Disponibles</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Suite completa de evaluaciones psicométricas para un análisis integral de tu perfil profesional
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-6 w-6 text-blue-600 mr-2" />
                      DISC
                    </CardTitle>
                    <CardDescription>
                      Evalúa tu estilo de comportamiento y comunicación en el entorno laboral
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Dominancia y liderazgo
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Influencia y comunicación
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Estabilidad y paciencia
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Cumplimiento y precisión
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-6 w-6 text-green-600 mr-2" />
                      Big Five
                    </CardTitle>
                    <CardDescription>Análisis profundo de los cinco grandes rasgos de personalidad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Apertura a experiencias
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Responsabilidad
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Extraversión
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Amabilidad y neuroticismo
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-6 w-6 text-purple-600 mr-2" />
                      MBTI
                    </CardTitle>
                    <CardDescription>Descubre tu tipo de personalidad según el indicador Myers-Briggs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        16 tipos de personalidad
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Preferencias cognitivas
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Estilo de toma de decisiones
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Compatibilidad laboral
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
                      Soft Skills
                    </CardTitle>
                    <CardDescription>
                      Evaluación integral de habilidades blandas esenciales para el éxito profesional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Comunicación efectiva
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Liderazgo y trabajo en equipo
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Resolución de problemas
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Adaptabilidad y creatividad
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros usuarios</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Testimonios reales de profesionales que han transformado su carrera con CareerDev Pro
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">
                      "Las evaluaciones me ayudaron a identificar mis fortalezas y áreas de mejora. El coaching con IA
                      es increíblemente preciso."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">MR</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">María Rodríguez</p>
                        <p className="text-sm text-gray-500">Gerente de Marketing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">
                      "Excelente plataforma para el desarrollo profesional. Los insights son muy valiosos y
                      accionables."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-semibold">CL</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Carlos López</p>
                        <p className="text-sm text-gray-500">Director de RRHH</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">
                      "Me ayudó a entender mejor mi perfil profesional y a tomar decisiones más informadas sobre mi
                      carrera."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-semibold">AG</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Ana García</p>
                        <p className="text-sm text-gray-500">Desarrolladora Senior</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planes y Precios</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Elige el plan que mejor se adapte a tus necesidades de desarrollo profesional
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Básico</CardTitle>
                    <CardDescription>Perfecto para comenzar tu desarrollo profesional</CardDescription>
                    <div className="text-3xl font-bold text-gray-900 mt-4">
                      Gratis
                      <span className="text-lg font-normal text-gray-500">/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />1 evaluación por mes
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Reportes básicos
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Soporte por email
                      </li>
                    </ul>
                    <Button className="w-full mt-6 bg-transparent" variant="outline">
                      Comenzar Gratis
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 relative">
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Más Popular
                  </Badge>
                  <CardHeader>
                    <CardTitle>Profesional</CardTitle>
                    <CardDescription>Para profesionales que buscan crecimiento acelerado</CardDescription>
                    <div className="text-3xl font-bold text-gray-900 mt-4">
                      $29
                      <span className="text-lg font-normal text-gray-500">/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Evaluaciones ilimitadas
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Coaching con IA avanzado
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Reportes detallados
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Seguimiento de progreso
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Soporte prioritario
                      </li>
                    </ul>
                    <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Elegir Profesional</Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Empresarial</CardTitle>
                    <CardDescription>Solución completa para equipos y organizaciones</CardDescription>
                    <div className="text-3xl font-bold text-gray-900 mt-4">
                      $99
                      <span className="text-lg font-normal text-gray-500">/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Todo lo del plan Profesional
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Dashboard de equipo
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Analytics avanzados
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Integraciones API
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Soporte dedicado
                      </li>
                    </ul>
                    <Button className="w-full mt-6 bg-transparent" variant="outline">
                      Contactar Ventas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para impulsar tu carrera profesional?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Únete a miles de profesionales que ya están transformando su futuro con CareerDev Pro
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Hablar con Ventas
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Brain className="h-8 w-8 text-blue-400" />
                    <span className="ml-2 text-xl font-bold">CareerDev Pro</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Plataforma líder en desarrollo profesional con inteligencia artificial.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Producto</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <a href="#" className="hover:text-white">
                        Evaluaciones
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Coaching IA
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Analytics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Integraciones
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Empresa</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <a href="#" className="hover:text-white">
                        Sobre nosotros
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Carreras
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Contacto
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Soporte</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <a href="#" className="hover:text-white">
                        Centro de ayuda
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Documentación
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Estado del servicio
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Privacidad
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; 2024 CareerDev Pro. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Auth Panel */}
        <div className="lg:w-1/3 bg-white/90 backdrop-blur-md border-l border-blue-100 p-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accede a tu cuenta</h2>
              <p className="text-gray-600">O crea una nueva cuenta para comenzar</p>
            </div>

            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
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
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {authError && (
                    <Alert>
                      <AlertDescription className="text-red-600">{authError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
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
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {authError && (
                    <Alert>
                      <AlertDescription className="text-red-600">{authError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-4">¿Necesitas ayuda?</p>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Centro de Ayuda
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contactar Soporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
