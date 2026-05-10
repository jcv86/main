'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ChevronRight, Video, Lightbulb } from 'lucide-react'
import { Interview0PreAudit } from '@/components/interview-0-pre-audit'
import { TrainingResultsCard } from '@/components/training-results-card'

export default function Interview0Page() {
  const router = useRouter()
  const [stage, setStage] = useState<'intro' | 'audit' | 'farewell' | 'results'>('intro')
  const [score, setScore] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  const [auditProgress, setAuditProgress] = useState(0) // Track granular audit progress (0-100 in 25% increments)

  const handleAuditComplete = (result: any) => {
    // Store audit score and go to results/rewards screen
    setScore(result.score || 75)
    setAuditProgress(100) // Mark audit as 100% complete
    setStage('results')
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  if (stage === 'results') {
    // XP/DTC are awarded by the canonical config inside the training-completion API
    // (40 XP / 4 DTC for 'auditoria-inicial' on first completion)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <TrainingResultsCard
            result={{
              score: score,
              questionsCompleted: 1,
              totalQuestions: 1,
              timeSpent: 300,
              level: 'basico',
              trainingType: 'auditoria-inicial',
              moduleXpEarned: 40,
              moduleXpTotal: 40,
            }}
            onContinue={() => {
              setStage('intro')
              setScore(0)
              setAuditProgress(0)
              // Navigate to A3 dashboard where Pillar 3 is now unlocked
              router.push('/despega/a3')
            }}
          />
        </div>
      </div>
    )
  }

  // Calculate general progress based on stage
  // intro=0%, audit progresses from 0-100 based on blocks completed
  const getGeneralProgress = () => {
    switch (stage) {
      case 'intro': return { step: 1, total: 2, percent: 0, label: 'Introducción' }
      case 'audit': return { step: 2, total: 2, percent: auditProgress, label: 'Auditoría' }
      default: return { step: 1, total: 2, percent: 0, label: 'Introducción' }
    }
  }

  const progress = getGeneralProgress()

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-muted/80 bg-background py-3 px-4">
          <button
            onClick={() => router.push('/despega/a3')}
            className="inline-flex items-center gap-2 text-purple-400/60 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Entrenamientos
          </button>
        </div>

        {/* General Progress Bar */}
        <div className="flex-shrink-0 bg-background/50 backdrop-blur-sm border-b border-muted/30 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-white/60">Progreso General</span>
                <span className="text-xs text-white/40">|</span>
                <span className="text-xs text-purple-400 font-medium">{progress.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Paso {progress.step} de {progress.total}</span>
                <span className="text-sm font-semibold text-white">{progress.percent}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress.percent}%`,
                  background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {stage === 'intro' && (
              <Card className="border-muted/30 max-w-2xl mx-auto">
                <CardContent className="pt-12 pb-8 text-center space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                      <Video className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-400">Guía del Coach</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white">Preparación Inicial con el Coach</h1>
                    <p className="text-lg text-white/70">Auditoría completa: ambiente, presencia, audio y primer feedback</p>
                  </div>

                  <p className="text-white/80 max-w-md mx-auto">
                    Tu coach te guiará a través de una auditoría completa de tu ambiente, presencia, cámara y audio. Esto establece tu base profesional antes de entrenar con simulaciones intensivas.
                  </p>

                  <div className="space-y-3 text-sm text-white/70 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p><span className="font-semibold text-white">Auditoría de Entorno</span> - Luz, fondo, ruido y profesionalismo</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p><span className="font-semibold text-white">Validación de Presencia</span> - Postura, contacto visual y energía</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p><span className="font-semibold text-white">Prueba de Audio/Cámara</span> - Sonido claro y video de calidad</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p><span className="font-semibold text-white">Pitch Inicial</span> - Presentación profesional en 60 segundos</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStage('audit')}
                    className="w-full text-white h-12"
                    style={{ backgroundColor: 'rgb(170, 70, 170)', borderRadius: '20px' }}
                  >
                    Comenzar Guía del Coach
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {stage === 'audit' && (
              <Interview0PreAudit 
                onComplete={handleAuditComplete}
                onProgressUpdate={(progress) => setAuditProgress(progress)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
