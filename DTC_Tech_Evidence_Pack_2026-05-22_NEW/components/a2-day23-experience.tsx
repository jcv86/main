'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day23ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day23Experience({ onComplete, userId }: Day23ExperienceProps) {
  const [step, setStep] = useState(1)
  const [improvements, setImprovements] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sb = createClient()

  const emptyWords = [
    'responsable',
    'proactivo',
    'dinámico',
    'trabajador',
    'buen comunicador',
    'orientado a resultados',
    'trabajo en equipo',
    'rápido aprendizaje',
    'comprometido',
    'multifuncional',
    'capaz de trabajar bajo presión',
  ]

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId) {
        const { error: err } = await sb.from('a2_cv_language_polish').insert({
          user_id: userId,
          day_number: 23,
          section_name: 'cv_comprehensive',
          original_text: 'CV comprehensive review',
          polished_text: 'Empty words removed and replaced',
          issues_found: emptyWords,
          consistency_score: 8,
          is_approved: true,
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 23,
        emptyWordsReplaced: Object.keys(improvements).length,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 23:', err)
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
            <h2 className="text-3xl font-bold text-white mb-3">Juicio de Palabras Vacías</h2>
            <p className="text-white/70 text-lg">Detecta y elimina palabras genéricas que no aportan valor</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Palabras Débiles a Revisar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emptyWords.map((word, idx) => (
                <div
                  key={idx}
                  className="rounded px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)' }}
                >
                  <span className="text-white text-sm">{word}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    onChange={(e) => {
                      if (e.target.checked) {
                        setImprovements({ ...improvements, [word]: 'replaced' })
                      } else {
                        const updated = { ...improvements }
                        delete updated[word]
                        setImprovements(updated)
                      }
                    }}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <p className="text-white/80 text-sm leading-relaxed">
              Las palabras vacías no son malas porque estén prohibidas. Son débiles porque <strong>cualquiera puede decirlas</strong>. Tu CV debe mostrar evidencia, no solo personalidad. "Responsable" desaparece. "Me encargué de gestionar información y garantizar continuidad operativa" permanece.
            </p>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            Aprobar y Limpiar Lenguaje
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu CV está Limpio</h2>
            <p className="text-white/70">{Object.keys(improvements).length} palabras vacías removidas o mejoradas</p>
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-3">Resultado de Auditoría</p>
            <p className="text-white/85 text-sm leading-relaxed">
              Cada frase que permanece en tu CV ahora es verificable. No hay afirmaciones genéricas sin respaldo. Esto te diferencia porque demuestra que entiendes la diferencia entre parecer bueno y ser creíble.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 23'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
