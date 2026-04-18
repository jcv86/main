'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, CheckCircle2, PlayCircle, FileText, Zap } from 'lucide-react'

export default function ComenzarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/5 via-purple-50 to-blue/5 dark:from-background dark:via-purple dark:to-blue-950">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-purple text-white border-0">
            <Rocket className="h-3 w-3 mr-2" />
            Listo para Producción
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-purple">
            Tu Transformación Comienza Aquí
          </h1>

          <p className="text-xl text-muted/60 dark:text-muted/30 mb-12">
            Sistema completamente integrado de 4 pilares. 
            <br />
            Descubrimiento → Exploración → Entrenamiento → Acción
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/demo/ciclo-completo">
              <Button size="lg" className="bg-purple text-white hover:from-purple-700 hover:to-blue">
                Ver Demo (5 min)
              </Button>
            </Link>
            <Link href="/despega/conozcamonos-1">
              <Button size="lg" variant="outline">
                Comenzar Ciclo Completo
              </Button>
            </Link>
            <Link href="/demo/quick-test">
              <Button size="lg" variant="outline">
                Quick Test
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: '4 Pilares', value: 'A1-A4' },
              { label: '120+ Recursos', value: 'A2' },
              { label: 'Tests Ilimitados', value: 'A3' },
              { label: 'Insights IA', value: 'OpenAI' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/50 dark:bg-background/50 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-muted/90 dark:text-white">{stat.value}</div>
                <div className="text-sm text-muted/60 dark:text-muted/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Options */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Elige tu Camino</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: For Testing */}
            <Card className="border-2 border-blue/20 dark:border-blue/10 bg-blue/5/50 dark:bg-blue/30">
              <CardHeader>
                <PlayCircle className="h-8 w-8 text-blue dark:text-blue/40 mb-2" />
                <CardTitle>Para Testing & QA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted/70 dark:text-muted/30">
                  Prueba rápidamente la integración de todos los pilares sin necesidad de hacer el ciclo completo.
                </p>
                <div className="space-y-2">
                  <Link href="/demo/ciclo-completo">
                    <Button className="w-full justify-between" variant="outline">
                      Demo Visual <Zap className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo/quick-test">
                    <Button className="w-full justify-between" variant="outline">
                      Quick Test <PlayCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/test-openai-brain">
                    <Button className="w-full justify-between" variant="outline">
                      Test OpenAI <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Right: For Users */}
            <Card className="border-2 border-purple/20 dark:border-purple bg-purple/5/50 dark:bg-purple/30">
              <CardHeader>
                <Rocket className="h-8 w-8 text-purple dark:text-purple/40 mb-2" />
                <CardTitle>Para Usuarios Nuevos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted/70 dark:text-muted/30">
                  Inicia tu ciclo de transformación completo. Completarás los 4 pilares en orden.
                </p>
                <div className="space-y-2">
                  <Link href="/despega/conozcamonos-1">
                    <Button className="w-full bg-purple text-white hover:from-purple-700 hover:to-blue justify-between">
                      Comenzar Ahora <Rocket className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/despega/ciclo-completo">
                    <Button className="w-full justify-between" variant="outline">
                      Ver Mi Progreso <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/despega/a2/camino">
                    <Button className="w-full justify-between" variant="outline">
                      Mi Ruta 30/60/90 <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Routes */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Acceso a Todas las Rutas</h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* A1 */}
          <Card className="border-purple/20 dark:border-purple">
            <CardHeader>
              <CardTitle className="text-lg">Pilar 1: Descubrimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/despega/conozcamonos-1">
                <Button className="w-full justify-start" variant="ghost">
                  → Formulario Inicial
                </Button>
              </Link>
              <Link href="/despega/a1-cerebral">
                <Button className="w-full justify-start" variant="ghost">
                  → Test Despega Cerebral
                </Button>
              </Link>
              <Link href="/despega/a1/resultado">
                <Button className="w-full justify-start" variant="ghost">
                  → Resultados + Coaching
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* A2 */}
          <Card className="border-blue/20 dark:border-blue/10">
            <CardHeader>
              <CardTitle className="text-lg">Pilar 2: Exploración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/despega/a2/camino">
                <Button className="w-full justify-start" variant="ghost">
                  → Mi Ruta 30/60/90
                </Button>
              </Link>
              <Link href="/despega/a2/recomendaciones">
                <Button className="w-full justify-start" variant="ghost">
                  → 120+ Libros
                </Button>
              </Link>
              <Link href="/despega/a2/dashboard">
                <Button className="w-full justify-start" variant="ghost">
                  → Dashboard & KPIs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* A3 */}
          <Card className="border-orange/20 dark:border-orange">
            <CardHeader>
              <CardTitle className="text-lg">Pilar 3: Entrenamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/despega/a3/simulations">
                <Button className="w-full justify-start" variant="ghost">
                  → Entrenamientos de Entrevista
                </Button>
              </Link>
              <Link href="/despega/a3/progress">
                <Button className="w-full justify-start" variant="ghost">
                  → Mi Progreso
                </Button>
              </Link>
              <Link href="/despega/a3/diagnosis">
                <Button className="w-full justify-start" variant="ghost">
                  → Diagnóstico de Fortalezas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* A4 */}
          <Card className="border-blue/20 dark:border-cyan">
            <CardHeader>
              <CardTitle className="text-lg">Pilar 4: La Realidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/despega/a4/noticias">
                <Button className="w-full justify-start" variant="ghost">
                  → Noticias & Market Intel
                </Button>
              </Link>
              <Link href="/despega/a4/radar">
                <Button className="w-full justify-start" variant="ghost">
                  → Market Radar
                </Button>
              </Link>
              <Link href="/analisis-mercado-chile">
                <Button className="w-full justify-start" variant="ghost">
                  → Análisis Mercado Chile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Documentation */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Documentación</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-muted/60 dark:text-muted/40 mb-2" />
                <CardTitle className="text-lg">Testing Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted/60 dark:text-muted/40 mb-4">
                  Guía completa de testing con todos los endpoints y flujos
                </p>
                <Link href="/TESTING_GUIDE.md" target="_blank">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Documento
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="h-8 w-8 text-green dark:text-green/40 mb-2" />
                <CardTitle className="text-lg">Production Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted/60 dark:text-muted/40 mb-4">
                  Checklist de validación para producción
                </p>
                <Link href="/PRODUCTION_READY_CHECKLIST.md" target="_blank">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Checklist
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-blue dark:text-blue/40 mb-2" />
                <CardTitle className="text-lg">Testing Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted/60 dark:text-muted/40 mb-4">
                  Index completo de todas las rutas disponibles
                </p>
                <Link href="/TESTING_LINKS.md" target="_blank">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Index
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="container mx-auto px-4 py-12 text-center border-t border-muted/20 dark:border-muted/80">
        <p className="text-muted/60 dark:text-muted/40 mb-4">
          Sistema DTC - Transformación Profesional Integrada
        </p>
        <p className="text-sm text-muted/50 dark:text-muted/50">
          ✅ Todos los 4 pilares (A1-A4) integrados y listos para producción
        </p>
      </section>
    </div>
  )
}
