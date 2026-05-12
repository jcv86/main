'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Search, Lightbulb, 
  ChevronDown, ChevronUp, Target, AlertTriangle, HelpCircle,
  CheckSquare, XSquare, Star, FileQuestion
} from 'lucide-react'

const MODULE_XP = 100

// Sample job posting for practice
const SAMPLE_JOB_POSTING = {
  title: 'Operations Coordinator',
  company: 'TechComenzar Inc.',
  description: `We are looking for a detail-oriented Operations Coordinator to join our growing team.

Responsibilities:
• Coordinate cross-functional projects and ensure timely delivery
• Manage vendor relationships and negotiate contracts
• Track KPIs and prepare weekly reports for leadership
• Support HR with onboarding processes
• Optimize internal workflows and documentation

Requirements:
• 2-4 years of experience in operations or project coordination
• Bachelor's degree in Business Administration or related field
• Advanced Excel skills (pivot tables, VLOOKUP, macros)
• Experience with project management tools (Asana, Monday, Trello)
• Strong communication skills in English (written and verbal)
• Ability to work in a fast-paced environment

Nice to have:
• Experience in tech or startup environment
• Knowledge of Lean/Six Sigma methodologies
• SQL basics for data extraction
• Bilingual (Spanish/English)

Benefits:
• Competitive salary + performance bonus
• Remote-first culture
• Professional development budget
• Health insurance`
}

// Requirement categories with weights
const REQUIREMENT_TYPES = [
  {
    id: 'must-have',
    name: 'Must-Have',
    icon: CheckSquare,
    color: 'rgb(170,70,170)',
    description: 'Non-negotiable requirements that filter candidates out',
    indicators: ['Required', 'Must have', 'years of experience', 'degree', 'certification']
  },
  {
    id: 'nice-to-have',
    name: 'Nice-to-Have',
    icon: Star,
    color: 'rgb(80,160,170)',
    description: 'Preferred but not essential - gives you an edge',
    indicators: ['Preferred', 'Nice to have', 'Plus', 'Bonus', 'Ideally']
  },
  {
    id: 'hidden',
    name: 'Hidden Requirements',
    icon: HelpCircle,
    color: 'rgb(200,130,200)',
    description: 'Not stated but implied by the role or company culture',
    indicators: ['fast-paced', 'startup', 'team player', 'self-starter', 'flexible']
  }
]

// Common interview question patterns by requirement type
const QUESTION_PATTERNS = [
  {
    requirement: 'Cross-functional coordination',
    questions: [
      'Tell me about a time you coordinated a project across multiple teams',
      'How do you handle conflicting priorities from different stakeholders?',
      'Describe a situation where you had to align different departments'
    ]
  },
  {
    requirement: 'Vendor management',
    questions: [
      'How do you evaluate and select vendors?',
      'Tell me about a difficult negotiation with a vendor',
      'How do you maintain vendor relationships while meeting budget constraints?'
    ]
  },
  {
    requirement: 'Data/Reporting',
    questions: [
      'What KPIs have you tracked in previous roles?',
      'How do you present data insights to non-technical stakeholders?',
      'Describe your experience with Excel for data analysis'
    ]
  },
  {
    requirement: 'Communication',
    questions: [
      'Give an example of how you communicated a complex issue to leadership',
      'How do you adapt your communication style for different audiences?',
      'Tell me about a time you had to deliver difficult news'
    ]
  },
  {
    requirement: 'Problem-solving',
    questions: [
      'Describe a time you identified and solved an operational inefficiency',
      'How do you approach process improvement?',
      'Tell me about a time you had to make a decision with incomplete information'
    ]
  }
]

