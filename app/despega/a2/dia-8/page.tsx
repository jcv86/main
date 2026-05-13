'use client'

import { useRouter } from 'next/navigation'
import { X, ArrowRight, ArrowLeft, CheckCircle2, Clock, BookOpen, Wrench, Users, ClipboardList, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { A2_DAYS } from '@/lib/a2-days-config'

const DIA_NUM = 8

const taskTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  learning: { label: 'Aprender', icon: <BookOpen className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-400' },
  practice: { label: 'Practicar', icon: <Wrench className="w-4 h-4" />, color: 'bg-yellow-500/20 text-yellow-400' },
  networking: { label: 'Conectar', icon: <Users className="w-4 h-4" />, color: 'bg-pink-500/20 text-pink-400' },
  planning: { label: 'Planificar', icon: <ClipboardList className="w-4 h-4" />, color: 'bg-purple-500/20 text-purple-400' },
  milestone: { label: 'Hito', icon: <Trophy className="w-4 h-4" />, color: 'bg-emerald-500/20 text-emerald-400' },
}

export default function DiaPage() {
  const router = useRouter()
  const dayConfig = A2_DAYS[DIA_NUM]

  if (!dayConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Día no encontrado</h2>
          <p className="text-slate-400 mb-4">El día {DIA_NUM} no existe en la configuración.</p>
          <Button onClick={() => router.push('/despega/a2-routes')} className="bg-cyan-600 hover:bg-cyan-700">
            Volver a la Ruta
          </Button>
        </div>
      </div>
    )
  }

  const prevDay = DIA_NUM > 1 ? DIA_NUM - 1 : null
  const nextDay = DIA_NUM < 90 ? DIA_NUM + 1 : null

  const phaseName: Record<string, string> = {
    clarity: 'Claridad',
    material: 'Material',
    interview: 'Entrevista',
    'real-action': 'Acción Real',
    refinement: 'Refinamiento'
  }

  // Map phase to task type for display
  const phaseToType: Record<string, string> = {
    clarity: 'planning',
    material: 'learning',
    interview: 'practice',
    'real-action': 'networking',
    refinement: 'milestone'
  }
  const typeInfo = taskTypeLabels[phaseToType[dayConfig.phase] || 'planning']

  // Use estimatedHours from config (in hours, e.g. 1.5 = 1h 30m)
  const estimatedHours = dayConfig.estimatedHours || 1
  const hours = Math.floor(estimatedHours)
  const minutes = Math.round((estimatedHours - hours) * 60)
  const timeDisplay = hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30">
                Día {DIA_NUM} de 90
              </Badge>
              <Badge className={typeInfo.color}>
                {typeInfo.icon}
                <span className="ml-1">{typeInfo.label}</span>
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/despega/a2-routes')}
              className="text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">
            {dayConfig.title}
          </h1>
          <p className="text-white/70 mt-2">{dayConfig.subtitle}</p>

          <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeDisplay}
            </span>
            <span>Fase: {phaseName[dayConfig.phase] || dayConfig.phase}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Main Description */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <p className="text-white/85 text-lg leading-relaxed">
            {dayConfig.description}
          </p>
        </div>

        {/* Tasks */}
        {dayConfig.tasks && dayConfig.tasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              Tareas del Día
            </h2>
            <div className="space-y-3">
              {dayConfig.tasks.map((task, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 flex items-start gap-4"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-600/20 text-cyan-400 rounded-full text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{task}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals */}
        {dayConfig.learningGoals && dayConfig.learningGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Objetivos de Aprendizaje
            </h2>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <ul className="space-y-2">
                {dayConfig.learningGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Items */}
        {dayConfig.actionItems && dayConfig.actionItems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              Acciones a Entregar
            </h2>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
              <ul className="space-y-2">
                {dayConfig.actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Notion Template Link */}
        {dayConfig.notionTemplate && (
          <a
            href={dayConfig.notionTemplate}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2 text-xs bg-blue-500/20 text-blue-400">Plantilla</Badge>
                <h3 className="font-semibold text-white group-hover:text-cyan-400 transition">
                  Plantilla de Notion - Día {DIA_NUM}
                </h3>
                <p className="text-sm text-white/60">Accede a tu plantilla de trabajo</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transition" />
            </div>
          </a>
        )}



        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          {prevDay ? (
            <Button
              variant="outline"
              onClick={() => router.push(`/despega/a2/dia-${prevDay}`)}
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Día {prevDay}
            </Button>
          ) : (
            <div />
          )}
          
          {nextDay ? (
            <Button
              onClick={() => router.push(`/despega/a2/dia-${nextDay}`)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Día {nextDay}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/despega/a2-routes')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Completar Ruta
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
