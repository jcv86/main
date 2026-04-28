'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check } from 'lucide-react'

interface PresenceCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function PresenceCheck({ onComplete }: PresenceCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[v0] Camera access denied:', err)
        setFeedback(['No se pudo acceder a la cámara. Por favor verifica los permisos.'])
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

  const handleAnalyzePresence = () => {
    // Simulated presence analysis
    // In production, you'd use a real pose/face detection library
    const issues: string[] = []
    let calculatedScore = 100

    // Randomized feedback for demo
    const posibleIssues = [
      'Mantén la mirada al frente',
      'Sonríe naturalmente',
      'Relaja los hombros',
      'Acércate un poco más a la cámara',
      'Mejora tu postura'
    ]

    const randomIssues = posibleIssues.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2))
    issues.push(...randomIssues)
    calculatedScore -= randomIssues.length * 15

    setFeedback(issues)
    setScore(Math.max(60, calculatedScore))
    setIsRecording(true)
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
          Verificaremos tu postura, energía y contacto visual
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video preview */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
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
                <p className="text-white/80">Posiciona tu cámara</p>
                <p className="text-white/60 text-sm mt-1">Tu cabeza debe ocupar 60% de la pantalla</p>
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {isRecording && feedback.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/70">Recomendaciones</p>
            {feedback.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-400 mt-1">•</span>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Score */}
        {isRecording && (
          <div className="bg-blue/10 border border-blue/30 rounded-lg p-4 text-center">
            <p className="text-white/70 text-sm">Puntuación de Presencia</p>
            <p className="text-4xl font-bold text-white mt-1">{score}</p>
            <p className="text-white/60 text-sm mt-1">
              {score >= 80 ? '¡Excelente presencia!' : score >= 60 ? 'Buena presencia, algunos ajustes' : 'Puedes mejorar tu presencia'}
            </p>
          </div>
        )}

        {/* CTA */}
        {!isRecording ? (
          <Button
            onClick={handleAnalyzePresence}
            className="w-full bg-blue hover:bg-cyan text-white h-12 font-semibold"
          >
            Analizar Presencia
          </Button>
        ) : (
          <Button
            onClick={handleContinue}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold"
          >
            <Check className="w-4 h-4 mr-2" />
            Continuar
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
