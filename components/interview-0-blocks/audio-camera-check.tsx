'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Mic, Video } from 'lucide-react'

interface AudioCameraCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function AudioCameraCheck({ onComplete }: AudioCameraCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [micStatus, setMicStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [isTestingAudio, setIsTestingAudio] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [cameraQuality, setCameraQuality] = useState(0)

  useEffect(() => {
    const checkDevices = async () => {
      try {
        // Check camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream
          setCameraStatus('ready')
          // Estimate quality based on video settings
          const videoSettings = cameraStream.getVideoTracks()[0].getSettings()
          const quality = Math.min(100, ((videoSettings.width || 0) / 1280) * 100)
          setCameraQuality(Math.round(quality))
        }

        // Check microphone
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        })
        setMicStatus('ready')
        audioStream.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.error('[v0] Device check error:', err)
        if ((err as any).name === 'NotAllowedError') {
          setCameraStatus('error')
          setMicStatus('error')
        }
      }
    }

    checkDevices()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const handleTestAudio = async () => {
    setIsTestingAudio(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false
      })

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        setAudioLevel(Math.round((average / 255) * 100))

        if (isTestingAudio) {
          requestAnimationFrame(checkAudio)
        }
      }

      checkAudio()

      setTimeout(() => {
        setIsTestingAudio(false)
        stream.getTracks().forEach(track => track.stop())
        audioContext.close()
      }, 3000)
    } catch (err) {
      console.error('[v0] Audio test error:', err)
      setIsTestingAudio(false)
    }
  }

  const score = Math.round(
    (cameraStatus === 'ready' ? 50 : 0) + (micStatus === 'ready' ? 50 : 0)
  )
  const passed = cameraStatus === 'ready' && micStatus === 'ready'

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎙️</span>
          Audio & Cámara
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Verificaremos que tu micrófono y cámara funcionen correctamente
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera Check */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-white/70" />
              <span className="font-semibold text-white">Cámara</span>
            </div>
            <div className="flex items-center gap-2">
              {cameraStatus === 'ready' && (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">Lista</span>
                </>
              )}
              {cameraStatus === 'error' && (
                <span className="text-sm text-red-400">Error</span>
              )}
              {cameraStatus === 'checking' && (
                <span className="text-sm text-yellow-400">Verificando...</span>
              )}
            </div>
          </div>

          {cameraStatus === 'ready' && (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video border border-muted/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-black/80 rounded px-2 py-1 text-xs text-white/70">
                {cameraQuality}% Calidad
              </div>
            </div>
          )}

          {cameraStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
              No se puede acceder a la cámara. Verifica los permisos del navegador.
            </div>
          )}
        </div>

        {/* Microphone Check */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-white/70" />
              <span className="font-semibold text-white">Micrófono</span>
            </div>
            <div className="flex items-center gap-2">
              {micStatus === 'ready' && (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">Listo</span>
                </>
              )}
              {micStatus === 'error' && (
                <span className="text-sm text-red-400">Error</span>
              )}
              {micStatus === 'checking' && (
                <span className="text-sm text-yellow-400">Verificando...</span>
              )}
            </div>
          </div>

          {micStatus === 'ready' && (
            <div className="space-y-2">
              <Button
                onClick={handleTestAudio}
                disabled={isTestingAudio}
                className="w-full bg-blue/80 hover:bg-blue text-white h-10"
              >
                {isTestingAudio ? 'Probando audio...' : 'Probar Micrófono'}
              </Button>

              {isTestingAudio && (
                <div className="space-y-2">
                  <p className="text-xs text-white/70">Nivel de audio</p>
                  <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue transition-all"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/70">Habla hacia el micrófono para ver el nivel</p>
                </div>
              )}
            </div>
          )}

          {micStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
              No se puede acceder al micrófono. Verifica los permisos del navegador.
            </div>
          )}
        </div>

        {/* Summary */}
        <div className={`rounded-lg p-4 text-center ${passed ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
          <p className="text-white/70 text-sm">Puntuación</p>
          <p className={`text-3xl font-bold mt-1 ${passed ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {score}%
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => onComplete({ passed, score })}
          className={`w-full h-12 font-semibold ${
            passed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-muted/20 text-white/50 cursor-not-allowed'
          }`}
          disabled={!passed && (cameraStatus === 'checking' || micStatus === 'checking')}
        >
          {passed ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Continuar
            </>
          ) : (
            'Ambos dispositivos deben estar listos'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
