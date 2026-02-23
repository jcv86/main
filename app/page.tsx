import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Brain, Target, BookOpen, MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Despega Tu Carrera - Tu Siguiente Versión Empieza Aquí",
  description:
    "Tu siguiente versión te está esperando. Descubre quién eres ahora, explora quién podrías ser, y construye el puente que te llevará allá con tests científicos, coaching IA y exploración de narrativas de transformación.",
  keywords: [
    "transición de identidad",
    "transformación profesional",
    "autoconocimiento",
    "coaching con IA",
    "transición de carrera",
  ],
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="w-fit">Tu Siguiente Versión</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Descubre quién eres, explora quién podrías ser
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Un viaje consciente de transformación profesional con tests científicos, exploración guiada y coaching IA 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signin">
                <Button size="lg" className="w-full sm:w-fit">
                  Comienza Tu Transición
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#faq">
                <Button size="lg" variant="outline" className="w-full sm:w-fit">
                  Aprende Más
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
              <CardHeader>
                <Brain className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-sm">Autoconocimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Descubre tu verdadero potencial</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
              <CardHeader>
                <Target className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-sm">Exploración</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Prueba nuevas identidades</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-sm">Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">120+ libros y recursos</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-pink-500/10 to-pink-600/10">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-pink-600 mb-2" />
                <CardTitle className="text-sm">Coaching IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Personalizado 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center">Cómo Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 bg-card/70">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary">01</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Ritual de Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tests científicamente validados que revelan quién eres realmente hoy. Tu punto de partida verdadero.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/70">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary">02</span>
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Exploración Guiada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acceso a 120+ libros, recursos y búsqueda semántica. Explora sin riesgo nuevas identidades posibles.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/70">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary">03</span>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Construye Tu Puente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coaching IA personalizado que te acompaña paso a paso hacia tu nueva versión profesional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <Card className="border-0 bg-gradient-to-r from-primary/10 to-blue-500/10">
          <CardHeader className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">¿Listo para tu transición?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comienza tu viaje de transformación consciente hoy mismo
            </p>
            <Link href="/auth/signin">
              <Button size="lg">
                Inicia Sesión o Regístrate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    </main>
  )
}
