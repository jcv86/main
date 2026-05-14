'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { A2_DAYS } from '@/lib/a2-days-config'
import { A2Day1Modal } from '@/components/a2-day1-modal'

const DIA_NUM = 1

const taskTypeLabels: Record<string, { label: string; color: string }> = {
  learning: { label: 'Aprender', color: 'bg-blue-500/20 text-blue-400' },
  practice: { label: 'Practicar', color: 'bg-yellow-500/20 text-yellow-400' },
  networking: { label: 'Conectar', color: 'bg-pink-500/20 text-pink-400' },
  planning: { label: 'Planificar', color: 'bg-purple-500/20 text-purple-400' },
  milestone: { label: 'Hito', color: 'bg-green-500/20 text-emerald-400' },
}

export default function Dia1Page() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const dayConfig = A2_DAYS[DIA_NUM]

  useEffect(() => {
    // Auto-open modal when page loads
    setShowModal(true)
  }, [])

  if (!dayConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/30 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Día no encontrado</h2>
          <p className="text-slate-400 mb-4">El día {DIA_NUM} no existe en la configuración.</p>
          <Button onClick={() => router.push('/despega/a2-routes')} className="bg-purple-600 hover:bg-purple-700">
            Volver a la Ruta
          </Button>
        </div>
      </div>
    )
  }

  const prevDay = DIA_NUM > 1 ? DIA_NUM - 1 : null
  const nextDay = DIA_NUM < 90 ? DIA_NUM + 1 : null

  const phaseToType: Record<string, string> = {
    clarity: 'planning',
    material: 'learning',
    interview: 'practice',
    'real-action': 'networking',
    refinement: 'milestone'
  }
  const typeInfo = taskTypeLabels[phaseToType[dayConfig.phase] || 'planning']

  const estimatedHours = dayConfig.estimatedHours || 1
  const hours = Math.floor(estimatedHours)
  const minutes = Math.round((estimatedHours - hours) * 60)
  const timeDisplay = hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`

  const handleModalComplete = () => {
    // Mark day as complete and update progress
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(90, 90, 150, 0.3)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', color: 'rgba(90, 90, 150)', borderColor: 'rgba(90, 90, 150, 0.5)' }} className="border">
                Día {DIA_NUM} de 90
              </Badge>
              <Badge className={typeInfo.color}>
                {typeInfo.label}
              </Badge>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)', color: 'white' }}
              className="hover:opacity-80 transition"
            >
              Comenzar Día 1
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-white">
            {dayConfig.title}
          </h1>
          <p className="text-white/60 mt-2">{dayConfig.subtitle}</p>

          <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Main Description */}
          <div className="rounded-[28px] border p-6" style={{ backgroundColor: 'rgba(30, 32, 42, 0.8)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
            <p className="text-white/85 text-lg leading-relaxed">
              {dayConfig.description}
            </p>
          </div>

          {/* Tasks */}
          {dayConfig.tasks && dayConfig.tasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
                Tareas del Día
              </h2>
              <div className="space-y-3">
                {dayConfig.tasks.map((task, idx) => (
                  <div 
                    key={idx}
                    className="rounded-[28px] border p-4 flex items-start gap-4 transition-all hover:border-opacity-70"
                    style={{ backgroundColor: 'rgba(90, 90, 150, 0.15)', borderColor: 'rgba(90, 90, 150, 0.3)' }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0" style={{ backgroundColor: 'rgba(90, 90, 150, 0.3)', color: 'rgba(90, 90, 150, 0.8)' }}>
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
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
                Objetivos de Aprendizaje
              </h2>
              <div className="rounded-[28px] border p-4" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
                <ul className="space-y-2">
                  {dayConfig.learningGoals.map((goal, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(90, 90, 150, 0.6)' }} />
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
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <ArrowRight className="w-6 h-6" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
                Acciones a Entregar
              </h2>
              <div className="rounded-[28px] border p-4" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
                <ul className="space-y-2">
                  {dayConfig.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(90, 90, 150, 0.6)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="rounded-[28px] border p-6 text-center" style={{ backgroundColor: 'rgba(90, 90, 150, 0.15)', borderColor: 'rgba(90, 90, 150, 0.4)' }}>
            <h3 className="text-lg font-semibold text-white mb-3">
              ¿Listo para comenzar el Día 1?
            </h3>
            <Button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)', color: 'white' }}
              size="lg"
              className="hover:opacity-80 transition"
            >
              Comenzar el Flujo Completo
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between border-t" style={{ borderColor: 'rgba(90, 90, 150, 0.3)' }}>
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
              className="bg-purple-600 hover:bg-purple-700 text-white"
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

      {/* Day 1 Modal */}
      <A2Day1Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleModalComplete}
      />
    </div>
  )
}
