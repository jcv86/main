'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, XCircle, CheckCircle } from 'lucide-react'

const MODULE_XP = 170
const REQUIRED_ACTIVITIES = [
  'Select personal risks',
  'Build 5 safe answers',
  'Remove red-flag phrases',
  'Complete 3-question mini pressure drill',
  'Review difficult questions report'
]

const RISK_EXAMPLES = [
  'Career gap',
  'Job changes',
  'Lack of experience',
  'Overqualification',
  'Weak achievements',
  'Salary expectation',
  'Reason for leaving',
  'Career change',
  'Low confidence',
  'Weak English',
  'Lack of leadership examples'
]

export default function RiskDifficultQuestionsLabModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [selectedRisks, setSelectedRisks] = useState<string[]>([])

  const progress = Math.round((completedSteps.length / REQUIRED_ACTIVITIES.length) * 100)

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < REQUIRED_ACTIVITIES.length - 1) {
      setCurrentStep(step + 1)
    }
  }

  const toggleRisk = (risk: string) => {
    if (selectedRisks.includes(risk)) {
      setSelectedRisks(selectedRisks.filter(r => r !== risk))
    } else {
      setSelectedRisks([...selectedRisks, risk])
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'risk-difficult-questions-lab', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: REQUIRED_ACTIVITIES.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=risk-difficult-questions-lab')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=risk-difficult-questions-lab')
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
            <Badge className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)] border-[rgba(80,160,170,0.4)]">
              Mini Pressure Drill
            </Badge>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              Module 9 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(80,160,170,0.2)] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[rgb(80,160,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Risk & Difficult Questions Lab</h1>
              <p className="text-white/60">Risk preparation • Required mini live drill</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Prepare uncomfortable questions calmly, build safer answers, and complete a short pressure drill.
          </p>
        </div>

        {/* Learning Points */}
        <Card className="bg-[rgba(80,160,170,0.15)] border-[rgba(80,160,170,0.4)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                A difficult question is not an attack. Most difficult questions are normal interview checks. 
                The interviewer wants to know if you can explain decisions, handle feedback, stay honest, 
                understand weaknesses, and remain calm.
              </p>
            </div>
          </div>
        </Card>

        {/* Safe Answer Formula */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-2">Safe Answer Formula</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] px-3 py-1.5 rounded">Acknowledge</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] px-3 py-1.5 rounded">Explain briefly</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] px-3 py-1.5 rounded">Show learning</span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] px-3 py-1.5 rounded">Redirect to value</span>
          </div>
        </Card>

        {/* Avoid vs Use */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-red-500/10 border-red-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-medium">Avoid</p>
            </div>
            <ul className="space-y-1 text-sm text-white/70">
              <li>&quot;That was not my fault.&quot;</li>
              <li>&quot;My boss was bad.&quot;</li>
              <li>&quot;The company was terrible.&quot;</li>
              <li>&quot;I do not know.&quot;</li>
              <li>&quot;I never make mistakes.&quot;</li>
            </ul>
          </Card>
          <Card className="bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-[rgb(200,130,200)]" />
              <p className="text-[rgb(200,130,200)] font-medium">Use</p>
            </div>
            <ul className="space-y-1 text-sm text-white/70">
              <li>&quot;What I learned was...&quot;</li>
              <li>&quot;The situation taught me...&quot;</li>
              <li>&quot;Now I am focused on...&quot;</li>
              <li>&quot;I understand the concern...&quot;</li>
              <li>&quot;I can explain the context...&quot;</li>
            </ul>
          </Card>
        </div>

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
                        <div className="flex flex-wrap gap-2 mb-4">
                          {RISK_EXAMPLES.map((risk) => (
                            <button
                              key={risk}
                              onClick={() => toggleRisk(risk)}
                              className={`px-3 py-1.5 rounded text-sm transition-all ${
                                selectedRisks.includes(risk)
                                  ? 'bg-amber-500/30 text-[rgb(80,160,170)] border border-amber-500/50'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                              }`}
                            >
                              {risk}
                            </button>
                          ))}
                        </div>
                      )}
                      <Button 
                        onClick={() => completeStep(index)}
                        className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
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
            <h3 className="text-xl font-bold text-white">Risk Lab Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Basic Interview Mission.
            </p>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Continue to Final Mission
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
