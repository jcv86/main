'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Trophy, TrendingUp, Lock } from 'lucide-react'
import Link from 'next/link'

interface ChallengeInvitationProps {
  title?: string
  description?: string
  challengeHref?: string
  xpReward?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  unlocked?: boolean
}

export function ChallengeInvitation({
  title = 'Próximo Desafío',
  description = 'Continúa mejorando tus habilidades de entrevista',
  challengeHref = '/despega/a3/gamification',
  xpReward = 100,
  difficulty = 'intermediate',
  unlocked = true
}: ChallengeInvitationProps) {
  const difficultyColors = {
    beginner: 'bg-green/20 text-green border-green/30',
    intermediate: 'bg-yellow/20 text-yellow border-yellow/30',
    advanced: 'bg-orange/20 text-orange border-orange/30',
    expert: 'bg-training/20 text-training border-training/30'
  }

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    expert: 'Experto'
  }

  return (
    <Card className="border-2 border-training/30 bg-gradient-to-r from-training/5 to-transparent overflow-hidden">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-training" />
              <h3 className="text-lg font-bold text-training">{title}</h3>
            </div>
            <p className="text-white/85 mb-4">{description}</p>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={`${difficultyColors[difficulty]} border`}>
                {difficultyLabels[difficulty]}
              </Badge>
              <Badge className="bg-training/20 text-training border border-training/30 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                +{xpReward} XP
              </Badge>
            </div>
          </div>

          {unlocked ? (
            <Link href={challengeHref} className="ml-4">
              <Button className="bg-training hover:bg-training/90 text-white whitespace-nowrap">
                Comenzar
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div className="ml-4">
              <Button disabled className="bg-muted/40 text-muted-foreground/50 cursor-not-allowed">
                <Lock className="w-4 h-4 mr-2" />
                Bloqueado
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
