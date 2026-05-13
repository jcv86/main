'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Briefcase, Brain, Target } from 'lucide-react'

interface Step1VisionProps {
  onNext: (data: {
    role: string
    environment: string
    desiredOutcome: string
  }) => void
  initialData?: {
    role: string
    environment: string
    desiredOutcome: string
  }
}

export function A2Day1Step1Vision({ onNext, initialData }: Step1VisionProps) {
  const [role, setRole] = useState(initialData?.role || '')
  const [environment, setEnvironment] = useState(initialData?.environment || '')
  const [desiredOutcome, setDesiredOutcome] = useState(initialData?.desiredOutcome || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!role.trim()) newErrors.role = 'Professional role is required'
    if (!environment.trim()) newErrors.environment = 'Ideal environment is required'
    if (!desiredOutcome.trim()) newErrors.desiredOutcome = 'Desired outcome is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext({ role: role.trim(), environment: environment.trim(), desiredOutcome: desiredOutcome.trim() })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Your Vision</h2>
        <p className="text-white/60">Let&apos;s start by clarifying what you&apos;re looking for in your professional journey.</p>
      </div>

      {/* Professional Role */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          What professional role or title are you targeting?
        </Label>
        <Input
          placeholder="e.g., Senior Product Manager, Data Scientist, Growth Hacker"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-slate-900/50 border-slate-700 text-white"
        />
        {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
      </div>

      {/* Ideal Environment */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Brain className="w-4 h-4 text-purple-400" />
          Describe your ideal work environment
        </Label>
        <Textarea
          placeholder="Consider company size, industry, culture, values, flexibility, growth opportunities, etc."
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          rows={4}
          className="bg-slate-900/50 border-slate-700 text-white"
        />
        {errors.environment && <p className="text-red-400 text-sm">{errors.environment}</p>}
      </div>

      {/* Desired Outcome */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Target className="w-4 h-4 text-emerald-400" />
          What do you want to achieve in the next 30 days?
        </Label>
        <Textarea
          placeholder="Be specific about the result you want to accomplish by Day 30"
          value={desiredOutcome}
          onChange={(e) => setDesiredOutcome(e.target.value)}
          rows={4}
          className="bg-slate-900/50 border-slate-700 text-white"
        />
        {errors.desiredOutcome && <p className="text-red-400 text-sm">{errors.desiredOutcome}</p>}
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        Continue to Coach Enhancement
      </Button>
    </div>
  )
}
