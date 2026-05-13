/**
 * TEMPLATE: This file is used to generate all A2 day pages (dia-1 through dia-90)
 * It fetches real user progress from Supabase instead of using hardcoded mockup data
 */

'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, ArrowRight, ArrowLeft, Calendar, CheckCircle2, Lightbulb, Target, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { A2_DAYS } from '@/lib/a2-days-config'

const DIA_NUM = 43

interface UserProgress {
  dia_actual: number
  porcentaje_completado: number
  estado: string
  user_id: string
}

export default function DiaPage() {
  const router = useRouter()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: progressData } = await supabase
          .from('a2_user_route_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (progressData) {
          setUserProgress(progressData)
        }
      } catch (error) {
        console.error('[v0] Error fetching user progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [supabase, router])

  const dayConfig = A2_DAYS[DIA_NUM]
  const displayDay = userProgress?.dia_actual || DIA_NUM
  const progressPercentage = userProgress?.porcentaje_completado || 0
  const isCurrentDay = userProgress?.dia_actual === DIA_NUM

  if (!dayConfig) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Día no encontrado</h2>
          <p className="text-slate-400 mb-4">El día {DIA_NUM} no existe.</p>
          <Button onClick={() => router.back()} className="bg-cyan-600 hover:bg-cyan-700">
            Atrás
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center max-w-md">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-200">Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  const phaseName = {
    clarity: 'Claridad',
    material: 'Material',
    'real-action': 'Acción Real',
    refinement: 'Refinamiento'
  }

  const prevDay = DIA_NUM > 1 ? DIA_NUM - 1 : null
  const nextDay = DIA_NUM < 90 ? DIA_NUM + 1 : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-700 p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Badge className={isCurrentDay ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30'}>
                {isCurrentDay ? '★ Tu Día Actual' : `Día ${DIA_NUM}`} de 90
              </Badge>
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                {phaseName[dayConfig.phase as keyof typeof phaseName]}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{dayConfig.title}</h1>
            <p className="text-slate-400 text-sm">{dayConfig.subtitle}</p>
          </div>
          <button className="text-slate-400 hover:text-white" onClick={() => router.back()}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar - REAL USER PROGRESS */}
        <div className="bg-slate-800/30 border-b border-slate-700 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">Progreso Total de tu Ruta</p>
            <p className="text-sm font-bold text-cyan-400">{progressPercentage}% completado</p>
          </div>
          <div className="w-full bg-slate-800 rounded-lg h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-lg transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-250px)] overflow-y-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-200 leading-relaxed">{dayConfig.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <p className="text-slate-400 text-xs font-medium mb-1">Tiempo estimado</p>
              <p className="text-white font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                {dayConfig.estimatedHours}h
              </p>
            </div>
            {dayConfig.unlocksA3Module && (
              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                <p className="text-green-400 text-xs font-medium mb-1">Desbloquea A3</p>
                <p className="text-green-300 font-bold text-sm">{dayConfig.unlocksA3Module}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Objetivos
            </h3>
            <ul className="space-y-2">
              {dayConfig.learningGoals.map((goal: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Tareas
            </h3>
            <ul className="space-y-2">
              {dayConfig.tasks.map((task: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200 text-sm">
                  <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Acciones</h3>
            <ul className="space-y-1 text-sm text-slate-200">
              {dayConfig.actionItems.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-950 border-t border-slate-700 p-6 flex justify-between gap-3">
          <Button
            onClick={() => prevDay && router.push(`/despega/a2/dia-${prevDay}`)}
            disabled={!prevDay}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={() => router.push('/despega/a2')}
            variant="outline"
            className="flex-1"
          >
            Volver a Dashboard
          </Button>

          <Button
            onClick={() => nextDay && router.push(`/despega/a2/dia-${nextDay}`)}
            disabled={!nextDay}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
