import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface InterviewQuestion {
  questionNumber: number
  totalQuestions: number
  question: string
  category: 'behavioral' | 'technical' | 'situational' | 'cultural'
  expectedCompetencies: string[]
}

export interface InterviewAnswer {
  questionNumber: number
  question: string
  userAnswer: string
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  starAnalysis: {
    hasSituation: boolean
    hasTask: boolean
    hasAction: boolean
    hasResult: boolean
    completeness: number
  }
}

export interface InterviewSession {
  sessionId: string
  jobId: string
  jobTitle: string
  company: string
  startedAt: Date
  answers: InterviewAnswer[]
  currentQuestion: number
  totalQuestions: number
  status: 'in-progress' | 'completed'
}

const INTERVIEW_SYSTEM_PROMPT = `Eres un entrevistador profesional experto en selección de personal para roles en tech. 
Tu tarea es:
1. Hacer preguntas de entrevista desafiantes pero justas
2. Evaluar respuestas usando el método STAR (Situation, Task, Action, Result)
3. Proporcionar feedback constructivo en tiempo real
4. Generar preguntas dinámicas basadas en las respuestas anteriores

Mantén el tono profesional, empático pero directo. Responde en español.
Cada pregunta debe evaluar competencias clave para el rol.`

/**
 * Generate interview questions based on job description
 */
export async function generateInterviewQuestions(
  jobData: {
    title: string
    company: string
    description: string
    skills_required: string[]
    experience_years: number
  },
  numberOfQuestions: number = 5
): Promise<InterviewQuestion[]> {
  try {
    const prompt = `
Generate ${numberOfQuestions} realistic interview questions for a ${jobData.title} position at ${jobData.company}.

Job Requirements:
- Skills: ${jobData.skills_required.join(', ')}
- Experience: ${jobData.experience_years} years
- Description: ${jobData.description}

Generate questions that are:
1. Behavioral (evaluate past experience and problem-solving)
2. Technical (assess relevant skills)
3. Situational (problem-solving approach)
4. Cultural (fit with company values)

For each question, provide:
- The question
- Category (behavioral/technical/situational/cultural)
- Expected competencies (2-3 key skills to evaluate)

Format as JSON array with: [{ "question": "...", "category": "...", "competencies": [...] }]
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: INTERVIEW_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = response.choices[0]?.message?.content || '[]'
    
    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    // Format as InterviewQuestion array
    const questions: InterviewQuestion[] = parsed.map((q: any, idx: number) => ({
      questionNumber: idx + 1,
      totalQuestions: numberOfQuestions,
      question: q.question,
      category: q.category || 'behavioral',
      expectedCompetencies: q.competencies || q.expectedCompetencies || [],
    }))

    console.log(`[v0] Generated ${questions.length} interview questions`)
    return questions
  } catch (error) {
    console.error('[v0] Error generating questions:', error)
    throw error
  }
}

/**
 * Evaluate user answer using STAR method and LLM scoring
 */
export async function evaluateInterviewAnswer(
  question: InterviewQuestion,
  userAnswer: string
): Promise<InterviewAnswer> {
  try {
    const evaluationPrompt = `
Evalúa la siguiente respuesta de entrevista usando el método STAR (Situation, Task, Action, Result).

Pregunta: ${question.question}
Respuesta: ${userAnswer}

Proporciona tu evaluación en este formato JSON exacto:
{
  "score": <0-10>,
  "feedback": "<feedback general>",
  "strengths": ["<fortaleza 1>", "<fortaleza 2>"],
  "improvements": ["<mejora 1>", "<mejora 2>"],
  "starAnalysis": {
    "hasSituation": <true/false>,
    "hasTask": <true/false>,
    "hasAction": <true/false>,
    "hasResult": <true/false>
  },
  "reasoning": "<explicación del score>"
}

Criterios de Scoring:
- 9-10: Excelente respuesta con STAR completo, ejemplo específico, resultados cuantificables
- 7-8: Buena respuesta con la mayoría de STAR, algunos detalles específicos
- 5-6: Respuesta aceptable pero falta especificidad o completitud STAR
- 3-4: Respuesta débil, falta estructura o ejemplos concretos
- 0-2: Respuesta insuficiente, no aborda la pregunta
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: INTERVIEW_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      temperature: 0.5, // Lower temperature for consistent scoring
      max_tokens: 800,
    })

    const content = response.choices[0]?.message?.content || '{}'
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return {
      questionNumber: question.questionNumber,
      question: question.question,
      userAnswer,
      score: evaluation.score || 5,
      feedback: evaluation.feedback || 'Respuesta recibida',
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
      starAnalysis: evaluation.starAnalysis || {
        hasSituation: false,
        hasTask: false,
        hasAction: false,
        hasResult: false,
        completeness: 0,
      },
    }
  } catch (error) {
    console.error('[v0] Error evaluating answer:', error)
    throw error
  }
}

