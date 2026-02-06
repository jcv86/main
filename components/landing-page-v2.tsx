"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Users,
  Award,
  Clock,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function LandingPageOptimized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/10">
      {/* Header/Navigation */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Despega
            </span>
          </div>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Inicia Sesión o Regístrate →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pretty mb-6">
            Tu Plataforma de{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Desarrollo Profesional
            </span>
          </h1>
          <p className="text-lg text-foreground/70 text-pretty max-w-3xl mx-auto mb-8">
            Combina ciencia, tecnología y contenido de clase mundial en una sola plataforma diseñada para tu crecimiento profesional
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Comienza Ahora →
            </Button>
          </Link>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tres Pilares de Excelencia</h2>
          <p className="text-lg text-foreground/70">Combina ciencia, tecnología y contenido de clase mundial</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Pillar 1: Tests */}
          <Card className="bg-card border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Tests Psicométricos Científicos</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Evaluaciones validadas científicamente para conocer tu perfil profesional
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Despega Cerebral & Mapa de Personalidad</p>
                    <p className="text-sm text-foreground opacity-75">Comportamiento y personalidad</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">5 Dimensiones & Brújula Vocacional</p>
                    <p className="text-sm text-foreground opacity-75">Rasgos y orientación vocacional</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Inteligencia Emocional Despega</p>
                    <p className="text-sm text-foreground opacity-75">Gestión de emociones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Competencias Despega</p>
                    <p className="text-sm text-foreground opacity-75">Habilidades blandas clave</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 2: Library */}
          <Card className="bg-card border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Biblioteca Profesional Completa</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Acceso ilimitado a los mejores libros de desarrollo profesional
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">120+ Libros Completos</p>
                    <p className="text-sm text-foreground opacity-75">Bestsellers de desarrollo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">100+ Recursos Web</p>
                    <p className="text-sm text-foreground opacity-75">Contenido curado del mercado chileno</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Búsqueda Semántica</p>
                    <p className="text-sm text-foreground opacity-75">Encuentra respuestas con IA</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Actualización Constante</p>
                    <p className="text-sm text-foreground opacity-75">Nuevo contenido cada mes</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 3: AI Coach */}
          <Card className="bg-card border-2 border-cyan-100 dark:border-cyan-900/50 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Coach Virtual con IA</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Tu mentor personal disponible cuando lo necesites
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Personalizado a Tu Perfil</p>
                    <p className="text-sm text-foreground opacity-75">Basado en tus tests</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Disponible 24/7</p>
                    <p className="text-sm text-foreground opacity-75">Respuestas instantáneas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Conocimiento Experto</p>
                    <p className="text-sm text-foreground opacity-75">Entrenado con 120+ libros</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Contexto Chileno</p>
                    <p className="text-sm text-foreground opacity-75">Adaptado al mercado local</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">¿Listo para Despegar?</h2>
        <p className="text-lg text-foreground/70 mb-8">
          Únete a miles de profesionales que están transformando su carrera con Despega
        </p>
        <Link href="/auth">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Comienza Gratis →
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground/60">
            © 2026 Despega. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
