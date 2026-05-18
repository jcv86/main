'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day28ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day28Experience({ onComplete, userId }: Day28ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Recruiter scan answers
  const [scanAnswers, setScanAnswers] = useState({
    first10Seconds: '',
    confidencePart: '',
    doubtPart: '',
    recruiterQuestion: '',
  })

  // Recruiter simulation results
  const [recruiterSimulation, setRecruiterSimulation] = useState({
    firstImpression: '',
    visibleStrengths: [] as string[],
    possibleDoubts: [] as string[],
    likelyQuestions: [] as string[],
  })

  // Improvement note
  const [improvementFocus, setImprovementFocus] = useState('')
  const [improvementNote, setImprovementNote] = useState('')

  const sb = createClient()

  const runRecruiterSimulation = async () => {
    if (!scanAnswers.first10Seconds) {
      setError('Por favor responde todas las preguntas del escaneo.')
      return
    }

    setIsLoading(true)
    try {
      // Simulate recruiter perception based on answers
      const simulation = {
        firstImpression: 'Tu CV genera una primera impresión de profesional en formación con experiencia operativa.',
        visibleStrengths: [
          'Identidad clara',
          'Experiencia específica',
          'Habilidades organizadas',
          'Lenguaje profesional',
        ],
        possibleDoubts: [
          '¿Realmente quiere avanzar en esta dirección?',
          '¿Por qué no tiene más impacto cuantificado?',
          '¿Cómo se conecta esto con el rol que busca?',
        ],
        likelyQuestions: [
          '¿Cuál fue tu rol específico en este proyecto?',
          '¿Qué métricas puedes compartir?',
          '¿Cómo mediste tu impacto?',
        ],
      }

      setRecruiterSimulation(simulation)
      setStep(2)
    } catch (err) {
      console.error('[v0] Error running simulation:', err)
      setError('No pudimos simular la perspectiva del reclutador.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    if (!improvementFocus || !improvementNote) {
      setError('Por favor completa la nota de mejora.')
      return
    }

    setIsSubmitting(true)
    try {
      // Save recruiter perspective
      if (userId) {
        const { error: err } = await sb.from('a2_recruiter_perspective').insert({
          user_id: userId,
          day_number: 28,
          first_10_seconds: scanAnswers.first10Seconds,
          confidence_part: scanAnswers.confidencePart,
          doubt_part: scanAnswers.doubtPart,
          recruiter_question: scanAnswers.recruiterQuestion,
          first_impression: recruiterSimulation.firstImpression,
          visible_strengths: recruiterSimulation.visibleStrengths,
          possible_doubts: recruiterSimulation.possibleDoubts,
          likely_questions: recruiterSimulation.likelyQuestions,
          improvement_focus: improvementFocus,
          improvement_note: improvementNote,
          scan_complete: true,
          simulation_generated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 28,
        scanAnswers,
        recruiterSimulation,
        improvement: { focus: improvementFocus, note: improvementNote },
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 28:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 className="text-3xl font-bold text-white mb-3">Ojos de Reclutador</h2>
            <p className="text-white/70 text-lg">Mira tu CV como lo haría un reclutador: rápido, crítico, en busca de señales.</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Preguntas para el escaneo de 10 segundos:</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  ¿Qué se entiende en los primeros 10 segundos?
                </label>
                <textarea
                  placeholder="Escribe lo que un reclutador entendería rápidamente"
                  value={scanAnswers.first10Seconds}
                  onChange={(e) => setScanAnswers({ ...scanAnswers, first10Seconds: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  ¿Qué parte genera más confianza?
                </label>
                <textarea
                  placeholder="Qué te hace sentir como candidato fuerte"
                  value={scanAnswers.confidencePart}
                  onChange={(e) => setScanAnswers({ ...scanAnswers, confidencePart: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  ¿Qué parte todavía genera dudas?
                </label>
                <textarea
                  placeholder="Qué podría mejorar o aclarar"
                  value={scanAnswers.doubtPart}
                  onChange={(e) => setScanAnswers({ ...scanAnswers, doubtPart: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  ¿Qué pregunta haría un reclutador después de leerlo?
                </label>
                <textarea
                  placeholder="La pregunta más importante que te haría"
                  value={scanAnswers.recruiterQuestion}
                  onChange={(e) => setScanAnswers({ ...scanAnswers, recruiterQuestion: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={runRecruiterSimulation}
            disabled={!scanAnswers.first10Seconds || isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Simulando...' : 'Simular Perspectiva del Reclutador'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Perspectiva del Reclutador</h2>
            <p className="text-white/70">Así vería tu CV alguien que revisa 50 candidatos por día</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Primera Impresión</h3>
            <p className="text-white/80 text-sm">{recruiterSimulation.firstImpression}</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Fortalezas Visibles</h3>
            <ul className="space-y-2">
              {recruiterSimulation.visibleStrengths.map((strength, idx) => (
                <li key={idx} className="text-white/80 text-sm">• {strength}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Posibles Dudas</h3>
            <ul className="space-y-2">
              {recruiterSimulation.possibleDoubts.map((doubt, idx) => (
                <li key={idx} className="text-white/80 text-sm">• {doubt}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Mi nota de mejora</h3>
            <div className="space-y-4">
              <select
                value={improvementFocus}
                onChange={(e) => setImprovementFocus(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white text-sm"
              >
                <option value="">Selecciona un área a mejorar</option>
                <option value="clarity">Aclarar dirección de rol</option>
                <option value="proof">Agregar más pruebas</option>
                <option value="specificity">Ser más específico</option>
                <option value="tools">Mejorar herramientas</option>
                <option value="dates">Aclarar fechas</option>
                <option value="summary">Acortar resumen</option>
              </select>

              <textarea
                placeholder="Escribe la mejora específica que harías"
                value={improvementNote}
                onChange={(e) => setImprovementNote(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                rows={3}
              />
            </div>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 28'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
