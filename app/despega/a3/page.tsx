'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  Play, 
  RotateCcw,
  User,
  Gem,
  FileText,
  Search,
  MessageSquare,
  Users,
  Mic,
  Video,
  AlertTriangle,
  Trophy
} from 'lucide-react'

// ============================================
// A3 BASIC LEVEL TRAINING PATH
// Total XP: 1,340 XP across 10 modules
// ============================================

// PILLAR 3 COLORS
// Primary: rgb(170, 70, 170) - magenta/purple
// Accent: rgb(80, 160, 170) - teal
// Neutrals: black, white, gray shades only

const PILLAR3_PRIMARY = 'rgb(170, 70, 170)'
const PILLAR3_ACCENT = 'rgb(80, 160, 170)'

interface Module {
  id: string
  number: number
  title: string
  shortDescription: string
  format: string
  inputMode: string
  interviewRequirement: string
  xp: number
  mainOutput: string
  cta: string
  tags: string[]
  requiredActivities: string[]
  icon: React.ReactNode
  route: string
}

const BASIC_LEVEL_MODULES: Module[] = [
  {
    id: 'career-mirror',
    number: 1,
    title: 'Career Mirror',
    shortDescription: 'Understand your professional profile, your Basic Level diagnosis, your strengths, blockers, and how interviewers may perceive you.',
    format: 'Self-discovery module',
    inputMode: 'Interactive cards, short reflections, confirmations',
    interviewRequirement: 'No interview required',
    xp: 80,
    mainOutput: 'Career Mirror Card',
    cta: 'Start Career Mirror',
    tags: ['No Interview', 'Self-Discovery', 'Profile Clarity'],
    requiredActivities: ['Review diagnosis', 'Confirm diagnosis accuracy', 'Select main career direction', 'Define current professional identity', 'Save Career Mirror Card'],
    icon: <User className="w-5 h-5" />,
    route: '/despega/a3/career-mirror'
  },
  {
    id: 'value-mining-lab',
    number: 2,
    title: 'Value Mining Lab',
    shortDescription: 'Discover the real value hidden inside your previous work experience and turn tasks into achievements.',
    format: 'Achievement discovery lab',
    inputMode: 'Text input by default. Optional guided coach mode.',
    interviewRequirement: 'No interview required. Optional coach support available.',
    xp: 100,
    mainOutput: 'Basic Achievement Bank',
    cta: 'Open Value Lab',
    tags: ['Text Builder', 'Optional Coach', 'Achievement Lab'],
    requiredActivities: ['Write 5 tasks from previous experience', 'Transform tasks into value statements', 'Complete responsibility transformation', 'Create 3 achievement examples', 'Select 1 strong story for future interview answers'],
    icon: <Gem className="w-5 h-5" />,
    route: '/despega/a3/value-mining-lab'
  },
  {
    id: 'cv-builder-studio',
    number: 3,
    title: 'CV Builder Studio',
    shortDescription: 'Create or improve a clear, recruiter-friendly CV using the value discovered in previous modules.',
    format: 'Document-building and professional writing module',
    inputMode: 'CV upload, manual text input, guided builder',
    interviewRequirement: 'No interview required',
    xp: 120,
    mainOutput: 'Basic CV Draft',
    cta: 'Build My CV',
    tags: ['CV Builder', 'No Interview', 'Document Studio'],
    requiredActivities: ['Upload or create CV base', 'Build professional summary', 'Improve at least 3 experience bullet points', 'Organize skills section', 'Complete missing information checklist'],
    icon: <FileText className="w-5 h-5" />,
    route: '/despega/a3/cv-builder-studio'
  },
  {
    id: 'job-decoder',
    number: 4,
    title: 'Job Decoder',
    shortDescription: 'Learn how to read a vacancy, understand what the company really needs, and identify your fit and gaps.',
    format: 'Vacancy and role analysis module',
    inputMode: 'Paste vacancy, upload job description, or choose target role',
    interviewRequirement: 'No interview required',
    xp: 100,
    mainOutput: 'Job Decoder Map',
    cta: 'Decode a Job',
    tags: ['Job Analysis', 'No Interview', 'Role Match'],
    requiredActivities: ['Paste vacancy or select target role', 'Identify 5 key requirements', 'Separate must-have and nice-to-have requirements', 'Create match map', 'Generate likely interview questions'],
    icon: <Search className="w-5 h-5" />,
    route: '/despega/a3/job-decoder'
  },
  {
    id: 'answer-architecture',
    number: 5,
    title: 'Answer Architecture',
    shortDescription: 'Build clear interview answers before live practice using simple structures and role-focused examples.',
    format: 'Interview answer-building module',
    inputMode: 'Text answer builder',
    interviewRequirement: 'No interview required. Optional voice practice available.',
    xp: 120,
    mainOutput: 'Basic Answer Bank',
    cta: 'Build My Answers',
    tags: ['Answer Builder', 'Optional Voice', 'STAR Method'],
    requiredActivities: ['Build 30-second self-introduction', 'Build motivation answer', 'Build strengths answer', 'Build challenge answer using STAR', 'Build "Why should we hire you?" answer', 'Shorten one answer into 30, 45, and 60 seconds'],
    icon: <MessageSquare className="w-5 h-5" />,
    route: '/despega/a3/answer-architecture'
  },
  {
    id: 'coach-practice-room',
    number: 6,
    title: 'Coach Practice Room',
    shortDescription: 'Practice your answers safely with feedback before entering real simulations.',
    format: 'Guided practice module',
    inputMode: 'Text practice or live coach mode',
    interviewRequirement: 'Live coach is optional',
    xp: 130,
    mainOutput: 'Practice Improvement Report',
    cta: 'Enter Practice Room',
    tags: ['Optional Coach', 'Safe Practice', 'Feedback Loop'],
    requiredActivities: ['Practice first answer', 'Receive feedback', 'Improve answer', 'Practice second answer', 'Practice third answer', 'Save best answer versions'],
    icon: <Users className="w-5 h-5" />,
    route: '/despega/a3/coach-practice-room'
  },
  {
    id: 'communication-gym',
    number: 7,
    title: 'Communication Gym',
    shortDescription: 'Train voice, rhythm, clarity, pauses, tone, answer length, and confidence through recorded drills.',
    format: 'Voice, rhythm, and delivery training',
    inputMode: 'Recorded voice/video drills',
    interviewRequirement: 'No full interview required. Voice or video drills are required.',
    xp: 140,
    mainOutput: 'Communication Basics Score',
    cta: 'Start Communication Gym',
    tags: ['Voice/Video Required', 'Communication Drill', 'Delivery Training'],
    requiredActivities: ['Record 30-second self-introduction', 'Complete pause drill', 'Record 45-second motivation answer', 'Receive delivery feedback', 'Repeat one answer after feedback'],
    icon: <Mic className="w-5 h-5" />,
    route: '/despega/a3/communication-gym'
  },
  {
    id: 'first-recruiter-simulation',
    number: 8,
    title: 'First Recruiter Simulation',
    shortDescription: 'Complete your first short recruiter-style simulation and receive a clear readiness report.',
    format: 'Short realistic interview simulation',
    inputMode: 'Live voice/video simulation',
    interviewRequirement: 'Required live simulation',
    xp: 160,
    mainOutput: 'Recruiter Screen Report',
    cta: 'Start First Simulation',
    tags: ['Required Simulation', 'Recruiter Screen', 'Live Interview'],
    requiredActivities: ['Start simulation', 'Complete recruiter greeting', 'Answer core questions', 'Ask candidate question', 'Complete closing', 'Review report'],
    icon: <Video className="w-5 h-5" />,
    route: '/despega/a3/first-recruiter-simulation'
  },
  {
    id: 'risk-difficult-questions-lab',
    number: 9,
    title: 'Risk & Difficult Questions Lab',
    shortDescription: 'Prepare uncomfortable questions calmly, build safer answers, and complete a short pressure drill.',
    format: 'Risk preparation and controlled pressure module',
    inputMode: 'Text preparation + required live mini drill',
    interviewRequirement: 'Required mini live drill',
    xp: 170,
    mainOutput: 'Difficult Questions Pack',
    cta: 'Prepare Difficult Questions',
    tags: ['Mini Pressure Drill', 'Risk Lab', 'Voice/Video Required'],
    requiredActivities: ['Select personal risks', 'Build 5 safe answers', 'Remove red-flag phrases', 'Complete 3-question mini pressure drill', 'Review difficult questions report'],
    icon: <AlertTriangle className="w-5 h-5" />,
    route: '/despega/a3/risk-difficult-questions-lab'
  },
  {
    id: 'basic-interview-mission',
    number: 10,
    title: 'Basic Interview Mission',
    shortDescription: 'Complete a full beginner-friendly realistic interview and receive your Basic Level readiness report.',
    format: 'Final full realistic interview',
    inputMode: 'Live voice/video simulation',
    interviewRequirement: 'Required full live simulation',
    xp: 220,
    mainOutput: 'Basic Interview Readiness Report',
    cta: 'Start Final Mission',
    tags: ['Final Mission', 'Required Simulation', 'Full Interview'],
    requiredActivities: ['Start final mission', 'Complete opening questions', 'Complete CV and role-fit questions', 'Complete behavioral questions', 'Complete difficult question', 'Ask candidate question', 'Finish interview', 'Review final report'],
    icon: <Trophy className="w-5 h-5" />,
    route: '/despega/a3/basic-interview-mission'
  }
]

