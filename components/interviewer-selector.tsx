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

      {/* Navbar Horizontal */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {INTERVIEWERS.map(interviewer => (
          <button
            key={interviewer.id}
            onClick={() => onChange(interviewer.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all flex-shrink-0 whitespace-nowrap ${
              value === interviewer.id
                ? 'bg-blue-500/20 border-2 border-blue-500'
                : 'bg-muted/10 border-2 border-transparent hover:bg-muted/20'
            }`}
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-muted">
              <Image
                src={interviewer.image}
                alt={interviewer.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="text-left min-w-0">
              <p className="font-semibold text-foreground text-sm">{interviewer.name}</p>
              <p className="text-xs text-muted-foreground">{interviewer.level}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Coach Info Card */}
      <div className="bg-gradient-to-br from-muted/20 to-muted/5 border border-muted/20 rounded-2xl p-6 flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-muted">
          <Image
            src={selected.image}
            alt={selected.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-foreground">{selected.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">{selected.role}</p>
          <Badge className="mt-3 bg-blue-500/30 text-blue-700 border-blue-500/50 border">
            {selected.level}
          </Badge>
        </div>
      </div>
    </div>
  )
}
