'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Target,
  Lightbulb,
  AlertTriangle,
  Eye,
  Save,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'

// PILLAR 3 COLORS
const PILLAR3_PRIMARY = 'rgb(170, 70, 170)'
const PILLAR3_ACCENT = 'rgb(80, 160, 170)'

const MODULE_XP = 80

// Rich content for each activity
const ACTIVITIES = [
  {
    id: 'review-diagnosis',
    title: 'Revisar tu Diagnóstico del Nivel Básico',
    description: 'Understand what your diagnostic results reveal about your interview readiness.',
    icon: Eye,
  },
  {
    id: 'confirm-accuracy',
    title: 'Confirmar Precisión del Diagnóstico',
    description: 'Valida o ajusta tu diagnóstico basado en tu autoevaluación.',
    icon: CheckCircle2,
  },
  {
    id: 'career-direction',
    title: 'Seleccionar tu Dirección Principal de Carrera',
    description: 'Choose the professional path that aligns with your goals and experience.',
    icon: Target,
  },
  {
    id: 'professional-identity',
    title: 'Definir tu Identidad Profesional Actual',
    description: 'Craft a clear statement of who you are professionally.',
    icon: User,
  },
  {
    id: 'career-mirror-card',
    title: 'Guardar Tu Tarjeta de Espejo de Carrera',
    description: 'Genera tu instantánea de carrera personalizada para usar en todo el entrenamiento.',
    icon: Save,
  },
]

// Diagnosis levels with detailed descriptions
const DIAGNOSIS_LEVELS = {
  basic: {
    name: 'Basic Level',
    color: PILLAR3_PRIMARY,
    description: 'You have solid potential but need structured practice before facing real interviews.',
    characteristics: [
      'May struggle to articulate achievements clearly',
      'Tends to give general answers instead of specific examples',
      'Could benefit from practicing STAR method responses',
      'Needs to develop confidence in explaining career transitions',
      'Would improve with mock interview experience'
    ],
    recommendation: 'Complete the full A3 Basic Ruta de Entrenamiento to build a strong foundation.',
  }
}

// Strength and blocker options
const STRENGTH_OPTIONS = [
  { id: 'technical', label: 'Technical Skills', description: 'Strong technical knowledge in your field' },
  { id: 'communication', label: 'Communication', description: 'Can explain complex ideas clearly' },
  { id: 'leadership', label: 'Leadership', description: 'Experience leading teams or projects' },
  { id: 'problem-solving', label: 'Problem Solving', description: 'Good at analyzing and solving challenges' },
  { id: 'adaptability', label: 'Adaptability', description: 'Flexible and quick to learn new things' },
  { id: 'teamwork', label: 'Teamwork', description: 'Works well with others, collaborative' },
  { id: 'creativity', label: 'Creativity', description: 'Brings innovative ideas and solutions' },
  { id: 'organization', label: 'Organization', description: 'Well-organized and detail-oriented' },
]

const BLOCKER_OPTIONS = [
  { id: 'nerves', label: 'Interview Nerves', description: 'Get anxious or stressed during interviews' },
  { id: 'articulation', label: 'Articulating Value', description: 'Hard to explain your achievements concisely' },
  { id: 'examples', label: 'Specific Examples', description: 'Struggle to recall relevant stories quickly' },
  { id: 'confidence', label: 'Confidence', description: 'Undersell yourself or minimize achievements' },
  { id: 'structure', label: 'Answer Structure', description: 'Answers tend to ramble or lack clear structure' },
  { id: 'salary', label: 'Salary Negotiation', description: 'Uncomfortable discussing compensation' },
  { id: 'gaps', label: 'Career Gaps', description: 'Unsure how to explain career transitions or gaps' },
  { id: 'questions', label: 'Asking Questions', description: 'Dont know what questions to ask interviewers' },
]

