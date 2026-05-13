'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Video, Mic, Check, AlertCircle, Loader, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CameraMicrophoneTestProps {
  isOpen: boolean
  onClose: () => void
  onTestComplete: (passed: boolean) => void
  interviewType?: 'Sofia' | 'Coach'
}

export function CameraMicrophoneTest({ isOpen, onClose, onTestComplete, interviewType = 'Sofia' }: CameraMicrophoneTestProps) {
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [micStatus, setMicStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [isValidating, setIsValidating] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check both camera and microphone when dialog opens
  useEffect(() => {
    if (!isOpen) return

    const checkDevices = async () => {
      setCameraStatus('checking')
      setMicStatus('checking')

      try {
        // Check camera
        try {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          })
          
          // Display camera feed
          if (videoRef.current) {
            videoRef.current.srcObject = cameraStream
            streamRef.current = cameraStream
          }
          
          // Keep stream running for preview, will be cleaned up on unmount
          setCameraStatus('ready')
        } catch (cameraErr) {
          setCameraStatus('error')
          console.error('[v0] Camera error:', cameraErr)
        }

        // Check microphone
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
            video: false
          })
          audioStream.getTracks().forEach(track => track.stop())
          setMicStatus('ready')
        } catch (micErr) {
          setMicStatus('error')
          console.error('[v0] Microphone error:', micErr)
        }
      } catch (err) {
        console.error('[v0] Device check error:', err)
        setCameraStatus('error')
        setMicStatus('error')
      }
    }

    checkDevices()
  }, [isOpen])

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  const handleContinue = async () => {
    if (micStatus !== 'ready' || cameraStatus !== 'ready') return

    setIsValidating(true)
    // Brief validation delay
    setTimeout(() => {
      onTestComplete(true)
      setIsValidating(false)
      onClose()
    }, 1000)
  }

  const allReady = micStatus === 'ready' && cameraStatus === 'ready'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/90 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-lg flex items-center gap-2">
            <Video className="w-5 h-5 text-[rgb(170,70,170)]" />
            Verificación de Cámara y Micrófono
          </DialogTitle>
          <DialogDescription className="text-white/70 text-sm">
            <strong>IMPORTANTE:</strong> La cámara y micrófono son obligatorios para {interviewType === 'Coach' ? 'esta sesión de coaching' : 'la entrevista con Sofia'}. Ambos dispositivos deben estar funcionando correctamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Permission Required Alert */}
          <Alert className="bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]">
            <Info className="h-4 w-4 text-[rgb(170,70,170)]" />
            <AlertDescription className="text-white/80">
                  La cámara y el micrófono son <strong>OBLIGATORIOS</strong> para {interviewType === 'Coach' ? 'esta sesión de coaching' : 'la entrevista con Sofia'}.
            </AlertDescription>
          </Alert>

          {/* Camera Preview */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <Video className="w-4 h-4" />
              Vista Previa de Cámara
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video border-2 border-[rgba(170,70,170,0.3)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraStatus === 'checking' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <Loader className="w-8 h-8 text-[rgb(170,70,170)] animate-spin" />
                </div>
              )}
              {cameraStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
              )}
            </div>
          </div>

          {/* Device Status */}
          <div className="space-y-3">
            {/* Camera Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-lg">📹</span>
                <span className="text-white font-semibold">Cámara</span>
              </div>
              {cameraStatus === 'ready' ? (
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  Verificada
                </div>
              ) : cameraStatus === 'error' ? (
                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  Error
                </div>
              ) : (
                <Loader className="w-4 h-4 animate-spin text-white/60" />
              )}
            </div>

            {/* Microphone Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎤</span>
                <span className="text-white font-semibold">Micrófono</span>
              </div>
              {micStatus === 'ready' ? (
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  Listo
                </div>
              ) : micStatus === 'error' ? (
                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
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
            <div className="rounded-lg p-4 bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-400">Dispositivos No Disponibles</p>
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
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-[rgb(80,160,170)] text-[rgb(80,160,170)] hover:text-[rgb(80,160,170)] rounded-full h-12 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!allReady || isValidating}
              className="flex-1 bg-gradient-to-r from-[rgba(170,70,170,0.4)] to-[rgba(170,70,170,0.2)] hover:from-[rgba(170,70,170,0.5)] hover:to-[rgba(170,70,170,0.3)] text-white h-12 font-semibold rounded-full disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {interviewType === 'Coach' ? 'Continuar a Coaching' : 'Continuar a Sofia'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {interviewType === 'Coach' ? 'Continuar a Coaching' : 'Continuar a Sofia'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
