"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { calculateLevel, getLevelInfo, getNextLevelInfo, calculateProgressToNextLevel } from "@/lib/gamification"

interface ProgressBarProps {
  points: number
  className?: string
}

export function ProgressBar({ points, className }: ProgressBarProps) {
  const currentLevel = calculateLevel(points)
  const currentLevelInfo = getLevelInfo(currentLevel)
  const nextLevelInfo = getNextLevelInfo(currentLevel)
  const progress = calculateProgressToNextLevel(points)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="font-bold">
            Nivel {currentLevel}
          </Badge>
          <span className="text-sm font-medium">{currentLevelInfo.title}</span>
        </div>
        <div className="text-sm text-muted-foreground">{points.toLocaleString()} puntos</div>
      </div>

      {nextLevelInfo && (
        <>
          <Progress value={progress.percentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.current.toLocaleString()}</span>
            <span>Siguiente: {nextLevelInfo.title}</span>
            <span>{progress.needed.toLocaleString()}</span>
          </div>
        </>
      )}

      {!nextLevelInfo && <div className="text-center text-sm text-muted-foreground">¡Nivel máximo alcanzado! 🎉</div>}
    </div>
  )
}
