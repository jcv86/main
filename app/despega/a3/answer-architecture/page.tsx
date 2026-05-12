'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, MessageSquare, Lightbulb } from 'lucide-react'

const MODULE_XP = 120
const REQUIRED_ACTIVITIES = [
  'Build 30-second self-introduction',
  'Build motivation answer',
  'Build strengths answer',
  'Build challenge answer using STAR',
  'Build "Why should we hire you?" answer',
  'Shorten one answer into 30, 45, and 60 seconds'
]

export default function AnswerArchitectureModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [selfIntro, setSelfIntro] = useState('')

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
          moduleId: 'answer-architecture', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: REQUIRED_ACTIVITIES.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=answer-architecture')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=answer-architecture')
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
          <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
            Module 5 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[rgb(200,130,200)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Answer Architecture</h1>
              <p className="text-white/60">Answer builder • Optional voice practice</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Build clear interview answers before live practice using simple structures and role-focused examples.
          </p>
        </div>

        {/* Formulas */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-purple-500/10 border-purple-500/30 p-4">
            <p className="text-[rgb(200,130,200)] text-xs uppercase mb-2">Self-Introduction Formula</p>
            <p className="text-white/80 text-sm italic">
              &quot;I am a ___ with experience in ___. My strongest areas are ___. Now I am looking for ___ because ____.&quot;
            </p>
          </Card>
          <Card className="bg-[rgb(170,70,170)]/10 border-[rgba(170,70,170,0.3)] p-4">
            <p className="text-[rgb(170,70,170)] text-xs uppercase mb-2">Basic STAR Formula</p>
            <p className="text-white/80 text-sm italic">
              &quot;The situation was ___. My responsibility was ___. I acted by ___. The result was ___.&quot;
            </p>
          </Card>
        </div>

        {/* Learning Points */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                A good answer has structure. A strong answer starts with the main idea, gives one relevant example, 
                connects to the role, and ends clearly.
              </p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progress</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
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
                  ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
                  : currentStep === index 
                    ? 'bg-[rgb(170,70,170)]/10 border-[rgba(170,70,170,0.3)]'
                    : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index)
                    ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]'
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
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30 min-h-24"
                          placeholder="Write your 30-second self-introduction..."
                          value={selfIntro}
                          onChange={(e) => setSelfIntro(e.target.value)}
                        />
                      )}
                      <Button 
                        onClick={() => completeStep(index)}
                        className="mt-4 bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
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
          <Card className="bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Answer Architecture Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Coach Practice Room.
            </p>
            <Button onClick={handleComplete} className="bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Continue to Next Module
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
