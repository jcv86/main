'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day9ExperienceProps {
  onComplete: (submission: unknown) => Promise<void>
  userId?: string
}

interface WorkMemory {
  id: string
  memory_text: string
  memory_where: string
  memory_why_remember: string
}

function taskDraft(memory: WorkMemory): string {
  return `${memory.memory_text.trim()} Contexto: ${memory.memory_where.trim()}. Importancia registrada: ${memory.memory_why_remember.trim()}.`
}

export function Day9Experience({ onComplete, userId }: Day9ExperienceProps) {
  const [memories, setMemories] = useState<WorkMemory[]>([])
  const [tasks, setTasks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const loadMemories = async () => {
      setError(null)
      const supabase = createClient()
      const { data, error: loadError } = await supabase
        .from('a2_work_memories')
        .select('id, memory_text, memory_where, memory_why_remember')
        .eq('user_id', userId)
        .eq('day_number', 8)
        .eq('is_selected', true)
        .order('memory_id', { ascending: true })

      if (loadError) {
        setError('No pudimos cargar tus memorias del Día 8.')
      } else {
        const loaded = data || []
        setMemories(loaded)
        setTasks(loaded.map(taskDraft))
        if (loaded.length < 3) setError('Selecciona y guarda al menos 3 memorias en el Día 8 antes de continuar.')
      }
      setIsLoading(false)
    }

    void loadMemories()
  }, [userId])

  const updateTask = (index: number, value: string) => {
    setTasks((current) => current.map((task, taskIndex) => taskIndex === index ? value : task))
  }

  const validTasks = tasks.filter((task) => task.trim().length >= 12)

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onComplete({
        dayNumber: 9,
        tasks: validTasks,
        memoryCount: memories.length,
        completedAt: new Date().toISOString(),
      })
    } catch (completionError) {
      console.error('[v0] Error completing Day 9:', completionError)
      setError('No pudimos validar el Día 9. Revisa las tareas e inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-12 flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /><p className="text-white">Cargando tus memorias del Día 8...</p></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error ? <div role="alert" className="rounded-lg p-4 flex items-start gap-3 bg-red-950/30"><AlertCircle className="w-5 h-5 text-red-400 mt-0.5" /><p className="text-red-300">{error}</p></div> : null}
      <div>
        <h2 className="text-3xl font-bold text-white mb-3">De memorias a tareas</h2>
        <p className="text-white/70">Convierte cada memoria seleccionada en una descripción fiel, clara y reutilizable.</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={memories[index]?.id || index} className="space-y-2">
            <label htmlFor={`day9-task-${index}`} className="text-sm font-semibold text-white">Tarea {index + 1}</label>
            <textarea
              id={`day9-task-${index}`}
              value={task}
              onChange={(event) => updateTask(index, event.target.value)}
              rows={4}
              className="w-full p-4 rounded-lg text-white bg-cyan-950/20 border border-cyan-400/30 resize-none"
            />
            <p className="text-xs text-white/50">Edita el borrador para que describa exactamente lo que ocurrió; no agregues resultados que no puedas sostener.</p>
          </div>
        ))}
      </div>

      <Button onClick={handleCompleteDay} disabled={validTasks.length < 3 || isSubmitting} className="w-full py-6 text-white font-semibold rounded-full bg-cyan-700">
        {isSubmitting ? 'Validando...' : 'Validar y completar Día 9'}<ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
