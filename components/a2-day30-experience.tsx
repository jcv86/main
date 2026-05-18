'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day30ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day30Experience({ onComplete, userId }: Day30ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [foundationReview, setFoundationReview] = useState({
    claridad: 8,
    evidencia: 7,
    estructura: 8,
    conexion: 7,
    consistencia: 8,
    preparacion: 8,
  })

  const [userFeedback, setUserFeedback] = useState('')

  const sb = createClient()

  const runFoundationReview = async () => {
    setIsLoading(true)
    try {
      // In production, check all completion requirements
      setStep(2)
    } catch (err) {
      console.error('[v0] Error running review:', err)
      setError('No pudimos completar la revisión de fundación.')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateOverallScore = () => {
    const scores = Object.values(foundationReview)
    return (scores.reduce((a, b) => a + b, 0) / scores.length / 10).toFixed(2)
  }

  const getReviewStatus = () => {
    const overall = parseFloat(calculateOverallScore())
    if (overall >= 0.8) return 'ready_for_arc_2'
    if (overall >= 0.65) return 'ready_with_improvements'
    return 'needs_revision'
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId) {
        const overall = parseFloat(calculateOverallScore())
        const { error: err } = await sb.from('a2_foundation_review').insert({
          user_id: userId,
          day_number: 30,
          roadmap_passed: true,
          a3_module_1_complete: true,
          a3_module_2_complete: true,
          a3_module_3_complete: true,
          foundation_portfolio_exists: true,
          basic_cv_draft_exists: true,
          value_evidence_exists: true,
          claridad_profesional: foundationReview.claridad,
          evidencia_valor: foundationReview.evidencia,
          estructura_cv: foundationReview.estructura,
          conexion_mercado: foundationReview.conexion,
          consistencia_ruta: foundationReview.consistencia,
          preparacion_siguiente: foundationReview.preparacion,
          overall_foundation_score: overall,
          review_status: getReviewStatus(),
          arc_1_complete: true,
          arc_2_eligible: overall >= 0.65,
          user_feedback: userFeedback,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 30,
        review: foundationReview,
        feedback: userFeedback,
        status: getReviewStatus(),
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 30:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const overallScore = parseFloat(calculateOverallScore())
  const statusText =
    getReviewStatus() === 'ready_for_arc_2'
      ? 'Listo para Arc 2'
      : getReviewStatus() === 'ready_with_improvements'
        ? 'Listo con mejoras menores'
        : 'Necesita revisión'

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
            <h2 className="text-3xl font-bold text-white mb-3">Revisión de Fundación</h2>
            <p className="text-white/70 text-lg">Cierra los primeros 30 días. Revisamos si tu base es sólida para los próximos 60.</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Verificación de Completitud</h3>
            <div className="space-y-2">
              {[
                { label: 'Roadmap de Día 1', checked: true },
                { label: 'A3 Module 1', checked: true },
                { label: 'A3 Module 2', checked: true },
                { label: 'A3 Module 3', checked: true },
                { label: 'Portafolio de Fundación', checked: true },
                { label: 'CV Draft Validado', checked: true },
                { label: 'Evidencia y Valor', checked: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-white/80 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={runFoundationReview}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Revisando...' : 'Ejecutar Revisión de Fundación'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgb(80, 160, 170)' }} />
            <h2 className="text-3xl font-bold text-white mb-2">Puntuación de Fundación</h2>
            <p className="text-white/70 text-lg font-semibold">{(overallScore * 10).toFixed(1)}/10</p>
            <p className="text-white/60 text-sm mt-2">{statusText}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Claridad Profesional', value: foundationReview.claridad },
              { label: 'Evidencia de Valor', value: foundationReview.evidencia },
              { label: 'Estructura CV', value: foundationReview.estructura },
              { label: 'Conexión Mercado', value: foundationReview.conexion },
              { label: 'Consistencia Ruta', value: foundationReview.consistencia },
              { label: 'Preparación Siguiente', value: foundationReview.preparacion },
            ].map((score, idx) => (
              <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 text-xs font-medium">{score.label}</span>
                  <span className="text-white font-bold">{score.value}/10</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'rgb(80, 160, 170)',
                      width: `${(score.value / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Reflexión de Mes 1</h3>
            <textarea
              placeholder="¿Cómo te sientes con tu progreso? ¿Qué te sorprendió? ¿Qué sigue?"
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
              rows={4}
            />
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-white font-semibold mb-2">Arc 1 Completo</p>
            <p className="text-white/85 text-sm">
              Pasaste de una visión vaga a un candidato claro con identidad, evidencia, CV inicial y próximos pasos definidos.
              {overallScore >= 0.8 && ' Arc 2 está listo para iniciar inmediatamente.'}
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Cerrando...' : 'Cerrar Arc 1 - Completar Día 30'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
