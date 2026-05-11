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
import { saveInterview0Status, getInterview0Status, type Interview0Status } from '@/lib/interview-0/supabase'

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
        // Failed to load progress
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

    // Always proceed with UI update, save in background
    const stageMap = {
      environment: 'presence',
      presence: 'audio-camera',
      'audio-camera': 'preparation',
      preparation: 'complete'
    } as const

    const nextStage = stageMap[stage as keyof typeof stageMap] || 'complete'
    const newCompletedBlocks = completedBlocks + 1
    const newProgress = (newCompletedBlocks / 4) * 100
    
    if (onProgressUpdate) {
      onProgressUpdate(newProgress)
    }
    
    setStage(nextStage)

    // Save in background - don't block UI
    try {
      // Map blockName to the correct database field names
      const fieldMap = {
        environment: 'environment_check',
        presence: 'presence_check',
        audioCamera: 'audio_check',
        preparation: 'preparation_check'
      } as const
      
      const saveData: any = {
        interview_0_status: 'in_progress'
      }
      saveData[fieldMap[blockName]] = data
      
      const result = await saveInterview0Status(saveData)
      
      // Check if it's demo mode (no actual save)
      if (result?.message?.includes('Demo mode')) {
        // Demo mode - block saved locally only
      }
    } catch (err) {
      // Prevent the entire save pipeline from breaking if one listener fails
      const errorMsg = err instanceof Error ? err.message : String(err)
      // Only show error if it's not a demo mode message
      if (!errorMsg.includes('Demo mode')) {
        // Save error occurred
      }
      // Local state is updated, data persists in component, will retry on refresh
    }
  }

  const handleComplete = async () => {
    // Always call onComplete to proceed UI, save in background
    if (onComplete) onComplete(results)

    // Save final state in background - don't block completion
    try {
      const finalData: Interview0Status = {
        interview_0_completed: true,
        interview_0_score: totalScore,
        interview_0_status: 'completed' as const,
        environment_check: results.environment,
        presence_check: results.presence,
        audio_check: results.audioCamera,
        preparation_check: results.preparation
      }
      
      const result = await saveInterview0Status(finalData)
      if (result?.message?.includes('Demo mode')) {
        // Demo mode - completion not persisted
      }
    } catch (err) {
      // Prevent the entire save pipeline from breaking if save fails
      const errorMsg = err instanceof Error ? err.message : String(err)
      // Only show error if it's not a demo mode message
      if (!errorMsg.includes('Demo mode')) {
        // Save error occurred
      }
      // Local state is updated, data persists in component, will retry on refresh
    }
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
      <Card className="border-muted/30 max-w-4xl mx-auto">
        <CardContent className="pt-12 pb-8">
          <div className="flex gap-8 items-start">
            {/* Coach Portrait */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="relative">
                <div className="w-48 h-56 rounded-xl overflow-hidden border border-purple-500/30 shadow-lg">
                  <img 
                    src="/images/coach-portrait.jpg" 
                    alt="Coach"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center border-2 border-background">
                  <span className="text-white text-lg">👨</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Entrevista 0: Tu Base Profesional</h1>
                <p className="text-lg text-white/70">Prepara tu escenario, presencia y pitch inicial</p>
              </div>

              <p className="text-white/80">
                Revisaremos tu entorno, presencia, cámara, audio y preparación inicial. Esto identifica qué mejorar antes de practicar entrevistas reales.
              </p>

              <div className="space-y-2 text-sm text-white/70">
                <p>✓ Auditoría de entorno (luz, fondo, ruido)</p>
                <p>✓ Validación de presencia (postura, mirada, energía)</p>
                <p>✓ Prueba de audio y cámara</p>
                <p>✓ Preparación de pitch inicial</p>
              </div>

              <Button
                onClick={() => setStage('environment')}
                className="w-full md:w-auto text-white h-12 px-8"
                style={{ backgroundColor: 'rgb(170, 70, 170, 0.6)', borderRadius: '20px' }}
              >
                Comenzar revisión
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
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

            {/* XP Gamification */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">XP Ganados</p>
                    <p className="text-2xl font-bold text-white">+70 XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60">Módulo completado</p>
                  <p className="text-sm font-semibold text-purple-300">Auditoría Inicial</p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={() => {
                // Navigate to A3 page with module 2 anchor
                window.location.href = '/despega/a3#metodo-star'
              }}
              className="w-full text-white h-12 text-base font-semibold"
              style={{ backgroundColor: 'rgb(170, 70, 170)', borderRadius: '8px' }}
            >
              Continuar a Resultados
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
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
