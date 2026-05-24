'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day22ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface Skill {
  id?: string
  skillName: string
  category: 'technical' | 'soft' | 'languages' | 'tools'
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsExperience?: number
}

export function Day22Experience({ onComplete, userId }: Day22ExperienceProps) {
  const [step, setStep] = useState(1)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sb = createClient()

  const categories = {
    technical: 'Técnicas',
    soft: 'Blandas',
    languages: 'Idiomas',
    tools: 'Herramientas',
  }

  // Initialize with empty categories
  useEffect(() => {
    const initialSkills = Object.keys(categories).map(cat => ({
      skillName: '',
      category: cat as Skill['category'],
    }))
    setSkills(initialSkills)
  }, [])

  const addSkill = (category: Skill['category']) => {
    setSkills([...skills, { skillName: '', category }])
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    setSkills(updated)
  }

  const handleOrganizeSkills = () => {
    const filledSkills = skills.filter(s => s.skillName.trim().length > 0)
    if (filledSkills.length === 0) {
      setError('Agrega al menos una habilidad en cada categoría')
      return
    }
    setSkills(filledSkills)
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId) {
        for (const skill of skills) {
          if (skill.skillName.trim()) {
            const { error: err } = await sb.from('a2_cv_skills').insert({
              user_id: userId,
              day_number: 22,
              skill_category: skill.category,
              skill_name: skill.skillName,
              proficiency_level: skill.proficiencyLevel,
              years_experience: skill.yearsExperience,
              is_verified: true,
            })

            if (err && err.code !== '23505') throw err
          }
        }
      }

      await onComplete({
        dayNumber: 22,
        skillCount: skills.filter(s => s.skillName.trim()).length,
        categoriesUsed: Array.from(new Set(skills.map(s => s.category))),
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 22:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Organizando habilidades...</p>
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

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Sección de Habilidades</h2>
            <p className="text-white/70 text-lg">Organiza tus habilidades en 4 categorías profesionales</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-3">Categorías a Incluir:</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• Técnicas: Lenguajes, frameworks, herramientas especializadas</li>
              <li>• Blandas: Liderazgo, comunicación, resolución de problemas</li>
              <li>• Idiomas: Español, inglés, otros con nivel de proficiencia</li>
              <li>• Herramientas: Software, plataformas, sistemas específicos</li>
            </ul>
          </div>

          <div className="space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryLabel]) => (
              <div key={categoryKey} className="rounded-lg p-4 border border-[rgba(80,160,170,0.2)]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{categoryLabel}</h3>
                  <Button
                    onClick={() => addSkill(categoryKey as Skill['category'])}
                    size="sm"
                    variant="outline"
                    className="text-white/80 hover:text-white border-[rgba(80,160,170,0.2)]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                <div className="space-y-2">
                  {skills
                    .filter(s => s.category === categoryKey)
                    .map((skill, idx) => {
                      const globalIdx = skills.indexOf(skill)
                      return (
                        <div key={globalIdx} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder={`Ej: ${categoryKey === 'technical' ? 'React, TypeScript' : categoryKey === 'soft' ? 'Liderazgo de equipos' : categoryKey === 'languages' ? 'English' : 'Figma'}`}
                              value={skill.skillName}
                              onChange={(e) => updateSkill(globalIdx, 'skillName', e.target.value)}
                              className="w-full px-3 py-2 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white placeholder-white/40 text-sm"
                            />
                          </div>
                          <select
                            value={skill.proficiencyLevel || 'intermediate'}
                            onChange={(e) => updateSkill(globalIdx, 'proficiencyLevel', e.target.value)}
                            className="px-2 py-2 rounded bg-white/10 border border-[rgba(80,160,170,0.2)] text-white text-xs"
                          >
                            <option value="beginner">Inicial</option>
                            <option value="intermediate">Intermedio</option>
                            <option value="advanced">Avanzado</option>
                            <option value="expert">Experto</option>
                          </select>
                          <Button
                            onClick={() => removeSkill(globalIdx)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleOrganizeSkills}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            Revisar y Aprobar Habilidades
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Sección de Habilidades</h2>
            <p className="text-white/70">Organizada y lista para exportar</p>
          </div>

          <div className="space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryLabel]) => {
              const categorySkills = skills.filter(s => s.category === categoryKey && s.skillName.trim())
              if (categorySkills.length === 0) return null
              return (
                <div key={categoryKey} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                  <h3 className="text-white font-semibold mb-3">{categoryLabel}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, idx) => (
                      <div key={idx} className="inline-block rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgba(80, 160, 170, 0.4)', borderWidth: '1px' }}>
                        <p className="text-white text-sm font-medium">{skill.skillName}</p>
                        {skill.proficiencyLevel && <p className="text-white/60 text-xs">{skill.proficiencyLevel}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-3">Sección de Habilidades Completa</p>
            <p className="text-white/85 text-sm">
              Tus habilidades están organizadas por categoría con niveles de proficiencia. Esto presenta un perfil claro al reclutador.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 22'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
