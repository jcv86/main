'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

const INTERVIEWERS = [
  { id: 'interviewer-classic-1', name: 'Sofia', role: 'Reclutadora', level: 'Básico', description: 'Some description\nMaybe some more description', image: '/images/interviewers/sofia.jpg', color: 'from-green-500 to-green-600' },
  { id: 'interviewer-classic-2', name: 'Marco', role: 'Manager Senior', level: 'Intermedio', description: 'Some description\nMaybe some more description', image: '/images/interviewers/marco.jpg', color: 'from-yellow-500 to-yellow-600' },
  { id: 'interviewer-classic-3', name: 'Elena', role: 'VP Talent', level: 'Intermedio+', description: 'Some description\nMaybe some more description', image: '/images/interviewers/elena.jpg', color: 'from-purple-500 to-purple' },
  { id: 'interviewer-classic-4', name: 'David', role: 'Tech Lead', level: 'Intermedio', description: 'Some description\nMaybe some more description', image: '/images/interviewers/david.jpg', color: 'from-orange-500 to-orange-600' },
  { id: 'interviewer-modern-1', name: 'Alexandra', role: 'Director', level: 'Avanzado', description: 'Some description\nMaybe some more description', image: '/images/interviewers/alexandra.jpg', color: 'from-blue-500 to-blue-600' },
  { id: 'interviewer-modern-2', name: 'Bruno', role: 'Executive', level: 'Avanzado', description: 'Some description\nMaybe some more description', image: '/images/interviewers/bruno.jpg', color: 'from-red to-red' }
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

      {/* Main Layout: Portrait (Left) + Info (Left-Center) + Selection Grid (Right) */}
      <div className="flex gap-8 items-start">
        {/* Large Portrait Image - Left */}
        <div className={`relative w-56 aspect-[3/4] rounded-lg overflow-hidden border-2 border-muted/20 transition-opacity duration-300 flex-shrink-0 ${isChanging ? 'opacity-50' : 'opacity-100'}`}>
          <Image
            src={selected.image}
            alt={selected.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Profile Info - Left-Center */}
        <div className="flex flex-col justify-start gap-3 w-40 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">{selected.role}</p>
          </div>
          
          {/* Description */}
          {selected.description && (
            <div className="text-xs text-muted-foreground whitespace-pre-line leading-tight">
              {selected.description}
            </div>
          )}
          
          {/* Level Badge */}
          <Badge className="inline-block text-xs bg-muted/20 text-foreground border-muted/40 border px-2 py-1 w-fit">
            Nivel: {selected.level}
          </Badge>
        </div>

        {/* Right Panel - Selection Grid with Thumbnails */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            {INTERVIEWERS.map(interviewer => (
              <button
                key={interviewer.id}
                onClick={() => handleSelect(interviewer.id)}
                className={`flex flex-col items-center gap-2 transition-all group ${
                  value === interviewer.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {/* Thumbnail Portrait */}
                <div className={`relative w-32 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                  value === interviewer.id
                    ? 'border-white shadow-lg shadow-white/30 scale-105'
                    : 'border-muted/30 group-hover:border-white/50'
                }`}>
                  <Image
                    src={interviewer.image}
                    alt={interviewer.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                {/* Name and Level Label */}
                <div className="text-center w-full">
                  <p className="font-semibold text-white text-xs leading-tight">{interviewer.name}</p>
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