// Career direction options
const CAREER_DIRECTIONS = [
  { 
    id: 'same-role-same-industry',
    title: 'Same Role, Same Industry',
    description: 'Play in your current role within your industry',
    example: 'Marketing Manager in Tech → Marketing Manager in Tech'
  },
  { 
    id: 'same-role-new-industry',
    title: 'Same Role, New Industry',
    description: 'Apply your skills in a different industry',
    example: 'Marketing Manager in Tech → Marketing Manager in Healthcare'
  },
  { 
    id: 'new-role-same-industry',
    title: 'New Role, Same Industry',
    description: 'Transition to a different role within your industry',
    example: 'Marketing Manager → Product Manager in Tech'
  },
  { 
    id: 'new-role-new-industry',
    title: 'New Role, New Industry',
    description: 'Complete career pivot to a new field',
    example: 'Marketing Manager in Tech → UX Designer in Finance'
  },
  { 
    id: 'promotion',
    title: 'Promotion / Leadership',
    description: 'Move up to a more senior position',
    example: 'Marketing Manager → Director of Marketing'
  },
]

// Interviewer perception insights
const INTERVIEWER_PERCEPTIONS = [
  {
    title: 'First Impression',
    insight: 'Interviewers form 70% of their opinion in the first 5 minutes. Your introduction matters enormously.',
    tip: 'Practice a confident, concise 30-second introduction that highlights your key value.'
  },
  {
    title: 'Story Quality',
    insight: 'Specific, quantified examples are 3x more memorable than general statements.',
    tip: 'Always include numbers: "increased sales by 25%" beats "improved sales performance".'
  },
  {
    title: 'Self-Awareness',
    insight: 'Candidates who can honestly discuss weaknesses (and how they address them) score higher on maturity.',
    tip: 'Prepare one genuine weakness and your concrete plan to improve it.'
  },
  {
    title: 'Enthusiasm',
    insight: 'Interviewers are looking for people who genuinely want THIS job, not just ANY job.',
    tip: 'Research the company and role deeply. Show specific interest in their mission and challenges.'
  },
]

