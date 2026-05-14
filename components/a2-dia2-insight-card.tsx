'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react'
import { A1ProfileResult } from '@/lib/disc-calculator'

interface WorkStyleInsightCardProps {
  a1Profile: A1ProfileResult
  traits: string[]
  risk: string
  reflection: string
  personalRule: string
  completed?: boolean
}

const traitLabels: Record<string, string> = {
  directo: 'Directo',
  analitico: 'Analítico',
  cuidadoso: 'Cuidadoso',
  sociable: 'Sociable',
  constante: 'Constante',
  rapido: 'Rápido',
  detallista: 'Detallista',
  reservado: 'Reservado',
  competitivo: 'Competitivo',
  colaborativo: 'Colaborativo',
  reflexivo: 'Reflexivo',
  impulsivo: 'Impulsivo',
}

const riskLabels: Record<string, string> = {
  'hablo-rapido': 'Hablo demasiado rápido',
  'respuestas-cortas': 'Doy respuestas muy cortas',
  'cuesta-vender': 'Me cuesta vender mis logros',
  defensivo: 'Me pongo defensivo',
  'cuesta-improvisar': 'Me cuesta improvisar',
  'necesito-seguridad': 'Necesito demasiada seguridad antes de responder',
  'poco-natural': 'Me cuesta sonar natural',
  'hablo-poco': 'Hablo demasiado poco',
}

const profileNames: Record<string, string> = {
  dominancia: 'Dominio',
  influencia: 'Influencia',
  estabilidad: 'Estabilidad',
  conciencia: 'Conciencia',
}

const profileColors: Record<string, string> = {
  dominancia: 'bg-red-500/10 border-red-500/40 text-red-300',
  influencia: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300',
  estabilidad: 'bg-green-500/10 border-green-500/40 text-green-300',
  conciencia: 'bg-blue-500/10 border-blue-500/40 text-blue-300',
}

export function WorkStyleInsightCard({
  a1Profile,
  traits,
  risk,
  reflection,
  personalRule,
  completed = false,
}: WorkStyleInsightCardProps) {
  const profileColor = profileColors[a1Profile.perfil_dominante] || 'bg-purple-500/10 border-purple-500/40'

  return (
    <div className="space-y-4">
      {/* Profile Summary */}
      <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Tu Perfil A1</h3>
            <p className="text-2xl font-bold text-white mt-2">
              {profileNames[a1Profile.perfil_dominante]}
            </p>
          </div>
          {completed && (
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          )}
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{a1Profile.descripción}</p>
      </Card>

      {/* Selected Traits */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide">3 Rasgos que reconoces en ti</h4>
        <div className="flex flex-wrap gap-2">
          {traits.map((traitId) => (
            <Badge
              key={traitId}
              className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1"
            >
              <CheckCircle2 className="w-3 h-3 mr-1.5" />
              {traitLabels[traitId] || traitId}
            </Badge>
          ))}
        </div>
      </div>

      {/* Interview Risk */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Riesgo en Entrevistas</h4>
        <div className="flex gap-2">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1">
            <AlertCircle className="w-3 h-3 mr-1.5" />
            {riskLabels[risk] || risk}
          </Badge>
        </div>
      </div>

      {/* Reflection */}
      <Card className="border border-purple-500/40 bg-purple-500/5 p-4 rounded-[20px]">
        <div className="flex gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Tu Reflexión</p>
            <p className="text-white/90 text-sm leading-relaxed">{reflection}</p>
          </div>
        </div>
      </Card>

      {/* Personal Rule */}
      <Card className="border border-cyan-500/40 bg-cyan-500/5 p-4 rounded-[20px]">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Tu Regla Personal</p>
          <p className="text-white font-semibold text-sm">Mi regla: {personalRule}</p>
        </div>
      </Card>

      {/* Mini Lesson */}
      {completed && (
        <Card className="border border-purple-500/30 bg-slate-900/50 p-4 rounded-[20px]">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-2">Recuerda</p>
          <p className="text-white/80 text-sm leading-relaxed">
            Tu estilo no es bueno ni malo. Es una herramienta. Usa lo mejor de tu naturaleza y corrige lo que puede 
            confundirse en una entrevista.
          </p>
        </Card>
      )}
    </div>
  )
}
