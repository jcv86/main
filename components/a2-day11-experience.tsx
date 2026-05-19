'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'

interface Day11ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface ValueSeed {
  value: string
  impact: string
}

interface ValueStatement {
  seed: ValueSeed
  statement: string
  coachEnhanced?: string
  selected: boolean
}

export function Day11Experience({ onComplete, userId }: Day11ExperienceProps) {
  const [step, setStep] = useState(1)
  const [seeds, setSeeds] = useState<ValueSeed[]>([])
  const [statements, setStatements] = useState<ValueStatement[]>([])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  // Load Day 10 value seeds (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay11(travisMode)
    }
  }, [userId])

  const initializeDay11 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 11)
      }
      await loadDay10Seeds()
    } catch (err) {
      console.error('[v0] Error initializing Day 11:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay10Seeds = async () => {
    if (!userId) return
    setError(null)
    try {
      const { data, error: err } = await sb
        .from('a2_candidate_boards')
        .select('column_2_que_quiere')
        .eq('user_id', userId)
        .eq('day_number', 10)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (err && err.code !== 'PGRST116') throw err

      if (data?.column_2_que_quiere) {
        // Parse value seeds from Day 10 (format: "Value: Impact")
        const seedTexts = data.column_2_que_quiere
          .split('\n')
          .filter((t: string) => t.trim() && t.includes(':'))
          .slice(0, 5)

        const parsed = seedTexts.map((text: string) => {
          const [value, impact] = text.split(':').map(s => s.trim())
          return { value, impact }
        })

        setSeeds(parsed)
      } else {
        setError('No value seeds found from Day 10. Please complete Day 10 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading Day 10 seeds:', err)
      setError('Failed to load your Day 10 value seeds.')
    } finally {
      setIsLoading(false)
    }
  }

  const transformToStatements = async () => {
    if (seeds.length < 2) {
      setError('Need at least 2 value seeds to proceed')
      return
    }

    setIsLoading(true)
    try {
      // Create value statements from all seeds using a formula
      const statements = seeds.map((seed) => ({
        seed,
        statement: `Demuestro ${seed.value.toLowerCase()} porque logré ${seed.impact.toLowerCase()}`,
        selected: false,
      }))

      setStatements(statements)
      setStep(2)
    } catch (err) {
      console.error('[v0] Error transforming statements:', err)
      setError('Failed to transform value seeds')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSelection = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else if (selectedIndices.length < 2) {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  const enhanceStatements = async () => {
    if (selectedIndices.length !== 2) {
      setError('Please select exactly 2 value statements')
      return
    }

    setIsLoading(true)
    try {
      // Get selected statements
      const selected = selectedIndices.map(i => statements[i])

      // In a real app, call the coach API for enhancement
      // For now, we'll use a local template
      const enhanced = selected.map((stmt) => ({
        ...stmt,
        coachEnhanced: `Mi fortaleza clave es ${stmt.seed.value}. Esto se evidencia en ${stmt.seed.impact}. 
He demostrado esta capacidad consistentemente en roles anteriores, logrando resultados medibles que impactaron 
el crecimiento del negocio y la satisfacción de stakeholders.`,
        selected: true,
      }))

      const updated = [...statements]
      selectedIndices.forEach((i, idx) => {
        updated[i] = enhanced[idx]
      })
      setStatements(updated)
      setStep(3)
    } catch (err) {
      console.error('[v0] Error enhancing statements:', err)
      setError('Failed to enhance statements')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      const selectedStatements = selectedIndices.map(i => statements[i])

      // Save to a2_value_statements table
      if (userId && selectedStatements.length > 0) {
        const rows = selectedStatements.map((stmt) => ({
          user_id: userId,
          day_number: 11,
          statement_text: stmt.statement,
          coach_enhanced: stmt.coachEnhanced,
          original_seed_text: `${stmt.seed.value}: ${stmt.seed.impact}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))

        const { error: err } = await sb
          .from('a2_value_statements')
          .insert(rows)

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 11,
        statements: selectedStatements,
        count: selectedStatements.length,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 11:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1 && seeds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tus value seeds de Día 10...</p>
      </div>
    )
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
            <h2 className="text-3xl font-bold text-white mb-3">El Valor de lo que Hiciste</h2>
            <p className="text-white/70 text-lg">Transforma 5 value seeds en declaraciones profesionales de valor</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Tus {seeds.length} Value Seeds de Día 10:</h3>
            <div className="space-y-2">
              {seeds.length > 0 ? (
                seeds.map((seed, idx) => (
                  <div key={idx} className="text-white/80 text-sm p-3 rounded border border-white/20" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                    <p className="font-semibold">{seed.value}</p>
                    <p className="text-white/60 text-xs mt-1">Impact: {seed.impact}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/60">No hay value seeds guardados.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <p className="text-white/80 text-sm leading-relaxed">
              En este paso, vamos a convertir cada value seed en una declaración profesional.
              Ejemplo: "Liderazgo colaborativo: Resolví conflicto" → "Demuestro liderazgo colaborativo porque logré resolver 
              conflictos interdepartamentales, resultando en alineación de equipos y mejora de velocidad de ejecución"
            </p>
          </div>

          <Button
            onClick={transformToStatements}
            disabled={seeds.length < 2 || isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Generando...' : `Crear ${seeds.length} Declaraciones de Valor`}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Selecciona 2 Declaraciones Más Fuertes</h2>
            <p className="text-white/70">Elige las 2 que mejor representan tu valor profesional</p>
          </div>

          <div className="space-y-3">
            {statements.map((stmt, idx) => (
              <div
                key={idx}
                onClick={() => toggleSelection(idx)}
                className="rounded-lg p-4 cursor-pointer transition-all border-2"
                style={{
                  backgroundColor: selectedIndices.includes(idx)
                    ? 'rgba(80, 160, 170, 0.25)'
                    : 'rgba(80, 160, 170, 0.1)',
                  borderColor: selectedIndices.includes(idx)
                    ? 'rgb(80, 160, 170)'
                    : 'rgba(80, 160, 170, 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      borderColor: 'rgb(80, 160, 170)',
                      backgroundColor: selectedIndices.includes(idx) ? 'rgb(80, 160, 170)' : 'transparent',
                    }}
                  >
                    {selectedIndices.includes(idx) && <div className="w-2 h-2 bg-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{stmt.seed.value}</p>
                    <p className="text-white/85 text-sm mt-2">{stmt.statement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={enhanceStatements}
            disabled={selectedIndices.length !== 2 || isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Mejorando...' : `Mejorar 2 Declaraciones Seleccionadas`}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus 2 Declaraciones de Valor Mejoradas</h2>
            <p className="text-white/70">Listos para Día 12 donde completaremos las 5</p>
          </div>

          <div className="space-y-4">
            {selectedIndices.map((idx) => {
              const stmt = statements[idx]
              return (
                <div key={idx} className="space-y-3 rounded-lg p-5" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                  <div>
                    <p className="text-xs font-semibold text-white/60 uppercase mb-2">Original</p>
                    <p className="text-white text-sm">{stmt.statement}</p>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-xs font-semibold text-white/60 uppercase mb-2">Mejorado</p>
                    <p className="text-white/85 text-sm leading-relaxed">{stmt.coachEnhanced}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-2">✓ Declaraciones Listas</p>
            <p className="text-white/85 text-sm">
              Mañana (Día 12) completaremos las 5 declaraciones faltantes y las ranquearemos por fortaleza.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 11'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
