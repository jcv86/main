"use client"

import { useState, useEffect } from "react"
import type { Achievement } from "@/lib/gamification"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Trophy, Star, Zap, Crown } from "lucide-react"

interface AchievementToastProps {
  achievement: Achievement
  onClose: () => void
}

const rarityColors = {
  common: "bg-gray-100 border-gray-300 text-gray-800",
  rare: "bg-blue-100 border-blue-300 text-blue-800",
  epic: "bg-purple-100 border-purple-300 text-purple-800",
  legendary: "bg-yellow-100 border-yellow-300 text-yellow-800",
}

const rarityIcons = {
  common: Star,
  rare: Zap,
  epic: Trophy,
  legendary: Crown,
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const RarityIcon = rarityIcons[achievement.rarity]

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className={`w-80 ${rarityColors[achievement.rarity]} border-2 shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-sm">¡Logro Desbloqueado!</h3>
                  <RarityIcon className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-lg mb-1">{achievement.title}</h4>
                <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    +{achievement.points} puntos
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
