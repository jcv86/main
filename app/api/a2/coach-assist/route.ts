import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const coachSchema = z.object({
  suggestion: z.string().describe('Coaching suggestion to improve the answer'),
  tips: z.array(z.string()).describe('Actionable tips for better response')
})

export async function POST(request: NextRequest) {
  try {
    const { question, currentAnswer } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Generate coaching assistance using Claude
    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: coachSchema,
      prompt: `You are an expert career coach helping someone develop their professional vision and career plan in Spanish.

Question they're answering: "${question}"

${currentAnswer ? `Their current answer: "${currentAnswer}"` : 'No answer provided yet'}

Provide coaching guidance to help them craft a better, more impactful response. Include:
1. A brief suggestion (2-3 sentences) highlighting what to focus on
2. 2-3 specific actionable tips to improve their answer

Respond in Spanish. Keep it concise and actionable.`,
    })

    return NextResponse.json({
      suggestion: result.object.suggestion,
      tips: result.object.tips
    })
  } catch (error) {
    console.error('[v0] Coach assist error:', error)
    return NextResponse.json(
      { error: 'Failed to generate coaching assistance' },
      { status: 500 }
    )
  }
}
