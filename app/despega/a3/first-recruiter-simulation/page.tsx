'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, Video, Clock, AlertCircle } from 'lucide-react'

const MODULE_XP = 160
const INTERVIEW_STAGES = [
  { name: 'Setup', progress: 10 },
  { name: 'Interview started', progress: 25 },
  { name: 'Halfway complete', progress: 50 },
  { name: 'Interview completed', progress: 80 },
  { name: 'Report reviewed', progress: 100 }
]

export default function FirstRecruiterSimulationModule() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(0)
  const [simulationStarted, setSimulationStarted] = useState(false)

  const progress = INTERVIEW_STAGES[currentStage]?.progress || 0

  const advanceStage = () => {
    if (currentStage < INTERVIEW_STAGES.length - 1) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'first-recruiter-simulation', 
          status: 'completed',
          xpEarned: MODULE_XP
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=first-recruiter-simulation')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=first-recruiter-simulation')
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
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Required Simulation
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Module 8 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">First Recruiter Simulation</h1>
              <p className="text-white/60">Short realistic interview • Live simulation required</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Complete your first short recruiter-style simulation and receive a clear readiness report.
          </p>
        </div>

        {/* Simulation Details */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-white/40 text-xs uppercase">Interviewer</p>
              <p className="text-white font-medium">Recruiter / HR</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Difficulty</p>
              <p className="text-white font-medium">Simple</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Format</p>
              <p className="text-white font-medium">Short Full Interview</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Duration</p>
              <p className="text-white font-medium flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> 8-12 min
              </p>
            </div>
          </div>
        </Card>

        {/* Interview Structure */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-3">Interview Structure</p>
          <ol className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
              Greeting
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
              Tell me about yourself
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">3</span>
              CV question
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">4</span>
              Why are you interested in this role?
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">5</span>
              What are your strengths?
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">6</span>
              One basic behavioral question
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">7</span>
              Candidate question
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">8</span>
              Closing
            </li>
          </ol>
        </Card>

        {/* Progress */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Simulation Progress</span>
            <span className="text-cyan-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-xs text-white/50 mt-2">
            Current stage: {INTERVIEW_STAGES[currentStage]?.name || 'Not started'}
          </p>
        </Card>

        {/* Simulation Area */}
        {!simulationStarted ? (
          <Card className="bg-cyan-500/10 border-cyan-500/30 p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-cyan-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Ready to Begin?</h3>
            <p className="text-white/70 max-w-md mx-auto">
              This is your first real interview checkpoint. The simulation should be short, simple, 
              and recruiter-style. The goal is to test basic readiness without overwhelming you.
            </p>
            <Button 
              onClick={() => {
                setSimulationStarted(true)
                setCurrentStage(0)
              }}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Start Simulation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ) : currentStage < INTERVIEW_STAGES.length - 1 ? (
          <Card className="bg-white/5 border-white/10 p-8 text-center space-y-4">
            <Video className="w-12 h-12 text-cyan-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">
              Stage: {INTERVIEW_STAGES[currentStage]?.name}
            </h3>
            <p className="text-white/70">
              Continue through the simulation stages.
            </p>
            <Button 
              onClick={advanceStage}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Continue to Next Stage
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ) : (
          <Card className="bg-emerald-500/10 border-emerald-500/30 p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">First Simulation Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Risk & Difficult Questions Lab.
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
