'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, XCircle, CheckCircle, Shield, ChevronDown, ChevronUp, Lock, Mic } from 'lucide-react'

const MODULE_XP = 180

// Risk categories with detailed content
const RISK_CATEGORIES = [
  {
    id: 'gaps',
    title: 'Vacíos de Empleo',
    icon: '📅',
    description: 'Periods without formal employment',
    examples: ['Career break', 'Health issues', 'Family care', 'Travel/sabbatical', 'Job search period'],
    dangerAnswer: '"I was just taking time off" or "I couldn\'t find anything"',
    safeFormula: 'Acknowledge → Context → Productive use → Ready now',
    safeExample: '"I took 8 months to care for a family member. During that time, I also completed an online certification in [skill] and stayed current by [activity]. I\'m now fully available and energized to contribute."'
  },
  {
    id: 'changes',
    title: 'Cambios Frecuentes de Trabajo',
    icon: '🔄',
    description: 'Multiple positions in short time',
    examples: ['Company closures', 'Contract roles', 'Seeking growth', 'Relocation', 'Industry changes'],
    dangerAnswer: '"I got bored easily" or "The companies were all bad"',
    safeFormula: 'Pattern explanation → Learning from each → Seeking stability now',
    safeExample: '"My early career included contract roles while I explored different areas. Each position taught me [specific skill]. Now I\'m clear on my direction and seeking a long-term role where I can grow with the company."'
  },
  {
    id: 'experience',
    title: 'Lack of Experience',
    icon: '🌱',
    description: 'Missing required skills or years',
    examples: ['Junior level', 'Career change', 'New industry', 'Skill gaps', 'No management experience'],
    dangerAnswer: '"I haven\'t done that before" (and stop there)',
    safeFormula: 'Acknowledge gap → Transferable skills → Learning speed → Enthusiasm',
    safeExample: '"While I haven\'t managed a team formally, I\'ve led project groups and mentored 3 junior colleagues. I learn quickly—I taught myself [skill] in 2 months—and I\'m excited to grow into leadership here."'
  },
  {
    id: 'termination',
    title: 'Ser Despedido/Dejado Ir',
    icon: '⚠️',
    description: 'Involuntary job loss',
    examples: ['Layoffs', 'Performance issues', 'Company restructuring', 'Culture mismatch', 'Project cancellation'],
    dangerAnswer: '"They fired me unfairly" or blaming others',
    safeFormula: 'Brief fact → What you learned → How you\'ve grown → Positive outlook',
    safeExample: '"The company restructured and my role was eliminated along with 30% of the team. It was difficult, but it pushed me to develop [new skill] and clarify my career goals. I\'m now focused on [specific direction]."'
  },
  {
    id: 'weakness',
    title: 'Debilidades Personales',
    icon: '🎯',
    description: 'Self-identified limitations',
    examples: ['Public speaking', 'Delegation', 'Perfectionism', 'Technical skills', 'Time management'],
    dangerAnswer: '"I\'m a perfectionist" (fake weakness) or "I have no weaknesses"',
    safeFormula: 'Real weakness → Impact awareness → Active improvement → Progreso made',
    safeExample: '"I used to struggle with delegation—I\'d try to do everything myself. I realized this limited my team\'s growth. I now use a task matrix to decide what to delegate and have regular check-ins instead of micromanaging. My team\'s output has improved."'
  },
  {
    id: 'conflict',
    title: 'Conflictos Laborales',
    icon: '⚡',
    description: 'Disagreements with colleagues/bosses',
    examples: ['Different opinions', 'Communication issues', 'Project disputes', 'Style clashes', 'Resource competition'],
    dangerAnswer: '"My coworker was terrible" or "My boss was incompetent"',
    safeFormula: 'Neutral situation → Your perspective-taking → Resolution action → Positive outcome',
    safeExample: '"A colleague and I disagreed on project priorities. Instead of escalating, I asked to understand their perspective. I learned they had client commitments I wasn\'t aware of. We created a shared timeline and now proactively sync on priorities."'
  }
]

// Frases de alerta roja to avoid
const RED_FLAGS = [
  { bad: '"That wasn\'t my fault"', why: 'Sounds defensive, avoids accountability' },
  { bad: '"My boss was terrible"', why: 'Never criticize past employers' },
  { bad: '"I have no weaknesses"', why: 'Appears arrogant, lacks self-awareness' },
  { bad: '"I don\'t know"', why: 'Shows lack of preparation' },
  { bad: '"I was bored"', why: 'Suggests you\'ll get bored here too' },
  { bad: '"They didn\'t appreciate me"', why: 'Victim mentality' },
  { bad: '"I\'m a perfectionist" (as weakness)', why: 'Overused, not genuine' },
  { bad: '"I just need a job"', why: 'Shows desperation, not genuine interest' }
]

