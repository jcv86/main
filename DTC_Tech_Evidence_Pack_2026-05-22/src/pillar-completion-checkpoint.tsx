'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Zap, ChevronRight } from 'lucide-react'
import { getPillarById, getNextPillar, type PillarId } from '@/lib/pillar-structure'

interface PillarCompletionCheckpointProps {
  pillarId: PillarId
  xpEarned: number
}

export function PillarCompletionCheckpoint({
  pillarId,
  xpEarned,
}: PillarCompletionCheckpointProps) {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  
  const pillar = getPillarById(pillarId)
  const nextPillar = getNextPillar(pillarId)

  const handleAwardXP = async () => {
    setIsRecording(true)
    try {
      // Award XP to user
      const response = await fetch('/api/user/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pillarId,
          xpAmount: xpEarned,
        }),
      })

      if (response.ok) {
        // Mark pillar as complete
        const completeResponse = await fetch('/api/user/complete-pillar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pillarId }),
        })

        if (completeResponse.ok) {
          // Redirect to hub
          router.push('/despega/pillars/hub')
        }
      }
    } catch (error) {
      console.error('[v0] Error awarding XP:', error)
    } finally {
      setIsRecording(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/50">
        <CardHeader className="text-center border-b border-purple-500/20">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <CardTitle className="text-3xl text-white">{pillar.name} Completado</CardTitle>
        </CardHeader>

        <CardContent className="pt-8 space-y-6">
          {/* XP Reward */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-4xl font-bold text-white">{xpEarned}</span>
              <span className="text-2xl text-slate-300">XP</span>
            </div>
            <p className="text-center text-slate-300">Puntos ganados en este pilar</p>
          </div>

          {/* Next Pillar Info */}
          {nextPillar && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Siguiente:</p>
              <p className="text-lg font-semibold text-white">{nextPillar.name}</p>
              <p className="text-sm text-slate-300">{nextPillar.description}</p>
            </div>
          )}

          {/* Message */}
          <div className="text-center">
            <p className="text-slate-300 text-lg">
              ¡Excelente trabajo! Has completado este pilar. 
              {nextPillar ? ' Continúa con el siguiente.' : ' ¡Has completado todo el programa!'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => router.push('/despega/pillars/hub')}
              variant="outline"
              className="flex-1 border-purple-500/30 text-white hover:bg-purple-500/10"
              disabled={isRecording}
            >
              Ver Dashboard
            </Button>
            <Button
              onClick={handleAwardXP}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isRecording}
            >
              {isRecording ? 'Registrando...' : 'Ir al Hub'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
