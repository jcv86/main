'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Mic, Lightbulb, AlertCircle, Loader } from 'lucide-react'
import { validateAudioQuality } from '@/lib/interview-0/ai-validation'
import { coachPrompts } from '@/lib/interview-0/ai-coach-prompts'

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
  const [coachTip, setCoachTip] = useState<string | null>(null)
  const [isValidatingAudio, setIsValidatingAudio] = useState(false)
  const [audioValidationResult, setAudioValidationResult] = useState<{
    isValid: boolean
    score: number
    issues: string[]
    tips: string[]
  } | null>(null)

  const handleTestAudio = async () => {
    setIsTestingAudio(true)
    setMaxAudioLevel(0)
    setAudioTestResult(null)
    let stream: MediaStream | null = null
    let audioContext: AudioContext | null = null

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        },
        video: false
      })

      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      // Connect to destination to ensure audio processing
      analyser.connect(audioContext.destination)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let isRunning = true
      let max = 0
      let sampleCount = 0

      const checkAudio = () => {
        if (!isRunning) return
        analyser.getByteFrequencyData(dataArray)
        
        // Check all frequency ranges, not just low frequencies
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        const level = Math.round((average / 255) * 100)
        
        setAudioLevel(level)
        max = Math.max(max, level)
        setMaxAudioLevel(max)
        sampleCount++
        
        console.log('[v0] Audio level:', level, 'Max:', max)
        
        requestAnimationFrame(checkAudio)
      }

      checkAudio()

      // Stop after 3 seconds and evaluate
      setTimeout(() => {
        isRunning = false
        setIsTestingAudio(false)
        
        // Adjusted thresholds for better detection
        // good: 20%+, fair: 8%+, poor: < 8%
        let result: 'good' | 'fair' | 'poor'
        if (max >= 20) {
          result = 'good'
        } else if (max >= 8) {
          result = 'fair'
        } else {
          result = 'poor'
        }
        setAudioTestResult(result)
        console.log('[v0] Audio test - max level:', max, 'result:', result)
        
        // Show Coach tip based on result
        if (result === 'poor') {
          setCoachTip(coachPrompts.tips.audio[0]) // "Prueba el audio en un ambiente tranquilo..."
        } else if (result === 'fair') {
          setCoachTip(coachPrompts.tips.audio[Math.floor(Math.random() * coachPrompts.tips.audio.length)])
        }
        
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

  const handleValidateAndContinue = async () => {
    setIsValidatingAudio(true)
    try {
      const result = await validateAudioQuality(maxAudioLevel)
      setAudioValidationResult(result)
      
      if (result.isValid) {
        onComplete({
          passed: true,
          score: result.score
        })
      }
    } catch (error) {
      console.error('[v0] Audio validation error:', error)
      // Allow user to continue but show warning
      setAudioValidationResult({
        isValid: false,
        score: audioQualityScore,
        issues: ['Error en validación con IA'],
        tips: ['Continúa pero verifica tu audio manualmente']
      })
    } finally {
      setIsValidatingAudio(false)
    }
  }

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
          className={`w-full h-12 font-semibold`}
          style={{
            backgroundColor: isTestingAudio 
              ? 'rgb(239, 68, 68)' 
              : micStatus === 'ready'
              ? 'rgba(170, 70, 170, 0.6)'
              : 'rgba(107, 114, 128, 0.2)',
            color: micStatus === 'ready' ? 'white' : 'rgba(255, 255, 255, 0.5)',
            cursor: micStatus === 'ready' ? 'pointer' : 'not-allowed',
            borderRadius: '20px'
          }}
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
              ? 'bg-blue-500/10 border-blue/50/30'
              : 'bg-yellow/50/10 border-yellow-500/30'
          }`}>
            <p className="font-semibold" style={{
              color: audioTestResult === 'good'
                ? 'rgb(52, 211, 153)'
                : audioTestResult === 'fair'
                ? 'rgba(239, 239, 239, 0.40)'
                : 'rgb(250, 204, 21)'
            }}>
              {audioTestResult === 'good' && 'Excelente calidad de audio'}
              {audioTestResult === 'fair' && 'Audio detectado correctamente'}
              {audioTestResult === 'poor' && 'Audio bajo - considera acercarte al micrófono'}
            </p>
            <p className="text-sm text-white/70 mt-1">
              Nivel máximo detectado: {maxAudioLevel}%
            </p>
          </div>
        )}

        {/* Coach IA Tip */}
        {coachTip && (
          <div className="flex gap-2 items-start p-3 rounded border" style={{ backgroundColor: 'rgba(170, 70, 170, 0.1)', borderColor: 'rgba(170, 70, 170, 0.4)' }}>
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(170, 70, 170, 0.6)' }} />
            <p className="text-xs" style={{ color: 'rgba(170, 70, 170)' }}>{coachTip}</p>
          </div>
        )}

        {/* Audio IA Validation Result */}
        {audioValidationResult && (
          <div className={`rounded-lg p-4 border ${
            audioValidationResult.isValid
              ? 'bg-green/10 border-green/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {audioValidationResult.isValid ? (
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${audioValidationResult.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {audioValidationResult.isValid ? 'Audio Aceptable' : 'Audio Rechazado'}
                </p>
                {audioValidationResult.issues.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {audioValidationResult.issues.map((issue, idx) => (
                      <p key={idx} className="text-xs text-white/70">• {issue}</p>
                    ))}
                  </div>
                )}
                {audioValidationResult.tips.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {audioValidationResult.tips.map((tip, idx) => (
                      <p key={idx} className="text-xs text-white/70"> {tip}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleValidateAndContinue}
          disabled={!passed || isValidatingAudio}
          className={`w-full h-12 font-semibold`}
          style={{
            backgroundColor: passed && !isValidatingAudio 
              ? 'rgb(170, 70, 170, 0.8)'
              : 'rgba(107, 114, 128, 0.2)',
            color: passed && !isValidatingAudio ? 'white' : 'rgba(255, 255, 255, 0.5)',
            cursor: passed && !isValidatingAudio ? 'pointer' : 'not-allowed',
            borderRadius: '20px'
          }}
        >
          {isValidatingAudio ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Validando Audio...
            </>
          ) : passed ? (
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
