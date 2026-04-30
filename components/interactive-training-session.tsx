'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Video, Mic, StopCircle, Play, Download, RotateCcw, CheckCircle2 } from 'lucide-react'
import { VideoRecorder } from './multimodal/video-recorder'
import { RealtimeFeedbackEngine } from './multimodal/realtime-feedback-engine'

interface InteractiveTrainingSessionProps {
  question: string
  guidance: string
  estimatedTime: string
  trainingType: 'guided' | 'structured' | 'challenging'
  onComplete?: (sessionId: string) => void
}

export function InteractiveTrainingSession({
  question,
  guidance,
  estimatedTime,
  trainingType,
  onComplete
}: InteractiveTrainingSessionProps) {
  const [step, setStep] = useState<'intro' | 'recording' | 'review'>('intro')
  const [isRecording, setIsRecording] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const handleStartRecording = async () => {
    try {
      setError(null)
      console.log('[v0] Starting recording - requesting media devices')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      console.log('[v0] Stream obtained:', stream.getTracks())
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })

      chunksRef.current = []
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        console.log('[v0] Data available:', e.data.size)
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        console.log('[v0] Recording stopped, chunks:', chunksRef.current.length)
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setRecordedVideo(blob)
        setVideoUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setStep('recording')

      console.log('[v0] Setting video ref srcObject')
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(e => console.error('[v0] Play error:', e))
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Recording error:', err)
      setError(`No se pudo acceder a la cámara o micrófono. Error: ${errorMsg}`)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleUploadVideo = async () => {
    if (!recordedVideo) return

    try {
      setError(null)
      const formData = new FormData()
      formData.append('video', recordedVideo, 'training.webm')
      formData.append('entrenamiento_type', trainingType)
      formData.append('question', question)

      const response = await fetch('/api/multimodal/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Fallo al subir video')
      }

      const data = await response.json()
      setSessionId(data.sessionId)
      setStep('review')
      
      if (onComplete) {
        onComplete(data.sessionId)
      }
    } catch (err) {
      setError('Error al procesar video. Por favor intenta de nuevo.')
      console.error('[v0] Upload error:', err)
    }
  }

  const handleDownloadVideo = () => {
    if (!recordedVideo) return
    
    const url = URL.createObjectURL(recordedVideo)
    const a = document.createElement('a')
    a.href = url
    a.download = `training-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Paso 1: Intro */}
      {step === 'intro' && (
        <Card className="border-cyan/50/30 bg-background">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan/40" />
              Entrenamiento Interactivo con Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pregunta */}
            <div className="bg-slate-950/50 p-6 rounded-[28px] border border-muted/70">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">PREGUNTA:</h3>
              <p className="text-white text-lg leading-relaxed">{question}</p>
            </div>

            {/* Guía */}
            <div className="bg-blue/30 p-6 rounded-[28px] border border-blue/50/20">
              <h3 className="text-sm font-semibold text-blue/30 mb-3 flex items-center gap-2">
                <span>💡 GUÍA PARA RESPONDER:</span>
              </h3>
              <div className="text-white/85 space-y-2 text-sm leading-relaxed">
                {guidance}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">¿Qué va a pasar?</h4>
              <ul className="space-y-2 text-sm text-white/85">
                <li className="flex gap-3">
                  <span className="text-cyan/40 font-bold">1.</span>
                  <span>Grabarás tu respuesta EN VIVO con cámara y micrófono</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan/40 font-bold">2.</span>
                  <span>La IA analizará tu postura, gestos, tono y contenido</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan/40 font-bold">3.</span>
                  <span>Recibirás feedback específico y sugerencias de mejora</span>
                </li>
              </ul>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>⏱️ Tiempo estimado:</span>
              <Badge variant="outline">{estimatedTime}</Badge>
            </div>

            {error && (
              <Alert className="bg-red/20 border-red/50/30">
                <AlertDescription className="text-red/30">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleStartRecording}
              className="w-full bg-cyan hover:bg-cyan text-white h-12 text-lg"
            >
              <Video className="w-5 h-5 mr-2" />
              Comenzar Grabación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Grabación */}
      {step === 'recording' && (
        <Card className="border-cyan/50/50 bg-background">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red/50 rounded-full animate-pulse" />
                GRABANDO
              </span>
              <Badge className="bg-red">EN VIVO</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover mirror"
                style={{ transform: 'scaleX(-1)' }}
              />
              <div className="absolute inset-0 border-2 border-red/50/50 rounded-lg pointer-events-none" />
            </div>

            {/* Pregunta visible mientras grabas */}
            <div className="bg-slate-950/50 p-4 rounded border border-muted/70 max-h-24 overflow-y-auto">
              <p className="text-white font-semibold">{question}</p>
            </div>

            {/* Controles */}
            <div className="flex gap-4">
              <Button
                onClick={handleStopRecording}
                className="flex-1 bg-red/80 hover:bg-red/70 text-white h-12"
                disabled={!isRecording}
              >
                <StopCircle className="w-5 h-5 mr-2" />
                Detener Grabación
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Asegúrate de estar bien iluminado. La cámara analiza tu lenguaje corporal.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Revisión */}
      {step === 'review' && recordedVideo && (
        <Card className="border-green/30 bg-background">
          <CardHeader>
            <CardTitle className="text-green/30 flex items-center gap-2">
              <span>✓</span>
              Grabación Completada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Playback */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                controls
                src={videoUrl || undefined}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadVideo}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Video
              </Button>
              <Button
                onClick={() => setStep('intro')}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Grabar de Nuevo
              </Button>
            </div>

            {/* Upload */}
            <Button
              onClick={handleUploadVideo}
              className="w-full bg-cyan hover:bg-cyan text-white h-12"
            >
              {sessionId ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Análisis Completado
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesar Análisis IA
                </>
              )}
            </Button>

            {sessionId && (
              <Alert className="bg-green/20 border-green/30">
                <AlertDescription className="text-green/30">
                  Sesión guardada: {sessionId}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
