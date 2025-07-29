import { createClient } from "@/lib/supabase-server"

export interface InterviewQuestion {
  id: string
  question: string
  type: "behavioral" | "technical" | "situational" | "competency"
  difficulty: "entry" | "mid" | "senior" | "executive"
  category: string
  expectedDuration: number
  followUpQuestions?: string[]
  evaluationCriteria: string[]
}

export interface InterviewSession {
  id: string
  userId: string
  jobTitle: string
  company: string
  interviewType: "hr_general" | "technical" | "behavioral" | "leadership" | "case_study"
  difficulty: "entry" | "mid" | "senior" | "executive"
  overallScore?: number
  status: "setup" | "pre_assessment" | "active" | "paused" | "completed"
  preAssessment?: PreAssessment
  feedback?: InterviewFeedback
  questions: InterviewQuestion[]
  responses: InterviewResponse[]
  createdAt: string
  completedAt?: string
}

export interface PreAssessment {
  environment: {
    lighting: "poor" | "adequate" | "good" | "excellent"
    audio: "poor" | "adequate" | "good" | "excellent"
    background: "distracting" | "neutral" | "professional"
    internetConnection: "poor" | "adequate" | "good" | "excellent"
  }
  preparation: {
    resumeReviewed: boolean
    companyResearched: boolean
    questionsPrepped: boolean
    technicalSetup: boolean
  }
  confidence: number // 1-10 scale
  experience: "first_time" | "some_experience" | "experienced" | "expert"
  concerns: string[]
}

export interface InterviewResponse {
  questionId: string
  response: string
  duration: number
  confidence: number
  audioAnalysis?: AudioAnalysis
  videoAnalysis?: VideoAnalysis
  contentAnalysis?: ContentAnalysis
  timestamp: string
}

export interface AudioAnalysis {
  clarity: number
  pace: number
  volume: number
  fillerWords: number
  pauseAnalysis: {
    appropriatePauses: number
    awkwardSilences: number
    averagePauseLength: number
  }
  emotionalTone: "confident" | "nervous" | "enthusiastic" | "monotone" | "professional"
}

export interface VideoAnalysis {
  eyeContact: number
  posture: "poor" | "adequate" | "good" | "excellent"
  facialExpressions: "appropriate" | "limited" | "excessive" | "neutral"
  handGestures: "none" | "minimal" | "appropriate" | "excessive"
  professionalAppearance: boolean
  backgroundDistraction: boolean
}

export interface ContentAnalysis {
  relevance: number
  structure: number
  starMethodUsage: boolean
  keywordsUsed: string[]
  technicalAccuracy?: number
  examplesProvided: number
  quantifiableResults: boolean
  communicationClarity: number
}

export interface InterviewFeedback {
  overallScore: number
  strengths: string[]
  areasForImprovement: string[]
  detailedFeedback: {
    communication: {
      score: number
      feedback: string
      suggestions: string[]
    }
    technicalKnowledge: {
      score: number
      feedback: string
      suggestions: string[]
    }
    problemSolving: {
      score: number
      feedback: string
      suggestions: string[]
    }
    culturalFit: {
      score: number
      feedback: string
      suggestions: string[]
    }
  }
  nextSteps: string[]
  practiceRecommendations: string[]
}

export class InterviewSimulator {
  private supabase = createClient()

  async createSession(sessionData: Partial<InterviewSession>): Promise<InterviewSession> {
    const { data, error } = await this.supabase
      .from("interview_sessions")
      .insert({
        user_id: sessionData.userId,
        job_title: sessionData.jobTitle,
        company: sessionData.company,
        interview_type: sessionData.interviewType,
        difficulty: sessionData.difficulty,
        session_status: "setup",
        questions: JSON.stringify(sessionData.questions || []),
        responses: JSON.stringify([]),
      })
      .select()
      .single()

    if (error) throw error
    return this.mapDbToSession(data)
  }