export default function JobDecoderModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>('paste')
  
  // Job analysis data
  const [jobData, setJobData] = useState({
    jobPosting: '',
    usingSample: false,
    identifiedRequirements: [] as { text: string; type: string }[],
    matchMap: [] as { requirement: string; match: 'strong' | 'partial' | 'gap'; evidence: string }[],
    generatedQuestions: [] as string[],
    selectedQuestions: [] as string[]
  })

  const REQUIRED_ACTIVITIES = [
    'Pegar oferta de trabajo or use sample',
    'Identify 5+ key requirements',
    'Categorize: Must-have vs Nice-to-have',
    'Create your match map',
    'Generate likely interview questions'
  ]

  const progress = Math.round((completedSteps.length / REQUIRED_ACTIVITIES.length) * 100)

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < REQUIRED_ACTIVITIES.length - 1) {
      setCurrentStep(step + 1)
    }
  }

  const useSamplePosting = () => {
    setJobData(prev => ({
      ...prev,
      jobPosting: `${SAMPLE_JOB_POSTING.title} at ${SAMPLE_JOB_POSTING.company}\n\n${SAMPLE_JOB_POSTING.description}`,
      usingSample: true
    }))
  }

  const addRequirement = (text: string, type: string) => {
    if (text && !jobData.identifiedRequirements.find(r => r.text === text)) {
      setJobData(prev => ({
        ...prev,
        identifiedRequirements: [...prev.identifiedRequirements, { text, type }]
      }))
    }
  }

  const removeRequirement = (text: string) => {
    setJobData(prev => ({
      ...prev,
      identifiedRequirements: prev.identifiedRequirements.filter(r => r.text !== text)
    }))
  }

  const updateMatchMap = (requirement: string, match: 'strong' | 'partial' | 'gap', evidence: string) => {
    setJobData(prev => {
      const existing = prev.matchMap.findIndex(m => m.requirement === requirement)
      const newMap = [...prev.matchMap]
      if (existing >= 0) {
        newMap[existing] = { requirement, match, evidence }
      } else {
        newMap.push({ requirement, match, evidence })
      }
      return { ...prev, matchMap: newMap }
    })
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'job-decoder', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: REQUIRED_ACTIVITIES.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=job-decoder')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=job-decoder')
    }
  }

  const isPostingComplete = () => jobData.jobPosting.length >= 100
  const isRequirementsComplete = () => jobData.identifiedRequirements.length >= 5
  const isCategorizedComplete = () => {
    const mustHaves = jobData.identifiedRequirements.filter(r => r.type === 'must-have').length
    const niceToHaves = jobData.identifiedRequirements.filter(r => r.type === 'nice-to-have').length
    return mustHaves >= 2 && niceToHaves >= 1
  }
  const isMatchMapComplete = () => jobData.matchMap.length >= 3
  const isQuestionsComplete = () => jobData.selectedQuestions.length >= 3

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
            Module 4 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <Search className="w-6 h-6 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Decodificador de Ofertas</h1>
              <p className="text-white/60">Vacancy analysis module • Sin entrevista requerida</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Learn to read between the lines of job postings. Identify what companies really need, 
            map your fit, and predict interview questions before they&apos;re asked.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                A job posting is a <span className="text-[rgb(170,70,170)] font-semibold">map to the interview</span>. 
                Every requirement hints at a potential question. Every responsibility suggests what they&apos;ll evaluate. 
                Decoding this map gives you an unfair advantage.
              </p>
            </div>
          </div>
        </Card>

        {/* Requirement Types Guide */}
        <div className="grid md:grid-cols-3 gap-4">
          {REQUIREMENT_TYPES.map((type) => (
            <Card key={type.id} className="rounded-[2px] bg-white/5 border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <type.icon className="w-4 h-4" style={{ color: type.color }} />
                <span className="text-white font-medium text-sm">{type.name}</span>
              </div>
              <p className="text-white/50 text-xs">{type.description}</p>
            </Card>
          ))}
        </div>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-white/50 text-sm mt-2">{completedSteps.length} of {REQUIRED_ACTIVITIES.length} activities completed</p>
        </Card>

        {/* Activity 1: Paste Job Posting */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(0) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 0 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'paste' ? null : 'paste')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(0) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(0) ? <CheckCircle2 className="w-5 h-5" /> : <span>1</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Paste Job Posting</h3>
                <p className="text-white/50 text-sm">Use your own or practice with our sample</p>
              </div>
            </div>
            {expandedSection === 'paste' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'paste' && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={useSamplePosting}
                  className={`border-[rgba(80,160,170,0.3)] text-[rgb(80,160,170)] ${jobData.usingSample ? 'bg-[rgba(80,160,170,0.2)]' : ''}`}
                >
                  Use Sample Job Posting
                </Button>
              </div>
              
              <textarea
                value={jobData.jobPosting}
                onChange={(e) => setJobData(prev => ({ ...prev, jobPosting: e.target.value, usingSample: false }))}
                placeholder="Paste the full job description here..."
                className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder:text-white/30 min-h-48 font-mono text-sm"
              />
              
              <p className="text-white/50 text-xs">{jobData.jobPosting.length} characters (minimum 100)</p>
              
              <Button 
                onClick={() => completeStep(0)}
                disabled={!isPostingComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Analyze This Posting
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 2: Identify Requirements */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(1) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 1 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'identify' ? null : 'identify')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(1) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(1) ? <CheckCircle2 className="w-5 h-5" /> : <span>2</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Identify Key Requirements</h3>
                <p className="text-white/50 text-sm">Extract at least 5 requirements from the posting</p>
              </div>
            </div>
            {expandedSection === 'identify' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'identify' && (
            <div className="mt-6 space-y-4">
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-3">
                <p className="text-[rgb(80,160,170)] text-sm">
                  <strong>How to identify:</strong> Look for skills, experience levels, tools, responsibilities, 
                  and soft skills. Each one is a potential interview topic.
                </p>
              </div>
              
              {/* Quick-add common requirements */}
              <div className="space-y-2">
                <p className="text-white/70 text-sm">Click to add common requirements from this posting:</p>
                <div className="flex flex-wrap gap-2">
                  {['2-4 years experience', 'Excel (advanced)', 'Project coordination', 'Cross-functional work', 
                    'Vendor management', 'KPI tracking', 'Communication skills', 'Fast-paced environment'].map((req) => (
                    <button
                      key={req}
                      onClick={() => addRequirement(req, 'must-have')}
                      disabled={jobData.identifiedRequirements.some(r => r.text === req)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        jobData.identifiedRequirements.some(r => r.text === req)
                          ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border border-[rgba(170,70,170,0.3)]'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {req}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom requirement input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom requirement..."
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addRequirement((e.target as HTMLInputElement).value, 'must-have')
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>
              
              {/* Selected requirements */}
              {jobData.identifiedRequirements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white text-sm font-medium">Your identified requirements ({jobData.identifiedRequirements.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {jobData.identifiedRequirements.map((req, i) => (
                      <span key={i} className="flex items-center gap-1 px-3 py-1 bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] rounded-full text-sm">
                        {req.text}
                        <button onClick={() => removeRequirement(req.text)} className="ml-1 hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => completeStep(1)}
                disabled={!isRequirementsComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Continuar to Categorization
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 3: Categorize Requirements */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(2) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 2 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'categorize' ? null : 'categorize')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(2) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(2) ? <CheckCircle2 className="w-5 h-5" /> : <span>3</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Categorize Requirements</h3>
                <p className="text-white/50 text-sm">Separate must-have from nice-to-have</p>
              </div>
            </div>
            {expandedSection === 'categorize' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'categorize' && (
            <div className="mt-6 space-y-4">
              <p className="text-white/70 text-sm">Drag requirements to the correct category. Must-haves are deal-breakers; nice-to-haves give you an edge.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Must-Have Column */}
                <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckSquare className="w-4 h-4 text-[rgb(170,70,170)]" />
                    <span className="text-white font-medium">Must-Have</span>
                    <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] text-xs">
                      {jobData.identifiedRequirements.filter(r => r.type === 'must-have').length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {jobData.identifiedRequirements.filter(r => r.type === 'must-have').map((req, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                        <span className="text-white/80 text-sm">{req.text}</span>
                        <button 
                          onClick={() => {
                            setJobData(prev => ({
                              ...prev,
                              identifiedRequirements: prev.identifiedRequirements.map(r => 
                                r.text === req.text ? { ...r, type: 'nice-to-have' } : r
                              )
                            }))
                          }}
                          className="text-white/40 hover:text-white text-xs"
                        >
                          Move →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Nice-to-Have Column */}
                <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-[rgb(80,160,170)]" />
                    <span className="text-white font-medium">Nice-to-Have</span>
                    <Badge className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)] text-xs">
                      {jobData.identifiedRequirements.filter(r => r.type === 'nice-to-have').length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {jobData.identifiedRequirements.filter(r => r.type === 'nice-to-have').map((req, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                        <span className="text-white/80 text-sm">{req.text}</span>
                        <button 
                          onClick={() => {
                            setJobData(prev => ({
                              ...prev,
                              identifiedRequirements: prev.identifiedRequirements.map(r => 
                                r.text === req.text ? { ...r, type: 'must-have' } : r
                              )
                            }))
                          }}
                          className="text-white/40 hover:text-white text-xs"
                        >
                          ← Move
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => completeStep(2)}
                disabled={!isCategorizedComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Continuar to Match Map
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 4: Create Match Map */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(3) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 3 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'match' ? null : 'match')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(3) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(3) ? <CheckCircle2 className="w-5 h-5" /> : <span>4</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Create Match Map</h3>
                <p className="text-white/50 text-sm">Rate your fit for each requirement</p>
              </div>
            </div>
            {expandedSection === 'match' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'match' && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> Strong Match</span>
                <span className="flex items-center gap-1 text-yellow-400"><AlertTriangle className="w-4 h-4" /> Partial Match</span>
                <span className="flex items-center gap-1 text-red-400"><XSquare className="w-4 h-4" /> Gap to Address</span>
              </div>
              
              <div className="space-y-3">
                {jobData.identifiedRequirements.filter(r => r.type === 'must-have').slice(0, 5).map((req, i) => {
                  const existing = jobData.matchMap.find(m => m.requirement === req.text)
                  return (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                      <p className="text-white font-medium">{req.text}</p>
                      <div className="flex gap-2">
                        {(['strong', 'partial', 'gap'] as const).map((match) => (
                          <button
                            key={match}
                            onClick={() => updateMatchMap(req.text, match, existing?.evidence || '')}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              existing?.match === match
                                ? match === 'strong' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : match === 'partial' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-white/10 text-white/50 hover:bg-white/20'
                            }`}
                          >
                            {match === 'strong' ? 'Strong' : match === 'partial' ? 'Partial' : 'Gap'}
                          </button>
                        ))}
                      </div>
                      {existing && (
                        <input
                          type="text"
                          value={existing.evidence}
                          onChange={(e) => updateMatchMap(req.text, existing.match, e.target.value)}
                          placeholder={existing.match === 'gap' ? "How will you address this gap?" : "What's your evidence?"}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white placeholder:text-white/30 text-sm"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              
              <Button 
                onClick={() => completeStep(3)}
                disabled={!isMatchMapComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Continuar to Questions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 5: Generate Interview Questions */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(4) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 4 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'questions' ? null : 'questions')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(4) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(4) ? <CheckCircle2 className="w-5 h-5" /> : <span>5</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Predict Interview Questions</h3>
                <p className="text-white/50 text-sm">Select 3+ likely questions to prepare for</p>
              </div>
            </div>
            {expandedSection === 'questions' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'questions' && (
            <div className="mt-6 space-y-4">
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-3">
                <p className="text-[rgb(80,160,170)] text-sm">
                  <strong>Pro tip:</strong> Every requirement in a job posting is a potential interview question. 
                  Select the questions you want to prepare for in Arquitectura de Respuestas.
                </p>
              </div>
              
              <div className="space-y-4">
                {QUESTION_PATTERNS.map((pattern, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileQuestion className="w-4 h-4 text-[rgb(170,70,170)]" />
                      <span className="text-white/80 text-sm font-medium">Based on: {pattern.requirement}</span>
                    </div>
                    <div className="space-y-2">
                      {pattern.questions.map((q, j) => {
                        const isSelected = jobData.selectedQuestions.includes(q)
                        return (
                          <button
                            key={j}
                            onClick={() => {
                              setJobData(prev => ({
                                ...prev,
                                selectedQuestions: isSelected 
                                  ? prev.selectedQuestions.filter(sq => sq !== q)
                                  : [...prev.selectedQuestions, q]
                              }))
                            }}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
                              isSelected
                                ? 'bg-[rgba(170,70,170,0.2)] border border-[rgba(170,70,170,0.4)] text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {isSelected ? <CheckCircle2 className="w-4 h-4 text-[rgb(170,70,170)]" /> : <span className="w-4 h-4 border border-white/30 rounded" />}
                              {q}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-white/50 text-sm">Selected: {jobData.selectedQuestions.length} questions (minimum 3)</p>
              
              <Button 
                onClick={() => completeStep(4)}
                disabled={!isQuestionsComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Complete Job Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Complete Module */}
        {completedSteps.length === REQUIRED_ACTIVITIES.length && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <Target className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Decodificador de Ofertas Complete!</h3>
            <p className="text-white/70">
              You&apos;ve decoded the job posting and identified {jobData.selectedQuestions.length} likely interview questions. 
              Earned {MODULE_XP} XP!
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-left">
              <p className="text-white/70 text-sm mb-2">Questions you&apos;ll prepare in Arquitectura de Respuestas:</p>
              <ul className="space-y-1">
                {jobData.selectedQuestions.slice(0, 3).map((q, i) => (
                  <li key={i} className="text-[rgb(80,160,170)] text-sm">• {q}</li>
                ))}
              </ul>
            </div>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Continuar to Arquitectura de Respuestas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
