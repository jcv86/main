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
    <div className="bg-muted/5 dark:bg-transparent rounded-[28px] p-4 mb-6 border border-muted/20 dark:border-muted/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground/70">Pregunta {currentQuestion} de {totalQuestions}</p>
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
      <div className="w-full bg-muted/20 dark:bg-transparent rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <p className="text-xs text-foreground/60 mt-2">{Math.round(progressPercentage)}% completado</p>
    </div>
  )
}
