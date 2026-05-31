'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { X, Video, Mic } from 'lucide-react'

interface CameraPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export function CameraPermissionModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Verificación de Cámara y Micrófono',
  description = 'La cámara y micrófono son obligatorios para esta sesión de coaching. Ambos dispositivos deben estar funcionando correctamente.'
}: CameraPermissionModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'verified' | 'error'>('checking')
  const [microphoneStatus, setMicrophoneStatus] = useState<'checking' | 'verified' | 'error'>('checking')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const checkDevices = async () => {
      try {
        // Request camera and microphone permissions
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        })

        setStream(mediaStream)

        // Display camera feed
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        // Check camera
        const videoTracks = mediaStream.getVideoTracks()
        if (videoTracks.length > 0) {
          setCameraStatus('verified')
        } else {
          setCameraStatus('error')
        }

        // Check microphone
        const audioTracks = mediaStream.getAudioTracks()
        if (audioTracks.length > 0) {
          setMicrophoneStatus('verified')
        } else {
          setMicrophoneStatus('error')
        }

        // Enable continue button if both are verified
        if (videoTracks.length > 0 && audioTracks.length > 0) {
          setCanContinue(true)
        }
      } catch (error) {
        console.error('[v0] Permission error:', error)
        setCameraStatus('error')
        setMicrophoneStatus('error')
        setCanContinue(false)
      }
    }

    checkDevices()
  }, [isOpen])

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    onClose()
  }

  const handleContinue = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              {title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Important notice */}
          <div className="p-4 rounded-lg border border-purple-500/40 bg-purple-500/10">
            <p className="text-sm text-white/80">
              <span className="font-semibold text-purple-400">IMPORTANTE:</span> {description}
            </p>
          </div>

          {/* Device check notice */}
          <div className="p-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-4 h-4 rounded-full bg-cyan-400/60 flex items-center justify-center flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
            </div>
            <p className="text-sm text-white/80">
              La cámara y el micrófono son <span className="font-semibold text-white">OBLIGATORIOS</span> para esta sesión de coaching.
            </p>
          </div>

          {/* Camera preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Vista Previa de Cámara</h3>
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border border-cyan-400/20 rounded-lg"></div>
            </div>
          </div>

          {/* Device status */}
          <div className="space-y-2">
            {/* Camera status */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-[rgb(80,160,170)]/50 bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-white">Cámara</span>
              </div>
              <div className="flex items-center gap-2">
                {cameraStatus === 'checking' && (
                  <span className="text-xs text-white/60">Verificando...</span>
                )}
                {cameraStatus === 'verified' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-green-400">Verificada</span>
                  </>
                )}
                {cameraStatus === 'error' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-xs font-semibold text-red-400">Error</span>
                  </>
                )}
              </div>
            </div>

            {/* Microphone status */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-[rgb(80,160,170)]/50 bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-white">Micrófono</span>
              </div>
              <div className="flex items-center gap-2">
                {microphoneStatus === 'checking' && (
                  <span className="text-xs text-white/60">Verificando...</span>
                )}
                {microphoneStatus === 'verified' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-green-400">Listo</span>
                  </>
                )}
                {microphoneStatus === 'error' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-xs font-semibold text-red-400">Error</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ready status */}
          {canContinue && (
            <div className="p-3 rounded-lg border border-green-500/40 bg-green-500/10 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-400/60 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-400">Dispositivos Listos</p>
              <p className="text-xs text-white/60 ml-auto">Cámara y micrófono están activos. Continúa cuando estés listo.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-purple-500/20 flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-purple-500/40 text-white hover:bg-purple-500/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex-1 transition ${
              canContinue
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            Continuar a Coaching
          </Button>
        </div>
      </div>
    </div>
  )
}
