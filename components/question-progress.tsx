"use client"

import React from "react"

interface QuestionProgressProps {
  currentQuestion: number
  totalQuestions: number
  questionCode: string
  estimatedTimePerQuestion?: number
  showTimeRemaining?: boolean
}

export function QuestionProgress({
  currentQuestion,
  totalQuestions,
  questionCode,
  estimatedTimePerQuestion = 30,
  showTimeRemaining = true,
}: QuestionProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100
  const estimatedTimeRemaining = (totalQuestions - currentQuestion + 1) * estimatedTimePerQuestion

  return (
    <div className="bg-muted/5 dark:bg-transparent rounded-[28px] p-4 mb-6 border" style={{ borderRadius: '2px', borderStyle: 'none', backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'rgba(80, 160, 170)', fontWeight: '900' }}>Pregunta {currentQuestion} de {totalQuestions}</p>
            <p className="text-xs text-foreground/60 mt-0.5">Código: <span className="font-mono font-semibold text-foreground/80">{questionCode}</span></p>
          </div>
        </div>
        {showTimeRemaining && (
          <div className="text-right">
            <p className="text-xs text-foreground/70">Tiempo restante aproximado</p>
            <p className="text-sm font-semibold text-foreground">{estimatedTimeRemaining}s</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'rgba(70, 90, 110)' }}>
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%`, backgroundColor: 'rgb(0, 190, 200)' }}
        />
      </div>

      <p className="text-xs text-foreground/60 mt-2">{Math.round(progressPercentage)}% completado</p>
    </div>
  )
}
