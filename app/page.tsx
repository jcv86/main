"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  MessageSquare,
  Search,
  FileText,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const features = [
    {
      icon: Brain,
      title: "Test de Personalidad",
      description: "Descubre tu perfil profesional con evaluaciones científicamente validadas",
      href: "/personality-test",
      color: "bg-blue-500",
    },
    {
      icon: Target,
      title: "Evaluación de Habilidades",
      description: "Identifica tus fortalezas y áreas de mejora profesional",
      href: "/skills-assessment",
      color: "bg-green-500",
    },
    {
      icon: MessageSquare,
      title: "Coach Profesional IA",
      description: "Recibe orientación personalizada para tu desarrollo profesional",
      href: "/career-coach",
      color: "bg-purple-500",
    },
    {
      icon: Search,
      title: "Búsqueda de Empleo",
      description: "Encuentra oportunidades laborales adaptadas a tu perfil",
      href: "/job-search",
      color: "bg-orange-500",
    },
    {
      icon: FileText,
      title: "Constructor de CV",
      description: "Crea currículums profesionales con plantillas optimizadas",
      href: "/cv-builder",
      color: "bg-red-500",
    },
    {
      icon: BookOpen,
      title: "Biblioteca de Recursos",
      description: "Accede a libros y materiales para tu crecimiento profesional",
      href: "/library",
      color: "bg-indigo-500",
    },
  ]

  const stats = [
    { label: "Usuarios Activos", value: "10,000+", icon: Users },
    { label: "Empleos Encontrados", value: "2,500+", icon: TrendingUp },
    { label: "Tests Completados", value: "15,000+", icon: CheckCircle },
  ]

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />
              <span className="text-xl font-bold text-gray-900">Desarrollo Profesional</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Registrarse Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Plataforma Líder en Chile
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Impulsa tu{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Carrera Profesional
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plataforma integral que te ayuda a descubrir tu potencial, desarrollar tus habilidades y encontrar las
            mejores oportunidades laborales en Chile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para crecer profesionalmente
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas científicamente validadas y recursos especializados para el mercado laboral chileno
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="group-hover:bg-gray-50 w-full justify-between" asChild>
                      <Link href={feature.href}>
                        Explorar
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para transformar tu carrera?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están creciendo con nuestra plataforma
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">
              Crear Cuenta Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />
                <span className="text-xl font-bold">Desarrollo Profesional</span>
              </div>
              <p className="text-gray-400">Tu plataforma integral para el crecimiento profesional en Chile.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Herramientas</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/personality-test" className="hover:text-white">
                    Test de Personalidad
                  </Link>
                </li>
                <li>
                  <Link href="/skills-assessment" className="hover:text-white">
                    Evaluación de Habilidades
                  </Link>
                </li>
                <li>
                  <Link href="/cv-builder" className="hover:text-white">
                    Constructor de CV
                  </Link>
                </li>
                <li>
                  <Link href="/job-search" className="hover:text-white">
                    Búsqueda de Empleo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/library" className="hover:text-white">
                    Biblioteca
                  </Link>
                </li>
                <li>
                  <Link href="/career-coach" className="hover:text-white">
                    Coach Profesional
                  </Link>
                </li>
                <li>
                  <Link href="/calendar" className="hover:text-white">
                    Calendario
                  </Link>
                </li>
                <li>
                  <Link href="/goals" className="hover:text-white">
                    Metas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cuenta</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-white">
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white">
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-white">
                    Configuración
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Desarrollo Profesional. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
