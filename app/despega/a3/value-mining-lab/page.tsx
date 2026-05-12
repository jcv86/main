'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, Gem, Lightbulb } from 'lucide-react'

const MODULE_XP = 100
const REQUIRED_ACTIVITIES = [
  'Write 5 tasks from previous experience',
  'Transform tasks into value statements',
  'Complete responsibility transformation',
  'Create 3 achievement examples',
  'Select 1 strong story for future interview answers'
]

export default function ValueMiningLabModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [tasks, setTasks] = useState<string[]>(['', '', '', '', ''])

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
          moduleId: 'value-mining-lab', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: REQUIRED_ACTIVITIES.length
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
      
      router.push('/despega/a3?completed=value-mining-lab')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=value-mining-lab')
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
            Module 2 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(80,160,170,0.2)] flex items-center justify-center">
              <Gem className="w-6 h-6 text-[rgb(80,160,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Value Mining Lab</h1>
              <p className="text-white/60">Achievement discovery lab • Optional coach support</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Discover the real value hidden inside your previous work experience and turn tasks into achievements.
          </p>
        </div>

        {/* Learning Point */}
        <Card className="bg-[rgba(80,160,170,0.15)] border-[rgba(80,160,170,0.4)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                <strong>Task</strong> describes what you did. <strong>Value</strong> describes why it mattered. 
                Every job has hidden impact. Achievements do not always need exact numbers.
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

        {/* Example Transformation */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-2">Example Transformation</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-xs uppercase mb-1">Weak</p>
              <p className="text-white/70 text-sm">I answered emails.</p>
            </div>
            <div className="bg-[rgba(170,70,170,0.15)] border border-[rgba(170,70,170,0.4)] rounded-lg p-3">
              <p className="text-[rgb(200,130,200)] text-xs uppercase mb-1">Better</p>
              <p className="text-white/70 text-sm">
                I helped maintain communication with clients and reduced delays by responding to operational requests quickly.
              </p>
            </div>
          </div>
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
                        <div className="space-y-3">
                          {tasks.map((task, i) => (
                            <input 
                              key={i}
                              className="w-full rounded-[20px] bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                              placeholder={`Task ${i + 1}: What did you do?`}
                              value={task}
                              onChange={(e) => {
                                const newTasks = [...tasks]
                                newTasks[i] = e.target.value
                                setTasks(newTasks)
                              }}
                            />
                          ))}
                        </div>
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
            <h3 className="text-xl font-bold text-white">Module Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked CV Builder Studio.
            </p>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Continue to Next Module
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
