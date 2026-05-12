'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle2, FileText, Upload, Lightbulb } from 'lucide-react'

const MODULE_XP = 120
const REQUIRED_ACTIVITIES = [
  'Upload or create CV base',
  'Build professional summary',
  'Improve at least 3 experience bullet points',
  'Organize skills section',
  'Complete missing information checklist'
]

export default function CVBuilderStudioModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [summary, setSummary] = useState('')

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
          moduleId: 'cv-builder-studio', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: REQUIRED_ACTIVITIES.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=cv-builder-studio')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=cv-builder-studio')
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
            Module 3 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CV Builder Studio</h1>
              <p className="text-white/60">Document-building module • No interview required</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Create or improve a clear, recruiter-friendly CV using the value discovered in previous modules.
          </p>
        </div>

        {/* Learning Points */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Recruiters scan before they read. The CV must communicate quickly. 
                A professional summary should be specific. Bullet points should show action and value.
              </p>
            </div>
          </div>
        </Card>

        {/* Example Summary */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-2">Professional Summary Example</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-xs uppercase mb-1">Weak</p>
              <p className="text-white/70 text-sm">
                Responsible, proactive person looking for an opportunity to grow.
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-emerald-400 text-xs uppercase mb-1">Better</p>
              <p className="text-white/70 text-sm">
                Administrative and operations professional with experience supporting internal processes, 
                coordinating documentation, and maintaining organized communication between teams and clients.
              </p>
            </div>
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
                    <div className="mt-4">
                      {index === 0 && (
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 text-white/40 mx-auto mb-3" />
                          <p className="text-white/60 text-sm">
                            Drag and drop your CV here, or click to upload
                          </p>
                          <Button variant="outline" className="mt-4">
                            Upload CV
                          </Button>
                        </div>
                      )}
                      {index === 1 && (
                        <textarea 
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30 min-h-32"
                          placeholder="Write your professional summary here..."
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
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
            <h3 className="text-xl font-bold text-white">CV Builder Complete!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Job Decoder.
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
