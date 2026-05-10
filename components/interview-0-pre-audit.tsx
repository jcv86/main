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

export function Interview0PreAudit({ onComplete, onProgressUpdate }: { onComplete?: (result: AuditResult) => void; onProgressUpdate?: (progress: number) => void }) {
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
    if (totalScore >= 60) return { text: 'Ajustes menores', color: 'text-yellow-400', bg: 'bg-yellow/50/10' }
    return { text: 'Revisar antes de simular', color: 'text-red-400', bg: 'bg-red-500/10' }
  }

  const status = getStatus()
  
  // Count completed blocks for granular progress
  const blocks = [
    { key: 'environment' as const, name: 'Auditoría de Entorno', passed: results.environment.passed },
    { key: 'presence' as const, name: 'Validación de Presencia', passed: results.presence.passed },
    { key: 'audioCamera' as const, name: 'Audio & Cámara', passed: results.audioCamera.passed },
    { key: 'preparation' as const, name: 'Preparación Base', passed: results.preparation.passed }
  ]
  
  const completedBlocks = blocks.filter(b => b.passed).length
  const progress = (completedBlocks / 4) * 100

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

    const nextStage = stageMap[stage as keyof typeof stageMap] || 'complete'
    
    // Update progress: each block is 25%
    const blockIndex = blocks.findIndex(b => b.key === blockName)
    const newCompletedBlocks = completedBlocks + 1
    const newProgress = (newCompletedBlocks / 4) * 100
    
    if (onProgressUpdate) {
      onProgressUpdate(newProgress)
    }
    
    setStage(nextStage)
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
            <h1 className="text-4xl font-bold text-white mb-2">Entrevista 0: Tu Base Profesional</h1>
            <p className="text-lg text-white/70">Prepara tu escenario, presencia y pitch inicial</p>
          </div>

          <p className="text-white/80 max-w-md mx-auto">
            Revisaremos tu entorno, presencia, cámara, audio y preparación inicial. Esto identifica qué mejorar antes de practicar entrevistas reales.
          </p>

          <div className="space-y-2 text-sm text-white/70">
            <p> Auditoría de entorno (luz, fondo, ruido)</p>
            <p> Validación de presencia (postura, mirada, energía)</p>
            <p> Prueba de audio y cámara</p>
            <p> Preparación de pitch inicial</p>
          </div>

          <Button
            onClick={() => setStage('environment')}
            className="w-full text-white h-12"
            style={{ backgroundColor: 'rgb(170, 70, 170, 0.6)', borderRadius: '20px' }}
          >
            Comenzar revisión
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (stage === 'complete') {
    // Rewards display - XP/DTC are awarded by the API in TrainingResultsCard
    // No duplicate calculation here
    
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-muted/30">
          <CardContent className="pt-8 pb-8 space-y-6">
            {/* Score display */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-purple-400 uppercase">Listo para practicar</p>
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
                    <Progress value={value.score} className="w-24 h-2" style={{ accentColor: 'rgb(170, 70, 170)' }} />
                    <span className="text-white font-semibold w-12 text-right">{value.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Status message */}
            {totalScore >= 80 ? (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-purple-400 font-semibold">Excelente preparación</p>
                <p className="text-white/70 text-sm mt-1">Estás listo para comenzar entrenamientos</p>
              </div>
            ) : totalScore >= 60 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-yellow-400 font-semibold">Algunos ajustes recomendados</p>
                <p className="text-white/70 text-sm mt-1">Revisa las áreas con puntuación más baja para mejorar</p>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 font-semibold">Revisa tu configuración</p>
                <p className="text-white/70 text-sm mt-1">Completa los checks pendientes para una mejor experiencia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results summary  */}
        <Card className="border-muted/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">¡Auditoría Completada!</h2>
                <p className="text-white/70">Completaste todos los checks. Verás los premios en el siguiente paso.</p>
              </div>

              <div className="space-y-2 text-sm text-white/60 bg-white/5 rounded-lg p-4">
                <p>✓ {completedBlocks} / 4 secciones completadas</p>
                <p>✓ Se desbloquean entrenamientos en Pillar 3</p>
                <p>✓ Acceso a herramientas de preparación</p>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full text-white h-12"
                style={{ backgroundColor: 'rgb(170, 70, 170)', borderRadius: '20px' }}
              >
                Continuar a Resultados
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Progreso</span>
          <span className="text-white/70">{completedBlocks}/{blocks.length} secciones completadas</span>
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
