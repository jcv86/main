'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day14ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface StoryDraft {
  context: { scene: string; situation: string; problem: string }
  action: { what: string; decisions: string; tools: string }
  result: { changed: string; benefited: string; learned: string }
}

const EMPTY_DRAFT: StoryDraft = {
  context: { scene: '', situation: '', problem: '' },
  action: { what: '', decisions: '', tools: '' },
  result: { changed: '', benefited: '', learned: '' },
}

export function Day14Experience({ onComplete, userId }: Day14ExperienceProps) {
  const [step, setStep] = useState(1)
  const [selectedStatement, setSelectedStatement] = useState<string>('')
  const [statements, setStatements] = useState<Array<{ id: string; text: string }>>([])
  const [draft, setDraft] = useState<StoryDraft>(EMPTY_DRAFT)
  const [polishedStory, setPolishedStory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay14(travisMode)
    }
  }, [userId])

  const initializeDay14 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 14)
      }
      await loadDay12Inventory()
    } catch (err) {
      console.error('[v0] Error initializing Day 14:', err)
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
        .select('id, statement_text')
        .eq('user_id', userId)
        .eq('day_number', 12)
        .order('rank', { ascending: true })

      if (err) throw err

      if (data && data.length > 0) {
        const loaded = data.map((stmt) => ({
          id: stmt.id,
          text: stmt.statement_text,
        }))
        setStatements(loaded)
        setSelectedStatement(loaded[0].id)
        setStep(2)
      } else {
        setError('No statements found. Please complete Day 12 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading inventory:', err)
      setError('Failed to load statements.')
    } finally {
      setIsLoading(false)
    }
  }

  const enhanceStory = async () => {
    if (!draft.context.scene || !draft.action.what || !draft.result.changed) {
      setError('Por favor completa todos los campos principales.')
      return
    }

    setIsLoading(true)
    try {
      // In real app, call coach API
      // For now, create polished version locally
      const polished = `
**Contexto**: ${draft.context.scene}. La situación era ${draft.context.situation}. El problema principal: ${draft.context.problem}

**Acción**: Decidí ${draft.action.what}. Mis decisiones clave fueron ${draft.action.decisions}. 
Usé ${draft.action.tools} para implementar la solución.

**Resultado**: Como resultado, ${draft.result.changed}. 
Esto benefició a ${draft.result.benefited}.
Lo más importante que aprendí: ${draft.result.learned}
      `.trim()

      setPolishedStory(polished)
      setStep(4)
    } catch (err) {
      console.error('[v0] Error enhancing story:', err)
      setError('Failed to enhance story.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDraft = (section: keyof StoryDraft, field: string, value: string) => {
    setDraft({
      ...draft,
      [section]: {
        ...draft[section],
        [field]: value,
      },
    } as StoryDraft)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId && selectedStatement) {
        const { error: err } = await sb
          .from('a2_achievement_stories')
          .insert({
            user_id: userId,
            day_number: 14,
            story_index: 1,
            statement_id: selectedStatement,
            context_scene: draft.context.scene,
            context_situation: draft.context.situation,
            context_problem: draft.context.problem,
            action_what: draft.action.what,
            action_decisions: draft.action.decisions,
            action_tools: draft.action.tools,
            result_changed: draft.result.changed,
            result_benefited: draft.result.benefited,
            result_learned: draft.result.learned,
            coach_polished_story: polishedStory,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 14,
        story: { draft, polishedStory },
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 14:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && statements.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tus declaraciones de valor...</p>
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

      <div>
        <h2 className="text-3xl font-bold text-white mb-3">Primera Historia</h2>
        <p className="text-white/70 text-lg">Construye tu primera historia de logro usando la declaración más fuerte</p>
      </div>

      {step >= 2 && (
        <div className="space-y-4">
          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <p className="text-white/60 text-sm font-semibold mb-2">DECLARACIÓN SELECCIONADA</p>
            <p className="text-white text-sm">
              {statements.find((s) => s.id === selectedStatement)?.text}
            </p>
          </div>

          {step >= 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-3">Contexto: ¿Dónde? ¿Cuál era la situación?</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="¿Dónde sucedió esto? (empresa, proyecto, equipo)"
                    value={draft.context.scene}
                    onChange={(e) => updateDraft('context', 'scene', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <textarea
                    placeholder="¿Cuál era la situación general?"
                    value={draft.context.situation}
                    onChange={(e) => updateDraft('context', 'situation', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <textarea
                    placeholder="¿Qué problema necesitaba ser resuelto?"
                    value={draft.context.problem}
                    onChange={(e) => updateDraft('context', 'problem', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Acción: ¿Qué hiciste? ¿Cómo lo hiciste?</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="¿Qué acción específica tomaste?"
                    value={draft.action.what}
                    onChange={(e) => updateDraft('action', 'what', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <textarea
                    placeholder="¿Qué decisiones clave tomaste?"
                    value={draft.action.decisions}
                    onChange={(e) => updateDraft('action', 'decisions', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <textarea
                    placeholder="¿Qué herramientas o recursos usaste?"
                    value={draft.action.tools}
                    onChange={(e) => updateDraft('action', 'tools', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Resultado: ¿Qué cambió?</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="¿Qué cambió como resultado?"
                    value={draft.result.changed}
                    onChange={(e) => updateDraft('result', 'changed', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <textarea
                    placeholder="¿Quién se benefició? (métricas, personas, equipo)"
                    value={draft.result.benefited}
                    onChange={(e) => updateDraft('result', 'benefited', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                  <textarea
                    placeholder="¿Qué aprendiste?"
                    value={draft.result.learned}
                    onChange={(e) => updateDraft('result', 'learned', e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    rows={2}
                  />
                </div>
              </div>

              {step < 4 && (
                <Button
                  onClick={enhanceStory}
                  disabled={isLoading}
                  className="w-full py-6 text-white font-semibold rounded-full"
                  style={{ backgroundColor: 'rgb(80, 160, 170)' }}
                >
                  {isLoading ? 'Mejorando...' : 'Mejorar con Coach'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}

          {step >= 4 && polishedStory && (
            <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
              <p className="text-white/60 text-xs font-semibold mb-3 uppercase">Historia Mejorada</p>
              <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{polishedStory}</p>

              <Button
                onClick={handleCompleteDay}
                disabled={isSubmitting}
                className="w-full py-6 text-white font-semibold rounded-full mt-4"
                style={{ backgroundColor: 'rgb(80, 160, 170)' }}
              >
                {isSubmitting ? 'Guardando...' : 'Completar Día 14'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
