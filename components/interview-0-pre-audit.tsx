'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, ChevronRight, AlertCircle } from 'lucide-react'
import { EnvironmentCheck } from './interview-0-blocks/environment-check'
import { PresenceCheck } from './interview-0-blocks/presence-check'
import { AudioCameraCheck } from './interview-0-blocks/audio-camera-check'
import { PreparationCheck } from './interview-0-blocks/preparation-check'
import { saveInterview0Status, getInterview0Status } from '@/lib/interview-0/supabase'

interface AuditResult {
  environment: { passed: boolean; score: number }
  presence: { passed: boolean; score: number }
  audioCamera: { passed: boolean; score: number }
  preparation: { passed: boolean; score: number }
}

export function Interview0PreAudit({ onComplete }: { onComplete?: (result: AuditResult) => void }) {
  const [stage, setStage] = useState<'intro' | 'environment' | 'presence' | 'audio-camera' | 'preparation' | 'complete'>('intro')
  const [results, setResults] = useState<AuditResult>({
    environment: { passed: false, score: 0 },
    presence: { passed: false, score: 0 },
    audioCamera: { passed: false, score: 0 },
    preparation: { passed: false, score: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load previous progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const prevStatus = await getInterview0Status()
        if (prevStatus?.interview_0_status === 'completed') {
          setStage('complete')
          setResults({
            environment: prevStatus.environment_check || { passed: false, score: 0 },
            presence: prevStatus.presence_check || { passed: false, score: 0 },
            audioCamera: prevStatus.audio_check || { passed: false, score: 0 },
            preparation: prevStatus.preparation_check || { passed: false, score: 0 }
          })
        }
      } catch (err) {
        console.error('[v0] Failed to load previous progress:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [])

  const totalScore = Math.round(
    (results.environment.score + results.presence.score + results.audioCamera.score + results.preparation.score) / 4
  )

  const getStatus = () => {
    if (totalScore >= 80) return { text: 'Listo para practicar', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    if (totalScore >= 60) return { text: 'Ajustes menores', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
    return { text: 'Revisar antes de simular', color: 'text-red-400', bg: 'bg-red-500/10' }
  }

  const status = getStatus()
  const progressStages = ['environment', 'presence', 'audio-camera', 'preparation']
  const currentStageIndex = progressStages.indexOf(stage as string)
  const progress = currentStageIndex === -1 ? 0 : ((currentStageIndex + 1) / progressStages.length) * 100

  const handleBlockComplete = async (blockName: keyof AuditResult, data: { passed: boolean; score: number }) => {
    const newResults = { ...results, [blockName]: data }
    setResults(newResults)

    try {
      await saveInterview0Status({
        [blockName]: data,
        interview_0_status: 'in_progress'
      })
    } catch (err) {
      console.error(`[v0] Failed to save ${blockName}:`, err)
    }

    // Move to next stage or complete
    const stageMap = {
      environment: 'presence',
      presence: 'audio-camera',
      'audio-camera': 'preparation',
      preparation: 'complete'
    } as const

    setStage(stageMap[stage as keyof typeof stageMap] || 'complete')
  }

  const handleComplete = async () => {
    try {
      await saveInterview0Status({
        interview_0_completed: true,
        interview_0_score: totalScore,
        interview_0_status: 'completed',
        environment_check: results.environment,
        presence_check: results.presence,
        audio_check: results.audioCamera,
        preparation_check: results.preparation
      })
    } catch (err) {
      console.error('[v0] Failed to save completion:', err)
    }

    if (onComplete) onComplete(results)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-2">
          <p className="text-white/70">Cargando auditoría...</p>
        </div>
      </div>
    )
  }

  if (stage === 'intro') {
    return (
      <Card className="border-muted/30 max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Entrevista 0</h1>
            <p className="text-lg text-white/70">Prepara tu escenario antes de hablar</p>
          </div>

          <p className="text-white/80 max-w-md mx-auto">
            Antes de simular una entrevista real, revisaremos tu entorno, presencia, cámara, audio y preparación inicial.
            Esto te ayudará a identificar áreas de mejora.
          </p>

          <div className="space-y-2 text-sm text-white/70">
            <p>✓ Auditoría de entorno (luz, fondo, ruido)</p>
            <p>✓ Validación de presencia (postura, energía)</p>
            <p>✓ Test de audio y cámara</p>
            <p>✓ Preparación inicial</p>
          </div>

          <Button
            onClick={() => setStage('environment')}
            className="w-full bg-blue hover:bg-cyan text-white h-12"
          >
            Comenzar Auditoría
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (stage === 'complete') {
    return (
      <Card className="border-muted/30 max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className={`${status.bg} border border-current rounded-xl p-6 text-center space-y-2`}>
            <p className={`text-sm font-semibold ${status.color} uppercase`}>{status.text}</p>
            <div className="text-5xl font-bold text-white">{totalScore}</div>
            <p className="text-white/70">Puntuación General</p>
          </div>

          {/* Score breakdown */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white/70 uppercase">Detalles por Área</p>
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <Progress value={value.score} className="w-24 h-2" />
                  <span className="text-white font-semibold w-12 text-right">{value.score}</span>
                </div>
              </div>
            ))}
          </div>

          {totalScore >= 80 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
              <p className="text-emerald-400 font-semibold">Excelente preparación</p>
              <p className="text-white/70 text-sm mt-1">Estás listo para comenzar la simulación de entrevista</p>
            </div>
          ) : totalScore >= 60 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-yellow-400 font-semibold">Algunos ajustes recomendados</p>
              <p className="text-white/70 text-sm mt-1">Revisa las áreas con puntuación más baja antes de continuar</p>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-red-400 font-semibold">Revisa tu configuración</p>
              <p className="text-white/70 text-sm mt-1">Completa los checks pendientes para una mejor experiencia</p>
            </div>
          )}

          <Button
            onClick={handleComplete}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
          >
            Continuar a Simulación de Entrevista
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Progreso</span>
          <span className="text-white/70">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Blocks */}
      {stage === 'environment' && (
        <EnvironmentCheck onComplete={(data) => handleBlockComplete('environment', data)} />
      )}
      {stage === 'presence' && (
        <PresenceCheck onComplete={(data) => handleBlockComplete('presence', data)} />
      )}
      {stage === 'audio-camera' && (
        <AudioCameraCheck onComplete={(data) => handleBlockComplete('audioCamera', data)} />
      )}
      {stage === 'preparation' && (
        <PreparationCheck onComplete={(data) => handleBlockComplete('preparation', data)} />
      )}
    </div>
  )
}
