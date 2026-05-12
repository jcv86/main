'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progreso } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Users, Lightbulb, RefreshCw,
  ChevronDown, ChevronUp, MessageCircle, ThumbsUp, AlertCircle, 
  Sparkles, Eye, RotateCcw, Save
} from 'lucide-react'

const MODULE_XP = 130

// Practice questions with Retroalimentación del coach de IA patterns
const PRACTICE_SESSIONS = [
  {
    id: 'intro',
    question: 'Tell me about yourself',
    coachPrompt: 'Let me hear your self-introduction. Remember: professional identity, key skills, and why you are here.',
    feedbackCriteria: [
      { id: 'structure', label: 'Clear structure', description: 'Follows intro formula' },
      { id: 'relevance', label: 'Role relevance', description: 'Connected to target position' },
      { id: 'length', label: 'Appropriate length', description: '30-45 seconds (~75-100 words)' },
      { id: 'specificity', label: 'Specific details', description: 'Not generic statements' }
    ],
    commonIssues: [
      'Too personal (started with name, age, or hobbies)',
      'Too long (over 60 seconds)',
      'Too vague (no specific skills mentioned)',
      'Missing career goal or motivation'
    ],
    improvementTips: [
      'Comenzar with your professional title',
      'Include 2-3 specific skills relevant to the role',
      'End with why this opportunity excites you'
    ]
  },
  {
    id: 'motivation',
    question: 'Why do you want to work here?',
    coachPrompt: 'Show me you have researched this company. What specifically attracts you?',
    feedbackCriteria: [
      { id: 'research', label: 'Company knowledge', description: 'Shows specific research' },
      { id: 'connection', label: 'Personal connection', description: 'Links to your goals' },
      { id: 'authentic', label: 'Authentic interest', description: 'Not generic flattery' },
      { id: 'forward', label: 'Forward-looking', description: 'What you will contribute' }
    ],
    commonIssues: [
      'Generic praise ("great company", "good culture")',
      'Focused only on what you will gain',
      'No specific mention of company products/values',
      'Could apply to any company'
    ],
    improvementTips: [
      'Mention something specific about the company',
      'Connect company mission to your personal goals',
      'Show what you will bring, not just what you will take'
    ]
  },
  {
    id: 'challenge',
    question: 'Tell me about a challenging situation you overcame',
    coachPrompt: 'Use STAR format. Be specific about YOUR actions and the measurable result.',
    feedbackCriteria: [
      { id: 'situation', label: 'Clear situation', description: 'Context is understandable' },
      { id: 'actions', label: 'Your actions', description: 'Focus on what YOU did' },
      { id: 'result', label: 'Measurable result', description: 'Includes numbers or impact' },
      { id: 'learning', label: 'Shows learning', description: 'What you gained from it' }
    ],
    commonIssues: [
      'Focused on team, not your contribution',
      'Vague result ("it went well")',
      'Story too long or complicated',
      'Missing the challenge - only shared success'
    ],
    improvementTips: [
      'Comenzar with the challenge/problem clearly',
      'Use "I" not "we" for your actions',
      'Include a specific number or metric in the result'
    ]
  }
]

// Simulated AI feedback generator
const generateFeedback = (answer: string, session: typeof PRACTICE_SESSIONS[0]) => {
  const wordCount = answer.trim().split(/\s+/).length
  const hasNumbers = /\d+/.test(answer)
  const usesI = (answer.match(/\bI\b/gi) || []).length
  const usesWe = (answer.match(/\bwe\b/gi) || []).length
  
  const feedback = {
    scores: session.feedbackCriteria.map(criteria => ({
      ...criteria,
      score: Math.random() > 0.3 ? 'good' : Math.random() > 0.5 ? 'needs-work' : 'missing'
    })),
    issues: [] as string[],
    strengths: [] as string[],
    suggestion: ''
  }
  
  // Check word count
  if (wordCount < 40) {
    feedback.issues.push('Answer is too short - add more detail')
  } else if (wordCount > 150) {
    feedback.issues.push('Answer is too long - focus on key points')
  } else {
    feedback.strengths.push('Good answer length')
  }
  
  // Check for specificity
  if (hasNumbers) {
    feedback.strengths.push('Includes specific numbers/metrics')
  } else {
    feedback.issues.push('Add specific numbers or metrics for impact')
  }
  
  // Check pronoun usage for STAR
  if (session.id === 'challenge') {
    if (usesI > usesWe) {
      feedback.strengths.push('Good focus on your personal contributions')
    } else if (usesWe > usesI) {
      feedback.issues.push('Too focused on "we" - highlight YOUR actions with "I"')
    }
  }
  
  // Add random applicable issues
  const randomIssue = session.commonIssues[Math.floor(Math.random() * session.commonIssues.length)]
  if (feedback.issues.length < 2 && Math.random() > 0.5) {
    feedback.issues.push(randomIssue)
  }
  
  // Generate suggestion
  const randomTip = session.improvementTips[Math.floor(Math.random() * session.improvementTips.length)]
  feedback.suggestion = randomTip
  
  return feedback
}

