'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2 } from 'lucide-react'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day20ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day20Experience({ onComplete, userId }: Day20ExperienceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [marketStrategy, setMarketStrategy] = useState('')

  const handleDevelopStrategy = async () => {
    setIsLoading(true)
    try {
      // Generate template market strategy
      const template = `## Estrategia de Posicionamiento en el Mercado

### Identificación de Oportunidades
- Segmentos de mercado con demanda de tu perfil
- Tendencias en tu industria objetivo
- Gaps de talento que puedes llenar

### Propuesta de Valor
- Lo que te diferencia del mercado
- Beneficios concretos que entregas
- Evidencia que respalda tu propuesta

### Plan de Penetración
- Empresas/industrias objetivo
- Estrategia de contacto y presentación
- Timeline de búsqueda`

      setMarketStrategy(template)
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
        await onComplete({ dayNumber: 20, strategy: marketStrategy })
        return
      }

      const content = formatDocumentContent({
        'Estrategia de Mercado': marketStrategy,
        'Día': '20',
      })

      await saveDayDocument(userId, 20, 'cv_bullet', content, 'Estrategia de Mercado - Día 20')
      await onComplete({ dayNumber: 20, strategy: marketStrategy })
    } catch (err) {
      console.error('[v0] Error on Day 20:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-8">
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Estrategia de Mercado</h2>
            <p className="text-white/70">Define cómo te posicionarás en el mercado laboral</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
              <span className="text-white/60">Desarrollando estrategia...</span>
            </div>
          ) : (
            <Button
              onClick={handleDevelopStrategy}
              className="w-full py-6 text-lg"
              style={{ backgroundColor: 'rgb(80, 160, 170)' }}
            >
              Desarrollar Mi Estrategia
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Tu Estrategia de Mercado</h2>
            <p className="text-white/70 mb-4">Ajusta y personaliza tu estrategia</p>
          </div>

          <textarea
            value={marketStrategy}
            onChange={(e) => setMarketStrategy(e.target.value)}
            className="w-full h-64 p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            placeholder="Tu estrategia aquí..."
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
