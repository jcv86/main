"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Sparkles, ArrowRight, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"

export function LandingPageOptimized() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section - Optimized */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Plataforma N°1 en Chile para Desarrollo Profesional
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Despega Tu Carrera con IA
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubre tu potencial con evaluaciones psicométricas, aprende de 120+ libros profesionales y recibe coaching
            personalizado con inteligencia artificial
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/demo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 w-full sm:w-auto"
              >
                Comenzar Demo Gratuito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/biblioteca">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Explorar Biblioteca
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">6</p>
              <p className="text-sm text-muted-foreground">Tests Psicométricos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">120+</p>
              <p className="text-sm text-muted-foreground">Libros Profesionales</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-600">100+</p>
              <p className="text-sm text-muted-foreground">Recursos Web</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-sm text-muted-foreground">Coach con IA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simplified */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-3xl mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              crecer profesionalmente
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Una plataforma integral que combina ciencia, tecnología y contenido de calidad mundial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Tests Psicométricos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>DISC, MBTI, Big Five</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Inteligencia Emocional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>RIASEC y Soft Skills</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Biblioteca Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>120+ libros de desarrollo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>100+ recursos web curados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Búsqueda semántica con IA</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 hover:border-cyan-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Coach con IA</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <span>Respuestas personalizadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <span>Disponible 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <span>Basado en tu perfil</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white border-0 max-w-4xl mx-auto">
          <CardContent className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para despegar tu carrera?</h2>
            <p className="text-lg mb-8 text-purple-100">
              Únete a miles de profesionales que ya están desarrollando sus habilidades con nuestra plataforma
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Comenzar Ahora Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
