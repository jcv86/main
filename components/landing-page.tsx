"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Brain,
  FileText,
  MessageSquare,
  TrendingUp,
  Calendar,
  Lightbulb,
  CheckCircle,
  Rocket,
  ArrowRight,
  Play,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DespegaTuCarrera</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Características
              </a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900">
                Demo
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Precios
              </a>
              <Link href="/auth">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth">
                <Button>Comenzar Gratis</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900">
                  Características
                </a>
                <a href="#demo" className="text-gray-600 hover:text-gray-900">
                  Demo
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                  Precios
                </a>
                <Link href="/auth">
                  <Button variant="outline" className="w-full bg-transparent">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="w-full">Comenzar Gratis</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Despega Tu Carrera con{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              La plataforma integral de desarrollo profesional que combina tests psicométricos, generación de CV con IA,
              simulación de entrevistas y coaching personalizado 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8 py-3">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent"
                onClick={() => {
                  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas para triunfar</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una suite completa de herramientas profesionales potenciadas por IA para acelerar tu desarrollo de carrera
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Tests Psicométricos</CardTitle>
                <CardDescription>
                  DISC, Big Five, MBTI, RIASEC y evaluación de habilidades blandas con informes detallados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Generador de CV con IA</CardTitle>
                <CardDescription>
                  Crea CVs profesionales optimizados para ATS con sugerencias inteligentes y análisis de completitud
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Simulador de Entrevistas</CardTitle>
                <CardDescription>
                  Practica entrevistas con IA, recibe feedback detallado y mejora tus habilidades de comunicación
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Coach IA Personal</CardTitle>
                <CardDescription>
                  Mentor virtual disponible 24/7 con filosofías de Bill Campbell, Carol Dweck y Naval Ravikant
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Seguimiento de Progreso</CardTitle>
                <CardDescription>
                  Sistema de gamificación inteligente con XP, logros y seguimiento longitudinal de tu desarrollo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Base de Conocimiento</CardTitle>
                <CardDescription>
                  Biblioteca completa con guías de carrera, mercado laboral chileno y recursos de desarrollo profesional
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explora la Plataforma</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Navega por las diferentes secciones y descubre cómo DespegaTuCarrera puede transformar tu desarrollo
              profesional
            </p>
          </div>

          {/* Demo Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={activeDemo === "overview" ? "default" : "outline"}
              onClick={() => setActiveDemo("overview")}
            >
              Dashboard
            </Button>
            <Button variant={activeDemo === "tests" ? "default" : "outline"} onClick={() => setActiveDemo("tests")}>
              Tests
            </Button>
            <Button variant={activeDemo === "cv" ? "default" : "outline"} onClick={() => setActiveDemo("cv")}>
              CV Generator
            </Button>
            <Button
              variant={activeDemo === "interviews" ? "default" : "outline"}
              onClick={() => setActiveDemo("interviews")}
            >
              Entrevistas
            </Button>
            <Button variant={activeDemo === "coach" ? "default" : "outline"} onClick={() => setActiveDemo("coach")}>
              Coach IA
            </Button>
          </div>

          {/* Demo Content */}
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Dashboard Demo */}
                {activeDemo === "overview" && (
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">¡Bienvenido a DespegaTuCarrera! 🚀</h3>
                      <Badge variant="secondary">Demo</Badge>
                    </div>

                    {/* Progress Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Tu Progreso
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Perfil Completo</span>
                              <span>65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">3/5</div>
                              <div className="text-sm text-gray-600">Tests Completados</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">1</div>
                              <div className="text-sm text-gray-600">CV Creado</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">5</div>
                              <div className="text-sm text-gray-600">Simulaciones</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Brain className="h-5 w-5 text-blue-600" />
                            Tests Psicométricos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary">3/5 Completados</Badge>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                            Generador de CV
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline">Listo para usar</Badge>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                            Simulador
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary">5 Simulaciones</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Tests Demo */}
                {activeDemo === "tests" && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Tests Psicométricos Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Test DISC</h4>
                          <Badge variant="secondary">Completado</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Evalúa tu estilo de comportamiento y comunicación</p>
                        <Button variant="outline" size="sm" disabled>
                          Ver Resultados
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Big Five</h4>
                          <Badge variant="secondary">Completado</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Mide los cinco grandes rasgos de personalidad</p>
                        <Button variant="outline" size="sm" disabled>
                          Ver Resultados
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">RIASEC</h4>
                          <Badge>Pendiente</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Descubre tus intereses profesionales</p>
                        <Button size="sm">Comenzar Test</Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Habilidades Blandas</h4>
                          <Badge>Pendiente</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Evalúa tus competencias interpersonales</p>
                        <Button size="sm">Comenzar Test</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* CV Demo */}
                {activeDemo === "cv" && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Generador de CV Inteligente</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-800">CV Generado</span>
                        </div>
                        <p className="text-sm text-green-700">Tu CV está listo y optimizado para roles en tecnología</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Análisis de CV</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completitud</span>
                              <span className="font-semibold">95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span>Optimización ATS</span>
                              <span className="font-semibold">88%</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Sugerencias IA</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Agregar más palabras clave técnicas</li>
                            <li>• Cuantificar logros en experiencia</li>
                            <li>• Incluir certificaciones recientes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interviews Demo */}
                {activeDemo === "interviews" && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Simulador de Entrevistas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Entrevista General</h4>
                        <p className="text-sm text-gray-600 mb-3">Preguntas comunes para cualquier industria</p>
                        <Button size="sm">Iniciar Simulación</Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Entrevista Técnica</h4>
                        <p className="text-sm text-gray-600 mb-3">Enfocada en habilidades técnicas específicas</p>
                        <Button size="sm">Iniciar Simulación</Button>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Historial de Simulaciones</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-semibold">Entrevista General</div>
                              <div className="text-sm text-gray-600">Hace 2 días</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">8.5/10</div>
                              <Button variant="outline" size="sm">
                                Ver Feedback
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Coach Demo */}
                {activeDemo === "coach" && (
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Coach IA - Dani</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">Consejo del Día</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          "Recuerda que cada 'no' te acerca más al 'sí' que estás buscando. Mantén la constancia y sigue
                          mejorando tus habilidades."
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Conversación de Ejemplo</h4>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <strong>Tú:</strong> ¿Cómo puedo mejorar mi CV para roles de data analyst?
                          </div>
                          <div className="p-2 bg-blue-50 rounded text-sm">
                            <strong>Dani:</strong> Te sugiero enfocarte en proyectos que muestren tu capacidad
                            analítica. Incluye métricas específicas como "Analicé datasets de 10M+ registros" o "Mejoré
                            eficiencia en 25%". También agrega herramientas como Python, SQL, Tableau...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/auth">
              <Button size="lg">
                Acceder a la Plataforma Completa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planes para cada etapa de tu carrera</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comienza gratis y escala según tus necesidades profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Gratuito</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>Perfecto para comenzar tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />3 tests psicométricos básicos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Generador de CV básico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />5 simulaciones de entrevista
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Coach IA con límites
                  </li>
                </ul>
                <Link href="/auth" className="block mt-6">
                  <Button className="w-full">Comenzar Gratis</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border-blue-500 border-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600">Más Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="text-3xl font-bold">$19/mes</div>
                <CardDescription>Para profesionales que buscan acelerar su carrera</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Todos los tests psicométricos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    CV con optimización ATS avanzada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Simulaciones ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Coach IA ilimitado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Integración con LinkedIn
                  </li>
                </ul>
                <Link href="/auth" className="block mt-6">
                  <Button className="w-full">Comenzar Premium</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Empresarial</CardTitle>
                <div className="text-3xl font-bold">Personalizado</div>
                <CardDescription>Para universidades y empresas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Licencias múltiples
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Dashboard administrativo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Reportes y analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Soporte prioritario
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6 bg-transparent">
                  Contactar Ventas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Listo para despegar tu carrera?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a miles de profesionales que ya están transformando su desarrollo de carrera con IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8 py-3">
                  Comenzar Gratis Ahora
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Agendar Demo
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="h-6 w-6" />
                <span className="text-lg font-bold">DespegaTuCarrera</span>
              </div>
              <p className="text-gray-400">La plataforma de desarrollo profesional más avanzada de Latinoamérica</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Características</li>
                <li>Precios</li>
                <li>Demo</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre nosotros</li>
                <li>Blog</li>
                <li>Carreras</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de ayuda</li>
                <li>Documentación</li>
                <li>Estado del servicio</li>
                <li>Comunidad</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DespegaTuCarrera. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
