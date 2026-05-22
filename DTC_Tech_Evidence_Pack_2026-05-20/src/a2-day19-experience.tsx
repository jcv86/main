'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2 } from 'lucide-react'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day19ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day19Experience({ onComplete, userId }: Day19ExperienceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [jobAnalysis, setJobAnalysis] = useState('')

  const handleAnalyzeRole = async () => {
    setIsLoading(true)
    try {
      // Generate template analysis for the role
      const template = `## Análisis del Rol Objetivo

### Responsabilidades Clave
- Identificar oportunidades de crecimiento
- Liderar proyectos estratégicos
- Desarrollar propuestas de valor innovadoras

### Competencias Requeridas
- Pensamiento estratégico
- Capacidad de ejecución
- Comunicación efectiva

### Diferenciadores
- Experiencia comprobada en transformación
- Track record de impacto measurable
- Red de stakeholders estratégicos`

      setJobAnalysis(template)
      setCurrentStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    setIsLoading(true)
    try {
      if (!userId || userId.includes('demo-')) {
        // Skip save for demo users
        await onComplete({ dayNumber: 19, analysis: jobAnalysis })
        return
      }

      const content = formatDocumentContent({
        'Análisis del Rol': jobAnalysis,
        'Día': '19',
      })

      await saveDayDocument(userId, 19, 'cv_bullet', content, 'Análisis del Rol - Día 19')
      await onComplete({ dayNumber: 19, analysis: jobAnalysis })
    } catch (err) {
      console.error('[v0] Error on Day 19:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-8">
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Análisis Profundo del Rol</h2>
            <p className="text-white/70">Desglosamos las competencias y responsabilidades del rol objetivo</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
              <span className="text-white/60">Analizando...</span>
            </div>
          ) : (
            <Button
              onClick={handleAnalyzeRole}
              className="w-full py-6 text-lg"
              style={{ backgroundColor: 'rgb(80, 160, 170)' }}
            >
              Analizar Mi Rol Objetivo
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Tu Análisis del Rol</h2>
            <p className="text-white/70 mb-4">Personaliza este análisis según tu situación</p>
          </div>

          <textarea
            value={jobAnalysis}
            onChange={(e) => setJobAnalysis(e.target.value)}
            className="w-full h-64 p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="Tu análisis aquí..."
          />

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full py-6 text-lg"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                Continuar
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
