'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day18ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day18Experience({ onComplete, userId }: Day18ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState('')
  const [professionalSummary, setProfessionalSummary] = useState('')
  const sb = createClient()

  useEffect(() => {
    if (userId) {
      loadPriorData()
    }
  }, [userId])

  const loadPriorData = async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      // Load CV skeleton to get professional title
      const { data: skeleton } = await sb
        .from('a2_cv_skeleton_data')
        .select('professional_title')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (skeleton?.professional_title) {
        setSummary(skeleton.professional_title)
      }
    } catch (err) {
      console.error('[v0] Error loading prior data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    try {
      // Simple professional summary template based on title
      const template = `${summary}. Con experiencia en transformar desafíos en oportunidades. Especializado en crear impacto medible a través de colaboración estratégica y ejecución enfocada.`
      setProfessionalSummary(template)
      setStep(2)
    } catch (err) {
      setError('Error generando resumen.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteSummary = async () => {
    setIsSubmitting(true)
    try {
      if (!userId) throw new Error('No user ID')

      const { error: err } = await sb.from('a2_cv_skeleton_data').insert({
        user_id: userId,
        day_number: 18,
        professional_summary: professionalSummary,
        summary_complete: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (err && err.code !== '23505') {
        // Update existing record
        await sb
          .from('a2_cv_skeleton_data')
          .update({
            professional_summary: professionalSummary,
            summary_complete: true,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('day_number', 17)
      }

      await onComplete({
        dayNumber: 18,
        summary: professionalSummary,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error saving summary:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tu información...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
          <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-500 flex-shrink-0 mt-0.5" />
          <p className="text-[rgb(80,160,170)]-500">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Tu Resumen Profesional</h2>
            <p className="text-white/70 text-lg">Un párrafo que resume quién eres profesionalmente</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-3">Qué es un Resumen Profesional Fuerte</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Responde: ¿Quién eres? ¿Qué haces? ¿Por qué importa?</li>
              <li>• Entre 2-4 líneas (30-40 palabras)</li>
              <li>• Usa tu título + contexto + valor</li>
              <li>• Evita descripciones genéricas</li>
              <li>• Refleja tu identidad profesional</li>
            </ul>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <p className="text-white/80 text-sm mb-4">
              Vamos a crear tu resumen usando tu título profesional y tu identidad de valor.
            </p>
            <p className="text-white font-semibold text-sm mb-1">Tu Título:</p>
            <p className="text-white text-sm">{summary}</p>
          </div>

          <Button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Generando...' : 'Generar Resumen Profesional'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Resumen Generado</h2>
            <p className="text-white/70">Edita si lo necesitas</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <textarea
              value={professionalSummary}
              onChange={(e) => setProfessionalSummary(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
              rows={4}
            />
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-white font-semibold text-sm mb-2">Consejos de Edición</p>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• ¿Usa verbos activos?</li>
              <li>• ¿Muestra tu valor único?</li>
              <li>• ¿Es fácil de recordar?</li>
            </ul>
          </div>

          <Button
            onClick={handleCompleteSummary}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 18 - Resumen Profesional'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
