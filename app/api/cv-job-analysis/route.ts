import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { cvData, jobDescription, jobTitle, company } = body

    if (!cvData || !jobDescription) {
      return NextResponse.json({ error: "CV data and job description are required" }, { status: 400 })
    }

    // Simulate job compatibility analysis
    const analysis = await analyzeJobCompatibility(cvData, jobDescription, jobTitle, company)

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("cv_job_analyses")
      .insert({
        user_id: user.id,
        cv_data: cvData,
        job_description: jobDescription,
        job_title: jobTitle,
        company: company,
        analysis_results: analysis,
        compatibility_score: analysis.overallScore,
      })
      .select()
      .single()

    if (saveError) {
      console.error("Error saving analysis:", saveError)
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: savedAnalysis.id,
        analysis: analysis,
      },
    })
  } catch (error) {
    console.error("Job analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const { data: analyses, error } = await supabase
      .from("cv_job_analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching analyses:", error)
      return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: analyses,
    })
  } catch (error) {
    console.error("Error fetching job analyses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function analyzeJobCompatibility(cvData: any, jobDescription: string, jobTitle?: string, company?: string) {
  // Extract skills from CV
  const cvSkills = cvData.skills?.map((skill: any) => skill.name.toLowerCase()) || []
  const cvExperience = cvData.experience || []
  const cvEducation = cvData.education || []

  // Simulate job requirements extraction (in real app, this would use NLP)
  const jobRequirements = extractJobRequirements(jobDescription)

  // Calculate skill matches
  const skillMatches = jobRequirements.skills.filter((skill: string) =>
    cvSkills.some((cvSkill: string) => cvSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cvSkill)),
  )

  const missingSkills = jobRequirements.skills.filter(
    (skill: string) =>
      !cvSkills.some(
        (cvSkill: string) => cvSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cvSkill),
      ),
  )

  // Calculate experience relevance
  const relevantExperience = cvExperience.filter((exp: any) =>
    jobRequirements.keywords.some(
      (keyword: string) =>
        exp.description?.toLowerCase().includes(keyword.toLowerCase()) ||
        exp.jobTitle?.toLowerCase().includes(keyword.toLowerCase()),
    ),
  )

  // Calculate education relevance
  const relevantEducation = cvEducation.filter((edu: any) =>
    jobRequirements.education.some(
      (reqEdu: string) =>
        edu.degree?.toLowerCase().includes(reqEdu.toLowerCase()) ||
        edu.institution?.toLowerCase().includes(reqEdu.toLowerCase()),
    ),
  )

  // Calculate overall compatibility score
  const skillScore = (skillMatches.length / Math.max(jobRequirements.skills.length, 1)) * 40
  const experienceScore = Math.min((relevantExperience.length / Math.max(cvExperience.length, 1)) * 30, 30)
  const educationScore = relevantEducation.length > 0 ? 20 : 10
  const keywordScore = calculateKeywordScore(cvData, jobRequirements.keywords) * 10

  const overallScore = Math.round(skillScore + experienceScore + educationScore + keywordScore)

  return {
    overallScore: Math.min(overallScore, 100),
    skillMatches: skillMatches,
    missingSkills: missingSkills,
    relevantExperience: relevantExperience.map((exp: any) => ({
      title: exp.jobTitle,
      company: exp.company,
      relevance: "Alta",
    })),
    educationMatch: relevantEducation.length > 0,
    recommendations: generateRecommendations(skillMatches, missingSkills, relevantExperience),
    atsScore: calculateATSScore(cvData, jobRequirements),
    improvementAreas: identifyImprovementAreas(cvData, jobRequirements),
  }
}

function extractJobRequirements(jobDescription: string) {
  // Simulate job requirements extraction
  const commonSkills = [
    "javascript",
    "react",
    "node.js",
    "python",
    "java",
    "sql",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "agile",
    "scrum",
    "leadership",
    "communication",
    "teamwork",
    "problem solving",
  ]

  const commonEducation = ["engineering", "computer science", "information technology", "business", "marketing"]

  const commonKeywords = [
    "development",
    "software",
    "web",
    "mobile",
    "database",
    "api",
    "frontend",
    "backend",
    "fullstack",
    "devops",
    "cloud",
    "security",
  ]

  // Extract skills mentioned in job description
  const skills = commonSkills.filter((skill) => jobDescription.toLowerCase().includes(skill))

  // Extract education requirements
  const education = commonEducation.filter((edu) => jobDescription.toLowerCase().includes(edu))

  // Extract keywords
  const keywords = commonKeywords.filter((keyword) => jobDescription.toLowerCase().includes(keyword))

  return {
    skills: skills.slice(0, 8), // Limit to top 8 skills
    education: education.slice(0, 3),
    keywords: keywords.slice(0, 10),
  }
}

function calculateKeywordScore(cvData: any, keywords: string[]): number {
  const cvText = JSON.stringify(cvData).toLowerCase()
  const matchingKeywords = keywords.filter((keyword) => cvText.includes(keyword.toLowerCase()))
  return matchingKeywords.length / Math.max(keywords.length, 1)
}

function calculateATSScore(cvData: any, jobRequirements: any): number {
  let score = 0

  // Check for standard sections
  if (cvData.personalInfo?.fullName) score += 10
  if (cvData.personalInfo?.email) score += 10
  if (cvData.personalInfo?.phone) score += 10
  if (cvData.experience?.length > 0) score += 20
  if (cvData.education?.length > 0) score += 15
  if (cvData.skills?.length > 0) score += 15

  // Check for keyword density
  const keywordScore = calculateKeywordScore(cvData, jobRequirements.keywords) * 20

  return Math.min(score + keywordScore, 100)
}

function generateRecommendations(skillMatches: string[], missingSkills: string[], relevantExperience: any[]) {
  const recommendations = []

  if (missingSkills.length > 0) {
    recommendations.push({
      type: "skills",
      priority: "high",
      message: `Considera agregar estas habilidades faltantes: ${missingSkills.slice(0, 3).join(", ")}`,
    })
  }

  if (relevantExperience.length === 0) {
    recommendations.push({
      type: "experience",
      priority: "high",
      message: "Destaca más experiencia relevante para este rol en tu CV",
    })
  }

  if (skillMatches.length > 0) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      message: `Destaca más estas habilidades que coinciden: ${skillMatches.slice(0, 3).join(", ")}`,
    })
  }

  recommendations.push({
    type: "formatting",
    priority: "low",
    message: "Asegúrate de usar palabras clave del puesto en tu resumen profesional",
  })

  return recommendations
}

function identifyImprovementAreas(cvData: any, jobRequirements: any) {
  const areas = []

  if (!cvData.personalInfo?.summary) {
    areas.push("Agregar resumen profesional")
  }

  if (cvData.skills?.length < 5) {
    areas.push("Expandir sección de habilidades")
  }

  if (cvData.experience?.length === 0) {
    areas.push("Incluir experiencia laboral")
  }

  if (!cvData.projects || cvData.projects.length === 0) {
    areas.push("Agregar proyectos relevantes")
  }

  return areas
}
