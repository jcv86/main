'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

const INTERVIEWERS = [
  { id: 'interviewer-classic-1', name: 'Sofia', role: 'Reclutadora Senior', level: 'Básico', image: '/images/interviewers/sofia.jpg' },
  { id: 'interviewer-classic-2', name: 'Marco', role: 'Manager Senior Ingeniería', level: 'Intermedio', image: '/images/interviewers/marco.jpg' },
  { id: 'interviewer-classic-3', name: 'Elena', role: 'VP Talent & Culture', level: 'Intermedio+', image: '/images/interviewers/elena.jpg' },
  { id: 'interviewer-classic-4', name: 'David', role: 'Tech Lead & Architect', level: 'Intermedio+', image: '/images/interviewers/david.jpg' },
  { id: 'interviewer-modern-1', name: 'Alex', role: 'Product Manager', level: 'Avanzado', image: '/images/interviewers/alex.jpg' },
  { id: 'interviewer-modern-2', name: 'Jordan', role: 'CEO Advisor', level: 'Avanzado', image: '/images/interviewers/jordan.jpg' }
]

interface InterviewerSelectorProps {
  value?: string
  onChange: (interviewerId: string) => void
  compact?: boolean
}

export function InterviewerSelector({ value, onChange, compact = false }: InterviewerSelectorProps) {
  const selected = INTERVIEWERS.find(i => i.id === value) || INTERVIEWERS[0]

  if (compact) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Tu Entrevistador</label>
        <div className="grid grid-cols-3 gap-2">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => onChange(interviewer.id)}
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
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-foreground">Selecciona tu Entrevistador</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Elige un perfil profesional diferente para tener perspectivas variadas
        </p>
      </div>

      {/* Layout: Navbar Vertical + Foto Grande */}
      <div className="flex gap-6">
        {/* Navbar Vertical - Izquierda */}
        <div className="flex flex-col gap-2 w-32">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => onChange(interviewer.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                value === interviewer.id
                  ? 'bg-blue-500/20 border-2 border-blue-500'
                  : 'bg-muted/10 border-2 border-transparent hover:bg-muted/20'
              }`}
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-muted">
                <Image
                  src={interviewer.image}
                  alt={interviewer.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="text-center min-w-0">
                <p className="font-semibold text-foreground text-xs">{interviewer.name}</p>
                <p className="text-[10px] text-muted-foreground">{interviewer.level}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Foto Grande - Derecha */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-muted/20 to-muted/5 border border-muted/20 rounded-xl overflow-hidden">
            <div className="relative w-full h-96 bg-muted">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
            
            {/* Info abajo de la foto */}
            <div className="p-6 space-y-2">
              <h4 className="text-2xl font-bold text-foreground">{selected.name}</h4>
              <p className="text-sm text-muted-foreground">{selected.role}</p>
              <Badge className="mt-3 bg-blue-500/30 text-blue-700 border-blue-500/50 border">
                {selected.level}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
