'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'

interface Day7A2DataReviewProps {
  onDataReviewed: (a2Data: any) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day7A2DataReview({ onDataReviewed, isLoading, onNext }: Day7A2DataReviewProps) {
  const [reviewing, setReviewing] = useState(false)

  const handleReviewComplete = async () => {
    setReviewing(true)
    try {
      const a2Data = {
        completedDays: [1, 2, 3, 4, 5, 6],
        vision: 'Senior PM en B2B SaaS',
        evidence: ['Lancé 3 productos', 'Coordiné 8+ personas', 'Generé $500K MRR'],
        marketSignals: ['Alta demanda', 'Salarios 150K+', 'Roles en expansión'],
        candidateProfile: 'Solucionador estratégico',
        introduction: 'Soy PM especializado en lanzar productos B2B SaaS',
        identity: 'Organizador + Constructor',
        timestamp: new Date().toISOString(),
      }
      await onDataReviewed(a2Data)
      onNext()
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 1: Revisar tu A2 Completo</h2>
        <p className="text-white/70">Integración de Días 1-6</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
          <p className="text-sm font-semibold text-cyan-300 mb-4">📋 TU A2 SUMMARY</p>
          <div className="space-y-3 text-white/80 text-sm">
            <p>✓ Días completados: 1, 2, 3, 4, 5, 6</p>
            <p>✓ Visión: Senior PM en B2B SaaS</p>
            <p>✓ Evidencia recolectada: 7+ fragmentos</p>
            <p>✓ Señales de mercado: Analizadas</p>
            <p>✓ Introducción probada: Versión C</p>
            <p>✓ Identidad forjada: Organizador + Constructor</p>
          </div>
        </div>

        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-white/80 text-sm">Tu perfil A2 es fuerte y consistente. Ahora crearemos la tarjeta espejo que lo resume en 1 página.</p>
        </div>
      </div>

      <Button
        onClick={handleReviewComplete}
        disabled={reviewing || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {reviewing || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Preparando...
          </>
        ) : (
          <>
            A2 Revisado - Siguiente Paso
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
