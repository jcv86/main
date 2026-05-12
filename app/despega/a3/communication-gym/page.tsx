'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, Mic, Lightbulb, Video } from 'lucide-react'

const MODULE_XP = 140
const REQUIRED_ACTIVITIES = [
  'Record 30-second self-introduction',
  'Complete pause drill',
  'Record 45-second motivation answer',
  'Receive delivery feedback',
  'Repeat one answer after feedback'
]

export default function CommunicationGymModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isRecording, setIsRecording] = useState(false)

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
        body: JSON.stringify({ moduleId: 'communication-gym', xp: MODULE_XP })
      })
      router.push('/despega/a3?completed=communication-gym')
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
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              Voice/Video Required
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Module 7 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Mic className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Communication Gym</h1>
              <p className="text-white/60">Voice and delivery training • Voice/video drills required</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Train voice, rhythm, clarity, pauses, tone, answer length, and confidence through recorded drills.
          </p>
        </div>

        {/* Learning Points */}
        <Card className="bg-cyan-500/10 border-cyan-500/30 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Speaking clearly is a skill. A good answer can lose power if it is too fast, too slow, too long, 
                too quiet, too nervous, too flat, or too informal. Pauses create control.
              </p>
            </div>
          </div>
        </Card>

        {/* Better Speaking Pattern */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-3">Better Speaking Pattern</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-white/10 px-3 py-1.5 rounded text-white/80">1. Listen</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-white/10 px-3 py-1.5 rounded text-white/80">2. Pause</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-white/10 px-3 py-1.5 rounded text-white/80">3. Main idea</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-white/10 px-3 py-1.5 rounded text-white/80">4. Example</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-white/10 px-3 py-1.5 rounded text-white/80">5. Close clearly</span>
          </div>
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
                    <div className="mt-4 space-y-4">
                      {(index === 0 || index === 2 || index === 4) && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                          <Video className="w-12 h-12 text-white/40 mx-auto mb-3" />
                          <p className="text-white/60 text-sm mb-4">
                            Click to start recording your answer
                          </p>
                          <Button 
                            onClick={() => setIsRecording(!isRecording)}
                            className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'}
                          >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                            <Mic className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                      <Button 
                        onClick={() => completeStep(index)}
                        className="bg-cyan-500 hover:bg-cyan-600"
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
            <h3 className="text-xl font-bold text-white">Communication Gym Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked First Recruiter Simulation.
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
