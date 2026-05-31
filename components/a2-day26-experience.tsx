'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day26ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day26Experience({ onComplete, userId }: Day26ExperienceProps) {
  const [step, setStep] = useState(1)
  const [reflection, setReflection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sb = createClient()

  const reflectionPrompts = [
    'El mayor aprendizaje de estos 10 días fue...',
    'Mi perfil profesional es más claro porque...',
    'Estoy listo para Arc 2 porque...',
  ]

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId) {
        const { error: err } = await sb.from('a2_month1_closure').insert({
          user_id: userId,
          day_number: 26,
          closure_type: 'export_ritual',
          export_confirmed: true,
          reflection_text: reflection,
          ready_for_arc2: true,
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 26,
        reflection,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 26:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Cierre del Mes 1</h2>
            <p className="text-white/70 text-lg">Reflexiona sobre tu transformación de 30 días</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Lo que construiste:</h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Tu identidad profesional clara y validada (Día 1-8)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>5 statements de valor únicos y probados (Día 11-12)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Sistema de prueba de logros completo (Día 13)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>3 historias de logros pulidas y contrastadas (Día 14-15)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>CV base profesional con 6 bullets, skills y lenguaje limpio (Día 17-23)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>CV probado bajo estrés y listo para exportar (Día 24-25)</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <h3 className="text-white font-semibold mb-4">Próximo: Arc 2 - Construcción de Experiencia</h3>
            <p className="text-white/85 text-sm leading-relaxed">
              En los próximos 60 días, convertirás este CV base en un activo vivo. Adaptarás tu perfil a ofertas reales, construirás tu presencia en línea, practicarás entrevistas y harás tu primer acercamiento a empleadores reales. Pero eso empieza con esta reflexión.
            </p>
          </div>

          <div>
            <label className="text-white font-semibold mb-3 block">Tu Reflexión Sobre el Mes 1</label>
            <textarea
              placeholder="Escribe tu reflexión... El mayor aprendizaje fue... Mi perfil es más claro porque... Estoy listo para Arc 2 porque..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full px-4 py-4 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white placeholder-white/40"
              rows={6}
            />
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!reflection.trim()}
            className="w-full py-6 text-white font-semibold rounded-full disabled:opacity-50"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            Guardar Reflexión
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Mes 1 Completado</h2>
            <p className="text-white/70">Estás listo para Arc 2</p>
          </div>

          <div className="rounded-lg p-8 text-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-white mb-3">Fin del Arc 1</h3>
            <p className="text-white/80 text-lg">
              Transformación Completada: De Visión Vaga a Candidato Validado
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
              <p className="text-white font-semibold mb-2">Tu reflexión fue guardada</p>
              <p className="text-white/80 text-sm">{reflection}</p>
            </div>

            <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
              <p className="text-sm font-semibold text-white mb-3">Desbloqueado: Days 27-30 (Arc 1 Final)</p>
              <p className="text-white/85 text-sm">
                Los últimos 4 días incluyen el Checkpoint A3 final y el cierre de Arc 1. Luego comienza Arc 2 (60 días) donde llevarás estos fundamentos al mercado real.
              </p>
            </div>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 26 - Desbloquear Arc 2'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
