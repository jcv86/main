"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, TrendingUp, Users, Award, Target, CheckCircle2, Play } from "lucide-react"

interface LearningPathCardProps {
  path: {
    id: number
    title: string
    description: string
    category: string
    difficulty_level: string
    estimated_hours: number
    skills_covered: string[]
    completion_rate?: number
    popularity_score: number
  }
  userProgress?: {
    completion_percentage: number
    streak_days: number
    status: string
  }
  onStart?: () => void
  onContinue?: () => void
}

export function LearningPathCard({ path, userProgress, onStart, onContinue }: LearningPathCardProps) {
  const isStarted = userProgress && userProgress.completion_percentage > 0
  const isCompleted = userProgress?.status === "completed"

  const difficultyColors = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-purple-100 text-purple-700",
    expert: "bg-red-100 text-red-700",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={difficultyColors[path.difficulty_level as keyof typeof difficultyColors]}>
            {path.difficulty_level.charAt(0).toUpperCase() + path.difficulty_level.slice(1)}
          </Badge>
          {isCompleted && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completado
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl">{path.title}</CardTitle>
        <CardDescription className="line-clamp-2">{path.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        {isStarted && !isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-semibold">{Math.round(userProgress.completion_percentage)}%</span>
            </div>
            <Progress value={userProgress.completion_percentage} className="h-2" />
            {userProgress.streak_days > 0 && (
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <Award className="h-4 w-4" />
                <span>{userProgress.streak_days} días de racha 🔥</span>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{path.estimated_hours}h</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{path.popularity_score}% popular</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{path.skills_covered.length} skills</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{path.completion_rate || 0}% tasa</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Habilidades que desarrollarás:
          </p>
          <div className="flex flex-wrap gap-2">
            {path.skills_covered.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {path.skills_covered.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{path.skills_covered.length - 3} más
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <Button variant="outline" className="w-full bg-transparent" disabled>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completado
          </Button>
        ) : isStarted ? (
          <Button className="w-full" onClick={onContinue}>
            Continuar Aprendiendo
          </Button>
        ) : (
          <Button className="w-full" onClick={onStart}>
            <Play className="h-4 w-4 mr-2" />
            Comenzar Ahora
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
