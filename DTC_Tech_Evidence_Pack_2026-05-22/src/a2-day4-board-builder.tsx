'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'
import type { CandidateBoard } from '@/lib/supabase/a2-market-and-board'

interface Day4BoardBuilderProps {
  candidateBoard: CandidateBoard
  onBuildBoard: (data: Partial<CandidateBoard>) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day4BoardBuilder({
  candidateBoard,
  onBuildBoard,
  isLoading,
  onNext,
}: Day4BoardBuilderProps) {
  const [formData, setFormData] = useState({
    column_1_quien_soy: candidateBoard.column_1_quien_soy || '',
    column_2_que_quiere: candidateBoard.column_2_que_quiere || '',
    column_3_que_prueba: candidateBoard.column_3_que_prueba || '',
    column_4_que_falta: candidateBoard.column_4_que_falta || '',
    candidate_hypothesis: candidateBoard.candidate_hypothesis || '',
    candidate_archetype: candidateBoard.candidate_archetype || '',
  })

  const handleSubmit = async () => {
    await onBuildBoard(formData)
    onNext()
  }

  const columns = [
    {
      title: 'QUIÉN SOY (Tu Realidad)',
      key: 'column_1_quien_soy',
      color: 'rgb(90, 90, 150)',
      description: 'De tu visión (Día 1) + evidencia (Día 2): tus fortalezas reales, experiencias clave',
      placeholder: 'ej: Soy PM con 5+ años en B2B SaaS, especialista en onboarding y retention...',
    },
    {
      title: 'QUÉ QUIERE MERCADO (Necesidad Real)',
      key: 'column_2_que_quiere',
      color: 'rgb(80, 160, 170)',
      description: 'De tus señales (Día 3): lo que los empleadores buscan activamente',
      placeholder: 'ej: Buscan líderes con profundo analytics, experiencia en scaling, mentoring...',
    },
    {
      title: 'QUÉ TENGO PROBADO (Tu Evidencia)',
      key: 'column_3_que_prueba',
      color: 'rgb(34, 197, 94)',
      description: 'De tu Bóveda (Día 2): pruebas concretas que tienes ahora',
      placeholder: 'ej: 3 productos lanzados, 1M+ usuarios, 40% retention improvement...',
    },
    {
      title: 'QUÉ FALTA (Tu Brecha Real)',
      key: 'column_4_que_falta',
      color: 'rgb(239, 68, 68)',
      description: 'Diferencia entre lo que eres y lo que el mercado quiere',
      placeholder: 'ej: Profundidad en A/B testing, cohort analysis, ML fundamentals...',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Construir Tu Tablero</h2>
        <p className="text-white/70">Llena cada columna con honestidad. Es tu mapa de candidatura.</p>
      </div>

      <div className="space-y-6">
        {columns.map((col) => (
          <div
            key={col.key}
            className="rounded-lg p-4 border-2 space-y-3"
            style={{ borderColor: `${col.color}40`, backgroundColor: `${col.color}08` }}
          >
            <div>
              <h3 className="text-white font-semibold mb-1" style={{ color: col.color }}>
                {col.title}
              </h3>
              <p className="text-white/60 text-xs">{col.description}</p>
            </div>

            <textarea
              value={formData[col.key as keyof typeof formData]}
              onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
              placeholder={col.placeholder}
              className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40 resize-none focus:outline-none"
              style={{
                backgroundColor: `${col.color}15`,
                border: `1px solid ${col.color}40`,
              }}
              rows={3}
            />
          </div>
        ))}
      </div>

      <div
        className="rounded-lg p-6 border-2 border-purple-500/40 space-y-3"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.08)' }}
      >
        <h3 className="text-white font-semibold">Tu Hipótesis de Candidatura</h3>
        <p className="text-white/60 text-sm">
          Basada en tu tablero, escribe una frase que capture quién eres como candidato y a qué posiciones aspiras:
        </p>
        <textarea
          value={formData.candidate_hypothesis}
          onChange={(e) => setFormData({ ...formData, candidate_hypothesis: e.target.value })}
          placeholder="ej: Soy un líder de producto especializado en B2B SaaS con foco en crecimiento y retención. Busco rol de Director/VP Product en startups Series B+ donde pueda mentorear y escalar productos globalmente."
          className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40 resize-none focus:outline-none"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          isLoading ||
          !formData.column_1_quien_soy.trim() ||
          !formData.column_2_que_quiere.trim() ||
          !formData.column_3_que_prueba.trim() ||
          !formData.column_4_que_falta.trim()
        }
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Guardando tablero...
          </>
        ) : (
          <>
            Ver Resumen
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
