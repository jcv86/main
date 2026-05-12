'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, FileText, Lightbulb, 
  ChevronDown, ChevronUp, User, Briefcase, GraduationCap, 
  Award, Languages, Mail, Phone, MapPin, Linkedin, Eye, Download
} from 'lucide-react'

const MODULE_XP = 120

// CV Sections with guidance
const CV_SECTIONS = [
  {
    id: 'contact',
    title: 'Contact Information',
    icon: User,
    description: 'Make it easy for recruiters to reach you',
    fields: [
      { key: 'fullName', label: 'Full Name', placeholder: 'Juan Carlos Mendoza', required: true },
      { key: 'email', label: 'Professional Email', placeholder: 'juan.mendoza@email.com', required: true },
      { key: 'phone', label: 'Phone Number', placeholder: '+52 55 1234 5678', required: true },
      { key: 'location', label: 'City, Country', placeholder: 'Mexico City, Mexico', required: true },
      { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/juanmendoza', required: false },
    ],
    tips: [
      'Use a professional email (firstname.lastname@email.com)',
      'Include country code for international opportunities',
      'LinkedIn is almost mandatory for professional roles',
      'Avoid including age, photo, or marital status'
    ]
  },
  {
    id: 'summary',
    title: 'Professional Summary',
    icon: FileText,
    description: 'Your 3-second pitch to grab attention',
    tips: [
      'Keep it to 2-3 sentences maximum',
      'Include your title, years of experience, and top skills',
      'Mention your target role or industry',
      'Avoid generic phrases like "responsible" or "team player"'
    ],
    examples: {
      weak: 'Responsible and proactive person looking for growth opportunities in a dynamic company.',
      strong: 'Operations Coordinator with 4+ years managing cross-functional projects in fintech. Specialized in process optimization and team coordination. Seeking senior operations role in growing tech company.'
    },
    template: '[Your Title] with [X years] experience in [industry/area]. Specialized in [top 2-3 skills]. [Career goal or target role].'
  },
  {
    id: 'experience',
    title: 'Work Experience',
    icon: Briefcase,
    description: 'Transform tasks into achievements',
    tips: [
      'Start each bullet with an action verb (Led, Managed, Created, Improved)',
      'Include numbers and metrics whenever possible',
      'Focus on results, not just responsibilities',
      'Use the achievements from Value Mining Lab',
      'Most recent experience first (reverse chronological)'
    ],
    bulletFormulas: [
      { name: 'Result-First', template: 'Achieved [result] by [action] using [method/tool]' },
      { name: 'Action-Impact', template: '[Action verb] [what] resulting in [impact/metric]' },
      { name: 'Problem-Solution', template: 'Resolved [problem] by [implementing solution], leading to [outcome]' }
    ],
    examples: {
      weak: 'Responsible for managing client accounts and answering emails',
      strong: 'Managed portfolio of 45+ client accounts ($2M+ annually), achieving 95% retention rate through proactive communication and issue resolution'
    }
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Academic credentials and relevant training',
    tips: [
      'Include degree, institution, and graduation year',
      'Add relevant coursework only if recent graduate',
      'Include GPA only if 3.5+ or equivalent',
      'Certifications can go here or in separate section'
    ]
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: Award,
    description: 'Keywords recruiters are searching for',
    categories: [
      { name: 'Technical Skills', key: 'technical', examples: ['Excel Advanced', 'SQL', 'Python', 'Salesforce', 'SAP', 'Google Analytics'] },
      { name: 'Tools & Software', key: 'tools', examples: ['Microsoft Office Suite', 'Slack', 'Trello', 'Jira', 'Figma', 'Notion'] },
      { name: 'Methodologies', key: 'methodologies', examples: ['Agile/Scrum', 'Lean Six Sigma', 'Design Thinking', 'OKRs'] },
      { name: 'Soft Skills', key: 'soft', examples: ['Team Leadership', 'Cross-functional Collaboration', 'Stakeholder Management'] }
    ],
    tips: [
      'Mirror keywords from job descriptions',
      'Group skills by category',
      'Prioritize hard skills over soft skills',
      'Include proficiency levels if relevant'
    ]
  }
]

// ATS Optimization checklist
const ATS_CHECKLIST = [
  { id: 'format', text: 'Use simple formatting (no tables, columns, or graphics)', critical: true },
  { id: 'fonts', text: 'Stick to standard fonts (Arial, Calibri, Times New Roman)', critical: true },
  { id: 'keywords', text: 'Include keywords from the job description', critical: true },
  { id: 'sections', text: 'Use clear section headings (Experience, Education, Skills)', critical: true },
  { id: 'bullets', text: 'Use standard bullet points (•)', critical: false },
  { id: 'dates', text: 'Format dates consistently (MM/YYYY or Month YYYY)', critical: false },
  { id: 'file', text: 'Save as PDF with text (not image)', critical: true },
  { id: 'length', text: 'Keep to 1-2 pages maximum', critical: false },
  { id: 'contact', text: 'Contact info at the top, not in headers/footers', critical: true },
  { id: 'acronyms', text: 'Spell out acronyms at least once', critical: false }
]

// Professional summary templates by role type
const SUMMARY_TEMPLATES = [
  {
    type: 'Career Starter',
    template: 'Recent [Degree] graduate with strong foundation in [field]. Completed internship/projects in [area] developing skills in [skills]. Eager to contribute to [target area] in a growing organization.'
  },
  {
    type: 'Career Changer',
    template: 'Professional transitioning from [previous field] to [new field], bringing [X years] of transferable experience in [relevant skills]. Completed [certification/training] to build expertise in [new area].'
  },
  {
    type: 'Experienced Professional',
    template: '[Title] with [X years] driving results in [industry]. Track record of [key achievement]. Expertise in [top skills]. Seeking [target role] to [career goal].'
  },
  {
    type: 'Technical Role',
    template: '[Technical Title] with [X years] building [type of solutions/systems]. Proficient in [technologies]. [Key achievement with metrics]. Looking to [career goal] at [company type].'
  }
]

export default function CVBuilderStudioModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>('contact')
  
  // CV Data
  const [cvData, setCvData] = useState({
    contact: { fullName: '', email: '', phone: '', location: '', linkedin: '' },
    summary: '',
    selectedTemplate: '',
    experiences: [
      { company: '', title: '', dates: '', bullets: ['', '', ''] },
      { company: '', title: '', dates: '', bullets: ['', '', ''] }
    ],
    education: [{ institution: '', degree: '', year: '', details: '' }],
    skills: { technical: [], tools: [], methodologies: [], soft: [] },
    atsChecklist: [] as string[]
  })
  
  const [showPreview, setShowPreview] = useState(false)

  const REQUIRED_ACTIVITIES = [
    'Complete contact information',
    'Write professional summary',
    'Build experience section with 3+ bullets',
    'Organize skills by category',
    'Complete ATS optimization checklist'
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

  const updateContact = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }))
  }

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    setCvData(prev => {
      const newExperiences = [...prev.experiences]
      newExperiences[index] = { ...newExperiences[index], [field]: value }
      return { ...prev, experiences: newExperiences }
    })
  }

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setCvData(prev => {
      const newExperiences = [...prev.experiences]
      const newBullets = [...newExperiences[expIndex].bullets]
      newBullets[bulletIndex] = value
      newExperiences[expIndex] = { ...newExperiences[expIndex], bullets: newBullets }
      return { ...prev, experiences: newExperiences }
    })
  }

  const toggleSkill = (category: string, skill: string) => {
    setCvData(prev => {
      const currentSkills = prev.skills[category as keyof typeof prev.skills] as string[]
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill]
      return { ...prev, skills: { ...prev.skills, [category]: newSkills } }
    })
  }

  const toggleAtsItem = (id: string) => {
    setCvData(prev => ({
      ...prev,
      atsChecklist: prev.atsChecklist.includes(id)
        ? prev.atsChecklist.filter(i => i !== id)
        : [...prev.atsChecklist, id]
    }))
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

  const isContactComplete = () => {
    const { fullName, email, phone, location } = cvData.contact
    return fullName && email && phone && location
  }

  const isSummaryComplete = () => cvData.summary.length >= 50
  
  const isExperienceComplete = () => {
    return cvData.experiences[0].company && 
           cvData.experiences[0].title && 
           cvData.experiences[0].bullets.filter(b => b.length > 0).length >= 3
  }

  const isSkillsComplete = () => {
    const totalSkills = Object.values(cvData.skills).flat().length
    return totalSkills >= 6
  }

  const isAtsComplete = () => {
    const criticalItems = ATS_CHECKLIST.filter(item => item.critical)
    return criticalItems.every(item => cvData.atsChecklist.includes(item.id))
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview CV'}
            </Button>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              Module 3 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <FileText className="w-6 h-6 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CV Builder Studio</h1>
              <p className="text-white/60">Document-building module • No interview required</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Build a clear, recruiter-friendly CV that showcases the value you discovered in Value Mining Lab. 
            Learn ATS optimization to ensure your CV passes automated screening systems.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Recruiters spend an average of <span className="text-[rgb(170,70,170)] font-semibold">6-7 seconds</span> on initial CV scan. 
                Your CV must communicate quickly and clearly. Before a human sees your CV, 
                it often passes through an ATS (Applicant Tracking System) that filters based on keywords.
              </p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progress</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-white/50 text-sm mt-2">{completedSteps.length} of {REQUIRED_ACTIVITIES.length} activities completed</p>
        </Card>

        {/* CV Preview Modal */}
        {showPreview && (
          <Card className="rounded-[2px] bg-white border-[rgba(170,70,170,0.3)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">CV Preview</h3>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
            <div className="bg-white text-gray-900 p-6 border rounded-lg space-y-4">
              {/* Contact */}
              <div className="text-center border-b pb-4">
                <h1 className="text-xl font-bold">{cvData.contact.fullName || 'Your Name'}</h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                  {cvData.contact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{cvData.contact.email}</span>}
                  {cvData.contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{cvData.contact.phone}</span>}
                  {cvData.contact.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cvData.contact.location}</span>}
                  {cvData.contact.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{cvData.contact.linkedin}</span>}
                </div>
              </div>
              {/* Summary */}
              {cvData.summary && (
                <div>
                  <h2 className="font-bold text-sm uppercase text-gray-500 mb-1">Professional Summary</h2>
                  <p className="text-sm">{cvData.summary}</p>
                </div>
              )}
              {/* Experience */}
              {cvData.experiences[0].company && (
                <div>
                  <h2 className="font-bold text-sm uppercase text-gray-500 mb-2">Experience</h2>
                  {cvData.experiences.filter(exp => exp.company).map((exp, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-sm">{exp.title}</span>
                        <span className="text-xs text-gray-500">{exp.dates}</span>
                      </div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                      <ul className="text-sm mt-1 space-y-1">
                        {exp.bullets.filter(b => b).map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {/* Skills */}
              {Object.values(cvData.skills).flat().length > 0 && (
                <div>
                  <h2 className="font-bold text-sm uppercase text-gray-500 mb-1">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(cvData.skills).flat().map((skill, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Activity 1: Contact Information */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(0) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 0 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'contact' ? null : 'contact')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(0) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(0) ? <CheckCircle2 className="w-5 h-5" /> : <span>1</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Complete Contact Information</h3>
                <p className="text-white/50 text-sm">Make it easy for recruiters to reach you</p>
              </div>
            </div>
            {expandedSection === 'contact' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'contact' && (
            <div className="mt-6 space-y-4">
              {/* Tips */}
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-3">
                <p className="text-[rgb(80,160,170)] text-sm font-medium mb-2">Pro Tips:</p>
                <ul className="text-white/60 text-sm space-y-1">
                  {CV_SECTIONS[0].tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[rgb(80,160,170)]">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                {CV_SECTIONS[0].fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-white/70 text-sm mb-1 block">
                      {field.label} {field.required && <span className="text-[rgb(170,70,170)]">*</span>}
                    </label>
                    <input
                      type="text"
                      value={cvData.contact[field.key as keyof typeof cvData.contact]}
                      onChange={(e) => updateContact(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => completeStep(0)}
                disabled={!isContactComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Complete Contact Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 2: Professional Summary */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(1) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 1 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(1) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(1) ? <CheckCircle2 className="w-5 h-5" /> : <span>2</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Write Professional Summary</h3>
                <p className="text-white/50 text-sm">Your 3-second pitch to grab attention</p>
              </div>
            </div>
            {expandedSection === 'summary' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'summary' && (
            <div className="mt-6 space-y-4">
              {/* Example comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-xs uppercase font-medium mb-1">Weak Summary</p>
                  <p className="text-white/60 text-sm italic">{CV_SECTIONS[1].examples?.weak}</p>
                </div>
                <div className="bg-[rgba(170,70,170,0.15)] border border-[rgba(170,70,170,0.4)] rounded-lg p-3">
                  <p className="text-[rgb(200,130,200)] text-xs uppercase font-medium mb-1">Strong Summary</p>
                  <p className="text-white/70 text-sm italic">{CV_SECTIONS[1].examples?.strong}</p>
                </div>
              </div>
              
              {/* Templates */}
              <div className="space-y-2">
                <p className="text-white/70 text-sm">Choose a template that fits your situation:</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {SUMMARY_TEMPLATES.map((template) => (
                    <button
                      key={template.type}
                      onClick={() => setCvData(prev => ({ ...prev, selectedTemplate: template.type, summary: template.template }))}
                      className={`p-3 rounded-lg text-left transition-all ${
                        cvData.selectedTemplate === template.type
                          ? 'bg-[rgba(170,70,170,0.2)] border border-[rgba(170,70,170,0.4)]'
                          : 'bg-white/5 border border-white/10 hover:border-white/30'
                      }`}
                    >
                      <p className="text-white text-sm font-medium">{template.type}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Summary Input */}
              <div>
                <label className="text-white/70 text-sm mb-1 block">Your Professional Summary</label>
                <textarea
                  value={cvData.summary}
                  onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write your 2-3 sentence professional summary..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30 min-h-24"
                />
                <p className="text-white/50 text-xs mt-1">{cvData.summary.length} characters (minimum 50)</p>
              </div>
              
              <Button 
                onClick={() => completeStep(1)}
                disabled={!isSummaryComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Complete Summary
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 3: Experience Section */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(2) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 2 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'experience' ? null : 'experience')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(2) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(2) ? <CheckCircle2 className="w-5 h-5" /> : <span>3</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Build Experience Section</h3>
                <p className="text-white/50 text-sm">Transform tasks into achievements with 3+ bullet points</p>
              </div>
            </div>
            {expandedSection === 'experience' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'experience' && (
            <div className="mt-6 space-y-6">
              {/* Bullet formulas */}
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-4">
                <p className="text-[rgb(80,160,170)] text-sm font-medium mb-2">Achievement Bullet Formulas:</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {CV_SECTIONS[2].bulletFormulas?.map((formula) => (
                    <div key={formula.name} className="bg-white/5 rounded-lg p-2">
                      <p className="text-white text-sm font-medium">{formula.name}</p>
                      <p className="text-white/50 text-xs">{formula.template}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Example */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-xs uppercase font-medium mb-1">Task-focused (Weak)</p>
                  <p className="text-white/60 text-sm">{CV_SECTIONS[2].examples?.weak}</p>
                </div>
                <div className="bg-[rgba(170,70,170,0.15)] border border-[rgba(170,70,170,0.4)] rounded-lg p-3">
                  <p className="text-[rgb(200,130,200)] text-xs uppercase font-medium mb-1">Achievement-focused (Strong)</p>
                  <p className="text-white/70 text-sm">{CV_SECTIONS[2].examples?.strong}</p>
                </div>
              </div>
              
              {/* Experience inputs */}
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                  <p className="text-white font-medium">Most Recent Position</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={cvData.experiences[0].title}
                      onChange={(e) => updateExperience(0, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                    />
                    <input
                      type="text"
                      value={cvData.experiences[0].company}
                      onChange={(e) => updateExperience(0, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                    />
                    <input
                      type="text"
                      value={cvData.experiences[0].dates}
                      onChange={(e) => updateExperience(0, 'dates', e.target.value)}
                      placeholder="Jan 2022 - Present"
                      className="bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/70 text-sm">Achievement Bullets (at least 3):</p>
                    {cvData.experiences[0].bullets.map((bullet, i) => (
                      <input
                        key={i}
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBullet(0, i, e.target.value)}
                        placeholder={`Achievement ${i + 1}: Start with action verb (Led, Managed, Created...)`}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/30"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => completeStep(2)}
                disabled={!isExperienceComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Complete Experience Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 4: Skills Section */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(3) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 3 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'skills' ? null : 'skills')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(3) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(3) ? <CheckCircle2 className="w-5 h-5" /> : <span>4</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Organize Skills by Category</h3>
                <p className="text-white/50 text-sm">Select at least 6 skills across categories</p>
              </div>
            </div>
            {expandedSection === 'skills' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'skills' && (
            <div className="mt-6 space-y-4">
              <p className="text-white/70 text-sm">Click to select skills. These should mirror keywords from job descriptions you&apos;re targeting.</p>
              
              {CV_SECTIONS[4].categories?.map((category) => (
                <div key={category.name} className="space-y-2">
                  <p className="text-white text-sm font-medium">{category.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((skill) => {
                      const categoryKey = category.key as keyof typeof cvData.skills
                      const isSelected = (cvData.skills[categoryKey] || []).includes(skill)
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(categoryKey, skill)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            isSelected
                              ? 'bg-[rgb(170,70,170)] text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              
              <p className="text-white/50 text-sm">
                Selected: {Object.values(cvData.skills).flat().length} skills (minimum 6)
              </p>
              
              <Button 
                onClick={() => completeStep(3)}
                disabled={!isSkillsComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Complete Skills Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Activity 5: ATS Optimization */}
        <Card className={`rounded-[2px] p-6 transition-all ${
          completedSteps.includes(4) 
            ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
            : currentStep === 4 
              ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
              : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'ats' ? null : 'ats')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.includes(4) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
              }`}>
                {completedSteps.includes(4) ? <CheckCircle2 className="w-5 h-5" /> : <span>5</span>}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">ATS Optimization Checklist</h3>
                <p className="text-white/50 text-sm">Ensure your CV passes automated screening</p>
              </div>
            </div>
            {expandedSection === 'ats' ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          
          {expandedSection === 'ats' && (
            <div className="mt-6 space-y-4">
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-3">
                <p className="text-[rgb(80,160,170)] text-sm">
                  <strong>What is ATS?</strong> Applicant Tracking Systems are software that companies use to filter CVs 
                  before a human sees them. Up to 75% of CVs are rejected by ATS before reaching a recruiter.
                </p>
              </div>
              
              <div className="space-y-2">
                {ATS_CHECKLIST.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleAtsItem(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      cvData.atsChecklist.includes(item.id)
                        ? 'bg-[rgba(170,70,170,0.15)] border border-[rgba(170,70,170,0.4)]'
                        : 'bg-white/5 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      cvData.atsChecklist.includes(item.id)
                        ? 'bg-[rgb(170,70,170)] text-white'
                        : 'border border-white/30'
                    }`}>
                      {cvData.atsChecklist.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="text-white/80 text-sm text-left flex-1">{item.text}</span>
                    {item.critical && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Critical</Badge>
                    )}
                  </button>
                ))}
              </div>
              
              <Button 
                onClick={() => completeStep(4)}
                disabled={!isAtsComplete()}
                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
              >
                Complete ATS Checklist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Complete Module */}
        {completedSteps.length === REQUIRED_ACTIVITIES.length && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">CV Builder Studio Complete!</h3>
            <p className="text-white/70">
              You&apos;ve built a professional, ATS-optimized CV structure. Earned {MODULE_XP} XP!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowPreview(true)} className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]">
                <Eye className="w-4 h-4 mr-2" />
                Preview CV
              </Button>
              <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
                Continue to Job Decoder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
