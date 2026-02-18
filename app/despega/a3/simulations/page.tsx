'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Play, Clock, Users, TrendingUp } from 'lucide-react'

const SIMULATION_TYPES = [
  {
    id: 'guided',
    name: 'Entrevista Guiada',
    subtitle: 'BÁSICO - Aprende el fundamento',
    description: 'Entrevista estructurada con preguntas claras y espacios para pensar. Guidance visible del coach.',
    features: [
      'Preguntas predefinidas y claras',
      'Espacios para preparar respuestas',
      'Feedback en cada respuesta',
      'Sin presión de tiempo agresiva',
      'Coach comenta en tiempo real'
    ],
    duration: '15-20 min',
    difficulty: 'Básico',
    difficultyColor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    icon: Users,
    action: 'Comenzar'
  },
  {
    id: 'structured',
    name: 'Entrevista Estructurada',
    subtitle: 'INTERMEDIO - Practica la consistencia',
    description: 'Preguntas más abiertas. Menos guidance. Ritmo más natural, pero aún cómodo.',
    features: [
      'Preguntas semi-abiertas',
      'Menos guidance explícita',
      'Feedback después de cada tema',
      'Tiempo moderado para pensar',
      'Coach sugiere mejoras'
    ],
    duration: '20-25 min',
    difficulty: 'Intermedio',
    difficultyColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    icon: TrendingUp,
    action: 'Comenzar'
  },
  {
    id: 'challenging',
    name: 'Entrevista Desafiante',
    subtitle: 'AVANZADO - Domina bajo presión',
    description: 'Preguntas ambiguas y desafiantes. Ritmo real. Menos espacios de preparación.',
    features: [
      'Preguntas abiertas y complejas',
      'Presión de tiempo real',
      'Cuestionamientos directos',
      'Ambigüedad calculada',
      'Coach interviene solo si es crítico'
    ],
    duration: '25-30 min',
    difficulty: 'Avanzado',
    difficultyColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
    icon: Clock,
    action: 'Comenzar'
  },
  {
    id: 'high-pressure',
    name: 'Bajo Presión Máxima',
    subtitle: 'MAESTRÍA - La realidad completa',
    description: 'Simulación real: interrupciones, objeciones, ambigüedad. Como una entrevista real difícil.',
    features: [
      'Entrevistador desafiante',
      'Preguntas inesperadas',
      'Presión constante',
      'Sin guidance',
      'Feedback después completamente'
    ],
    duration: '30-40 min',
    difficulty: 'Maestría',
    difficultyColor: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    icon: Play,
    action: 'Comenzar'
  }
]

export default function SimulationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Simulaciones de Entrevista
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            4 niveles progresivos para entrenar desde lo básico hasta la maestría total.
          </p>
        </div>

        {/* Simulation Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SIMULATION_TYPES.map((sim) => {
            const IconComponent = sim.icon
            return (
              <Card key={sim.id} className="border-2 hover:shadow-lg transition flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="w-6 h-6 text-slate-400" />
                    <Badge className={sim.difficultyColor}>{sim.difficulty}</Badge>
                  </div>
                  <CardTitle>{sim.name}</CardTitle>
                  <CardDescription className="text-base">{sim.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {sim.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Incluye:
                    </div>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                      {sim.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pt-2">
                    <Clock className="w-4 h-4" />
                    Duración: {sim.duration}
                  </div>

                  <Button className="w-full mt-4" disabled>
                    {sim.action} (Próximamente)
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-0">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-purple-600 text-lg">💡</div>
            <div>
              <div className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Cómo progresar en simulaciones</div>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>✓ Domina cada nivel antes de subir (practica hasta sentirte cómodo)</li>
                <li>✓ Revisa el feedback del coach después de cada simulación</li>
                <li>✓ Identifica patrones en tus fortalezas y debilidades</li>
                <li>✓ Practica 3-4 simulaciones por semana para avance real</li>
                <li>✓ Repite la misma simulación si necesitas reforzar un aspecto específico</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
