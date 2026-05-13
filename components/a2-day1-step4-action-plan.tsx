'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Briefcase, Users, BookOpen, Heart } from 'lucide-react'
import { A2EnhancedInput } from '@/components/a2-enhanced-input'

interface Step4ActionPlanProps {
  onNext: (data: {
    applications: string
    networking: string
    learning: string
    personal: string
  }) => void
  onBack: () => void
  initialData?: {
    applications: string
    networking: string
    learning: string
    personal: string
  }
}

export function A2Day1Step4ActionPlan({ onNext, onBack, initialData }: Step4ActionPlanProps) {
  const [applications, setApplications] = useState(initialData?.applications || '')
  const [networking, setNetworking] = useState(initialData?.networking || '')
  const [learning, setLearning] = useState(initialData?.learning || '')
  const [personal, setPersonal] = useState(initialData?.personal || '')

  const handleNext = () => {
    onNext({
      applications: applications.trim(),
      networking: networking.trim(),
      learning: learning.trim(),
      personal: personal.trim(),
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Crea Tu Plan de Acción</h2>
        <p className="text-white/60">Divide tus metas en acciones específicas en 4 áreas clave.</p>
      </div>

      {/* Job Applications */}
      <A2EnhancedInput
        value={applications}
        onChange={setApplications}
        label="Aplicaciones a Empleos"
        placeholder="ej., Aplicar a 5 posiciones por semana, actualizar CV para cada rol, preparar carta de presentación personalizada..."
        icon={<Briefcase className="w-4 h-4 text-red-400" />}
        minRows={3}
      />

      {/* Networking */}
      <A2EnhancedInput
        value={networking}
        onChange={setNetworking}
        label="Networking y Conexiones"
        placeholder="ej., Conectar con 3 profesionales por semana en LinkedIn, asistir a 1 evento de networking mensual..."
        icon={<Users className="w-4 h-4" style={{ color: 'rgb(90, 90, 150)' }} />}
        minRows={3}
      />

      {/* Learning */}
      <A2EnhancedInput
        value={learning}
        onChange={setLearning}
        label="Aprendizaje y Desarrollo"
        placeholder="ej., Completar curso de habilidades técnicas, leer 1 libro de desarrollo profesional, practicar entrevistas..."
        icon={<BookOpen className="w-4 h-4" style={{ color: 'rgb(90, 90, 150)' }} />}
        minRows={3}
      />

      {/* Personal Growth */}
      <A2EnhancedInput
        value={personal}
        onChange={setPersonal}
        label="Crecimiento Personal"
        placeholder="ej., Mantener rutina de ejercicio, practicar meditación, establecer límites saludables trabajo-vida..."
        icon={<Heart className="w-4 h-4" style={{ color: 'rgb(90, 90, 150)' }} />}
        minRows={3}
      />

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
