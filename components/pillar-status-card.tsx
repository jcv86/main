"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LucideIcon, CheckCircle2, Clock, Lock } from "lucide-react"

interface PillarStatusCardProps {
  number: number
  name: string
  description: string
  status: "completed" | "current" | "locked"
  icon: LucideIcon
  href?: string
  estimatedTime?: string
  results?: {
    score: number
    dimension: string
  }
}

const statusColors = {
  completed: {
    bg: "bg-background",
    border: "border-green/20 dark:border-green/30",
    badge: "bg-green text-white",
    badgeIcon: CheckCircle2,
  },
  current: {
    bg: "bg-background",
    border: "border-blue/20 dark:border-blue/30",
    badge: "bg-blue text-white",
    badgeIcon: Clock,
  },
  locked: {
    bg: "bg-background",
    border: "border-muted/20 dark:border-muted/80",
    badge: "bg-muted/40 text-white",
    badgeIcon: Lock,
  },
}

const statusLabels = {
  completed: "Completado",
  current: "En progreso",
  locked: "Bloqueado",
}

export function PillarStatusCard({
  number,
  name,
  description,
  status,
  icon: Icon,
  href,
  estimatedTime,
  results,
}: PillarStatusCardProps) {
  const config = statusColors[status]
  const BadgeIcon = config.badgeIcon

  const content = (
    <div className={`rounded-[28px] p-6 border-2 transition-all ${config.bg} ${config.border} ${status !== "locked" ? "hover:shadow-lg" : "opacity-75"}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg ${config.badge} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Pilar {number}</p>
            <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
            <p className="text-sm text-foreground/70">{description}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-[20px] text-xs font-semibold flex items-center gap-1 ${config.badge}`}>
          <BadgeIcon className="w-4 h-4" />
          {statusLabels[status]}
        </div>
      </div>

      {estimatedTime && (
        <p className="text-xs text-foreground/60 ml-16">
          Tiempo estimado: <span className="font-semibold text-foreground/80">{estimatedTime}</span>
        </p>
      )}

      {results && (
        <div className="mt-4 ml-16 p-3 bg-white/50 dark:bg-transparent/50 rounded-[28px] border border-muted/20 dark:border-muted/80">
          <p className="text-sm font-semibold text-foreground mb-1">Resultado:</p>
          <p className="text-lg font-bold text-blue">{results.dimension}</p>
          <p className="text-xs text-foreground/70">Puntuación: {results.score}%</p>
        </div>
      )}
    </div>
  )

  if (href && status !== "locked") {
    return <Link href={href}>{content}</Link>
  }

  return content
}
