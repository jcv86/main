'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, CheckCircle2, User } from 'lucide-react'

// PILLAR 3 COLORS
const PILLAR3_PRIMARY = 'rgb(170, 70, 170)'
const PILLAR3_ACCENT = 'rgb(80, 160, 170)'

const MODULE_XP = 80
const REQUIRED_ACTIVITIES = [
  'Review diagnosis',
  'Confirm diagnosis accuracy', 
  'Select main career direction',
  'Define current professional identity',
  'Save Career Mirror Card'
]

export default function CareerMirrorModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [professionalIdentity, setProfessionalIdentity] = useState('')

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
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'career-mirror', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: REQUIRED_ACTIVITIES.length
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
      
      router.push('/despega/a3?completed=career-mirror')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=career-mirror')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background with pillar 3 color */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(to bottom, rgba(170, 70, 170, 0.08) 0%, transparent 30%, transparent 100%)` 
          }} 
        />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <Badge 
            style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: PILLAR3_PRIMARY, borderColor: 'rgba(170, 70, 170, 0.4)' }}
            className="border"
          >
            Module 1 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <User className="w-6 h-6" style={{ color: 'rgb(200, 130, 200)' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Career Mirror</h1>
              <p className="text-white/60">Self-discovery module • No interview required</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Understand your professional profile, your Basic Level diagnosis, your strengths, 
            blockers, and how interviewers may perceive you.
          </p>
        </div>

        {/* Progress */}
        <Card 
          className="bg-white/5 p-4 border"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progress</span>
            <span style={{ color: PILLAR3_PRIMARY }}>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${PILLAR3_PRIMARY}, rgba(170, 70, 170, 0.7))`
              }}
            />
          </div>
          <p className="text-xs text-white/50 mt-2">
            {completedSteps.length} of {REQUIRED_ACTIVITIES.length} activities completed
          </p>
        </Card>

        {/* Activities */}
        <div className="space-y-4">
          {REQUIRED_ACTIVITIES.map((activity, index) => (
            <Card 
              key={index}
              className="p-6 transition-all border"
              style={{
                backgroundColor: completedSteps.includes(index) 
                  ? 'rgba(170, 70, 170, 0.15)' 
                  : currentStep === index 
                    ? 'rgba(80, 160, 170, 0.1)'
                    : 'rgba(255, 255, 255, 0.03)',
                borderColor: completedSteps.includes(index)
                  ? 'rgba(170, 70, 170, 0.4)'
                  : currentStep === index
                    ? 'rgba(80, 160, 170, 0.4)'
                    : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: completedSteps.includes(index)
                      ? 'rgba(170, 70, 170, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: completedSteps.includes(index)
                      ? 'rgb(200, 130, 200)'
                      : 'rgba(255, 255, 255, 0.5)'
                  }}
                >
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
                      {index === 3 && (
                        <div className="space-y-3">
                          <p className="text-white/60 text-sm">
                            Complete this template: &quot;I am a ___ professional with experience in ___. 
                            I usually help with ___. I want to grow toward ___.&quot;
                          </p>
                          <textarea 
                            className="w-full rounded-[20px] bg-white/5 rounded-lg p-3 text-white placeholder:text-white/30 min-h-24 border"
                            style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                            placeholder="I am a..."
                            value={professionalIdentity}
                            onChange={(e) => setProfessionalIdentity(e.target.value)}
                          />
                        </div>
                      )}
                      <Button 
                        onClick={() => completeStep(index)}
                        className="mt-4 text-white"
                        style={{ backgroundColor: PILLAR3_ACCENT }}
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
          <Card 
            className="p-6 text-center space-y-4 border"
            style={{ 
              backgroundColor: 'rgba(170, 70, 170, 0.15)',
              borderColor: 'rgba(170, 70, 170, 0.4)'
            }}
          >
            <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: PILLAR3_PRIMARY }} />
            <h3 className="text-xl font-bold text-white">All Activities Completed!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Value Mining Lab.
            </p>
            <Button 
              onClick={handleComplete} 
              className="text-white"
              style={{ backgroundColor: PILLAR3_PRIMARY }}
            >
              Complete Module & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
