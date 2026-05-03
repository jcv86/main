'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

const INTERVIEWERS = [
  { id: 'interviewer-classic-1', name: 'Sofia', role: 'Reclutadora Senior', level: 'Básico', image: '/images/interviewers/sofia.jpg', color: 'from-green-500 to-green-600' },
  { id: 'interviewer-classic-2', name: 'Marco', role: 'Manager Senior Ingeniería', level: 'Intermedio', image: '/images/interviewers/marco.jpg', color: 'from-yellow-500 to-yellow-600' },
  { id: 'interviewer-classic-3', name: 'Elena', role: 'VP Talent & Culture', level: 'Intermedio+', image: '/images/interviewers/elena.jpg', color: 'from-purple-500 to-purple' },
  { id: 'interviewer-classic-4', name: 'David', role: 'Tech Lead & Architect', level: 'Intermedio+', image: '/images/interviewers/david.jpg', color: 'from-orange-500 to-orange-600' },
  { id: 'interviewer-modern-1', name: 'Alex', role: 'Product Manager', level: 'Avanzado', image: '/images/interviewers/alex.jpg', color: 'from-blue-500 to-blue-600' },
  { id: 'interviewer-modern-2', name: 'Jordan', role: 'CEO Advisor', level: 'Avanzado', image: '/images/interviewers/jordan.jpg', color: 'from-red to-red' }
]

interface InterviewerSelectorProps {
  value?: string
  onChange: (interviewerId: string) => void
  compact?: boolean
}

export function InterviewerSelector({ value, onChange, compact = false }: InterviewerSelectorProps) {
  const [isChanging, setIsChanging] = useState(false)
  const selected = INTERVIEWERS.find(i => i.id === value) || INTERVIEWERS[0]

  const handleSelect = (id: string) => {
    setIsChanging(true)
    onChange(id)
    setTimeout(() => setIsChanging(false), 300)
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Tu Entrevistador</label>
        <div className="grid grid-cols-3 gap-2">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => handleSelect(interviewer.id)}
              className={`p-2 rounded-lg transition-all text-center ${
                value === interviewer.id
                  ? 'ring-2 ring-blue-500 bg-blue-500/10'
                  : 'hover:bg-muted/20'
              }`}
            >
              <div className="relative w-8 h-8 rounded-full mx-auto mb-1 overflow-hidden bg-muted">
                <Image
                  src={interviewer.image}
                  alt={interviewer.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="text-xs font-semibold text-foreground">{interviewer.name}</div>
              <div className="text-[10px] text-muted-foreground">{interviewer.level}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground uppercase tracking-wide">Selecciona tu Entrevistador</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Elige un perfil profesional diferente para tener perspectivas variadas
        </p>
      </div>

      {/* Main Layout: Selected Info (Left) + Grid Avatars (Right) */}
      <div className="flex gap-8">
        {/* Left Panel - Selected Coach Info */}
        <div className="w-96 bg-muted/20 rounded-xl p-8 border border-muted/20 flex flex-col justify-between relative overflow-hidden h-80">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 opacity-30">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          
          {/* Content - positioned above background, distributed vertically */}
          <div className={`transition-opacity duration-300 ${isChanging ? 'opacity-50' : 'opacity-100'} relative z-10 flex flex-col justify-between h-full`}>
            {/* Top - Name */}
            <div>
              <h2 className="text-4xl font-bold text-white">{selected.name}</h2>
            </div>
            
            {/* Middle - Role */}
            <div>
              <p className="text-lg text-muted-foreground">{selected.role}</p>
            </div>
            
            {/* Bottom - Level Badge */}
            <div>
              <Badge className="text-sm bg-blue-500/40 text-blue-100 border-blue/50/60 border px-4 py-1">
                Nivel: {selected.level}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Panel - Grid of Circular Avatars */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-6">
            {INTERVIEWERS.map(interviewer => (
              <button
                key={interviewer.id}
                onClick={() => handleSelect(interviewer.id)}
                className="flex flex-col items-center gap-3 transition-all group"
              >
                {/* Circular Avatar with Gradient Background */}
                <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all ${
                  value === interviewer.id
                    ? 'border-white shadow-lg shadow-white/50 scale-110'
                    : 'border-muted/30 group-hover:border-white/50 group-hover:scale-105'
                }`}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${interviewer.color} opacity-40`} />
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={interviewer.image}
                      alt={interviewer.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                </div>

                {/* Name and Level */}
                <div className="text-center">
                  <p className="font-semibold text-white text-sm">{interviewer.name}</p>
                  <p className="text-xs text-muted-foreground">{interviewer.level}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
