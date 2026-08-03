'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, ShieldCheck, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PRODUCT_STAGES } from '@/lib/dtc/product-language'

export type LegacyPillarId = 'c1' | 'c2' | 'c3' | 'c4'

interface PillarCompletionCheckpointProps {
  pillarId: LegacyPillarId
  xpEarned?: number
}

const STAGE_LABELS: Record<LegacyPillarId, string> = {
  c1: PRODUCT_STAGES.A1.name,
  c2: PRODUCT_STAGES.A2.name,
  c3: PRODUCT_STAGES.A3.name,
  c4: PRODUCT_STAGES.A4.name,
}

/** Compatibility-only UI. Completion and rewards are always server-owned. */
export function PillarCompletionCheckpoint({
  pillarId,
}: PillarCompletionCheckpointProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl border-purple-500/50 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader className="border-b border-purple-500/20 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
          <CardTitle className="text-3xl text-white">Etapa completada</CardTitle>
          <Badge className="mx-auto mt-3 bg-emerald-600 text-white">
            {STAGE_LABELS[pillarId]}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6 pt-8">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-emerald-300" />
            <p className="mt-3 font-medium text-white">
              Cierre validado por el recorrido canónico
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Esta pantalla no otorga XP ni modifica progreso desde el navegador.
            </p>
          </div>

          <Button
            onClick={() => router.push('/despega/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continuar mi recorrido
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
