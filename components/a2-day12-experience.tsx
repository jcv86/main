'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day12ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface ValueStatement {
  id: string
  text: string
  rank: number
  category: string
  strength: number
}

export function Day12Experience({ onComplete, userId }: Day12ExperienceProps) {
  const [step, setStep] = useState(1)
  const [statements, setStatements] = useState<ValueStatement[]>([])
  const [categories, setCategories] = useState<string[]>([
    'Liderazgo',
    'Ejecución',
    'Innovación',
    'Relaciones',
    'Análisis',
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay12(travisMode)
    }
  }, [userId])

  const initializeDay12 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 12)
      }
      await loadDay11Statements()
    } catch (err) {
      console.error('[v0] Error initializing Day 12:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay11Statements = async () => {
    if (!userId) return
    setError(null)
    try {
      const { data, error: err } = await sb
        .from('a2_value_statements')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', 11)
        .order('created_at', { ascending: true })

      if (err) throw err

      if (data && data.length > 0) {
        // Convert to statement objects with defaults
        const loaded = data.map((stmt, idx) => ({
          id: stmt.id,
          text: stmt.statement_text,
          rank: idx + 1,
          category: 'Liderazgo',
          strength: 5 + idx,
        }))
        setStatements(loaded)
      } else {
        setError('No value statements found from Day 11. Please complete Day 11 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading Day 11 statements:', err)
      setError('Failed to load your Day 11 statements.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateCategory = (idx: number, cat: string) => {
    const updated = [...statements]
    updated[idx].category = cat
    setStatements(updated)
  }

  const updateRank = (idx: number, newRank: number) => {
    if (newRank < 1 || newRank > statements.length) return

    const updated = [...statements]
    const moving = updated[idx]
    updated.splice(idx, 1)
    updated.splice(newRank - 1, 0, moving)

    updated.forEach((stmt, i) => {
      stmt.rank = i + 1
    })

    setStatements(updated)
  }

  const updateStrength = (idx: number, strength: number) => {
    const updated = [...statements]
    updated[idx].strength = Math.max(1, Math.min(10, strength))
    setStatements(updated)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId && statements.length > 0) {
        // Save ranked inventory to a2_value_inventory
        const rows = statements.map((stmt) => ({
          user_id: userId,
          day_number: 12,
          statement_id: stmt.id,
          statement_text: stmt.text,
          category: stmt.category,
          rank: stmt.rank,
          strength_score: stmt.strength,
          best_use: `Para ${stmt.category.toLowerCase()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))

        const { error: err } = await sb
          .from('a2_value_inventory')
          .insert(rows)

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 12,
        inventory: statements,
        count: statements.length,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 12:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && statements.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tus declaraciones de Día 11...</p>
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
        <h2 className="text-3xl font-bold text-white mb-3">Complete tu Inventario de Valor</h2>
        <p className="text-white/70 text-lg">Organiza, categoriza y rankea todas tus declaraciones</p>
      </div>

      <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
        <h3 className="text-white font-semibold mb-4">Tus {statements.length} Declaraciones:</h3>
        <div className="space-y-4">
          {statements.map((stmt, idx) => (
            <div
              key={stmt.id}
              className="rounded-lg p-4 space-y-4"
              style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}
            >
              <div className="flex items-start gap-3">
                <div className="text-white/60 font-bold text-lg w-8 text-center">{stmt.rank}</div>
                <div className="flex-1">
                  <p className="text-white text-sm">{stmt.text}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-11">
                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-2">Categoría</label>
                  <select
                    value={stmt.category}
                    onChange={(e) => updateCategory(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strength Slider */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-2">
                    Fuerza: {stmt.strength}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stmt.strength}
                    onChange={(e) => updateStrength(idx, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Rank Controls */}
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-2">Rango</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateRank(idx, stmt.rank - 1)}
                      disabled={stmt.rank === 1}
                      className="flex-1 px-2 py-2 rounded bg-white/10 border border-white/20 text-white disabled:opacity-50 hover:bg-white/20"
                    >
                      <ArrowUp className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => updateRank(idx, stmt.rank + 1)}
                      disabled={stmt.rank === statements.length}
                      className="flex-1 px-2 py-2 rounded bg-white/10 border border-white/20 text-white disabled:opacity-50 hover:bg-white/20"
                    >
                      <ArrowDown className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
        <h3 className="text-white font-semibold mb-3">Tu Inventario Completo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-2 px-3 text-white/60 font-semibold">Rank</th>
                <th className="text-left py-2 px-3 text-white/60 font-semibold">Declaración</th>
                <th className="text-left py-2 px-3 text-white/60 font-semibold">Categoría</th>
                <th className="text-left py-2 px-3 text-white/60 font-semibold">Fuerza</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((stmt) => (
                <tr key={stmt.id} className="border-b border-white/10">
                  <td className="py-2 px-3 text-white font-bold">{stmt.rank}</td>
                  <td className="py-2 px-3 text-white/85 text-xs">{stmt.text.substring(0, 50)}...</td>
                  <td className="py-2 px-3 text-white/85">{stmt.category}</td>
                  <td className="py-2 px-3 text-white/85">{stmt.strength}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Button
        onClick={handleCompleteDay}
        disabled={isSubmitting || statements.length === 0}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgb(80, 160, 170)' }}
      >
        {isSubmitting ? 'Guardando...' : `Completar Día 12 - Salvar Inventario`}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
