"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  MessageSquare,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function LandingPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: Brain,
      title: "Insights Impulsados por IA",
      description:
        "Obtén recomendaciones profesionales personalizadas basadas en análisis avanzado de IA de tus resultados de evaluación.",
    },
    {
      icon: Target,
      title: "Evaluaciones Profesionales",
      description:
        "Realiza evaluaciones respaldadas científicamente incluyendo DISC, Big Five, MBTI y evaluaciones de intereses profesionales.",
    },
    {
      icon: BookOpen,
      title: "Biblioteca de Aprendizaje",
      description: "Accede a libros curados, cursos y recursos adaptados a tus necesidades de desarrollo profesional.",
    },
    {
      icon: MessageSquare,
      title: "Coach de IA Interactivo",
      description:
        "Chatea con tu coach profesional de IA personal para orientación, consejos y planes de desarrollo accionables.",
    },
    {
      icon: BarChart3,
      title: "Seguimiento de Progreso",
      description: "Monitorea tu crecimiento con análisis detallados e informes de progreso en todas las evaluaciones.",
    },
    {
      icon: Users,
      title: "Red Profesional",
      description: "Conecta con profesionales afines y construye relaciones profesionales significativas.",
    },
  ]

  const assessmentTypes = [
    {
      name: "Evaluación DISC",
      description: "Análisis de estilo de comportamiento",
      icon: Users,
      duration: "10 min",
    },
    {
      name: "Personalidad Big Five",
      description: "Evaluación integral de personalidad",
      icon: Star,
      duration: "15 min",
    },
    {
      name: "Indicador de Tipo MBTI",
      description: "Mapeo de preferencias psicológicas",
      icon: Brain,
      duration: "12 min",
    },
    {
      name: "Intereses Profesionales (RIASEC)",
      description: "Evaluación de intereses vocacionales",
      icon: Target,
      duration: "8 min",
    },
    {
      name: "Inteligencia Emocional",
      description: "Evaluación de habilidades de IE",
      icon: Award,
      duration: "10 min",
    },
    {
      name: "Evaluación de Habilidades Blandas",
      description: "Análisis de habilidades profesionales",
      icon: TrendingUp,
      duration: "12 min",
    },
  ]

  const benefits = [
    "Coaching profesional personalizado con IA",
    "Evaluaciones respaldadas científicamente",
    "Biblioteca integral de aprendizaje",
    "Seguimiento de progreso y análisis",
    "Planes de desarrollo profesional",
    "Soporte y orientación de IA 24/7",
  ]

  const stats = [
    { number: "10,000+", label: "Profesionales Atendidos" },
    { number: "95%", label: "Satisfacción del Usuario" },
    { number: "6", label: "Tipos de Evaluación" },
    { number: "24/7", label: "Soporte de IA" },
  ]

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  const handleTryAICoach = () => {
    router.push("/ai-coach")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground">CareerDev Pro</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground hover:text-foreground/80 transition-colors">
                Características
              </a>
              <a href="#assessments" className="text-foreground hover:text-foreground/80 transition-colors">
                Evaluaciones
              </a>
              <a href="#about" className="text-foreground hover:text-foreground/80 transition-colors">
                Acerca de
              </a>
              <Button
                variant="outline"
                onClick={handleTryAICoach}
                className="border-border hover:bg-muted bg-transparent"
              >
                Probar Coach IA
              </Button>
              <Button onClick={handleGetStarted} className="bg-foreground text-background hover:bg-foreground/90">
                Comenzar
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden border-border bg-transparent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-foreground hover:text-foreground/80 transition-colors">
                  Características
                </a>
                <a href="#assessments" className="text-foreground hover:text-foreground/80 transition-colors">
                  Evaluaciones
                </a>
                <a href="#about" className="text-foreground hover:text-foreground/80 transition-colors">
                  Acerca de
                </a>
                <Button
                  variant="outline"
                  onClick={handleTryAICoach}
                  className="border-border hover:bg-muted w-full bg-transparent"
                >
                  Probar Coach IA
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-foreground text-background hover:bg-foreground/90 w-full"
                >
                  Comenzar
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-muted text-mutedForeground">
              <Zap className="h-3 w-3 mr-1" />
              Desarrollo Profesional Impulsado por IA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Desbloquea Tu Potencial Profesional con <span className="text-foreground">Orientación de IA</span>
            </h1>
            <p className="text-xl text-mutedForeground mb-8 leading-relaxed">
              Realiza evaluaciones respaldadas científicamente, obtén coaching personalizado de IA y accede a recursos
              de aprendizaje curados para acelerar tu crecimiento profesional y alcanzar tus metas profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6"
              >
                Comienza Tu Viaje
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleTryAICoach}
                className="border-border hover:bg-muted text-lg px-8 py-6 bg-transparent"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Probar Coach IA Gratis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-mutedForeground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Todo Lo Que Necesitas Para El Éxito Profesional
            </h2>
            <p className="text-xl text-mutedForeground max-w-2xl mx-auto">
              Nuestra plataforma integral combina tecnología de IA con metodologías probadas de desarrollo profesional
              para brindarte orientación personalizada e insights accionables.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-mutedForeground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Types Section */}
      <section id="assessments" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Evaluaciones Profesionales Integrales
            </h2>
            <p className="text-xl text-mutedForeground max-w-2xl mx-auto">
              Realiza evaluaciones validadas científicamente para obtener insights profundos sobre tu personalidad,
              habilidades y preferencias profesionales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTypes.map((assessment, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <assessment.icon className="h-8 w-8 text-foreground" />
                    <Badge variant="secondary" className="bg-muted text-mutedForeground">
                      {assessment.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-foreground">{assessment.name}</CardTitle>
                  <CardDescription className="text-mutedForeground">{assessment.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">¿Por Qué Elegir CareerDev Pro?</h2>
              <p className="text-lg text-mutedForeground mb-8">
                Nuestra plataforma combina tecnología de IA de vanguardia con metodologías probadas de desarrollo
                profesional para brindarte la orientación profesional más integral y personalizada disponible.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-foreground flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">¿Listo Para Comenzar?</CardTitle>
                <CardDescription className="text-mutedForeground">
                  Únete a miles de profesionales que han acelerado sus carreras con nuestra plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border"
                  />
                  <Button onClick={handleGetStarted} className="bg-foreground text-background hover:bg-foreground/90">
                    Comenzar Gratis
                  </Button>
                </div>
                <p className="text-xs text-mutedForeground">
                  No se requiere tarjeta de crédito. Comienza tu evaluación gratuita hoy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-foreground text-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo Para Transformar Tu Carrera?</h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Da el primer paso hacia desbloquear tu potencial completo. Comienza con una evaluación gratuita y obtén
            orientación profesional personalizada impulsada por IA hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={handleGetStarted}
              className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6"
            >
              Comenzar Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleTryAICoach}
              className="border-background/20 text-background hover:bg-background/10 text-lg px-8 py-6 bg-transparent"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Probar Coach IA
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                  <Brain className="h-4 w-4 text-background" />
                </div>
                <span className="font-bold text-foreground">CareerDev Pro</span>
              </div>
              <p className="text-mutedForeground text-sm">
                Plataforma de desarrollo profesional impulsada por IA que ayuda a los profesionales a desbloquear su
                potencial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-mutedForeground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Evaluaciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Coach IA
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Biblioteca de Aprendizaje
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Seguimiento de Progreso
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-mutedForeground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Guías Profesionales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Historias de Éxito
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-mutedForeground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Acerca de Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Términos de Servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-mutedForeground text-sm">© 2024 CareerDev Pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
