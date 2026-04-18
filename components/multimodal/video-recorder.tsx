'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, Video, Mic } from 'lucide-react'

interface VideoRecorderProps {
  entrenamillentoType: string
  onUploadComplete: (sessionId: string) => void
  onError: (error: string) => void
}

export function VideoRecorder({ entrenamillentoType, onUploadComplete, onError }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })

      chunksRef.current = []
      mediaRecorderRef.current = mediaRecorder

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
      onError('Failed to access camera or microphone')
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

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('video', recordedBlob, 'interview.webm')
      formData.append('entrenamiento_type', entrenamillentoType)

      const response = await fetch('/api/multimodal/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
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
        {/* Video Preview - Compact */}
        <div className="bg-black rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Recording Status Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red/5 dark:bg-red-950 rounded-[28px] border border-red/20 dark:border-red-800">
            <span className="animate-pulse w-2 h-2 rounded-[20px] bg-red-600"></span>
            <span className="text-xs font-medium text-red dark:text-red-300">Grabando...</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isRecording && !recordedBlob && (
            <Button onClick={startRecording} className="flex-1 bg-red-600 hover:bg-red h-9 text-sm">
              <Mic className="w-4 h-4 mr-1" />
              Empezar
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} className="flex-1 bg-slate-600 hover:bg-slate-700 h-9 text-sm">
              Detener
            </Button>
          )}

          {recordedBlob && !isRecording && (
            <>
              <Button 
                onClick={() => setRecordedBlob(null)} 
                variant="outline" 
                className="flex-1 h-9 text-sm"
              >
                Repetir
              </Button>
              <Button
                onClick={uploadVideo}
                disabled={isUploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-9 text-sm"
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

        {recordedBlob && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-[28px] p-2 text-xs text-green-700 dark:text-green-300">
            ✓ Video recorded: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </CardContent>
    </Card>
  )
}
