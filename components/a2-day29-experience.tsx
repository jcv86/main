'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day29ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface FoundationAsset {
  name: string
  status: 'complete' | 'partial' | 'missing' | 'needs_revision'
}

export function Day29Experience({ onComplete, userId }: Day29ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [assets, setAssets] = useState<FoundationAsset[]>([
    { name: 'Roadmap aprobado', status: 'complete' },
    { name: 'Bóveda de Evidencia', status: 'complete' },
    { name: 'Reporte de Señales del Mercado', status: 'complete' },
    { name: 'Tablero del Candidato', status: 'partial' },
    { name: 'Introducción Profesional v1', status: 'complete' },
    { name: 'Identidad Profesional v1', status: 'complete' },
    { name: 'Career Mirror Card', status: 'complete' },
    { name: 'Achievement Bank', status: 'complete' },
    { name: 'Proof Map', status: 'complete' },
    { name: 'CV Skeleton', status: 'complete' },
    { name: 'CV Draft', status: 'complete' },
    { name: 'Recruiter Notes', status: 'complete' },
  ])

  const [portfolioSummary, setPortfolioSummary] = useState({
    whoYouAre: 'Eres un profesional en formación con experiencia operativa sólida y habilidades de organización y coordinación.',
    provableValue: [
      'Capacidad de coordinación operativa',
      'Organización de procesos',
      'Atención al detalle',
      'Comunicación clara',
    ],
    marketSignals: ['organización', 'coordinación', 'eficiencia', 'atención al cliente'],
    nextSteps: 'Los próximos 60 días: Alineación de mercado, construcción de respuestas para entrevistas, práctica de entrevistas y conexiones de red.',
  })

  const sb = createClient()

  const generatePortfolio = async () => {
    setIsLoading(true)
    try {
      // In production, load actual assets from database
      setStep(2)
    } catch (err) {
      console.error('[v0] Error generating portfolio:', err)
      setError('No pudimos generar el portafolio.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId) {
        const { error: err } = await sb.from('a2_foundation_portfolio').insert({
          user_id: userId,
          day_number: 29,
          assets_included: assets.map((a) => a.name),
          complete_assets: assets.filter((a) => a.status === 'complete').map((a) => a.name),
          partial_assets: assets.filter((a) => a.status === 'partial').map((a) => a.name),
          missing_assets: assets.filter((a) => a.status === 'missing').map((a) => a.name),
          needs_revision_assets: assets.filter((a) => a.status === 'needs_revision').map((a) => a.name),
          who_you_are: portfolioSummary.whoYouAre,
          provable_value: portfolioSummary.provableValue,
          market_signals: portfolioSummary.marketSignals,
          next_steps_month_2: portfolioSummary.nextSteps,
          portfolio_content: portfolioSummary,
          saved_externally: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 29,
        portfolio: portfolioSummary,
        assets,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 29:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusColors = {
    complete: 'rgb(80, 160, 170)',
    partial: 'rgb(255, 193, 7)',
    missing: 'rgb(220, 38, 38)',
    needs_revision: 'rgb(236, 72, 153)',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Portafolio de Fundación</h2>
            <p className="text-white/70 text-lg">Reúne todo lo que construiste en 29 días. Esta es tu prueba visible de progreso.</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Activos de Mes 1</h3>
            <div className="space-y-2">
              {assets.map((asset, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {asset.status === 'complete' && (
                    <CheckCircle2 className="w-4 h-4" style={{ color: statusColors.complete }} />
                  )}
                  {asset.status === 'partial' && (
                    <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: statusColors.partial }} />
                  )}
                  {asset.status === 'missing' && (
                    <AlertCircle className="w-4 h-4" style={{ color: statusColors.missing }} />
                  )}
                  <span className="text-white/80 text-sm">{asset.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={generatePortfolio}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Generando...' : 'Generar Portafolio de Fundación'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Portafolio de Fundación</h2>
            <p className="text-white/70">Base profesional construida en 29 días</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Quién Eres</h3>
            <p className="text-white/85 text-sm">{portfolioSummary.whoYouAre}</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Valor Comprobable</h3>
            <ul className="space-y-2">
              {portfolioSummary.provableValue.map((value, idx) => (
                <li key={idx} className="text-white/80 text-sm">• {value}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Señales del Mercado</h3>
            <div className="flex flex-wrap gap-2">
              {portfolioSummary.marketSignals.map((signal, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-white/80 text-xs" style={{ backgroundColor: 'rgba(80, 160, 170, 0.3)' }}>
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-white font-semibold mb-2">Próximos 60 Días</p>
            <p className="text-white/85 text-sm">{portfolioSummary.nextSteps}</p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 29'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
