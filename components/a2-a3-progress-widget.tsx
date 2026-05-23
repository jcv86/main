'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Lock,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
} from 'lucide-react'

interface A2A3ProgressWidgetProps {
  a2CurrentDay: number
  a2TotalDays?: number
  a2CompletionPercent?: number
  a2Phase?: string
  a3CompletedModules?: number
  a3TotalModules?: number
  a3XpEarned?: number
  a3XpMax?: number
  a3NextCheckpoint?: {
    day: number
    moduleNumber: number
    moduleName: string
  }
  a3IsLocked?: boolean
  a2Day1Passed?: boolean
  a2Day1Score?: number
}

export function A2A3ProgressWidget({
  a2CurrentDay = 1,
  a2TotalDays = 90,
  a2CompletionPercent = 0,
  a2Phase = 'Foundation',
  a3CompletedModules = 0,
  a3TotalModules = 10,
  a3XpEarned = 0,
  a3XpMax = 1340,
  a3NextCheckpoint,
  a3IsLocked = true,
  a2Day1Passed = false,
  a2Day1Score = 0,
}: A2A3ProgressWidgetProps) {
  const a3CompletionPercent = Math.round((a3XpEarned / a3XpMax) * 100)
  const a3CanAccess = a2Day1Passed && a2CurrentDay >= (a3NextCheckpoint?.day || 7)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* A2 Progress Card */}
      <Card className="bg-slate-900/40 border-purple-500/30 rounded-[28px] p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm uppercase tracking-wide text-purple-400 font-semibold">
                Ruta A2
              </h3>
              <p className="text-2xl font-bold text-white">
                Día {a2CurrentDay} / {a2TotalDays}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">
                {a2CompletionPercent}%
              </div>
              <p className="text-xs text-slate-400">{a2Phase}</p>
            </div>
          </div>

          <Progress value={a2CompletionPercent} className="h-2 bg-slate-700" />

          {/* Day 1 Status */}
          <div
            className={`rounded-lg p-3 border ${
              a2Day1Passed
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {a2Day1Passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">
                    Day 1 Passed ({a2Day1Score})
                  </span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-amber-300">Day 1: Complete to unlock A3</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* A3 Progress Card */}
      <Card className="bg-slate-900/40 border-emerald-500/30 rounded-[28px] p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm uppercase tracking-wide text-emerald-400 font-semibold">
                Aprendizaje A3
              </h3>
              <p className="text-2xl font-bold text-white">
                {a3CompletedModules} / {a3TotalModules} Módulos
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">
                {a3XpEarned} <span className="text-lg">XP</span>
              </div>
              <p className="text-xs text-slate-400">/ {a3XpMax}</p>
            </div>
          </div>

          <Progress value={a3CompletionPercent} className="h-2 bg-slate-700" />

          {/* A3 Status */}
          <div
            className={`rounded-lg p-3 border ${
              a3CanAccess
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-slate-500/10 border-[rgb(80,160,170)]/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {a3CanAccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-300">
                    Next: Module {(a3NextCheckpoint?.moduleNumber || 1)} (Day{' '}
                    {a3NextCheckpoint?.day || 7})
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {!a2Day1Passed
                      ? 'Complete A2 Day 1 to unlock'
                      : `Available on Day ${a3NextCheckpoint?.day || 7}`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline Overview (optional) */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-900/40 border-[rgb(80,160,170)]/30 rounded-[28px] p-6">
          <h3 className="text-sm uppercase tracking-wide text-slate-400 font-semibold mb-4">
            90-Day Journey
          </h3>

          <div className="space-y-3">
            {/* Phase 1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Foundation (Days 1-30)</span>
                <span className="text-slate-500">
                  {a2CurrentDay <= 30
                    ? `Day ${a2CurrentDay}`
                    : a2CurrentDay > 30
                      ? 'Complete'
                      : 'Upcoming'}
                </span>
              </div>
              <Progress
                value={
                  a2CurrentDay <= 30
                    ? (a2CurrentDay / 30) * 100
                    : a2CurrentDay > 30
                      ? 100
                      : 0
                }
                className="h-1.5"
              />
            </div>

            {/* Phase 2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Role Alignment (Days 31-60)</span>
                <span className="text-slate-500">
                  {a2CurrentDay >= 31 && a2CurrentDay <= 60
                    ? `Day ${a2CurrentDay}`
                    : a2CurrentDay > 60
                      ? 'Complete'
                      : 'Upcoming'}
                </span>
              </div>
              <Progress
                value={
                  a2CurrentDay >= 31
                    ? a2CurrentDay > 60
                      ? 100
                      : ((a2CurrentDay - 30) / 30) * 100
                    : 0
                }
                className="h-1.5"
              />
            </div>

            {/* Phase 3 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Certification (Days 61-90)</span>
                <span className="text-slate-500">
                  {a2CurrentDay >= 61
                    ? a2CurrentDay <= 90
                      ? `Day ${a2CurrentDay}`
                      : 'Complete'
                    : 'Upcoming'}
                </span>
              </div>
              <Progress
                value={
                  a2CurrentDay >= 61
                    ? a2CurrentDay > 90
                      ? 100
                      : ((a2CurrentDay - 60) / 30) * 100
                    : 0
                }
                className="h-1.5"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
