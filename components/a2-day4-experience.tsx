'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check, Loader, AlertCircle } from 'lucide-react'
import { Day4BoardBuilder } from './a2-day4-board-builder'
import { Day4BoardReview } from './a2-day4-board-review'
import {
  createCandidateBoard,
  getCandidateBoard,
  updateCandidateBoard,
  type CandidateBoard,
} from '@/lib/supabase/a2-market-and-board'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day4ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day4Experience({ onComplete, userId }: Day4ExperienceProps) {
  const [step, setStep] = useState(1)
  const [candidateBoard, setCandidateBoard] = useState<Partial<CandidateBoard>>({
    column_1_quien_soy: '',
    column_2_que_quiere: '',
    column_3_que_prueba: '',
    column_4_que_falta: '',
    candidate_hypothesis: '',
    candidate_archetype: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)

  // Load existing board data on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay4(travisMode)
    }
  }, [userId])

  const initializeDay4 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      // Auto-seed Travis data if in dev mode
      if (travisMode) {
        await ensureTravisDataForDay(userId, 4)
      }
      
      await loadDay4Data()
    } catch (err) {
      console.error('[v0] Error initializing Day 4:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay4Data = async () => {
    if (!userId) return
    try {
      const { data: board, error: boardError } = await getCandidateBoard(userId, 4)
      if (boardError && boardError.code !== 'PGRST116') throw boardError
      if (board) {
        setCandidateBoard(board)
        setStep(2) // If board exists, go to review step
      }
    } catch (err) {
      console.error('[v0] Error loading Day 4 data:', err)
      // Ignore "not found" errors for new users
    }
  }

  const handleBuildBoard = async (data: Partial<CandidateBoard>) => {
    if (!userId) return

    setIsLoading(true)
    try {
      // Check if board already exists
      const { data: existingBoard } = await getCandidateBoard(userId, 4)

      let result
      if (existingBoard) {
        const { data: updated, error } = await updateCandidateBoard(
          existingBoard.id,
          userId,
          {
            column_1_quien_soy: data.column_1_quien_soy,
            column_2_que_quiere: data.column_2_que_quiere,
            column_3_que_prueba: data.column_3_que_prueba,
            column_4_que_falta: data.column_4_que_falta,
            candidate_hypothesis: data.candidate_hypothesis,
            candidate_archetype: data.candidate_archetype,
          }
        )
        if (error) throw error
        result = updated
      } else {
        const { data: created, error } = await createCandidateBoard(userId, {
          day_number: 4,
          column_1_quien_soy: data.column_1_quien_soy || '',
          column_2_que_quiere: data.column_2_que_quiere || '',
          column_3_que_prueba: data.column_3_que_prueba || '',
          column_4_que_falta: data.column_4_que_falta || '',
          candidate_hypothesis: data.candidate_hypothesis || '',
          candidate_archetype: data.candidate_archetype || '',
          status: 'in_progress',
        })
        if (error) throw error
        result = created
      }

      if (result) {
        setCandidateBoard(result)
        setStep(2)
      }
    } catch (err) {
      console.error('[v0] Error building board:', err)
      setError('Error al guardar el tablero.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 4,
        candidateBoard,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 4:', err)
      setError('Error al completar el día.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4">
      {/* Dev Mode Badge */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50 bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Travis Dev Mode - Tablero Pre-cargado
        </div>
      )}

      {error && (
        <div className="rounded-lg p-4 border border-red-500/40" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {isLoading && step === 1 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/70">Cargando tu tablero...</p>
        </div>
      )}

      {step === 1 && !isLoading && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">El Tablero del Candidato</h2>
            <p className="text-white/70">Integra todo lo que aprendiste en 4 columnas de verdad</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">El Tablero de 4 Columnas</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded text-sm" style={{ backgroundColor: 'rgba(90, 90, 150, 0.3)', color: 'rgb(90, 90, 150)' }}>
                <span className="font-semibold">1. Quién Soy</span>
                <p className="text-xs mt-1 opacity-70">De tu visión (Día 1)</p>
              </div>
              <div className="p-3 rounded text-sm" style={{ backgroundColor: 'rgba(80, 160, 170, 0.3)', color: 'rgb(80, 160, 170)' }}>
                <span className="font-semibold">2. Qué Quiere Mercado</span>
                <p className="text-xs mt-1 opacity-70">De tus señales (Día 3)</p>
              </div>
              <div className="p-3 rounded text-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)', color: 'rgb(34, 197, 94)' }}>
                <span className="font-semibold">3. Qué Tengo Probado</span>
                <p className="text-xs mt-1 opacity-70">De tu evidencia (Día 2)</p>
              </div>
              <div className="p-3 rounded text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.3)', color: 'rgb(239, 68, 68)' }}>
                <span className="font-semibold">4. Qué Falta</span>
                <p className="text-xs mt-1 opacity-70">Brecha real a llenar</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              Llenaremos este tablero con información real de los días anteriores + tu análisis, creando tu hipótesis de candidato.
            </p>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Construir el Tablero
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <Day4BoardBuilder
          candidateBoard={candidateBoard as CandidateBoard}
          onBuildBoard={handleBuildBoard}
          isLoading={isLoading}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Day4BoardReview
          candidateBoard={candidateBoard as CandidateBoard}
          onComplete={handleCompleteDay}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}


