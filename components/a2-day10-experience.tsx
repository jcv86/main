'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day10ExperienceProps {
  onComplete: (submission: unknown) => Promise<void>
  userId?: string
}

interface ValueSeed {
  task: string
  value: string
  impact: string
}

export function Day10Experience({ onComplete, userId }: Day10ExperienceProps) {
  const [seeds, setSeeds] = useState<ValueSeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const loadDay9 = async () => {
      const supabase = createClient()
      const { data, error: loadError } = await supabase
        .from('a2_user_task_completions')
        .select('submission')
        .eq('user_id', userId)
        .eq('day', 9)
        .not('completed_at', 'is', null)
        .maybeSingle()

      if (loadError) {
        setError('No pudimos cargar el entregable validado del Día 9.')
      } else {
        const submission = data?.submission as { tasks?: unknown } | null
        const tasks = Array.isArray(submission?.tasks)
          ? submission.tasks.filter((task): task is string => typeof task === 'string' && task.trim().length >= 12)
          : []
        setSeeds(tasks.slice(0, 5).map((task) => ({ task, value: '', impact: '' })))
        if (tasks.length < 3) setError('Completa el Día 9 con al menos 3 tareas antes de continuar.')
      }
      setIsLoading(false)
    }

    void loadDay9()
  }, [userId])

  const updateSeed = (index: number, field: 'value' | 'impact', text: string) => {
    setSeeds((current) => current.map((seed, seedIndex) => seedIndex === index ? { ...seed, [field]: text } : seed))
  }

  const completeSeeds = seeds.filter((seed) => seed.value.trim().length >= 3 && seed.impact.trim().length >= 5)

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onComplete({
        dayNumber: 10,
        valueSeeds: completeSeeds,
        taskCount: seeds.length,
        completedAt: new Date().toISOString(),
      })
    } catch (completionError) {
      console.error('[v0] Error completing Day 10:', completionError)
      setError('No pudimos validar el Día 10. Revisa las semillas de valor e inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-12 flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /><p className="text-white">Cargando el entregable del Día 9...</p></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error ? <div role="alert" className="rounded-lg p-4 flex items-start gap-3 bg-red-950/30"><AlertCircle className="w-5 h-5 text-red-400 mt-0.5" /><p className="text-red-300">{error}</p></div> : null}
      <div>
        <h2 className="text-3xl font-bold text-white mb-3">De tareas a semillas de valor</h2>
        <p className="text-white/70">Explica con tus palabras qué valor representa cada tarea y qué impacto puedes respaldar.</p>
      </div>

      <div className="space-y-5">
        {seeds.map((seed, index) => (
          <fieldset key={`${index}-${seed.task.slice(0, 12)}`} className="p-5 rounded-lg border border-cyan-400/30 space-y-3">
            <legend className="text-sm font-semibold text-cyan-300 px-1">Semilla {index + 1}</legend>
            <p className="text-sm text-white/75">{seed.task}</p>
            <label className="block text-sm text-white">Valor demostrado
              <input value={seed.value} onChange={(event) => updateSeed(index, 'value', event.target.value)} placeholder="Ej.: coordinación, análisis, aprendizaje" className="mt-1 w-full p-3 rounded bg-cyan-950/20 border border-white/20 text-white" />
            </label>
            <label className="block text-sm text-white">Impacto que puedes sostener
              <textarea value={seed.impact} onChange={(event) => updateSeed(index, 'impact', event.target.value)} placeholder="Describe el cambio, resultado o aprendizaje sin inventar métricas." rows={3} className="mt-1 w-full p-3 rounded bg-cyan-950/20 border border-white/20 text-white resize-none" />
            </label>
          </fieldset>
        ))}
      </div>

      <Button onClick={handleCompleteDay} disabled={completeSeeds.length < 3 || seeds.length < 3 || isSubmitting} className="w-full py-6 text-white font-semibold rounded-full bg-cyan-700">
        {isSubmitting ? 'Validando...' : 'Validar y completar Día 10'}<ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
