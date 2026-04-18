'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

const INTERVIEWERS = [
  { id: 'interviewer-classic-1', name: 'Sofia', role: 'Reclutadora', color: 'from-purple-400400' },
  { id: 'interviewer-classic-2', name: 'Marco', role: 'Manager Senior', color: 'from-blue-400400' },
  { id: 'interviewer-classic-3', name: 'Elena', role: 'VP Talent', color: 'from-emerald-400400' },
  { id: 'interviewer-classic-4', name: 'David', role: 'Tech Lead', color: 'from-orange-400400' },
  { id: 'interviewer-modern-1', name: 'Alex', role: 'Product Manager', color: 'from-indigo-400400' },
  { id: 'interviewer-modern-2', name: 'Jordan', role: 'Consultor CEO', color: 'from-pink-400400' }
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
        <label className="text-sm font-semibold text-muted/70 dark:text-muted/30">Tu Entrevistador</label>
        <div className="grid grid-cols-3 gap-2">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => onChange(interviewer.id)}
              className={`p-2 rounded-lg transition-all text-center ${`}
                value === interviewer.id
                  ? 'ring-2 ring-blue-500 bg-blue/5 dark:bg-blue/30'
                  : 'hover:bg-transparent dark:hover:bg-muted/80'
              }`}
            >
              <div className={`w-8 h-8 rounded-full mx-auto mb-1 bg-background`}
              <div className="text-xs font-semibold text-muted/90 dark:text-white">{interviewer.name}</div>
              <div className="text-[10px] text-muted/60 dark:text-muted/40">{interviewer.role}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-background">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted/70 dark:text-muted/30">Elige tu Entrevistador</label>
          <p className="text-sm text-muted/60 dark:text-muted/40">
            Selecciona un perfil profesional diferente para tener perspectivas variadas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INTERVIEWERS.map(interviewer => (
            <button
              key={interviewer.id}
              onClick={() => onChange(interviewer.id)}
              className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${`}
                value === interviewer.id
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'hover:scale-102 hover:shadow-lg'
              }`}
            >
              <div className={`absolute inset-0 bg-background`}
              <div className="relative space-y-2 text-center">`}
                <div className={`w-12 h-12 rounded-full mx-auto bg-background`}
                <div>
                  <div className="font-bold text-muted/90 dark:text-white">{interviewer.name}</div>
                  <div className="text-xs text-muted/60 dark:text-muted/40">{interviewer.role}</div>
                </div>
                {value === interviewer.id && (
                  <Badge className="mx-auto mt-2 bg-blue/50 text-white">Seleccionado</Badge>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Current selection info */}
        <div className="mt-6 p-4 bg-white dark:bg-muted-950 rounded-[28px] border border-muted/20 dark:border-muted/70">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted/60 dark:text-muted/40">Entrevistador seleccionado:</p>
              <p className="font-semibold text-muted/90 dark:text-white flex items-center gap-2">
                <span className={`w-3 h-3 rounded-[20px] bg-background`}
                {selected.name} - {selected.role}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted/40" />
          </div>
        </div>
      </div>
    </Card>
  )
}
