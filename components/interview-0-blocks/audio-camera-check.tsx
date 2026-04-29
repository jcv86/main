'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Mic } from 'lucide-react'

interface AudioCameraCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function AudioCameraCheck({ onComplete }: AudioCameraCheckProps) {
  const [micStatus, setMicStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [isTestingAudio, setIsTestingAudio] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  // Only check microphone on mount - camera already verified in previous step
  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        })
        setMicStatus('ready')
        audioStream.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.error('[v0] Microphone check error:', err)
        setMicStatus('error')
      }
    }

    checkMicrophone()
  }, [])

  const [maxAudioLevel, setMaxAudioLevel] = useState(0)
  const [audioTestResult, setAudioTestResult] = useState<'good' | 'fair' | 'poor' | null>(null)

  const handleTestAudio = async () => {
    setIsTestingAudio(true)
    setMaxAudioLevel(0)
    setAudioTestResult(null)
    let stream: MediaStream | null = null
    let audioContext: AudioContext | null = null

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false
      })

      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let isRunning = true
      let max = 0

      const checkAudio = () => {
        if (!isRunning) return
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        const level = Math.round((average / 255) * 100)
        setAudioLevel(level)
        max = Math.max(max, level)
        setMaxAudioLevel(max)
        requestAnimationFrame(checkAudio)
      }

      checkAudio()

      // Stop after 3 seconds and evaluate
      setTimeout(() => {
        isRunning = false
        setIsTestingAudio(false)
        
        // Evaluate audio quality based on max level detected
        let result: 'good' | 'fair' | 'poor'
        if (max >= 50) {
          result = 'good'
        } else if (max >= 30) {
          result = 'fair'
        } else {
          result = 'poor'
        }
        setAudioTestResult(result)
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
        if (audioContext && audioContext.state !== 'closed') {
          audioContext.close()
        }
      }, 3000)
    } catch (err) {
      console.error('[v0] Audio test error:', err)
      setIsTestingAudio(false)
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  }

  // Score depends on audio quality test result, not just mic availability
  const audioQualityScore = audioTestResult === 'good' ? 100 : audioTestResult === 'fair' ? 70 : audioTestResult === 'poor' ? 40 : 0
  const passed = micStatus === 'ready' && (audioTestResult === 'good' || audioTestResult === 'fair')
  const score = Math.max(audioQualityScore, passed ? 70 : 0)

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Audio & Cámara
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Verificaremos que tu micrófono y cámara funcionen correctamente
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Device Status */}
        <div className="space-y-3">
          {/* Camera - Already verified */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📹</span>
              <span className="text-white font-semibold">Cámara</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <Check className="w-4 h-4" />
              Verificada
            </div>
          </div>

          {/* Microphone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎤</span>
              <span className="text-white font-semibold">Micrófono</span>
            </div>
            {micStatus === 'ready' ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <Check className="w-4 h-4" />
                Listo
              </div>
            ) : micStatus === 'error' ? (
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                Error
              </div>
            ) : (
              <span className="text-white/60 text-sm">Verificando...</span>
            )}
          </div>
        </div>

        {/* Audio Test Button */}
        <Button
          onClick={handleTestAudio}
          disabled={isTestingAudio || micStatus !== 'ready'}
          className={`w-full h-12 font-semibold ${
            isTestingAudio
              ? 'bg-red-600 text-white'
              : micStatus === 'ready'
              ? 'bg-blue hover:bg-cyan text-white'
              : 'bg-muted/20 text-white/50 cursor-not-allowed'
          }`}
        >
          {isTestingAudio ? 'Probando... Habla ahora' : 'Probar Micrófono'}
        </Button>

        {/* Audio Level Indicator */}
        {isTestingAudio && (
          <div className="bg-slate-900/80 border border-muted/30 rounded-lg p-4 space-y-3">
            <p className="text-sm text-white/70">Nivel de Audio</p>
            <div className="h-12 bg-black rounded flex items-center justify-center overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue to-cyan transition-all"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
            <p className="text-center text-2xl font-bold text-white">{audioLevel}%</p>
          </div>
        )}

        {/* Audio Test Result */}
        {audioTestResult && (
          <div className={`rounded-lg p-4 text-center border ${
            audioTestResult === 'good' 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : audioTestResult === 'fair'
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={`font-semibold ${
              audioTestResult === 'good'
                ? 'text-emerald-400'
                : audioTestResult === 'fair'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {audioTestResult === 'good' && 'Excelente calidad de audio'}
              {audioTestResult === 'fair' && 'Audio adecuado'}
              {audioTestResult === 'poor' && 'Audio bajo - acércate al micrófono'}
            </p>
            <p className="text-sm text-white/70 mt-1">
              Nivel máximo detectado: {maxAudioLevel}%
            </p>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={() => onComplete({ passed, score })}
          className={`w-full h-12 font-semibold ${
            passed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-muted/20 text-white/50 cursor-not-allowed'
          }`}
          disabled={!passed}
        >
          {passed ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Continuar
            </>
          ) : (
            'Verifica tu micrófono para continuar'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
