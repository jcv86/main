import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/a2/improve-intro
 * Coaching API - Improves professional intro text
 * MVP: Returns structured improvements (ready for OpenAI integration)
 */
export async function POST(request: NextRequest) {
  try {
    const { versionA, versionB, selectedVersion, userContext } = await request.json()

    if (!versionA || !versionB || !selectedVersion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const selectedText = selectedVersion === 'a' ? versionA : versionB

    // MVP: Provide structured coaching response
    const improvement = `
**Improvements for Your Introduction:**

1. **Add Specificity**: Include concrete achievements or metrics that demonstrate impact
   - Current: Generic description
   - Suggested: Include 1-2 quantifiable results (e.g., "Led X% growth", "Managed $Y budget")

2. **Highlight Unique Value**: Make it clear what differentiates you
   - Current: Standard professional language
   - Suggested: Lead with your key differentiator or specialization

3. **Make it Memorable**: Add a personal touch while staying professional
   - Current: Formal tone
   - Suggested: Include a brief insight about your approach or passion

**Suggested Revision:**
"${selectedText} [with added metrics, unique angle, and personal touch]"

This revision would work great for both casual conversations and professional settings.
`

    return NextResponse.json({
      success: true,
      improvement,
      selectedVersion,
      tips: [
        'Use power verbs (Led, Transformed, Accelerated)',
        'Include numbers/metrics when possible',
        'Keep it to 2-3 sentences max',
        'Practice saying it out loud for flow',
      ],
    })
  } catch (error) {
    console.error('[v0] Error improving intro:', error)
    return NextResponse.json({ error: 'Failed to improve introduction' }, { status: 500 })
  }
}

