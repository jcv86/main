import { generateText } from 'ai'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { role, environment, desiredOutcome } = body

    if (!role || !environment || !desiredOutcome) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from demo auth
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')
    
    if (!demoUserCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Use AI to enhance the vision with generateText and JSON parsing
    const { text } = await generateText({
      model: 'anthropic/claude-3-5-sonnet-20241022',
      prompt: `You are a career coach helping someone define their professional vision. 
      
The user has provided these initial thoughts:
- Professional role/title: ${role}
- Ideal environment: ${environment}
- Desired outcome in 30 days: ${desiredOutcome}

Please enhance and refine these statements to be more specific, actionable, and inspiring. 
Make them more concrete and aligned with career development best practices.
Keep the core intent but improve clarity, specificity, and achievability.

Respond ONLY with valid JSON in this exact format (no other text):
{
  "role": "<enhanced role/title>",
  "environment": "<enhanced environment description>",
  "desiredOutcome": "<enhanced desired outcome>",
  "reasoning": "<brief reasoning for enhancements>"
}`,
      temperature: 0.7,
    })

    // Parse JSON response
    let object
    try {
      object = JSON.parse(text)
    } catch (parseError) {
      console.error('[v0] Failed to parse enhancement response:', text)
      // Return original values if parsing fails
      object = {
        role,
        environment,
        desiredOutcome,
        reasoning: 'Enhancement service temporarily unavailable',
      }
    }

    return NextResponse.json({
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
    return NextResponse.json(
      { error: 'Failed to enhance vision' },
      { status: 500 }
    )
  }
}
