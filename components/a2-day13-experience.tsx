'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day13ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface ProofFragment {
  type: string
  content: string
  strength: 'strong' | 'usable' | 'weak' | 'needs-detail'
}

interface StatementProof {
  id: string
  statement: string
  proofTypes: string[]
  fragments: ProofFragment[]
}

const PROOF_TYPES = [
  'Frecuencia: Diario',
  'Frecuencia: Semanal',
  'Frecuencia: Mensual',
  'Escala: 1 persona',
  'Escala: Equipo',
  'Escala: Departamento',
  'Escala: Clientes',
  'Complejidad: Difícil',
  'Complejidad: Urgente',
  'Complejidad: Sensible',
  'Confianza',
  'Riesgo',
  'Mejora',
  'Herramienta',
  'Feedback',
]

export function Day13Experience({ onComplete, userId }: Day13ExperienceProps) {
  const [step, setStep] = useState(1)
  const [statements, setStatements] = useState<StatementProof[]>([])
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [fragmentInputs, setFragmentInputs] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay13(travisMode)
    }
  }, [userId])

  const initializeDay13 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 13)
      }
      await loadDay12Inventory()
    } catch (err) {
      console.error('[v0] Error initializing Day 13:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay12Inventory = async () => {
    if (!userId) return
    setError(null)
    try {
      const { data, error: err } = await sb
        .from('a2_value_inventory')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', 12)
        .order('rank', { ascending: true })

      if (err) throw err

      if (data && data.length > 0) {
        const loaded = data.map((stmt) => ({
          id: stmt.id,
          statement: stmt.statement_text,
          proofTypes: [],
          fragments: [],
        }))
        setStatements(loaded)
        setStep(2)
      } else {
        setError('No statements found from Day 12. Please complete Day 12 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading Day 12 inventory:', err)
      setError('Failed to load your Day 12 inventory.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProofType = (stmtIdx: number, type: string) => {
    const updated = [...statements]
    const types = updated[stmtIdx].proofTypes
    if (types.includes(type)) {
      updated[stmtIdx].proofTypes = types.filter((t) => t !== type)
    } else {
      updated[stmtIdx].proofTypes = [...types, type]
    }
    setStatements(updated)
  }

  const addFragment = (stmtIdx: number) => {
    const key = `stmt-${stmtIdx}`
    const content = fragmentInputs[key] || ''
    if (!content.trim()) return

    const updated = [...statements]
    updated[stmtIdx].fragments.push({
      type: 'note',
      content,
      strength: 'needs-detail',
    })
    setStatements(updated)
    setFragmentInputs({ ...fragmentInputs, [key]: '' })
  }

  const removeFragment = (stmtIdx: number, fragIdx: number) => {
    const updated = [...statements]
    updated[stmtIdx].fragments = updated[stmtIdx].fragments.filter((_, i) => i !== fragIdx)
    setStatements(updated)
  }

  const updateFragmentStrength = (stmtIdx: number, fragIdx: number, strength: string) => {
    const updated = [...statements]
    updated[stmtIdx].fragments[fragIdx].strength = strength as any
    setStatements(updated)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId && statements.length > 0) {
        // Save proof map to a2_proof_map
        const rows = statements.map((stmt) => ({
          user_id: userId,
          day_number: 13,
          statement_id: stmt.id,
          statement_text: stmt.statement,
          proof_types: stmt.proofTypes,
          proof_fragments: stmt.fragments,
          fragment_count: stmt.fragments.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))

        const { error: err } = await sb
          .from('a2_proof_map')
          .insert(rows)

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 13,
        proofMap: statements,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 13:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && statements.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tu inventario de Día 12...</p>
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

      <div>
        <h2 className="text-3xl font-bold text-white mb-3">Escala de Prueba</h2>
        <p className="text-white/70 text-lg">Mapea tipos de prueba y fragmentos para cada declaración</p>
      </div>

      <div className="space-y-4">
        {statements.map((stmt, stmtIdx) => (
          <div
            key={stmt.id}
            className="rounded-lg p-4 cursor-pointer transition-all"
            style={{
              backgroundColor: expandedIdx === stmtIdx ? 'rgba(80, 160, 170, 0.15)' : 'rgba(80, 160, 170, 0.1)',
            }}
            onClick={() => setExpandedIdx(expandedIdx === stmtIdx ? null : stmtIdx)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{stmt.statement}</p>
                <p className="text-white/60 text-xs mt-1">
                  {stmt.proofTypes.length} tipos | {stmt.fragments.length} fragmentos
                </p>
              </div>
              <ChevronRight
                className="w-4 h-4 text-white/60 flex-shrink-0 transition-transform"
                style={{
                  transform: expandedIdx === stmtIdx ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            </div>

            {expandedIdx === stmtIdx && (
              <div className="mt-4 space-y-4 border-t border-white/20 pt-4">
                {/* Proof Types */}
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-2">Tipos de Prueba</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PROOF_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stmt.proofTypes.includes(type)}
                          onChange={() => toggleProofType(stmtIdx, type)}
                          className="w-4 h-4"
                        />
                        <span className="text-white/80 text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fragments */}
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-2">Fragmentos de Prueba</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {stmt.fragments.map((frag, fragIdx) => (
                      <div
                        key={fragIdx}
                        className="rounded p-2 flex items-start justify-between"
                        style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white/85 text-xs break-words">{frag.content}</p>
                          <select
                            value={frag.strength}
                            onChange={(e) => updateFragmentStrength(stmtIdx, fragIdx, e.target.value)}
                            className="text-xs mt-1 px-2 py-1 rounded bg-white/10 text-white"
                          >
                            <option value="strong">Fuerte</option>
                            <option value="usable">Usable</option>
                            <option value="weak">Débil</option>
                            <option value="needs-detail">Necesita Detalle</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeFragment(stmtIdx, fragIdx)}
                          className="ml-2 p-1 hover:bg-[rgba(80,160,170,0.5)]-500/20 rounded"
                        >
                          <X className="w-4 h-4 text-[rgb(80,160,170)]-400" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Añade fragmento..."
                      value={fragmentInputs[`stmt-${stmtIdx}`] || ''}
                      onChange={(e) =>
                        setFragmentInputs({ ...fragmentInputs, [`stmt-${stmtIdx}`]: e.target.value })
                      }
                      className="flex-1 px-2 py-2 rounded text-sm bg-white/10 border border-white/20 text-white placeholder-white/40"
                    />
                    <button
                      onClick={() => addFragment(stmtIdx)}
                      className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleCompleteDay}
        disabled={isSubmitting}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgb(80, 160, 170)' }}
      >
        {isSubmitting ? 'Guardando...' : 'Completar Día 13 - Mapa de Prueba'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