/**
 * Calculate interview final score and insights
 */
export function calculateInterviewScore(answers: InterviewAnswer[]): {
  finalScore: number
  averageScore: number
  categoryBreakdown: Record<string, number>
  strengths: string[]
  areasForImprovement: string[]
  recommendation: string
} {
  if (answers.length === 0) {
    return {
      finalScore: 0,
      averageScore: 0,
      categoryBreakdown: {},
      strengths: [],
      areasForImprovement: [],
      recommendation: 'Completa la entrevista para obtener resultados',
    }
  }

  const scores = answers.map(a => a.score)
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const finalScore = Math.round(averageScore * 10)

  // Aggregate strengths and improvements
  const allStrengths = answers.flatMap(a => a.strengths)
  const allImprovements = answers.flatMap(a => a.improvements)

  // Find most common themes
  const strengthCounts: Record<string, number> = {}
  allStrengths.forEach(s => {
    strengthCounts[s] = (strengthCounts[s] || 0) + 1
  })
  const topStrengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s]) => s)

  const improvementCounts: Record<string, number> = {}
  allImprovements.forEach(i => {
    improvementCounts[i] = (improvementCounts[i] || 0) + 1
  })
  const topImprovements = Object.entries(improvementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([i]) => i)

  // Generate recommendation
  let recommendation = ''
  if (averageScore >= 8) {
    recommendation = 'Excelente desempeño. Estás muy preparado para esta entrevista.'
  } else if (averageScore >= 7) {
    recommendation = 'Buen desempeño. Con pequeñas mejoras estarás listo.'
  } else if (averageScore >= 6) {
    recommendation = 'Desempeño aceptable. Enfócate en las áreas de mejora.'
  } else {
    recommendation = 'Considera practicar más. Trabaja en la estructura STAR de tus respuestas.'
  }

  return {
    finalScore,
    averageScore,
    categoryBreakdown: {},
    strengths: topStrengths,
    areasForImprovement: topImprovements,
    recommendation,
  }
}

/**
 * Generate next follow-up question based on previous answer
 */
export async function generateFollowUpQuestion(
  originalQuestion: InterviewQuestion,
  userAnswer: string,
  evaluation: InterviewAnswer
): Promise<InterviewQuestion | null> {
  if (evaluation.score >= 8) {
    // If answer was good, ask a related but more challenging question
    try {
      const followUpPrompt = `
Basándote en esta respuesta exitosa, genera una pregunta de seguimiento más desafiante sobre el mismo tema:

Pregunta Original: ${originalQuestion.question}
Respuesta: ${userAnswer}

La nueva pregunta debe:
1. Construir sobre la respuesta dada
2. Ser más profunda o técnica
3. Desafiar al candidato a pensar más

Responde SOLO con la nueva pregunta, sin explicaciones adicionales.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un entrevistador experto. Genera preguntas de seguimiento desafiantes.',
          },
          {
            role: 'user',
            content: followUpPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      })

      const followUpQuestion = response.choices[0]?.message?.content || ''

      return {
        questionNumber: originalQuestion.questionNumber + 1,
        totalQuestions: originalQuestion.totalQuestions + 1,
        question: followUpQuestion,
        category: 'behavioral',
        expectedCompetencies: originalQuestion.expectedCompetencies,
      }
    } catch (error) {
      console.error('[v0] Error generating follow-up:', error)
      return null
    }
  }

  return null
}
