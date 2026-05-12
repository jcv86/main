'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, Trophy, Clock, AlertCircle, Star } from 'lucide-react'

const MODULE_XP = 220
const INTERVIEW_STAGES = [
  { name: 'Setup', progress: 5 },
  { name: 'Opening complete', progress: 20 },
  { name: 'CV section complete', progress: 35 },
  { name: 'Role-fit section complete', progress: 50 },
  { name: 'Behavioral section complete', progress: 65 },
  { name: 'Difficult question complete', progress: 80 },
  { name: 'Interview completed', progress: 90 },
  { name: 'Report reviewed', progress: 100 }
]

export default function BasicInterviewMissionModule() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(0)
  const [missionStarted, setMissionStarted] = useState(false)

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
          moduleId: 'basic-interview-mission', 
          status: 'completed',
          xpEarned: MODULE_XP
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=basic-interview-mission&final=true')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=basic-interview-mission&final=true')
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
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] border-purple-500/30">
              Final Mission
            </Badge>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              Module 10 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[rgb(200,130,200)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Basic Interview Mission</h1>
              <p className="text-white/60">Final full realistic interview • Required simulation</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Complete a full beginner-friendly realistic interview and receive your Basic Level readiness report.
          </p>
        </div>

        {/* Mission Details */}
        <Card className="rounded-[2px] bg-purple-500/10 border-purple-500/30 p-4">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-white/40 text-xs uppercase">Interviewer</p>
              <p className="text-white font-medium">Recruiter / HR</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Difficulty</p>
              <p className="text-white font-medium">Simple to Middle</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Format</p>
              <p className="text-white font-medium">Full Interview</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Duration</p>
              <p className="text-white font-medium flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> 15-25 min
              </p>
            </div>
          </div>
        </Card>

        {/* Interview Structure */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-3">Full Interview Structure</p>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              'Welcome',
              'Tell me about yourself',
              'Walk me through your CV',
              'Why are you interested in this role?',
              'What experience connects with this position?',
              'What are your strengths?',
              'Tell me about a challenge you solved',
              'What is one area you are improving?',
              'One difficult question',
              'Candidate asks a question',
              'Closing',
              'Final evaluation'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </Card>

        {/* Progress */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Mission Progress</span>
            <span className="text-[rgb(200,130,200)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-xs text-white/50 mt-2">
            Current stage: {INTERVIEW_STAGES[currentStage]?.name || 'Not started'}
          </p>
        </Card>

        {/* Mission Area */}
        {!missionStarted ? (
          <Card className="rounded-[2px] bg-purple-500/10 border-purple-500/30 p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Final Mission</h3>
            <p className="text-white/70 max-w-md mx-auto">
              This is the final Basic Level mission. You will complete a full beginner-friendly interview. 
              This module proves whether you are ready for basic recruiter or HR interviews.
            </p>
            <div className="flex items-center justify-center gap-2 text-[rgb(80,160,170)] text-sm">
              <Star className="w-4 h-4" />
              <span>Worth {MODULE_XP} XP - the most of any module!</span>
            </div>
            <Button 
              onClick={() => {
                setMissionStarted(true)
                setCurrentStage(0)
              }}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Start Final Mission
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ) : currentStage < INTERVIEW_STAGES.length - 1 ? (
          <Card className="rounded-[2px] bg-white/5 border-white/10 p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">
              Stage: {INTERVIEW_STAGES[currentStage]?.name}
            </h3>
            <p className="text-white/70">
              Continue through the mission stages.
            </p>
            <Button 
              onClick={advanceStage}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Continue to Next Stage
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ) : (
          <Card className="rounded-[2px] bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-purple-500/30 p-8 text-center space-y-4">
            <div className="relative">
              <Trophy className="w-16 h-16 text-[rgb(80,160,170)] mx-auto" />
              <CheckCircle2 className="w-8 h-8 text-[rgb(200,130,200)] absolute -bottom-1 -right-1 left-1/2 ml-4" />
            </div>
            <h3 className="text-2xl font-bold text-white">Basic Level Complete!</h3>
            <p className="text-white/70 max-w-md mx-auto">
              Congratulations! You&apos;ve completed the entire A3 Basic Level Training Path 
              and earned a total of 1,340 XP. You are now ready for real recruiter and HR interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <p className="text-2xl font-bold text-[rgb(170,70,170)]">1,340</p>
                <p className="text-xs text-white/50">Total XP Earned</p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <p className="text-2xl font-bold text-[rgb(200,130,200)]">10/10</p>
                <p className="text-xs text-white/50">Modules Completed</p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <p className="text-2xl font-bold text-[rgb(200,130,200)]">Basic</p>
                <p className="text-xs text-white/50">Level Certified</p>
              </div>
            </div>
            <Button onClick={handleComplete} className="rounded-[20px] bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
              Complete Basic Level
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