  async getSession(sessionId: string): Promise<InterviewSession | null> {
    const { data, error } = await this.supabase.from("interview_sessions").select("*").eq("id", sessionId).single()

    if (error) return null
    return this.mapDbToSession(data)
  }

  async updateSession(sessionId: string, updates: Partial<InterviewSession>): Promise<InterviewSession> {
    const updateData: any = {}

    if (updates.status) updateData.session_status = updates.status
    if (updates.overallScore) updateData.overall_score = updates.overallScore
    if (updates.preAssessment) updateData.pre_assessment = JSON.stringify(updates.preAssessment)
    if (updates.feedback) updateData.feedback = JSON.stringify(updates.feedback)
    if (updates.questions) updateData.questions = JSON.stringify(updates.questions)
    if (updates.responses) updateData.responses = JSON.stringify(updates.responses)
    if (updates.completedAt) updateData.completed_at = updates.completedAt

    const { data, error } = await this.supabase
      .from("interview_sessions")
      .update(updateData)
      .eq("id", sessionId)
      .select()
      .single()

    if (error) throw error
    return this.mapDbToSession(data)
  }

  async generateQuestions(
    jobTitle: string,
    company: string,
    interviewType: string,
    difficulty: string,
    count = 5,
  ): Promise<InterviewQuestion[]> {
    // This would integrate with Azure AI or OpenAI to generate contextual questions
    const baseQuestions = this.getBaseQuestions(interviewType, difficulty)

    // For now, return base questions with job-specific context
    return baseQuestions.slice(0, count).map((q) => ({
      ...q,
      question: q.question.replace("[JOB_TITLE]", jobTitle).replace("[COMPANY]", company),
    }))
  }

  async analyzeResponse(
    response: string,
    question: InterviewQuestion,
    audioData?: Blob,
    videoData?: Blob,
  ): Promise<{
    contentAnalysis: ContentAnalysis
    audioAnalysis?: AudioAnalysis
    videoAnalysis?: VideoAnalysis
  }> {
    // Content analysis using Azure Language Services
    const contentAnalysis = await this.analyzeContent(response, question)

    // Audio analysis using Azure Speech Services
    let audioAnalysis: AudioAnalysis | undefined
    if (audioData) {
      audioAnalysis = await this.analyzeAudio(audioData)
    }

    // Video analysis using Azure Computer Vision
    let videoAnalysis: VideoAnalysis | undefined
    if (videoData) {
      videoAnalysis = await this.analyzeVideo(videoData)
    }

    return {
      contentAnalysis,
      audioAnalysis,
      videoAnalysis,
    }
  }

  private async analyzeContent(response: string, question: InterviewQuestion): Promise<ContentAnalysis> {
    // Implement Azure Language Services integration
    const starMethodUsage = this.detectStarMethod(response)
    const keywordsUsed = this.extractKeywords(response, question.category)

    return {
      relevance: this.calculateRelevance(response, question),
      structure: this.analyzeStructure(response),
      starMethodUsage,
      keywordsUsed,
      examplesProvided: this.countExamples(response),
      quantifiableResults: this.hasQuantifiableResults(response),
      communicationClarity: this.assessClarity(response),
    }
  }

  private async analyzeAudio(audioData: Blob): Promise<AudioAnalysis> {
    // Implement Azure Speech Services integration
    return {
      clarity: 8,
      pace: 7,
      volume: 8,
      fillerWords: 3,
      pauseAnalysis: {
        appropriatePauses: 5,
        awkwardSilences: 1,
        averagePauseLength: 2.5,
      },
      emotionalTone: "confident",
    }
  }

  private async analyzeVideo(videoData: Blob): Promise<VideoAnalysis> {
    // Implement Azure Computer Vision integration
    return {
      eyeContact: 8,
      posture: "good",
      facialExpressions: "appropriate",
      handGestures: "appropriate",
      professionalAppearance: true,
      backgroundDistraction: false,
    }
  }

