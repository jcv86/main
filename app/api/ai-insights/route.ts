import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { type, data, model = "gpt-4" } = await request.json()

    let prompt = ""
    let systemPrompt =
      "You are an expert career development coach and psychologist. Provide detailed, actionable insights based on the assessment data provided."

    switch (type) {
      case "personality_analysis":
        systemPrompt =
          "You are an expert psychologist specializing in personality assessment and career development. Analyze the Big Five personality results and provide comprehensive insights."
        prompt = `
Analyze the following personality assessment results and provide detailed insights:

Test Type: ${data.test_type}
Personality Traits:
- Openness: ${data.traits.openness}%
- Conscientiousness: ${data.traits.conscientiousness}%
- Extraversion: ${data.traits.extraversion}%
- Agreeableness: ${data.traits.agreeableness}%
- Neuroticism: ${data.traits.neuroticism}%

Summary: ${data.summary}
Strengths: ${data.strengths.join(", ")}
Challenges: ${data.challenges.join(", ")}
Career Recommendations: ${data.career_recommendations.join(", ")}

Please provide:
1. Deep psychological insights about this personality profile
2. Specific career path recommendations with reasoning
3. Leadership style analysis
4. Potential blind spots and how to address them
5. Strategies for personal and professional growth
6. Team dynamics and collaboration insights

Write in Spanish and be comprehensive but concise (300-400 words).
        `
        break

      case "technical_skills_analysis":
        systemPrompt =
          "You are a senior technical recruiter and software engineering mentor. Analyze technical skills assessments and provide career guidance."
        prompt = `
Analyze the following technical skills assessment results:

Overall Score: ${data.overall_score}%
Career Level: ${data.career_level}

Skill Categories:
${Object.entries(data.skill_categories)
  .map(
    ([category, categoryData]: [string, any]) =>
      `${category}: ${categoryData.score}%\n${categoryData.skills.map((skill: any) => `  - ${skill.name}: ${skill.level}%`).join("\n")}`,
  )
  .join("\n\n")}

Strengths: ${data.strengths.join(", ")}
Improvement Areas: ${data.improvement_areas.join(", ")}

Please provide:
1. Technical career trajectory analysis
2. Market demand insights for these skills
3. Specific learning path recommendations
4. Salary expectations and growth potential
5. Industry-specific opportunities
6. Technology trends alignment
7. Portfolio project suggestions

Write in Spanish and be detailed but practical (350-450 words).
        `
        break

      case "soft_skills_analysis":
        systemPrompt =
          "You are an executive coach and organizational psychologist specializing in leadership development and soft skills assessment."
        prompt = `
Analyze the following soft skills assessment results:

Overall Score: ${data.overall_score}%
Leadership Potential: ${data.leadership_potential}
Team Fit: ${data.team_fit}

Skill Categories:
${Object.entries(data.skill_categories)
  .map(
    ([category, categoryData]: [string, any]) =>
      `${category}: ${categoryData.score}%\n${categoryData.skills.map((skill: any) => `  - ${skill.name}: ${skill.level}% - ${skill.feedback}`).join("\n")}`,
  )
  .join("\n\n")}

Strengths: ${data.strengths.join(", ")}
Improvement Areas: ${data.improvement_areas.join(", ")}

Please provide:
1. Leadership readiness assessment
2. Team role optimization insights
3. Communication style analysis
4. Emotional intelligence development plan
5. Career advancement strategies
6. Networking and relationship building advice
7. Executive presence development tips

Write in Spanish and focus on actionable insights (350-450 words).
        `
        break

      default:
        prompt = `Analyze the following assessment data and provide professional insights: ${JSON.stringify(data)}`
    }

    const { text } = await generateText({
      model: openai(model), // Use the specified model (defaults to gpt-4)
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 600,
    })

    return NextResponse.json({
      insights: text,
      model_used: model,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ error: "Failed to generate AI insights" }, { status: 500 })
  }
}
