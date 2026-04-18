"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Camera, Upload } from "lucide-react"

interface PreInterviewAnalysisProps {
  onComplete: (analysis: any) => void
  scenarioContext: {
    cargo: string
    industria: string
    formalidad: "formal" | "semi-formal" | "casual"
  }
}

export function A3PreInterviewAnalysis({ onComplete, scenarioContext }: PreInterviewAnalysisProps) {
  const [stage, setStage] = useState<"capture" | "analyzing" | "results">("capture")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
    // Initialize video stream
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    initializeVideo()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setPhotoUrl(imageData)
        performAnalysis(imageData)
      }
    }
  }

  const performAnalysis = async (imageUrl: string) => {
    setStage("analyzing")
    
    // Simulated analysis - in production, integrate with computer vision API
    const mockAnalysis = {
      vestimenta_coherence: 78,
      vestimenta_feedback: "La vestimenta es profesional pero podría ser más formal para esta industria",
      postura_score: 72,
      postura_notes: "Buena postura general, pero hay ligera tensión en los hombros",
      expresion_facial_confidence: 65,
      expresion_notes: "Expresión algo nerviosa, trabajar en mantener calma aparente",
      contacto_visual_estimated: 60,
      pre_interview_readiness: 72,
      recommendations: [
        "Relaxar hombros - practica respiración profunda antes de la entrevista",
        "Sonrisa más natural - practica en espejo durante 2 minutos",
        "Contacto visual - mantén la mirada 60-70% del tiempo",
        "Considera usar accesorio profesional (reloj, pulsera) para mayor autoridad"
      ]
    }

    setAnalysis(mockAnalysis)
    setStage("results")
  }

  if (stage === "capture") {
    if (!mounted) return null
    
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            A3.0 - Análisis Pre-Entrevista
          </CardTitle>
          <CardDescription>
            Capturamos una foto para analizar tu presentación inicial antes de la entrevista
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-100 rounded-[28px] p-8 aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded"
            />
          </div>
          <canvas ref={canvasRef} className="hidden" width={640} height={480} />

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Posiciónate frente a una cámara con buena iluminación. La foto se analizará para:
              vestimenta, postura, expresión facial y confianza percibida.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">Cargar Foto</Button>
            <Button onClick={handleCapturePhoto}>Capturar Foto</Button>
          </div>

          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <div className="font-medium text-sm mb-2">Contexto de la Entrevista</div>
            <div className="space-y-1 text-sm">
              <div>Cargo: {scenarioContext.cargo}</div>
              <div>Industria: {scenarioContext.industria}</div>
              <div>Formalidad: {scenarioContext.formalidad}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (stage === "analyzing") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="font-medium">Analizando tu presentación...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Análisis Completado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Tu foto pre-entrevista"
            className="w-full rounded-lg max-h-64 object-cover"
          />
        )}

        {/* Readiness Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-[28px] border border-blue-200">
          <div className="text-sm text-gray-600 mb-2">Preparación General</div>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-indigo-600">
              {analysis?.pre_interview_readiness}%
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${analysis?.pre_interview_readiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-2">Vestimenta</div>
            <div className="text-2xl font-bold text-gray-900">{analysis?.vestimenta_coherence}%</div>
            <p className="text-xs text-gray-600 mt-2">{analysis?.vestimenta_feedback}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-2">Postura</div>
            <div className="text-2xl font-bold text-gray-900">{analysis?.postura_score}%</div>
            <p className="text-xs text-gray-600 mt-2">{analysis?.postura_notes}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-2">Confianza</div>
            <div className="text-2xl font-bold text-gray-900">{analysis?.expresion_facial_confidence}%</div>
            <p className="text-xs text-gray-600 mt-2">{analysis?.expresion_notes}</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-amber-50 p-4 rounded-[28px] border border-amber-200">
          <div className="font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Recomendaciones de Mejora
          </div>
          <ul className="space-y-2">
            {analysis?.recommendations?.map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => onComplete(analysis)}
          className="w-full"
          size="lg"
        >
          Continuar a Diagnóstico de Empleabilidad
        </Button>
      </CardContent>
    </Card>
  )
}
