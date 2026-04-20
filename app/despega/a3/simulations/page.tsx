'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Play, Clock, Users, TrendingUp } from 'lucide-react'

const ENTRENAMIENTO_TYPES = [
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
    difficultyColor: 'bg-green/10 dark:bg-green/30 text-green dark:text-green/20',
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
    difficultyColor: 'bg-orange/10 dark:bg-orange/30 text-orange dark:text-orange/20',
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
    difficultyColor: 'bg-red/10 dark:bg-red/30 text-red dark:text-red/20',
    icon: Play,
    action: 'Comenzar'
  }
]

export default function SimulationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-muted/90 dark:text-muted/5">
            Entrenamiento de Entrevista
          </h1>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground">
            4 niveles progresivos para entrenar desde lo básico hasta la maestría total.
          </p>
        </div>

        {/* Entrenamiento Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENTRENAMIENTO_TYPES.map((ent) => {
            const IconComponent = ent.icon
            const getRouteLink = () => {
              switch(ent.id) {
                case 'guided':
                  return '/despega/a3/simulaciones-guiado'
                case 'structured':
                  return '/despega/a3/simulaciones-estructurada'
                case 'challenging':
                  return '/despega/a3/simulaciones-desafiante'
                case 'high-pressure':
                  return '/despega/a3/simulaciones-maestria'
                default:
                  return '#'
              }
            }
            
            return (
              <Card key={ent.id} className="border-2 hover:shadow-lg transition flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="w-6 h-6 text-muted-foreground" />
                    <Badge className={ent.difficultyColor}>{ent.difficulty}</Badge>
                  </div>
                  <CardTitle>{ent.name}</CardTitle>
                  <CardDescription className="text-base">{ent.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {ent.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-muted/90 dark:text-muted/5">
                      Incluye:
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground dark:text-muted/30">
                      {ent.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground pt-2">
                    <Clock className="w-4 h-4" />
                    Duración: {ent.duration}
                  </div>

                  <Link href={getRouteLink()}>
                    <Button className="w-full mt-4">
                      {ent.action} →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips Card */}
        <Card className="bg-background">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-purple text-lg">💡</div>
            <div>
              <div className="font-semibold text-purple dark:text-purple/10 mb-2">Cómo progresar en entrenamiento de entrevistas</div>
              <ul className="text-sm text-purple dark:text-purple/20 space-y-1">
                <li>✓ Domina cada nivel antes de subir (practica hasta sentirte cómodo)</li>
                <li>✓ Revisa el feedback del coach después de cada entrenamiento</li>
                <li>✓ Identifica patrones en tus fortalezas y debilidades</li>
                <li>✓ Practica 3-4 entrenamientos por semana para avance real</li>
                <li>✓ Repite el mismo entrenamiento si necesitas reforzar un aspecto específico</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
