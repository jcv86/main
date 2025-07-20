"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Building,
  MapPin,
  DollarSign,
  Zap,
  Brain,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JobTargetedPracticeProps {
  selectedJob: any
  userSkills: any[]
  onSkillsSelected: (skills: string[]) => void
  onPracticeModeSelected: (mode: string) => void
  onStartPractice: () => void
}

export function JobTargetedPractice({
  selectedJob,
  userSkills,
  onSkillsSelected,
  onPracticeModeSelected,
  onStartPractice,
}: JobTargetedPracticeProps) {
  const { toast } = useToast()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [practiceMode, setPracticeMode] = useState<string>("comprehensive")
  const [jobReadinessScore, setJobReadinessScore] = useState<number>(0)

  useEffect(() => {
    if (selectedJob) {
      calculateJobReadiness()
      autoSelectCriticalSkills()
    }
  }, [selectedJob, userSkills])

  const calculateJobReadiness = () => {
    if (!selectedJob || !userSkills.length) return

    try {
      const requiredSkills = selectedJob.requirements || []
      const matchingSkills = requiredSkills.filter((req: string) =>
        userSkills.some(
          (skill) =>
            skill.name.toLowerCase().includes(req.toLowerCase()) ||
            req.toLowerCase().includes(skill.name.toLowerCase()),
        ),
      )

      const skillLevels = matchingSkills.map((req: string) => {
        const userSkill = userSkills.find(
          (skill) =>
            skill.name.toLowerCase().includes(req.toLowerCase()) ||
            req.toLowerCase().includes(skill.name.toLowerCase()),
        )
        return userSkill?.level || 0
      })

      const averageLevel =
        skillLevels.length > 0 ? skillLevels.reduce((sum, level) => sum + level, 0) / skillLevels.length : 0

      const coverageScore = requiredSkills.length > 0 ? (matchingSkills.length / requiredSkills.length) * 100 : 0
      const proficiencyScore = averageLevel
      const readinessScore = coverageScore * 0.6 + proficiencyScore * 0.4

      setJobReadinessScore(Math.round(readinessScore))
    } catch (error) {
      console.error("Error calculating job readiness:", error)
      setJobReadinessScore(0)
    }
  }

  const autoSelectCriticalSkills = () => {
    if (!selectedJob) return

    try {
      const criticalSkills = selectedJob.skillsGap || []
      const weakSkills =
        selectedJob.requirements?.filter((req: string) => {
          const userSkill = userSkills.find(
            (skill) =>
              skill.name.toLowerCase().includes(req.toLowerCase()) ||
              req.toLowerCase().includes(skill.name.toLowerCase()),
          )
          return userSkill && userSkill.level < 70
        }) || []

      const skillsToSelect = [...new Set([...criticalSkills, ...weakSkills])].slice(0, 5)
      setSelectedSkills(skillsToSelect)
      onSkillsSelected(skillsToSelect)

      if (skillsToSelect.length > 0) {
        const recommendedMode = weakSkills.length > 2 ? "weak-areas" : "comprehensive"
        setPracticeMode(recommendedMode)
        onPracticeModeSelected(recommendedMode)
      }
    } catch (error) {
      console.error("Error auto-selecting skills:", error)
    }
  }

  const toggleSkillSelection = (skillName: string) => {
    const newSelection = selectedSkills.includes(skillName)
      ? selectedSkills.filter((s) => s !== skillName)
      : [...selectedSkills, skillName].slice(0, 6)

    setSelectedSkills(newSelection)
    onSkillsSelected(newSelection)
  }

  const getSkillStatus = (skillName: string) => {
    const userSkill = userSkills.find(
      (skill) =>
        skill.name.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(skill.name.toLowerCase()),
    )

    if (!userSkill) {
      return { level: 0, status: "missing", color: "bg-red-100 text-red-800 border-red-200" }
    }

    if (userSkill.level >= 80) {
      return { level: userSkill.level, status: "strong", color: "bg-green-100 text-green-800 border-green-200" }
    } else if (userSkill.level >= 60) {
      return { level: userSkill.level, status: "adequate", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    } else {
      return { level: userSkill.level, status: "weak", color: "bg-orange-100 text-orange-800 border-orange-200" }
    }
  }

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getReadinessMessage = (score: number) => {
    if (score >= 80) return "You're well-prepared for this role!"
    if (score >= 60) return "Good foundation, some practice needed"
    return "Significant preparation required"
  }

  if (!selectedJob) return null

  return (
    <div className="space-y-6">
      {/* Job Overview */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Preparing for: {selectedJob.title}</span>
          </CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>{selectedJob.company}</span>
              </div>
              {selectedJob.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedJob.location}</span>
                </div>
              )}
              {selectedJob.salary && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{selectedJob.salary}</span>
                </div>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Job Readiness Score
              </h3>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getReadinessColor(jobReadinessScore)} mb-2`}>
                  {jobReadinessScore}%
                </div>
                <Progress value={jobReadinessScore} className="h-3 mb-2" />
                <p className={`text-sm font-medium ${getReadinessColor(jobReadinessScore)}`}>
                  {getReadinessMessage(jobReadinessScore)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Required Skills:</span>
                  <span className="font-medium">{selectedJob.requirements?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Matches:</span>
                  <span className="font-medium text-green-600">{selectedJob.skillsMatch?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Skills to Develop:</span>
                  <span className="font-medium text-orange-600">{selectedJob.skillsGap?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Match:</span>
                  <span className="font-medium">{selectedJob.matchScore || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-600" />
            Skills Analysis & Practice Selection
          </CardTitle>
          <CardDescription>
            Select skills to practice for this specific role. Critical and weak skills are pre-selected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Practice Mode Selection */}
            <div>
              <h3 className="font-medium mb-3">Practice Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    mode: "comprehensive",
                    title: "Comprehensive Review",
                    description: "Cover all selected skills broadly",
                    icon: TrendingUp,
                    color: "border-blue-500 bg-blue-50",
                  },
                  {
                    mode: "weak-areas",
                    title: "Focus on Gaps",
                    description: "Intensive practice on weak skills",
                    icon: AlertCircle,
                    color: "border-orange-500 bg-orange-50",
                  },
                  {
                    mode: "focused",
                    title: "Deep Dive",
                    description: "Thorough exploration of each skill",
                    icon: Target,
                    color: "border-green-500 bg-green-50",
                  },
                ].map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => {
                      setPracticeMode(option.mode)
                      onPracticeModeSelected(option.mode)
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      practiceMode === option.mode ? option.color : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <option.icon className="w-5 h-5 mr-2" />
                      <span className="font-medium">{option.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div>
              <h3 className="font-medium mb-3">Required Skills for This Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(selectedJob.requirements || []).map((skillName: string, index: number) => {
                  const skillStatus = getSkillStatus(skillName)
                  const isSelected = selectedSkills.includes(skillName)

                  return (
                    <div
                      key={index}
                      onClick={() => toggleSkillSelection(skillName)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{skillName}</h4>
                        <Badge className={`text-xs ${skillStatus.color}`}>
                          {skillStatus.status === "missing"
                            ? "Missing"
                            : skillStatus.status === "strong"
                              ? "Strong"
                              : skillStatus.status === "adequate"
                                ? "Good"
                                : "Weak"}
                        </Badge>
                      </div>

                      {skillStatus.level > 0 && (
                        <>
                          <Progress value={skillStatus.level} className="h-2 mb-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{skillStatus.level}% proficiency</span>
                            {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                          </div>
                        </>
                      )}

                      {skillStatus.level === 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-red-500">Not in your profile</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Skills Summary */}
            {selectedSkills.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Selected for Practice ({selectedSkills.length}/6)</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button onClick={onStartPractice} size="lg" disabled={selectedSkills.length === 0} className="px-8">
          <Zap className="mr-2 h-5 w-5" />
          Start Job-Specific Practice
        </Button>
      </div>
    </div>
  )
}
