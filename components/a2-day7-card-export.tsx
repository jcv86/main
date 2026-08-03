'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronRight, Download, ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CareerMirror } from '@/lib/supabase/a2-days7-8'

interface Day7CardExportProps {
  mirror: CareerMirror
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

interface A3ProgressPayload {
  progress?: {
    completedModuleIds?: string[]
  }
}

export function Day7CardExport({
  mirror,
  onComplete,
  isSubmitting,
}: Day7CardExportProps) {
  const [checkpointCompleted, setCheckpointCompleted] = useState(false)
  const [checkingCheckpoint, setCheckingCheckpoint] = useState(true)
  const [checkpointError, setCheckpointError] = useState<string | null>(null)

  const verifyCheckpoint = async () => {
    setCheckingCheckpoint(true)
    setCheckpointError(null)
    try {
      const response = await fetch('/api/a3/user-progress', {
        credentials: 'include',
        cache: 'no-store',
      })
      const payload = (await response.json().catch(() => ({}))) as A3ProgressPayload
      if (!response.ok) throw new Error('No pudimos verificar Entrenamiento.')

      const completed = Boolean(
        payload.progress?.completedModuleIds?.includes('career-mirror'),
      )
      setCheckpointCompleted(completed)
      if (!completed) {
        setCheckpointError(
          'Completa el Módulo 1 de Entrenamiento y luego vuelve a verificar.',
        )
      }
    } catch (error) {
      console.error('[v0] Day 7 checkpoint verification error:', error)
      setCheckpointCompleted(false)
      setCheckpointError(
        error instanceof Error
          ? error.message
          : 'No pudimos verificar Entrenamiento.',
      )
    } finally {
      setCheckingCheckpoint(false)
    }
  }

  useEffect(() => {
    void verifyCheckpoint()

    const onFocus = () => void verifyCheckpoint()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const handleExport = () => {
    const cardData = JSON.stringify(mirror, null, 2)
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(cardData)}`,
    )
    element.setAttribute(
      'download',
      `espejo-carrera-${new Date().toISOString().split('T')[0]}.json`,
    )
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Preparación del primer checkpoint
        </h2>
        <p className="text-white/70">
          Tu tarjeta de A2 alimenta el Módulo 1 real de Entrenamiento.
        </p>
      </div>

      <div className="space-y-4">
        <div
          className="rounded-lg border-2 border-cyan-400/60 p-8"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.12)' }}
        >
          <p className="mb-4 text-center text-sm font-semibold text-cyan-300">
            TU ESPEJO PROFESIONAL
          </p>
          <div className="space-y-4 text-center text-white">
            <p className="text-2xl font-bold">{mirror.mirror_card_title}</p>
            {mirror.mirror_card_content && (
              <>
                <p className="text-lg text-white/80">
                  {mirror.mirror_card_content.description}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-xs uppercase text-white/60">Rol</p>
                    <p className="font-semibold text-cyan-300">
                      {mirror.mirror_card_content.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-white/60">Industria</p>
                    <p className="font-semibold text-cyan-300">
                      {mirror.mirror_card_content.industry}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-white/60">Ajuste de mercado</p>
                    <p className="font-semibold text-cyan-300">
                      {mirror.mirror_card_content.marketFit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-white/60">Validación</p>
                    <p className="font-semibold text-cyan-300">
                      {mirror.validation_score}%
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={handleExport}
          className="w-full rounded-full border border-cyan-400/60 py-4 font-semibold text-white"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar respaldo del espejo
        </Button>
      </div>

      <section
        className={`space-y-4 rounded-2xl border p-6 ${
          checkpointCompleted
            ? 'border-emerald-500/40 bg-emerald-500/10'
            : 'border-purple-500/40 bg-purple-500/10'
        }`}
      >
        <div className="flex items-start gap-3">
          {checkpointCompleted ? (
            <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-400" />
          ) : (
            <ExternalLink className="mt-0.5 h-6 w-6 text-purple-300" />
          )}
          <div>
            <h3 className="font-semibold text-white">
              Módulo 1 de Entrenamiento · Espejo de Carrera
            </h3>
            <p className="mt-1 text-sm text-white/65">
              {checkpointCompleted
                ? 'El módulo real quedó completado y persistido. Ya puedes cerrar el Día 7.'
                : 'Abre el módulo real, completa su contrato y vuelve a esta pestaña.'}
            </p>
          </div>
        </div>

        {!checkpointCompleted && (
          <Button
            onClick={() =>
              window.open(
                '/despega/a3/career-mirror',
                '_blank',
                'noopener,noreferrer',
              )
            }
            className="w-full bg-purple-600 text-white hover:bg-purple-500"
          >
            Abrir Espejo de Carrera
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => void verifyCheckpoint()}
          disabled={checkingCheckpoint}
          className="w-full"
        >
          {checkingCheckpoint ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Verificar Módulo 1
        </Button>

        {checkpointError && !checkpointCompleted && (
          <p className="text-sm text-amber-100">{checkpointError}</p>
        )}
      </section>

      <Button
        onClick={onComplete}
        disabled={isSubmitting || checkingCheckpoint || !checkpointCompleted}
        className="w-full rounded-full py-6 font-semibold text-white"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSubmitting ? 'Completando...' : 'Completar Día 7 y continuar al Día 8'}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
