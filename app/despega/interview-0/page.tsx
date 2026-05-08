'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ChevronRight, Video, Lightbulb } from 'lucide-react'
import { Interview0PreAudit } from '@/components/interview-0-pre-audit'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'
import { TrainingResultsCard } from '@/components/training-results-card'

export default function Interview0Page() {
  const router = useRouter()
  const [stage, setStage] = useState<'intro' | 'audit' | 'simulator' | 'farewell' | 'results'>('intro')
  const [score, setScore] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  const handleAuditComplete = (result: any) => {
    console.log('[v0] Audit completed:', result)
    setStage('simulator')
  }

  const handleSimulatorComplete = (result: any) => {
    console.log('[v0] Interview 0 fully completed:', result)
    setScore(result.score || 85)
    setStage('farewell')
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  if (stage === 'farewell') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <Card className="border-training/40 overflow-hidden">
            <div className="relative aspect-[3/4] w-full bg-black">
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sofia02ciao-JJXsroDrldJQrOQgg1lHrJzODwH1Uf.mov"
                autoPlay
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
                onEnded={() => setStage('results')}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </Card>

          <Card className="border-training/30 bg-training/5">
            <CardContent className="pt-6">
              <p className="text-white/85 text-center">
                Tu coach está completando la sesión...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (stage === 'results') {
    return (
      <TrainingResultsCard
        result={{
          score: score,
          questionsCompleted: 5,
          totalQuestions: 5,
          timeSpent: 600,
          level: 'basico',
          trainingType: 'Preparación Inicial'
        }}
        onContinue={() => {
          setStage('intro')
          setScore(0)
          router.push('/despega/a3')
        }}
      />
    )
  }

  // Calculate general progress based on stage
  const getGeneralProgress = () => {
    switch (stage) {
      case 'intro': return { step: 1, total: 4, percent: 0, label: 'Introducción' }
      case 'audit': return { step: 2, total: 4, percent: 33, label: 'Auditoría' }
      case 'simulator': return { step: 3, total: 4, percent: 66, label: 'Simulación' }
      default: return { step: 1, total: 4, percent: 0, label: 'Introducción' }
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
              <Interview0PreAudit onComplete={handleAuditComplete} />
            )}

            {stage === 'simulator' && (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                    <Video className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">Guía del Coach</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Primera Simulación de Entrevista</h2>
                  <p className="text-white/85 mt-2">Tu coach te guiará basándose en tu auditoría inicial</p>
                </div>
                <ConversationalInterviewSimulator
                  level="basico"
                  onComplete={handleSimulatorComplete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
