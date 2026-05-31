'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, AlertTriangle, CheckCircle2, Calendar, BookOpen } from 'lucide-react'
import { getA2MissionByDay } from '@/lib/a2-helpers'

interface A3ModuleAccessGateProps {
  moduleId: string
  moduleNumber: number
  moduleTitle: string
  onAccessGranted?: () => void
  children?: React.ReactNode
}

export function A3ModuleAccessGate({
  moduleId,
  moduleNumber,
  moduleTitle,
  onAccessGranted,
  children,
}: A3ModuleAccessGateProps) {
  const [canAccess, setCanAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accessInfo, setAccessInfo] = useState<{
    canAccess: boolean
    reason: string
    blockReasons: string[]
    currentDay: number
    checkpointDay?: number
    day1Status: string
    day1Score?: number
  } | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/a3/access-check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) throw new Error('Access check failed')

        const data = await response.json()
        setAccessInfo(data)
        setCanAccess(data.canAccess)

        if (data.canAccess) {
          onAccessGranted?.()
        }
      } catch (error) {
        console.error('[v0] Access check error:', error)
        setCanAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [moduleId, onAccessGranted])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!canAccess && accessInfo) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-red-500/30 bg-red-500/10">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">
                  Módulo No Disponible
                </h2>
                <p className="text-white/80 mb-4">
                  Este módulo (Módulo {moduleNumber}: {moduleTitle}) aún no está disponible.
                </p>

                {/* Block Reasons */}
                <div className="space-y-2 mb-6">
                  {accessInfo.blockReasons.map((reason, idx) => (
                    <Alert key={idx} className="bg-slate-900/50 border-[rgb(80,160,170)]">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-slate-300">
                        {reason}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-900/30 border border-[rgb(80,160,170)]">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Día Actual</p>
                    <p className="text-lg font-bold text-white">{accessInfo.currentDay} / 90</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Checkpoint del Módulo</p>
                    <p className="text-lg font-bold text-purple-400">
                      Día {accessInfo.checkpointDay || '?'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Día 1 Completado</p>
                    <p className="text-lg font-bold text-slate-300">
                      {accessInfo.day1Status === 'passed' ? '✓ Aprobado' : '✗ No aprobado'}
                    </p>
                  </div>
                  {accessInfo.day1Score !== undefined && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Puntuación DTC</p>
                      <p className="text-lg font-bold text-slate-300">
                        {accessInfo.day1Score} / 100
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-slate-400 mb-4">
            Continúa con tu ruta de 90 días. Este módulo se desbloqueará automáticamente
            cuando llegues al momento adecuado.
          </p>
          <Button
            onClick={() => window.location.href = '/despega/a2-routes'}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Volver a Mi Ruta
          </Button>
        </div>
      </div>
    )
  }

  // Access Granted
  return (
    <div className="space-y-6">
      {accessInfo?.canAccess && (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <div className="p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                ¡Acceso Concedido!
              </p>
              <p className="text-xs text-emerald-200 mt-1">
                Has desbloqueado este módulo de aprendizaje.
              </p>
            </div>
          </div>
        </Card>
      )}
      {children}
    </div>
  )
}
