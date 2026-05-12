'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Gem, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Star,
  AlertCircle
} from 'lucide-react'

const MODULE_XP = 100

// Value Mining methodology
const VALUE_CATEGORIES = [
  {
    id: 'time',
    name: 'Time Savings',
    description: 'Did you make something faster or save time?',
    examples: ['Reduced processing time', 'Streamlined workflows', 'Automated repetitive tasks'],
    prompts: ['How much time was saved?', 'How often did this happen?', 'Who benefited?']
  },
  {
    id: 'money',
    name: 'Cost Reduction',
    description: 'Did you help save money or reduce expenses?',
    examples: ['Negotiated better rates', 'Reduced waste', 'Found more efficient solutions'],
    prompts: ['Approximate savings?', 'Percentage reduction?', 'Budget impact?']
  },
  {
    id: 'quality',
    name: 'Quality Improvement',
    description: 'Did you improve quality or reduce errors?',
    examples: ['Fewer complaints', 'Better accuracy', 'Higher standards'],
    prompts: ['Error reduction?', 'Quality metrics?', 'Customer feedback?']
  },
  {
    id: 'growth',
    name: 'Growth & Revenue',
    description: 'Did you help grow the business or increase revenue?',
    examples: ['New clients', 'Increased sales', 'Expanded market reach'],
    prompts: ['New business generated?', 'Growth percentage?', 'Number of new clients?']
  },
  {
    id: 'people',
    name: 'Team & People Impact',
    description: 'Did you help people succeed or improve the team?',
    examples: ['Trained colleagues', 'Improved morale', 'Better collaboration'],
    prompts: ['How many people?', 'What changed for them?', 'Team outcomes?']
  },
  {
    id: 'process',
    name: 'Process Innovation',
    description: 'Did you create or improve a process?',
    examples: ['New procedures', 'Better systems', 'Standardized practices'],
    prompts: ['What was created?', 'Who uses it now?', 'What problem did it solve?']
  }
]

// Transformation formulas
const TRANSFORMATION_FORMULAS = [
  {
    name: 'CAR Method',
    description: 'Challenge → Action → Result',
    template: 'Faced [challenge]. I [action]. This resulted in [result].',
    example: 'Faced increasing customer complaints about response time. I created a priority queue system and trained the team. This resulted in 40% faster response times.'
  },
  {
    name: 'PAR Method',
    description: 'Problem → Action → Result',
    template: '[Problem] was happening. I [action]. As a result, [outcome].',
    example: 'Data entry errors were causing billing issues. I implemented a double-check system. As a result, errors dropped by 60%.'
  },
  {
    name: 'Value Bridge',
    description: 'Task → Impact → Benefit',
    template: 'I [task], which [impact], helping [benefit].',
    example: 'I organized weekly team meetings, which improved communication and project visibility, helping reduce missed deadlines by 30%.'
  }
]

// Sample tasks to inspire users
const SAMPLE_TASKS = [
  { task: 'Answered customer calls', weak: true },
  { task: 'Created spreadsheets', weak: true },
  { task: 'Attended meetings', weak: true },
  { task: 'Sent emails', weak: true },
  { task: 'Filed documents', weak: true },
  { task: 'Trained new employees', weak: false },
  { task: 'Managed a project', weak: false },
  { task: 'Improved a process', weak: false }
]

interface TaskEntry {
  task: string
  valueCategory: string
  impact: string
  transformed: string
}

interface Achievement {
  title: string
  situation: string
  action: string
  result: string
  formula: string
  isSelected: boolean
}

