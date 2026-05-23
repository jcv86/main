'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check, Loader } from 'lucide-react'

interface PresenceCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function PresenceCheck({ onComplete }: PresenceCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(err => {
            // Handle autoplay errors
          })
          setCameraActive(true)
          setCameraError(false)
        }
      } catch (err) {
        setCameraError(true)
        setCameraActive(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const handleContinue = async () => {
    if (!cameraActive) return

    setIsLoading(true)
    // Simulate brief validation
    setTimeout(() => {
      onComplete({
        passed: true,
        score: 100
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Validación de Presencia
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Verificaremos que tu cámara está activa y lista.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video preview */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video border border-muted/30">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!cameraActive && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: 'rgb(170, 70, 170)' }} />
                <p className="text-white/80 font-semibold">Iniciando cámara...</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        {cameraActive && (
          <div className="rounded-lg p-4 bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-semibold text-green-400">Cámara Activa</p>
                <p className="text-sm text-white/70 mt-1">Tu cámara está lista. Haz clic en continuar para avanzar.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {cameraError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-semibold">Cámara No Disponible</p>
                <p className="text-sm text-white/70 mt-1">
                  No se puede acceder a la cámara. Por favor, verifica que has otorgado los permisos necesarios.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleContinue}
          disabled={!cameraActive || cameraError || isLoading}
          className="w-full text-white h-12 font-semibold"
          style={{ backgroundColor: cameraActive ? 'rgb(170, 70, 170)' : 'rgba(170, 70, 170, 0.4)' }}
        >
          {isLoading ? (
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

