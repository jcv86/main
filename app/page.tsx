import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  MessageSquare,
  FileText,
  Search,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Users,
  Award,
  Star,
  Zap,
  Shield,
  Globe,
  User,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      title: "AI Career Coach",
      description:
        "Tu mentor personal de carrera con inteligencia artificial que te guía en cada paso de tu desarrollo profesional.",
      icon: <MessageSquare className="h-8 w-8" />,
      href: "/career-coach",
      badge: "NUEVO",
      color: "bg-blue-500",
    },
    {
      title: "CV Builder Inteligente",
      description:
        "Crea currículums profesionales optimizados para ATS con plantillas modernas y consejos personalizados.",
      icon: <FileText className="h-8 w-8" />,
      href: "/cv-builder",
      color: "bg-green-500",
    },
    {
      title: "Búsqueda de Empleo",
      description:
        "Encuentra oportunidades laborales perfectas para tu perfil con nuestro motor de búsqueda inteligente.",
      icon: <Search className="h-8 w-8" />,
      href: "/job-search",
      color: "bg-purple-500",
    },
    {
      title: "Evaluaciones de Habilidades",
      description: "Descubre tus fortalezas y áreas de mejora con evaluaciones técnicas y de personalidad.",
      icon: <Brain className="h-8 w-8" />,
      href: "/skills-assessment",
      color: "bg-orange-500",
    },
    {
      title: "Biblioteca de Recursos",
      description: "Accede a libros, cursos y recursos curados para acelerar tu crecimiento profesional.",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/library",
      color: "bg-indigo-500",
    },
    {
      title: "Análisis de Mercado",
      description: "Obtén insights del mercado laboral chileno con datos actualizados y tendencias salariales.",
      icon: <TrendingUp className="h-8 w-8" />,
      href: "/job-search",
      color: "bg-red-500",
    },
  ]

  const stats = [
    { label: "Usuarios Activos", value: "10,000+", icon: <Users className="h-5 w-5" /> },
    { label: "CVs Creados", value: "25,000+", icon: <FileText className="h-5 w-5" /> },
    { label: "Empleos Encontrados", value: "5,000+", icon: <Target className="h-5 w-5" /> },
    { label: "Tasa de Éxito", value: "85%", icon: <Award className="h-5 w-5" /> },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Data Scientist",
      company: "Fintual",
      content: "El AI Coach me ayudó a enfocar mi carrera hacia Data Science. En 3 meses conseguí mi trabajo ideal.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Frontend Developer",
      company: "NotCo",
      content: "Las evaluaciones de habilidades me mostraron exactamente qué necesitaba mejorar. Increíble plataforma.",
      rating: 5,
    },
    {
      name: "Ana Silva",
      role: "Product Manager",
      company: "Buk",
      content: "El CV Builder creó un currículum que realmente destacó. Recibí 3 ofertas en 2 semanas.",
      rating: 5,
    },
  ]

  const benefits = [
    {
      title: "Personalización Completa",
      description: "Cada recomendación se adapta a tu perfil único y objetivos profesionales.",
      icon: <Target className="h-6 w-6" />,
    },
    {
      title: "Tecnología de Vanguardia",
      description: "Utilizamos IA avanzada para brindarte la mejor experiencia de desarrollo profesional.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Datos Seguros",
      description: "Tu información está protegida con los más altos estándares de seguridad.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Mercado Chileno",
      description: "Especializado en el mercado laboral chileno con datos actualizados constantemente.",
      icon: <Globe className="h-6 w-6" />,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-4 w-4 mr-1" />
            Plataforma #1 en Desarrollo de Carrera
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Acelera tu Carrera Profesional con IA
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            La plataforma integral que combina inteligencia artificial, evaluaciones personalizadas y recursos curados
            para impulsar tu desarrollo profesional en el mercado chileno.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/career-coach">
                <MessageSquare className="h-5 w-5 mr-2" />
                Habla con tu Coach IA
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
              <Link href="/dashboard">Ver Dashboard</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para tu carrera</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas integradas y potenciadas por IA para cada etapa de tu desarrollo profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${feature.color} text-white`}>{feature.icon}</div>
                    {feature.badge && <Badge variant="secondary">{feature.badge}</Badge>}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link href={feature.href}>
                      Explorar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir DTC?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Características que nos hacen la mejor opción para tu desarrollo profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-background rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">{benefit.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Historias reales de profesionales que transformaron su carrera con DTC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} en {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para transformar tu carrera?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de profesionales que ya están acelerando su crecimiento con DTC
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/career-coach">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comenzar Ahora
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/dashboard">Ver Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
