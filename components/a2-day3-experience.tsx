'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Sparkles, Loader, AlertCircle } from 'lucide-react'
import { Day3JobSearch } from './a2-day3-job-search'
import { Day3SignalExtraction } from './a2-day3-signal-extraction'
import { Day3CoachAnalysis } from './a2-day3-coach-analysis'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'
import {
  createMarketSignal,
  createExtractedSignal,
  getMarketSignals,
  getExtractedSignals,
  type MarketSignal,
  type ExtractedSignal,
} from '@/lib/supabase/a2-market-and-board'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'

interface Day3ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day3Experience({ onComplete, userId }: Day3ExperienceProps) {
  const [step, setStep] = useState(1)
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([])
  const [extractedSignals, setExtractedSignals] = useState<ExtractedSignal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)

  // Load existing data on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay3(travisMode)
    }
  }, [userId])

  const initializeDay3 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      // Auto-seed Travis data if in dev mode
      if (travisMode) {
        await ensureTravisDataForDay(userId, 3)
      }
      
      await loadDay3Data()
    } catch (err) {
      console.error('[v0] Error initializing Day 3:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay3Data = async () => {
    if (!userId) return
    try {
      const { data: signals, error: signalsError } = await getMarketSignals(userId, 3)
      if (signalsError) throw signalsError
      setMarketSignals(signals || [])

      const { data: extracted, error: extractedError } = await getExtractedSignals(userId, 3)
      if (extractedError) throw extractedError
      setExtractedSignals(extracted || [])
    } catch (err) {
      console.error('[v0] Error loading Day 3 data:', err)
      setError('Error cargando datos. Intenta nuevamente.')
    }
  }

  const handleAddJobPosting = async (jobData: {
    job_title: string
    company_name: string
    job_url?: string
    requirements: string[]
    fears_skills: string[]
    strengths_needed: string[]
    salary_range?: string
    location?: string
    industry?: string
  }) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const { data: newSignal, error } = await createMarketSignal(userId, {
        day_number: 3,
        ...jobData,
      })

      if (error) throw error
      if (newSignal) {
        setMarketSignals((prev) => [newSignal, ...prev])
      }
    } catch (err) {
      console.error('[v0] Error adding job posting:', err)
      setError('Error al guardar la vacante.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExtractSignals = async () => {
    if (!userId || marketSignals.length === 0) return

    setIsLoading(true)
    try {
      // Call API to extract signals using OpenAI
      const response = await fetch('/api/a2/extract-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketSignals,
          userId,
          dayNumber: 3,
        }),
      })

      if (!response.ok) throw new Error('Failed to extract signals')

      const { signals: extracted } = await response.json()
      setExtractedSignals(extracted)
      setStep(3)
    } catch (err) {
      console.error('[v0] Error extracting signals:', err)
      setError('Error extrayendo señales del mercado.')
      setStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    const submission = {
      dayNumber: 3,
      marketSignals,
      extractedSignals,
      completedAt: new Date().toISOString(),
    }
    try {
      // Save to DTC documents
      if (userId) {
        await saveDayDocument(
          userId,
          3,
          'market_signal',
          formatDocumentContent(submission),
          'Señales del Mercado - Day 3'
        )
      }

      await onComplete(submission)
    } catch (err) {
      console.error('[v0] Error completing Day 3:', err)
      setError('Error al completar el día.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {/* Dev Mode Badge */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50 bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Travis Dev Mode - Datos Auto-cargados
        </div>
      )}

      {error && (
        <div className="rounded-lg p-4 border border-[rgb(80,160,170)]-500/40" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-400 flex-shrink-0 mt-0.5" />
            <p className="text-[rgb(80,160,170)]-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">El Espejo del Mercado</h2>
            <p className="text-white/70">Descubre qué busca realmente el mercado por ti</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">¿Qué vas a hacer hoy?</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Buscar 3 vacantes reales en tu industria</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Extraer requisitos, miedos y fortalezas pedidas</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Generar reporte de señales del mercado (skills repetidas, tools, soft skills)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Recibir feedback de Coach sobre brecha real</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Comenzar búsqueda de mercado
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Day3JobSearch
            marketSignals={marketSignals}
            onAddJobPosting={handleAddJobPosting}
            isLoading={isLoading}
            onNext={handleExtractSignals}
            jobsCount={marketSignals.length}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Day3SignalExtraction
            extractedSignals={extractedSignals}
            marketSignals={marketSignals}
            isLoading={isLoading}
            onNext={() => setStep(4)}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <Day3CoachAnalysis
            marketSignals={marketSignals}
            extractedSignals={extractedSignals}
            onComplete={handleCompleteDay}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  )
}