export default function CoachPracticeRoomModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>('intro')
  
  // Practice state
  const [answers, setAnswers] = useState<Record<string, { original: string; improved: string }>>({})
  const [feedback, setFeedback] = useState<Record<string, ReturnType<typeof generateFeedback>>>({})
  const [showingFeedback, setShowingFeedback] = useState<Record<string, boolean>>({})
  const [iterations, setIterations] = useState<Record<string, number>>({})

  const progress = Math.round((completedSteps.length / PRACTICE_SESSIONS.length) * 100)

  const submitAnswer = (sessionId: string, answer: string, isImproved: boolean = false) => {
    setAnswers(prev => ({
      ...prev,
      [sessionId]: isImproved 
        ? { ...prev[sessionId], improved: answer }
        : { original: answer, improved: '' }
    }))
    
    const session = PRACTICE_SESSIONS.find(s => s.id === sessionId)
    if (session) {
      const newFeedback = generateFeedback(answer, session)
      setFeedback(prev => ({ ...prev, [sessionId]: newFeedback }))
      setShowingFeedback(prev => ({ ...prev, [sessionId]: true }))
      setIterations(prev => ({ ...prev, [sessionId]: (prev[sessionId] || 0) + 1 }))
    }
  }

  const completeSession = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index])
    }
    if (index < PRACTICE_SESSIONS.length - 1) {
      setCurrentStep(index + 1)
      setExpandedSection(PRACTICE_SESSIONS[index + 1].id)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'coach-practice-room', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: PRACTICE_SESSIONS.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=coach-practice-room')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=coach-practice-room')
    }
  }

  const canComplete = (sessionId: string) => {
    return answers[sessionId]?.improved || (iterations[sessionId] || 0) >= 2
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
            Module 6 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <Users className="w-6 h-6 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sala de Práctica del Coach</h1>
              <p className="text-white/60">Practice with feedback • Improve through iteration</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Practice your interview answers with structured feedback. 
            The goal is improvement, not perfection. Iterate until your answers feel natural.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Practice is not performance. The goal is to <span className="text-[rgb(170,70,170)]">notice what is unclear</span>, 
                too long, weak, or missing evidence. Each iteration makes your answer stronger.
                <span className="text-[rgb(170,70,170)]"> Repetition builds confidence.</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Practice Flow */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-3">Practice Loop</p>
          <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] px-3 py-1 rounded-full">1. Answer</span>
            <ArrowRight className="w-4 h-4 text-white/30" />
            <span className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)] px-3 py-1 rounded-full">2. Feedback</span>
            <ArrowRight className="w-4 h-4 text-white/30" />
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] px-3 py-1 rounded-full">3. Improve</span>
            <RefreshCw className="w-4 h-4 text-white/30" />
          </div>
        </Card>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progreso value={progress} className="h-2 bg-white/10" />
          <p className="text-white/50 text-sm mt-2">{completedSteps.length} of {PRACTICE_SESSIONS.length} practice sessions completed</p>
        </Card>

        {/* Practice Sessions */}
        {PRACTICE_SESSIONS.map((session, index) => (
          <Card 
            key={session.id}
            className={`rounded-[2px] p-6 transition-all ${
              completedSteps.includes(index) 
                ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
                : currentStep === index 
                  ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
                  : 'bg-white/5 border-white/10'
            }`}
          >
            <button 
              onClick={() => setExpandedSection(expandedSection === session.id ? null : session.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
                }`}>
                  {completedSteps.includes(index) ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{session.question}</h3>
                  <p className="text-white/50 text-sm">
                    {iterations[session.id] ? `${iterations[session.id]} attempt(s)` : 'Not started'}
                  </p>
                </div>
              </div>
              {expandedSection === session.id ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
            </button>
            
            {expandedSection === session.id && (
              <div className="mt-6 space-y-4">
                {/* Coach prompt */}
                <div className="flex items-start gap-3 bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-4">
                  <MessageCircle className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
                  <div>
                    <p className="text-[rgb(170,70,170)] text-xs uppercase font-medium">Coach</p>
                    <p className="text-white/80 text-sm mt-1">{session.coachPrompt}</p>
                  </div>
                </div>
                
                {/* Criteria to hit */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {session.feedbackCriteria.map((criteria) => {
                    const score = feedback[session.id]?.scores.find(s => s.id === criteria.id)?.score
                    return (
                      <div 
                        key={criteria.id}
                        className={`p-2 rounded-lg text-center ${
                          score === 'good' ? 'bg-green-500/20 border border-green-500/30' :
                          score === 'needs-work' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                          score === 'missing' ? 'bg-red-500/20 border border-red-500/30' :
                          'bg-white/5 border border-white/10'
                        }`}
                      >
                        <p className="text-white text-xs font-medium">{criteria.label}</p>
                        <p className="text-white/50 text-xs">{criteria.description}</p>
                      </div>
                    )
                  })}
                </div>
                
                {/* Answer input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 text-sm">Your Answer</label>
                    {iterations[session.id] > 0 && (
                      <Badge className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)]">
                        Attempt {iterations[session.id]}
                      </Badge>
                    )}
                  </div>
                  <textarea
                    value={showingFeedback[session.id] ? (answers[session.id]?.improved || answers[session.id]?.original || '') : (answers[session.id]?.original || '')}
                    onChange={(e) => {
                      if (showingFeedback[session.id]) {
                        setAnswers(prev => ({
                          ...prev,
                          [session.id]: { ...prev[session.id], improved: e.target.value }
                        }))
                      } else {
                        setAnswers(prev => ({
                          ...prev,
                          [session.id]: { original: e.target.value, improved: '' }
                        }))
                      }
                    }}
                    placeholder="Write your answer here..."
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder:text-white/30 min-h-32"
                  />
                </div>
                
                {/* Feedback display */}
                {showingFeedback[session.id] && feedback[session.id] && (
                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[rgb(170,70,170)]" />
                      Coach Feedback
                    </p>
                    
                    {/* Strengths */}
                    {feedback[session.id].strengths.length > 0 && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-green-400 text-xs uppercase font-medium mb-2 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Strengths
                        </p>
                        <ul className="space-y-1">
                          {feedback[session.id].strengths.map((s, i) => (
                            <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                              <span className="text-green-400">+</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Issues */}
                    {feedback[session.id].issues.length > 0 && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-400 text-xs uppercase font-medium mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Areas to Improve
                        </p>
                        <ul className="space-y-1">
                          {feedback[session.id].issues.map((issue, i) => (
                            <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                              <span className="text-yellow-400">!</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Suggestion */}
                    <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-3">
                      <p className="text-[rgb(170,70,170)] text-xs uppercase font-medium mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Suggestion
                      </p>
                      <p className="text-white/70 text-sm">{feedback[session.id].suggestion}</p>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  {!showingFeedback[session.id] ? (
                    <Button 
                      onClick={() => submitAnswer(session.id, answers[session.id]?.original || '')}
                      disabled={!answers[session.id]?.original || answers[session.id]?.original.length < 30}
                      className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                    >
                      Get Feedback
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowingFeedback(prev => ({ ...prev, [session.id]: false }))
                          setAnswers(prev => ({
                            ...prev,
                            [session.id]: { original: '', improved: '' }
                          }))
                        }}
                        className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Comenzar Over
                      </Button>
                      <Button 
                        onClick={() => submitAnswer(session.id, answers[session.id]?.improved || answers[session.id]?.original || '', true)}
                        disabled={!(answers[session.id]?.improved) || answers[session.id]?.improved === answers[session.id]?.original}
                        className="rounded-[20px] bg-[rgba(80,160,170,1)] hover:bg-[rgba(80,160,170,0.8)] disabled:opacity-50"
                      >
                        Resubmit Improved Answer
                        <RefreshCw className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                  
                  {canComplete(session.id) && (
                    <Button 
                      onClick={() => completeSession(index)}
                      className="rounded-[20px] bg-green-600 hover:bg-green-700 ml-auto"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Continue
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}

        {/* Complete Module */}
        {completedSteps.length === PRACTICE_SESSIONS.length && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Coach Practice Complete!</h3>
            <p className="text-white/70">
              You&apos;ve practiced {PRACTICE_SESSIONS.length} key questions with feedback. Earned {MODULE_XP} XP!
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-left">
              <p className="text-white/70 text-sm mb-2">Total practice iterations:</p>
              <div className="flex gap-4">
                {PRACTICE_SESSIONS.map(session => (
                  <div key={session.id} className="text-center">
                    <p className="text-[rgb(170,70,170)] text-xl font-bold">{iterations[session.id] || 0}</p>
                    <p className="text-white/50 text-xs">{session.question.split(' ').slice(0, 3).join(' ')}...</p>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Continue to Gimnasio de Comunicación
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
