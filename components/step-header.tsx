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
  purple: "bg-gradient-to-br from-purple to-purple/80 text-white border-2 border-purple/40",
  blue: "bg-gradient-to-br from-blue to-blue/80 text-white border-2 border-blue/40",
  orange: "bg-gradient-to-br from-orange to-orange/80 text-white border-2 border-orange/40",
  cyan: "bg-gradient-to-br from-cyan to-cyan/80 text-white border-2 border-cyan/40",
}

const pillarBgLight = {
  purple: "bg-gradient-to-br from-purple/20 to-purple/10 border-2 border-purple/40",
  blue: "bg-gradient-to-br from-blue/20 to-blue/10 border-2 border-blue/40",
  orange: "bg-gradient-to-br from-orange/20 to-orange/10 border-2 border-orange/40",
  cyan: "bg-gradient-to-br from-cyan/20 to-cyan/10 border-2 border-cyan/40",
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
    <div className={`rounded-2xl p-10 mb-12 ${pillarBgLight[pillarColor]} shadow-lg`}>
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-start gap-6">
          <div className={`w-14 h-14 rounded-full ${pillarColors[pillarColor]} flex items-center justify-center flex-shrink-0 text-xl font-black shadow-lg`}>
            {stepNumber}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white/75 uppercase tracking-widest mb-2">{pillarName}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">{title}</h1>
          </div>
        </div>
        {estimatedTime && (
          <div className="text-right flex-shrink-0 bg-white/10 border border-white/20 rounded-xl p-4">
            <p className="text-xs text-white/75 font-semibold uppercase tracking-wide mb-1">Tiempo estimado</p>
            <p className="text-2xl font-black text-white">{estimatedTime}</p>
          </div>
        )}
      </div>
      <p className="text-lg text-white/90 ml-20 leading-relaxed">{description}</p>
    </div>
  )
}
