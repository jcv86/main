'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'

interface Day7MirrorCardBuilderProps {
  a2Data: Record<string, any>
  onCardBuilt: (cardData: { title: string; content: Record<string, any> }) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day7MirrorCardBuilder({ a2Data, onCardBuilt, isLoading, onNext }: Day7MirrorCardBuilderProps) {
  const [building, setBuilding] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleBuildCard = async () => {
    setBuilding(true)
    try {
      const cardContent = {
        title: title || 'Senior Product Manager - B2B SaaS',
        description: description || 'Lanzo productos que generan impacto. Coordino equipos y creo valor duradero.',
        role: 'Senior PM',
        industry: 'B2B SaaS',
        strengths: ['Lanzamiento de productos', 'Coordinación de equipos', 'Generación de ingresos'],
        gap: 'Profundidad en retención',
        marketFit: 'Alto',
        salary: '$150K - $180K',
      }
      await onCardBuilt({ title: cardContent.title, content: cardContent })
      onNext()
    } finally {
      setBuilding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 2: Construir Tarjeta Espejo</h2>
        <p className="text-white/70">Tu marca profesional en 1 página</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Título de Espejo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Senior Product Manager - B2B SaaS"
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Descripción (1-2 líneas)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Lanzo productos que generan impacto. Coordino equipos de 8+ personas."
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={3}
          />
        </div>

        <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
          <p className="text-sm font-semibold text-cyan-300 mb-3">PREVIEW DE TARJETA</p>
          <div className="text-white/80 text-sm space-y-2">
            <p className="font-semibold">{title || 'Senior Product Manager - B2B SaaS'}</p>
            <p className="text-white/60">{description || 'Lanzo productos que generan impacto. Coordino equipos y creo valor duradero.'}</p>
            <div className="pt-3 border-t border-[rgba(80,160,170,0.2)] mt-3 space-y-1 text-xs">
              <p>Rol: Senior PM</p>
              <p>Fortalezas: Lanzamiento, Equipos, Ingresos</p>
              <p>Market Fit: Alto (demanda creciente)</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleBuildCard}
        disabled={building || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {building || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Construyendo...
          </>
        ) : (
          <>
            Tarjeta Lista - Siguiente Paso
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
