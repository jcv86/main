'use client'

import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { useRouter } from 'next/navigation'
import {
  MAIN_PILLARS,
  getMainPillarProgress,
  isStepUnlocked,
  getDiagnosticForPillar,
  type SequenceStepId,
} from '@/lib/learning-sequence'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Lock, CheckCircle, Play } from 'lucide-react'

interface UserProgress {
  completedSteps: SequenceStepId[]
  totalXp: number
}

export default function PillarsHubPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress>({
    completedSteps: [] as SequenceStepId[],
    totalXp: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id || authLoading) return

      try {
        const response = await fetch(`/api/user/pillar-progress/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          // Convert the API response to completedSteps format
          const completedSteps: SequenceStepId[] = [
            ...(data.completedPillars || []),
            ...(data.completedActivities || []),
          ].filter((step): step is SequenceStepId => 
            ['a1', 'a2', 'a3', 'a4', 'c1', 'c2', 'c3', 'c4'].includes(step)
          )
          setProgress({
            completedSteps,
            totalXp: data.totalXP || 0,
          })
        }
      } catch (error) {
        console.error('[v0] Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user?.id, authLoading])

  const pillarProgress = getMainPillarProgress(progress.completedSteps)

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Tu Camino de Aprendizaje</h1>
        <p className="text-neutral-400 text-lg">
          Completa los 4 pilares para dominar tus entrevistas
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-12 border-[rgb(80,160,170)] bg-neutral-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progreso General</CardTitle>
              <CardDescription>{pillarProgress.completionPercentage}% completado</CardDescription>
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {progress.totalXp} XP
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={pillarProgress.completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MAIN_PILLARS.map((pillar) => {
          const isCompleted = progress.completedSteps.includes(pillar.id)
          const diagnostic = getDiagnosticForPillar(pillar.id)
          const isDiagnosticUnlocked = isStepUnlocked(diagnostic.id, progress.completedSteps)
          const isDiagnosticCompleted = progress.completedSteps.includes(diagnostic.id)
          const isLocked = !isDiagnosticUnlocked

          return (
            <Card
              key={pillar.id}
              className={`border transition-all ${
                isLocked
                  ? 'border-[rgb(80,160,170)] bg-neutral-900 opacity-50'
                  : 'border-[rgb(80,160,170)] bg-neutral-900 hover:border-[rgb(80,160,170)]'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{pillar.icon}</div>
                    <CardTitle className="text-xl">{pillar.name}</CardTitle>
                    <CardDescription className="mt-2">{pillar.description}</CardDescription>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                  {isLocked && <Lock className="w-6 h-6 text-neutral-600 flex-shrink-0" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* XP Badge */}
                <Badge
                  variant="secondary"
                  className={`text-sm py-1 ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {pillar.xp} XP {isCompleted && '✓'}
                </Badge>

                {/* Status */}
                <div className="text-sm">
                  {isCompleted ? (
                    <p className="text-green-400 font-medium">Completado</p>
                  ) : isLocked ? (
                    <p className="text-neutral-500">
                      Completa: <strong>Pilar anterior</strong>
                    </p>
                  ) : isDiagnosticCompleted ? (
                    <p className="text-blue-400">Diagnóstico completado</p>
                  ) : (
                    <p className="text-neutral-400">Comienza tu aprendizaje</p>
                  )}
                </div>

                {/* Action Button */}
                {!isLocked && (
                  <Button
                    onClick={() => {
                      if (isDiagnosticCompleted) {
                        // Navigate directly to main pillar
                        const pillarPaths: Record<string, string> = {
                          a1: '/despega/a1',
                          a2: '/despega/a2',
                          a3: '/despega/a3',
                          a4: '/despega/a4',
                        }
                        router.push(pillarPaths[pillar.id] || diagnostic.path)
                      } else {
                        router.push(diagnostic.path) // Start with diagnostic
                      }
                    }}
                    disabled={isCompleted}
                    className={`w-full ${
                      isCompleted
                        ? 'bg-neutral-700 text-neutral-500'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completado
                      </>
                    ) : isDiagnosticCompleted ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continuar
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Comenzar
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>
                )}

                {isLocked && (
                  <Button disabled className="w-full bg-neutral-700 text-neutral-500">
                    <Lock className="w-4 h-4 mr-2" />
                    Bloqueado
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
