'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Loader2, Trophy, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PhaseTransitionProps {
  currentPhase: 'a1' | 'a2' | 'a3' | 'a4'
  isComplete: boolean
  nextPhaseLabel: string
  /** Compatibility only. The authoritative destination is returned by the server. */
  nextPhaseUrl: string
  onTransitionReady?: () => void
}

interface TransitionPayload {
  success?: boolean
  nextPath?: string
  error?: string
}

const PHASE_CONFIG = {
  a1: {
    name: 'Despega Cerebral',
    nextLabel: 'Tu Ruta',
    step: 'a1_report',
  },
  a2: {
    name: 'Tu Ruta',
    nextLabel: 'Entrenamiento',
    step: 'a2_intro',
  },
  a3: {
    name: 'Entrenamiento',
    nextLabel: 'Radar Estratégico',
    step: null,
  },
  a4: {
    name: 'Radar Estratégico',
    nextLabel: 'Panel principal',
    step: null,
  },
} as const

export function PhaseTransitionHandler({
  currentPhase,
  isComplete,
  nextPhaseLabel,
  nextPhaseUrl,
  onTransitionReady,
}: PhaseTransitionProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const config = PHASE_CONFIG[currentPhase]

  if (!isComplete) return null

  const proceed = async () => {
    setUpdating(true)
    setError(null)
    try {
      let nextPath = nextPhaseUrl

      if (config.step) {
        const response = await fetch('/api/journey/transition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ step: config.step }),
        })
        const payload = (await response.json().catch(() => ({}))) as TransitionPayload
        if (!response.ok || !payload.nextPath) {
          throw new Error(payload.error || 'No pudimos registrar la transición.')
        }
        nextPath = payload.nextPath
      }

      onTransitionReady?.()
      router.push(nextPath)
      router.refresh()
    } catch (transitionError) {
      console.error('[v0] Phase transition error:', transitionError)
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : 'No pudimos continuar.',
      )
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card className="border-2 border-emerald-500/40 bg-emerald-500/5">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              {config.name} completado
            </CardTitle>
            <CardDescription>
              La evidencia de esta etapa quedó registrada. El siguiente paso usa ese contexto.
            </CardDescription>
          </div>
          <Badge className="w-fit bg-emerald-600 text-white">
            {currentPhase.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-sm font-semibold text-muted-foreground">Siguiente etapa</p>
          <p className="mt-1 text-lg font-bold text-teal-500">
            {nextPhaseLabel || config.nextLabel}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Continúa desde la información ya construida
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Sin repetir pasos ni crear progreso paralelo
            </li>
          </ul>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-100">
            {error}
          </p>
        )}

        <Button
          onClick={() => void proceed()}
          disabled={updating}
          className="h-12 w-full bg-teal-600 text-white hover:bg-teal-700"
          size="lg"
        >
          {updating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {nextPhaseLabel || config.nextLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
