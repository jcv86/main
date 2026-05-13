'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Flag } from 'lucide-react'
import { A2EnhancedInput } from '@/components/a2-enhanced-input'

interface Step3MilestonesProps {
  onNext: (data: {
    day10: string
    day20: string
    day30: string
  }) => void
  onBack: () => void
  initialData?: {
    day10: string
    day20: string
    day30: string
  }
}

export function A2Day1Step3Milestones({ onNext, onBack, initialData }: Step3MilestonesProps) {
  const [day10, setDay10] = useState(initialData?.day10 || '')
  const [day20, setDay20] = useState(initialData?.day20 || '')
  const [day30, setDay30] = useState(initialData?.day30 || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!day10.trim()) newErrors.day10 = 'El hito del Día 10 es requerido'
    if (!day20.trim()) newErrors.day20 = 'El hito del Día 20 es requerido'
    if (!day30.trim()) newErrors.day30 = 'El hito del Día 30 es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext({
        day10: day10.trim(),
        day20: day20.trim(),
        day30: day30.trim(),
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Tus Hitos</h2>
        <p className="text-white/60">Divide tu meta de 30 días en hitos claros y alcanzables.</p>
      </div>

      {/* Day 10 Milestone */}
      <div className="space-y-2">
        <A2EnhancedInput
          value={day10}
          onChange={setDay10}
          label="¿Qué deberías lograr para el Día 10?"
          placeholder="Resultado específico y medible para el primer checkpoint..."
          icon={<Flag className="w-4 h-4" style={{ color: 'rgb(90, 90, 150)' }} />}
          minRows={2}
        />
        {errors.day10 && <p className="text-sm" style={{ color: 'rgb(80, 160, 170)' }}>{errors.day10}</p>}
      </div>

      {/* Day 20 Milestone */}
      <div className="space-y-2">
        <A2EnhancedInput
          value={day20}
          onChange={setDay20}
          label="¿Qué deberías lograr para el Día 20?"
          placeholder="Progreso hacia tu meta principal..."
          icon={<Flag className="w-4 h-4" style={{ color: 'rgb(90, 90, 150)' }} />}
          minRows={2}
        />
        {errors.day20 && <p className="text-sm" style={{ color: 'rgb(80, 160, 170)' }}>{errors.day20}</p>}
      </div>

      {/* Day 30 Milestone */}
      <div className="space-y-2">
        <A2EnhancedInput
          value={day30}
          onChange={setDay30}
          label="¿Qué deberías lograr para el Día 30?"
          placeholder="Tu meta final de los 30 días..."
          icon={<Flag className="w-4 h-4" style={{ color: 'rgb(90, 90, 150)' }} />}
          minRows={2}
        />
        {errors.day30 && <p className="text-sm" style={{ color: 'rgb(80, 160, 170)' }}>{errors.day30}</p>}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 text-white hover:bg-slate-800 py-6 rounded-full"
          style={{ borderColor: 'rgba(90, 90, 150, 0.3)' }}
        >
          Atrás
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 text-white py-6 rounded-full"
          style={{ backgroundColor: 'rgb(80, 160, 170)' }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
