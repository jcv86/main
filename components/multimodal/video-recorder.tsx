'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, Video, Mic, Clock, AlertCircle } from 'lucide-react'

interface VideoRecorderProps {
  entrenamillentoType: string
  onUploadComplete: (sessionId: string) => void
  onError: (error: string) => void
}

export function VideoRecorder({ entrenamillentoType, onUploadComplete, onError }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [permissionError, setPermissionError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      setPermissionError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })

      chunksRef.current = []
      mediaRecorderRef.current = mediaRecorder
      setRecordingTime(0)

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setRecordedBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      const err = error as Error
      if (err.name === 'NotAllowedError') {
        setPermissionError('Permission denied. Please allow camera and microphone access.')
        onError('Permission denied. Please allow camera and microphone access.')
      } else if (err.name === 'NotFoundError') {
        setPermissionError('No camera or microphone found on your device.')
        onError('No camera or microphone found on your device.')
      } else {
        setPermissionError('Failed to access camera or microphone')
        onError('Failed to access camera or microphone')
      }
      console.error('[v0] Recording error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const uploadVideo = async () => {
    if (!recordedBlob) {
      onError('No video recorded')
      return
    }

    // Validate recording duration (2-15 minutes)
    if (recordingTime < 120) {
      onError('Video must be at least 2 minutes long')
      return
    }

    if (recordingTime > 900) {
      onError('Video must be less than 15 minutes long')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('video', recordedBlob, 'interview.webm')
      formData.append('entrenamiento_type', entrenamillentoType)
      formData.append('metadata', JSON.stringify({
        duration_seconds: recordingTime,
        recorded_at: new Date().toISOString()
      }))

      const response = await fetch('/api/multimodal/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      console.log('[v0] Video uploaded, session created:', data.sessionId)
      onUploadComplete(data.sessionId)
    } catch (error) {
      onError('Failed to upload video')
      console.error('[v0] Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Video className="w-4 h-4" />
          Grabar
        </CardTitle>
        <CardDescription className="text-xs">
          2-15 minutos. Ambas cámaras estarán activas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Permission Error Alert */}
        {permissionError && (
          <div className="flex items-start gap-3 p-3 bg-red/5 dark:bg-red/20 border border-red/20 dark:border-red/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red dark:text-red">{permissionError}</p>
              <button
                onClick={() => setPermissionError('')}
                className="text-xs text-red hover:text-red/80 dark:text-red mt-1"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {/* Video Preview */}
        <div className="bg-black rounded-lg overflow-hidden border border-muted/30 dark:border-muted/60">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Recording Status Indicator */}
        {isRecording && (
          <div className="flex items-center justify-between px-3 py-2 bg-red/5 dark:bg-red/20 rounded-[28px] border border-red/20 dark:border-red/30">
            <div className="flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 rounded-full bg-red"></span>
              <span className="text-xs font-medium text-red dark:text-red">Grabando...</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red dark:text-red">
              <Clock className="w-3 h-3" />
              {formatTime(recordingTime)}
            </div>
          </div>
        )}

        {/* Recording Duration Info */}
        {recordedBlob && (
          <div className="bg-blue/5 dark:bg-blue/20 border border-blue/20 dark:border-blue/30 rounded-[28px] p-3 space-y-1">
            <p className="text-xs text-blue dark:text-blue font-semibold">
              Video recorded: {formatTime(recordingTime)}
            </p>
            <p className="text-xs text-blue/70 dark:text-blue/60">
              Size: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {recordingTime < 120 && (
              <p className="text-xs text-orange dark:text-orange">
                ⚠ Video must be at least 2 minutes long
              </p>
            )}
            {recordingTime > 900 && (
              <p className="text-xs text-orange dark:text-orange">
                ⚠ Video is longer than 15 minutes
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isRecording && !recordedBlob && (
            <Button onClick={startRecording} className="flex-1 bg-red/80 hover:bg-red/70 h-9 text-sm">
              <Mic className="w-4 h-4 mr-1" />
              Empezar
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} className="flex-1 bg-muted/60 hover:bg-muted/70 h-9 text-sm">
              Detener
            </Button>
          )}

          {recordedBlob && !isRecording && (
            <>
              <Button 
                onClick={() => {
                  setRecordedBlob(null)
                  setRecordingTime(0)
                }}
                variant="outline" 
                className="flex-1 h-9 text-sm"
              >
                Repetir
              </Button>
              <Button
                onClick={uploadVideo}
                disabled={isUploading || recordingTime < 120 || recordingTime > 900}
                className="flex-1 bg-blue/80 hover:bg-blue/70 h-9 text-sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Subiendo
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 mr-1" />
                    Analizar
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Info Badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
          <span className="inline-block w-2 h-2 bg-blue rounded-full"></span>
          <span>El análisis tardará 60 segundos aproximadamente</span>
        </div>
      </CardContent>
    </Card>
  )
}

