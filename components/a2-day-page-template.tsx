'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, BookOpen, Wrench, Users, ClipboardList, Trophy } from 'lucide-react'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import { A2DailyMissionCard } from '@/components/a2-daily-mission-card'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'
import { markTaskComplete, getTaskId } from '@/lib/supabase/task-completions'

interface A2DayPageTemplateProps {
  dayNumber: number
  onComplete?: () => void
  children?: React.ReactNode
  mission?: { type: string; title: string; whyItMatters: string }
}

const taskTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  learning: {
    label: 'Aprender',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'bg-blue-500/20 text-blue-400',
  },
  practice: {
    label: 'Practicar',
    icon: <Wrench className="w-4 h-4" />,
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  networking: {
    label: 'Conectar',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-pink-500/20 text-pink-400',
  },
  planning: {
    label: 'Planificar',
    icon: <ClipboardList className="w-4 h-4" />,
    color: 'bg-purple-500/20 text-purple-400',
  },
  milestone: {
    label: 'Hito',
    icon: <Trophy className="w-4 h-4" />,
    color: 'bg-green-500/20 text-emerald-400',
  },
}

export function A2DayPageTemplate({
  dayNumber,
  onComplete,
  children,
  mission: customMission,
}: A2DayPageTemplateProps) {
  const router = useRouter()
  const configMission = A2_DAILY_MISSIONS[dayNumber]
  const mission = customMission ? { ...configMission, ...customMission } : configMission
  const checkpoint = getA3CheckpointForDay(dayNumber)
  
  if (!mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-slate-900/50 border border-purple-500/40 rounded-[28px] p-6 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Día no encontrado</h2>
          <p className="text-slate-400 mb-4">El día {dayNumber} no existe en la configuración.</p>
          <Button onClick={() => router.push('/despega/a2-routes')} className="bg-purple-600/70 hover:bg-purple-600/90 border border-purple-500/80 hover:border-purple-500/100 text-white transition-all duration-200">
            Volver a la Ruta
          </Button>
        </div>
      </div>
    )
  }

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null
  const nextDay = dayNumber < 90 ? dayNumber + 1 : null
  const typeInfo = taskTypeLabels[mission.missionType] || taskTypeLabels.planning

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-purple-900/20 border-b border-purple-500/40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="text-white" style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)', borderColor: 'rgba(90, 90, 150, 0.6)' }}>
                Día {dayNumber} de 90
              </Badge>
              <Badge className={typeInfo.color}>
                {typeInfo.icon}
                <span className="ml-1">{typeInfo.label}</span>
              </Badge>
              {checkpoint && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                  A3 Checkpoint
                </Badge>
              )}
            </div>
            <Button
              onClick={() => router.push('/despega/a2-routes')}
              variant="ghost"
              size="sm"
              className="rounded-[12px] transition-all duration-200 px-3 py-1 text-sm"
              style={{
                backgroundColor: 'rgba(90, 90, 150, 0.6)',
                borderColor: 'rgba(90, 90, 150, 0.6)',
                color: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid'
              }}
            >
              ← Volver a Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Custom Children */}
        {children ? (
          children
        ) : (
          <>
            {/* Mission Card */}
            <A2DailyMissionCard
              mission={mission}
              dayNumber={dayNumber}
              isCompleted={false}
              isAvailable={true}
              isA3Checkpoint={!!checkpoint}
              a3ModuleName={checkpoint ? `Module ${checkpoint.moduleNumber}: ${checkpoint.moduleTitle}` : undefined}
              onStart={() => {
                // TODO: Open mission details modal/drawer
                console.log('[v0] Starting mission for day', dayNumber)
              }}
            />

            {/* Why This Matters */}
            <div className="rounded-[28px] border border-purple-500/40 bg-purple-500/5 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">¿Por qué es importante?</h3>
              <p className="text-white/80 leading-relaxed">{mission.whyItMatters}</p>
            </div>

            {/* A3 Checkpoint Info */}
            {checkpoint && (
              <div className="rounded-[28px] border border-emerald-500/40 bg-emerald-500/5 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-300">A3 Learning Checkpoint</h3>
                <p className="text-white/80 leading-relaxed">
                  Today you unlock <strong>Module {checkpoint.moduleNumber}: {checkpoint.moduleTitle}</strong>
                </p>
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        {!children && (
          <div className="flex gap-4 pt-4">
            {prevDay && (
              <Button
                onClick={() => router.push(`/despega/a2/dia-${prevDay}`)}
                className="flex-1 py-6 rounded-full font-semibold transition-all duration-200 border-2"
                style={{
                  color: 'hsl(var(--a2-accent-cyan))',
                  borderColor: 'hsl(var(--a2-accent-cyan))',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
            <Button
              onClick={async () => {
                try {
                  // Mark current day as complete
                  const taskId = getTaskId([], dayNumber, `Día ${dayNumber}`)
                  await markTaskComplete(taskId)
                  console.log('[v0] Task marked complete:', taskId)
                } catch (err) {
                  console.error('[v0] Error marking task complete:', err)
                }
                
                onComplete?.()
                if (nextDay) {
                  router.push(`/despega/a2-routes#dia-${nextDay}`)
                }
              }}
              className="flex-1 py-6 rounded-full font-semibold bg-purple-600/80 hover:bg-purple-600/100 text-white transition-all duration-200 border border-purple-500/80 hover:border-purple-500/100"
            >
              {nextDay ? 'Siguiente' : 'Completar'}
              {nextDay && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
