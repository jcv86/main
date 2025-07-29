"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Brain, FileText, Users, TrendingUp, BookOpen, Target, ArrowRight, Star, Award } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const features = [
    {
      icon: Brain,
      title: "Evaluación de Personalidad",
      description: "Descubre tu tipo de personalidad con tests científicamente validados",
      href: "/personality-test",
      badge: "MBTI & Big Five",
    },
    {
      icon: Target,
      title: "Habilidades Blandas",
      description: "Evalúa y mejora tus habilidades interpersonales y de liderazgo",
      href: "/soft-skills-test",
      badge: "Adaptativo",
    },
    {
      icon: FileText,
      title: "Constructor de CV",
      description: "Crea CVs profesionales optimizados para ATS con IA",
      href: "/cv-builder",
      badge: "IA Integrada",
    },
    {
      icon: Users,
      title: "Simulador de Entrevistas",
      description: "Practica entrevistas con feedback personalizado",
      href: "/interview-simulator",
      badge: "Tiempo Real",
    },
    {
      icon: BookOpen,
      title: "Biblioteca Personalizada",
      description: "Recursos de desarrollo profesional curados para ti",
      href: "/library",
      badge: "Personalizado",
    },
    {
      icon: TrendingUp,
      title: "Búsqueda de Empleos",
      description: "Encuentra oportunidades laborales en Chile",
      href: "/job-search",
      badge: "Chile",
    },
    {
      icon: Award,
      title: "Coaching Profesional",
      description: "Recibe orientación personalizada para tu carrera",
      href: "/career-coach",
      badge: "Personalizado",
    },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Ingeniera de Software",
      content: "La plataforma me ayudó a identificar mis fortalezas y conseguir mi trabajo ideal en tech.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Gerente de Marketing",
      content: "El constructor de CV con IA es increíble. Mi CV ahora pasa todos los filtros ATS.",
      rating: 5,
    },
    {
      name: "Ana Silva",
      role: "Consultora",
      content: "Los tests de personalidad me dieron insights valiosos sobre mi estilo de trabajo.",
      rating: 5,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Plataforma de Desarrollo Profesional
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Impulsa tu Carrera Profesional
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubre tus fortalezas, desarrolla habilidades clave y encuentra el trabajo de tus sueños con nuestra
            plataforma integral de desarrollo profesional.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Ir al Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/skills-assessment">Evaluar Habilidades</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Comenzar Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Herramientas Profesionales</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para acelerar tu desarrollo profesional en una sola plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    asChild
                  >
                    <Link href={feature.href}>
                      Explorar <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Usuarios Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Tasa de Éxito</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Empresas Partner</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Soporte IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-xl text-muted-foreground">
              Historias reales de profesionales que transformaron sus carreras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para impulsar tu carrera?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están transformando sus carreras con nuestra plataforma
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">
                  Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/demo">Ver Demo</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 bg-primary rounded" />
                <span className="font-bold">Career Platform</span>
              </div>
              <p className="text-muted-foreground">
                Transformando carreras profesionales a través de la tecnología y la inteligencia artificial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Herramientas</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/personality-test" className="hover:text-foreground">
                    Tests de Personalidad
                  </Link>
                </li>
                <li>
                  <Link href="/skills-assessment" className="hover:text-foreground">
                    Evaluación de Habilidades
                  </Link>
                </li>
                <li>
                  <Link href="/cv-builder" className="hover:text-foreground">
                    Constructor de CV
                  </Link>
                </li>
                <li>
                  <Link href="/interview-simulator" className="hover:text-foreground">
                    Simulador de Entrevistas
                  </Link>
                </li>
                <li>
                  <Link href="/career-coach" className="hover:text-foreground">
                    Coaching Profesional
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/library" className="hover:text-foreground">
                    Biblioteca
                  </Link>
                </li>
                <li>
                  <Link href="/job-search" className="hover:text-foreground">
                    Búsqueda de Empleos
                  </Link>
                </li>
                <li>
                  <Link href="/career-coach" className="hover:text-foreground">
                    Coach de Carrera
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Career Development Platform. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
