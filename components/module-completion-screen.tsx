'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { getNextModulePath, isLastModule } from '@/lib/module-navigation'
import { PILLAR3_MODULES } from '@/lib/pillar3-config'

interface ModuleCompletionScreenProps {
  moduleId: string
  moduleName: string
  score?: number
  maxScore?: number
  xpEarned?: number
  completionMessage?: string
}

export function ModuleCompletionScreen({
  moduleId,
  moduleName,
  score = 100,
  maxScore = 100,
  xpEarned,
  completionMessage = 'Excelente trabajo. Sigue avanzando en tu aprendizaje',
}: ModuleCompletionScreenProps) {
  const router = useRouter()
  const nextModulePath = getNextModulePath(moduleId)
  const isLast = isLastModule(moduleId)
  const [isRecording, setIsRecording] = useState(false)

  console.log('[v0] ModuleCompletionScreen - moduleId:', moduleId)
  console.log('[v0] ModuleCompletionScreen - nextModulePath:', nextModulePath)
  console.log('[v0] ModuleCompletionScreen - isLast:', isLast)

  // Record module completion when component mounts
  useEffect(() => {
    const recordCompletion = async () => {
      if (isRecording) return
      
      try {
        setIsRecording(true)
        const response = await fetch('/api/a3/module-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId }),
        })

        const data = await response.json()
        console.log('[v0] Module completion recorded:', data)
      } catch (error) {
        console.error('[v0] Error recording module completion:', error)
      } finally {
        setIsRecording(false)
      }
    }

    recordCompletion()
  }, [moduleId, isRecording])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <Card className="border-purple-500/30 bg-black">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">¡{moduleName} Completado!</h2>
              <p className="text-white/70">{completionMessage}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8">
              <div className="space-y-2">
                <p className="text-white/60 text-sm font-medium">PUNTUACIÓN</p>
                <p className="text-5xl font-bold text-white">{score}</p>
                <p className="text-white/60 text-sm">/ {maxScore}</p>
              </div>
            </div>

            {displayXp > 0 && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/60 text-sm">XP Ganado</p>
                <p className="text-2xl font-bold text-training">{displayXp} XP</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.push('/despega/a3')}
                variant="outline"
                className="flex-1 border-purple-500/30 text-white hover:bg-purple-500/10"
              >
                Ir al Dashboard
              </Button>
              {!isLast && nextModulePath && (
                <Button
                  onClick={() => {
                    console.log('[v0] Navigating to:', nextModulePath)
                    router.push(nextModulePath)
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Continuar Práctica
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
