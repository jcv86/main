'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check, Loader } from 'lucide-react'
import { analyzePose } from '@/lib/interview-0/pose-detection'

interface PresenceCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function PresenceCheck({ onComplete }: PresenceCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<{ text: string; severity: string }[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [cameraError, setCameraError] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[v0] Camera access denied:', err)
        setCameraError(true)
        setFeedback([{ text: 'No se pudo acceder a la cámara. Por favor verifica los permisos.', severity: 'high' }])
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

  const handleAnalyzePresence = async () => {
    if (!videoRef.current) return

    setIsAnalyzing(true)
    setIsRecording(true)

    try {
      // Run pose detection
      const result = await analyzePose(videoRef.current)
      
      setScore(result.score)
      setFeedback(result.issues.map(issue => ({
        text: issue.text,
        severity: issue.severity
      })))

      console.log('[v0] Pose analysis result:', {
        score: result.score,
        issues: result.issues.length,
        feedback: result.issues
      })
    } catch (err) {
      console.error('[v0] Pose analysis error:', err)
      setScore(50)
      setFeedback([{ 
        text: 'Error al analizar tu presencia. Intenta nuevamente.', 
        severity: 'high' 
      }])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setIsRecording(false)
    setScore(0)
    setFeedback([])
  }

  const handleContinue = () => {
    onComplete({
      passed: score >= 60,
      score: Math.round(score)
    })
  }

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Validación de Presencia
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Analizaremos tu postura, contacto visual y presencia profesional en tiempo real
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
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-center">
                <p className="text-white/80 font-semibold">Posiciona tu cámara</p>
                <p className="text-white/60 text-sm mt-1">Tu cabeza debe ocupar 50-70% de la pantalla</p>
              </div>
            </div>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center space-y-2">
                <Loader className="w-8 h-8 animate-spin text-cyan mx-auto" />
                <p className="text-white text-sm">Analizando tu presencia...</p>
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {isRecording && feedback.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/70">
              {feedback.length === 1 ? 'Recomendación' : 'Recomendaciones'}
            </p>
            {feedback.map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${
                item.severity === 'high' 
                  ? 'bg-red-500/10 border border-red-500/30'
                  : item.severity === 'medium'
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}>
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  item.severity === 'high'
                    ? 'text-red-400'
                    : item.severity === 'medium'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`} />
                <span className="text-sm text-white/85">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Score */}
        {isRecording && (
          <div className={`rounded-lg p-4 text-center border ${
            score >= 80
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : score >= 60
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <p className="text-white/70 text-sm">Puntuación de Presencia</p>
            <p className={`text-4xl font-bold mt-1 ${
              score >= 80
                ? 'text-emerald-400'
                : score >= 60
                ? 'text-blue-400'
                : 'text-yellow-400'
            }`}>
              {Math.round(score)}
            </p>
            <p className="text-white/60 text-sm mt-2">
              {score >= 80 
                ? '¡Excelente presencia profesional!' 
                : score >= 60 
                ? 'Buena presencia. Aplica las recomendaciones para mejorar'
                : 'Puedes mejorar tu presencia. Sigue las recomendaciones'}
            </p>
          </div>
        )}

        {/* Error state */}
        {cameraError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 text-sm">
              No se puede acceder a la cámara. Verifica que has otorgado los permisos necesarios.
            </p>
          </div>
        )}

        {/* CTA */}
        {!isRecording ? (
          <Button
            onClick={handleAnalyzePresence}
            disabled={cameraError || isAnalyzing}
            className="w-full bg-blue hover:bg-cyan text-white h-12 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              'Analizar Presencia'
            )}
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleRetry}
              disabled={isAnalyzing}
              variant="outline"
              className="flex-1 h-12 font-semibold text-white"
            >
              Intentar de Nuevo
            </Button>
            <Button
              onClick={handleContinue}
              disabled={isAnalyzing}
              className={`flex-1 h-12 font-semibold ${
                score >= 60
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              <Check className="w-4 h-4 mr-2" />
              Continuar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
