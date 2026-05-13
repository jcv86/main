'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Flag } from 'lucide-react'

interface Step3MilestonesProps {
  onNext: (data: {
    day10: string
    day20: string
    day30: string
  }) => void
  onBack: () => void
  initialData?: {
    day10: string
    day20: string
    day30: string
  }
}

export function A2Day1Step3Milestones({ onNext, onBack, initialData }: Step3MilestonesProps) {
  const [day10, setDay10] = useState(initialData?.day10 || '')
  const [day20, setDay20] = useState(initialData?.day20 || '')
  const [day30, setDay30] = useState(initialData?.day30 || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!day10.trim()) newErrors.day10 = 'Day 10 milestone is required'
    if (!day20.trim()) newErrors.day20 = 'Day 20 milestone is required'
    if (!day30.trim()) newErrors.day30 = 'Day 30 milestone is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext({
        day10: day10.trim(),
        day20: day20.trim(),
        day30: day30.trim(),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Your Milestones</h2>
        <p className="text-white/60">Break down your 30-day goal into clear milestones.</p>
      </div>

      {/* Day 10 Milestone */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Flag className="w-4 h-4 text-purple-400" />
          What should you achieve by Day 10?
        </Label>
        <Textarea
          placeholder="Specific, measurable outcome for the first checkpoint"
          value={day10}
          onChange={(e) => setDay10(e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white"
        />
        {errors.day10 && <p className="text-red-400 text-sm">{errors.day10}</p>}
      </div>

      {/* Day 20 Milestone */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Flag className="w-4 h-4 text-cyan-400" />
          What should you achieve by Day 20?
        </Label>
        <Textarea
          placeholder="Progress towards your main goal"
          value={day20}
          onChange={(e) => setDay20(e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white"
        />
        {errors.day20 && <p className="text-red-400 text-sm">{errors.day20}</p>}
      </div>

      {/* Day 30 Milestone */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Flag className="w-4 h-4 text-emerald-400" />
          What should you achieve by Day 30?
        </Label>
        <Textarea
          placeholder="Your ultimate 30-day goal"
          value={day30}
          onChange={(e) => setDay30(e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white"
        />
        {errors.day30 && <p className="text-red-400 text-sm">{errors.day30}</p>}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700"
        >
          Continue to Action Plan
        </Button>
      </div>
    </div>
  )
}
