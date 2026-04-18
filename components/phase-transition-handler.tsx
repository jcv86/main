'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ArrowRight, Zap, Trophy } from 'lucide-react'

interface PhaseTransitionProps {
  currentPhase: 'a1' | 'a2' | 'a3' | 'a4'
  isComplete: boolean
  nextPhaseLabel: string
  nextPhaseUrl: string
  onTransitionReady?: () => void
}

export function PhaseTransitionHandler({
  currentPhase,
  isComplete,
  nextPhaseLabel,
  nextPhaseUrl,
  onTransitionReady
}: PhaseTransitionProps) {
  const router = useRouter()
  const supabase = createClient()
  const [updating, setUpdating] = useState(false)

  const phaseConfig = {
    a1: {
      name: 'El Ritual: Quién Eres Ahora',
      completionFlag: 'a1_report_seen',
      nextPhase: 'a2',
      nextLabel: 'Exploración: Diseña Tu Ruta'
    },
    a2: {
      name: 'Exploración: Diseña Tu Ruta',
      completionFlag: 'a2_route_generated',
      nextPhase: 'a3',
      nextLabel: 'Entrenamiento: Simulación Intensiva'
    },
    a3: {
      name: 'Entrenamiento: Simulación Intensiva',
      completionFlag: 'a3_unlocked',
      nextPhase: 'a4',
      nextLabel: 'La Realidad: Ejecución y Contexto'
    },
    a4: {
      name: 'La Realidad: Ejecución y Contexto',
      completionFlag: 'a4_unlocked',
      nextPhase: null,
      nextLabel: 'Dashboard Principal'
    }
  }

  const handleProceedToNextPhase = async () => {
    try {
      setUpdating(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user?.id) {
        console.error('[v0] User not authenticated')
        return
      }

      // Update completion flag for current phase
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .update({ [phaseConfig[currentPhase].completionFlag]: true })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('[v0] Error updating progress:', updateError)
        return
      }

      console.log(`[v0] Phase ${currentPhase} completed, moving to ${nextPhaseLabel}`)
      
      // Call callback if provided
      onTransitionReady?.()

      // Redirect to next phase
      setTimeout(() => {
        router.push(nextPhaseUrl)
      }, 500)
    } catch (error) {
      console.error('[v0] Transition error:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (!isComplete) {
    return null
  }

  // Phase complete - show transition card
  return (
    <Card className="border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {phaseConfig[currentPhase].name} - Completado
            </CardTitle>
            <CardDescription>
              Excelente progreso. Estás listo para la siguiente fase.
            </CardDescription>
          </div>
          <Badge className="bg-emerald-600 text-white">
            {currentPhase.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-transparent rounded-[28px] border border-muted/20 dark:border-muted/70">
            <p className="text-sm font-semibold text-muted/70 dark:text-muted/30 mb-2">
              Próxima fase:
            </p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400 mb-4">
              {nextPhaseLabel}
            </p>
            <ul className="text-sm text-muted/60 dark:text-muted/40 space-y-1">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Nuevas herramientas y funcionalidades
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Próximos desafíos y objetivos
              </li>
            </ul>
          </div>

          <Button
            onClick={handleProceedToNextPhase}
            disabled={updating}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12"
            size="lg"
          >
            {updating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Procesando...
              </>
            ) : (
              <>
                {nextPhaseLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
