'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ChevronRight, Sparkles, Brain, BookOpen, Zap, Globe, CheckCircle2, ArrowRight } from 'lucide-react'

export default function CicloCompletoDemoPage() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const phases = [
    {
      id: 'a1',
      name: 'El Ritual',
      subtitle: 'Quién Eres Ahora',
      color: 'from-purple400',
      bgColor: 'bg-purple/5 dark:bg-purple/30',
      borderColor: 'border-purple/20 dark:border-purple',
      icon: Brain,
      description: 'Realiza el test Despega Cerebral. Descubre tu perfil DISC, tus fortalezas y áreas de desarrollo.',
      duration: '20-25 min',
      route: '/despega/conozcamonos-1',
      features: [
        'Test DISC científico',
        'Análisis de personalidad',
        'Coaching post-test automático',
        'Insights personalizados'
      ]
    },
    {
      id: 'a2',
      name: 'Exploración',
      subtitle: 'Aprende Nuevas Formas',
      color: 'from-blue400',
      bgColor: 'bg-blue/5 dark:bg-blue/30',
      borderColor: 'border-blue/20 dark:border-blue/10',
      icon: BookOpen,
      description: 'Descubre tu ruta personalizada de 30/60/90 días con 120+ recursos y estrategias reales.',
      duration: '30-45 min',
      route: '/despega/a2/camino',
      features: [
        'Ruta 30/60/90 días',
        '120+ libros profesionales',
        'Recursos web especializados',
        'Exploración continua'
      ]
    },
    {
      id: 'a3',
      name: 'Entrenamiento',
      subtitle: 'Practica Siendo',
      color: 'from-orange-600400',
      bgColor: 'bg-orange/5 dark:bg-orange/30',
      borderColor: 'border-orange/20 dark:border-orange',
      icon: Zap,
      description: 'Entrenamientos de entrevistas con escenarios realistas y feedback instantáneo del coach IA.',
      duration: '15-30 min por sesión',
      route: '/despega/a3/simulations',
      features: [
        'Entrenamientos interactivos',
        'Feedback conductual',
        'Progresión adaptada',
        'Coach IA personalizado'
      ]
    },
    {
      id: 'a4',
      name: 'La Realidad',
      subtitle: 'Vive Tu Nueva Identidad',
      color: 'from-blue/40',
      bgColor: 'bg-blue/5 dark:bg-cyan-950/30',
      borderColor: 'border-blue/20 dark:border-cyan',
      icon: Globe,
      description: 'Inteligencia de mercado, noticias relevantes y plan de acción con contexto local.',
      duration: '10-20 min',
      route: '/despega/a4/noticias',
      features: [
        'Noticias del mercado',
        'Market radar interactivo',
        'Plan de acción 30/60/90',
        'Contexto chileno'
      ]
    }
  ]

  const testingLinks = [
    {
      title: 'Dashboard Completo',
      description: 'Ver todos los 4 pilares en un solo lugar',
      route: '/despega/ciclo-completo',
      icon: CheckCircle2
    },
    {
      title: 'Resultados Integrados',
      description: 'Insights consolidados de A1-A4',
      route: '/despega/unified-results',
      icon: Sparkles
    },
    {
      title: 'Resumen del Viaje',
      description: 'Visualización del progreso completo',
      route: '/despega/journey-summary',
      icon: ArrowRight
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-purple text-white border-0">
            <Sparkles className="h-3 w-3 mr-2" />
            Ciclo Completo A1-A4
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tu Transformación en{' '}
            <span className="text-purple">
              4 Pilares
            </span>
          </h1>
          
          <p className="text-xl text-muted/60 dark:text-muted/30 mb-8">
            Un viaje guiado desde el autoconocimiento hasta la acción estratégica. 
            Completa todos los pilares y desbloquea tu potencial máximo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/despega/conozcamonos-1">
              <Button size="lg" className="bg-purple hover:from-purple-700 hover:to-blue text-white">
                Comenzar el Ciclo <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/despega/ciclo-completo">
              <Button size="lg" variant="outline">
                Ver Mi Progreso
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex justify-between mb-4">
            {phases.map((phase) => (
              <div key={phase.id} className="flex-1 text-center">
                <phase.icon className={`h-6 w-6 mx-auto mb-2 ${phase.id === 'a1' ? 'text-purple' : phase.id === 'a2' ? 'text-blue' : phase.id === 'a3' ? 'text-orange' : 'text-blue'}`} />
                <p className="text-xs font-medium text-muted/70 dark:text-muted/30">{phase.id.toUpperCase()}</p>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-muted/20 dark:bg-card rounded-full overflow-hidden">
            <div className="h-full w-0 bg-background" />
          </div>
        </div>
      </section>

      {/* Phases Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {phases.map((phase) => {
            const Icon = phase.icon
            return (
              <Card 
                key={phase.id}
                className={`${phase.bgColor} border-2 ${phase.borderColor} hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-background`}
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{phase.name}</CardTitle>
                    <CardDescription className="text-base font-medium">{phase.subtitle}</CardDescription>
                  </div>
                  <p className="text-sm text-muted/60 dark:text-muted/40 mt-2">{phase.duration}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted/70 dark:text-muted/30">
                    {phase.description}
                  </p>

                  {selectedPhase === phase.id && (
                    <div className="space-y-2 pt-4 border-t border-muted/20 dark:border-card">
                      <p className="text-xs font-semibold text-muted/60 dark:text-muted/40">Incluye:</p>
                      <ul className="space-y-1">
                        {phase.features.map((feature, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green dark:text-green/40 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link href={phase.route} className="block pt-2">
                    <Button className="w-full" variant={selectedPhase === phase.id ? 'default' : 'outline'}>
                      Ir a {phase.name} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Testing Links Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Rutas de Testing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testingLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.route} href={link.route}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-muted/30 dark:hover:border-muted/70">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <Icon className="h-5 w-5 text-muted/40" />
                    </div>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Acceder <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-purple rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-8">¿Qué lograrás?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Tests Científicos', value: '120+' },
              { label: 'Recursos Disponibles', value: '500+' },
              { label: 'Entrenamientos', value: 'Ilimitados' },
              { label: 'Tiempo Total', value: '2-3 hrs' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted/60 dark:text-muted/40 mb-6">
          Sistema completamente integrado. Resultados medibles. Acción clara.
        </p>
        <Link href="/despega/conozcamonos-1">
          <Button size="lg" className="bg-purple hover:from-purple-700 hover:to-blue text-white">
            Iniciar Tu Transformación Ahora
          </Button>
        </Link>
      </section>
    </div>
  )
}
