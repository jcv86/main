'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface A3SessionWrapperProps {
  children: ReactNode
  moduleId: string
  moduleName: string
  sessionType: 'coach_training' | 'interviewer_simulation'
  character: 'coach' | 'sofia' | 'elena' | 'bruno'
  difficulty: 'adaptive' | 'basic' | 'advanced' | 'pro'
  characterImage?: string
  progress?: number
  questionTitle?: string
  showCamera?: boolean
  cameraFeedUrl?: string
}

export function A3SessionWrapper({
  children,
  moduleId,
  moduleName,
  sessionType,
  character,
  difficulty,
  characterImage,
  progress = 0,
  questionTitle,
  showCamera = true,
  cameraFeedUrl
}: A3SessionWrapperProps) {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)

  const getCharacterName = () => {
    const names: Record<string, string> = {
      coach: 'Coach IA',
      sofia: 'Sofia',
      elena: 'Elena',
      bruno: 'Bruno'
    }
    return names[character] || character
  }

  const getSessionTypeLabel = () => {
    return sessionType === 'coach_training'
      ? 'Entrevista de Entrenamiento'
      : 'Simulación con Entrevistador'
  }

  const getDifficultyLabel = () => {
    const labels: Record<string, string> = {
      adaptive: 'Adaptativo',
      basic: 'Básico',
      advanced: 'Avanzado',
      pro: 'Pro'
    }
    return labels[difficulty] || difficulty
  }

  const handleExit = async () => {
    setIsExiting(true)
    router.push('/despega/a3')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-purple-500/20 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExit}
                disabled={isExiting}
                className="p-2 hover:bg-purple-500/10 rounded-lg transition disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{moduleName}</h1>
                <p className="text-sm text-white/60">Sesión con {getCharacterName()}</p>
              </div>
            </div>

            {/* Session info */}
            <div className="hidden sm:flex items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="text-white/60">Progreso:</span>
                <span className="font-semibold text-white">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="mt-4 h-1 w-full bg-purple-500/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Character info and camera (on desktop) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Character card */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black p-6">
              <div className="text-center space-y-4">
                {/* Character image or placeholder */}
                <div className="w-full aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg overflow-hidden border border-purple-500/20 flex items-center justify-center">
                  {characterImage ? (
                    <img src={characterImage} alt={getCharacterName()} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl">👤</div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{getCharacterName()}</h3>
                  <p className="text-sm text-white/60 mt-1">{getSessionTypeLabel()}</p>
                </div>

                {/* Session metadata */}
                <div className="space-y-2 pt-4 border-t border-purple-500/20">
                  <div className="text-sm">
                    <span className="text-white/60">Tipo: </span>
                    <span className="text-white font-medium text-sm">{getSessionTypeLabel()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/60">Nivel: </span>
                    <span className="text-white font-medium text-sm">{getDifficultyLabel()}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Camera preview (mobile) */}
            {showCamera && (
              <div className="lg:hidden">
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black p-4 overflow-hidden">
                  <div className="aspect-video bg-black rounded-lg border border-purple-500/30 flex items-center justify-center">
                    <span className="text-white/40">📹 Cámara</span>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Center/Right: Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question/Content panel with salmon background */}
            {questionTitle && (
              <Card
                className="border-purple-500/30 p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(225, 120, 130, 0.4) 0%, rgba(225, 120, 130, 0.2) 100%)',
                  borderColor: 'rgba(225, 120, 130, 0.3)'
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    <span className="text-sm font-semibold text-white/80">PREGUNTA:</span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">{questionTitle}</h2>
                </div>
              </Card>
            )}

            {/* Session content */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-black p-6 lg:p-8">
              {children}
            </Card>
          </div>
        </div>

        {/* Camera preview (desktop) */}
        {showCamera && (
          <div className="hidden lg:block mt-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="lg:col-span-1"></div>
              <div className="lg:col-span-2">
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black p-4 overflow-hidden">
                  <div className="aspect-video bg-black rounded-lg border border-purple-500/30 flex items-center justify-center">
                    <span className="text-white/40 text-lg">📹 Vista de Cámara</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Exit confirmation modal (if needed) */}
      {isExiting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Salir de la Sesión</h3>
            <p className="text-white/70 text-sm mb-6">Tu progreso será guardado. Puedes volver en cualquier momento.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsExiting(false)}
                variant="outline"
                className="flex-1 border-purple-500/40 text-white"
              >
                Continuar Sesión
              </Button>
              <Button
                onClick={handleExit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                Salir
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
