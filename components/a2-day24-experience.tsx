'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day24ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day24Experience({ onComplete, userId }: Day24ExperienceProps) {
  const [step, setStep] = useState(1)
  const [improvements, setImprovements] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sb = createClient()

  const criticalIssues = [
    'Claridad: El perfil debe ser evidente en 10 segundos',
    'Estructura: Secciones deben fluir lógicamente',
    'Especificidad: Evitar generalidades sin ejemplos',
  ]

  const recommendedImprovements = [
    'Fortalecer resultados con números',
    'Hacer bullets más concisos',
    'Consistencia de verbos de acción',
  ]

  const optionalPolish = [
    'Agregar certificaciones relevantes',
    'Mejorar formato visual',
    'Incluir URL de portfolio',
  ]

  const toggleImprovement = (improvement: string) => {
    if (improvements.includes(improvement)) {
      setImprovements(improvements.filter(i => i !== improvement))
    } else {
      setImprovements([...improvements, improvement])
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId) {
        const { error: err } = await sb.from('a2_cv_stress_test').insert({
          user_id: userId,
          day_number: 24,
          clarity_score: 7,
          structure_score: 7,
          specificity_score: 6,
          evidence_score: 7,
          market_alignment_score: 8,
          quick_scan_score: 7,
          professional_language_score: 8,
          overall_score: 7,
          critical_issues: criticalIssues,
          recommended_improvements: recommendedImprovements,
          improvements_applied: improvements.length,
          test_completed: true,
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 24,
        improvementsApplied: improvements.length,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 24:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Prueba de Estrés del CV</h2>
            <p className="text-white/70 text-lg">Somete tu CV a presión antes de exportarlo</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Puntuación General: 7/10</h3>
            <div className="space-y-3 text-white/80 text-sm">
              <p>Claridad: 7/10</p>
              <p>Estructura: 7/10</p>
              <p>Especificidad: 6/10</p>
              <p>Evidencia: 7/10</p>
              <p>Alineación con mercado: 8/10</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3 text-red-500">Puntos Críticos (Debe Arreglarse)</h3>
              <div className="space-y-2">
                {criticalIssues.map((issue, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 rounded" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
                    <input
                      type="checkbox"
                      onChange={() => toggleImprovement(issue)}
                      className="w-4 h-4"
                    />
                    <span className="text-white/80 text-sm">{issue}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-yellow-500">Mejoras Recomendadas</h3>
              <div className="space-y-2">
                {recommendedImprovements.map((issue, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 rounded" style={{ backgroundColor: 'rgba(180, 140, 0, 0.1)' }}>
                    <input
                      type="checkbox"
                      onChange={() => toggleImprovement(issue)}
                      className="w-4 h-4"
                    />
                    <span className="text-white/80 text-sm">{issue}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <p className="text-white/80 text-sm">
              Aplica al menos 3 mejoras antes de continuar. Esto asegura que tu CV está verdaderamente listo.
            </p>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={improvements.length < 3}
            className="w-full py-6 text-white font-semibold rounded-full disabled:opacity-50"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {improvements.length < 3 ? `Aplica 3 mejoras (${improvements.length}/3)` : 'Continuar'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Reporte Listo</h2>
            <p className="text-white/70">{improvements.length} mejoras aplicadas al CV</p>
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-3">Tu CV Pasó la Prueba de Estrés</p>
            <p className="text-white/85 text-sm leading-relaxed">
              Un CV fuerte no es el que suena más elegante. Es el que permite al reclutador entender rápido por qué este perfil puede tener sentido para el rol. Tu CV ahora cumple ese criterio.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 24'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
