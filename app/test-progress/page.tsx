'use client'

import { useState } from 'react'
import { Zap, CheckCircle, Target } from 'lucide-react'

export default function ProgressTestPage() {
  const [progress, setProgress] = useState({
    totalXP: 0,
    totalCompleted: 0,
    totalRemaining: 7,
    completionPercentage: 0,
  })

  const simulateCompletion = (xpAmount = 120) => {
    setProgress((prev) => {
      const newXP = Math.min(prev.totalXP + xpAmount, 1000)
      const newCompleted = prev.totalCompleted + 1
      const newRemaining = Math.max(0, 7 - newCompleted)
      const newPercentage = Math.round((newXP / 1000) * 100)

      return {
        totalXP: newXP,
        totalCompleted: newCompleted,
        totalRemaining: newRemaining,
        completionPercentage: newPercentage,
      }
    })
  }

  const resetProgress = () => {
    setProgress({
      totalXP: 0,
      totalCompleted: 0,
      totalRemaining: 7,
      completionPercentage: 0,
    })
  }

  return (
    <main className="bg-black p-8 space-y-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Tu Progreso en Entrenamiento</h1>
          <p className="text-white/60">Monitorea tu desempeño en esta sección, gana puntos y desbloquea badges.</p>
        </div>

        {/* Main Progress Card */}
        <div className="border border-purple-500/50 rounded-2xl bg-black/50 p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-purple-400">Progreso Entrenamiento</h2>
            </div>
            <p className="text-sm text-white/60">Pilar 3: Domina entrevistas profesionales</p>
          </div>

          {/* XP Display */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">{progress.totalXP} XP de 1000</span>
              <span className="text-purple-400 font-bold">{progress.completionPercentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500 ease-out"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-purple-500/30 rounded-lg p-4 bg-black/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-white/60 uppercase">XP GANADOS</p>
              </div>
              <p className="text-2xl font-bold text-purple-400">{progress.totalXP}</p>
            </div>

            <div className="border border-purple-500/30 rounded-lg p-4 bg-black/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-white/60 uppercase">COMPLETADOS</p>
              </div>
              <p className="text-2xl font-bold text-purple-400">{progress.totalCompleted}</p>
            </div>

            <div className="border border-purple-500/30 rounded-lg p-4 bg-black/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-white/60 uppercase">RESTANTES</p>
              </div>
              <p className="text-2xl font-bold text-purple-400">{progress.totalRemaining}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => simulateCompletion(120)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Simular Completación (+120 XP)
            </button>
            <button
              onClick={resetProgress}
              className="px-6 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* State Display */}
        <div className="bg-black/50 border border-white/10 rounded-lg p-6">
          <p className="text-white/60 font-mono text-sm mb-3">Estado actual del progreso:</p>
          <pre className="text-green-400 font-mono text-xs overflow-auto">
            {JSON.stringify(progress, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  )
}

