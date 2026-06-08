'use client'

import React, { useState } from 'react'
import { Compass, Target, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'

type ResponseKey = 'feeling' | 'seeking' | 'style'

const QUESTIONS: {
  key: ResponseKey
  label: string
  icon: React.ElementType
  options: string[]
}[] = [
  {
    key: 'feeling',
    label: '¿Cómo te sientes con tu rumbo hoy?',
    icon: Compass,
    options: ['Perdido', 'Estancado', 'Explorando', 'Con claridad'],
  },
  {
    key: 'seeking',
    label: '¿Qué buscas ahora?',
    icon: Target,
    options: ['Encontrar mi foco', 'Prepararme para entrevistas', 'Cambiar de rumbo', 'Crecer donde estoy'],
  },
  {
    key: 'style',
    label: 'Tu estilo de comunicación',
    icon: MessageCircle,
    options: ['Directo y asertivo', 'Abierto y conversacional', 'Calmado y reflexivo', 'Preciso y estructurado'],
  },
]

function getProfessionalType(feeling: string): string {
  switch (feeling) {
    case 'Con claridad':
      return 'Líder Ejecutivo'
    case 'Explorando':
      return 'Innovador Versátil'
    case 'Perdido':
      return 'Talento en Transición'
    default:
      return 'Especialista en Crecimiento'
  }
}

export default function PerfilVivoInteractive() {
  const [responses, setResponses] = useState<Record<ResponseKey, string>>({
    feeling: 'Con claridad',
    seeking: 'Encontrar mi foco',
    style: 'Abierto y conversacional',
  })

  const profileType = getProfessionalType(responses.feeling)

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* LEFT: Questions */}
      <div className="space-y-8">
        {QUESTIONS.map((q) => {
          const Icon = q.icon
          return (
            <div key={q.key}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-teal-400" />
                <p className="text-sm text-foreground/70">{q.label}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {q.options.map((option) => {
                  const active = responses[q.key] === option
                  return (
                    <button
                      key={option}
                      onClick={() => setResponses((prev) => ({ ...prev, [q.key]: option }))}
                      className={`relative p-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ease-out border ${
                        active
                          ? 'text-white border-teal-400 scale-[1.02] shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                          : 'bg-black/40 text-foreground/70 border-white/10 hover:border-teal-400/40 hover:text-foreground'
                      }`}
                      style={active ? { backgroundColor: 'rgba(45,212,191,0.18)' } : undefined}
                    >
                      {option}
                      {active && (
                        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        <p className="flex items-center gap-2 text-xs text-foreground/50 pt-2">
          Cambia tus respuestas y observa tu Perfil Vivo
          <ArrowRight className="h-3.5 w-3.5" />
        </p>
      </div>

      {/* RIGHT: Live Perfil Vivo card */}
      <div
        className="relative p-8 rounded-2xl border-2 overflow-hidden md:sticky md:top-32"
        style={{ borderColor: 'rgba(80,160,170,0.4)', backgroundColor: 'rgba(80,160,170,0.08)' }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.25), transparent 70%)' }}
        />

        <div className="relative text-center mb-8">
          <p className="text-xs tracking-[0.25em] text-teal-400 font-semibold mb-5">TU PERFIL VIVO</p>
          <div className="relative w-24 h-24 mx-auto">
            <span
              className="absolute inset-0 rounded-full border border-teal-400/30"
              style={{ animation: 'pv-ping 2.4s cubic-bezier(0,0,0.2,1) infinite' }}
            />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500/30 to-blue-500/20 flex items-center justify-center border border-teal-500/40">
              <span className="text-2xl font-semibold text-white">Vera</span>
            </div>
            <span className="absolute bottom-1 right-1 flex items-center justify-center h-5 w-5 rounded-full bg-teal-400 border-2 border-[#0a1414]">
              <Sparkles className="h-2.5 w-2.5 text-black" />
            </span>
          </div>
        </div>

        <div className="relative space-y-5 text-sm">
          <ProfileField label="Sentimiento actual" value={responses.feeling} color="text-teal-300" />
          <ProfileField label="Lo que buscas" value={responses.seeking} color="text-cyan-300" />
          <ProfileField label="Estilo de comunicación" value={responses.style} color="text-blue-300" />
          <hr className="border-white/10" />
          <ProfileField label="Tipo de profesional" value={profileType} color="text-white font-semibold" emphasis />
        </div>
      </div>

      <style jsx>{`
        @keyframes pv-ping {
          0% { transform: scale(1); opacity: 0.6; }
          80%, 100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes pv-fade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ProfileField({
  label,
  value,
  color,
  emphasis,
}: {
  label: string
  value: string
  color: string
  emphasis?: boolean
}) {
  return (
    <div>
      <p className="text-foreground/55 text-xs mb-1">{label}</p>
      <p
        key={value}
        className={`${color} ${emphasis ? 'text-lg' : 'font-medium'}`}
        style={{ animation: 'pv-fade 0.4s ease' }}
      >
        {value}
      </p>
    </div>
  )
}
