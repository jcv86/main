"use client"
import { Trophy, Star, Award, Target, Zap, Crown } from "lucide-react"

interface AchievementBadgeProps {
  name: string
  description?: string
  icon?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function AchievementBadge({
  name,
  description,
  icon = "trophy",
  size = "md",
  showLabel = true,
}: AchievementBadgeProps) {
  const getIcon = () => {
    const iconMap: { [key: string]: any } = {
      trophy: Trophy,
      star: Star,
      award: Award,
      target: Target,
      zap: Zap,
      crown: Crown,
    }
    const IconComponent = iconMap[icon] || Trophy
    const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" }
    return <IconComponent className={`${sizeMap[size]} text-yellow`} />
  }

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} bg-yellow/10 rounded-full flex items-center justify-center border-2 border-yellow/30`}
      >
        {getIcon()}
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-medium text-foreground">{name}</p>
          {description && <p className="text-xs text-mutedForeground">{description}</p>}
        </div>
      )}
    </div>
  )
}
