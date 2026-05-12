'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Video, Mic, Volume2, Check, AlertCircle, Loader, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  const [isPreviewEnvironment, setIsPreviewEnvironment] = useState(false)
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0)

  // Check if we're in a restricted environment (iframe, v0 preview, etc.)
  useEffect(() => {
    const checkEnvironment = () => {
      const inIframe = window.self !== window.top
      const isLocalhost = window.location.hostname === 'localhost'
      const isV0Preview = window.location.hostname.includes('v0.dev') || 
                          window.location.hostname.includes('vercel') ||
                          document.referrer.includes('v0.dev')
      setIsPreviewEnvironment(inIframe || isV0Preview)
    }
    checkEnvironment()
  }, [])

  // Cleanup function for stopping all streams
  const stopAllStreams = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  // Cleanup on unmount or dialog close
  useEffect(() => {
    if (!isOpen) {
      stopAllStreams()
      setCameraState('idle')
      setMicrophoneState('idle')
    }
  }, [isOpen])

  // Test Camera
  const testCamera = async () => {
    setCameraState('testing')
    setCameraError('')
    
    try {
      // Stop previous stream if any
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        mediaStreamRef.current = stream
        
        // Ensure video plays after stream is attached
        videoRef.current.play().catch(err => {
          console.error('[v0] Error playing video:', err)
        })
        
        setCameraState('ready')
      }
    } catch (error) {
      setCameraState('error')
      setPermissionDeniedCount(prev => prev + 1)
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Permiso denegado. Por favor, permite el acceso a la cámara.')
        } else if (error.name === 'NotFoundError') {
          setCameraError('No se encontró cámara. Por favor, conecta una cámara.')
        } else if (error.name === 'NotReadableError') {
          setCameraError('La cámara está siendo usada por otra aplicación.')
        } else if (error.name === 'SecurityError') {
          setCameraError('Acceso bloqueado por la configuración de seguridad del navegador.')
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
      setPermissionDeniedCount(prev => prev + 1)
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setMicError('Permiso denegado. Por favor, permite el acceso al micrófono.')
        } else if (error.name === 'NotFoundError') {
          setMicError('No se encontró micrófono. Por favor, conecta un micrófono.')
        } else if (error.name === 'NotReadableError') {
          setMicError('El micrófono está siendo usado por otra aplicación.')
        } else if (error.name === 'SecurityError') {
          setMicError('Acceso bloqueado por la configuración de seguridad del navegador.')
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

  // Handle skip for demo/preview environments
  const handleSkipForDemo = () => {
    stopMonitoring()
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    onTestComplete(true) // Allow proceeding in demo mode
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
          <DialogTitle className="text-white text-lg">Verificación de Cámara y Micrófono</DialogTitle>
          <DialogDescription className="text-white/70 text-sm">
            <strong>IMPORTANTE:</strong> La cámara y micrófono son obligatorios para la entrevista con Sofia. Ambos dispositivos deben estar funcionando correctamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Permission Required Alert */}
          <Alert className="bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]">
            <Info className="h-4 w-4 text-[rgb(170,70,170)]" />
            <AlertDescription className="text-white/80">
              La cámara y el micrófono son <strong>OBLIGATORIOS</strong> para esta entrevista con Sofia. Necesitamos acceso completo a ambos dispositivos.
            </AlertDescription>
          </Alert>

          {/* Permission Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[rgb(80,160,170)] mt-1 flex-shrink-0" />
              <div className="text-sm text-white/70 space-y-2">
                <p className="font-medium text-white">Cómo permitir acceso:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Verás un popup del navegador pidiendo permisos</li>
                  <li>Haz clic en "Permitir" para cámara</li>
                  <li>Haz clic en "Permitir" para micrófono</li>
                  <li>Si no ves el popup, revisa la barra del navegador arriba</li>
                </ol>
              </div>
            </div>
          </div>
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
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                    <strong>Error de Cámara:</strong> {cameraError}
                  </p>
                  <p className="text-xs text-white/60 bg-white/5 rounded p-2">
                    💡 Si dice "Permiso denegado": Revisa en la barra de direcciones (arriba) si hay un ícono de cámara. Haz clic y permite el acceso. Luego haz clic en "Reintentar".
                  </p>
                </div>
                <Button
                  onClick={testCamera}
                  disabled={cameraState === 'testing'}
                  className="w-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Reintentar - Solicitar Permisos
                </Button>
              </div>
            )}

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video border-2 border-[rgba(170,70,170,0.3)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: 'block', backgroundColor: '#000' }}
              />
              {cameraState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <p className="text-white/60 text-center">Haz clic en "Solicitar Acceso a Cámara" para comenzar</p>
                </div>
              )}
              {cameraState === 'testing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <Loader className="w-8 h-8 text-[rgb(170,70,170)] animate-spin" />
                </div>
              )}
              {cameraState === 'error' && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <p className="text-red-400 text-center">No se pudo acceder a la cámara</p>
                </div>
              )}
            </div>

            <Button
              onClick={testCamera}
              disabled={cameraState === 'testing'}
              className={`w-full ${
                cameraState === 'ready'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : cameraState === 'error'
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                  : 'bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.3)] border border-[rgba(170,70,170,0.5)]'
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              {cameraState === 'ready' ? '✓ Cámara Funcionando' : cameraState === 'testing' ? 'Inicializando...' : cameraState === 'error' ? 'Reintentar Cámara' : 'Solicitar Acceso a Cámara'}
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
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                    <strong>Error de Micrófono:</strong> {micError}
                  </p>
                  <p className="text-xs text-white/60 bg-white/5 rounded p-2">
                    💡 Si dice "Permiso denegado": Revisa en la barra de direcciones si hay un ícono de micrófono. Haz clic y permite el acceso. Luego haz clic en "Reintentar".
                  </p>
                </div>
                <Button
                  onClick={testMicrophone}
                  disabled={microphoneState === 'testing'}
                  className="w-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Reintentar - Solicitar Permisos
                </Button>
              </div>
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
              disabled={microphoneState === 'testing'}
              className={`w-full ${
                microphoneState === 'listening'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : microphoneState === 'error'
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                  : 'bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.3)] border border-[rgba(170,70,170,0.5)]'
              }`}
            >
              <Mic className="w-4 h-4 mr-2" />
              {microphoneState === 'listening' ? '✓ Micrófono Funcionando' : microphoneState === 'testing' ? 'Inicializando...' : microphoneState === 'error' ? 'Reintentar Micrófono' : 'Solicitar Acceso a Micrófono'}
            </Button>
          </div>

          {/* Status Summary */}
          <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-white mb-3">Estado de Dispositivos (Ambos OBLIGATORIOS):</p>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded">
              <span className="text-white/70">Cámara</span>
              {cameraState === 'ready' ? (
                <span className="text-green-400 flex items-center gap-1 font-medium">
                  <Check className="w-4 h-4" /> Lista
                </span>
              ) : cameraState === 'error' ? (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Error - Revisa permisos
                </span>
              ) : (
                <span className="text-yellow-400">⏳ Esperando...</span>
              )}
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded">
              <span className="text-white/70">Micrófono</span>
              {microphoneState === 'listening' ? (
                <span className="text-green-400 flex items-center gap-1 font-medium">
                  <Check className="w-4 h-4" /> Funcionando
                </span>
              ) : microphoneState === 'error' ? (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Error - Revisa permisos
                </span>
              ) : (
                <span className="text-yellow-400">⏳ Esperando...</span>
              )}
            </div>
          </div>
        </div>

        {/* Skip option for preview/demo environments */}
        {(isPreviewEnvironment || permissionDeniedCount >= 2) && (cameraState === 'error' || microphoneState === 'error') && (
          <Alert className="bg-yellow-500/10 border-yellow-500/30">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-white/80 text-sm">
              <strong>Entorno de Vista Previa Detectado:</strong> Los permisos de cámara/micrófono pueden estar restringidos en este entorno. 
              Puedes continuar en modo demo para explorar la interfaz, o abrir la aplicación en una nueva pestaña para acceso completo.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-3 justify-between pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-white/20 text-white/70 hover:text-white"
          >
            Cancelar
          </Button>
          
          <div className="flex gap-3 items-center">
            {/* Skip for Demo button - shown when in preview or after failed attempts */}
            {(isPreviewEnvironment || permissionDeniedCount >= 2) && (cameraState === 'error' || microphoneState === 'error') && (
              <Button
                onClick={handleSkipForDemo}
                variant="outline"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                Continuar en Modo Demo
              </Button>
            )}
            
            {cameraState !== 'ready' || microphoneState !== 'listening' ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/60 hidden sm:inline">Completa ambas pruebas</span>
              </div>
            ) : null}
            
            <Button
              onClick={handleComplete}
              disabled={cameraState !== 'ready' || microphoneState !== 'listening'}
              className="bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              {cameraState === 'ready' && microphoneState === 'listening' ? 'Continuar a Sofia' : 'Continuar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
