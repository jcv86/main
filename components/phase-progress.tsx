'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle2 } from 'lucide-react'

interface PhaseProgressProps {
  phaseName: string
  completed: number
  total: number
  daysRange: string
}

export function PhaseProgress({
  phaseName,
  completed,
  total,
  daysRange,
}: PhaseProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-white">{phaseName}</h4>
          <p className="text-xs text-white/70">{daysRange}</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-white">
            {completed}/{total}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={percentage} className="flex-1 h-2" />
        <span className="text-xs font-semibold text-white/80 w-10 text-right">
          {percentage}%
        </span>
      </div>
    </div>
  )
}
