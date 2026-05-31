'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Lock, ChevronRight, Trophy, Zap } from 'lucide-react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { PILLAR_SEQUENCE, isPillarUnlocked, getPillarProgress, type PillarId } from '@/lib/pillar-structure'

export default function PillarHubPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const [completedPillars, setCompletedPillars] = useState<PillarId[]>([])
  const [totalXP, setTotalXP] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      if (!authLoading && user?.id) {
        try {
          // Fetch user's completed activities and pillars from database
          const response = await fetch(`/api/user/pillar-progress/${user.id}`)
          if (response.ok) {
            const data = await response.json()
            setCompletedActivities(data.completedActivities || [])
            setCompletedPillars(data.completedPillars || [])
            setTotalXP(data.totalXP || 0)
          }
        } catch (error) {
          console.error('[v0] Error loading pillar progress:', error)
        }
      }
      setLoading(false)
    }

    loadProgress()
  }, [user?.id, authLoading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">Cargando tu progreso...</div>
      </div>
    )
  }

  const nextUnlockedPillar = PILLAR_SEQUENCE.find(
    (p) => !completedPillars.includes(p.id) && isPillarUnlocked(p.id, completedPillars)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tu Camino de Aprendizaje</h1>
          <p className="text-slate-300">Completa cada pilar para desbloquear el siguiente</p>
          <div className="flex items-center gap-4 mt-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{totalXP} XP Ganados</span>
          </div>
        </div>

        {/* Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {PILLAR_SEQUENCE.map((pillar, idx) => {
            const isCompleted = completedPillars.includes(pillar.id)
            const isUnlocked = isPillarUnlocked(pillar.id, completedPillars)
            const progress = getPillarProgress(completedActivities, pillar.id)

            return (
              <Card
                key={pillar.id}
                className={`relative border-2 overflow-hidden transition-all ${
                  isCompleted
                    ? 'border-green-500 bg-green-500/5'
                    : isUnlocked
                      ? 'border-purple-500 bg-purple-500/5'
                      : 'border-[rgb(80,160,170)] bg-slate-950/50 opacity-60'
                }`}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-20 blur-2xl" />
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white">{pillar.name}</CardTitle>
                        {isCompleted && (
                          <Badge className="bg-green-600 text-white">✓ Completado</Badge>
                        )}
                        {!isUnlocked && <Badge className="bg-slate-950 text-white">Bloqueado</Badge>}
                      </div>
                      <CardDescription className="text-slate-300">{pillar.description}</CardDescription>
                    </div>
                    {!isUnlocked && <Lock className="w-6 h-6 text-slate-500 flex-shrink-0" />}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">
                        {progress.completed} de {progress.total + 1} completados
                      </span>
                      <span className="text-yellow-400 font-semibold">{pillar.totalXP} XP</span>
                    </div>
                    <Progress
                      value={(progress.percentage + (completedPillars.includes(pillar.id) ? 0 : 0)) / 2}
                      className="bg-slate-950"
                    />
                  </div>

                  {/* Activity List */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-300">Contenido:</div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2 text-slate-300">
                        <span className="w-2 h-2 bg-purple-400 rounded-full" />
                        {pillar.conozcamosId} (50 XP)
                      </li>
                      {pillar.activities.map((activity) => (
                        <li
                          key={activity.id}
                          className={`flex items-center gap-2 ${
                            completedActivities.includes(activity.id)
                              ? 'text-green-400'
                              : 'text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              completedActivities.includes(activity.id)
                                ? 'bg-green-400'
                                : 'bg-slate-950'
                            }`}
                          />
                          {activity.name.split(':')[1] || activity.name} ({activity.xp} XP)
                          {completedActivities.includes(activity.id) && (
                            <span className="ml-auto text-xs">✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  {isUnlocked && !isCompleted && (
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Link href={pillar.conozcamosPath}>
                        Comenzar Pilar
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}

                  {isCompleted && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
                    >
                      <Link href={pillar.conozcamosPath}>
                        Revisar Pilar
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}

                  {!isUnlocked && (
                    <div className="text-xs text-slate-400 text-center py-2">
                      Completa "{PILLAR_SEQUENCE[idx - 1]?.name}" para desbloquear
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <Card className="bg-slate-950 border-[rgb(80,160,170)]">
          <CardHeader>
            <CardTitle className="text-white">Tu Progreso General</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{completedPillars.length}</div>
              <div className="text-sm text-slate-400">Pilares Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{totalXP}</div>
              <div className="text-sm text-slate-400">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round((completedPillars.length / PILLAR_SEQUENCE.length) * 100)}%
              </div>
              <div className="text-sm text-slate-400">Completado</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
