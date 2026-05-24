'use client'

import { ChevronRight, Loader, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CandidateBoard } from '@/lib/supabase/a2-market-and-board'

interface Day4BoardReviewProps {
  candidateBoard: CandidateBoard
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

export function Day4BoardReview({
  candidateBoard,
  onComplete,
  isSubmitting,
}: Day4BoardReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Tu Tablero del Candidato - Resumen</h2>
        <p className="text-white/70">Tu mapa de candidatura en una página</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-lg p-6 border-2 space-y-2"
          style={{
            borderColor: 'rgba(80, 160, 170, 0.2)',
            backgroundColor: 'rgba(90, 90, 150, 0.08)',
          }}
        >
          <p className="text-xs font-semibold text-white/60 uppercase">QUIÉN SOY</p>
          <p className="text-white text-sm leading-relaxed">{candidateBoard.column_1_quien_soy}</p>
        </div>

        <div
          className="rounded-lg p-6 border-2 space-y-2"
          style={{
            borderColor: 'rgba(80, 160, 170, 0.4)',
            backgroundColor: 'rgba(80, 160, 170, 0.08)',
          }}
        >
          <p className="text-xs font-semibold text-white/60 uppercase">QUÉ QUIERE MERCADO</p>
          <p className="text-white text-sm leading-relaxed">{candidateBoard.column_2_que_quiere}</p>
        </div>

        <div
          className="rounded-lg p-6 border-2 space-y-2"
          style={{
            borderColor: 'rgba(34, 197, 94, 0.4)',
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
          }}
        >
          <p className="text-xs font-semibold text-white/60 uppercase">QUÉ TENGO PROBADO</p>
          <p className="text-white text-sm leading-relaxed">{candidateBoard.column_3_que_prueba}</p>
        </div>

        <div
          className="rounded-lg p-6 border-2 space-y-2"
          style={{
            borderColor: 'rgba(239, 68, 68, 0.4)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
          }}
        >
          <p className="text-xs font-semibold text-white/60 uppercase">QUÉ FALTA</p>
          <p className="text-white text-sm leading-relaxed">{candidateBoard.column_4_que_falta}</p>
        </div>
      </div>

      <div
        className="rounded-lg p-8 border-2 border-cyan-400/40 space-y-4"
        style={{ backgroundColor: 'rgba(80, 160, 170, 0.08)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'rgb(80, 160, 170)' }} className="text-lg">
            🎯
          </span>
          <h3 className="text-lg font-semibold text-cyan-300">TU HIPÓTESIS DE CANDIDATURA v1</h3>
        </div>

        <p className="text-white/90 text-lg leading-relaxed font-medium">{candidateBoard.candidate_hypothesis}</p>

        <div className="border-t border-cyan-300/20 pt-4 mt-4">
          <p className="text-white/80 text-sm">
            Esta hipótesis es el corazón de tu candidatura. Es específica, creíble, y basada en tu investigación real de los primeros 4 días.
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
        <p className="text-sm font-semibold text-purple-300 mb-3">Lo que hiciste en estos 4 días:</p>
        <div className="space-y-2 text-white/80 text-sm">
          <p className="flex gap-2">
            <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
            <span>Definiste tu visión y roadmap profesional (Día 1)</span>
          </p>
          <p className="flex gap-2">
            <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
            <span>Recopilaste evidencia real de tu trabajo (Día 2)</span>
          </p>
          <p className="flex gap-2">
            <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
            <span>Investigaste el mercado y extrajiste señales (Día 3)</span>
          </p>
          <p className="flex gap-2">
            <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
            <span>Creaste tu mapa de candidatura (Día 4)</span>
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r p-px rounded-lg" style={{ background: 'linear-gradient(90deg, rgba(90,90,150,0.2), rgba(80,160,170,0.2))' }}>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-white/80 text-sm leading-relaxed">
            <strong>Próximos pasos (Días 5-6):</strong> Forjarás tu Introducción Profesional testeable e identificarás tu Arquetipo de Identidad. Luego,
            en el Checkpoint A3 (Día 7), accederás al módulo avanzado de carrera para profundizar aún más.
          </p>
        </div>
      </div>

      <Button
        onClick={onComplete}
        disabled={isSubmitting}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Completando Día 4...
          </>
        ) : (
          <>
            Completar Día 4
            <Check className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