const TOTAL_XP = 1340

type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface ModuleProgress {
  status: ModuleStatus
  progress: number // 0-100
  earnedXp: number
  completedActivities: number
}

export default function A3BasicLevelTrainingPath() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [selectedPath, setSelectedPath] = useState<'30' | '60' | '90'>('30')
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Calculate totals
  const earnedXp = Object.values(moduleProgress).reduce((sum, p) => sum + p.earnedXp, 0)
  const completedModules = Object.values(moduleProgress).filter(p => p.status === 'completed').length
  const progressPercentage = Math.round((earnedXp / TOTAL_XP) * 100)
  
  // Find current and next module
  const currentModule = BASIC_LEVEL_MODULES.find(m => {
    const progress = moduleProgress[m.id]
    return progress?.status === 'in_progress' || progress?.status === 'available'
  })
  const nextModule = currentModule 
    ? BASIC_LEVEL_MODULES.find(m => m.number === currentModule.number + 1)
    : BASIC_LEVEL_MODULES[0]

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/a3/user-progress', {
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const { progress } = await response.json()
          
          // Map API response to our module structure
          const progressMap: Record<string, ModuleProgress> = {}
          
          BASIC_LEVEL_MODULES.forEach((module, index) => {
            const apiStatus = progress?.moduleStates?.[module.id]
            let status: ModuleStatus = 'locked'
            
            if (apiStatus === 'completed') {
              status = 'completed'
            } else if (apiStatus === 'in_progress') {
              status = 'in_progress'
            } else if (apiStatus === 'available' || index === 0) {
              status = 'available'
            } else {
              // Check if previous module is completed
              const prevModule = BASIC_LEVEL_MODULES[index - 1]
              const prevStatus = progress?.moduleStates?.[prevModule.id]
              if (prevStatus === 'completed') {
                status = 'available'
              }
            }
            
            progressMap[module.id] = {
              status,
              progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
              earnedXp: status === 'completed' ? module.xp : 0,
              completedActivities: status === 'completed' ? module.requiredActivities.length : 0
            }
          })
          
          setModuleProgress(progressMap)
        } else {
          // Default: first module available, rest locked
          const defaultProgress: Record<string, ModuleProgress> = {}
          BASIC_LEVEL_MODULES.forEach((module, index) => {
            defaultProgress[module.id] = {
              status: index === 0 ? 'available' : 'locked',
              progress: 0,
              earnedXp: 0,
              completedActivities: 0
            }
          })
          setModuleProgress(defaultProgress)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
        // Default state
        const defaultProgress: Record<string, ModuleProgress> = {}
        BASIC_LEVEL_MODULES.forEach((module, index) => {
          defaultProgress[module.id] = {
            status: index === 0 ? 'available' : 'locked',
            progress: 0,
            earnedXp: 0,
            completedActivities: 0
          }
        })
        setModuleProgress(defaultProgress)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProgress()
  }, [])

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'completed':
        return <Badge style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(200, 130, 200)', borderColor: 'rgba(170, 70, 170, 0.5)' }} className="border">Completed</Badge>
      case 'in_progress':
        return <Badge style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)', borderColor: 'rgba(80, 160, 170, 0.4)' }} className="border">In Progress</Badge>
      case 'available':
        return <Badge style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(170, 70, 170)', borderColor: 'rgba(170, 70, 170, 0.4)' }} className="border">Available</Badge>
      case 'locked':
        return <Badge className="bg-white/10 text-white/50 border-white/20 border">Locked</Badge>
    }
  }

  const getTagStyle = (tag: string) => {
    if (tag.includes('No Interview') || tag.includes('Optional')) {
      return { backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)' }
    }
    if (tag.includes('Required') || tag.includes('Live') || tag.includes('Voice') || tag.includes('Video')) {
      return { backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(200, 130, 200)' }
    }
    if (tag.includes('Final')) {
      return { backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(170, 70, 170)' }
    }
    return { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)' }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: PILLAR3_PRIMARY }} />
          <p className="text-white/70">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background with pillar 3 color */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(to bottom, rgba(170, 70, 170, 0.08) 0%, transparent 30%, transparent 100%)` 
          }} 
        />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* ========== HEADER ========== */}
        <div className="space-y-6">
          <Link href="/despega">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back
            </Button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              A3 — Basic Level Training Path
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              A guided 10-module journey to build clarity, confidence, structure, and interview readiness step by step.
            </p>
            <p className="text-white/60 leading-relaxed max-w-3xl">
              Basic Level is designed for users who need more structure before facing real interviews. 
              This path begins with deep learning and professional clarity, then moves into CV building, 
              job decoding, answer preparation, coach practice, communication drills, recruiter simulations, 
              difficult-question training, and a final realistic interview mission.
            </p>
          </div>

          {/* Status Badges - using pillar 3 colors */}
          <div className="flex flex-wrap gap-3">
            <Badge 
              style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)', borderColor: 'rgba(80, 160, 170, 0.4)' }} 
              className="border px-3 py-1"
            >
              Level: Basic
            </Badge>
            <Badge 
              style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(200, 130, 200)', borderColor: 'rgba(170, 70, 170, 0.4)' }} 
              className="border px-3 py-1"
            >
              Training Mode: Educational + Guided + Simulated
            </Badge>
            <Badge 
              style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(170, 70, 170)', borderColor: 'rgba(170, 70, 170, 0.5)' }} 
              className="border px-3 py-1"
            >
              Total Path: {TOTAL_XP.toLocaleString()} XP
            </Badge>
            <Badge className="bg-white/10 text-white/70 border-white/20 border px-3 py-1">
              Selected Path: {selectedPath} Days
            </Badge>
          </div>
        </div>

        {/* ========== MAIN PROGRESS BAR ========== */}
        <Card 
          className="bg-white/5 border p-6 space-y-4"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <h2 className="text-lg font-semibold text-white">Your Basic Level Progress</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">{progressPercentage}% complete</span>
              <span className="font-medium" style={{ color: PILLAR3_PRIMARY }}>{earnedXp.toLocaleString()} / {TOTAL_XP.toLocaleString()} XP</span>
            </div>
            {/* Custom progress bar with pillar 3 color */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(90deg, ${PILLAR3_PRIMARY}, rgba(170, 70, 170, 0.7))`
                }}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-2xl font-bold" style={{ color: PILLAR3_PRIMARY }}>{earnedXp}</p>
              <p className="text-xs text-white/50">XP Earned from {TOTAL_XP}</p>
            </div>
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-2xl font-bold text-white">{completedModules} / 10</p>
              <p className="text-xs text-white/50">Modules completed</p>
            </div>
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-lg font-bold text-white truncate">{currentModule?.title || 'Career Mirror'}</p>
              <p className="text-xs text-white/50">Current Focus</p>
            </div>
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-lg font-bold text-white/70 truncate">{nextModule?.title || 'Complete!'}</p>
              <p className="text-xs text-white/50">Next Unlock</p>
            </div>
          </div>
        </Card>

        {/* ========== MODULE CARDS ========== */}
        <div className="space-y-4">
          {BASIC_LEVEL_MODULES.map((module) => {
            const progress = moduleProgress[module.id] || { status: 'locked', progress: 0, earnedXp: 0, completedActivities: 0 }
            const isLocked = progress.status === 'locked'
            const isExpanded = expandedModule === module.id
            const prevModule = module.number > 1 ? BASIC_LEVEL_MODULES[module.number - 2] : null

            return (
              <Card 
                key={module.id}
                className={`bg-white/5 overflow-hidden transition-all border ${
                  isLocked ? 'opacity-60 border-white/10' : ''
                }`}
                style={{ 
                  borderColor: isLocked ? undefined : 'rgba(170, 70, 170, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.borderColor = 'rgba(170, 70, 170, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.borderColor = 'rgba(170, 70, 170, 0.2)'
                  }
                }}
              >
                <div 
                  className={`p-6 ${!isLocked ? 'cursor-pointer' : ''}`}
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Module Number & Icon */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: progress.status === 'completed' 
                          ? 'rgba(170, 70, 170, 0.3)' 
                          : progress.status === 'available' || progress.status === 'in_progress'
                            ? 'rgba(170, 70, 170, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: progress.status === 'completed' || progress.status === 'available' || progress.status === 'in_progress'
                          ? 'rgb(200, 130, 200)'
                          : 'rgba(255, 255, 255, 0.4)'
                      }}
                    >
                      {progress.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : progress.status === 'locked' ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        module.icon
                      )}
                    </div>

                    {/* Module Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-white/50">Module {module.number}</span>
                        {getStatusBadge(progress.status)}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mt-1">{module.title}</h3>
                      <p className="text-white/60 text-sm mt-1 line-clamp-2">{module.shortDescription}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {module.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs px-2 py-1 rounded"
                            style={getTagStyle(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Unlock Message */}
                      {isLocked && prevModule && (
                        <p className="text-sm mt-3" style={{ color: 'rgba(170, 70, 170, 0.7)' }}>
                          Complete {prevModule.title} to unlock this step.
                        </p>
                      )}
                    </div>

                    {/* XP Badge */}
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: PILLAR3_PRIMARY }}>{module.xp} XP</p>
                      <p className="text-xs text-white/50">{module.format}</p>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && !isLocked && (
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-white/70 mb-2">Required Activities</h4>
                          <ul className="space-y-2">
                            {module.requiredActivities.map((activity, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                                <div 
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                  style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: PILLAR3_PRIMARY }}
                                >
                                  {idx + 1}
                                </div>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white/70 mb-2">Output</h4>
                          <p className="text-sm text-white/60">{module.mainOutput}</p>
                          
                          <h4 className="text-sm font-medium text-white/70 mt-4 mb-2">Input Mode</h4>
                          <p className="text-sm text-white/60">{module.inputMode}</p>
                          
                          <h4 className="text-sm font-medium text-white/70 mt-4 mb-2">Interview Requirement</h4>
                          <p className="text-sm text-white/60">{module.interviewRequirement}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Link href={module.route} className="flex-1">
                          <Button 
                            className="w-full text-white"
                            style={{ 
                              backgroundColor: PILLAR3_PRIMARY,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(170, 70, 170, 0.8)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = PILLAR3_PRIMARY
                            }}
                          >
                            {progress.status === 'completed' ? (
                              <>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Review Module
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                {module.cta}
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* ========== SUMMARY TABLE ========== */}
        <Card 
          className="bg-white/5 border p-6"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Module Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}>
                  <th className="text-left py-2 text-white/50 font-medium">#</th>
                  <th className="text-left py-2 text-white/50 font-medium">Module</th>
                  <th className="text-left py-2 text-white/50 font-medium">Format</th>
                  <th className="text-left py-2 text-white/50 font-medium">XP</th>
                  <th className="text-left py-2 text-white/50 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {BASIC_LEVEL_MODULES.map(module => {
                  const progress = moduleProgress[module.id]
                  return (
                    <tr key={module.id} className="border-b" style={{ borderColor: 'rgba(170, 70, 170, 0.1)' }}>
                      <td className="py-3 text-white/50">{module.number}</td>
                      <td className="py-3 text-white">{module.title}</td>
                      <td className="py-3 text-white/60">{module.format}</td>
                      <td className="py-3" style={{ color: PILLAR3_PRIMARY }}>{module.xp} XP</td>
                      <td className="py-3">{getStatusBadge(progress?.status || 'locked')}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t" style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}>
                  <td colSpan={3} className="py-3 font-semibold text-white">Total</td>
                  <td className="py-3 font-bold" style={{ color: PILLAR3_PRIMARY }}>{TOTAL_XP} XP</td>
                  <td className="py-3 text-white/60">{completedModules}/10 completed</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* ========== HOW PROGRESS WORKS ========== */}
        <Card 
          className="bg-white/5 border p-6"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">How Progress Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
              >
                <span style={{ color: PILLAR3_PRIMARY }}>1</span>
              </div>
              <h3 className="font-medium text-white">Complete modules in order</h3>
              <p className="text-sm text-white/60">Each module unlocks the next. Complete all required activities to earn XP.</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
              >
                <span style={{ color: PILLAR3_PRIMARY }}>2</span>
              </div>
              <h3 className="font-medium text-white">Build your interview toolkit</h3>
              <p className="text-sm text-white/60">Each module produces outputs you&apos;ll use in later modules and real interviews.</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
              >
                <span style={{ color: PILLAR3_PRIMARY }}>3</span>
              </div>
              <h3 className="font-medium text-white">Reach 1,340 XP</h3>
              <p className="text-sm text-white/60">Complete all 10 modules to finish Basic Level and unlock Intermediate training.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