  private detectStarMethod(response: string): boolean {
    const starKeywords = {
      situation: ["situation", "context", "background", "scenario"],
      task: ["task", "responsibility", "objective", "goal"],
      action: ["action", "did", "implemented", "executed", "performed"],
      result: ["result", "outcome", "achievement", "impact", "success"],
    }

    const categories = Object.keys(starKeywords)
    let foundCategories = 0

    categories.forEach((category) => {
      const keywords = starKeywords[category as keyof typeof starKeywords]
      const found = keywords.some((keyword) => response.toLowerCase().includes(keyword.toLowerCase()))
      if (found) foundCategories++
    })

    return foundCategories >= 3 // At least 3 out of 4 STAR components
  }

  private extractKeywords(response: string, category: string): string[] {
    // Simple keyword extraction - in production, use Azure Text Analytics
    const words = response.toLowerCase().split(/\W+/)
    const relevantWords = words.filter((word) => word.length > 3)
    return relevantWords.slice(0, 10)
  }

  private calculateRelevance(response: string, question: InterviewQuestion): number {
    // Simple relevance calculation - in production, use semantic similarity
    const responseWords = response.toLowerCase().split(/\W+/)
    const questionWords = question.question.toLowerCase().split(/\W+/)

    const commonWords = responseWords.filter((word) => questionWords.includes(word) && word.length > 3)

    return Math.min(10, (commonWords.length / questionWords.length) * 10)
  }

  private analyzeStructure(response: string): number {
    const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const hasIntro = sentences.length > 0
    const hasBody = sentences.length > 2
    const hasConclusion =
      response.toLowerCase().includes("therefore") ||
      response.toLowerCase().includes("in conclusion") ||
      response.toLowerCase().includes("overall")

    let score = 0
    if (hasIntro) score += 3
    if (hasBody) score += 4
    if (hasConclusion) score += 3

    return score
  }

  private countExamples(response: string): number {
    const exampleIndicators = [
      "for example",
      "for instance",
      "such as",
      "like when",
      "in my experience",
      "at my previous job",
      "when I worked",
    ]

    return exampleIndicators.reduce((count, indicator) => {
      return count + (response.toLowerCase().includes(indicator) ? 1 : 0)
    }, 0)
  }

  private hasQuantifiableResults(response: string): boolean {
    const numberPattern = /\d+(\.\d+)?(%|percent|million|thousand|k|m|$|dollars|euros)/i
    return numberPattern.test(response)
  }

  private assessClarity(response: string): number {
    const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgSentenceLength = response.length / sentences.length

    // Optimal sentence length is around 15-20 words
    const optimalLength = 100 // characters
    const lengthScore = Math.max(0, 10 - Math.abs(avgSentenceLength - optimalLength) / 10)

    return Math.min(10, lengthScore)
  }

  private getBaseQuestions(interviewType: string, difficulty: string): InterviewQuestion[] {
    const questions: Record<string, InterviewQuestion[]> = {
      behavioral: [
        {
          id: "1",
          question: "Tell me about a time when you had to work under pressure at [COMPANY]. How did you handle it?",
          type: "behavioral",
          difficulty: difficulty as any,
          category: "stress_management",
          expectedDuration: 180,
          evaluationCriteria: ["STAR method usage", "Problem-solving approach", "Stress management"],
        },
        {
          id: "2",
          question: "Describe a situation where you had to work with a difficult team member. How did you resolve it?",
          type: "behavioral",
          difficulty: difficulty as any,
          category: "teamwork",
          expectedDuration: 180,
          evaluationCriteria: ["Conflict resolution", "Communication skills", "Team collaboration"],
        },
      ],
      technical: [
        {
          id: "3",
          question: "How would you approach solving a performance issue in a [JOB_TITLE] role at [COMPANY]?",
          type: "technical",
          difficulty: difficulty as any,
          category: "problem_solving",
          expectedDuration: 300,
          evaluationCriteria: ["Technical knowledge", "Problem-solving methodology", "Best practices"],
        },
      ],
      hr_general: [
        {
          id: "4",
          question: "Why are you interested in the [JOB_TITLE] position at [COMPANY]?",
          type: "behavioral",
          difficulty: difficulty as any,
          category: "motivation",
          expectedDuration: 120,
          evaluationCriteria: ["Company research", "Role understanding", "Career alignment"],
        },
        {
          id: "5",
          question: "What are your greatest strengths and how would they benefit [COMPANY]?",
          type: "behavioral",
          difficulty: difficulty as any,
          category: "self_assessment",
          expectedDuration: 150,
          evaluationCriteria: ["Self-awareness", "Relevance to role", "Specific examples"],
        },
      ],
    }

    return questions[interviewType] || questions.hr_general
  }

