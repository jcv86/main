"use client"

// Cache bust: 2026-02-06T16:55:00Z - Fixed BookOpen undefined error
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  Award,
  BarChart3,
  MessageSquare,
  Trophy,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Calendar,
  Shield,
  Gamepad2,
  RefreshCw,
  ChevronRight,
  Flame,
  CircleDot,
  Zap,
  ArrowRight,
  Users,
  Clock,
  CheckCircle2,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function LandingPageOptimized() {
  // Force complete recompile - timestamp: 2026-02-06T17:00:00Z
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-5xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            El Momento Para Descubrir Tu Siguiente Versión
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Tu Siguiente Versión Empieza Aquí
          </h1>

          <p className="text-xl md:text-2xl text-foreground mb-12 max-w-3xl mx-auto leading-relaxed opacity-80">
            No es crisis. Es transición. Descubre quién eres ahora, explora quién podrías ser, y construye el puente que te llevará allá. Con tests científicos, conocimiento y coaching personalizado con IA disponible 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth" prefetch={true}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              >
                Empieza Tu Transición
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-foreground mb-12 opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>+10,000 En Transición</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Tests Científicos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span>Resultados Inmediatos</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">6</p>
                <p className="text-sm font-medium text-foreground opacity-75">Tests Psicométricos</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 dark:border-blue-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">120+</p>
                <p className="text-sm font-medium text-foreground opacity-75">Libros Profesionales</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-cyan-200 dark:border-cyan-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">100+</p>
                <p className="text-sm font-medium text-foreground opacity-75">Recursos Web</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</p>
                <p className="text-sm font-medium text-foreground opacity-75">Coach con IA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <Target className="h-3 w-3 mr-1" />
            Tu Puente de Transformación
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tu Viaje en{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              3 Pilares de Tu Transformación
            </span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto opacity-75">
            No es un camino lineal. Es un ritual de exploración que te lleva de quién eres ahora, a quién quieres ser
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">El Ritual - Quién Eres Ahora</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Descubre tu verdadero perfil sin filtros, con diagnósticos profundos
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Evaluación Integral</p>
                    <p className="text-sm text-foreground opacity-75">Personalidad, valores, emociones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Tests Científicos</p>
                    <p className="text-sm text-foreground opacity-75">6 evaluaciones validadas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Punto de Partida</p>
                    <p className="text-sm text-foreground opacity-75">De donde realmente estás</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Análisis Personal</p>
                    <p className="text-sm text-foreground opacity-75">15-20 minutos por test</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Exploración & Ensayo</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Explora identidades futuras y practica nuevas versiones de ti
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">120+ Libros Profesionales</p>
                    <p className="text-sm text-foreground opacity-75">Narrativas de transformación</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Búsqueda Semántica</p>
                    <p className="text-sm text-foreground opacity-75">Respuestas de tu transición</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">100+ Recursos Web</p>
                    <p className="text-sm text-foreground opacity-75">Estrategias y ejemplos reales</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Exploración Continua</p>
                    <p className="text-sm text-foreground opacity-75">Nuevos contenidos cada mes</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-cyan-100 dark:border-cyan-900/50 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">La Realidad - Dónde Vive</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Noticias del mercado, coaching IA y plan de acción para vivir tu nueva identidad
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Noticias del Mercado</p>
                    <p className="text-sm text-foreground opacity-75">Contexto y oportunidades en tiempo real</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Coach IA Personalizado</p>
                    <p className="text-sm text-foreground opacity-75">Sofia & Dani acompañan tu transición 24/7</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Plan de Acción - 30, 60 o 90 Días</p>
                    <p className="text-sm text-foreground opacity-75">Elige tu ritmo: intenso, balanceado o completo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Contexto Chileno</p>
                    <p className="text-sm text-foreground opacity-75">Adaptado al mercado y oportunidades locales</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-card rounded-3xl my-16 border border-border">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Tu Ritual de Entrada
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Descubre Los{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              3 Pilares
            </span>
            {" "}De Tu Transformación
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto opacity-75">
            Todo comienza con el autoconocimiento. Luego, la exploración. Finalmente, la acción.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-background border-2 border-purple-100 dark:border-purple-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">El Ritual - Quién Eres Ahora</h3>
              <p className="text-foreground opacity-75">
                Descubre tu verdadero perfil sin filtros. Tests científicos que te muestran exactamente quién eres hoy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-2 border-blue-100 dark:border-blue-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exploración & Ensayo</h3>
              <p className="text-foreground opacity-75">
                Explora identidades futuras. 120+ recursos, narrativas reales y nuevas versiones de ti para practicar.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-2 border-cyan-100 dark:border-cyan-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">La Realidad - Dónde Vive</h3>
              <p className="text-foreground opacity-75">
                Coach IA 24/7, noticias del mercado y tu plan de acción. Construye tu puente a la nueva identidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white border-0 max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <CardContent className="py-16 px-8 relative z-10">
            <div className="text-center">
              <Badge className="mb-6 bg-white/20 text-white border-0 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                100% Gratis - Sin Tarjeta de Crédito
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Sientes que estás en una encrucijada?</h2>
              <p className="text-xl mb-10 text-purple-100 max-w-2xl mx-auto">
                No es crisis. Es el momento perfecto. Únete a más de 10,000 personas que ya están transitando y descubriendo su siguiente versión con Despega Tu Carrera
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto shadow-xl"
                  >
                    Empieza Tu Transición
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
