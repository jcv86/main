'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day9ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface WorkMemory {
  id: string
  memory_text: string
  memory_where: string
  memory_why_remember: string
}

export function Day9Experience({ onComplete, userId }: Day9ExperienceProps) {
  const [step, setStep] = useState(1)
  const [memories, setMemories] = useState<WorkMemory[]>([])
  const [tasks, setTasks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  // Load Day 8 memories on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay9(travisMode)
    }
  }, [userId])

  const initializeDay9 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 9)
      }
      await loadDay8Memories()
    } catch (err) {
      console.error('[v0] Error initializing Day 9:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay8Memories = async () => {
    if (!userId) return
    setError(null)
    try {
      const { data, error: err } = await sb
        .from('a2_work_memories')
        .select('id, memory_text, memory_where, memory_why_remember')
        .eq('user_id', userId)
        .eq('day_number', 8)
        .eq('is_selected', true)
        .order('memory_id', { ascending: true })

      if (err) throw err
      setMemories(data || [])
      if (!data || data.length === 0) {
        setError('No memories found from Day 8. Please complete Day 8 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading Day 8 memories:', err)
      setError('Failed to load your Day 8 memories.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateTaskStatements = async () => {
    if (memories.length === 0) {
      setError('No memories to transform into tasks')
      return
    }

    setIsLoading(true)
    try {
      // Transform each memory into a task statement
      const generatedTasks = memories.map((memory) => {
        // Extract key elements and create task statement
        const where = memory.memory_where || 'in my role'
        const impact = memory.memory_why_remember || 'created value'

        // Create a structured task statement
        return `En ${where}, logré ${memory.memory_text.toLowerCase()}, resultando en ${impact}`
      })

      setTasks(generatedTasks)
      setStep(2)
    } catch (err) {
      console.error('[v0] Error generating tasks:', err)
      setError('Failed to generate task statements')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      // Save task statements to candidate board
      if (userId && tasks.length > 0) {
        const { error: err } = await sb.from('a2_candidate_boards').insert({
          user_id: userId,
          day_number: 9,
          column_1_quien_soy: tasks.join('\n'),
          status: 'tasks_generated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 9,
        tasks,
        completedAt: new Date().toISOString(),
        memoryCount: memories.length,
      })
    } catch (err) {
      console.error('[v0] Error completing Day 9:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tus memorias de Día 8...</p>
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
            <h2 className="text-3xl font-bold text-white mb-3">Del Caos a las Tareas</h2>
            <p className="text-white/70 text-lg">Transforma tus {memories.length} memorias crudas en statements claros de tareas</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Tus Memorias de Día 8:</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {memories.length > 0 ? (
                memories.map((memory, idx) => (
                  <div key={idx} className="text-white/80 text-sm p-2 rounded border border-[rgba(80,160,170,0.2)]">
                    <p className="font-semibold">{memory.memory_text}</p>
                    <p className="text-white/60 text-xs mt-1">Donde: {memory.memory_where}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/60">No hay memorias guardadas. Completa Día 8 primero.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <p className="text-white/80">
              Vamos a convertir cada memoria en un statement de tarea: "Lancé producto en 2021" → "En nuestro equipo de producto, logré coordinar el lanzamiento del producto X con 8 personas, resultando en $500K MRR"
            </p>
          </div>

          <Button
            onClick={generateTaskStatements}
            disabled={memories.length === 0 || isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Generando...' : `Generar ${memories.length} Task Statements`}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus {tasks.length} Task Statements</h2>
            <p className="text-white/70">Cada uno es una tarea clara con contexto, acción e impacto</p>
          </div>

          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-white/60 font-semibold text-sm mt-1">0{idx + 1}</div>
                  <p className="text-white text-sm leading-relaxed">{task}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-2">✓ Task Statements Listos</p>
            <p className="text-white/85 text-sm">
              Estos serán el base para Día 10 donde transformaremos cada tarea en "valores" que comuniques al empleador.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 9'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