export default function CareerMirrorModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedStep, setExpandedStep] = useState<number | null>(0)
  
  // Activity 1: Diagnosis Review
  const [diagnosisReviewed, setDiagnosisReviewed] = useState(false)
  
  // Activity 2: Confirmar Precisión del Diagnóstico
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const [selectedBlockers, setSelectedBlockers] = useState<string[]>([])
  const [diagnosisAccurate, setDiagnosisAccurate] = useState<boolean | null>(null)
  
  // Activity 3: Career Direction
  const [careerDirection, setCareerDirection] = useState<string | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [targetIndustry, setTargetIndustry] = useState('')
  
  // Activity 4: Professional Identity
  const [professionalTitle, setProfessionalTitle] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [keySkills, setKeySkills] = useState('')
  const [careerGoal, setCareerGoal] = useState('')
  
  // Activity 5: Espejo de Carrera Card
  const [cardSaved, setCardSaved] = useState(false)

  const progress = Math.round((completedSteps.length / ACTIVITIES.length) * 100)

  // Auto-expand current step
  useEffect(() => {
    if (!completedSteps.includes(currentStep)) {
      setExpandedStep(currentStep)
    }
  }, [currentStep, completedSteps])

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index)
  }

  const canCompleteStep = (step: number): boolean => {
    switch (step) {
      case 0: return diagnosisReviewed
      case 1: return selectedStrengths.length >= 2 && selectedBlockers.length >= 1 && diagnosisAccurate !== null
      case 2: return careerDirection !== null && targetRole.trim() !== ''
      case 3: return professionalTitle.trim() !== '' && keySkills.trim() !== '' && careerGoal.trim() !== ''
      case 4: return true
      default: return false
    }
  }

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step) && canCompleteStep(step)) {
      const newCompleted = [...completedSteps, step]
      setCompletedSteps(newCompleted)
      if (step < ACTIVITIES.length - 1) {
        setCurrentStep(step + 1)
        setExpandedStep(step + 1)
      }
    }
  }

  const toggleStrength = (id: string) => {
    setSelectedStrengths(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleBlocker = (id: string) => {
    setSelectedBlockers(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const handleComplete = async () => {
    try {
      // Save career mirror data
      const careerMirrorData = {
        diagnosis: {
          level: 'basic',
          strengths: selectedStrengths,
          blockers: selectedBlockers,
          confirmed: diagnosisAccurate
        },
        careerDirection: {
          type: careerDirection,
          targetRole,
          targetIndustry
        },
        professionalIdentity: {
          title: professionalTitle,
          yearsExperience,
          keySkills,
          careerGoal
        }
      }

      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'career-mirror', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: ACTIVITIES.length,
          moduleData: careerMirrorData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
      
      router.push('/despega/a3?completed=career-mirror')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=career-mirror')
    }
  }

  const renderActivityContent = (index: number) => {
    const isCompleted = completedSteps.includes(index)
    const isCurrent = currentStep === index
    const isLocked = index > currentStep && !isCompleted

    switch (index) {
      case 0: // Review Diagnosis
        return (
          <div className="space-y-6 mt-4">
            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)' }}
                >
                  <Target className="w-5 h-5" style={{ color: PILLAR3_PRIMARY }} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{DIAGNOSIS_LEVELS.basic.name}</h4>
                  <p className="text-sm text-white/60">Your current interview readiness level</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">{DIAGNOSIS_LEVELS.basic.description}</p>
              
              <div className="space-y-2 mb-4">
                <h5 className="font-medium text-white/90">What this means:</h5>
                <ul className="space-y-2">
                  {DIAGNOSIS_LEVELS.basic.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                      <span style={{ color: PILLAR3_ACCENT }}>•</span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div 
                className="p-4 rounded-[2px]"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 mt-0.5" style={{ color: PILLAR3_ACCENT }} />
                  <div>
                    <h5 className="font-medium text-white/90">Recommendation</h5>
                    <p className="text-white/70 text-sm">{DIAGNOSIS_LEVELS.basic.recommendation}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" style={{ color: PILLAR3_PRIMARY }} />
                How Interviewers May Perceive You
              </h4>
              <div className="grid gap-4">
                {INTERVIEWER_PERCEPTIONS.map((perception, i) => (
                  <div key={i} className="border-l-2 pl-4" style={{ borderColor: PILLAR3_PRIMARY }}>
                    <h5 className="font-medium text-white/90">{perception.title}</h5>
                    <p className="text-white/60 text-sm mb-2">{perception.insight}</p>
                    <p className="text-sm" style={{ color: PILLAR3_ACCENT }}>
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {perception.tip}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {!isCompleted && (
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="reviewed"
                  checked={diagnosisReviewed}
                  onChange={(e) => setDiagnosisReviewed(e.target.checked)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: PILLAR3_PRIMARY }}
                />
                <label htmlFor="reviewed" className="text-white/80">
                  I have reviewed and understood my diagnosis
                </label>
              </div>
            )}
          </div>
        )

      case 1: // Confirmar Precisión del Diagnóstico
        return (
          <div className="space-y-6 mt-4">
            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4">Select Your Top Strengths</h4>
              <p className="text-white/60 text-sm mb-4">Choose at least 2 strengths that best describe you</p>
              <div className="grid grid-cols-2 gap-3">
                {STRENGTH_OPTIONS.map(strength => (
                  <button
                    key={strength.id}
                    onClick={() => toggleStrength(strength.id)}
                    className="p-3 rounded-[2px] text-left transition-all border"
                    style={{
                      backgroundColor: selectedStrengths.includes(strength.id) 
                        ? 'rgba(170, 70, 170, 0.2)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      borderColor: selectedStrengths.includes(strength.id)
                        ? PILLAR3_PRIMARY
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="font-medium text-white text-sm">{strength.label}</div>
                    <div className="text-white/50 text-xs">{strength.description}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" style={{ color: PILLAR3_ACCENT }} />
                Identify Your Blockers
              </h4>
              <p className="text-white/60 text-sm mb-4">Select at least 1 area where you need improvement</p>
              <div className="grid grid-cols-2 gap-3">
                {BLOCKER_OPTIONS.map(blocker => (
                  <button
                    key={blocker.id}
                    onClick={() => toggleBlocker(blocker.id)}
                    className="p-3 rounded-[2px] text-left transition-all border"
                    style={{
                      backgroundColor: selectedBlockers.includes(blocker.id) 
                        ? 'rgba(80, 160, 170, 0.2)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      borderColor: selectedBlockers.includes(blocker.id)
                        ? PILLAR3_ACCENT
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="font-medium text-white text-sm">{blocker.label}</div>
                    <div className="text-white/50 text-xs">{blocker.description}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4">Does this diagnosis feel accurate?</h4>
              <div className="flex gap-4">
                <button
                  onClick={() => setDiagnosisAccurate(true)}
                  className="flex-1 p-4 rounded-[2px] transition-all border"
                  style={{
                    backgroundColor: diagnosisAccurate === true 
                      ? 'rgba(170, 70, 170, 0.2)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    borderColor: diagnosisAccurate === true
                      ? PILLAR3_PRIMARY
                      : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" style={{ color: diagnosisAccurate === true ? PILLAR3_PRIMARY : 'rgba(255,255,255,0.5)' }} />
                  <div className="font-medium text-white">Yes, it&apos;s accurate</div>
                  <div className="text-white/50 text-xs">This reflects my current situation</div>
                </button>
                <button
                  onClick={() => setDiagnosisAccurate(false)}
                  className="flex-1 p-4 rounded-[2px] transition-all border"
                  style={{
                    backgroundColor: diagnosisAccurate === false 
                      ? 'rgba(80, 160, 170, 0.2)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    borderColor: diagnosisAccurate === false
                      ? PILLAR3_ACCENT
                      : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2" style={{ color: diagnosisAccurate === false ? PILLAR3_ACCENT : 'rgba(255,255,255,0.5)' }} />
                  <div className="font-medium text-white">Partially accurate</div>
                  <div className="text-white/50 text-xs">Some aspects dont match</div>
                </button>
              </div>
            </Card>
          </div>
        )

      case 2: // Career Direction
        return (
          <div className="space-y-6 mt-4">
            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4">What&apos;s your career transition type?</h4>
              <p className="text-white/60 text-sm mb-4">Understanding your direction helps tailor your interview approach</p>
              <div className="space-y-3">
                {CAREER_DIRECTIONS.map(direction => (
                  <button
                    key={direction.id}
                    onClick={() => setCareerDirection(direction.id)}
                    className="w-full p-4 rounded-[2px] text-left transition-all border"
                    style={{
                      backgroundColor: careerDirection === direction.id 
                        ? 'rgba(170, 70, 170, 0.2)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      borderColor: careerDirection === direction.id
                        ? PILLAR3_PRIMARY
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="font-medium text-white">{direction.title}</div>
                    <div className="text-white/60 text-sm">{direction.description}</div>
                    <div className="text-xs mt-1" style={{ color: PILLAR3_ACCENT }}>
                      Example: {direction.example}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4">Define Your Target</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Target Role / Position</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Product Manager, Data Analyst, Marketing Director"
                    className="w-full rounded-[2px] bg-white/5 border p-3 text-white placeholder:text-white/30"
                    style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Target Industry (optional)</label>
                  <input
                    type="text"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    placeholder="e.g., Technology, Healthcare, Finance, Comenzarups"
                    className="w-full rounded-[2px] bg-white/5 border p-3 text-white placeholder:text-white/30"
                    style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )

      case 3: // Professional Identity
        return (
          <div className="space-y-6 mt-4">
            <Card 
              className="rounded-[2px] p-6 border"
              style={{ 
                backgroundColor: 'rgba(170, 70, 170, 0.1)',
                borderColor: 'rgba(170, 70, 170, 0.3)'
              }}
            >
              <h4 className="font-bold text-white mb-2">Professional Identity Formula</h4>
              <p className="text-white/60 text-sm italic">
                &quot;I am a [title] with [X] years of experience in [skills/areas]. 
                My focus is on [key contributions]. I&apos;m looking to [career goal].&quot;
              </p>
            </Card>

            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4">Build Your Identity Statement</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Your Professional Title</label>
                  <input
                    type="text"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Specialist, Project Manager"
                    className="w-full rounded-[2px] bg-white/5 border p-3 text-white placeholder:text-white/30"
                    style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Years of Experience</label>
                  <input
                    type="text"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="e.g., 5 years, 10+ years, entry-level"
                    className="w-full rounded-[2px] bg-white/5 border p-3 text-white placeholder:text-white/30"
                    style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Key Skills & Areas of Expertise</label>
                  <textarea
                    value={keySkills}
                    onChange={(e) => setKeySkills(e.target.value)}
                    placeholder="e.g., data analysis, team leadership, Python, strategic planning, customer success"
                    className="w-full rounded-[2px] bg-white/5 border p-3 text-white placeholder:text-white/30 min-h-20"
                    style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Career Goal</label>
                  <textarea
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g., lead a product team at a growth-stage startup, transition into data science, become a technical architect"
                    className="w-full rounded-[2px] bg-white/5 border p-3 text-white placeholder:text-white/30 min-h-20"
                    style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}
                  />
                </div>
              </div>
            </Card>

            {professionalTitle && keySkills && careerGoal && (
              <Card 
                className="rounded-[2px] p-6 border"
                style={{ 
                  backgroundColor: 'rgba(80, 160, 170, 0.1)',
                  borderColor: 'rgba(80, 160, 170, 0.3)'
                }}
              >
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: PILLAR3_ACCENT }} />
                  Your Identity Statement Preview
                </h4>
                <p className="text-white/90">
                  &quot;I am a <span style={{ color: PILLAR3_PRIMARY }}>{professionalTitle}</span>
                  {yearsExperience && <> with <span style={{ color: PILLAR3_PRIMARY }}>{yearsExperience}</span> of experience</>} 
                  {' '}in <span style={{ color: PILLAR3_PRIMARY }}>{keySkills}</span>. 
                  I&apos;m looking to <span style={{ color: PILLAR3_PRIMARY }}>{careerGoal}</span>.&quot;
                </p>
              </Card>
            )}
          </div>
        )

      case 4: // Espejo de Carrera Card
        return (
          <div className="space-y-6 mt-4">
            <Card 
              className="rounded-[2px] p-6 border relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(170, 70, 170, 0.1)',
                borderColor: 'rgba(170, 70, 170, 0.4)'
              }}
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                style={{
                  background: `radial-gradient(circle at top right, ${PILLAR3_PRIMARY}, transparent 70%)`
                }}
              />
              
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)' }}
                >
                  <User className="w-8 h-8" style={{ color: 'rgb(200, 130, 200)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Espejo de Carrera Card</h3>
                  <p className="text-white/60">Your professional snapshot</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Level</p>
                    <p className="text-white font-medium">Basic Level</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Direction</p>
                    <p className="text-white font-medium">
                      {CAREER_DIRECTIONS.find(d => d.id === careerDirection)?.title || 'Not set'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Target Role</p>
                  <p className="text-white font-medium">{targetRole || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Professional Identity</p>
                  <p className="text-white/90 text-sm">
                    {professionalTitle 
                      ? `${professionalTitle}${yearsExperience ? ` • ${yearsExperience}` : ''}`
                      : 'Not set'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Strengths</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedStrengths.map(id => (
                        <Badge 
                          key={id}
                          className="text-xs"
                          style={{ 
                            backgroundColor: 'rgba(170, 70, 170, 0.2)',
                            color: 'rgb(200, 130, 200)'
                          }}
                        >
                          {STRENGTH_OPTIONS.find(s => s.id === id)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Focus Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedBlockers.map(id => (
                        <Badge 
                          key={id}
                          className="text-xs"
                          style={{ 
                            backgroundColor: 'rgba(80, 160, 170, 0.2)',
                            color: PILLAR3_ACCENT
                          }}
                        >
                          {BLOCKER_OPTIONS.find(b => b.id === id)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {careerGoal && (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Career Goal</p>
                    <p className="text-white/90 text-sm">{careerGoal}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-[2px] bg-white/5 border border-white/10 p-6">
              <h4 className="font-bold text-white mb-4">What happens next?</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(200, 130, 200)' }}
                  >
                    1
                  </div>
                  <p className="text-white/80">Tu Tarjeta de Espejo de Carrera será guardada y referenciada en todo tu entrenamiento</p>
                </li>
                <li className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(200, 130, 200)' }}
                  >
                    2
                  </div>
                  <p className="text-white/80">Siguiente module (Laboratorio de Minería de Valor) will help you discover achievements that match your strengths</p>
                </li>
                <li className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(200, 130, 200)' }}
                  >
                    3
                  </div>
                  <p className="text-white/80">Your focus areas will be specifically addressed in later modules</p>
                </li>
              </ul>
            </Card>

            {!isCompleted && (
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="card-saved"
                  checked={cardSaved}
                  onChange={(e) => setCardSaved(e.target.checked)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: PILLAR3_PRIMARY }}
                />
                <label htmlFor="card-saved" className="text-white/80">
                  I confirm my Espejo de Carrera Card is accurate and ready to save
                </label>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
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

      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <Badge 
            style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: PILLAR3_PRIMARY, borderColor: 'rgba(170, 70, 170, 0.4)' }}
            className="border"
          >
            Module 1 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <User className="w-6 h-6" style={{ color: 'rgb(200, 130, 200)' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Espejo de Carrera</h1>
              <p className="text-white/60">Módulo de autodescubrimiento • Sin entrevista requerida</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Understand your professional profile, your Basic Level diagnosis, your strengths, 
            blockers, and how interviewers may perceive you.
          </p>
        </div>

        {/* Progreso */}
        <Card 
          className="rounded-[2px] bg-white/5 p-4 border"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span style={{ color: PILLAR3_PRIMARY }}>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${PILLAR3_PRIMARY}, rgba(170, 70, 170, 0.7))`
              }}
            />
          </div>
          <p className="text-xs text-white/50 mt-2">
            {completedSteps.length} of {ACTIVITIES.length} activities completed
          </p>
        </Card>

        {/* Activities */}
        <div className="space-y-4">
          {ACTIVITIES.map((activity, index) => {
            const isCompleted = completedSteps.includes(index)
            const isCurrent = currentStep === index
            const isLocked = index > currentStep && !isCompleted
            const isExpanded = expandedStep === index
            const ActivityIcon = activity.icon

            return (
              <Card 
                key={index}
                className="rounded-[2px] transition-all border overflow-hidden"
                style={{
                  backgroundColor: isCompleted 
                    ? 'rgba(170, 70, 170, 0.1)' 
                    : isCurrent 
                      ? 'rgba(80, 160, 170, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isCompleted
                    ? 'rgba(170, 70, 170, 0.4)'
                    : isCurrent
                      ? 'rgba(80, 160, 170, 0.4)'
                      : 'rgba(255, 255, 255, 0.1)',
                  opacity: isLocked ? 0.5 : 1
                }}
              >
                <button
                  onClick={() => !isLocked && toggleStep(index)}
                  disabled={isLocked}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isCompleted
                          ? 'rgba(170, 70, 170, 0.3)'
                          : isCurrent
                            ? 'rgba(80, 160, 170, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: isCompleted
                          ? 'rgb(200, 130, 200)'
                          : isCurrent
                            ? PILLAR3_ACCENT
                            : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <ActivityIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{activity.title}</h3>
                        {!isLocked && (
                          isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-white/50" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-white/50" />
                          )
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{activity.description}</p>
                    </div>
                  </div>
                </button>

                {isExpanded && !isLocked && (
                  <div className="px-6 pb-6">
                    {renderActivityContent(index)}
                    
                    {!isCompleted && (
                      <Button 
                        onClick={() => completeStep(index)}
                        disabled={!canCompleteStep(index)}
                        className="rounded-[20px] mt-6 text-white"
                        style={{ 
                          backgroundColor: canCompleteStep(index) ? PILLAR3_PRIMARY : 'rgba(170, 70, 170, 0.3)',
                          cursor: canCompleteStep(index) ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Completar Actividad
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Complete Module */}
        {completedSteps.length === ACTIVITIES.length && (
          <Card 
            className="rounded-[2px] p-6 text-center space-y-4 border"
            style={{ 
              backgroundColor: 'rgba(170, 70, 170, 0.15)',
              borderColor: 'rgba(170, 70, 170, 0.4)'
            }}
          >
            <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: PILLAR3_PRIMARY }} />
            <h3 className="text-xl font-bold text-white">All Activities Completed!</h3>
            <p className="text-white/70">
              You&apos;ve earned {MODULE_XP} XP and unlocked Laboratorio de Minería de Valor.
            </p>
            <Button 
              onClick={handleComplete} 
              className="rounded-[20px] text-white"
              style={{ backgroundColor: PILLAR3_PRIMARY }}
            >
              Completar Módulo y Play
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
