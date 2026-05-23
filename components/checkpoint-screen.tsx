'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getNextSequenceStep, getMainPillar } from '@/lib/learning-sequence'
import { Award, Trophy, ChevronRight } from 'lucide-react'
import type { PillarMainId } from '@/lib/learning-sequence'

interface CheckpointScreenProps {
  completedPillarId: PillarMainId
  xpEarned: number
  userId: string
}

export function CheckpointScreen({
  completedPillarId,
  xpEarned,
  userId,
}: CheckpointScreenProps) {
  const router = useRouter()
  const completedPillar = getMainPillar(completedPillarId)
  const nextStep = getNextSequenceStep(completedPillarId)

  const handleAwardXpAndContinue = async () => {
    try {
      // Award XP
      await fetch('/api/user/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          stepId: completedPillarId,
          xpAmount: xpEarned,
        }),
      })

      // Mark pillar as complete
      await fetch('/api/user/complete-pillar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          pillarId: completedPillarId,
        }),
      })

      // Navigate to hub
      router.push('/despega/pillars-hub')
    } catch (error) {
      console.error('[v0] Error processing checkpoint:', error)
      router.push('/despega/pillars-hub')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-[rgb(80,160,170)] bg-neutral-900 shadow-2xl">
        <div className="p-8 space-y-6 text-center">
          {/* Trophy Animation */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          {/* Success Message */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Pilar Completado!</h2>
            <p className="text-neutral-400 text-sm">
              Has dominado <strong>{completedPillar.name}</strong>
            </p>
          </div>

          {/* XP Earned */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-neutral-400">XP Ganados</span>
            </div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              +{xpEarned}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm text-neutral-400">
            <p>Tu esfuerzo se está pagando</p>
            <p>Continúa con el siguiente pilar</p>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={handleAwardXpAndContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
            >
              Ir al Siguiente Pilar
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={() => router.push('/despega/pillars-hub')}
              variant="outline"
              className="w-full border-[rgb(80,160,170)] text-neutral-300 hover:bg-neutral-800"
            >
              Ver Progreso General
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
