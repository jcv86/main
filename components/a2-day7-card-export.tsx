'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight, Download } from 'lucide-react'
import { CareerMirror } from '@/lib/supabase/a2-days7-8'

interface Day7CardExportProps {
  mirror: CareerMirror
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

export function Day7CardExport({ mirror, onComplete, isSubmitting }: Day7CardExportProps) {
  const handleExport = () => {
    const cardData = JSON.stringify(mirror, null, 2)
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(cardData)}`)
    element.setAttribute('download', `espejo-carrera-${new Date().toISOString().split('T')[0]}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 5: Exportar Tu Espejo</h2>
        <p className="text-white/70">Descarga y comparte tu tarjeta profesional</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg p-8 border-2 border-cyan-400/60" style={{ backgroundColor: 'rgba(80, 160, 170, 0.12)' }}>
          <p className="text-sm font-semibold text-cyan-300 mb-4 text-center">TU ESPEJO PROFESIONAL</p>
          <div className="space-y-4 text-white text-center">
            <p className="text-2xl font-bold">{mirror.mirror_card_title}</p>
            {mirror.mirror_card_content && (
              <>
                <p className="text-white/80 text-lg">{mirror.mirror_card_content.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                  <div>
                    <p className="text-xs text-white/60 uppercase">Rol</p>
                    <p className="text-cyan-300 font-semibold">{mirror.mirror_card_content.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase">Industria</p>
                    <p className="text-cyan-300 font-semibold">{mirror.mirror_card_content.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase">Market Fit</p>
                    <p className="text-cyan-300 font-semibold">{mirror.mirror_card_content.marketFit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase">Validación</p>
                    <p className="text-cyan-300 font-semibold">{mirror.validation_score}%</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-white/80 text-sm">✓ Tu tarjeta espejo está lista para compartir. Puedes usarla en LinkedIn, entrevistas, y networking.</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleExport}
          className="w-full py-4 text-white font-semibold rounded-full border border-cyan-400/60"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Espejo
        </Button>

        <Button
          onClick={onComplete}
          disabled={isSubmitting}
          className="w-full py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          {isSubmitting ? 'Completando...' : 'Completar Día 7 → Día 8'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
