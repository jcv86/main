'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, MessageSquare, Lightbulb, 
  ChevronDown, ChevronUp, Clock, Target, Sparkles, Timer
} from 'lucide-react'

const MODULE_XP = 120

// Answer templates with guidance
const ANSWER_TYPES = [
  {
    id: 'self-intro',
    title: 'Build 30-second Self-Introduction',
    subtitle: '"Tell me about yourself"',
    formula: 'I am a [title] with [X years] experience in [field]. My strongest areas are [2-3 skills]. I am looking for [goal] because [motivation].',
    timeTarget: '30 seconds (~75 words)',
    tips: [
      'Comenzar with your professional identity, not personal details',
      'Include only relevant experience for this role',
      'End with why you are interested in this opportunity',
      'Practice until you can say it naturally'
    ],
    badExample: 'Hi, my name is Juan. I studied at university and then worked at different companies. I like technology and working with people. I think I would be good for this job.',
    goodExample: 'I am an Operations Coordinator with 4 years of experience in fintech companies. My strongest areas are cross-functional project management and process optimization. I am looking for a senior operations role because I want to lead larger initiatives and drive measurable impact at scale.',
    wordCount: { min: 50, max: 100 }
  },
  {
    id: 'motivation',
    title: 'Build Motivation Answer',
    subtitle: '"Why do you want to work here?"',
    formula: 'I am excited about [company/role] because [specific reason 1]. I noticed [something specific about company]. This connects to my goal of [career goal].',
    timeTarget: '45 seconds (~100 words)',
    tips: [
      'Research the company before answering',
      'Be specific - mention products, values, or recent news',
      'Connect company to your career goals',
      'Show genuine enthusiasm without being generic'
    ],
    badExample: 'I want to work here because it is a good company and I need a job. I think I can grow here and learn new things.',
    goodExample: 'I am excited about TechComenzar because you are solving real problems in fintech accessibility. I noticed your recent expansion into Latin America aligns perfectly with my experience in regional operations. This connects to my goal of leading operations at a company making financial services more inclusive.',
    wordCount: { min: 60, max: 120 }
  },
  {
    id: 'strengths',
    title: 'Build Strengths Answer',
    subtitle: '"What are your greatest strengths?"',
    formula: 'My greatest strength is [strength]. For example, [specific situation where you demonstrated it]. This resulted in [measurable outcome].',
    timeTarget: '45 seconds (~100 words)',
    tips: [
      'Choose a strength relevant to the job',
      'Support with a concrete example',
      'Include a measurable result if possible',
      'Keep it to 1-2 strengths, not a long list'
    ],
    badExample: 'I am very responsible, organized, and a team player. I always do my best work and people can count on me.',
    goodExample: 'My greatest strength is process optimization. For example, at my previous company I identified that our vendor onboarding took 3 weeks. I redesigned the workflow and created templates that reduced it to 5 days. This resulted in faster project starts and saved approximately $15K annually.',
    wordCount: { min: 60, max: 120 }
  },
  {
    id: 'challenge',
    title: 'Build Challenge Answer (STAR)',
    subtitle: '"Tell me about a difficult situation"',
    formula: 'Situation: [context]. Task: [your responsibility]. Action: [what you did]. Result: [outcome with numbers if possible].',
    timeTarget: '60 seconds (~150 words)',
    tips: [
      'Choose a real challenge with a positive outcome',
      'Focus on YOUR actions, not the team',
      'Include specific details and numbers',
      'Show what you learned'
    ],
    badExample: 'Once we had a problem with a client and I helped fix it. It was difficult but we managed to solve it in the end.',
    goodExample: 'Situation: A key vendor missed a critical delivery, putting our product launch at risk. Task: As Operations Lead, I needed to find an alternative in 48 hours. Action: I contacted three backup vendors, negotiated expedited terms, and coordinated with our team to adjust the timeline. Result: We launched on schedule and the backup vendor became our primary partner, reducing costs by 20%.',
    wordCount: { min: 100, max: 180 }
  },
  {
    id: 'hire',
    title: 'Build "Why Should We Hire You?"',
    subtitle: 'Your closing argument',
    formula: 'You should hire me because I bring [unique combination]. I have already [relevant achievement]. I can [specific value for this role].',
    timeTarget: '30-45 seconds (~90 words)',
    tips: [
      'Summarize your unique value proposition',
      'Reference requirements from the job posting',
      'Be confident without being arrogant',
      'End with forward-looking contribution'
    ],
    badExample: 'I am a hard worker and I really want this job. I will do my best and I am sure I can learn quickly.',
    goodExample: 'You should hire me because I bring a unique combination of operations expertise and startup agility. I have already reduced process time by 40% at my current company. I can immediately contribute to your vendor management and cross-functional coordination needs while bringing fresh perspectives to scale your operations.',
    wordCount: { min: 60, max: 110 }
  },
  {
    id: 'timing',
    title: 'Practice Answer Timing',
    subtitle: 'Master the 30-45-60 second formats',
    formula: 'Same core message at different depths: headline → details → full story',
    timeTarget: 'Variable',
    tips: [
      '30 seconds: Core message + one key point',
      '45 seconds: Core message + supporting detail',
      '60 seconds: Full structured answer with example',
      'Practice with a timer until it feels natural'
    ],
    variations: [
      { seconds: 30, words: '~75 words', focus: 'Headline version - just the key point' },
      { seconds: 45, words: '~100 words', focus: 'Standard version - point + brief example' },
      { seconds: 60, words: '~150 words', focus: 'Full version - complete STAR story' }
    ]
  }
]

