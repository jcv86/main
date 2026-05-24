'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'

interface A2Day1HypothesisProps {
  onNext: (hypothesis: string) => void
  onBack: () => void
  visionData: any
}

export function A2Day1Hypothesis({
  onNext,
  onBack,
  visionData,
}: A2Day1HypothesisProps) {
  const [hypothesis, setHypothesis] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate hypothesis based on vision data
    const generateHypothesis = async () => {
      setIsLoading(true)
      try {
        // For now, generate a structured hypothesis from user input
        const hypothesisText = `HIPÓTESIS DE RUTA INICIAL

Durante los próximos 30 días, tu ruta debe enfocarse en:

1. INVESTIGACIÓN (Días 1-10)
Tu objetivo principal es transformarte de "${visionData.mainBlocker.substring(0, 30)}..." a "${visionData.change30Days.substring(0, 30)}..."
Durante esta fase, vamos a:
- Recolectar evidencia real de tu trabajo anterior
- Analizar qué quiere el mercado para roles como "${visionData.targetRole.substring(0, 40)}..."
- Construir una identidad profesional clara y validada
- Crear tu primer "candidate board" con pruebas

2. CONSTRUCCIÓN (Días 11-20)
Basado en lo que descubramos en Investigación, construiremos:
- CV moderno con narrativa clara
- Historias STAR para entrevistas
- LinkedIn completamente renovado
- Materiales de candidatura profesionales

3. VALIDACIÓN (Días 21-30)
Lanzamiento y validación real:
- Networking y outreach estratégico
- Aplicaciones con narrativa coherente
- Mock interviews para refinar
- Ajustes finales antes de launch

TU DIRECCIÓN
Tu objetivo es pasar de: "${visionData.mainBlocker.substring(0, 50)}..."
A ser un candidato fuerte para: "${visionData.targetRole.substring(0, 60)}..."

TU BLOQUEADOR
El patrón que queremos resolver: "${visionData.mainBlocker.substring(0, 80)}..."

POR QUÉ ES POSIBLE
Basado en tu cambio deseado ("${visionData.change30Days.substring(0, 60)}..."), 
esto es absolutamente alcanzable en 30 días si nos enfocamos en evidencia real y narrativa clara.`

        setHypothesis(hypothesisText)
      } catch (error) {
        console.error('[v0] Error generating hypothesis:', error)
        setHypothesis('Error al generar hipótesis. Intenta de nuevo.')
      } finally {
        setIsLoading(false)
      }
    }

    generateHypothesis()
  }, [visionData])

  const handleAccept = () => {
    onNext(hypothesis)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(80, 160, 170, 0.2)', border: '1px solid' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: 'rgb(80, 160, 170)' }} />
          <p className="text-sm font-semibold text-white">Coach está generando tu hipótesis de ruta...</p>
        </div>
      </div>

      {/* Hypothesis Display */}
      {isLoading ? (
        <div className="space-y-4">
          <div
            className="rounded-lg p-8 animate-pulse"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
          >
            <div className="space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
              <div className="h-4 bg-white/20 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg p-6 space-y-4 whitespace-pre-wrap text-sm text-white/80 leading-relaxed"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)', borderColor: 'rgba(80, 160, 170, 0.2)', border: '1px solid' }}
        >
          {hypothesis}
        </div>
      )}

      {/* Options */}
      {!isLoading && (
        <div className="space-y-3 pt-4">
          <div className="flex gap-3">
            <Button
              onClick={handleAccept}
              className="flex-1"
              size="lg"
              style={{ backgroundColor: 'rgb(90, 90, 150)', color: 'white' }}
            >
              Aceptar Hipótesis →
            </Button>
          </div>

          <details className="text-xs text-white/50 space-y-2">
            <summary className="cursor-pointer hover:text-white/70 font-semibold">
              Opciones adicionales
            </summary>
            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                disabled
                style={{ borderColor: 'rgba(80, 160, 170, 0.2)', color: 'rgba(255,255,255,0.5)' }}
              >
                Pedir versión más directa
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                disabled
                style={{ borderColor: 'rgba(80, 160, 170, 0.2)', color: 'rgba(255,255,255,0.5)' }}
              >
                Pedir versión más simple
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={handleAccept}
                style={{ borderColor: 'rgba(80, 160, 170, 0.2)', color: 'rgba(255,255,255,0.9)' }}
              >
                Editar manualmente
              </Button>
            </div>
          </details>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a preguntas
      </button>
    </div>
  )
}
