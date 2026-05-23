'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

interface Gate {
  identity: string
  evidence: string
  material: string
}

interface A2Day1RoutGatesProps {
  onNext: (gates: Gate) => void
  onBack: () => void
  initialGates?: Gate
}

export function A2Day1RoutGates({
  onNext,
  onBack,
  initialGates,
}: A2Day1RoutGatesProps) {
  const [identity, setIdentity] = useState(initialGates?.identity || '')
  const [evidence, setEvidence] = useState(initialGates?.evidence || '')
  const [material, setMaterial] = useState(initialGates?.material || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateGate = (name: string, value: string): boolean => {
    const newErrors = { ...errors }

    if (value.length < 40) {
      newErrors[name] = 'Mínimo 40 caracteres'
      setErrors(newErrors)
      return false
    }

    delete newErrors[name]
    setErrors(newErrors)
    return true
  }

  const handleNext = () => {
    const q1Valid = validateGate('identity', identity)
    const q2Valid = validateGate('evidence', evidence)
    const q3Valid = validateGate('material', material)

    if (q1Valid && q2Valid && q3Valid) {
      onNext({ identity, evidence, material })
    }
  }

  const isComplete =
    identity.length >= 40 && evidence.length >= 40 && material.length >= 40

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Intro */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
      >
        <p className="text-sm text-white/70 leading-relaxed">
          Las 3 Puertas son checkpoints que validan tu progreso. No es tu CV completo. 
          Son cosas muy específicas que necesitan estar claras en momentos específicos.
        </p>
      </div>

      {/* Gate 1: Identity */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">PUERTA 1 — IDENTIDAD (Día 10)</h3>
            <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">Foundational</span>
          </div>
          <p className="text-sm text-white/60">
            ¿Qué debe estar más claro sobre ti? No es tu perfil completo. Es UNA cosa específica.
          </p>
        </div>

        <Textarea
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          placeholder="ej. Debo saber si realmente soy perfil de operaciones, qué skills reales demuestro, y cómo encajo en equipos..."
          className="min-h-[100px]"
          style={{
            backgroundColor: 'rgba(15, 15, 30, 0.5)',
            borderColor: 'rgba(90, 90, 150, 0.2)',
            color: 'white',
          }}
        />

        {errors.identity && (
          <p className="text-xs text-[rgb(80,160,170)]-400">{errors.identity}</p>
        )}
        {identity.length > 0 && (
          <p className="text-xs text-white/40">{identity.length} caracteres</p>
        )}
      </div>

      {/* Gate 2: Evidence */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">PUERTA 2 — EVIDENCIA (Día 20)</h3>
            <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">Validation</span>
          </div>
          <p className="text-sm text-white/60">
            ¿Qué prueba de valor debe existir? ¿Cuáles son los activos que demuestran tu valor?
          </p>
        </div>

        <Textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="ej. 3 historias STAR completas de proyectos concretos, CV con narrativa clara basado en impacto, LinkedIn renovado con testimonios..."
          className="min-h-[100px]"
          style={{
            backgroundColor: 'rgba(15, 15, 30, 0.5)',
            borderColor: 'rgba(90, 90, 150, 0.2)',
            color: 'white',
          }}
        />

        {errors.evidence && (
          <p className="text-xs text-[rgb(80,160,170)]-400">{errors.evidence}</p>
        )}
        {evidence.length > 0 && (
          <p className="text-xs text-white/40">{evidence.length} caracteres</p>
        )}
      </div>

      {/* Gate 3: Material */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">PUERTA 3 — MATERIAL (Día 30)</h3>
            <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">Launchable</span>
          </div>
          <p className="text-sm text-white/60">
            ¿Qué activo profesional debe existir y estar listo para usar?
          </p>
        </div>

        <Textarea
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="ej. CV completamente renovado, LinkedIn profesional con 500+ palabras de narrativa, portafolio de 3-5 proyectos con impacto cuantificado..."
          className="min-h-[100px]"
          style={{
            backgroundColor: 'rgba(15, 15, 30, 0.5)',
            borderColor: 'rgba(90, 90, 150, 0.2)',
            color: 'white',
          }}
        />

        {errors.material && (
          <p className="text-xs text-[rgb(80,160,170)]-400">{errors.material}</p>
        )}
        {material.length > 0 && (
          <p className="text-xs text-white/40">{material.length} caracteres</p>
        )}
      </div>

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
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
          Generar Roadmap →
        </Button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  )
}
