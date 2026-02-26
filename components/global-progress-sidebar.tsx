'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

interface PhaseProgressData {
  phase: 'A1' | 'A2' | 'A4' | 'A3'
  progress: number
  status: 'completed' | 'in-progress' | 'upcoming'
  color: string
}

export function GlobalProgressSidebar() {
  const supabase = createClient()
  const [phases, setPhases] = useState<PhaseProgressData[]>([
    { phase: 'A1', progress: 100, status: 'completed', color: 'bg-blue-600' },
    { phase: 'A2', progress: 0, status: 'in-progress', color: 'bg-green-600' },
    { phase: 'A4', progress: 0, status: 'in-progress', color: 'bg-cyan-600' },
    { phase: 'A3', progress: 0, status: 'upcoming', color: 'bg-orange-600' },
  ])
  const [totalProgress, setTotalProgress] = useState(25)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: progressData } = await supabase
          .from('user_journey_progress')
          .select('a1_progress, a2_progress, a4_progress, a3_progress')
          .eq('user_id', user.id)
          .single()

        if (progressData) {
          const newPhases: PhaseProgressData[] = [
            {
              phase: 'A1',
              progress: progressData.a1_progress || 0,
              status: progressData.a1_progress === 100 ? 'completed' : 'in-progress',
              color: 'bg-blue-600',
            },
            {
              phase: 'A2',
              progress: progressData.a2_progress || 0,
              status: progressData.a2_progress > 0 ? 'in-progress' : 'upcoming',
              color: 'bg-green-600',
            },
            {
              phase: 'A4',
              progress: progressData.a4_progress || 0,
              status: progressData.a4_progress > 0 ? 'in-progress' : 'upcoming',
              color: 'bg-cyan-600',
            },
            {
              phase: 'A3',
              progress: progressData.a3_progress || 0,
              status: progressData.a3_progress > 0 ? 'in-progress' : 'upcoming',
              color: 'bg-orange-600',
            },
          ]

          setPhases(newPhases)
          const avg = Math.round((newPhases.reduce((sum, p) => sum + p.progress, 0) / (newPhases.length * 100)) * 100)
          setTotalProgress(Math.min(avg, 100))
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [supabase])

  return (
    <div className="fixed right-4 top-4 w-72 z-30 space-y-3">
      {/* MAIN PROGRESS CARD */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Tu Transformación</h3>
            <Badge className="bg-indigo-600 text-white">{totalProgress}%</Badge>
          </div>
          <Progress value={totalProgress} className="h-2" />
          <p className="text-xs text-indigo-700 dark:text-indigo-300">90 días de cambio profesional</p>
        </div>
      </Card>

      {/* PHASES MICRO TRACKER */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Fases del Ciclo</p>
          
          <div className="space-y-2">
            {phases.map((phase, idx) => (
              <Link key={phase.phase} href={`/despega/${phase.phase === 'A1' ? 'a1-cerebral' : `${phase.phase.toLowerCase()}-base` || phase.phase.toLowerCase()}`}>
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {phase.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : phase.status === 'in-progress' ? (
                      <Circle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{phase.phase}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-1.5 mt-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* QUICK ACTIONS */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-green-200 dark:border-green-800 shadow-md">
        <div className="p-3 space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Acceso Rápido</p>
          <div className="space-y-1">
            <Link href="/despega/journey">
              <button className="w-full text-xs font-semibold text-left p-2 rounded hover:bg-white/50 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400">
                Dashboard Completo
              </button>
            </Link>
            <Link href="/despega/a2/coach">
              <button className="w-full text-xs font-semibold text-left p-2 rounded hover:bg-white/50 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400">
                Hablar con Coach
              </button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