export default function ValueMiningLabModule() {
  const router = useRouter()
  const [expandedActivity, setExpandedActivity] = useState<number | null>(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  
  // Activity 1: Write tasks
  const [tasks, setTasks] = useState<TaskEntry[]>([
    { task: '', valueCategory: '', impact: '', transformed: '' },
    { task: '', valueCategory: '', impact: '', transformed: '' },
    { task: '', valueCategory: '', impact: '', transformed: '' },
    { task: '', valueCategory: '', impact: '', transformed: '' },
    { task: '', valueCategory: '', impact: '', transformed: '' }
  ])
  
  // Activity 2: Value categories selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Activity 3: Transformations
  const [transformations, setTransformations] = useState<string[]>(['', '', '', '', ''])
  
  // Activity 4: Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    { title: '', situation: '', action: '', result: '', formula: 'CAR', isSelected: false },
    { title: '', situation: '', action: '', result: '', formula: 'CAR', isSelected: false },
    { title: '', situation: '', action: '', result: '', formula: 'CAR', isSelected: false }
  ])
  
  // Activity 5: Selected story
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null)

  const ACTIVITIES = [
    {
      title: 'Write 5 Tasks from Your Experience',
      description: 'List everyday tasks you performed in previous jobs. Don\'t worry if they seem basic - we\'ll transform them.',
      icon: Target
    },
    {
      title: 'Discover Hidden Value',
      description: 'Identify what type of value each task created. Every task has impact, even if it\'s not obvious.',
      icon: Gem
    },
    {
      title: 'Transform Tasks into Value Statements',
      description: 'Use proven formulas to rewrite your tasks as compelling achievement statements.',
      icon: Sparkles
    },
    {
      title: 'Build 3 Achievement Stories',
      description: 'Create structured achievement stories using the CAR or PAR method.',
      icon: Award
    },
    {
      title: 'Select Your Strongest Story',
      description: 'Choose the achievement that best represents your value for future interviews.',
      icon: Star
    }
  ]

  const progress = Math.round((completedSteps.length / ACTIVITIES.length) * 100)

  const toggleActivity = (index: number) => {
    setExpandedActivity(expandedActivity === index ? null : index)
  }

  const canCompleteActivity = (index: number): boolean => {
    switch (index) {
      case 0:
        return tasks.filter(t => t.task.trim().length > 0).length >= 5
      case 1:
        return selectedCategories.length >= 3
      case 2:
        return transformations.filter(t => t.trim().length > 0).length >= 3
      case 3:
        return achievements.filter(a => 
          a.title.trim() && a.situation.trim() && a.action.trim() && a.result.trim()
        ).length >= 2
      case 4:
        return selectedStoryIndex !== null
      default:
        return false
    }
  }

  const completeActivity = (index: number) => {
    if (!completedSteps.includes(index) && canCompleteActivity(index)) {
      setCompletedSteps([...completedSteps, index])
      if (index < ACTIVITIES.length - 1) {
        setExpandedActivity(index + 1)
      }
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'value-mining-lab', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: ACTIVITIES.length
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
      
      router.push('/despega/a3?completed=value-mining-lab')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=value-mining-lab')
    }
  }

  const updateTask = (index: number, field: keyof TaskEntry, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: value }
    setTasks(newTasks)
  }

  const updateAchievement = (index: number, field: keyof Achievement, value: string | boolean) => {
    const newAchievements = [...achievements]
    newAchievements[index] = { ...newAchievements[index], [field]: value }
    setAchievements(newAchievements)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] border-[rgba(170,70,170,0.3)]">
            Module 2 of 10 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <Gem className="w-7 h-7 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Laboratorio de Minería de Valor</h1>
              <p className="text-white/60">Achievement discovery lab • Optional AI coach available</p>
            </div>
          </div>
          <p className="text-white/70 text-lg">
            Every job, no matter how simple, creates value. In this lab, you&apos;ll learn to uncover 
            the hidden impact of your work and transform ordinary tasks into compelling achievements.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.1)] border-[rgba(80,160,170,0.3)] p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">The Value Mining Principle</p>
              <p className="text-white/70 text-sm mt-1">
                <strong className="text-[rgb(80,160,170)]">Task</strong> = What you did. 
                <strong className="text-[rgb(170,70,170)] ml-2">Value</strong> = Why it mattered.
                <br />
                Interviewers don&apos;t want to know what you did—they want to know what changed because of you.
                You don&apos;t need exact numbers. Estimates, percentages, and qualitative improvements all count.
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
          <p className="text-white/50 text-xs mt-2">{completedSteps.length} of {ACTIVITIES.length} activities completed</p>
        </Card>

        {/* Transformation Example */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-5">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Example Transformation</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-[2px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm font-medium">Before (Task Only)</p>
              </div>
              <p className="text-white/70">&quot;I answered customer emails.&quot;</p>
            </div>
            <div className="bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] border rounded-[2px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[rgb(200,130,200)]" />
                <p className="text-[rgb(200,130,200)] text-sm font-medium">After (Value Statement)</p>
              </div>
              <p className="text-white/70">
                &quot;Managed customer communications, maintaining a 95% satisfaction rate and 
                reducing average response time from 24 hours to 4 hours.&quot;
              </p>
            </div>
          </div>
        </Card>

        {/* Activities */}
        <div className="space-y-4">
          {ACTIVITIES.map((activity, index) => {
            const isCompleted = completedSteps.includes(index)
            const isExpanded = expandedActivity === index
            const isLocked = index > 0 && !completedSteps.includes(index - 1) && !isCompleted
            const Icon = activity.icon

            return (
              <Card 
                key={index}
                className={`rounded-[2px] transition-all overflow-hidden ${
                  isCompleted 
                    ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]' 
                    : isLocked
                      ? 'bg-white/[0.02] border-white/5 opacity-60'
                      : 'bg-white/5 border-white/10'
                }`}
              >
                {/* Activity Header */}
                <button
                  onClick={() => !isLocked && toggleActivity(index)}
                  disabled={isLocked}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-[rgba(170,70,170,0.2)]'
                      : 'bg-white/10'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[rgb(200,130,200)]" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isLocked ? 'text-white/30' : 'text-white/60'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-sm">{index + 1}</span>
                      <h3 className={`font-semibold ${isLocked ? 'text-white/40' : 'text-white'}`}>
                        {activity.title}
                      </h3>
                      {isCompleted && (
                        <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] text-xs">
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isLocked ? 'text-white/30' : 'text-white/60'}`}>
                      {activity.description}
                    </p>
                  </div>
                  {!isLocked && (
                    isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    )
                  )}
                </button>

                {/* Activity Content */}
                {isExpanded && !isLocked && (
                  <div className="px-5 pb-5 border-t border-white/10">
                    {/* Activity 1: Write Tasks */}
                    {index === 0 && (
                      <div className="pt-5 space-y-4">
                        <div className="bg-white/5 rounded-[2px] p-4">
                          <p className="text-white/70 text-sm mb-3">
                            Think about your previous jobs, internships, or even volunteer work. 
                            What did you do on a daily or weekly basis? Comenzar with simple tasks.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {SAMPLE_TASKS.map((sample, i) => (
                              <Badge 
                                key={i}
                                className={`cursor-pointer transition-all ${
                                  sample.weak 
                                    ? 'bg-white/10 text-white/60 hover:bg-white/20' 
                                    : 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]'
                                }`}
                                onClick={() => {
                                  const emptyIndex = tasks.findIndex(t => !t.task.trim())
                                  if (emptyIndex !== -1) {
                                    updateTask(emptyIndex, 'task', sample.task)
                                  }
                                }}
                              >
                                {sample.task}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-sm flex-shrink-0">
                                {i + 1}
                              </div>
                              <input
                                type="text"
                                value={task.task}
                                onChange={(e) => updateTask(i, 'task', e.target.value)}
                                placeholder={`Task ${i + 1}: What did you do regularly?`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-white placeholder:text-white/30 focus:border-[rgba(170,70,170,0.5)] focus:outline-none"
                              />
                              {task.task.trim() && (
                                <CheckCircle2 className="w-5 h-5 text-[rgb(170,70,170)]" />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-white/50 text-sm">
                            {tasks.filter(t => t.task.trim()).length} of 5 tasks written
                          </p>
                          <Button
                            onClick={() => completeActivity(0)}
                            disabled={!canCompleteActivity(0)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Activity 2: Discover Value */}
                    {index === 1 && (
                      <div className="pt-5 space-y-4">
                        <p className="text-white/70 text-sm">
                          Look at your tasks and identify what type of value they created. 
                          Select at least 3 categories that apply to your experience.
                        </p>

                        <div className="grid md:grid-cols-2 gap-3">
                          {VALUE_CATEGORIES.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => {
                                if (selectedCategories.includes(category.id)) {
                                  setSelectedCategories(selectedCategories.filter(c => c !== category.id))
                                } else {
                                  setSelectedCategories([...selectedCategories, category.id])
                                }
                              }}
                              className={`text-left p-4 rounded-[2px] border transition-all ${
                                selectedCategories.includes(category.id)
                                  ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]'
                                  : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className={`font-medium ${
                                    selectedCategories.includes(category.id) 
                                      ? 'text-[rgb(200,130,200)]' 
                                      : 'text-white'
                                  }`}>
                                    {category.name}
                                  </p>
                                  <p className="text-white/60 text-sm mt-1">{category.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {category.examples.map((ex, i) => (
                                      <span key={i} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
                                        {ex}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {selectedCategories.includes(category.id) && (
                                  <CheckCircle2 className="w-5 h-5 text-[rgb(170,70,170)] flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-white/50 text-sm">
                            {selectedCategories.length} of 3+ categories selected
                          </p>
                          <Button
                            onClick={() => completeActivity(1)}
                            disabled={!canCompleteActivity(1)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Activity 3: Transform Tasks */}
                    {index === 2 && (
                      <div className="pt-5 space-y-4">
                        <p className="text-white/70 text-sm">
                          Use these formulas to rewrite your tasks as value statements. 
                          Focus on what changed because of your work.
                        </p>

                        {/* Formulas */}
                        <div className="grid md:grid-cols-3 gap-3">
                          {TRANSFORMATION_FORMULAS.map((formula) => (
                            <Card key={formula.name} className="rounded-[2px] bg-[rgba(80,160,170,0.1)] border-[rgba(80,160,170,0.3)] p-4">
                              <p className="text-[rgb(80,160,170)] font-semibold text-sm">{formula.name}</p>
                              <p className="text-white/50 text-xs mt-1">{formula.description}</p>
                              <p className="text-white/70 text-xs mt-2 italic">&quot;{formula.template}&quot;</p>
                            </Card>
                          ))}
                        </div>

                        {/* Transformation inputs */}
                        <div className="space-y-4">
                          {tasks.slice(0, 5).map((task, i) => (
                            task.task.trim() && (
                              <div key={i} className="bg-white/5 rounded-[2px] p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-white/40" />
                                  <p className="text-white/60 text-sm">
                                    Original: <span className="text-white/80">&quot;{task.task}&quot;</span>
                                  </p>
                                </div>
                                <textarea
                                  value={transformations[i]}
                                  onChange={(e) => {
                                    const newTransformations = [...transformations]
                                    newTransformations[i] = e.target.value
                                    setTransformations(newTransformations)
                                  }}
                                  placeholder="Transform this into a value statement... (e.g., 'I [task], which resulted in [impact], benefiting [who].')"
                                  rows={2}
                                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-white placeholder:text-white/30 focus:border-[rgba(170,70,170,0.5)] focus:outline-none resize-none"
                                />
                              </div>
                            )
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-white/50 text-sm">
                            {transformations.filter(t => t.trim()).length} of 3+ transformations written
                          </p>
                          <Button
                            onClick={() => completeActivity(2)}
                            disabled={!canCompleteActivity(2)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Activity 4: Build Achievements */}
                    {index === 3 && (
                      <div className="pt-5 space-y-4">
                        <p className="text-white/70 text-sm">
                          Create 2-3 structured achievement stories. These will become the foundation 
                          for your interview answers in later modules.
                        </p>

                        <div className="space-y-6">
                          {achievements.map((achievement, i) => (
                            <Card key={i} className="rounded-[2px] bg-white/5 border-white/10 p-5 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-white font-medium">Achievement {i + 1}</h4>
                                <select
                                  value={achievement.formula}
                                  onChange={(e) => updateAchievement(i, 'formula', e.target.value)}
                                  className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white/80 text-sm"
                                >
                                  <option value="CAR">CAR Method</option>
                                  <option value="PAR">PAR Method</option>
                                </select>
                              </div>

                              <input
                                type="text"
                                value={achievement.title}
                                onChange={(e) => updateAchievement(i, 'title', e.target.value)}
                                placeholder="Achievement title (e.g., 'Improved customer response time')"
                                className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-2 text-white placeholder:text-white/30 focus:border-[rgba(170,70,170,0.5)] focus:outline-none"
                              />

                              <div className="grid gap-3">
                                <div>
                                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">
                                    {achievement.formula === 'CAR' ? 'Challenge' : 'Problem'}
                                  </label>
                                  <textarea
                                    value={achievement.situation}
                                    onChange={(e) => updateAchievement(i, 'situation', e.target.value)}
                                    placeholder={achievement.formula === 'CAR' 
                                      ? "What challenge did you face?"
                                      : "What problem existed?"
                                    }
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-2 text-white placeholder:text-white/30 focus:border-[rgba(170,70,170,0.5)] focus:outline-none resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">
                                    Action
                                  </label>
                                  <textarea
                                    value={achievement.action}
                                    onChange={(e) => updateAchievement(i, 'action', e.target.value)}
                                    placeholder="What specific action did you take?"
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-2 text-white placeholder:text-white/30 focus:border-[rgba(170,70,170,0.5)] focus:outline-none resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">
                                    Result
                                  </label>
                                  <textarea
                                    value={achievement.result}
                                    onChange={(e) => updateAchievement(i, 'result', e.target.value)}
                                    placeholder="What was the outcome? (Include numbers if possible)"
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-2 text-white placeholder:text-white/30 focus:border-[rgba(170,70,170,0.5)] focus:outline-none resize-none"
                                  />
                                </div>
                              </div>

                              {achievement.title && achievement.situation && achievement.action && achievement.result && (
                                <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-[2px] p-4">
                                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Preview</p>
                                  <p className="text-white/80 text-sm">
                                    <strong className="text-[rgb(200,130,200)]">{achievement.title}:</strong>{' '}
                                    {achievement.situation} {achievement.action} {achievement.result}
                                  </p>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-white/50 text-sm">
                            {achievements.filter(a => a.title && a.situation && a.action && a.result).length} of 2+ achievements created
                          </p>
                          <Button
                            onClick={() => completeActivity(3)}
                            disabled={!canCompleteActivity(3)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Activity 5: Select Strongest Story */}
                    {index === 4 && (
                      <div className="pt-5 space-y-4">
                        <p className="text-white/70 text-sm">
                          Choose your strongest achievement story. This will be your go-to example 
                          for &quot;Tell me about yourself&quot; and similar questions.
                        </p>

                        <div className="space-y-3">
                          {achievements.map((achievement, i) => (
                            achievement.title && achievement.situation && (
                              <button
                                key={i}
                                onClick={() => setSelectedStoryIndex(i)}
                                className={`w-full text-left p-4 rounded-[2px] border transition-all ${
                                  selectedStoryIndex === i
                                    ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <p className={`font-semibold ${
                                      selectedStoryIndex === i ? 'text-[rgb(200,130,200)]' : 'text-white'
                                    }`}>
                                      {achievement.title}
                                    </p>
                                    <p className="text-white/60 text-sm mt-1 line-clamp-2">
                                      {achievement.situation} {achievement.action} {achievement.result}
                                    </p>
                                  </div>
                                  {selectedStoryIndex === i && (
                                    <Star className="w-6 h-6 text-[rgb(170,70,170)] fill-current flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            )
                          ))}
                        </div>

                        {selectedStoryIndex !== null && (
                          <Card className="rounded-[2px] bg-[rgba(80,160,170,0.1)] border-[rgba(80,160,170,0.3)] p-4">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-[rgb(80,160,170)] mt-0.5" />
                              <div>
                                <p className="font-medium text-white">Your Selected Story</p>
                                <p className="text-white/70 text-sm mt-1">
                                  This achievement will be saved to your profile and used in future modules 
                                  to build your 30-second introduction and interview answers.
                                </p>
                              </div>
                            </div>
                          </Card>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-white/50 text-sm">
                            {selectedStoryIndex !== null ? 'Story selected' : 'Select your strongest story'}
                          </p>
                          <Button
                            onClick={() => completeActivity(4)}
                            disabled={!canCompleteActivity(4)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                          >
                            Completar Actividad
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Module Completion */}
        {completedSteps.length === ACTIVITIES.length && (
          <Card className="rounded-[2px] bg-gradient-to-r from-[rgba(170,70,170,0.2)] to-[rgba(80,160,170,0.2)] border-[rgba(170,70,170,0.4)] p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center mx-auto">
              <Gem className="w-8 h-8 text-[rgb(200,130,200)]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Value Mining Complete!</h3>
            <p className="text-white/70 max-w-md mx-auto">
              You&apos;ve discovered the hidden value in your experience and created {achievements.filter(a => a.title).length} achievement stories. 
              Your strongest story is saved for future modules.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)] text-lg px-4 py-2">
                +{MODULE_XP} XP
              </Badge>
            </div>
            <Button 
              onClick={handleComplete} 
              className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] px-8 py-3 text-lg"
            >
              Continue to Estudio Constructor de CV
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
