'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock3, Target, Trophy } from 'lucide-react'

interface TrainingResult {
  score: number
  questionsCompleted: number
  totalQuestions: number
  timeSpent: number
  level: 'basico' | 'intermedio' | 'avanzado'
  trainingType: string
  moduleXpEarned?: number
  moduleXpTotal?: number
}

export function TrainingResultsCard({
  result,
  onContinue,
}: {
  result: TrainingResult
  onContinue: () => void
}) {
  const safeScore = Math.max(0, Math.min(100, Math.round(result.score)))
  const minutes = Math.max(1, Math.round(result.timeSpent / 60))

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl border-training/30">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-3">
            <Trophy className="w-12 h-12 mx-auto text-training" />
            <h2 className="text-3xl font-bold text-foreground">
              Práctica finalizada
            </h2>
            <p className="text-muted-foreground">
              Este resumen es informativo. El avance y las recompensas solo se
              registran mediante la finalización canónica validada por el servidor.
            </p>
          </div>

          <div className="rounded-[24px] bg-muted/10 p-8 text-center">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Resultado
            </p>
            <p className="mt-2 text-6xl font-bold text-training">{safeScore}</p>
            <p className="text-muted-foreground">de 100</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[20px] border p-4 text-center">
              <Target className="w-5 h-5 mx-auto mb-2 text-training" />
              <p className="font-semibold">
                {result.questionsCompleted}/{result.totalQuestions}
              </p>
              <p className="text-xs text-muted-foreground">Preguntas</p>
            </div>
            <div className="rounded-[20px] border p-4 text-center">
              <Clock3 className="w-5 h-5 mx-auto mb-2 text-training" />
              <p className="font-semibold">{minutes} min</p>
              <p className="text-xs text-muted-foreground">Tiempo</p>
            </div>
            <div className="rounded-[20px] border p-4 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-training" />
              <Badge variant="outline" className="capitalize">
                {result.level}
              </Badge>
              <p className="mt-1 text-xs text-muted-foreground">Nivel practicado</p>
            </div>
          </div>

          {typeof result.moduleXpEarned === 'number' && (
            <div className="rounded-[20px] border border-training/20 bg-training/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                XP confirmado por el flujo canónico
              </p>
              <p className="text-2xl font-bold text-training">
                {Math.max(0, result.moduleXpEarned)}
                {typeof result.moduleXpTotal === 'number'
                  ? ` / ${Math.max(0, result.moduleXpTotal)}`
                  : ''}
              </p>
            </div>
          )}

          <Button onClick={onContinue} className="w-full">
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
