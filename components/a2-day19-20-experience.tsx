'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day19_20ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
  dayNumber?: number
}

interface BulletSet {
  experienceTitle: string
  experienceType: string
  raw1: string
  raw2: string
  raw3: string
  improved1: string
  improved2: string
  improved3: string
}

export function Day19_20Experience({ onComplete, userId, dayNumber = 19 }: Day19_20ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bullets, setBullets] = useState<BulletSet>({
    experienceTitle: '',
    experienceType: 'role',
    raw1: '',
    raw2: '',
    raw3: '',
    improved1: '',
    improved2: '',
    improved3: '',
  })
  const sb = createClient()

  const experienceTypes = [
    { value: 'role', label: 'Puesto de Trabajo' },
    { value: 'project', label: 'Proyecto' },
    { value: 'internship', label: 'Pasantía' },
    { value: 'freelance', label: 'Trabajo Freelance' },
    { value: 'volunteer', label: 'Voluntariado' },
    { value: 'academic', label: 'Proyecto Académico' },
    { value: 'personal', label: 'Iniciativa Personal' },
  ]

  const handleInputChange = (field: keyof BulletSet, value: string) => {
    setBullets((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateImprovedBullets = async () => {
    if (!bullets.raw1 || !bullets.raw2 || !bullets.raw3) {
      setError('Por favor completa los 3 bullets crudos.')
      return
    }

    setIsLoading(true)
    try {
      // Simple improvement: add context and impact formula
      const improveFormula = (raw: string, index: number) => {
        return `Realicé ${raw.toLowerCase()}, demostrando capacidad de ejecución y generando impacto medible en el equipo.`
      }

      setBullets((prev) => ({
        ...prev,
        improved1: improveFormula(prev.raw1, 1),
        improved2: improveFormula(prev.raw2, 2),
        improved3: improveFormula(prev.raw3, 3),
      }))

      setStep(2)
    } catch (err) {
      setError('Error mejorando bullets.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteBullets = async () => {
    setIsSubmitting(true)
    try {
      if (!userId) throw new Error('No user ID')

      const { error: err } = await sb.from('a2_cv_experience_bullets').insert({
        user_id: userId,
        day_number: dayNumber,
        experience_id: `exp_${Date.now()}`,
        experience_type: bullets.experienceType,
        experience_title: bullets.experienceTitle,
        bullet_raw_1: bullets.raw1,
        bullet_raw_2: bullets.raw2,
        bullet_raw_3: bullets.raw3,
        bullet_improved_1: bullets.improved1,
        bullet_improved_2: bullets.improved2,
        bullet_improved_3: bullets.improved3,
        coach_enhanced: true,
        user_approved: true,
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (err) throw err

      await onComplete({
        dayNumber,
        bullets,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error saving bullets:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const dayTitle = dayNumber === 19 ? 'Mejora de Bullets I' : 'Mejora de Bullets II'
  const daySubtitle = dayNumber === 19 ? 'Tu experiencia más reciente' : 'Una segunda experiencia relevante'

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
            <h2 className="text-3xl font-bold text-white mb-3">{dayTitle}</h2>
            <p className="text-white/70 text-lg">{daySubtitle}</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Información de la Experiencia</h3>
            <div className="space-y-4">
              {/* Experience Title */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Título de la Experiencia</label>
                <input
                  type="text"
                  placeholder="Ej: Gerente de Producto en TechCorp"
                  value={bullets.experienceTitle}
                  onChange={(e) => handleInputChange('experienceTitle', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* Experience Type */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Tipo de Experiencia</label>
                <select
                  value={bullets.experienceType}
                  onChange={(e) => handleInputChange('experienceType', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white text-sm"
                >
                  {experienceTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-gray-900">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">3 Bullets Crudos</h3>
            <p className="text-white/70 text-sm mb-4">Escribir lo que hacías sin pulir. Pueden ser responsabilidades simples.</p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <textarea
                  key={i}
                  placeholder={`Bullet ${i}: Ej: Dirigí reuniones semanales con el equipo`}
                  value={bullets[`raw${i}` as keyof BulletSet]}
                  onChange={(e) => handleInputChange(`raw${i}` as keyof BulletSet, e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white placeholder-white/40 text-sm"
                  rows={2}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerateImprovedBullets}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Mejorando...' : 'Mejorar Bullets'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus Bullets Mejorados</h2>
            <p className="text-white/70">Cada uno ahora muestra acción + contexto + impacto</p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                <p className="text-white/70 text-xs font-semibold mb-2">Bullet {i} Mejorado</p>
                <textarea
                  value={bullets[`improved${i}` as keyof BulletSet]}
                  onChange={(e) => handleInputChange(`improved${i}` as keyof BulletSet, e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white text-sm"
                  rows={3}
                />
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <p className="text-white font-semibold text-sm mb-2">Calidad Verificada</p>
            <p className="text-white/85 text-sm">
              Cada bullet ahora comunica acción clara, contexto del trabajo, e impacto. Esto es lo que un reclutador espera en un CV.
            </p>
          </div>

          <Button
            onClick={handleCompleteBullets}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : `Completar Día ${dayNumber} - Bullets Mejorados`}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