  private mapDbToSession(data: any): InterviewSession {
    return {
      id: data.id,
      userId: data.user_id,
      jobTitle: data.job_title,
      company: data.company,
      interviewType: data.interview_type,
      difficulty: data.difficulty,
      overallScore: data.overall_score,
      status: data.session_status,
      preAssessment: data.pre_assessment ? JSON.parse(data.pre_assessment) : undefined,
      feedback: data.feedback ? JSON.parse(data.feedback) : undefined,
      questions: data.questions ? JSON.parse(data.questions) : [],
      responses: data.responses ? JSON.parse(data.responses) : [],
      createdAt: data.created_at,
      completedAt: data.completed_at,
    }
  }

  async generateFeedback(session: InterviewSession): Promise<InterviewFeedback> {
    const responses = session.responses
    const questions = session.questions

    // Calculate overall scores
    const communicationScore = this.calculateCommunicationScore(responses)
    const technicalScore = this.calculateTechnicalScore(responses, questions)
    const problemSolvingScore = this.calculateProblemSolvingScore(responses)
    const culturalFitScore = this.calculateCulturalFitScore(responses)

    const overallScore = Math.round((communicationScore + technicalScore + problemSolvingScore + culturalFitScore) / 4)

    return {
      overallScore,
      strengths: this.identifyStrengths(responses),
      areasForImprovement: this.identifyImprovements(responses),
      detailedFeedback: {
        communication: {
          score: communicationScore,
          feedback: this.generateCommunicationFeedback(responses),
          suggestions: this.getCommunicationSuggestions(responses),
        },
        technicalKnowledge: {
          score: technicalScore,
          feedback: this.generateTechnicalFeedback(responses, questions),
          suggestions: this.getTechnicalSuggestions(responses),
        },
        problemSolving: {
          score: problemSolvingScore,
          feedback: this.generateProblemSolvingFeedback(responses),
          suggestions: this.getProblemSolvingSuggestions(responses),
        },
        culturalFit: {
          score: culturalFitScore,
          feedback: this.generateCulturalFitFeedback(responses),
          suggestions: this.getCulturalFitSuggestions(responses),
        },
      },
      nextSteps: this.generateNextSteps(overallScore, responses),
      practiceRecommendations: this.generatePracticeRecommendations(responses),
    }
  }

