'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Briefcase, Building2, Target } from 'lucide-react'
import { A2EnhancedInput } from '@/components/a2-enhanced-input'

interface Step1VisionProps {
  onNext: (data: {
    role: string
    environment: string
    desiredOutcome: string
  }) => void
  initialData?: {
    role: string
    environment: string
    desiredOutcome: string
  }
}

export function A2Day1Step1Vision({ onNext, initialData }: Step1VisionProps) {
  const [role, setRole] = useState(initialData?.role || '')
  const [environment, setEnvironment] = useState(initialData?.environment || '')
  const [desiredOutcome, setDesiredOutcome] = useState(initialData?.desiredOutcome || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!role.trim()) newErrors.role = 'El rol profesional es requerido'
    if (!environment.trim()) newErrors.environment = 'El ambiente ideal es requerido'
    if (!desiredOutcome.trim()) newErrors.desiredOutcome = 'El resultado deseado es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext({ role: role.trim(), environment: environment.trim(), desiredOutcome: desiredOutcome.trim() })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Tu Visión</h2>
        <p className="text-white/60">Comencemos clarificando lo que buscas en tu trayectoria profesional.</p>
      </div>

      {/* Professional Role */}
      <div className="space-y-2">
        <A2EnhancedInput
          value={role}
          onChange={setRole}
          label="¿Qué rol o título profesional estás buscando?"
          placeholder="ej., Senior Product Manager, Data Scientist, Growth Hacker, Desarrollador Full Stack..."
          icon={<Briefcase className="w-4 h-4 text-cyan-400" />}
          coachContext="professional role targeting"
          minRows={2}
        />
        {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
      </div>

      {/* Ideal Environment */}
      <div className="space-y-2">
        <A2EnhancedInput
          value={environment}
          onChange={setEnvironment}
          label="Describe tu ambiente de trabajo ideal"
          placeholder="Considera tamaño de empresa, industria, cultura, valores, flexibilidad, oportunidades de crecimiento..."
          icon={<Building2 className="w-4 h-4 text-purple-400" />}
          coachContext="ideal work environment description"
          minRows={3}
        />
        {errors.environment && <p className="text-red-400 text-sm">{errors.environment}</p>}
      </div>

      {/* Desired Outcome */}
      <div className="space-y-2">
        <A2EnhancedInput
          value={desiredOutcome}
          onChange={setDesiredOutcome}
          label="¿Qué quieres lograr en los próximos 30 días?"
          placeholder="Sé específico sobre el resultado que quieres alcanzar para el Día 30..."
          icon={<Target className="w-4 h-4 text-emerald-400" />}
          coachContext="30-day career goal outcome"
          minRows={3}
        />
        {errors.desiredOutcome && <p className="text-red-400 text-sm">{errors.desiredOutcome}</p>}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleNext}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-full"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
