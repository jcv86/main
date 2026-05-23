'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day10ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface TaskStatement {
  text: string
  impact: string
  value: string
}

export function Day10Experience({ onComplete, userId }: Day10ExperienceProps) {
  const [step, setStep] = useState(1)
  const [tasks, setTasks] = useState<TaskStatement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  // Load Day 9 tasks on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay10(travisMode)
    }
  }, [userId])

  const initializeDay10 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      // Auto-seed Travis data if in dev mode (seeds Day 9 data)
      if (travisMode) {
        await ensureTravisDataForDay(userId, 10)
      }
      
      await loadDay9Tasks()
    } catch (err) {
      console.error('[v0] Error initializing Day 10:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay9Tasks = async () => {
    if (!userId) return
    setError(null)
    try {
      const { data, error: err } = await sb
        .from('a2_candidate_boards')
        .select('column_1_quien_soy')
        .eq('user_id', userId)
        .eq('day_number', 9)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (err && err.code !== 'PGRST116') throw err

      if (data?.column_1_quien_soy) {
        // Parse task statements and prepare for transformation
        const taskTexts = data.column_1_quien_soy
          .split('\n')
          .filter((t: string) => t.trim())
          .slice(0, 5) // Take first 5 tasks

        const parsedTasks = taskTexts.map((taskText: string) => ({
          text: taskText,
          impact: extractImpact(taskText),
          value: extractValue(taskText),
        }))

        setTasks(parsedTasks)
      } else {
        setError('No task statements found from Day 9. Please complete Day 9 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading Day 9 tasks:', err)
      setError('Failed to load your Day 9 task statements.')
    }
  }

  const extractImpact = (taskText: string): string => {
    // Extract impact from task statement (typically after "resultando en")
    const impactMatch = taskText.match(/resultando en\s+(.+?)(?:\.|$)/i)
    return impactMatch ? impactMatch[1].trim() : 'creé impacto medible'
  }

  const extractValue = (taskText: string): string => {
    // Extract core value proposition from task
    if (taskText.includes('coordiné')) return 'Liderazgo colaborativo'
    if (taskText.includes('implementé')) return 'Ejecución bajo presión'
    if (taskText.includes('diseñé')) return 'Pensamiento data-driven'
    if (taskText.includes('presenté')) return 'Comunicación estratégica'
    if (taskText.includes('resolví')) return 'Resolución de conflictos'
    return 'Creación de valor'
  }

  const transformToValueSeeds = async () => {
    if (tasks.length === 0) {
      setError('No tasks to transform into value seeds')
      return
    }

    setIsLoading(true)
    try {
      // Each task becomes a value seed with impact and value proposition
      const valuSeeds = tasks.map((task) => ({
        ...task,
        valueSeed: `${task.value}: ${task.impact}. Demuestra que puedo [competencia clave que el empleador busca].`,
      }))

      setTasks(valuSeeds)
      setStep(2)
    } catch (err) {
      console.error('[v0] Error transforming tasks:', err)
      setError('Failed to transform tasks into value seeds')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      // Save value seeds to candidate board
      if (userId && tasks.length > 0) {
        const valueSeedsText = tasks
          .map((t) => `${t.value}: ${t.impact}`)
          .join('\n')

        const { error: err } = await sb.from('a2_candidate_boards').insert({
          user_id: userId,
          day_number: 10,
          column_2_que_quiere: valueSeedsText,
          status: 'value_seeds_complete',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 10,
        valueSeeds: tasks,
        taskCount: tasks.length,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 10:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tus tareas de Día 9...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {/* Dev Mode Badge */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50 bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Travis Dev Mode - Day 9 Data Loaded
        </div>
      )}

      {error && (
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
          <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-500 flex-shrink-0 mt-0.5" />
          <p className="text-[rgb(80,160,170)]-500">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Por Qué Importaba</h2>
            <p className="text-white/70 text-lg">Transforma tareas en valor para el empleador</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">La Lección Final</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Una tarea = lo que hiciste. Impacto = por qué importó. Valor = el puente entre tu trabajo y la necesidad del empleador. Este puente es lo que comunicas en entrevistas y en tu CV.
            </p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Tus {tasks.length} Task Statements:</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <div key={idx} className="text-white/80 text-sm p-2 rounded border border-white/20">
                    <p className="font-semibold">{task.value}</p>
                    <p className="text-white/60">Impact: {task.impact}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/60">No hay tareas guardadas.</p>
              )}
            </div>
          </div>

          <Button
            onClick={transformToValueSeeds}
            disabled={tasks.length === 0 || isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Generando...' : `Hacer Autopsia de Impacto (${tasks.length} tareas)`}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus {tasks.length} Value Seeds</h2>
            <p className="text-white/70">Cada uno es un puente: tarea → valor que comunicas</p>
          </div>

          <div className="space-y-3">
            {tasks.map((seed, idx) => (
              <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-white/60 font-semibold text-sm mt-1">0{idx + 1}</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm mb-1">{seed.value}</p>
                    <p className="text-white/85 text-sm">{seed.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-3">🎯 FIN DE ARC 1: INVESTIGACIÓN DE FUNDAMENTOS</p>
            <p className="text-white/90 text-sm leading-relaxed">
              Completaste 10 días de transformación. De visión vaga a candidato claro, validado, con evidencia concreta de valor. Los próximos 80 días (Arcs 2-6) construyen sobre esta base sólida que acabas de crear.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 10 - Desbloqueará Día 11'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
