'use client'

import { useCoach } from '@/contexts/coach-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Flame, TrendingUp, Smile, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function CoachSidebar() {
  const { userName, currentProgress, coachMessages, isLoadingCoach } = useCoach()

  return (
    <div className="fixed right-4 bottom-4 w-80 z-40">
      <Card className="shadow-lg border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950 dark:to-slate-900">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Tu Coach
              </CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {userName || 'Tu transformación'}
              </p>
            </div>
            <Link href="/despega/a2/coach" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <MessageCircle className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Coach Message */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-100 dark:border-blue-900 text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-h-16">
            {isLoadingCoach ? (
              <div className="text-slate-500">Analizando tu progreso...</div>
            ) : coachMessages.length > 0 ? (
              coachMessages[0]
            ) : (
              'Tu progreso aparecerá aquí'
            )}
          </div>

          {/* Progress Stats */}
          <div className="space-y-3">
            {/* Streak */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <Flame className="w-3 h-3 text-orange-500" />
                  Racha
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {currentProgress.streak}d
                </span>
              </div>
            </div>

            {/* Success Rate */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  Tasa de éxito
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {currentProgress.successRate}%
                </span>
              </div>
              <Progress 
                value={currentProgress.successRate} 
                className="h-1.5 bg-slate-200 dark:bg-slate-700"
              />
            </div>

            {/* Mood */}
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Smile className="w-3 h-3 text-yellow-500" />
                Ánimo hoy
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className={`text-lg ${i <= currentProgress.currentMood ? 'opacity-100' : 'opacity-30'}`}>
                    {['😞', '😐', '😐', '😊', '🤩'][i - 1]}
                  </span>
                ))}
              </div>
            </div>

            {/* Sprint Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">Sprint</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {currentProgress.sprintProgress}%
                </span>
              </div>
              <Progress 
                value={currentProgress.sprintProgress} 
                className="h-1.5 bg-slate-200 dark:bg-slate-700"
              />
            </div>
          </div>

          {/* Actions Completed Badge */}
          <Badge variant="outline" className="w-full justify-center bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100">
            {currentProgress.actionsCompleted} acciones completadas
          </Badge>

          {/* CTA */}
          <Link href="/despega/a2/coach" className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-2 border-t border-slate-200 dark:border-slate-800 mt-3">
            Abrir conversación completa →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
