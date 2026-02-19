'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle } from 'lucide-react'

interface TimelinePhase {
  name: string
  days: string
  description: string
  completed: boolean
}

const phases: TimelinePhase[] = [
  {
    name: 'Fase 1: Descubrimiento',
    days: 'Días 1-30',
    description: 'Entiende tu patrón y crea tu misión personalizada',
    completed: false,
  },
  {
    name: 'Fase 2: Acción',
    days: 'Días 31-60',
    description: 'Ejecuta entrenamientos y consolida habilidades',
    completed: false,
  },
  {
    name: 'Fase 3: Maestría',
    days: 'Días 61-90',
    description: 'Integra aprendizajes y genera impacto duradero',
    completed: false,
  },
]

export function TransformationTimeline({ progressPercent = 0 }: { progressPercent?: number }) {
  return (
    <Card className="border-0 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tu Transformación de 90 Días</CardTitle>
          <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="mt-4 h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map((phase, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                {phase.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
                {idx < phases.length - 1 && <div className="w-0.5 h-12 bg-muted-foreground/30 my-2" />}
              </div>
              <div className="pb-4">
                <h4 className="font-semibold text-sm">{phase.name}</h4>
                <p className="text-xs text-muted-foreground">{phase.days}</p>
                <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
