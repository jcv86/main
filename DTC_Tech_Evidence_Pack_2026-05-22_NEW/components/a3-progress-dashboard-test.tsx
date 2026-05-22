'use client'

import { useState, useEffect } from 'react'
import { Zap, CheckCircle, Target } from 'lucide-react'

// Test component to verify the new progress dashboard works with mock data
export function A3ProgressDashboardTest() {
  const [progress, setProgress] = useState({
    totalXP: 0,
    totalCompleted: 0,
    totalRemaining: 7,
    completionPercentage: 0,
  })

  // Simulate XP being earned
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

  return (
    <div className="bg-black p-8 space-y-6">
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

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-purple-500/30 rounded-lg p-4 space-y-2 bg-purple-500/5">
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">XP Ganados</span>
            </div>
            <p className="text-2xl font-bold text-white">{progress.totalXP}</p>
          </div>

          <div className="border border-cyan-500/30 rounded-lg p-4 space-y-2 bg-cyan-500/5">
            <div className="flex items-center gap-2 text-cyan-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Completados</span>
            </div>
            <p className="text-2xl font-bold text-white">{progress.totalCompleted}</p>
          </div>

          <div className="border border-orange-500/30 rounded-lg p-4 space-y-2 bg-orange-500/5">
            <div className="flex items-center gap-2 text-orange-400">
              <Target className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Restantes</span>
            </div>
            <p className="text-2xl font-bold text-white">{progress.totalRemaining}</p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="pt-4 space-y-2">
          <button
            onClick={() => simulateCompletion(120)}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Simular Completación (+120 XP)
          </button>
          <button
            onClick={() => setProgress({ totalXP: 0, totalCompleted: 0, totalRemaining: 7, completionPercentage: 0 })}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="rounded-lg p-4 space-y-2 text-xs text-white/60" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)', border: '1px solid rgba(90, 90, 150, 0.6)' }}>
        <p>Estado actual del progreso:</p>
        <pre className="text-cyan-400 text-xs overflow-auto">
          {JSON.stringify(progress, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default A3ProgressDashboardTest
