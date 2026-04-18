"use client"

import React from "react"

interface StepHeaderProps {
  stepNumber: number
  pillarName: string
  title: string
  description: string
  estimatedTime?: string
  pillarColor?: "purple" | "blue" | "orange" | "cyan"
}

const pillarColors = {
  purple: "bg-purple-600 text-purple-600 border-purple-200 dark:border-purple-900/30",
  blue: "bg-blue-600 text-blue-600 border-blue-200 dark:border-blue-900/30",
  orange: "bg-orange-600 text-orange-600 border-orange-200 dark:border-orange-900/30",
  cyan: "bg-cyan-600 text-cyan-600 border-cyan-200 dark:border-cyan-900/30",
}

const pillarBgLight = {
  purple: "bg-purple-50 dark:bg-purple-950/30",
  blue: "bg-blue-50 dark:bg-blue-950/30",
  orange: "bg-orange-50 dark:bg-orange-950/30",
  cyan: "bg-cyan-50 dark:bg-cyan-950/30",
}

export function StepHeader({
  stepNumber,
  pillarName,
  title,
  description,
  estimatedTime,
  pillarColor = "blue",
}: StepHeaderProps) {
  return (
    <div className={`rounded-[28px] p-6 mb-8 border ${pillarBgLight[pillarColor]}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${pillarColors[pillarColor]} flex items-center justify-center text-white font-bold text-sm`}>
            {stepNumber}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">{pillarName}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          </div>
        </div>
        {estimatedTime && (
          <div className="text-right">
            <p className="text-xs text-foreground/70">Tiempo estimado</p>
            <p className="text-lg font-semibold text-foreground">{estimatedTime}</p>
          </div>
        )}
      </div>
      <p className="text-foreground/80 ml-13 max-w-2xl">{description}</p>
    </div>
  )
}
