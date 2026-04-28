'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { INTERVIEWER_AGENTS } from '@/lib/interviewer-agents'

const INTERVIEWERS = [
  { id: 'interviewer-classic-1', name: 'Sofia', role: 'Reclutadora Senior', level: 'Básico', image: '/images/interviewers/sofia.jpg' },
  { id: 'interviewer-classic-2', name: 'Marco', role: 'Manager Senior de Ingeniería', level: 'Intermedio', image: '/images/interviewers/marco.jpg' },
  { id: 'interviewer-classic-3', name: 'Elena', role: 'VP Talent & Culture', level: 'Intermedio+', image: '/images/interviewers/elena.jpg' },
  { id: 'interviewer-classic-4', name: 'David', role: 'Tech Lead & Architect', level: 'Intermedio+', image: '/images/interviewers/david.jpg' },
  { id: 'interviewer-modern-1', name: 'Alex', role: 'Product Manager', level: 'Avanzado', image: '/images/interviewers/alex.jpg' },
  { id: 'interviewer-modern-2', name: 'Jordan', role: 'CEO Advisor & Consultant', level: 'Avanzado', image: '/images/interviewers/jordan.jpg' }
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
        <label className="text-sm font-semibold text-muted-foreground dark:text-white/85">Tu Entrevistador</label>
        <div className="grid grid-cols-3 gap-2">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => onChange(interviewer.id)}
              className={`p-2 rounded-lg transition-all text-center ${
                value === interviewer.id
                  ? 'ring-2 ring-blue-500 bg-blue/5 dark:bg-blue/30'
                  : 'hover:bg-transparent dark:hover:bg-muted/80'
              }`}
            >
              <div className="relative w-8 h-8 rounded-full mx-auto mb-1 overflow-hidden bg-muted/20">
                <Image
                  src={interviewer.image}
                  alt={interviewer.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="text-xs font-semibold text-muted/90 dark:text-white">{interviewer.name}</div>
              <div className="text-[10px] text-muted-foreground dark:text-muted-foreground">{interviewer.role}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground dark:text-white/85">Selecciona tu Entrevistador</label>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
          Elige un perfil profesional diferente para tener perspectivas variadas
        </p>
      </div>

      {/* Main Content: Full Photo + Navbar */}
      <div className="space-y-4">
        {/* Full Photo Display */}
        <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 border border-muted/20">
          <Image
            src={selected.image}
            alt={selected.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold">{selected.name}</h3>
            <p className="text-white/90">{selected.role}</p>
            <Badge className="mt-3 bg-blue-500/80 text-white border-0">
              Nivel: {selected.level}
            </Badge>
          </div>
        </div>

        {/* Horizontal Navbar - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => onChange(interviewer.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                value === interviewer.id
                  ? 'bg-blue-500/20 ring-2 ring-blue-500 dark:bg-blue-500/30'
                  : 'bg-muted/10 hover:bg-muted/20 dark:bg-muted/20 dark:hover:bg-muted/30'
              }`}
            >
              <div className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                value === interviewer.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                  : 'border-muted/30'
              }`}>
                <Image
                  src={interviewer.image}
                  alt={interviewer.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">{interviewer.name}</p>
                <p className="text-[10px] text-muted-foreground">{interviewer.level}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Info */}
      <div className="p-4 bg-white dark:bg-muted-950 rounded-2xl border border-muted/20 dark:border-muted/70">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-muted/30">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">Entrevistador seleccionado:</p>
              <p className="font-semibold text-muted/90 dark:text-white">
                {selected.name}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
