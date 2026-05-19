'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'

interface Day16ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day16Experience({ onComplete, userId }: Day16ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkpointData, setCheckpointData] = useState<any>(null)
  const [isDevMode, setIsDevMode] = useState(false)
  const router = useRouter()
  const sb = createClient()

  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay16(travisMode)
    }
  }, [userId])

  const initializeDay16 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 16)
      }
      await loadCheckpointData()
    } catch (err) {
      console.error('[v0] Error initializing Day 16:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCheckpointData = async () => {
    if (!userId) return
    setError(null)
    try {
      // Validate that previous days are complete
      const { data: priorDays, error: err1 } = await sb
        .from('a2_task_completions')
        .select('day_number')
        .eq('user_id', userId)
        .eq('phase', 30)
        .gte('day_number', 8)
        .lte('day_number', 15)

      if (err1) throw err1

      if (!priorDays || priorDays.length < 8) {
        setError('Debes completar Días 8-15 antes de este checkpoint.')
        setIsLoading(false)
        return
      }

      // Load the A3 Checkpoint Package from Day 15
      const { data: packageData, error: err2 } = await sb
        .from('a2_checkpoint_package')
        .select('*')
        .eq('user_id', userId)
        .eq('phase', 30)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (err2 && err2.code !== 'PGRST116') throw err2

      setCheckpointData(packageData || {})
      setStep(2)
    } catch (err) {
      console.error('[v0] Error loading checkpoint data:', err)
      setError('No pudimos cargar tus datos del checkpoint.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenA3Module2 = async () => {
    setIsSubmitting(true)
    try {
      // Save checkpoint entry
      const { error: err } = await sb.from('a2_checkpoint_a3_module2').insert({
        user_id: userId,
        day_number: 16,
        value_statements_count: checkpointData?.value_statements_count || 5,
        achievement_stories_count: checkpointData?.achievement_stories_count || 3,
        proof_fragments_count: checkpointData?.proof_fragments_count || 3,
        status: 'in_progress',
        a3_module_status: 'opening',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (err && err.code !== '23505') throw err

      // Trigger completion via Day 16 page
      await onComplete({
        dayNumber: 16,
        checkpointType: 'a3_module_2',
        openA3Module: true,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error opening A3 Module 2:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Preparando tu acceso al Laboratorio...</p>
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

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Checkpoint A3: Laboratorio de Minería de Valor</h2>
            <p className="text-white/70 text-lg">Día 16 - Validación de Transformación de Experiencia</p>
          </div>

          {/* Pre-checkpoint summary */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Durante los últimos días excavaste...</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(80, 160, 170)' }} />
                <div>
                  <p className="text-white font-semibold">Mapa de Memorias de Trabajo</p>
                  <p className="text-white/60 text-sm">8 memorias seleccionadas y organizadas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(80, 160, 170)' }} />
                <div>
                  <p className="text-white font-semibold">5 Statements de Valor</p>
                  <p className="text-white/60 text-sm">Transformadas con impacto y prueba</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(80, 160, 170)' }} />
                <div>
                  <p className="text-white font-semibold">3 Historias de Logro</p>
                  <p className="text-white/60 text-sm">Con contexto, acción, resultado y defensa</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(80, 160, 170)' }} />
                <div>
                  <p className="text-white font-semibold">Mapa de Prueba Profesional</p>
                  <p className="text-white/60 text-sm">Evidencia mapeada para cada logro</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkpoint purpose */}
          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <h3 className="text-white font-semibold mb-3">Hoy en el Laboratorio...</h3>
            <p className="text-white/85 text-sm leading-relaxed">
              Vas a demostrar que tu experiencia puede transformarse en material profesional real. El Laboratorio de Minería de Valor revisará:
            </p>
            <ul className="text-white/80 text-sm space-y-2 mt-3 ml-4">
              <li>• Transformación tarea → valor</li>
              <li>• Prueba de impacto</li>
              <li>• Historias de logro defensibles</li>
              <li>• Candidato más fuerte para CV</li>
              <li>• Preparación para trabajo de CV e entrevista</li>
            </ul>
          </div>

          {/* Materials being used */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">Materiales del Laboratorio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p className="text-white/70 text-sm">✓ Mapa de Memorias de Trabajo</p>
              <p className="text-white/70 text-sm">✓ Mapa de Claridad de Tareas</p>
              <p className="text-white/70 text-sm">✓ Reporte de Autopsia de Impacto</p>
              <p className="text-white/70 text-sm">✓ Inventario de Valor</p>
              <p className="text-white/70 text-sm">✓ Mapa de Prueba Profesional</p>
              <p className="text-white/70 text-sm">✓ 3 Historias de Logro</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              El Laboratorio es una validación seria. Solo entra si has completado los días anteriores. Una vez dentro, tendrás que revisar y confirmar cada material.
            </p>
            <p className="text-white font-semibold text-sm">Estás listo. Vamos al Laboratorio.</p>
          </div>

          <Button
            onClick={handleOpenA3Module2}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Abriendo Laboratorio...' : 'Entrar al Laboratorio de Minería de Valor'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