export default function AnswerArchitectureModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>('self-intro')
  
  // Answer data
  const [answers, setAnswers] = useState<Record<string, string>>({
    'self-intro': '',
    'motivation': '',
    'strengths': '',
    'challenge': '',
    'hire': '',
    'timing-30': '',
    'timing-45': '',
    'timing-60': ''
  })
  
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({})
  const [activeTimer, setActiveTimer] = useState<number | null>(null)

  const progress = Math.round((completedSteps.length / ANSWER_TYPES.length) * 100)

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < ANSWER_TYPES.length - 1) {
      setCurrentStep(step + 1)
    }
  }

  const updateAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const toggleExample = (id: string) => {
    setShowExamples(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

  const isAnswerValid = (id: string) => {
    const answerType = ANSWER_TYPES.find(a => a.id === id)
    if (!answerType) return false
    if (id === 'timing') {
      return answers['timing-30'] && answers['timing-45'] && answers['timing-60']
    }
    const wordCount = countWords(answers[id] || '')
    return wordCount >= (answerType.wordCount?.min || 30)
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
          completedActivities: ANSWER_TYPES.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=answer-architecture')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=answer-architecture')
    }
  }

  const startTimer = (seconds: number) => {
    setActiveTimer(seconds)
    setTimeout(() => setActiveTimer(null), seconds * 1000)
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
              <MessageSquare className="w-6 h-6 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Arquitectura de Respuestas</h1>
              <p className="text-white/60">Answer builder • Optional voice practice</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Craft compelling answers to the 5 most common interview questions. 
            Learn to structure your responses for clarity and impact.
          </p>
        </div>

        {/* Key Formulas */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
            <p className="text-[rgb(200,130,200)] text-xs uppercase font-medium mb-2">Self-Introduction Formula</p>
            <p className="text-white/80 text-sm italic">
              &quot;I am a [title] with [X years] in [field]. My strongest areas are [skills]. I am looking for [goal] because [motivation].&quot;
            </p>
          </Card>
          <Card className="rounded-[2px] bg-[rgba(80,160,170,0.1)] border-[rgba(80,160,170,0.3)] p-4">
            <p className="text-[rgb(80,160,170)] text-xs uppercase font-medium mb-2">STAR Formula</p>
            <p className="text-white/80 text-sm italic">
              &quot;Situation: [context]. Task: [responsibility]. Action: [what you did]. Result: [outcome].&quot;
            </p>
          </Card>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Great interview answers follow a structure: <span className="text-[rgb(170,70,170)] font-semibold">Lead with the point</span>, 
                support with a <span className="text-[rgb(170,70,170)] font-semibold">specific example</span>, 
                connect to the <span className="text-[rgb(170,70,170)] font-semibold">role</span>, 
                and end <span className="text-[rgb(170,70,170)] font-semibold">clearly</span>.
              </p>
            </div>
          </div>
        </Card>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-white/50 text-sm mt-2">{completedSteps.length} of {ANSWER_TYPES.length} answers built</p>
        </Card>

        {/* Answer Building Activities */}
        {ANSWER_TYPES.map((answerType, index) => (
          <Card 
            key={answerType.id}
            className={`rounded-[2px] p-6 transition-all ${
              completedSteps.includes(index) 
                ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
                : currentStep === index 
                  ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
                  : 'bg-white/5 border-white/10'
            }`}
          >
            <button 
              onClick={() => setExpandedSection(expandedSection === answerType.id ? null : answerType.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
                }`}>
                  {completedSteps.includes(index) ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{answerType.title}</h3>
                  <p className="text-white/50 text-sm">{answerType.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/10 text-white/60 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {answerType.timeTarget}
                </Badge>
                {expandedSection === answerType.id ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
              </div>
            </button>
            
            {expandedSection === answerType.id && (
              <div className="mt-6 space-y-4">
                {/* Formula */}
                <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-3">
                  <p className="text-[rgb(170,70,170)] text-xs uppercase font-medium mb-1">Formula</p>
                  <p className="text-white/80 text-sm">{answerType.formula}</p>
                </div>
                
                {/* Tips */}
                <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-3">
                  <p className="text-[rgb(80,160,170)] text-xs uppercase font-medium mb-2">Tips</p>
                  <ul className="text-white/60 text-sm space-y-1">
                    {answerType.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[rgb(80,160,170)]">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Show example toggle */}
                {answerType.badExample && (
                  <button 
                    onClick={() => toggleExample(answerType.id)}
                    className="text-[rgb(170,70,170)] text-sm flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-4 h-4" />
                    {showExamples[answerType.id] ? 'Hide examples' : 'Show good vs bad examples'}
                  </button>
                )}
                
                {/* Examples */}
                {showExamples[answerType.id] && answerType.badExample && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 text-xs uppercase font-medium mb-1">Weak Answer</p>
                      <p className="text-white/60 text-sm italic">{answerType.badExample}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-400 text-xs uppercase font-medium mb-1">Strong Answer</p>
                      <p className="text-white/70 text-sm italic">{answerType.goodExample}</p>
                    </div>
                  </div>
                )}
                
                {/* Timing variations for the last exercise */}
                {answerType.id === 'timing' ? (
                  <div className="space-y-4">
                    <p className="text-white/70 text-sm">
                      Take one of your previous answers and practice delivering it at different lengths:
                    </p>
                    {answerType.variations?.map((variation) => (
                      <div key={variation.seconds} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)]">
                              {variation.seconds}s
                            </Badge>
                            <span className="text-white/50 text-sm">{variation.words}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startTimer(variation.seconds)}
                            className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]"
                          >
                            <Timer className="w-4 h-4 mr-1" />
                            Comenzar Timer
                          </Button>
                        </div>
                        <p className="text-white/50 text-xs">{variation.focus}</p>
                        <textarea
                          value={answers[`timing-${variation.seconds}`]}
                          onChange={(e) => updateAnswer(`timing-${variation.seconds}`, e.target.value)}
                          placeholder={`Write your ${variation.seconds}-second version...`}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30 min-h-20"
                        />
                      </div>
                    ))}
                    {activeTimer && (
                      <div className="fixed bottom-4 right-4 bg-[rgb(170,70,170)] text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                        Timer running: {activeTimer}s
                      </div>
                    )}
                  </div>
                ) : (
                  /* Regular answer input */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white/70 text-sm">Your Answer</label>
                      <span className={`text-sm ${
                        countWords(answers[answerType.id] || '') >= (answerType.wordCount?.min || 30)
                          ? 'text-green-400' : 'text-white/50'
                      }`}>
                        {countWords(answers[answerType.id] || '')} words 
                        {answerType.wordCount && ` (${answerType.wordCount.min}-${answerType.wordCount.max})`}
                      </span>
                    </div>
                    <textarea
                      value={answers[answerType.id]}
                      onChange={(e) => updateAnswer(answerType.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30 min-h-32"
                    />
                  </div>
                )}
                
                <Button 
                  onClick={() => completeStep(index)}
                  disabled={!isAnswerValid(answerType.id)}
                  className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                >
                  {index === ANSWER_TYPES.length - 1 ? 'Complete All Answers' : 'Save & Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </Card>
        ))}

        {/* Complete Module */}
        {completedSteps.length === ANSWER_TYPES.length && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <Target className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Arquitectura de Respuestas Complete!</h3>
            <p className="text-white/70">
              You&apos;ve built {ANSWER_TYPES.length} structured interview answers. Earned {MODULE_XP} XP!
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-left">
              <p className="text-white/70 text-sm mb-2">Your answer bank is ready for:</p>
              <ul className="space-y-1">
                <li className="text-[rgb(80,160,170)] text-sm">• Sala de Práctica del Coach - practice with feedback</li>
                <li className="text-[rgb(80,160,170)] text-sm">• Gimnasio de Comunicación - refine delivery</li>
                <li className="text-[rgb(80,160,170)] text-sm">• Primera Simulación con Reclutador - put it all together</li>
              </ul>
            </div>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Continue to Sala de Práctica del Coach
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
