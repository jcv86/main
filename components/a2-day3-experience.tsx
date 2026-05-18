'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Sparkles } from 'lucide-react'

interface Day3ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day3Experience({ onComplete }: Day3ExperienceProps) {
  const [step, setStep] = useState(1)
  const [marketData, setMarketData] = useState({
    companies: [] as string[],
    requirements: [] as string[],
    signals: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSearchMarket = () => {
    // Simulate finding 3 job postings and extracting market signals
    setMarketData({
      companies: ['TechCorp', 'DataWorks', 'CloudFirst'],
      requirements: ['Python, SQL, 5+ years', 'Data engineering focus', 'Cloud infrastructure'],
      signals: ['Python', 'AWS', 'Scala', 'Kubernetes', 'Leadership', 'Communication'],
    })
    setStep(2)
  }

  const handleCoachAnalysis = async () => {
    setStep(3)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 3,
        marketData,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 3:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">El Espejo del Mercado</h2>
            <p className="text-white/70">Descubre qué busca realmente el mercado por ti</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">¿Qué vas a hacer hoy?</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Buscar 3 vacantes reales en tu industria</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Extraer requisitos, miedos y fortalezas pedidas</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Generar reporte de señales del mercado (skills repetidas, tools, soft skills)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Recibir feedback de Coach sobre brecha real</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleSearchMarket}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Comenzar búsqueda de mercado
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Market Signals Encontradas</h2>
            <p className="text-white/70">Lo que el mercado realmente busca</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
              <p className="text-sm text-white/60 mb-2">COMPAÑÍAS ANALIZADAS</p>
              <div className="flex flex-wrap gap-2">
                {marketData.companies.map((company) => (
                  <span
                    key={company}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: 'rgba(80, 160, 170, 0.3)', color: 'rgb(80, 160, 170)' }}
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-4 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
              <p className="text-sm text-white/60 mb-2">SKILLS MÁS PEDIDAS</p>
              <div className="flex flex-wrap gap-2">
                {marketData.signals.map((signal) => (
                  <span
                    key={signal}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: 'rgba(90, 90, 150, 0.5)', color: 'rgb(200, 200, 255)' }}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleCoachAnalysis}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Ver análisis del Coach
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Análisis de Coach</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
              <p className="text-sm font-semibold text-cyan-300 mb-3">💡 LO QUE EL MERCADO QUIERE</p>
              <p className="text-white/90 mb-4">
                El mercado busca perfiles con Python sólido, experiencia en AWS, y capacidad para trabajar con tecnologías de escalabilidad como Kubernetes.
              </p>

              <p className="text-sm font-semibold text-cyan-300 mb-3">📍 LO QUE TÚ TIENES</p>
              <p className="text-white/90 mb-4">
                De tu Bóveda de Evidencia, ya hemos identificado experiencia en [X], que es muy relevante.
              </p>

              <p className="text-sm font-semibold text-cyan-300 mb-3">⚠️ LO QUE FALTA</p>
              <p className="text-white/90 mb-4">
                Deberías fortalecer: Kubernetes, Docker, experiencia en arquitectura de sistemas a escala.
              </p>

              <p className="text-sm font-semibold text-cyan-300 mb-3">📚 ENTRENAMIENTOS RECOMENDADOS</p>
              <ul className="space-y-2 text-white/80">
                <li>• Kubernetes Deep Dive (Linux Academy)</li>
                <li>• Advanced Docker (Pluralsight)</li>
                <li>• System Design for Tech Interviews</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 3'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
