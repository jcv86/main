"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Play,
  Zap,
  Shield,
  BookOpen,
  MessageSquare,
  BarChart3,
  Heart,
  Palette,
  Compass,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function LandingPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const handleDemoAccess = async () => {
    setIsDemoLoading(true)
    setError("")

    try {
      // Create demo session
      const demoSession = {
        authenticated: true,
        user: {
          id: "demo-user-12345",
          email: "demo@despegaturcarrera.com",
          name: "Usuario Demo",
          role: "demo",
        },
      }

      // Store in localStorage
      localStorage.setItem("dtc_session", JSON.stringify(demoSession))

      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Demo access error:", err)
      setError("Error al acceder al demo. Por favor intenta nuevamente.")
    } finally {
      setIsDemoLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        if (data.user) {
          const session = {
            authenticated: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || "Usuario",
            },
          }
          localStorage.setItem("dtc_session", JSON.stringify(session))
          router.push("/dashboard")
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          const session = {
            authenticated: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              name: formData.name,
            },
          }
          localStorage.setItem("dtc_session", JSON.stringify(session))
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      setError(err.message || "Error en la autenticación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleTestNavigation = (testId: string) => {
    router.push(`/test/${testId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DespegaTuCarrera
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Características
              </a>
              <a href="#tests" className="text-gray-600 hover:text-blue-600 transition-colors">
                Tests
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Precios
              </a>
              <Button variant="outline" size="sm" onClick={handleDemoAccess} disabled={isDemoLoading}>
                {isDemoLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Demo Gratuito"
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Plataforma de IA para Desarrollo Profesional
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Descubre tu{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    potencial profesional
                  </span>{" "}
                  con IA
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Evaluaciones psicométricas avanzadas, coaching personalizado con IA y recomendaciones de carrera
                  basadas en ciencia para impulsar tu crecimiento profesional.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                  onClick={handleDemoAccess}
                  disabled={isDemoLoading}
                >
                  {isDemoLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Cargando Demo...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Acceso Demo Gratuito
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Ver Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />6 Tests Psicométricos
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Coach IA Personalizado
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Análisis Científico
                </div>
              </div>
            </div>

            {/* Right Column - Auth Panel */}
            <div className="lg:pl-8">
              <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Comienza Ahora</CardTitle>
                  <CardDescription>Accede a tu plataforma de desarrollo profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                      <TabsTrigger value="signup">Registrarse</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4">
                      <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="tu@email.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="pl-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Iniciando...
                            </>
                          ) : (
                            "Iniciar Sesión"
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre Completo</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Tu nombre"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="tu@email.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="pl-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Registrando...
                            </>
                          ) : (
                            "Crear Cuenta"
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:from-green-100 hover:to-blue-100"
                      onClick={handleDemoAccess}
                      disabled={isDemoLoading}
                    >
                      {isDemoLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600" />
                          <span className="text-green-700 font-medium">Cargando Demo...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-green-700 font-medium">Probar Demo Sin Registro</span>
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Acceso completo a todas las funciones • Sin compromiso
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Características Principales
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Todo lo que necesitas para <span className="text-blue-600">impulsar tu carrera</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas científicamente validadas y tecnología de IA para un desarrollo profesional integral
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Coach IA Personalizado",
                description:
                  "Asistente inteligente que analiza tu perfil y proporciona recomendaciones específicas para tu crecimiento profesional.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: Target,
                title: "Tests Psicométricos Avanzados",
                description:
                  "6 evaluaciones científicamente validadas: DISC, Big Five, MBTI, RIASEC, Habilidades Blandas e Inteligencia Emocional.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: BarChart3,
                title: "Análisis Predictivo",
                description:
                  "Algoritmos de IA que predicen tu compatibilidad con diferentes roles y trayectorias profesionales.",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Users,
                title: "Recomendaciones de Carrera",
                description:
                  "Sugerencias personalizadas de roles, industrias y paths de crecimiento basadas en tu perfil único.",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
              },
              {
                icon: TrendingUp,
                title: "Planes de Desarrollo",
                description:
                  "Roadmaps detallados con objetivos, recursos y métricas para acelerar tu crecimiento profesional.",
                color: "text-red-600",
                bgColor: "bg-red-50",
              },
              {
                icon: Shield,
                title: "Datos Seguros y Privados",
                description:
                  "Encriptación de nivel empresarial y cumplimiento GDPR para proteger tu información personal.",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section id="tests" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Evaluaciones Disponibles
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tests Psicométricos <span className="text-blue-600">Científicamente Validados</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evaluaciones completas que analizan diferentes aspectos de tu personalidad y preferencias profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                name: "DISC Assessment",
                description: "Evalúa tu estilo de comportamiento y comunicación en 4 dimensiones principales",
                duration: "10-15 min",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                testId: "disc",
                available: true,
              },
              {
                icon: Brain,
                name: "Big Five",
                description: "Analiza los cinco grandes factores de personalidad reconocidos científicamente",
                duration: "15-20 min",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
                testId: "big-five",
                available: true,
              },
              {
                icon: Palette,
                name: "MBTI",
                description: "Identifica tu tipo de personalidad Myers-Briggs y preferencias cognitivas",
                duration: "20-25 min",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                testId: "mbti",
                available: true,
              },
              {
                icon: Compass,
                name: "RIASEC",
                description: "Descubre tus intereses vocacionales y carreras más compatibles",
                duration: "15-20 min",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
                borderColor: "border-orange-200",
                testId: "riasec",
                available: true,
              },
              {
                icon: MessageSquare,
                name: "Habilidades Blandas",
                description: "Evalúa competencias interpersonales y profesionales clave",
                duration: "20-30 min",
                color: "text-pink-600",
                bgColor: "bg-pink-50",
                borderColor: "border-pink-200",
                testId: "soft-skills",
                available: true,
              },
              {
                icon: Heart,
                name: "Inteligencia Emocional",
                description: "Evaluación completa de competencias emocionales y manejo de emociones",
                duration: "20-25 min",
                color: "text-red-600",
                bgColor: "bg-red-50",
                borderColor: "border-red-200",
                testId: "emotional-intelligence",
                available: true,
              },
            ].map((test, index) => (
              <Card
                key={index}
                className={`${test.borderColor} border-2 hover:shadow-lg transition-shadow ${!test.available ? "opacity-60" : ""}`}
              >
                <CardHeader className={test.bgColor}>
                  <div className="flex items-center justify-between">
                    <test.icon className={`h-8 w-8 ${test.color}`} />
                    {!test.available && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Próximamente
                      </Badge>
                    )}
                    {test.available && <Badge className="bg-green-100 text-green-800">Disponible</Badge>}
                  </div>
                  <CardTitle className="text-xl">{test.name}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium">{test.duration}</span>
                  </div>
                  <Button
                    className="w-full"
                    variant={!test.available ? "outline" : "default"}
                    disabled={!test.available}
                    onClick={test.available ? () => handleTestNavigation(test.testId) : undefined}
                  >
                    {!test.available ? "Próximamente" : "Comenzar Test"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Testimonios
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Lo que dicen nuestros <span className="text-blue-600">usuarios</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: "Product Manager",
                company: "TechCorp",
                content:
                  "Los insights del coach IA me ayudaron a identificar mis fortalezas y conseguir una promoción en 6 meses.",
                rating: 5,
              },
              {
                name: "Carlos Rodríguez",
                role: "Desarrollador Senior",
                company: "StartupXYZ",
                content:
                  "Las recomendaciones de carrera fueron precisas. Cambié a un rol que se alinea perfectamente con mi personalidad.",
                rating: 5,
              },
              {
                name: "Ana Martínez",
                role: "Consultora",
                company: "Freelance",
                content:
                  "La plataforma me dio claridad sobre mi path profesional. Los tests son muy completos y precisos.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} en {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Planes y Precios
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Elige el plan que <span className="text-blue-600">mejor se adapte</span> a ti
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde acceso básico hasta coaching personalizado premium
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Básico",
                price: "Gratis",
                period: "siempre",
                description: "Perfecto para comenzar tu desarrollo profesional",
                features: [
                  "3 tests psicométricos",
                  "Análisis básico de resultados",
                  "Recomendaciones generales",
                  "Acceso a recursos básicos",
                ],
                cta: "Comenzar Gratis",
                popular: false,
              },
              {
                name: "Profesional",
                price: "$29",
                period: "mes",
                description: "Para profesionales que buscan crecimiento acelerado",
                features: [
                  "Todos los tests psicométricos",
                  "Coach IA personalizado",
                  "Análisis predictivo avanzado",
                  "Planes de desarrollo detallados",
                  "Seguimiento de progreso",
                  "Soporte prioritario",
                ],
                cta: "Comenzar Prueba",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Personalizado",
                period: "",
                description: "Para equipos y organizaciones",
                features: [
                  "Todo lo del plan Profesional",
                  "Dashboard para equipos",
                  "Análisis organizacional",
                  "Integración con HRIS",
                  "Coaching grupal",
                  "Soporte dedicado",
                ],
                cta: "Contactar Ventas",
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`border-2 ${plan.popular ? "border-blue-500 shadow-xl" : "border-gray-200"} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Más Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">/{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleDemoAccess}
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿Listo para impulsar tu carrera profesional?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de profesionales que ya están acelerando su crecimiento con IA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8"
              onClick={handleDemoAccess}
              disabled={isDemoLoading}
            >
              {isDemoLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Cargando Demo...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Comenzar Demo Gratuito
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 bg-transparent"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Hablar con Ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">DespegaTuCarrera</span>
              </div>
              <p className="text-gray-400">Plataforma de IA para desarrollo profesional y coaching personalizado.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tests Psicométricos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Coach IA
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Análisis Predictivo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Planes de Desarrollo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Estado del Sistema
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 DespegaTuCarrera. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
