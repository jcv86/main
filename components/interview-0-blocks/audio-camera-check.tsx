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
      analyser.fftSize = 256 // Smaller FFT for better low-frequency detection
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let isRunning = true
      let max = 0
      let sampleCount = 0

      const checkAudio = () => {
        if (!isRunning) return
        analyser.getByteFrequencyData(dataArray)
        
        // Focus on lower frequencies (speech range: 85-255Hz)
        const lowFreqData = dataArray.slice(0, Math.floor(dataArray.length * 0.3))
        const average = lowFreqData.reduce((a, b) => a + b) / lowFreqData.length
        const level = Math.round((average / 255) * 100)
        
        setAudioLevel(level)
        max = Math.max(max, level)
        setMaxAudioLevel(max)
        sampleCount++
        
        requestAnimationFrame(checkAudio)
      }

      checkAudio()

      // Stop after 3 seconds and evaluate with LOWER thresholds
      setTimeout(() => {
        isRunning = false
        setIsTestingAudio(false)
        
        // Much lower thresholds since Web Audio API is naturally quiet
        // good: 25%+, fair: 12%+, poor: < 12%
        let result: 'good' | 'fair' | 'poor'
        if (max >= 25) {
          result = 'good'
        } else if (max >= 12) {
          result = 'fair'
        } else {
          result = 'poor'
        }
        setAudioTestResult(result)
        console.log('[v0] Audio test - max level:', max, 'result:', result)
        
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

  // Allow passing with any audio detection (good/fair/poor), just with different scores
  const audioQualityScore = audioTestResult === 'good' ? 100 : audioTestResult === 'fair' ? 80 : audioTestResult === 'poor' ? 60 : 0
  const passed = micStatus === 'ready' && audioTestResult !== null // Allow any audio level
  const score = audioQualityScore

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
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <p className={`font-semibold ${
              audioTestResult === 'good'
                ? 'text-emerald-400'
                : audioTestResult === 'fair'
                ? 'text-blue-400'
                : 'text-yellow-400'
            }`}>
              {audioTestResult === 'good' && 'Excelente calidad de audio'}
              {audioTestResult === 'fair' && 'Audio detectado correctamente'}
              {audioTestResult === 'poor' && 'Audio bajo - considera acercarte al micrófono'}
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
            'Prueba tu micrófono para continuar'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
