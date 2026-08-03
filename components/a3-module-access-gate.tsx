'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, BookOpen, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { A3ModuleId } from '@/lib/a3/module-catalog'

interface A3ModuleAccessGateProps {
  moduleId: A3ModuleId
  moduleNumber: number
  moduleTitle: string
  onAccessGranted?: () => void
  children?: React.ReactNode
}

interface AccessInfo {
  canAccess: boolean
  reason: string
  blockReasons: string[]
  currentDay: number
  checkpointDay?: number
  day1Status: string
  day1Score?: number
}

interface AccessPayload {
  success?: boolean
  canAccess?: boolean
  reason?: string
  denialMessage?: string
  blockReasons?: string[]
  details?: {
    currentDay?: number
    checkpointDay?: number
    day1Status?: string
    day1Score?: number
    requestedModuleId?: string
  }
  error?: string
}

export function A3ModuleAccessGate({
  moduleId,
  moduleNumber,
  moduleTitle,
  onAccessGranted,
  children,
}: A3ModuleAccessGateProps) {
  const [loading, setLoading] = useState(true)
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/a3/access-check?moduleId=${encodeURIComponent(moduleId)}`, {
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as AccessPayload
        if (!response.ok) {
          throw new Error(payload.error || 'No pudimos verificar el acceso al módulo.')
        }

        const info: AccessInfo = {
          canAccess: Boolean(payload.canAccess),
          reason: payload.reason || '',
          blockReasons: Array.isArray(payload.blockReasons)
            ? payload.blockReasons
            : payload.denialMessage
              ? [payload.denialMessage]
              : [],
          currentDay: Math.max(1, Number(payload.details?.currentDay) || 1),
          checkpointDay: Number(payload.details?.checkpointDay) || undefined,
          day1Status: payload.details?.day1Status || 'not_started',
          day1Score:
            payload.details?.day1Score === undefined
              ? undefined
              : Math.max(0, Number(payload.details.day1Score) || 0),
        }
        setAccessInfo(info)
        if (info.canAccess) onAccessGranted?.()
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setAccessInfo({
          canAccess: false,
          reason: 'No pudimos verificar el acceso.',
          blockReasons: [
            error instanceof Error
              ? error.message
              : 'No pudimos verificar las condiciones de acceso.',
          ],
          currentDay: 1,
          day1Status: 'not_started',
        })
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [moduleId, onAccessGranted])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 h-8 w-8 animate-pulse" />
          <p>Verificando acceso al módulo…</p>
        </div>
      </div>
    )
  }

  if (!accessInfo?.canAccess) {
    const reasons = accessInfo?.blockReasons.length
      ? accessInfo.blockReasons
      : ['Este módulo todavía no está disponible.']

    return (
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <Card className="space-y-5 border-amber-500/30 bg-amber-500/5 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 h-6 w-6 shrink-0 text-amber-300" />
            <div>
              <h1 className="text-xl font-bold">Módulo aún no disponible</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Módulo {moduleNumber}: {moduleTitle}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {reasons.map((reason) => (
              <div key={reason} className="flex gap-2 rounded-lg border bg-background/50 p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Día actual de Tu Ruta</p>
              <p className="mt-1 font-semibold">Día {accessInfo?.currentDay || 1}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Checkpoint del módulo</p>
              <p className="mt-1 font-semibold">Día {accessInfo?.checkpointDay || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estado del Día 1</p>
              <p className="mt-1 font-semibold">
                {accessInfo?.day1Status === 'passed' ? 'Aprobado' : 'Pendiente'}
              </p>
            </div>
            {accessInfo?.day1Score !== undefined ? (
              <div>
                <p className="text-muted-foreground">Puntaje del Día 1</p>
                <p className="mt-1 font-semibold">{accessInfo.day1Score}/100</p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => window.location.assign('/despega/a3')}
            >
              Volver a Entrenamiento
            </Button>
            <Button
              className="sm:flex-1"
              onClick={() => window.location.assign('/despega/a2')}
            >
              Continuar Tu Ruta
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
