'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Video, Mic, Volume2, Check, AlertCircle, Loader } from 'lucide-react'

interface CameraMicrophoneTestProps {
  isOpen: boolean
  onClose: () => void
  onTestComplete: (passed: boolean) => void
}

export function CameraMicrophoneTest({ isOpen, onClose, onTestComplete }: CameraMicrophoneTestProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraState, setCameraState] = useState<'idle' | 'testing' | 'ready' | 'error'>('idle')
  const [microphoneState, setMicrophoneState] = useState<'idle' | 'testing' | 'listening' | 'error'>('idle')
  const [cameraError, setCameraError] = useState<string>('')
  const [micError, setMicError] = useState<string>('')
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  // Test Camera
  const testCamera = async () => {
    setCameraState('testing')
    setCameraError('')
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        mediaStreamRef.current = stream
        setCameraState('ready')
      }
    } catch (error) {
      setCameraState('error')
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Permiso denegado. Por favor, permite el acceso a la cámara.')
        } else if (error.name === 'NotFoundError') {
          setCameraError('No se encontró cámara. Por favor, conecta una cámara.')
        } else {
          setCameraError(`Error de cámara: ${error.message}`)
        }
      }
    }
  }

  // Test Microphone
  const testMicrophone = async () => {
    setMicrophoneState('testing')
    setMicError('')
    
    try {
      if (!mediaStreamRef.current) {
        // Get audio stream if we don't have it yet
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
      }

      // Create audio context and analyser
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const source = audioContext.createMediaStreamSource(mediaStreamRef.current)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      analyserRef.current = analyser

      setMicrophoneState('listening')

      // Start monitoring audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const monitorAudio = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        setAudioLevel(average)
        animationRef.current = requestAnimationFrame(monitorAudio)
      }
      monitorAudio()
    } catch (error) {
      setMicrophoneState('error')
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setMicError('Permiso denegado. Por favor, permite el acceso al micrófono.')
        } else if (error.name === 'NotFoundError') {
          setMicError('No se encontró micrófono. Por favor, conecta un micrófono.')
        } else {
          setMicError(`Error de micrófono: ${error.message}`)
        }
      }
    }
  }

  // Stop monitoring
  const stopMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setAudioLevel(0)
  }

  // Cleanup on close
  const handleClose = () => {
    stopMonitoring()
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    onClose()
  }

  // Handle test completion
  const handleComplete = () => {
    const passed = cameraState === 'ready' && (microphoneState === 'listening' || microphoneState === 'idle')
    handleClose()
    onTestComplete(passed)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-background border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Prueba de Cámara y Micrófono</DialogTitle>
          <DialogDescription className="text-white/70">
            Verifica que tu cámara y micrófono funcionen correctamente antes de comenzar la entrevista
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Camera Test */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[rgb(170,70,170)]" />
                <span className="font-medium text-white">Prueba de Cámara</span>
              </div>
              {cameraState === 'ready' && (
                <div className="flex items-center gap-1 text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Lista</span>
                </div>
              )}
              {cameraState === 'error' && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Error</span>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {cameraError}
              </p>
            )}

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video border-2 border-[rgba(170,70,170,0.3)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <p className="text-white/60 text-center">Haz clic en "Iniciar Cámara" para comenzar</p>
                </div>
              )}
              {cameraState === 'testing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <Loader className="w-8 h-8 text-[rgb(170,70,170)] animate-spin" />
                </div>
              )}
            </div>

            <Button
              onClick={testCamera}
              disabled={cameraState === 'testing' || cameraState === 'ready'}
              className="w-full bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.3)] border border-[rgba(170,70,170,0.5)]"
            >
              <Video className="w-4 h-4 mr-2" />
              {cameraState === 'ready' ? 'Cámara Funcionando' : cameraState === 'testing' ? 'Inicializando...' : 'Iniciar Cámara'}
            </Button>
          </div>

          {/* Microphone Test */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[rgb(170,70,170)]" />
                <span className="font-medium text-white">Prueba de Micrófono</span>
              </div>
              {microphoneState === 'listening' && (
                <div className="flex items-center gap-1 text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Escuchando</span>
                </div>
              )}
              {microphoneState === 'error' && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Error</span>
                </div>
              )}
            </div>

            {micError && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {micError}
              </p>
            )}

            {/* Audio Level Meter */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Nivel de Audio</span>
                <span className="text-sm font-mono text-[rgb(170,70,170)]">{Math.round(audioLevel)}</span>
              </div>
              <div className="w-full h-8 bg-black/50 rounded border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgb(200,130,200)] transition-all duration-100"
                  style={{ width: `${Math.min((audioLevel / 255) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-white/50">
                {microphoneState === 'listening'
                  ? 'Habla cerca del micrófono para ver la actividad'
                  : 'Haz clic en "Iniciar Micrófono" para comenzar'}
              </p>
            </div>

            <Button
              onClick={testMicrophone}
              disabled={microphoneState === 'testing' || microphoneState === 'listening'}
              className="w-full bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.3)] border border-[rgba(170,70,170,0.5)]"
            >
              <Mic className="w-4 h-4 mr-2" />
              {microphoneState === 'listening' ? 'Micrófono Funcionando' : microphoneState === 'testing' ? 'Inicializando...' : 'Iniciar Micrófono'}
            </Button>
          </div>

          {/* Status Summary */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Cámara</span>
              {cameraState === 'ready' ? (
                <span className="text-green-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Lista
                </span>
              ) : cameraState === 'error' ? (
                <span className="text-red-400">No Disponible</span>
              ) : (
                <span className="text-white/50">No Probada</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Micrófono</span>
              {microphoneState === 'listening' ? (
                <span className="text-green-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Funcionando
                </span>
              ) : microphoneState === 'error' ? (
                <span className="text-red-400">No Disponible</span>
              ) : (
                <span className="text-white/50">No Probado</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-white/20 text-white/70 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            disabled={cameraState !== 'ready'}
            className="bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