  private calculateCommunicationScore(responses: InterviewResponse[]): number {
    if (responses.length === 0) return 0

    const scores = responses.map((r) => r.contentAnalysis?.communicationClarity || 0)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private calculateTechnicalScore(responses: InterviewResponse[], questions: InterviewQuestion[]): number {
    const technicalResponses = responses.filter((_, i) => questions[i]?.type === "technical")

    if (technicalResponses.length === 0) return 7 // Default for non-technical interviews

    const scores = technicalResponses.map((r) => r.contentAnalysis?.technicalAccuracy || 0)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private calculateProblemSolvingScore(responses: InterviewResponse[]): number {
    if (responses.length === 0) return 0

    const scores = responses.map((r) => r.contentAnalysis?.structure || 0)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private calculateCulturalFitScore(responses: InterviewResponse[]): number {
    if (responses.length === 0) return 0

    const scores = responses.map((r) => r.contentAnalysis?.relevance || 0)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private identifyStrengths(responses: InterviewResponse[]): string[] {
    const strengths: string[] = []

    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length
    if (avgConfidence > 7) strengths.push("High confidence level")

    const starUsage = responses.filter((r) => r.contentAnalysis?.starMethodUsage).length
    if (starUsage > responses.length * 0.6) strengths.push("Excellent use of STAR method")

    const examplesProvided = responses.reduce((sum, r) => sum + (r.contentAnalysis?.examplesProvided || 0), 0)
    if (examplesProvided > responses.length) strengths.push("Good use of specific examples")

    return strengths
  }

  private identifyImprovements(responses: InterviewResponse[]): string[] {
    const improvements: string[] = []

    const avgClarity =
      responses.reduce((sum, r) => sum + (r.contentAnalysis?.communicationClarity || 0), 0) / responses.length
    if (avgClarity < 6) improvements.push("Improve communication clarity")

    const starUsage = responses.filter((r) => r.contentAnalysis?.starMethodUsage).length
    if (starUsage < responses.length * 0.4) improvements.push("Use STAR method more consistently")

    const quantifiableResults = responses.filter((r) => r.contentAnalysis?.quantifiableResults).length
    if (quantifiableResults < responses.length * 0.3) improvements.push("Include more quantifiable results")

    return improvements
  }

  private generateCommunicationFeedback(responses: InterviewResponse[]): string {
    const avgClarity =
      responses.reduce((sum, r) => sum + (r.contentAnalysis?.communicationClarity || 0), 0) / responses.length

    if (avgClarity >= 8) {
      return "Excellent communication skills demonstrated throughout the interview."
    } else if (avgClarity >= 6) {
      return "Good communication with room for improvement in clarity and structure."
    } else {
      return "Communication needs improvement. Focus on clearer expression and better organization."
    }
  }

  private getCommunicationSuggestions(responses: InterviewResponse[]): string[] {
    return [
      "Practice the STAR method for behavioral questions",
      "Use specific examples to illustrate your points",
      "Maintain eye contact and confident body language",
      "Speak at a measured pace and avoid filler words",
    ]
  }

  private generateTechnicalFeedback(responses: InterviewResponse[], questions: InterviewQuestion[]): string {
    return "Technical knowledge appears solid with good problem-solving approach."
  }

  private getTechnicalSuggestions(responses: InterviewResponse[]): string[] {
    return [
      "Review core technical concepts for your field",
      "Practice explaining complex topics simply",
      "Prepare examples of technical challenges you've solved",
    ]
  }

  private generateProblemSolvingFeedback(responses: InterviewResponse[]): string {
    return "Shows good analytical thinking and structured approach to problems."
  }

  private getProblemSolvingSuggestions(responses: InterviewResponse[]): string[] {
    return [
      "Break down complex problems into smaller parts",
      "Explain your thought process step by step",
      "Consider multiple solutions before choosing one",
    ]
  }

  private generateCulturalFitFeedback(responses: InterviewResponse[]): string {
    return "Demonstrates good alignment with company values and culture."
  }

  private getCulturalFitSuggestions(responses: InterviewResponse[]): string[] {
    return [
      "Research company culture and values thoroughly",
      "Prepare examples that show cultural alignment",
      "Ask thoughtful questions about team dynamics",
    ]
  }

  private generateNextSteps(overallScore: number, responses: InterviewResponse[]): string[] {
    const steps: string[] = []

    if (overallScore >= 8) {
      steps.push("You're well-prepared! Focus on final preparations and confidence building.")
    } else if (overallScore >= 6) {
      steps.push("Good foundation. Practice specific areas identified for improvement.")
    } else {
      steps.push("Significant preparation needed. Consider additional practice sessions.")
    }

    steps.push("Schedule follow-up practice sessions")
    steps.push("Review company research and role requirements")

    return steps
  }

  private generatePracticeRecommendations(responses: InterviewResponse[]): string[] {
    return [
      "Practice more behavioral questions using STAR method",
      "Record yourself answering questions to improve delivery",
      "Research common questions for your specific role",
      "Practice with mock interviews in similar conditions",
    ]
  }
}

export const interviewSimulator = new InterviewSimulator()
