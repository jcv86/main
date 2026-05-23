'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day17ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day17Experience({ onComplete, userId }: Day17ExperienceProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvData, setCvData] = useState({
    fullName: '',
    professionalTitle: '',
    location: '',
    contactEmail: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
  })
  const sb = createClient()

  useEffect(() => {
    if (userId) {
      loadUserProfile()
    }
  }, [userId])

  const loadUserProfile = async () => {
    if (!userId) return
    setIsLoading(true)
    setError(null)
    try {
      const { data: profile, error: err } = await sb
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single()

      if (err && err.code !== 'PGRST116') throw err

      if (profile) {
        setCvData((prev) => ({
          ...prev,
          fullName: profile.full_name || '',
          contactEmail: profile.email || '',
        }))
      }
    } catch (err) {
      console.error('[v0] Error loading profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof cvData, value: string) => {
    setCvData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContinue = () => {
    if (!cvData.fullName || !cvData.professionalTitle) {
      setError('Por favor completa al menos Nombre y Título Profesional.')
      return
    }
    setStep(2)
  }

  const handleCompleteCVSkeleton = async () => {
    setIsSubmitting(true)
    try {
      if (!userId) throw new Error('No user ID')

      // Save CV skeleton data
      const { error: err } = await sb.from('a2_cv_skeleton_data').insert({
        user_id: userId,
        day_number: 17,
        full_name: cvData.fullName,
        professional_title: cvData.professionalTitle,
        location: cvData.location,
        contact_email: cvData.contactEmail,
        phone: cvData.phone,
        linkedin_url: cvData.linkedinUrl,
        portfolio_url: cvData.portfolioUrl,
        header_complete: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (err && err.code !== '23505') throw err

      await onComplete({
        dayNumber: 17,
        cvSkeleton: cvData,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error saving CV skeleton:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tu perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
          <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-500 flex-shrink-0 mt-0.5" />
          <p className="text-[rgb(80,160,170)]-500">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Tu Esqueleto de CV</h2>
            <p className="text-white/70 text-lg">El siguiente paso para transformar tu valor en un CV profesional</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Información del Encabezado</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={cvData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* Professional Title */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Título Profesional</label>
                <input
                  type="text"
                  placeholder="Ej: Product Manager, Ingeniero de Software"
                  value={cvData.professionalTitle}
                  onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Ubicación</label>
                <input
                  type="text"
                  placeholder="Ciudad, País"
                  value={cvData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={cvData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={cvData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Perfil LinkedIn (Opcional)</label>
                <input
                  type="url"
                  placeholder="linkedin.com/in/tuprofile"
                  value={cvData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Portfolio / Sitio Web (Opcional)</label>
                <input
                  type="url"
                  placeholder="tuportfolio.com"
                  value={cvData.portfolioUrl}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <p className="text-white/80 text-sm">
              Este encabezado es el primer contacto que un reclutador tiene con tu CV. Asegúrate de que sea profesional y preciso. Solo necesitas nombre y título; el resto es opcional pero recomendado.
            </p>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            Continuar a Vista Previa
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Vista Previa de tu Encabezado</h2>
            <p className="text-white/70">Así se verá en tu CV</p>
          </div>

          {/* CV Preview */}
          <div className="rounded-lg p-8" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', border: '2px solid rgba(80, 160, 170, 0.3)' }}>
            <div className="bg-white/5 p-6 rounded">
              <h3 className="text-white font-bold text-2xl">{cvData.fullName || 'Tu Nombre'}</h3>
              <p className="text-white/80 font-semibold text-lg mt-1">{cvData.professionalTitle || 'Tu Título'}</p>

              {/* Contact info line */}
              <div className="flex flex-wrap gap-4 text-white/60 text-sm mt-4">
                {cvData.location && <span>{cvData.location}</span>}
                {cvData.contactEmail && <span>{cvData.contactEmail}</span>}
                {cvData.phone && <span>{cvData.phone}</span>}
              </div>

              {/* Links */}
              {(cvData.linkedinUrl || cvData.portfolioUrl) && (
                <div className="flex gap-4 text-white/60 text-sm mt-3">
                  {cvData.linkedinUrl && <span>LinkedIn | Portfolio</span>}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <p className="text-white font-semibold text-sm mb-2">Listo para continuar</p>
            <p className="text-white/85 text-sm">
              Tu encabezado está configurado. Los próximos días agregaremos el resumen profesional, experiencia, habilidades y más.
            </p>
          </div>

          <Button
            onClick={handleCompleteCVSkeleton}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 17 - Esqueleto de CV'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
