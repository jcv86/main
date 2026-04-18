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
  purple: "bg-purple text-purple border-purple/20 dark:border-purple/30",
  blue: "bg-blue text-blue border-blue/20 dark:border-blue/30",
  orange: "bg-orange text-orange border-orange/20 dark:border-orange/30",
  cyan: "bg-cyan text-cyan border-cyan/20 dark:border-cyan/30",
}

const pillarBgLight = {
  purple: "bg-purple/5 dark:bg-purple/30",
  blue: "bg-blue/5 dark:bg-blue/30",
  orange: "bg-orange/5 dark:bg-orange/30",
  cyan: "bg-cyan/5 dark:bg-cyan-950/30",
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
