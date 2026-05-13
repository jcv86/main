import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { cookies } from 'next/headers'

const EnhancedVisionSchema = z.object({
  role: z.string().describe('Enhanced professional role/title'),
  environment: z.string().describe('Enhanced ideal environment description'),
  desiredOutcome: z.string().describe('Enhanced desired outcome after 30 days'),
  reasoning: z.string().describe('Brief reasoning for the enhancements'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { role, environment, desiredOutcome } = body

    if (!role || !environment || !desiredOutcome) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from demo auth
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')
    
    if (!demoUserCookie) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Use AI to enhance the vision
    const { object } = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: EnhancedVisionSchema,
      prompt: `You are a career coach helping someone define their professional vision. 
      
The user has provided these initial thoughts:
- Professional role/title: ${role}
- Ideal environment: ${environment}
- Desired outcome in 30 days: ${desiredOutcome}

Please enhance and refine these statements to be more specific, actionable, and inspiring. 
Make them more concrete and aligned with career development best practices.
Keep the core intent but improve clarity, specificity, and achievability.`,
      temperature: 0.7,
    })

    return Response.json({
      success: true,
      enhanced: {
        role: object.role,
        environment: object.environment,
        desiredOutcome: object.desiredOutcome,
        reasoning: object.reasoning,
      },
    })
  } catch (error) {
    console.error('[v0] Coach enhance error:', error)
    return Response.json(
      { error: 'Failed to enhance vision' },
      { status: 500 }
    )
  }
}
