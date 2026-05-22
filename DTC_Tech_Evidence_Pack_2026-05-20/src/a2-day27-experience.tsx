'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day27ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface CheckpointValidation {
  cvStructureValid: boolean
  summaryConfirmed: boolean
  bulletsConfirmed: boolean
  skillsConfirmed: boolean
  languageCleaned: boolean
  recruiterReady: boolean
}

export function Day27Experience({ onComplete, userId }: Day27ExperienceProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validation, setValidation] = useState<CheckpointValidation>({
    cvStructureValid: false,
    summaryConfirmed: false,
    bulletsConfirmed: false,
    skillsConfirmed: false,
    languageCleaned: false,
    recruiterReady: false,
  })
  const [readinessScore, setReadinessScore] = useState(0)
  const sb = createClient()

  const loadAndValidate = async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      // Load completed CV work from previous days
      const { data: cvData } = await sb
        .from('a2_cv_export')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (cvData) {
        // Run validation checks
        const newValidation = {
          cvStructureValid: !!cvData.cv_structure,
          summaryConfirmed: !!cvData.professional_summary,
          bulletsConfirmed: cvData.improved_bullets && cvData.improved_bullets.length >= 3,
          skillsConfirmed: !!cvData.skills_section,
          languageCleaned: !!cvData.language_review,
          recruiterReady: !!cvData.export_url,
        }
        setValidation(newValidation)

        // Calculate readiness score
        const validChecks = Object.values(newValidation).filter(Boolean).length
        setReadinessScore(Math.round((validChecks / 6) * 100))
        setStep(2)
      }
    } catch (err) {
      console.error('[v0] Error loading CV data:', err)
      setError('No se pudo cargar tu CV. Por favor completa los días anteriores primero.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnterCheckpoint = async () => {
    setIsLoading(true)
    try {
      // Save checkpoint validation
      if (userId) {
        const { error: err } = await sb.from('a2_a3_checkpoint_3').insert({
          user_id: userId,
          day_number: 27,
          cv_structure_valid: validation.cvStructureValid,
          summary_confirmed: validation.summaryConfirmed,
          bullets_confirmed: validation.bulletsConfirmed,
          skills_confirmed: validation.skillsConfirmed,
          language_cleaned: validation.languageCleaned,
          recruiter_ready: validation.recruiterReady,
          recruiter_readiness_score: readinessScore,
          checkpoint_passed: readinessScore >= 70,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (err && err.code !== '23505') throw err
      }

      // Redirect to A3 Module 3
      window.location.href = '/despega/a3/module-3'
    } catch (err) {
      console.error('[v0] Error entering checkpoint:', err)
      setError('No pudimos ingresar al checkpoint. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Validando tu CV...</p>
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
            <h2 className="text-3xl font-bold text-white mb-3">Checkpoint A3: Constructor de CV</h2>
            <p className="text-white/70 text-lg">Tu 3er checkpoint de validación. Valida que tu CV esté listo para reclutadores.</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Preparación necesaria:</h3>
            <ul className="space-y-2">
              {[
                'Identidad Profesional completada',
                'Achievement Bank construído',
                'CV Skeleton organizado',
                'Professional Summary completado',
                'Bullets mejorados con fórmula',
                'Skills section organizado',
                'Lenguaje limpiado',
                'CV exportado',
              ].map((item, idx) => (
                <li key={idx} className="text-white/80 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'rgb(80, 160, 170)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={loadAndValidate}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Validando...' : 'Validar y Continuar'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">CV Readiness: {readinessScore}%</h2>
            <p className="text-white/70">
              {readinessScore >= 70
                ? 'Tu CV está listo para validación A3'
                : 'Completa los días anteriores para mejor puntuación'}
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(validation).map(([key, value]) => (
              <div key={key} className="rounded-lg p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                {value ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(80, 160, 170)' }} />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                )}
                <span className={value ? 'text-white' : 'text-white/60'}>
                  {key === 'cvStructureValid' && 'Estructura del CV validada'}
                  {key === 'summaryConfirmed' && 'Resumen profesional completado'}
                  {key === 'bulletsConfirmed' && 'Bullets mejorados con impacto'}
                  {key === 'skillsConfirmed' && 'Sección de skills organizada'}
                  {key === 'languageCleaned' && 'Lenguaje limpiado y específico'}
                  {key === 'recruiterReady' && 'CV exportado y listo'}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-white font-semibold mb-2">Próximo paso: Validación en A3 Module 3</p>
            <p className="text-white/85 text-sm">
              Entrarás al Estudio Constructor de CV donde un especialista validará tu CV y te dará feedback detallado sobre estructura, contenido y estrategia.
            </p>
          </div>

          <Button
            onClick={handleEnterCheckpoint}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Entrando...' : 'Entrar a A3 Module 3'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