// Ejercicio de presión questions
const PRESSURE_DRILL_PREGUNTAS = [
  {
    question: 'Why should we hire you over other candidates?',
    tips: ['Focus on unique value', 'Connect to their needs', 'Be confident not arrogant'],
    timeLimit: 60
  },
  {
    question: 'Tell me about a time you failed.',
    tips: ['Choose a real failure', 'Show learning', 'Demonstrate growth'],
    timeLimit: 90
  },
  {
    question: 'Why are you leaving your current position?',
    tips: ['Stay positive', 'Focus on growth', 'Show genuine interest here'],
    timeLimit: 60
  }
]

const ACTIVITIES = [
  { id: 0, title: 'Identify Your Risk Areas', description: 'Select which difficult topics apply to you' },
  { id: 1, title: 'Learn Safe Answer Formulas', description: 'Study frameworks for each risk category' },
  { id: 2, title: 'Avoid Red Flag Phrases', description: 'Learn what never to say in interviews' },
  { id: 3, title: 'Build Your Safe Answers', description: 'Write prepared responses for your risks' },
  { id: 4, title: 'Mini Pressure Drill', description: 'Practice answering under time pressure' }
]

export default function RiskDifficultQuestionsLabModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedActivity, setExpandedActivity] = useState<number | null>(0)
  
  // Activity states
  const [selectedRisks, setSelectedRisks] = useState<string[]>([])
  const [studiedFormulas, setStudiedFormulas] = useState<string[]>([])
  const [acknowledgedFlags, setAcknowledgedFlags] = useState(false)
  const [safeAnswers, setSafeAnswers] = useState<{[key: string]: string}>({})
  const [drillAnswers, setDrillAnswers] = useState<{[key: number]: string}>({})
  const [currentDrillQuestion, setCurrentDrillQuestion] = useState(0)
  const [drillComenzared, setDrillComenzared] = useState(false)

  const progress = Math.round((completedSteps.length / ACTIVITIES.length) * 100)

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < ACTIVITIES.length - 1) {
      setCurrentStep(step + 1)
      setExpandedActivity(step + 1)
    }
  }

  const canComplete = (stepId: number) => {
    switch (stepId) {
      case 0: return selectedRisks.length >= 2
      case 1: return studiedFormulas.length >= 3
      case 2: return acknowledgedFlags
      case 3: return Object.values(safeAnswers).filter(a => a.length > 50).length >= 2
      case 4: return Object.values(drillAnswers).filter(a => a.length > 30).length >= 3
      default: return false
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
          completedActivities: ACTIVITIES.length
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
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
            Module 9 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[rgb(170,70,170)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Laboratorio de Preguntas Difíciles y de Riesgo</h1>
            <p className="text-white/60">Strategic preparation • Mini pressure drill included</p>
          </div>
        </div>

        <p className="text-white/70">
          Every interview has uncomfortable moments. This lab prepares you to handle difficult questions 
          with confidence, turning potential weaknesses into demonstrations of self-awareness and growth.
        </p>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.15)] border-[rgba(80,160,170,0.4)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5" />
            <div>
              <p className="font-semibold text-[rgb(80,160,170)]">Key Insight</p>
              <p className="text-white/70 text-sm mt-1">
                Difficult questions are not attacks—they&apos;re opportunities. Interviewers want to see 
                self-awareness, honesty, and growth mindset. A thoughtful answer to a hard question 
                often impresses more than a perfect answer to an easy one.
              </p>
            </div>
          </div>
        </Card>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[rgb(170,70,170)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/40 text-sm mt-2">{completedSteps.length} of {ACTIVITIES.length} activities</p>
        </Card>

        {/* Activities */}
        <div className="space-y-4">
          {ACTIVITIES.map((activity, index) => {
            const isCompleted = completedSteps.includes(activity.id)
            const isLocked = index > 0 && !completedSteps.includes(index - 1) && index !== currentStep
            const isExpanded = expandedActivity === index

            return (
              <Card 
                key={activity.id}
                className={`rounded-[2px] border transition-all ${
                  isCompleted 
                    ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
                    : isLocked 
                    ? 'bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 opacity-50' 
                    : 'bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/20'
                }`}
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => !isLocked && setExpandedActivity(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-[rgb(200,130,200)]" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6 text-white/30" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[rgba(170,70,170,0.3)] flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{activity.title}</h3>
                      <p className="text-sm text-white/60">{activity.description}</p>
                    </div>
                  </div>
                  {!isLocked && (isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />)}
                </div>

                {isExpanded && !isLocked && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* Activity 0: Identify Risk Areas */}
                    {index === 0 && (
                      <div className="space-y-4">
                        <p className="text-white/70 text-sm">
                          Select at least 2 risk areas that might come up in YOUR interviews. 
                          Being honest helps you prepare better.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {RISK_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                if (selectedRisks.includes(cat.id)) {
                                  setSelectedRisks(selectedRisks.filter(r => r !== cat.id))
                                } else {
                                  setSelectedRisks([...selectedRisks, cat.id])
                                }
                              }}
                              className={`p-3 rounded text-left transition-all ${
                                selectedRisks.includes(cat.id)
                                  ? 'bg-[rgba(170,70,170,0.3)] border border-[rgba(170,70,170,0.5)]'
                                  : 'bg-[rgba(80,160,170,0.2)] border border-[rgb(80,160,170)]/10 hover:border-[rgb(80,160,170)]/30'
                              }`}
                            >
                              <span className="text-xl">{cat.icon}</span>
                              <p className="font-medium text-sm mt-1">{cat.title}</p>
                            </button>
                          ))}
                        </div>

                        <p className="text-sm text-white/50">
                          Selected: {selectedRisks.length} of 2 minimum
                        </p>

                        {canComplete(0) && !isCompleted && (
                          <Button
                            onClick={() => completeStep(0)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] w-full"
                          >
                            Play <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Activity 1: Safe Answer Formulas */}
                    {index === 1 && (
                      <div className="space-y-4">
                        <p className="text-white/70 text-sm">
                          Study at least 3 safe answer formulas. Click each card to mark as studied.
                        </p>

                        {RISK_CATEGORIES.map((cat) => (
                          <Card 
                            key={cat.id}
                            className={`rounded-[2px] border cursor-pointer transition-all ${
                              studiedFormulas.includes(cat.id)
                                ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]'
                                : 'bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 hover:border-[rgb(80,160,170)]/30'
                            }`}
                            onClick={() => {
                              if (!studiedFormulas.includes(cat.id)) {
                                setStudiedFormulas([...studiedFormulas, cat.id])
                              }
                            }}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{cat.icon}</span>
                                  <h4 className="font-semibold">{cat.title}</h4>
                                </div>
                                {studiedFormulas.includes(cat.id) && (
                                  <CheckCircle2 className="w-5 h-5 text-[rgb(200,130,200)]" />
                                )}
                              </div>

                              <div className="space-y-3 mt-3">
                                <div className="bg-red-500/10 p-2 rounded">
                                  <p className="text-xs text-red-400 mb-1">Dangerous Answer:</p>
                                  <p className="text-sm text-white/70 italic">{cat.dangerAnswer}</p>
                                </div>

                                <div className="bg-[rgba(80,160,170,0.1)] p-2 rounded">
                                  <p className="text-xs text-[rgb(80,160,170)] mb-1">Safe Formula:</p>
                                  <p className="text-sm text-white/80">{cat.safeFormula}</p>
                                </div>

                                <div className="bg-[rgba(170,70,170,0.1)] p-2 rounded">
                                  <p className="text-xs text-[rgb(200,130,200)] mb-1">Example Answer:</p>
                                  <p className="text-sm text-white/70 italic">{cat.safeExample}</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}

                        <p className="text-sm text-white/50">
                          Studied: {studiedFormulas.length} of 3 minimum
                        </p>

                        {canComplete(1) && !isCompleted && (
                          <Button
                            onClick={() => completeStep(1)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] w-full"
                          >
                            Play <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Activity 2: Red Flags */}
                    {index === 2 && (
                      <div className="space-y-4">
                        <Card className="rounded-[2px] bg-red-500/10 border-red-500/30 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <h4 className="font-semibold text-red-400">Red Flag Phrases to NEVER Say</h4>
                          </div>
                          <p className="text-sm text-white/70">
                            These phrases immediately raise concerns for interviewers. Memorize them so you never accidentally use them.
                          </p>
                        </Card>

                        <div className="space-y-2">
                          {RED_FLAGS.map((flag, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-[rgba(80,160,170,0.2)] rounded">
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-white font-medium">{flag.bad}</p>
                                <p className="text-sm text-white/60">{flag.why}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <label className="flex items-center gap-3 p-3 bg-[rgba(80,160,170,0.2)] rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={acknowledgedFlags}
                            onChange={(e) => setAcknowledgedFlags(e.target.checked)}
                            className="w-5 h-5 rounded accent-[rgb(170,70,170)]"
                          />
                          <span>I commit to avoiding these red flag phrases in my interviews</span>
                        </label>

                        {canComplete(2) && !isCompleted && (
                          <Button
                            onClick={() => completeStep(2)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] w-full"
                          >
                            Play <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Activity 3: Build Safe Answers */}
                    {index === 3 && (
                      <div className="space-y-4">
                        <p className="text-white/70 text-sm">
                          Write safe answers for at least 2 of your risk areas. Use the formulas you learned.
                        </p>

                        {selectedRisks.map((riskId) => {
                          const risk = RISK_CATEGORIES.find(r => r.id === riskId)
                          if (!risk) return null
                          return (
                            <Card key={riskId} className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{risk.icon}</span>
                                <h4 className="font-medium">{risk.title}</h4>
                              </div>
                              <p className="text-xs text-[rgb(80,160,170)] mb-2">Formula: {risk.safeFormula}</p>
                              <Textarea
                                placeholder={`Write your safe answer for ${risk.title.toLowerCase()}...`}
                                value={safeAnswers[riskId] || ''}
                                onChange={(e) => setSafeAnswers({...safeAnswers, [riskId]: e.target.value})}
                                className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/20 min-h-[100px] text-white"
                              />
                              {(safeAnswers[riskId]?.length || 0) > 50 && (
                                <p className="text-xs text-[rgb(200,130,200)] mt-2 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" /> Good answer prepared
                                </p>
                              )}
                            </Card>
                          )
                        })}

                        {selectedRisks.length === 0 && (
                          <p className="text-white/50 text-sm">Completar Actividad 1 to select your risk areas first.</p>
                        )}

                        <p className="text-sm text-white/50">
                          Completed: {Object.values(safeAnswers).filter(a => a.length > 50).length} of 2 minimum
                        </p>

                        {canComplete(3) && !isCompleted && (
                          <Button
                            onClick={() => completeStep(3)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] w-full"
                          >
                            Play to Pressure Drill <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Activity 4: Mini Pressure Drill */}
                    {index === 4 && (
                      <div className="space-y-4">
                        {!drillComenzared ? (
                          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-6 text-center">
                            <Mic className="w-12 h-12 text-[rgb(170,70,170)] mx-auto mb-4" />
                            <h4 className="text-lg font-semibold mb-2">Mini Pressure Drill</h4>
                            <p className="text-white/70 text-sm mb-4">
                              Answer 3 difficult questions. This simulates interview pressure. 
                              Write your answers quickly—don&apos;t overthink!
                            </p>
                            <Button
                              onClick={() => setDrillComenzared(true)}
                              className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
                            >
                              Comenzar Drill <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/60">
                                Question {currentDrillQuestion + 1} of {PRESSURE_DRILL_PREGUNTAS.length}
                              </span>
                              <Badge className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)]">
                                Target: {PRESSURE_DRILL_PREGUNTAS[currentDrillQuestion].timeLimit}s
                              </Badge>
                            </div>

                            <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
                              <h4 className="text-lg font-semibold mb-3">
                                {PRESSURE_DRILL_PREGUNTAS[currentDrillQuestion].question}
                              </h4>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {PRESSURE_DRILL_PREGUNTAS[currentDrillQuestion].tips.map((tip, i) => (
                                  <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
                                    {tip}
                                  </span>
                                ))}
                              </div>
                              <Textarea
                                placeholder="Type your answer quickly..."
                                value={drillAnswers[currentDrillQuestion] || ''}
                                onChange={(e) => setDrillAnswers({...drillAnswers, [currentDrillQuestion]: e.target.value})}
                                className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/20 min-h-[120px] text-white"
                              />
                            </Card>

                            <div className="flex gap-2">
                              {currentDrillQuestion > 0 && (
                                <Button
                                  variant="outline"
                                  onClick={() => setCurrentDrillQuestion(currentDrillQuestion - 1)}
                                  className="border-[rgb(80,160,170)]/20"
                                >
                                  <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                                </Button>
                              )}
                              {currentDrillQuestion < PRESSURE_DRILL_PREGUNTAS.length - 1 ? (
                                <Button
                                  onClick={() => setCurrentDrillQuestion(currentDrillQuestion + 1)}
                                  className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] flex-1"
                                  disabled={!drillAnswers[currentDrillQuestion] || drillAnswers[currentDrillQuestion].length < 30}
                                >
                                  Siguiente Question <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              ) : (
                                canComplete(4) && !isCompleted && (
                                  <Button
                                    onClick={() => completeStep(4)}
                                    className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] flex-1"
                                  >
                                    Completar Ejercicio <CheckCircle className="w-4 h-4 ml-2" />
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Complete Module */}
        {completedSteps.length === ACTIVITIES.length && (
          <Card className="rounded-[2px] bg-gradient-to-r from-[rgba(170,70,170,0.2)] to-[rgba(80,160,170,0.2)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <Shield className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Risk Lab Complete!</h3>
            <p className="text-white/70">
              You&apos;ve mastered handling difficult questions. Time for your final challenge: 
              the Misión de Entrevista Básica!
            </p>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Complete & Earn {MODULE_XP} XP <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
