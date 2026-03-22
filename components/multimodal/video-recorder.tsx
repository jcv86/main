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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Recorder
        </CardTitle>
        <CardDescription>
          Record your interview practice session. Duration: 2-15 minutes recommended.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Preview */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRecording && !recordedBlob && (
            <Button onClick={startRecording} className="flex-1 bg-red-600 hover:bg-red-700">
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              <div className="flex-1 flex items-center justify-center bg-red-100 rounded-lg">
                <span className="animate-pulse text-red-600 font-semibold">Recording...</span>
              </div>
              <Button onClick={stopRecording} variant="outline">
                Stop
              </Button>
            </>
          )}

          {recordedBlob && !isRecording && (
            <>
              <Button onClick={() => setRecordedBlob(null)} variant="outline" className="flex-1">
                Retake
              </Button>
              <Button
                onClick={uploadVideo}
                disabled={isUploading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {recordedBlob && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
            ✓ Video recorded: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </CardContent>
    </Card>
  )
}
