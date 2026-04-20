'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Zap, Users, CheckCircle } from 'lucide-react'
import { DISCProfile, getDISCPersonalization, getPersonalizedRecommendations } from '@/lib/personalization/disc-engine'

interface DISCWidgetProps {
  profile: DISCProfile
  userName?: string
}

const DISC_DETAILS = {
  D: {
    label: 'Dominador',
    description: 'Orientado a resultados, decididor rápido',
    color: 'bg-red/10 dark:bg-red/30 text-red dark:text-red/30',
    icon: '⚡',
    traits: ['Decisivo', 'Competitivo', 'Enfocado', 'Determinado'],
  },
  I: {
    label: 'Influenciador',
    description: 'Comunicador, orientado a personas',
    color: 'bg-yellow/10 dark:bg-yellow/30 text-yellow dark:text-yellow-200',
    icon: '🎤',
    traits: ['Entusiasta', 'Comunicativo', 'Sociable', 'Inspirador'],
  },
  S: {
    label: 'Estable',
    description: 'Reflexivo, orientado al equipo',
    color: 'bg-green/10 dark:bg-green/30 text-green dark:text-green/30',
    icon: '🤝',
    traits: ['Leal', 'Paciente', 'Colaborativo', 'Consistente'],
  },
  C: {
    label: 'Concienzudo',
    description: 'Analítico, orientado a la calidad',
    color: 'bg-blue/10 dark:bg-blue/30 text-blue dark:text-blue-200',
    icon: '🎯',
    traits: ['Preciso', 'Detallista', 'Analítico', 'Riguroso'],
  },
}

export function DISCWidget({ profile, userName }: DISCWidgetProps) {
  if (!profile) {
    return (
      <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-sm">Completa tu perfil DISC</p>
              <p className="text-xs text-muted-foreground">Para obtener recomendaciones personalizadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const details = DISC_DETAILS[profile]
  const config = getDISCPersonalization(profile)
  const recommendations = getPersonalizedRecommendations(profile)

  return (
    <div className="space-y-4">
      <Card className={`border-l-4 border-l-current ${details.color}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{details.icon}</span>
              <div>
                <CardTitle className="text-lg">{details.label}</CardTitle>
                <p className="text-xs text-muted-foreground">{details.description}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Características */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Características</p>
            <div className="flex flex-wrap gap-1">
              {details.traits.map(trait => (
                <Badge key={trait} variant="secondary" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferencias de contenido */}
          <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Tu preferencia de contenido</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Profundidad:</span>
                <p className="font-medium capitalize">{config.contentDepth}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ritmo:</span>
                <p className="font-medium capitalize">{config.pace}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Formato:</span>
                <p className="font-medium capitalize">{config.contentFormat}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Lectura:</span>
                <p className="font-medium">{config.recommendedReadingTime} min</p>
              </div>
            </div>
          </div>

          {/* Recomendaciones personalizadas */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Recomendaciones para tu carrera</p>
            <ul className="space-y-1 text-xs">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-purple" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
