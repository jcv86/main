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
          {/* GLOBAL JOURNEY PROGRESS */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-100">Progreso General</span>
              <Badge className="bg-indigo-600 text-white text-xs">50%</Badge>
            </div>
            <div className="flex gap-1 items-center text-xs font-medium">
              <span className="text-green-600 dark:text-green-400">A1 ✓</span>
              <span className="text-yellow-600 dark:text-yellow-400">A2 ▮</span>
              <span className="text-slate-400">A3 ○</span>
              <span className="text-slate-400">A4 ○</span>
            </div>
            <Progress value={50} className="h-1.5 mt-2 bg-slate-300 dark:bg-slate-700" />
          </div>

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

          {/* Quick Links */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
            <Link href="/despega/journey-summary" className="block text-center text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 py-1">
              📊 Ver Resumen del Viaje
            </Link>
            <Link href="/despega/a2/coach" className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-1">
              💬 Abrir Chat Completo
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
