'use client'

import { useRouter } from 'next/navigation'
import { Award, ChevronRight, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PRODUCT_STAGES } from '@/lib/dtc/product-language'

export type LegacyPillarMainId = 'a1' | 'a2' | 'a3' | 'a4'

interface CheckpointScreenProps {
  completedPillarId: LegacyPillarMainId
  xpEarned?: number
  userId?: string
}

const STAGE_LABELS: Record<LegacyPillarMainId, string> = {
  a1: PRODUCT_STAGES.A1.name,
  a2: PRODUCT_STAGES.A2.name,
  a3: PRODUCT_STAGES.A3.name,
  a4: PRODUCT_STAGES.A4.name,
}

/**
 * Compatibility-only checkpoint.
 * Canonical completion, XP and unlocks are persisted by the server endpoints
 * of each active stage; this component must never write progress itself.
 */
export function CheckpointScreen({ completedPillarId }: CheckpointScreenProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border-[rgb(80,160,170)] bg-neutral-900 shadow-2xl">
        <div className="space-y-6 p-8 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
            <Trophy className="h-8 w-8 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Etapa completada</h2>
            <p className="mt-2 text-sm text-neutral-400">
              {STAGE_LABELS[completedPillarId]}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-center gap-2 text-emerald-300">
              <Award className="h-5 w-5" />
              <span className="font-medium">Progreso verificado por el servidor</span>
            </div>
            <p className="mt-2 text-xs text-emerald-100/70">
              Los XP, cierres y desbloqueos se derivan únicamente de evidencia persistida.
            </p>
          </div>

          <Button
            onClick={() => router.push('/despega/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Continuar mi recorrido
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
