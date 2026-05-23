'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { A2EnhancedInput } from './a2-enhanced-input'
import { AlertCircle } from 'lucide-react'

interface A2Day1VisionScanProps {
  onNext: (data: {
    change30Days: string
    targetRole: string
    mainBlocker: string
  }) => void
  initialData?: any
  userId?: string
}

export function A2Day1VisionScan({
  onNext,
  initialData,
  userId,
}: A2Day1VisionScanProps) {
  const [change30Days, setChange30Days] = useState(initialData?.change30Days || '')
  const [targetRole, setTargetRole] = useState(initialData?.targetRole || '')
  const [mainBlocker, setMainBlocker] = useState(initialData?.mainBlocker || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string): boolean => {
    const newErrors = { ...errors }

    if (value.length < 50) {
      newErrors[name] = 'Agrega más detalle (mínimo 50 caracteres)'
      setErrors(newErrors)
      return false
    }

    if (name === 'targetRole' && !hasSpecificity(value)) {
      newErrors[name] = 'Sé más específico: incluye rol, sector y modalidad de trabajo'
      setErrors(newErrors)
      return false
    }

    delete newErrors[name]
    setErrors(newErrors)
    return true
  }

  const hasSpecificity = (text: string): boolean => {
    const keywords = ['rol', 'título', 'remoto', 'híbrido', 'presencial', 'sector', 'empresa', 'equipo']
    return keywords.some((keyword) => text.toLowerCase().includes(keyword))
  }

  const handleNext = () => {
    const q1Valid = validateField('change30Days', change30Days)
    const q2Valid = validateField('targetRole', targetRole)
    const q3Valid = validateField('mainBlocker', mainBlocker)

    if (q1Valid && q2Valid && q3Valid) {
      onNext({
        change30Days,
        targetRole,
        mainBlocker,
      })
    }
  }

  const isComplete = change30Days.length >= 50 && targetRole.length >= 50 && mainBlocker.length >= 50

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Question 1 */}
      <div className="space-y-4">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
        >
          <p className="text-sm font-semibold text-white/70">PREGUNTA 1 DE 3</p>
          <h3 className="text-lg font-bold text-white mt-2">¿Qué quieres cambiar en los próximos 30 días?</h3>
          <p className="text-sm text-white/60 mt-3">
            No estamos preguntando por tu vida entera. Solo los próximos 30 días. ¿Qué necesita transformar? ¿Qué sigue igual? ¿Qué no puede seguir así?
          </p>
        </div>

        <A2EnhancedInput
          value={change30Days}
          onChange={setChange30Days}
          label="¿Qué quieres cambiar en los próximos 30 días?"
          placeholder="ej. Necesito ir de 'ayudante administrativo' a 'coordinador profesional' con responsabilidades reales..."
          minRows={4}
          userId={userId}
        />

        {errors.change30Days && (
          <div className="flex gap-2 text-sm text-[rgb(80,160,170)]-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{errors.change30Days}</p>
          </div>
        )}

        {change30Days.length > 0 && (
          <p className="text-xs text-white/50">{change30Days.length} caracteres</p>
        )}
      </div>

      {/* Question 2 */}
      <div className="space-y-4">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
        >
          <p className="text-sm font-semibold text-white/70">PREGUNTA 2 DE 3</p>
          <h3 className="text-lg font-bold text-white mt-2">¿Qué tipo de rol, empresa o entorno quieres acercar a tu vida?</h3>
          <p className="text-sm text-white/60 mt-3">
            El mercado tiene miles de vacantes. Pero no todas son para ti. Sé específico: ¿qué rol? ¿qué sector? ¿remoto o híbrido? ¿empresa grande o startup?
          </p>
        </div>

        <A2EnhancedInput
          value={targetRole}
          onChange={setTargetRole}
          label="¿Qué tipo de rol, empresa o entorno quieres acercar a tu vida?"
          placeholder="ej. Product Manager en EdTech, remoto/híbrido, team de 5-15 personas, empresa con presencia en LATAM..."
          minRows={4}
          userId={userId}
        />

        {errors.targetRole && (
          <div className="flex gap-2 text-sm text-[rgb(80,160,170)]-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{errors.targetRole}</p>
          </div>
        )}

        {targetRole.length > 0 && (
          <p className="text-xs text-white/50">{targetRole.length} caracteres</p>
        )}
      </div>

      {/* Question 3 */}
      <div className="space-y-4">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
        >
          <p className="text-sm font-semibold text-white/70">PREGUNTA 3 DE 3</p>
          <h3 className="text-lg font-bold text-white mt-2">¿Qué problema profesional quieres dejar de repetir?</h3>
          <p className="text-sm text-white/60 mt-3">
            No es un defecto. Es un patrón que reconoces. Tal vez siempre quedas en el mismo rol. Tal vez no consigues confianza de entrevistadores. Tal vez tu CV no cuenta tu historia real.
          </p>
        </div>

        <A2EnhancedInput
          value={mainBlocker}
          onChange={setMainBlocker}
          label="¿Qué problema profesional quieres dejar de repetir?"
          placeholder="ej. Mi CV no explica el valor real que creé. Siempre quedo como 'asistente' aunque hago trabajo de coordinador..."
          minRows={4}
          userId={userId}
        />

        {errors.mainBlocker && (
          <div className="flex gap-2 text-sm text-[rgb(80,160,170)]-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{errors.mainBlocker}</p>
          </div>
        )}

        {mainBlocker.length > 0 && (
          <p className="text-xs text-white/50">{mainBlocker.length} caracteres</p>
        )}
      </div>

      {/* CTA */}
      <div className="pt-4 border-t" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
        <Button
          onClick={handleNext}
          disabled={!isComplete}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: isComplete ? 'rgb(90, 90, 150)' : 'rgba(90, 90, 150, 0.4)',
            color: 'white',
          }}
        >
          Generar Hipótesis de Ruta →
        </Button>
        <p className="text-xs text-white/50 text-center mt-3">
          {!isComplete && 'Completa todas las preguntas para continuar'}
        </p>
      </div>
    </div>
  )
}
