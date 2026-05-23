'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Mic, AlertCircle, Loader } from 'lucide-react'

interface AudioCameraCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function AudioCameraCheck({ onComplete }: AudioCameraCheckProps) {
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [micStatus, setMicStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [isValidating, setIsValidating] = useState(false)

  // Check both camera and microphone on mount
  useEffect(() => {
    const checkDevices = async () => {
      try {
        // Check camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        })
        cameraStream.getTracks().forEach(track => track.stop())
        setCameraStatus('ready')

        // Check microphone
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        })
        audioStream.getTracks().forEach(track => track.stop())
        setMicStatus('ready')
      } catch (err) {
        console.error('[v0] Device check error:', err)
        if (cameraStatus === 'checking') setCameraStatus('error')
        setMicStatus('error')
      }
    }

    checkDevices()
  }, [])

  const handleContinue = async () => {
    if (micStatus !== 'ready' || cameraStatus !== 'ready') return

    setIsValidating(true)
    // Simulate brief validation
    setTimeout(() => {
      onComplete({
        passed: true,
        score: 100
      })
      setIsValidating(false)
    }, 1000)
  }

  const allReady = micStatus === 'ready' && cameraStatus === 'ready'

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Audio & Cámara
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Verificaremos que tu micrófono y cámara están activos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Device Status */}
        <div className="space-y-3">
          {/* Camera Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">📹</span>
              <span className="text-white font-semibold">Cámara</span>
            </div>
            {cameraStatus === 'ready' ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <Check className="w-4 h-4" />
                Verificada
              </div>
            ) : cameraStatus === 'error' ? (
              <div className="flex items-center gap-2 text-[rgb(80,160,170)]-400 text-sm font-semibold">
                <AlertCircle className="w-4 h-4" />
                Error
              </div>
            ) : (
              <Loader className="w-4 h-4 animate-spin text-white/60" />
            )}
          </div>

          {/* Microphone Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎤</span>
              <span className="text-white font-semibold">Micrófono</span>
            </div>
            {micStatus === 'ready' ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <Check className="w-4 h-4" />
                Listo
              </div>
            ) : micStatus === 'error' ? (
              <div className="flex items-center gap-2 text-[rgb(80,160,170)]-400 text-sm font-semibold">
                <AlertCircle className="w-4 h-4" />
                Error
              </div>
            ) : (
              <Loader className="w-4 h-4 animate-spin text-white/60" />
            )}
          </div>
        </div>

        {/* Ready State */}
        {allReady && (
          <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-semibold text-green-400">Dispositivos Listos</p>
                <p className="text-sm text-white/70 mt-1">Cámara y micrófono están activos. Continúa cuando estés listo.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {(cameraStatus === 'error' || micStatus === 'error') && (
          <div className="rounded-lg p-4 bg-[rgba(80,160,170,0.5)]-500/10 border border-[rgb(80,160,170)]-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[rgb(80,160,170)]-400">Dispositivos No Disponibles</p>
                <p className="text-sm text-white/70 mt-2">
                  {cameraStatus === 'error' && 'No se puede acceder a la cámara. '}
                  {micStatus === 'error' && 'No se puede acceder al micrófono. '}
                  Verifica que has otorgado los permisos necesarios en tu navegador.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleContinue}
          disabled={!allReady || isValidating}
          className="w-full text-white h-12 font-semibold"
          style={{
            backgroundColor: allReady ? 'rgb(170, 70, 170)' : 'rgba(170, 70, 170, 0.4)',
            borderRadius: '20px'
          }}
        >
          {isValidating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Continuar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

