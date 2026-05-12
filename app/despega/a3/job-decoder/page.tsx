'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, Search, Lightbulb } from 'lucide-react'

const MODULE_XP = 100
const REQUIRED_ACTIVITIES = [
  'Paste vacancy or select target role',
  'Identify 5 key requirements',
  'Separate must-have and nice-to-have requirements',
  'Create match map',
  'Generate likely interview questions'
]

export default function JobDecoderModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [vacancy, setVacancy] = useState('')

  const progress = Math.round((completedSteps.length / REQUIRED_ACTIVITIES.length) * 100)

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < REQUIRED_ACTIVITIES.length - 1) {
      setCurrentStep(step + 1)
    }
  }

  const handleComplete = async () => {
    try {
      await fetch('/api/a3/complete-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: 'job-decoder', xp: MODULE_XP })
      })
      router.push('/despega/a3?completed=job-decoder')
    } catch (error) {
      console.error('Error completing module:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            Module 4 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Job Decoder</h1>
              <p className="text-white/60">Vacancy and role analysis • No interview required</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Learn how to read a vacancy, understand what the company really needs, and identify your fit and gaps.
          </p>
        </div>

        {/* Learning Points */}
        <Card className="bg-emerald-500/10 border-emerald-500/30 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                A vacancy is a map. Job descriptions have visible and hidden messages. 
                Not all requirements have the same weight. Answers must connect to the role.
              </p>
            </div>
          </div>
        </Card>

        {/* Formula */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-2">Formula</p>
          <p className="text-white/80 italic">
            &quot;This role needs ___. I can show this through ___. I need to prepare better for ____.&quot;
          </p>
        </Card>

        {/* Progress */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progress</span>
            <span className="text-cyan-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </Card>

        {/* Activities */}
        <div className="space-y-4">
          {REQUIRED_ACTIVITIES.map((activity, index) => (
            <Card 
              key={index}
              className={`p-6 transition-all ${
                completedSteps.includes(index) 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : currentStep === index 
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index)
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/10 text-white/50'
                }`}>
                  {completedSteps.includes(index) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{activity}</h3>
                  {currentStep === index && !completedSteps.includes(index) && (
                    <div className="mt-4">
                      {index === 0 && (
                        <textarea 
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30 min-h-32"
                          placeholder="Paste the job description here..."
                          value={vacancy}
                          onChange={(e) => setVacancy(e.target.value)}
                        />
                      )}
                      <Button 
                        onClick={() => completeStep(index)}
                        className="mt-4 bg-cyan-500 hover:bg-cyan-600"
                      >
                        Complete Activity
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Complete Module */}
        {completedSteps.length === REQUIRED_ACTIVITIES.length && (
          <Card className="bg-emerald-500/10 border-emerald-500/30 p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Job Decoder Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Answer Architecture.
            </p>
            <Button onClick={handleComplete} className="bg-emerald-500 hover:bg-emerald-600">
              Continue to Next Module
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
