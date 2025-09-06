"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  Target,
  Users,
  Award,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  BookOpen,
  MessageCircle,
  Clock,
  Globe,
  ChevronRight,
} from "lucide-react"

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [error, setError] = useState("")

  const { signIn, signUp, demoLogin } = useSession()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let result
      if (authMode === "login") {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, formData.name)
      }

      if (result.success) {
        toast({
          title: "¡Bienvenido!",
          description: authMode === "login" ? "Has iniciado sesión correctamente" : "Cuenta creada exitosamente",
        })
        window.location.href = "/dashboard"
      } else {
        setError(result.error || "Error en la autenticación")
      }
    } catch (error) {
      setError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoAccess = async () => {
    setIsLoading(true)
    try {
      await demoLogin()
      toast({
        title: "¡Acceso Demo Activado!",
        description: "Explora todas las funcionalidades de la plataforma",
      })
      window.location.href = "/dashboard"
    } catch (error) {
      setError("Error al acceder al demo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DTC Platform
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Características
                </a>
                <a
                  href="#tests"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Evaluaciones
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Precios
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Testimonios
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600 p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Características
              </a>
              <a href="#tests" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Evaluaciones
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Precios
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Testimonios
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Plataforma de Desarrollo Profesional
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Descubre tu{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  potencial profesional
                </span>{" "}
                con IA
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Evaluaciones psicométricas avanzadas, análisis de soft skills con inteligencia artificial y coaching
                personalizado para impulsar tu crecimiento profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleDemoAccess}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cargando...
                    </div>
                  ) : (
                    <>
                      <User className="h-5 w-5 mr-2" />
                      Acceso Demo
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300 bg-transparent"
                  onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Crear Cuenta
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">5+</div>
                  <div className="text-sm text-gray-600">Evaluaciones</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">AI</div>
                  <div className="text-sm text-gray-600">Powered</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Disponible</div>
                </div>
              </div>
            </div>

            {/* Right Column - Auth Panel */}
            <div className="lg:pl-8">
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {authMode === "login"
                      ? "Accede a tu plataforma de desarrollo profesional"
                      : "Únete a nuestra plataforma de desarrollo profesional"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Nombre completo
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required={authMode === "signup"}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {authMode === "login" ? "Iniciando..." : "Creando..."}
                        </div>
                      ) : authMode === "login" ? (
                        "Iniciar Sesión"
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>
                  </form>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setAuthMode(authMode === "login" ? "signup" : "login")
                        setError("")
                        setFormData({ email: "", password: "", name: "" })
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {authMode === "login" ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Iniciar sesión"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              <Zap className="h-3 w-3 mr-1" />
              Características Principales
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                desarrollo profesional
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma integral que combina evaluaciones científicas, inteligencia artificial y coaching
              personalizado para acelerar tu crecimiento profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Evaluaciones Psicométricas",
                description:
                  "Tests científicamente validados: DISC, Big Five, MBTI, RIASEC y más para conocer tu perfil completo.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: MessageCircle,
                title: "Análisis de Soft Skills con IA",
                description:
                  "Evaluación avanzada de habilidades blandas usando inteligencia artificial para insights precisos.",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Target,
                title: "Coaching Personalizado",
                description: "Recomendaciones específicas y planes de desarrollo adaptados a tu perfil único.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: BarChart3,
                title: "Dashboard Inteligente",
                description: "Visualiza tu progreso, fortalezas y áreas de mejora con gráficos interactivos.",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
              },
              {
                icon: BookOpen,
                title: "Biblioteca de Recursos",
                description: "Acceso a contenido especializado, guías y recursos para tu desarrollo continuo.",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
              },
              {
                icon: Shield,
                title: "Privacidad y Seguridad",
                description: "Tus datos están protegidos con los más altos estándares de seguridad y privacidad.",
                color: "text-red-600",
                bgColor: "bg-red-50",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section id="tests" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Award className="h-3 w-3 mr-1" />
              Evaluaciones Disponibles
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Evaluaciones{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                científicamente validadas
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre tu perfil profesional completo con nuestras evaluaciones especializadas, cada una diseñada para
              revelar aspectos únicos de tu personalidad y potencial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "DISC Assessment",
                description: "Evalúa tu estilo de comportamiento y comunicación en el entorno laboral.",
                duration: "10-15 min",
                insights: ["Estilo de liderazgo", "Comunicación", "Trabajo en equipo"],
                color: "blue",
                icon: Target,
              },
              {
                name: "Big Five",
                description: "Analiza los cinco grandes factores de personalidad reconocidos científicamente.",
                duration: "15-20 min",
                insights: ["Apertura", "Responsabilidad", "Extraversión"],
                color: "purple",
                icon: Brain,
              },
              {
                name: "MBTI",
                description: "Descubre tu tipo de personalidad Myers-Briggs y preferencias cognitivas.",
                duration: "20-25 min",
                insights: ["Procesamiento", "Decisiones", "Energía"],
                color: "green",
                icon: Users,
              },
              {
                name: "RIASEC",
                description: "Identifica tus intereses profesionales y carreras más compatibles.",
                duration: "15-20 min",
                insights: ["Intereses vocacionales", "Carreras afines", "Ambiente laboral"],
                color: "orange",
                icon: TrendingUp,
              },
              {
                name: "Soft Skills con IA",
                description: "Evaluación avanzada de habilidades blandas usando inteligencia artificial.",
                duration: "20-30 min",
                insights: ["Comunicación", "Liderazgo", "Adaptabilidad"],
                color: "pink",
                icon: MessageCircle,
              },
              {
                name: "Evaluación 360°",
                description: "Feedback completo de supervisores, pares y subordinados.",
                duration: "Próximamente",
                insights: ["Feedback integral", "Puntos ciegos", "Desarrollo"],
                color: "gray",
                icon: Globe,
                comingSoon: true,
              },
            ].map((test, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow duration-300 border-0 shadow-lg ${test.comingSoon ? "opacity-75" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-${test.color}-50 w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <test.icon className={`h-6 w-6 text-${test.color}-600`} />
                    </div>
                    {test.comingSoon && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Próximamente
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{test.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.duration}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Insights que obtienes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {test.insights.map((insight, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {!test.comingSoon && (
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => (window.location.href = `/test/${test.name.toLowerCase().replace(/\s+/g, "-")}`)}
                    >
                      Comenzar Evaluación
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Star className="h-3 w-3 mr-1" />
              Testimonios
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                usuarios
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales de todo el mundo han transformado sus carreras con nuestra plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: "Product Manager",
                company: "TechCorp",
                content:
                  "Las evaluaciones me ayudaron a entender mis fortalezas y debilidades. Ahora lidero mi equipo con más confianza.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60&text=MG",
              },
              {
                name: "Carlos Rodríguez",
                role: "Desarrollador Senior",
                company: "StartupXYZ",
                content:
                  "El análisis de soft skills con IA fue increíblemente preciso. Me dio insights que nunca había considerado.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60&text=CR",
              },
              {
                name: "Ana Martínez",
                role: "HR Director",
                company: "GlobalInc",
                content:
                  "Implementamos la plataforma para todo nuestro equipo. Los resultados en desarrollo profesional son evidentes.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60&text=AM",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.content}"</p>

                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} en {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              Planes y Precios
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Elige el plan perfecto para{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                tu desarrollo
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Opciones flexibles para individuos, equipos y organizaciones que buscan acelerar su crecimiento
              profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Individual",
                price: "29",
                period: "mes",
                description: "Perfect para profesionales que buscan desarrollo personal",
                features: [
                  "5 evaluaciones psicométricas",
                  "Análisis de soft skills con IA",
                  "Dashboard personalizado",
                  "Recomendaciones básicas",
                  "Soporte por email",
                ],
                popular: false,
                cta: "Comenzar Prueba Gratuita",
              },
              {
                name: "Profesional",
                price: "79",
                period: "mes",
                description: "Ideal para profesionales avanzados y líderes de equipo",
                features: [
                  "Todas las evaluaciones disponibles",
                  "Coaching personalizado con IA",
                  "Análisis comparativo",
                  "Planes de desarrollo detallados",
                  "Soporte prioritario",
                  "Sesiones de coaching 1:1",
                ],
                popular: true,
                cta: "Más Popular",
              },
              {
                name: "Empresarial",
                price: "Personalizado",
                period: "",
                description: "Soluciones completas para equipos y organizaciones",
                features: [
                  "Evaluaciones ilimitadas",
                  "Dashboard de equipo",
                  "Análisis organizacional",
                  "Integración con HRIS",
                  "Soporte dedicado",
                  "Consultoría especializada",
                ],
                popular: false,
                cta: "Contactar Ventas",
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow duration-300 border-0 shadow-lg relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Más Popular</Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>

                    <div className="mb-4">
                      {plan.price === "Personalizado" ? (
                        <div className="text-3xl font-bold text-gray-900">Personalizado</div>
                      ) : (
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                          <span className="text-gray-600 ml-1">/{plan.period}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"}`}
                    onClick={() => {
                      if (plan.name === "Empresarial") {
                        window.location.href = "mailto:ventas@dtcplatform.com"
                      } else {
                        document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="auth-section" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿Listo para transformar tu carrera profesional?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de profesionales que ya han descubierto su potencial con nuestra plataforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleDemoAccess}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Cargando...
                </div>
              ) : (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Probar Demo Gratuito
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold transition-all duration-300 bg-transparent"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Crear Cuenta Completa
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <div className="mt-8 text-blue-100">
            <p className="text-sm">✓ Sin compromiso • ✓ Acceso inmediato • ✓ Todas las funcionalidades</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">DTC Platform</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Plataforma líder en desarrollo profesional que combina evaluaciones científicas, inteligencia artificial
                y coaching personalizado.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#tests" className="text-gray-400 hover:text-white transition-colors">
                    Evaluaciones
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Estado del Sistema
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 DTC Platform. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
