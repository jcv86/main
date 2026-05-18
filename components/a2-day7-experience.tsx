'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, AlertCircle } from 'lucide-react'

interface Day7ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day7Experience({ onComplete }: Day7ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStartCheckpoint = () => {
    setStep(2)
  }

  const handleCompleteCheckpoint = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 7,
        checkpointStatus: 'completed',
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 7:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Checkpoint A3: Espejo de Carrera</h2>
            <p className="text-white/70">Validación hito de 7 días: Investigación de Fundamentos</p>
          </div>

          <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-2">Lo que pasó en 7 días</p>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>✓ Definiste tu ruta de 30 días clara y validada</li>
                  <li>✓ Recolectaste 7+ fragmentos de evidencia profesional</li>
                  <li>✓ Analizaste el mercado real y lo que busca</li>
                  <li>✓ Creaste un Tablero del Candidato integrado</li>
                  <li>✓ Probaste y validaste tu introducción profesional</li>
                  <li>✓ Forjaste tu identidad profesional clara</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
            <p className="text-white/80">El Checkpoint A3 es la culminación del Arc 1. Hoy completarás un módulo especial de Espejo de Carrera que validará todo el progreso. Esto desbloquea los próximos 60 días de investigación profunda.</p>
          </div>

          <Button
            onClick={handleStartCheckpoint}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}
          >
            Comenzar Checkpoint A3
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Espejo de Carrera - Validación</h2>
            <p className="text-white/70">Tu resumen de 7 días (sin spoilers - experimenta en aplicación A3)</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-6 border-2 border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
              <p className="text-sm font-semibold text-cyan-300 mb-4">📊 TU PERFIL RESUMIDO</p>
              <div className="space-y-2 text-white/90">
                <p><span style={{ color: 'rgb(200, 200, 255)' }}>Rol buscado:</span> Senior Product Manager en B2B SaaS</p>
                <p><span style={{ color: 'rgb(200, 200, 255)' }}>Fortaleza principal:</span> Lanzamiento de productos + Coordinación de equipos</p>
                <p><span style={{ color: 'rgb(200, 200, 255)' }}>Brecha identificada:</span> Profundidad en métricas de retención</p>
                <p><span style={{ color: 'rgb(200, 200, 255)' }}>Urgencia de mercado:</span> Alta (muchas vacantes match)</p>
              </div>
            </div>

            <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
              <p className="text-sm font-semibold text-white/60 mb-3">PRÓXIMO PASO</p>
              <p className="text-white">Completando este checkpoint desbloqueas la Arc 2 de 20 días: "Construcción de Candidatura" donde crearás CV, LinkedIn, historias STAR, y más.</p>
            </div>
          </div>

          <Button
            onClick={handleCompleteCheckpoint}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Checkpoint A3 + Desbloquear Día 8'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
