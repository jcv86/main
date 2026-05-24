'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, BookOpen, Wrench, Users, ClipboardList, Trophy, Zap } from 'lucide-react'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import { A2DailyMissionCard } from '@/components/a2-daily-mission-card'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'
import { markTaskComplete } from '@/lib/supabase/task-completions'

interface A2DayPageTemplateProps {
  dayNumber: number
  onComplete?: () => void
  children?: React.ReactNode
  mission?: { type: string; title: string; whyItMatters: string }
  userId?: string
  routeContext?: any // A2DayContext type
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
  routeContext,
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
      <div className="border-b" style={{ backgroundColor: 'rgba(90, 90, 150, 0)', borderColor: 'rgba(80, 160, 170, 0.2)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="text-white" style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)', borderColor: 'rgba(80, 160, 170, 0.2)' }}>
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
                color: 'rgba(255, 255, 255, 0.8)'
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

            {/* Route Context - C1, A1, C2 Information */}
            {routeContext && (
              <div className="rounded-[28px] border border-blue-500/40 bg-blue-500/5 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-blue-300">Tu Contexto en Esta Misión</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* C1: Professional Identity */}
                  {routeContext.c1 && (
                    <div className="bg-slate-800/40 rounded-lg p-3 border border-[rgb(80,160,170)]/40">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tu Identidad</p>
                      <p className="text-white mt-2 font-medium">{routeContext.c1.targetRole}</p>
                      <p className="text-slate-400 text-sm mt-1">{routeContext.c1.industry}</p>
                    </div>
                  )}
                  
                  {/* A1: Communication Profile */}
                  {routeContext.a1 && (
                    <div className="bg-slate-800/40 rounded-lg p-3 border border-[rgb(80,160,170)]/40">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tu Estilo</p>
                      <p className="text-white mt-2 font-medium capitalize">{routeContext.a1.communicationStyle}</p>
                      <p className="text-slate-400 text-sm mt-1">Comunicación efectiva</p>
                    </div>
                  )}
                  
                  {/* C2: Evidence Vault */}
                  {routeContext.c2 && (
                    <div className="bg-slate-800/40 rounded-lg p-3 border border-[rgb(80,160,170)]/40">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tu Evidencia</p>
                      <p className="text-white mt-2 font-medium">{routeContext.c2.achievements?.length || 0} Logros</p>
                      <p className="text-slate-400 text-sm mt-1">Documentados</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Why This Matters */}
            <div className="rounded-[28px] border border-[rgba(80,160,170,0.2)] bg-purple-500/5 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">¿Por qué es importante?</h3>
              <p className="text-white/80 leading-relaxed">{mission.whyItMatters}</p>
            </div>

            {/* A3 Checkpoint Info with CTA */}
            {checkpoint && (
              <div className="rounded-[28px] border border-[rgba(80,160,170,0.2)] bg-emerald-500/5 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-300">🎯 A3 Learning Checkpoint</h3>
                    <p className="text-white/80 leading-relaxed mt-2">
                      ¡Felicidades! Completaste el fundamento. Ahora comienza <strong>Module {checkpoint.moduleNumber}: {checkpoint.moduleTitle}</strong>
                    </p>
                  </div>
                  <Zap className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                </div>
                
                <Button
                  onClick={() => router.push(checkpoint.route)}
                  className="w-full py-6 rounded-lg font-semibold bg-emerald-600/80 hover:bg-emerald-600/100 text-white transition-all duration-200 border border-emerald-500/80 hover:border-emerald-500/100 text-base"
                >
                  Comenzar {checkpoint.moduleTitle}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
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
                  await markTaskComplete(30, dayNumber, `Día ${dayNumber}`)
                  console.log('[v0] Task marked complete: Día', dayNumber)
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
