'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Zap, Volume2, Eye } from 'lucide-react'

interface RealtimeFeedbackProps {
  isRecording: boolean
  videoStream: MediaStream | null
}

export interface FeedbackItem {
  type: 'posture' | 'eye-contact' | 'pace' | 'clarity' | 'confidence' | 'gestures'
  severity: 'critical' | 'warning' | 'info'
  message: string
  suggestion: string
  timestamp: number
}

export function RealtimeFeedbackEngine({ isRecording, videoStream }: RealtimeFeedbackProps) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isRecording || !videoStream) {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current)
      }
      return
    }

    // Set video source
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream
    }

    // Process frames every 3 seconds for real-time feedback
    processingIntervalRef.current = setInterval(() => {
      analyzeFrame()
    }, 3000)

    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current)
      }
    }
  }, [isRecording, videoStream])

  const analyzeFrame = async () => {
    try {
      if (!canvasRef.current || !videoRef.current) return

      setIsProcessing(true)

      // Capture current frame
      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx.drawImage(videoRef.current, 0, 0)

      // Convert to base64
      const imageData = canvasRef.current.toDataURL('image/jpeg')
      const base64 = imageData.split(',')[1]

      // Send to API for real-time analysis
      const response = await fetch('/api/multimodal/realtime-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frameData: base64 })
      })

      const data = await response.json()

      if (data.feedback) {
        // Add new feedback, keep last 5
        setFeedbackItems(prev => {
          const updated = [
            ...data.feedback.map((f: any) => ({
              ...f,
              timestamp: Date.now()
            })),
            ...prev
          ]
          return updated.slice(0, 5)
        })
      }
    } catch (error) {
      console.error('[v0] Real-time feedback error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isRecording) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} className="hidden" />

      {/* Feedback Title */}
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow" />
        <h3 className="font-semibold">Feedback en Tiempo Real</h3>
        {isProcessing && (
          <Badge variant="outline" className="ml-auto animate-pulse">
            Analizando...
          </Badge>
        )}
      </div>

      {/* Feedback Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {feedbackItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Comienza tu grabación para recibir feedback en tiempo real
          </p>
        ) : (
          feedbackItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-[28px] border-l-4 ${
                item.severity === 'critical'
                  ? 'bg-red/5 border-red/50'
                  : item.severity === 'warning'
                  ? 'bg-yellow/5 border-orange'
                  : 'bg-blue/5 border-blue/50'
              }`}
            >
              <div className="flex items-start gap-2">
                {item.severity === 'critical' && (
                  <AlertCircle className="w-4 h-4 text-red flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {getIconForType(item.type)} {item.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">💡 {item.suggestion}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue/5 border border-blue/20 rounded-[28px] p-3 text-xs text-blue">
        <p className="font-medium mb-1">Consejo:</p>
        <p>
          El feedback se actualiza cada 3 segundos. Intenta aplicar las sugerencias en tiempo real para mejorar tu desempeño.
        </p>
      </div>
    </div>
  )
}

function getIconForType(type: string): string {
  const icons: Record<string, string> = {
    'eye-contact': '👀',
    'posture': '🧍',
    'pace': '🗣️',
    'clarity': '📢',
    'confidence': '💪',
    'gestures': '🙌'
  }
  return icons[type] || '📝'
}
