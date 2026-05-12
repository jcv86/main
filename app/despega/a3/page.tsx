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
        console.error('[v0] Error fetching progress:', error)
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
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">In Progress</Badge>
      case 'available':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Available</Badge>
      case 'locked':
        return <Badge className="bg-white/10 text-white/50 border-white/20">Locked</Badge>
    }
  }

  const getTagColor = (tag: string) => {
    if (tag.includes('No Interview') || tag.includes('Optional')) return 'bg-emerald-500/20 text-emerald-400'
    if (tag.includes('Required') || tag.includes('Live')) return 'bg-amber-500/20 text-amber-400'
    if (tag.includes('Voice') || tag.includes('Video')) return 'bg-cyan-500/20 text-cyan-400'
    if (tag.includes('Final')) return 'bg-purple-500/20 text-purple-400'
    return 'bg-white/10 text-white/70'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/70">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-background to-background" />
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

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-3 py-1">
              Level: Basic
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
              Training Mode: Educational + Guided + Simulated
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
              Total Path: {TOTAL_XP.toLocaleString()} XP
            </Badge>
            <Badge className="bg-white/10 text-white/70 border-white/20 px-3 py-1">
              Selected Path: {selectedPath} Days
            </Badge>
          </div>
        </div>

        {/* ========== MAIN PROGRESS BAR ========== */}
        <Card className="bg-white/5 border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Basic Level Progress</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">{progressPercentage}% complete</span>
              <span className="text-cyan-400 font-medium">{earnedXp.toLocaleString()} / {TOTAL_XP.toLocaleString()} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/10" />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-2xl font-bold text-cyan-400">{earnedXp}</p>
              <p className="text-xs text-white/50">XP Earned from {TOTAL_XP}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">{completedModules} / 10</p>
              <p className="text-xs text-white/50">Modules completed</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-lg font-bold text-white truncate">{currentModule?.title || 'Career Mirror'}</p>
              <p className="text-xs text-white/50">Current Focus</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
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
                className={`bg-white/5 border-white/10 overflow-hidden transition-all ${
                  isLocked ? 'opacity-60' : 'hover:border-cyan-500/30'
                }`}
              >
                <div 
                  className={`p-6 ${!isLocked ? 'cursor-pointer' : ''}`}
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Module Number & Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      progress.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      progress.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-400' :
                      progress.status === 'available' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-white/10 text-white/40'
                    }`}>
                      {progress.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        module.icon
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/40 text-sm">Module {module.number}</span>
                            {getStatusBadge(progress.status)}
                          </div>
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          <p className="text-white/60 text-sm mt-1">{module.shortDescription}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-cyan-400 font-bold">{module.xp} XP</p>
                          <p className="text-xs text-white/40">{module.format}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {module.tags.map((tag) => (
                          <span key={tag} className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Progress bar for in-progress modules */}
                      {progress.status === 'in_progress' && (
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/50">{progress.progress}% complete</span>
                            <span className="text-white/50">{progress.completedActivities}/{module.requiredActivities.length} activities</span>
                          </div>
                          <Progress value={progress.progress} className="h-1.5 bg-white/10" />
                        </div>
                      )}

                      {/* Locked message */}
                      {isLocked && prevModule && (
                        <p className="text-amber-400/70 text-xs mt-3">
                          Complete {prevModule.title} to unlock this step.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && !isLocked && (
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/40 text-xs uppercase mb-1">Input Mode</p>
                          <p className="text-white/70">{module.inputMode}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs uppercase mb-1">Interview Requirement</p>
                          <p className="text-white/70">{module.interviewRequirement}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs uppercase mb-1">Main Output</p>
                          <p className="text-white/70">{module.mainOutput}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase mb-2">Required Activities</p>
                        <ul className="space-y-1">
                          {module.requiredActivities.map((activity, i) => (
                            <li key={i} className="text-white/60 text-sm flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40">
                                {i + 1}
                              </span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(module.route)
                        }}
                        className={`w-full ${
                          progress.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        }`}
                      >
                        {progress.status === 'completed' ? (
                          <>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Review Results
                          </>
                        ) : progress.status === 'in_progress' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {module.cta}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* ========== SUMMARY TABLE ========== */}
        <Card className="bg-white/5 border-white/10 p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Module Summary</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">Module</th>
                <th className="text-left py-2 px-2">Format</th>
                <th className="text-left py-2 px-2">Requirement</th>
                <th className="text-right py-2 px-2">XP</th>
                <th className="text-left py-2 px-2">Main Output</th>
              </tr>
            </thead>
            <tbody>
              {BASIC_LEVEL_MODULES.map((module) => (
                <tr key={module.id} className="border-b border-white/5 text-white/70">
                  <td className="py-2 px-2 text-white/40">{module.number}</td>
                  <td className="py-2 px-2 text-white">{module.title}</td>
                  <td className="py-2 px-2">{module.format.split(' ')[0]}</td>
                  <td className="py-2 px-2">{module.interviewRequirement.split('.')[0]}</td>
                  <td className="py-2 px-2 text-right text-cyan-400">{module.xp}</td>
                  <td className="py-2 px-2">{module.mainOutput}</td>
                </tr>
              ))}
              <tr className="text-white font-semibold">
                <td colSpan={4} className="py-2 px-2 text-right">Total</td>
                <td className="py-2 px-2 text-right text-cyan-400">{TOTAL_XP}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* ========== HOW PROGRESS WORKS ========== */}
        <Card className="bg-white/5 border-white/10 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">How Progress Works</h3>
          <div className="text-white/70 space-y-3 text-sm leading-relaxed">
            <p>
              Your A3 progress is based on XP earned across the 10 Basic Level modules. Each module has its own 
              internal progress bar. When you complete all required activities inside a module, you earn that 
              module&apos;s XP and unlock the next step.
            </p>
            <p>
              XP measures progress and completed work. Scores measure quality. For example, you can earn XP by 
              completing the CV Builder Studio, while your CV Readability Score shows how strong the result is.
            </p>
            <p>
              The path starts with learning and building. Later modules introduce voice/video drills, recruiter 
              simulations, difficult-question pressure, and a final realistic interview mission. This way, you 
              are not pushed into pressure too early. You build readiness step by step.
            </p>
          </div>
        </Card>

        {/* ========== FINAL COPY ========== */}
        <div className="text-center py-8 space-y-4">
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            A3 Basic Level is designed to educate before it evaluates. You first learn how to understand your 
            professional profile, discover your value, build a clear CV, decode job offers, and structure strong 
            answers. Only after that does DTC introduce guided practice, communication drills, recruiter simulations, 
            difficult-question training, and a final realistic interview mission.
          </p>
          <p className="text-white/40 text-sm">
            The goal is not to pressure you from the beginning. The goal is to build clarity, confidence, structure, 
            and readiness step by step.
          </p>
        </div>
      </div>
    </div>
  )
}
